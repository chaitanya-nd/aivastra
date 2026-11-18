import { parse } from 'node-html-parser'
import { slugify } from './slug'

/** Page/post body: the WordPress-style HTML (contentHtml) wins; the old Lexical `content` is the fallback for untouched legacy docs. */
export const bodyOf = (doc: any): any => (typeof doc?.contentHtml === 'string' && doc.contentHtml.trim() ? doc.contentHtml : doc?.content)
export const hasBody = (doc: any) => Boolean(bodyOf(doc))

export const htmlText = (html: string) => parse(html).textContent.replace(/\s+/g, ' ').trim()

export type H = { id: string; text: string; level: number }

/** h2–h4 with duplicate-safe ids (same algorithm as the Lexical path). */
export function htmlHeadings(html: string): H[] {
  const used = new Set<string>()
  return parse(html).querySelectorAll('h2,h3,h4').map((h) => {
    const text = h.textContent.trim()
    let id = h.getAttribute('id') || slugify(text) || 'section'
    const base = id
    let i = 2
    while (used.has(id)) id = `${base}-${i++}`
    used.add(id)
    return { id, text, level: Number(h.tagName[1]) }
  }).filter((h) => h.text)
}

/** Adds the heading ids so the table of contents anchors work. */
export function withHeadingIds(html: string): string {
  const root = parse(html)
  const heads = htmlHeadings(html)
  root.querySelectorAll('h2,h3,h4').filter((h) => h.textContent.trim()).forEach((h, i) => h.setAttribute('id', heads[i].id))
  return root.toString()
}

/** Paragraph / list-item texts (for the auto description). */
export const htmlParagraphs = (html: string): string[] => parse(html).querySelectorAll('p,li').map((n) => n.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean)
