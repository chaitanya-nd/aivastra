/**
 * Pre-launch parity check: fetch every imported URL from the LIVE WordPress site and from this build,
 * then compare status, redirect, <title>, meta description, canonical, <h1>, robots and JSON-LD types.
 *
 *   pnpm crawl:diff                         # live https://aivastra.com  vs  local http://localhost:3100
 *   pnpm crawl:diff --live https://aivastra.com --local https://staging.aivastra.com --limit 25
 *
 * Writes reports/crawl-diff.json and prints a summary. Exit code 1 if any URL has a blocking difference.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const arg = (n: string, d: string) => (process.argv.includes(`--${n}`) ? process.argv[process.argv.indexOf(`--${n}`) + 1] : d)
const LIVE = arg('live', 'https://aivastra.com').replace(/\/$/, '')
const LOCAL = arg('local', 'http://localhost:3100').replace(/\/$/, '')
const LIMIT = Number(arg('limit', '0'))
const CONCURRENCY = Number(arg('concurrency', '3'))
const WP = JSON.parse(fs.readFileSync(path.join(here, '../seed/wp-full.json'), 'utf8'))

type Item = { id: number; type: string; status: string; slug: string; parent: number }
const items: Item[] = WP.items
const pages = new Map(items.filter((i) => i.type === 'page').map((p) => [p.id, p]))
const BASE: Record<string, string> = { post: '', guide: '/guide', case: '/case', update: '/updates', review: '/review' }
const urlOf = (i: Item): string => {
  if (i.type === 'page') {
    if (String(i.id) === String(WP.site.page_on_front)) return '/'
    const parts: string[] = []
    for (let c: Item | undefined = i; c; c = pages.get(c.parent)) parts.unshift(c.slug)
    return `/${parts.join('/')}/`
  }
  return `${BASE[i.type]}/${i.slug}/`
}

const NAMED: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', hellip: '…' }
const decode = (s = '') =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? Number.parseInt(e.slice(2), 16) : Number.parseInt(e.slice(1), 10))
    return NAMED[e.toLowerCase()] ?? m
  }).replace(/\u00a0/g, ' ')
const norm = (s?: string | null) => decode(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const pick = (html: string, re: RegExp) => re.exec(html)?.[1]

async function snapshot(base: string, p: string) {
  try {
    const res = await fetch(base + p, { redirect: 'manual', headers: { 'User-Agent': 'aivastra-crawl-diff/1.0' } })
    const status = res.status
    if (status >= 300 && status < 400) return { status, redirect: new URL(res.headers.get('location') || '', base).pathname }
    const html = await res.text()
    const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].flatMap((m) => {
      try {
        const j = JSON.parse(m[1])
        return (Array.isArray(j['@graph']) ? j['@graph'] : [j]).map((n: any) => String(n['@type']))
      } catch { return [] }
    })
    const canonical = pick(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ?? pick(html, /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)
    return {
      status,
      title: norm(pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i)),
      description: norm(pick(html, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ?? pick(html, /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i)),
      canonical: canonical ? new URL(canonical, base).pathname : undefined,
      h1: norm(pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)),
      robots: norm(pick(html, /<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i)),
      jsonld: [...new Set(ld)].sort(),
    }
  } catch (e: any) {
    return { status: 0, error: String(e?.cause?.code || e?.message || e) }
  }
}

async function main() {
  let targets = items.filter((i) => i.status === 'publish' && i.slug).map((i) => ({ type: i.type, path: urlOf(i) }))
  if (LIMIT) targets = targets.slice(0, LIMIT)
  console.log(`Comparing ${targets.length} URLs\n  live : ${LIVE}\n  local: ${LOCAL}\n`)
  const report: any[] = []
  let idx = 0
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (idx < targets.length) {
        const t = targets[idx++]
        const [live, local] = [await snapshot(LIVE, t.path), await snapshot(LOCAL, t.path)]
        const diffs: { field: string; live: unknown; local: unknown; blocking: boolean }[] = []
        const cmp = (field: string, blocking: boolean, a: any, b: any) => JSON.stringify(a) !== JSON.stringify(b) && diffs.push({ field, live: a, local: b, blocking })
        cmp('status', true, live.status, local.status)
        cmp('redirect', true, (live as any).redirect, (local as any).redirect)
        if (live.status === 200 && local.status === 200) {
          const l = live as any, c = local as any
          cmp('title', true, l.title, c.title)
          cmp('description', true, l.description, c.description)
          cmp('canonical', true, l.canonical, c.canonical)
          cmp('h1', false, l.h1, c.h1)
          cmp('jsonld', false, l.jsonld, c.jsonld)
          // local/staging is noindex on purpose; only flag robots if the live page is indexable and local claims otherwise at production
          if (LOCAL.startsWith('https://aivastra.com')) cmp('robots', true, l.robots, c.robots)
        }
        report.push({ ...t, live, local, diffs })
        process.stdout.write(diffs.some((d) => d.blocking) ? 'x' : diffs.length ? '~' : '.')
      }
    }),
  )
  fs.mkdirSync(path.join(here, '../reports'), { recursive: true })
  fs.writeFileSync(path.join(here, '../reports/crawl-diff.json'), JSON.stringify(report, null, 1))
  const blocking = report.filter((r) => r.diffs.some((d: any) => d.blocking))
  const minor = report.filter((r) => r.diffs.length && !r.diffs.some((d: any) => d.blocking))
  console.log(`\n\n✔ identical: ${report.length - blocking.length - minor.length}   ~ minor diffs: ${minor.length}   ✗ blocking: ${blocking.length}`)
  const byField: Record<string, number> = {}
  for (const r of report) for (const d of r.diffs) byField[d.field] = (byField[d.field] || 0) + 1
  console.log('diffs by field:', byField)
  for (const r of blocking.slice(0, 12)) {
    console.log(`\n${r.path}`)
    for (const d of r.diffs.filter((d: any) => d.blocking)) console.log(`  ${d.field}: live=${JSON.stringify(d.live)?.slice(0, 90)}  local=${JSON.stringify(d.local)?.slice(0, 90)}`)
  }
  console.log('\nFull report: reports/crawl-diff.json')
  process.exit(blocking.length ? 1 : 0)
}
main()
