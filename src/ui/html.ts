import { type HTMLElement, NodeType, parse } from 'node-html-parser'

/** Helpers that pull structure (headings, copy, images, buttons) out of the CMS's HTML blobs,
 *  so new layouts can re-render exactly the same text. */
export type El = HTMLElement
export const load = (s?: string | null): El => parse(s ?? '')
export const q = (n: El | null | undefined, sel: string): El | null => (n?.querySelector(sel) as El | null) ?? null
export const qa = (n: El | null | undefined, sel: string): El[] => (n ? (n.querySelectorAll(sel) as El[]) : [])
export const tx = (n: El | null | undefined) => (n?.text ?? '').replace(/\s+/g, ' ').trim()
export const attr = (n: El | null | undefined, a: string) => n?.getAttribute(a) ?? ''
export const src = (n: El | null | undefined) => attr(q(n, 'img') ?? n, 'src')
export const alt = (n: El | null | undefined) => attr(q(n, 'img') ?? n, 'alt')

const BLOCK = /^(h[1-6]|div|ul|ol|img|button|figure|table|section|p|i)$/i
/** Inline HTML of a node (loose text + <a>/<strong>…), skipping block children and optionally <i>. */
export function inline(n: El | null | undefined, opts: { keepI?: boolean } = {}): string {
  if (!n) return ''
  return n.childNodes
    .filter((c) => c.nodeType === NodeType.TEXT_NODE || (c.nodeType === NodeType.ELEMENT_NODE && (!BLOCK.test((c as El).tagName) || (opts.keepI && (c as El).tagName === 'I'))))
    .map((c) => c.toString())
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}
export const imgs = (n: El | null | undefined) => qa(n, 'img').map((i) => ({ src: attr(i, 'src'), alt: attr(i, 'alt') }))
export const links = (n: El | null | undefined) =>
  qa(n, 'a').map((a) => ({ text: tx(a), href: attr(a, 'href') || '', newTab: attr(a, 'target') === '_blank', img: attr(q(a, 'img'), 'src') }))
/** WordPress buttons: `a.cmn-btn` without href open the demo popup. */
export const buttons = (n: El | null | undefined) => links(n).filter((l) => l.text).map((l) => ({ ...l, demo: !l.href }))
