import type { Payload } from 'payload'
import { LINK_COLLECTIONS, internalPath } from './linkIndex'
import { getPath, SITE_URL } from './urls'

export type Broken = { url: string; status: number | string; sources: { collection: string; id: number; title: string }[] }
let last: { at: string; running: boolean; checked: number; broken: Broken[] } = { at: '', running: false, checked: 0, broken: [] }
export const brokenReport = () => last

/** Checks every link in published content: internal paths against the site, external URLs with HEAD/GET (8 at a time). */
export async function runBrokenLinkScan(payload: Payload, origin: string) {
  if (last.running) return last
  last = { ...last, running: true }
  try {
    const where = new Map<string, Broken['sources']>()
    for (const collection of LINK_COLLECTIONS) {
      const res = await payload.find({ collection, where: { _status: { equals: 'published' } }, pagination: false, limit: 5000, depth: 0, overrideAccess: true, select: { title: true, contentHtml: true } as any })
      for (const d of res.docs as any[]) {
        for (const m of String(d.contentHtml || '').matchAll(/<a\b[^>]*\bhref=["']([^"'#]+)["']/gi)) {
          const href = m[1].trim()
          if (/^(mailto|tel|javascript|data):/i.test(href)) continue
          const ip = internalPath(href)
          const key = ip ? ip : /^https?:\/\//i.test(href) ? href : null
          if (!key) continue
          const list = where.get(key) ?? []
          if (!list.some((x) => x.id === d.id && x.collection === collection)) list.push({ collection, id: d.id, title: d.title })
          where.set(key, list)
        }
      }
    }
    const urls = [...where.keys()]
    const broken: Broken[] = []
    const check = async (u: string) => {
      const target = u.startsWith('/') ? `${origin}${u}` : u
      const hit = async (method: string) => fetch(target, { method, redirect: 'follow', signal: AbortSignal.timeout(10_000), headers: { 'user-agent': 'Mozilla/5.0 (compatible; AIVastraLinkChecker/1.0)', ...(u.startsWith('/') ? { 'x-av-internal': process.env.PAYLOAD_SECRET || '' } : {}) } })
      try {
        let r = await hit('HEAD')
        if (r.status === 405 || r.status === 403 || r.status === 501) r = await hit('GET')
        if (r.status >= 400) broken.push({ url: u.startsWith('/') ? `${SITE_URL}${u}` : u, status: r.status, sources: where.get(u)! })
      } catch (e: any) {
        broken.push({ url: u.startsWith('/') ? `${SITE_URL}${u}` : u, status: e?.name === 'TimeoutError' ? 'timeout' : 'unreachable', sources: where.get(u)! })
      }
    }
    for (let i = 0; i < urls.length; i += 8) await Promise.all(urls.slice(i, i + 8).map(check))
    last = { at: new Date().toISOString(), running: false, checked: urls.length, broken: broken.sort((a, b) => b.sources.length - a.sources.length) }
  } catch {
    last = { ...last, running: false }
  }
  return last
}

/** Published items no other published item links to. */
export async function orphans(payload: Payload, incoming: Map<string, number>) {
  const out: { collection: string; id: number; title: string; path: string }[] = []
  for (const collection of LINK_COLLECTIONS) {
    const res = await payload.find({ collection, where: { _status: { equals: 'published' } }, pagination: false, limit: 5000, depth: 0, overrideAccess: true, select: { title: true, slug: true, breadcrumbs: true } as any })
    for (const d of res.docs as any[]) {
      const p = `${getPath(collection, d).replace(/\/+$/, '')}/`.toLowerCase()
      if (d.slug === 'home' || p === '/') continue
      if (!incoming.get(p)) out.push({ collection, id: d.id, title: d.title, path: p })
    }
  }
  return out
}
