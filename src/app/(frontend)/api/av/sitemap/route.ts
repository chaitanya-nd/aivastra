import { blockedResponse } from '@/lib/crawl-guard'
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
    .filter((d) => !(d.meta?.noindex || d.hideFromSitemap || excl.includes(d.slug) || (d.visibility && d.visibility !== 'public')))
    .map((d) => ({
      loc: absoluteUrl(getPath(src.coll, d)),
      lastmod: d.modifiedAt || d.updatedAt,
      image: ps?.sitemapImages === false ? undefined : mediaUrl(d.featuredImage) || d.featuredImageUrl || undefined,
      priority: d.slug === 'home' ? 1 : src.priority,
    }))
}

export async function GET(req: Request) {
  const blocked = await blockedResponse()
  if (blocked) return blocked
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
    for (const key of ['news', 'video'] as const) if (ps?.[`${key}Sitemap`]) items.push(`<sitemap><loc>${SITE_URL}/${key}-sitemap.xml</loc></sitemap>`)
    if (ps?.authorArchives !== false) items.push(`<sitemap><loc>${SITE_URL}/author-sitemap.xml</loc></sitemap>`)
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items.join('')}</sitemapindex>`, { headers })
  }
  if (file === 'news-sitemap.xml' && ps?.newsSitemap) return newsSitemap(ps)
  if (file === 'video-sitemap.xml' && ps?.videoSitemap) return videoSitemap()
  if (file === 'author-sitemap.xml' && ps?.authorArchives !== false) return authorSitemap()
  const m = file.match(/^([a-z_]+)-sitemap(\d*)\.xml$/)
  const src = m && SOURCES.find((s) => s.key === m[1])
  if (!m || !src) return new Response('Not found', { status: 404 })
  const page = Number(m[2] || 1)
  const e = (await entries(src, settings, ps)).slice((page - 1) * max, page * max)
  if (!e.length) return new Response('Not found', { status: 404 })
  const urls = e.map((x) => `<url><loc>${esc(x.loc)}</loc>${x.lastmod ? `<lastmod>${new Date(x.lastmod).toISOString()}</lastmod>` : ''}<priority>${x.priority}</priority>${x.image ? `<image:image><image:loc>${esc(x.image)}</image:loc></image:image>` : ''}</url>`).join('')
  return new Response(xml(`<urlset>${urls}</urlset>`, ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'), { headers })
}

const published = { _status: { equals: 'published' } }
const visible = (d: any) => !d.meta?.noindex && (d.visibility ?? 'public') === 'public'

/** Google News sitemap: posts published in the last 48 hours. */
async function newsSitemap(ps: any) {
  const payload = await getClient()
  const since = new Date(Date.now() - 48 * 3600_000).toISOString()
  const res = await payload.find({ collection: 'posts', where: { and: [published, { publishedAt: { greater_than: since } }] }, limit: 1000, depth: 0, pagination: false, overrideAccess: true })
  const name = esc(ps?.newsPublicationName || 'AI Vastra')
  const urls = (res.docs as any[]).filter(visible).map((d) => `<url><loc>${esc(absoluteUrl(getPath('posts', d)))}</loc><news:news><news:publication><news:name>${name}</news:name><news:language>en</news:language></news:publication><news:publication_date>${new Date(d.publishedAt).toISOString()}</news:publication_date><news:title>${esc(d.title)}</news:title></news:news></url>`).join('')
  return new Response(xml(`<urlset>${urls}</urlset>`, ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"'), { headers })
}

const YT = /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/
const VIMEO = /(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/

/** Video sitemap: posts embedding YouTube / Vimeo, or with a Video schema. */
async function videoSitemap() {
  const payload = await getClient()
  const out: string[] = []
  for (const coll of ['posts', 'guides', 'cases', 'updates', 'reviews'] as const) {
    const res = await payload.find({ collection: coll, where: published, limit: 5000, depth: 0, pagination: false, overrideAccess: true })
    for (const d of (res.docs as any[]).filter(visible)) {
      const html = String(d.contentHtml || '')
      const sd = d.meta?.schemaType === 'VideoObject' ? d.meta?.schemaData || {} : null
      const yt = html.match(YT)?.[1], vm = html.match(VIMEO)?.[1]
      const player = sd?.videoUrl || (yt ? `https://www.youtube.com/embed/${yt}` : vm ? `https://player.vimeo.com/video/${vm}` : '')
      if (!player) continue
      const thumb = sd?.thumbnailUrl || (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : mediaUrl(d.featuredImage) || d.featuredImageUrl)
      if (!thumb) continue
      const desc = (sd?.description || d.meta?.description || d.excerpt || d.title || '').slice(0, 2000)
      out.push(`<url><loc>${esc(absoluteUrl(getPath(coll, d)))}</loc><video:video><video:thumbnail_loc>${esc(thumb)}</video:thumbnail_loc><video:title>${esc(sd?.name || d.title)}</video:title><video:description>${esc(desc)}</video:description><video:player_loc>${esc(player)}</video:player_loc>${sd?.uploadDate || d.publishedAt ? `<video:publication_date>${new Date(sd?.uploadDate || d.publishedAt).toISOString()}</video:publication_date>` : ''}</video:video></url>`)
    }
  }
  return new Response(xml(`<urlset>${out.join('')}</urlset>`, ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"'), { headers })
}

/** Author archives that have at least one published post. */
async function authorSitemap() {
  const payload = await getClient()
  const users = await payload.find({ collection: 'users', depth: 0, pagination: false, limit: 500, overrideAccess: true, where: { slug: { exists: true } } })
  const out: string[] = []
  for (const u of users.docs as any[]) {
    if (!u.slug || u.role === 'subscriber') continue
    const last = await payload.find({ collection: 'posts', where: { and: [published, { author: { equals: u.id } }] }, sort: '-modifiedAt', limit: 1, depth: 0, overrideAccess: true })
    if (!last.totalDocs) continue
    const lm = (last.docs[0] as any)?.modifiedAt || (last.docs[0] as any)?.updatedAt
    out.push(`<url><loc>${esc(`${SITE_URL}/author/${u.slug}/`)}</loc>${lm ? `<lastmod>${new Date(lm).toISOString()}</lastmod>` : ''}</url>`)
  }
  return new Response(xml(`<urlset>${out.join('')}</urlset>`, ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), { headers })
}
