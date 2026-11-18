import { getClient } from '@/lib/data'
import { mediaUrl } from '@/lib/seo'
import { absoluteUrl, getPath, SITE_URL } from '@/lib/urls'

export const dynamic = 'force-dynamic'

/** Rank Math-style sitemaps: /sitemap_index.xml + /post-sitemap.xml, /page-sitemap2.xml … (rewritten in next.config.mjs). */
type Src = { key: string; coll: string; settingsKey: string; kind: 'doc' | 'term'; priority: number }
const SOURCES: Src[] = [
  { key: 'post', coll: 'posts', settingsKey: 'posts', kind: 'doc', priority: 0.7 },
  { key: 'page', coll: 'pages', settingsKey: 'pages', kind: 'doc', priority: 0.8 },
  { key: 'guide', coll: 'guides', settingsKey: 'guides', kind: 'doc', priority: 0.6 },
  { key: 'case', coll: 'cases', settingsKey: 'cases', kind: 'doc', priority: 0.6 },
  { key: 'update', coll: 'updates', settingsKey: 'updates', kind: 'doc', priority: 0.5 },
  { key: 'review', coll: 'reviews', settingsKey: 'reviews', kind: 'doc', priority: 0.4 },
  { key: 'category', coll: 'categories', settingsKey: 'categories', kind: 'term', priority: 0.4 },
  { key: 'post_tag', coll: 'tags', settingsKey: 'tags', kind: 'term', priority: 0.3 },
  { key: 'section_category', coll: 'section-categories', settingsKey: 'categories', kind: 'term', priority: 0.3 },
]
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const xml = (body: string, ns = '') => `<?xml version="1.0" encoding="UTF-8"?>\n${body.replace('<urlset', `<urlset${ns}`)}`
const headers = { 'Content-Type': 'application/xml; charset=utf-8', 'X-Robots-Tag': 'noindex, follow', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }

async function entries(src: Src, settings: any, ps: any) {
  const payload = await getClient()
  const cfg = settings?.[src.settingsKey] ?? {}
  if (cfg.inSitemap === false || (cfg.robots ?? []).includes('noindex')) return []
  const excl = String(src.kind === 'doc' ? ps?.sitemapExcludePosts : ps?.sitemapExcludeTerms || '').split(',').map((x) => x.trim()).filter(Boolean)
  const res = await payload.find({ collection: src.coll as any, ...(src.kind === 'doc' ? { where: { _status: { equals: 'published' } } } : {}), limit: 5000, depth: 1, pagination: false, overrideAccess: true, sort: src.kind === 'doc' ? '-publishedAt' : 'name' })
  return (res.docs as any[])
    .filter((d) => !(d.meta?.noindex || d.hideFromSitemap || excl.includes(d.slug)))
    .map((d) => ({
      loc: absoluteUrl(getPath(src.coll, d)),
      lastmod: d.modifiedAt || d.updatedAt,
      image: ps?.sitemapImages === false ? undefined : mediaUrl(d.featuredImage) || d.featuredImageUrl || undefined,
      priority: d.slug === 'home' ? 1 : src.priority,
    }))
}

export async function GET(req: Request) {
  const name = new URL(req.url).pathname.split('/').pop() || ''
  const file = /-sitemap\d*\.xml$/.test(name) ? name : 'index' // rewrites keep the public URL in req.url
  const payload = await getClient()
  const [ps, settings]: any[] = await Promise.all([payload.findGlobal({ slug: 'plugin-settings', depth: 0 }), payload.findGlobal({ slug: 'site-settings', depth: 0 })])
  if (ps?.sitemapEnabled === false) return new Response('Sitemap disabled', { status: 404 })
  const max = Math.max(1, Number(ps?.sitemapMaxLinks) || 200)

  if (file === 'index') {
    const items: string[] = []
    for (const src of SOURCES) {
      const e = await entries(src, settings, ps)
      const n = Math.ceil(e.length / max)
      for (let i = 1; i <= n; i++) {
        const last = e.slice((i - 1) * max, i * max).map((x) => x.lastmod).filter(Boolean).sort().at(-1)
        items.push(`<sitemap><loc>${`${SITE_URL}/${src.key}-sitemap${i > 1 ? i : ''}.xml`}</loc>${last ? `<lastmod>${new Date(last).toISOString()}</lastmod>` : ''}</sitemap>`)
      }
    }
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items.join('')}</sitemapindex>`, { headers })
  }
  const m = file.match(/^([a-z_]+)-sitemap(\d*)\.xml$/)
  const src = m && SOURCES.find((s) => s.key === m[1])
  if (!m || !src) return new Response('Not found', { status: 404 })
  const page = Number(m[2] || 1)
  const e = (await entries(src, settings, ps)).slice((page - 1) * max, page * max)
  if (!e.length) return new Response('Not found', { status: 404 })
  const urls = e.map((x) => `<url><loc>${esc(x.loc)}</loc>${x.lastmod ? `<lastmod>${new Date(x.lastmod).toISOString()}</lastmod>` : ''}<priority>${x.priority}</priority>${x.image ? `<image:image><image:loc>${esc(x.image)}</image:loc></image:image>` : ''}</url>`).join('')
  return new Response(xml(`<urlset>${urls}</urlset>`, ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'), { headers })
}
