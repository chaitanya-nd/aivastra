import { getClient } from './data'

type Rule = { words: string[]; url: string; caseSensitive: boolean; newTab: boolean; nofollow: boolean; max: number }
let cache: { at: number; rules: Rule[] } | null = null

export async function autoLinkRules(): Promise<Rule[]> {
  if (cache && Date.now() - cache.at < 60_000) return cache.rules
  const payload = await getClient()
  const res = await payload.find({ collection: 'auto-links' as any, where: { active: { not_equals: false } }, pagination: false, limit: 500, depth: 0, overrideAccess: true }).catch(() => ({ docs: [] as any[] }))
  const rules = (res.docs as any[]).map((d) => ({ words: String(d.keyword || '').split(',').map((w) => w.trim()).filter(Boolean).sort((a, b) => b.length - a.length), url: String(d.url || ''), caseSensitive: Boolean(d.caseSensitive), newTab: Boolean(d.newTab), nofollow: Boolean(d.nofollow), max: Number(d.maxPerPage) || 1 })).filter((r) => r.words.length && r.url)
  cache = { at: Date.now(), rules }
  return rules
}
export const bustAutoLinks = () => { cache = null }

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const norm = (u: string) => u.replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/, '').toLowerCase() || '/'

/** Links the first unlinked mention(s) of each keyword, outside <a>, headings, code, buttons, script/style and attributes. */
export function applyAutoLinks(html: string, rules: Rule[], selfPath?: string) {
  if (!rules.length || !html) return html
  const self = selfPath ? norm(selfPath) : ''
  const tokens = html.split(/(<[^>]+>)/)
  const skip: string[] = []
  const used = new Map<Rule, number>()
  const already = new Set([...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map((m) => norm(m[1])))
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t.startsWith('<')) {
      const m = t.match(/^<(\/)?([a-z0-9]+)/i)
      if (m && /^(a|h[1-6]|code|pre|button|script|style|figcaption|label)$/i.test(m[2])) {
        if (m[1]) { const k = skip.lastIndexOf(m[2].toLowerCase()); if (k >= 0) skip.splice(k, 1) } else if (!t.endsWith('/>')) skip.push(m[2].toLowerCase())
      }
      continue
    }
    if (skip.length || !t.trim()) continue
    let text = t
    for (const r of rules) {
      if (norm(r.url) === self || (used.get(r) ?? 0) >= r.max || already.has(norm(r.url))) continue
      const re = new RegExp(`(^|[^\\p{L}\\p{N}-])(${r.words.map(esc).join('|')})(?=$|[^\\p{L}\\p{N}-])`, r.caseSensitive ? 'u' : 'iu')
      const m = text.match(re)
      if (!m || m.index === undefined) continue
      const start = m.index + m[1].length
      const attrs = `${r.newTab ? ' target="_blank"' : ''}${r.nofollow || r.newTab ? ` rel="${[r.nofollow ? 'nofollow' : '', r.newTab ? 'noopener' : ''].filter(Boolean).join(' ')}"` : ''}`
      text = `${text.slice(0, start)}<a href="${r.url.replace(/"/g, '&quot;')}" class="av-autolink"${attrs}>${m[2]}</a>${text.slice(start + m[2].length)}`
      used.set(r, (used.get(r) ?? 0) + 1)
      already.add(norm(r.url))
    }
    tokens[i] = text
  }
  return tokens.join('')
}
