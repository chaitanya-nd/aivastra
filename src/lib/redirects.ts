import { getClient } from '@/lib/data'
import { getPath } from '@/lib/urls'

type Rule = { id: number; from: string; comparison: string; ignoreCase: boolean; type: string; dest: string | null }
let cache: { at: number; rules: Rule[] } | null = null
const TTL = 15_000

async function rules(): Promise<Rule[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.rules
  const payload = await getClient()
  const res = await payload.find({ collection: 'redirects', where: { active: { not_equals: false } }, limit: 2000, pagination: false, depth: 1 })
  const rs = (res.docs as any[]).map((r) => {
    const to = r.to || {}
    const ref = to.reference?.value
    const dest = to.url || (ref && typeof ref === 'object' ? getPath(to.reference.relationTo, ref) : null)
    return { id: r.id, from: String(r.from ?? ''), comparison: r.comparison || 'exact', ignoreCase: r.ignoreCase !== false, type: String(r.type || '301'), dest }
  })
  cache = { at: Date.now(), rules: rs }
  return rs
}
export const bustRedirectCache = () => { cache = null }

function matches(r: Rule, path: string): boolean {
  const clean = path.replace(/\/+$/, '') || '/'
  const norm = (s: string) => (r.ignoreCase ? s.toLowerCase() : s)
  const a = norm(clean)
  const from = norm(r.from.replace(/\/+$/, ''))
  const bare = (s: string) => s.replace(/^\//, '')
  switch (r.comparison) {
    case 'contains': return a.includes(from.replace(/^\//, '')) 
    case 'start': return bare(a).startsWith(bare(from))
    case 'end': return a.endsWith(from)
    case 'regex':
      try { const re = new RegExp(r.from, r.ignoreCase ? 'i' : ''); return re.test(bare(clean)) || re.test(clean) } catch { return false }
    default: return bare(a) === bare(from)
  }
}

/** First active Rank Math-style rule matching the request path (exact rules take priority). */
export async function matchRedirect(path: string, query = '') {
  const rs = await rules()
  const hit = rs.find((r) => r.comparison === 'exact' && matches(r, path)) ?? rs.find((r) => r.comparison !== 'exact' && matches(r, path))
  if (!hit) return null
  getClient().then((p) => p.find({ collection: 'redirects', where: { id: { equals: hit.id } }, limit: 1, depth: 0 }).then((d: any) => p.update({ collection: 'redirects', id: hit.id, data: { hits: (d.docs[0]?.hits ?? 0) + 1, lastAccessed: new Date().toISOString() } as any, depth: 0, context: { disableRevalidate: true } }))).catch(() => {})
  const code = Number(hit.type)
  if (code === 410 || code === 451) return { code, to: null as string | null }
  if (!hit.dest) return null
  let to = hit.dest
  if (!/^https?:/.test(to) && !to.endsWith('/') && !to.includes('?') && !to.includes('#')) to += '/'
  return { code, to: to + (query && !to.includes('?') ? query : '') }
}
