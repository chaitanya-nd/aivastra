/**
 * Pull posts that exist on the live site (WordPress REST) but not in the local DB, so the blog index matches aivastra.com.
 * Additive only — existing posts are never touched.   pnpm tsx scripts/sync-live-posts.ts
 */
import config from '@payload-config'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import { getPayload } from 'payload'

const ORIGIN = 'https://aivastra.com'
const decode = (s: string) => new JSDOM(`<body>${s || ''}</body>`).window.document.body.textContent?.replace(/ /g, ' ').trim() ?? ''
const relinks = (h: string) => h.replace(/(href=["'])https?:\/\/(?:new\.|www\.)?aivastra\.(?:com|local)(?=["'\/#?])/gi, '$1')
const rid = () => Math.random().toString(36).slice(2, 10)

async function main() {
  const payload = await getPayload({ config })
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const toLex = (html: string) => convertHTMLToLexical({ editorConfig, html, JSDOM }) as any
  const lex = (raw: string) => {
    const html = relinks(raw || '').replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, '').replace(/\[\/?[a-z_]+[^\]]*\]/gi, '')
      .replace(/<h1/gi, '<h2').replace(/<\/h1>/gi, '</h2>').replace(/<h[56]/gi, '<h4').replace(/<\/h[56]>/gi, '</h4>').replace(/<\/?figure[^>]*>/gi, '')
    const kids: any[] = []
    let doc: any
    for (const part of html.split(/(<img\b[^>]*>)/gi)) {
      if (/^<img\b/i.test(part)) {
        const src = /\bsrc=["']([^"']+)["']/i.exec(part)?.[1]
        if (!src || src.startsWith('data:')) continue
        kids.push({ type: 'block', version: 2, format: '', fields: { id: rid(), blockName: '', blockType: 'externalImage', url: src.startsWith('/') ? ORIGIN + src : src, alt: decode(/\balt=["']([^"']*)["']/i.exec(part)?.[1] || '') } })
      } else {
        const c = part.replace(/<a\b[^>]*>\s*<\/a>/gi, '').replace(/<p>\s*<\/p>/gi, '')
        if (!c.replace(/<[^>]*>/g, '').trim()) continue
        const l = toLex(/<[a-z][\s\S]*>/i.test(c) ? c : `<p>${c}</p>`)
        doc ??= l
        kids.push(...l.root.children)
      }
    }
    doc ??= toLex('<p></p>')
    doc.root.children = kids.length ? kids : doc.root.children
    return doc
  }

  const have = new Set((await payload.find({ collection: 'posts', limit: 1000, depth: 0, pagination: false, select: { slug: true } as any })).docs.map((d: any) => d.slug))
  const live: any[] = []
  for (let page = 1; ; page++) {
    const r = await fetch(`${ORIGIN}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=wp:featuredmedia,wp:term`)
    if (!r.ok) break
    const d = await r.json()
    live.push(...d)
    if (d.length < 100) break
  }
  const author = (await payload.find({ collection: 'users', limit: 1, depth: 0 })).docs[0]
  for (const p of live.filter((x) => !have.has(decodeURIComponent(x.slug)) && !have.has(x.slug))) {
    const terms: any[] = (p._embedded?.['wp:term'] ?? []).flat()
    const ids = async (collection: 'categories' | 'tags', tax: string) => {
      const slugs = terms.filter((t) => t.taxonomy === tax).map((t) => t.slug)
      if (!slugs.length) return []
      return (await payload.find({ collection, where: { slug: { in: slugs } }, limit: 50, depth: 0 })).docs.map((d: any) => d.id)
    }
    const categories = await ids('categories', 'category')
    const media = p._embedded?.['wp:featuredmedia']?.[0]
    const doc = await payload.create({
      collection: 'posts',
      data: {
        title: decode(p.title.rendered), slug: p.slug, publishedAt: new Date(p.date_gmt + 'Z').toISOString(), modifiedAt: new Date(p.modified_gmt + 'Z').toISOString(),
        excerpt: decode(p.excerpt.rendered) || undefined, content: lex(p.content.rendered),
        featuredImageUrl: media?.source_url, featuredImageAlt: media?.alt_text || undefined,
        categories, primaryCategory: categories[0], tags: await ids('tags', 'post_tag'), author: author?.id, _status: 'published',
      } as any,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`[sync] + ${doc.slug}`)
  }
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
