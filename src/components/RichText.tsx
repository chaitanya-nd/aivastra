import {
  RichText as PayloadRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'
import { withHeadingIds } from '@/lib/body'
import { enhanceHtml } from '@/lib/enhanceHtml'
import { applyAutoLinks, autoLinkRules } from '@/lib/autoLinks'
import { slugify } from '@/lib/slug'
import { getPath, withTrailingSlash } from '@/lib/urls'

const textOf = (n: any): string =>
  typeof n?.text === 'string' ? n.text : (n?.children || []).map(textOf).join('')

const converters: JSXConvertersFunction = ({ defaultConverters }) => {
  // Same duplicate-safe ids as extractHeadings().
  const used = new Set<string>()
  return {
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const Tag = node.tag as 'h2'
      const text = textOf(node).trim()
      let id = slugify(text) || 'section'
      let i = 2
      const base = id
      while (used.has(id)) id = `${base}-${i++}`
      used.add(id)
      return <Tag id={id}>{nodesToJSX({ nodes: node.children })}</Tag>
    },
    blocks: {
      externalImage: ({ node }: any) => (
        <figure>
          {/* biome-ignore lint/performance/noImgElement: external URL until media storage is connected */}
          <img src={node.fields.url} alt={node.fields.alt || ''} loading="lazy" />
          {node.fields.caption && <figcaption>{node.fields.caption}</figcaption>}
        </figure>
      ),
    },
    link: ({ node, nodesToJSX }) => {
      const f: any = node.fields
      const children = nodesToJSX({ nodes: node.children })
      if (f.linkType === 'internal' && f.doc?.value && typeof f.doc.value === 'object') {
        return <Link href={withTrailingSlash(getPath(f.doc.relationTo, f.doc.value))}>{children}</Link>
      }
      return (
        <a href={f.url} {...(f.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {children}
        </a>
      )
    },
  }
}

/** `autoLink`: the page's own path — turns on SEO → Auto links for this body (never links a page to itself). */
export async function RichText({ data, className, autoLink }: { data: SerializedEditorState | string; className?: string; autoLink?: string }) {
  if (typeof data === 'string') {
    let html = enhanceHtml(withHeadingIds(data))
    if (autoLink !== undefined) html = applyAutoLinks(html, await autoLinkRules(), autoLink)
    return <div className={`prose ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: html }} />
  }
  if (!data) return null
  return <PayloadRichText converters={converters} data={data} className={`prose ${className ?? ''}`} />
}
