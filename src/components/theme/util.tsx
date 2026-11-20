import type { ReactNode } from 'react'
import { htmlText } from '@/lib/body'
import { FormRenderer } from '../FormRenderer'

export const THEME_URL = 'https://aivastra.com/wp-content/themes/aivastrachild'
export const html = (s?: string | null) => ({ __html: s ?? '' })
const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', copy: '©', reg: '®', trade: '™', rupee: '₹' }
/** Plain text for React: strips tags AND decodes HTML entities (React would otherwise print "&amp;" literally). */
export const strip = (s?: string | number | null) =>
  String(s ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
      if (e[0] === '#') {
        const n = e[1].toLowerCase() === 'x' ? Number.parseInt(e.slice(2), 16) : Number.parseInt(e.slice(1), 10)
        return Number.isFinite(n) ? String.fromCodePoint(n) : m
      }
      return ENTITIES[e.toLowerCase()] ?? m
    })
    .trim()

/** Plain text from a Lexical document (for auto-excerpts). */
export function lexicalText(node: any): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text + ' '
  return (node.children ?? node.root?.children ?? []).map(lexicalText).join('')
}
export const words = (s: string, n: number) => {
  const w = s.trim().split(/\s+/).filter(Boolean)
  return w.length > n ? `${w.slice(0, n).join(' ')}...` : w.join(' ')
}
export const bodyText = (doc: any): string => (typeof doc?.contentHtml === 'string' && doc.contentHtml.trim() ? htmlText(doc.contentHtml) : lexicalText(doc?.content?.root))
/** <!--more--> (WordPress Read More tag): the text before it is the automatic excerpt. */
const beforeMore = (doc: any): string | null => {
  const h = typeof doc?.contentHtml === 'string' ? doc.contentHtml : ''
  const i = h.indexOf('<!--more-->')
  return i > 0 ? words(htmlText(h.slice(0, i)), 55) : null
}
export const excerptOf = (doc: any, n = 10) => (doc.excerpt ? words(doc.excerpt, n) : beforeMore(doc) ?? words(bodyText(doc), n))

/** ACF "accordion_list" repeater → the theme's FAQ accordion (markup incl. FAQPage microdata). */
export function Accordion({ a, className = '', wrap = true }: { a: any; className?: string; wrap?: boolean }): ReactNode {
  const list = (a?.accordion_list ?? []) as { accordion_question?: string; accordion_answer?: string }[]
  if (!list.length) return null
  const inner = (
    <div className="accordion-lst" itemScope itemType="https://schema.org/FAQPage">
      {list.map((q, i) => (
        <div className="accordion-profile" key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
          <h3 itemProp="name"><a href="javascript:void(0);">{strip(q.accordion_question)}</a></h3>
          <div className="accordion-profile-content" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
            <div itemProp="text" dangerouslySetInnerHTML={html(q.accordion_answer)} />
          </div>
        </div>
      ))}
    </div>
  )
  return wrap ? (
    <div className={`inr-faqs-sec ${className}`}>
      <div className="container">
        {a.category_accordion_title && <h2 className="text-heading">{strip(a.category_accordion_title)}</h2>}
        {a.category_accordion_eyebrow && <p>{strip(a.category_accordion_eyebrow)}</p>}
        {inner}
      </div>
    </div>
  ) : (
    inner
  )
}

/** Opens the "Schedule a demo" popup (handled by the theme's custom-scripts.js via #popupbtn). */
export const DemoButton = ({ children, two = false }: { children: ReactNode; two?: boolean }) => (
  <a className={`cmn-btn${two ? ' cmn-btn-two' : ''}`} id="popupbtn">{children}</a>
)

export const FormBlock = ({ form }: { form: any }) => (form && typeof form === 'object' ? <FormRenderer form={form} /> : null)

/** WordPress `wptexturize` for visible headings: curly quotes/apostrophes and en dashes. */
export const texturize = (s?: string | null) =>
  (s ?? '')
    .replace(/(\w)'(\w)/g, '$1\u2019$2')
    .replace(/(^|[\s([{-])'(?=\S)/g, '$1\u2018')
    .replace(/'/g, '\u2019')
    .replace(/(^|[\s([{-])"(?=\S)/g, '$1\u201c')
    .replace(/"/g, '\u201d')
    .replace(/ - /g, ' \u2013 ')
