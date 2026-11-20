/**
 * Verify a deployed site cannot be indexed.   pnpm check:indexing https://test.example.com
 * Exits 1 if any crawler-facing signal would let search engines in. Use it after every deploy of a test copy.
 */
const [base] = process.argv.slice(2)
if (!base) { console.error('usage: pnpm check:indexing <url>'); process.exit(2) }
const site = base.replace(/\/$/, '')
const results: { ok: boolean; label: string; note: string }[] = []
const check = (ok: boolean, label: string, note = '') => results.push({ ok, label, note })
const get = (path: string) => fetch(site + path, { redirect: 'manual' })
const blockedHeader = (r: Response) => /noindex/i.test(r.headers.get('x-robots-tag') || '')

for (const path of ['/', '/blog/', '/admin/login', '/robots.txt', '/sitemap_index.xml', '/feed/', '/llms.txt']) {
  const r = await get(path)
  if (['/sitemap_index.xml', '/feed/', '/llms.txt'].includes(path)) check(r.status === 404, `${path} is not published`, `status ${r.status}`)
  else check(blockedHeader(r), `${path} sends X-Robots-Tag noindex`, r.headers.get('x-robots-tag') || 'header missing')
}
const robots = await (await get('/robots.txt')).text()
check(/^Disallow:\s*\/\s*$/m.test(robots) && !/^Allow:/m.test(robots) && !/^Sitemap:/mi.test(robots), 'robots.txt is "Disallow: /" with no Allow or Sitemap', robots.split('\n').slice(0, 3).join(' | '))
const home = await (await get('/')).text()
check(/<meta name="robots" content="[^"]*noindex/i.test(home), 'home page has <meta name="robots" noindex>')

for (const r of results) console.log(`${r.ok ? '✔' : '✘'} ${r.label}${r.note ? `  — ${r.note}` : ''}`)
const bad = results.filter((r) => !r.ok).length
console.log(bad ? `\n${bad} check(s) FAILED — do not leave this deployment online.` : '\nAll checks passed: this deployment is closed to search engines.')
process.exit(bad ? 1 : 0)
export {}
