import { getClient } from '@/lib/data'
import { absoluteUrl, COLLECTION_BASE, getPath, SITE_URL } from '@/lib/urls'

/**
 * Sitemap sources and entries — shared by the public sitemap route, the admin dashboard and Sitemap Settings.
 * Rules mirror what Rank Math produced on the WordPress site (checked against aivastra.com's live sitemaps):
 *  - files and order: post, page, review, guide, update, case, category (then tags / section categories if switched on)
 *  - post-type files: the archive first (posts page for posts, /guide/ /case/ /review/), then items newest-modified first
 *  - page file: the home page first; the posts page is listed in post-sitemap.xml instead
 *  - <lastmod> = the item's “Last modified” date; for an archive / term = its newest published item
 *  - <image:image> = every <img> in the item's content (as Rank Math does, duplicates included)
 *  - terms: in creation (ID) order, empty terms left out
 */
export type Src = { key: string; coll: string; settingsKey: string; kind: 'doc' | 'term' }
export const SOURCES: Src[] = [
  { key: 'post', coll: 'posts', settingsKey: 'posts', kind: 'doc' },
  { key: 'page', coll: 'pages', settingsKey: 'pages', kind: 'doc' },
  { key: 'review', coll: 'reviews', settingsKey: 'reviews', kind: 'doc' },
  { key: 'guide', coll: 'guides', settingsKey: 'guides', kind: 'doc' },
  { key: 'update', coll: 'updates', settingsKey: 'updates', kind: 'doc' },
  { key: 'case', coll: 'cases', settingsKey: 'cases', kind: 'doc' },
  { key: 'category', coll: 'categories', settingsKey: 'categories', kind: 'term' },
  { key: 'post_tag', coll: 'tags', settingsKey: 'tags', kind: 'term' },
  { key: 'section_category', coll: 'section-categories', settingsKey: 'sectionCategories', kind: 'term' },
]

/** Post types whose archive page is the first URL of their sitemap (as on the WordPress site). */
const ARCHIVE: Record<string, boolean> = { guides: true, cases: true, reviews: true }
/** Which collections / fields use each taxonomy — a term's lastmod is its newest published item. */
const TERM_USE: Record<string, { coll: string; field: string }[]> = {
  categories: [{ coll: 'posts', field: 'categories' }],
  tags: [{ coll: 'posts', field: 'tags' }],
  'section-categories': [{ coll: 'guides', field: 'category' }, { coll: 'cases', field: 'category' }, { coll: 'updates', field: 'category' }],
}

export type Entry = { id?: string | number; title: string; loc: string; lastmod?: string; images: string[] }
export type Excluded = { id: string | number; title: string; reason: string }

const modOf = (d: any): string | undefined => d?.modifiedAt || d?.updatedAt || undefined
const newest = (xs: (string | undefined)[]) => xs.filter(Boolean).sort().at(-1) as string | undefined
const exclList = (src: Src, ps: any) => String((src.kind === 'doc' ? ps?.sitemapExcludePosts : ps?.sitemapExcludeTerms) || '').split(',').map((x) => x.trim()).filter(Boolean)

/** Images Rank Math lists for an item: each <img src> in its content, made absolute. */
export function contentImages(html: unknown): string[] {
  const out: string[] = []
  const re = /<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(String(html || '')))) {
    const s = m[1]!.trim()
    if (!s || s.startsWith('data:')) continue
    out.push(s.startsWith('//') ? `https:${s}` : s.startsWith('/') ? `${SITE_URL}${s}` : s)
  }
  return out
}

/** Why the whole type is out of the sitemap (null = in). */
export function typeOffReason(src: Src, settings: any, ps: any): string | null {
  if (src.key === 'section_category') return ps?.sitemapSectionTerms === true ? null : '“Include in sitemap” is switched off for this taxonomy'
  const cfg = settings?.[src.settingsKey] ?? {}
  if (cfg.inSitemap === false) return '“Include in sitemap” is switched off for this type'
  if ((cfg.robots ?? []).includes('noindex')) return 'This type is set to noindex in Titles & Meta'
  return null
}

/** Why a single published item is left out of the sitemap (null = included). */
export function itemExclusion(d: any, excl: string[]): string | null {
  if (d.meta?.noindex) return 'Set to noindex (SEO box on the item)'
  if (d.hideFromSitemap) return '“Hide from sitemap” is ticked on the item'
  if (excl.includes(d.slug)) return 'Listed in “Exclude posts / terms” (Sitemap settings → General)'
  if (d.visibility && d.visibility !== 'public') return `Visibility is ${d.visibility} (not public)`
  return null
}

