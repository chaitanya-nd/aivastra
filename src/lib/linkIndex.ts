import type { Payload } from 'payload'
import { getPath } from './urls'

/** Collections whose body HTML can link to each other. */
export const LINK_COLLECTIONS = ['posts', 'pages', 'guides', 'cases', 'updates', 'reviews'] as const
const HOSTS = new Set(['aivastra.com', (() => { try { return new URL(process.env.NEXT_PUBLIC_SITE_URL || '').host.replace(/^www\./, '') } catch { return '' } })()].filter(Boolean))

/** "/a/b" | "https://aivastra.com/a/b/?x#y" → "/a/b/" (null for external / non-page links). */
export function internalPath(href: string): string | null {
  const h = href.trim()
  if (!h || h.startsWith('#') || /^(mailto|tel|javascript|data):/i.test(h)) return null
  let p: string
  if (/^https?:\/\//i.test(h)) {
    try {
      const u = new URL(h)
      if (!HOSTS.has(u.host.replace(/^www\./, ''))) return null
      p = u.pathname
    } catch { return null }
  } else if (h.startsWith('/')) p = h.split(/[?#]/)[0]
  else return null
  if (/^\/(api|admin|wp-content|wp-admin|_next)\//.test(p) || /\.[a-z0-9]{2,5}$/i.test(p)) return null
  return `${p.replace(/\/+$/, '')}/`.toLowerCase()
}

export function countLinks(html: string) {
  let internal = 0, external = 0
  const targets = new Set<string>()
  for (const m of (html || '').matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    const href = m[1]
    if (/^(mailto|tel|javascript|#)/i.test(href)) continue
    const p = internalPath(href)
    if (p) { internal++; targets.add(p) } else if (/^https?:/i.test(href)) external++
  }
  return { internal, external, targets }
}

let cache: { at: number; map: Map<string, number> } | null = null
let building: Promise<Map<string, number>> | null = null
/** `${collection}:${id}` → public path, so counts work even when a read did not select the slug. */
export const pathById = new Map<string, string>()

/** path → number of OTHER published docs linking to it. Rebuilt at most once a minute, or after any save. */
export async function incomingMap(payload: Payload): Promise<Map<string, number>> {
  if (cache && Date.now() - cache.at < 60_000) return cache.map
  building ??= (async () => {
    const map = new Map<string, number>()
    for (const collection of LINK_COLLECTIONS) {
      const res = await payload.find({ collection, where: { _status: { equals: 'published' } }, depth: 0, pagination: false, limit: 5000, overrideAccess: true, select: { contentHtml: true, slug: true, breadcrumbs: true } as any }).catch(() => ({ docs: [] as any[] }))
      for (const d of res.docs as any[]) {
        const self = `${getPath(collection, d).replace(/\/+$/, '')}/`.toLowerCase()
        pathById.set(`${collection}:${d.id}`, self)
        for (const t of countLinks(d.contentHtml || '').targets) if (t !== self) map.set(t, (map.get(t) ?? 0) + 1)
      }
    }
    cache = { at: Date.now(), map }
    building = null
    return map
  })()
  return building
}
export const bustLinkIndex = () => { cache = null }
