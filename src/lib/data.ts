import { lastCrumbUrl } from './urls'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { getPayload, type CollectionSlug } from 'payload'
import { cache } from 'react'
import type { GlobalContent, Navigation, SiteSetting } from '@/payload-types'

export const getClient = cache(async () => getPayload({ config }))

export const getSettings = unstable_cache(
  async () => (await getClient()).findGlobal({ slug: 'site-settings', depth: 1 }) as Promise<SiteSetting>,
  ['site-settings'],
  { tags: ['site-settings', 'globals'] },
)
export const getNavigation = unstable_cache(
  async () => (await getClient()).findGlobal({ slug: 'navigation', depth: 2 }) as Promise<Navigation>,
  ['navigation'],
  { tags: ['navigation', 'globals'] },
)
export const getGlobalContent = unstable_cache(
  async () =>
    (await getClient()).findGlobal({ slug: 'global-content', depth: 2 }) as Promise<GlobalContent>,
  ['global-content'],
  { tags: ['global-content', 'globals'] },
)

export async function isDraft() {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

export async function findOne<T = any>(
  collection: CollectionSlug,
  where: Record<string, any>,
  opts: { depth?: number; draft?: boolean } = {},
): Promise<T | null> {
  const payload = await getClient()
  const draft = opts.draft ?? (await isDraft())
  const res = await payload.find({
    collection,
    where: draft ? where : { and: [where, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: opts.depth ?? 2,
    draft,
    overrideAccess: true, // draft mode is only enabled by /api/preview after a CMS login
    pagination: false,
  } as any)
  return (res.docs[0] as T) ?? null
}

/** Taxonomies have no _status. */
export async function findTerm<T = any>(collection: CollectionSlug, slug: string, kind?: string): Promise<T | null> {
  const payload = await getClient()
  const res = await payload.find({
    collection,
    where: kind ? { and: [{ slug: { equals: slug } }, { kind: { equals: kind } }] } : { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    pagination: false,
  })
  return (res.docs[0] as T) ?? null
}

const notPrivate = { or: [{ visibility: { exists: false } }, { visibility: { not_equals: 'private' } }] }

export async function findMany<T = any>(
  collection: CollectionSlug,
  opts: { where?: Record<string, any>; limit?: number; page?: number; sort?: string; depth?: number } = {},
) {
  const payload = await getClient()
  const res = await payload.find({
    collection,
    // Private posts never appear in public listings (WordPress: only logged-in editors see them).
    where: { and: [{ _status: { equals: 'published' } }, ...(collection === 'posts' ? [notPrivate] : []), opts.where ?? {}] },
    limit: opts.limit ?? 12,
    page: opts.page ?? 1,
    sort: opts.sort ?? '-publishedAt',
    depth: opts.depth ?? 1,
    overrideAccess: true,
  } as any)
  return res as typeof res & { docs: T[] }
}

/** Resolve a public path (['documentations','getting-started']) to a page or post. */
export async function resolvePath(segments: string[]) {
  if (segments.length === 0) {
    // Settings → General → "Your homepage displays"
    const ss: any = await getSettings()
    if (ss?.homepageDisplays === 'posts') return { collection: 'blog' as const, doc: { title: ss.siteName, slug: '' } as any }
    const chosen = ss?.homepagePage ? (typeof ss.homepagePage === 'object' ? ss.homepagePage.id : ss.homepagePage) : null
    const home = chosen ? await findOne('pages', { id: { equals: chosen } }) : await findOne('pages', { slug: { equals: 'home' } })
    return home ? { collection: 'pages' as const, doc: home } : null
  }
  const safeDecode = (v: string) => {
    try { return decodeURIComponent(v) } catch { return v }
  }
  const full = safeDecode(`/${segments.join('/')}`)
  const last = segments[segments.length - 1]
  // Next may hand us the segment decoded or still encoded; WordPress stored non-ASCII slugs
  // percent-encoded in lowercase (e.g. "%e2%82%b9"), so try every spelling.
  const slugs = [...new Set([last, last.toLowerCase(), safeDecode(last), encodeURIComponent(safeDecode(last)).toLowerCase()])]
  const payload = await getClient()
  const draft = await isDraft()
  const candidates = await payload.find({
    collection: 'pages',
    where: draft ? { slug: { in: slugs } } : { and: [{ slug: { in: slugs } }, { _status: { equals: 'published' } }] },
    limit: 20,
    depth: 2,
    draft,
    overrideAccess: true, // draft mode is only enabled by /api/preview after a CMS login
    pagination: false,
  } as any)
  // The page's OWN url is its last breadcrumb (earlier crumbs are ancestors).
  const page = (candidates.docs as any[]).find((p) => {
    const own: string = lastCrumbUrl(p) || `/${p.slug}`
    return safeDecode(own) === full
  })
  if (page && page.slug !== 'home') return { collection: 'pages' as const, doc: page }
  if (segments.length === 1) {
    const post = await findOne('posts', { slug: { in: slugs } })
    // Private posts are only reachable through the CMS preview (draft mode).
    if (post && (post.visibility !== 'private' || draft)) return { collection: 'posts' as const, doc: post }
  }
  return null
}

export async function findRedirect(pathname: string) {
  const payload = await getClient()
  const clean = pathname.replace(/\/+$/, '') || '/'
  const bare = clean.replace(/^\//, '')
  const res = await payload.find({
    collection: 'redirects',
    where: { and: [{ from: { in: [clean, `${clean}/`, bare, `${bare}/`] } }, { active: { not_equals: false } }] },
    limit: 1,
    depth: 1,
  })
  let hit: any = res.docs[0] ?? null
  if (!hit) {
    // Rank Math comparisons: contains / starts with / ends with / regex
    const rules = await payload.find({
      collection: 'redirects',
      where: { and: [{ comparison: { in: ['contains', 'start', 'end', 'regex'] } }, { active: { not_equals: false } }] },
      limit: 200,
      depth: 1,
      pagination: false,
    })
    hit =
      (rules.docs as any[]).find((r) => {
        const ic = r.ignoreCase !== false
        const a = ic ? clean.toLowerCase() : clean
        const b = ic ? String(r.from ?? '').toLowerCase() : String(r.from ?? '')
        if (r.comparison === 'contains') return a.includes(b)
        if (r.comparison === 'start') return a.startsWith(b) || a.startsWith(`/${b.replace(/^\//, '')}`)
        if (r.comparison === 'end') return a.endsWith(b.replace(/\/$/, ''))
        try {
          return new RegExp(String(r.from), ic ? 'i' : '').test(clean.replace(/^\//, '')) || new RegExp(String(r.from), ic ? 'i' : '').test(clean)
        } catch {
          return false
        }
      }) ?? null
  }
  if (hit) {
    // hit counter (fire and forget)
    payload.update({ collection: 'redirects', id: hit.id, data: { hits: (hit.hits ?? 0) + 1, lastAccessed: new Date().toISOString() } as any, depth: 0, context: { disableRevalidate: true } }).catch(() => {})
  }
  return hit
}

export const getPluginSettings = unstable_cache(
  async () => (await getClient()).findGlobal({ slug: 'plugin-settings', depth: 0 }) as Promise<any>,
  ['plugin-settings'],
  { tags: ['plugin-settings', 'globals'] },
)

/** Rank Math 404 Monitor: record a missing URL (fire and forget). */
export async function log404(uri: string, referer?: string | null, ua?: string | null) {
  try {
    const payload = await getClient()
    const u = uri.length > 300 ? uri.slice(0, 300) : uri
    const ex = await payload.find({ collection: 'not-found-log', where: { uri: { equals: u } }, limit: 1, depth: 0, overrideAccess: true })
    const now = new Date().toISOString()
    if (ex.docs[0]) await payload.update({ collection: 'not-found-log', id: ex.docs[0].id, data: { hits: ((ex.docs[0] as any).hits ?? 0) + 1, lastSeen: now, referer: referer || (ex.docs[0] as any).referer } as any, depth: 0, overrideAccess: true, context: { fromMonitor: true } })
    else await payload.create({ collection: 'not-found-log', data: { uri: u, hits: 1, referer: referer || undefined, userAgent: ua?.slice(0, 200), lastSeen: now } as any, depth: 0, overrideAccess: true, context: { fromMonitor: true } })
  } catch {}
}

/** Read more under an article: "latest" (old-site behaviour) or posts sharing categories / tags. */
export async function readMorePosts(doc: any, mode?: string) {
  if (mode !== 'related') return (await findMany('posts', { limit: 3, depth: 1 })).docs
  const ids = (xs: any[] = []) => xs.map((x) => (typeof x === 'object' ? x?.id : x)).filter(Boolean)
  const cats = ids(doc.categories), tags = ids(doc.tags)
  const or = [...(cats.length ? [{ categories: { in: cats } }] : []), ...(tags.length ? [{ tags: { in: tags } }] : [])]
  const rel = or.length ? (await findMany('posts', { where: { and: [{ id: { not_equals: doc.id } }, { or }] }, limit: 3, depth: 1 })).docs : []
  if (rel.length >= 3) return rel
  const fill = (await findMany('posts', { where: { id: { not_in: [doc.id, ...rel.map((r: any) => r.id)] } }, limit: 3 - rel.length, depth: 1 })).docs
  return [...rel, ...fill]
}

/** Previous / next post by publish date. */
export async function adjacentPosts(doc: any) {
  if (!doc?.publishedAt) return { prev: null, next: null }
  const [p, n] = await Promise.all([
    findMany('posts', { where: { publishedAt: { less_than: doc.publishedAt } }, sort: '-publishedAt', limit: 1, depth: 0 }),
    findMany('posts', { where: { publishedAt: { greater_than: doc.publishedAt } }, sort: 'publishedAt', limit: 1, depth: 0 }),
  ])
  return { prev: (p.docs[0] as any) ?? null, next: (n.docs[0] as any) ?? null }
}
