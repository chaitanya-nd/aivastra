/**
 * One-off: copy every Lexical `content` body into the WordPress-style `contentHtml` field
 * (so the Visual / Text editor can edit it).   pnpm tsx scripts/lexical-to-html.ts
 */
import config from '@payload-config'
import { convertLexicalToHTML, defaultHTMLConverters } from '@payloadcms/richtext-lexical/html'
import { getPayload } from 'payload'
import { getPath } from '../src/lib/urls'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

const converters: any = ({ defaultConverters }: any) => ({
  ...defaultConverters,
  blocks: {
    externalImage: ({ node }: any) =>
      `<figure><img src="${esc(node.fields.url)}" alt="${esc(node.fields.alt || '')}" loading="lazy" />${node.fields.caption ? `<figcaption>${node.fields.caption}</figcaption>` : ''}</figure>`,
  },
  link: ({ node, nodesToHTML }: any) => {
    const f = node.fields
    const inner = nodesToHTML({ nodes: node.children }).join('')
    const href = f.linkType === 'internal' && f.doc?.value && typeof f.doc.value === 'object' ? getPath(f.doc.relationTo, f.doc.value) : f.url || '#'
    return `<a href="${esc(href)}"${f.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${inner}</a>`
  },
})

const payload = await getPayload({ config })
let done = 0
for (const collection of ['posts', 'guides', 'cases', 'updates', 'reviews', 'pages'] as const) {
  const res = await payload.find({ collection, limit: 0, pagination: false, depth: 1, draft: true, overrideAccess: true })
  for (const d of res.docs as any[]) {
    if (!d.content?.root?.children?.length || (d.contentHtml && d.contentHtml.trim())) continue
    const html = convertLexicalToHTML({ converters: converters as any, data: d.content, disableContainer: true })
    await payload.update({ collection, id: d.id, data: { contentHtml: html } as any, depth: 0, overrideAccess: true, draft: d._status === 'draft', context: { disableRevalidate: true } })
    done++
  }
  console.log(collection, 'ok')
}
console.log('converted', done)
process.exit(0)