/** Everything one sitemap type contains, in sitemap order, plus what was left out and why. */
export async function collect(src: Src, settings: any, ps: any): Promise<{ typeOff: string | null; rows: Entry[]; excluded: Excluded[] }> {
  const typeOff = typeOffReason(src, settings, ps)
  if (typeOff) return { typeOff, rows: [], excluded: [] }
  const payload = await getClient()
  const excl = exclList(src, ps)
  const images = ps?.sitemapImages !== false
  const rows: Entry[] = []
  const excluded: Excluded[] = []

  if (src.kind === 'doc') {
    const res = await payload.find({ collection: src.coll as any, where: { _status: { equals: 'published' } }, limit: 5000, depth: 0, pagination: false, overrideAccess: true })
    const docs = (res.docs as any[]).slice().sort((a, b) => String(modOf(b) || '').localeCompare(String(modOf(a) || '')))
    for (const d of docs) {
      const title = d.title || d.slug
      if (src.coll === 'pages' && d.template === 'blog') { excluded.push({ id: d.id, title, reason: 'Posts page — listed first in post-sitemap.xml' }); continue }
      const why = itemExclusion(d, excl)
      if (why) { excluded.push({ id: d.id, title, reason: why }); continue }
      const e: Entry = { id: d.id, title, loc: absoluteUrl(getPath(src.coll, d)), lastmod: modOf(d), images: images ? contentImages(d.contentHtml) : [] }
      if (src.coll === 'pages' && d.slug === 'home') rows.unshift(e)
      else rows.push(e)
    }
    if (src.coll === 'posts') {
      const blog = await payload.find({ collection: 'pages', where: { and: [{ template: { equals: 'blog' } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 0, overrideAccess: true })
      const b = blog.docs[0] as any
      if (b && !itemExclusion(b, [])) rows.unshift({ id: b.id, title: `${b.title} (posts page)`, loc: absoluteUrl(getPath('pages', b)), lastmod: modOf(b), images: [] })
    } else if (ARCHIVE[src.coll] && rows.length) {
      rows.unshift({ title: `${SITEMAP_LABELS[src.key]} archive`, loc: absoluteUrl(COLLECTION_BASE[src.coll]!), lastmod: newest(rows.map((r) => r.lastmod)), images: [] })
    }
    return { typeOff, rows, excluded }
  }

  // Taxonomy: creation order, lastmod = newest published item using the term, empty terms out.
  const res = await payload.find({ collection: src.coll as any, limit: 5000, depth: 0, pagination: false, overrideAccess: true, sort: 'id' })
  const last = new Map<string, string>()
  for (const u of TERM_USE[src.coll] ?? []) {
    const items = await payload.find({ collection: u.coll as any, where: { _status: { equals: 'published' } }, limit: 5000, depth: 0, pagination: false, overrideAccess: true, select: { [u.field]: true, modifiedAt: true, updatedAt: true } as any })
    for (const it of items.docs as any[]) {
      const v = it[u.field]
      for (const t of Array.isArray(v) ? v : v != null ? [v] : []) {
        const k = String(typeof t === 'object' ? t?.id : t)
        const m = modOf(it)
        if (m && (!last.has(k) || m > last.get(k)!)) last.set(k, m)
      }
    }
  }
  for (const d of res.docs as any[]) {
    const title = d.name || d.title || d.slug
    const why = itemExclusion(d, excl) || (!last.has(String(d.id)) ? 'Empty — no published items use it' : null)
    if (why) { excluded.push({ id: d.id, title, reason: why }); continue }
    rows.push({ id: d.id, title, loc: absoluteUrl(getPath(src.coll, d)), lastmod: last.get(String(d.id)), images: [] })
  }
  return { typeOff, rows, excluded }
}

/** Rank Math: the author sitemap needs author archives on AND “Include author sitemap”. */
export const authorSitemapOn = (ps: any) => ps?.authorArchives !== false && ps?.sitemapAuthors === true

/** The URLs of one sitemap type, in order (all files of that type together). */
export async function entries(src: Src, settings: any, ps: any): Promise<Entry[]> {
  return (await collect(src, settings, ps)).rows
}

export const SITEMAP_LABELS: Record<string, string> = {
  post: 'Posts', page: 'Pages', guide: 'Guides', case: 'Case studies', update: 'Product updates', review: 'Reviews',
  category: 'Categories', post_tag: 'Tags', section_category: 'Section categories',
}

export type SitemapTypeReport = {
  key: string; coll: string; label: string; settingsKey: string; kind: 'doc' | 'term'
  typeOff: string | null // reason the whole type is out of the sitemap
  files: { file: string; urls: number; lastmod?: string }[]
  included: { id?: string | number; title: string; url: string; lastmod?: string }[]
  excluded: Excluded[]
  lastmod?: string
}

/** Detailed, per-content-type explanation of what the sitemap contains — for the admin screens. */
export async function sitemapReport(settings: any, ps: any): Promise<SitemapTypeReport[]> {
  const max = Math.max(1, Number(ps?.sitemapMaxLinks) || 200)
  return Promise.all(SOURCES.map(async (src) => {
    const { typeOff, rows, excluded } = await collect(src, settings, ps)
    const n = Math.ceil(rows.length / max)
    const files = Array.from({ length: n }, (_, i) => {
      const part = rows.slice(i * max, (i + 1) * max)
      return { file: `${src.key}-sitemap${i ? i + 1 : ''}.xml`, urls: part.length, lastmod: newest(part.map((x) => x.lastmod)) }
    })
    return {
      key: src.key, coll: src.coll, label: SITEMAP_LABELS[src.key] || src.key, settingsKey: src.settingsKey, kind: src.kind, typeOff, files,
      included: rows.map((r) => ({ id: r.id, title: r.title, url: r.loc, lastmod: r.lastmod })), excluded, lastmod: newest(rows.map((r) => r.lastmod)),
    }
  }))
}
