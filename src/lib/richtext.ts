import { bodyOf, htmlHeadings, htmlParagraphs } from './body'
import { slugify } from './slug'

export type Heading = { id: string; text: string; level: number }

const textOf = (n: any): string =>
  typeof n?.text === 'string' ? n.text : (n?.children || []).map(textOf).join('')

/** Collect h2–h4 headings from a Lexical document (replaces LuckyWP TOC). */
export function extractHeadings(data: any): Heading[] {
  if (typeof data === 'string') return htmlHeadings(data)
  const out: Heading[] = []
  const used = new Set<string>()
  const walk = (n: any) => {
    if (n?.type === 'heading' && ['h2', 'h3', 'h4'].includes(n.tag)) {
      const text = textOf(n).trim()
      if (text) {
        let id = slugify(text) || 'section'
        let i = 2
        while (used.has(id)) id = `${slugify(text)}-${i++}`
        used.add(id)
        out.push({ id, text, level: Number(n.tag[1]) })
      }
    }
    ;(n?.children || []).forEach(walk)
  }
  walk(data?.root)
  return out
}

/** Plain text of a Lexical document. */
export function plainText(node: any): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text + ' '
  return (node.children ?? node.root?.children ?? []).map(plainText).join('')
}

/** Auto description like Rank Math: first ~155 chars of the body text (paragraphs/lists, not headings), cut at a word boundary. */
export function snippet(doc: any, max = 155): string | undefined {
  const parts: string[] = []
  const b = bodyOf(doc)
  if (typeof b === 'string') parts.push(...htmlParagraphs(b))
  const walk = (n: any) => {
    if (!n || n.type === 'heading') return
    if (n.type === 'paragraph' || n.type === 'listitem') parts.push(plainText(n))
    else (n.children ?? []).forEach(walk)
  }
  if (typeof b !== 'string') walk(b?.root ?? b)
  const t = parts.join(' ').replace(/\s+/g, ' ').trim()
  if (!t) return undefined
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), 80)) // same as the live site: cut at the word boundary, no ellipsis
}
