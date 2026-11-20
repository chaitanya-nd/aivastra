import { type NextRequest, NextResponse } from 'next/server'
import { hostIndexable, isProduction } from '@/lib/env'
import { MFA_COOKIE, mfaCookieValid, tokenClaims } from '@/lib/totp'

const ROBOTS = 'noindex, nofollow, noarchive, nosnippet, noimageindex'
const SECRET = process.env.PAYLOAD_SECRET || ''

const isPublicPath = (p: string) => !/^\/(api|admin|_next|_vercel)(\/|$)/.test(p) && !/\.[^/]*$/.test(p)

/** "Block search engines" switch from the database (Admin → Search visibility), cached for 10 s. Fails closed. */
type Maint = { title: string; message: string; site: string } | null
let dbCache: { at: number; blocked: boolean; maintenance: Maint } | null = null
async function dbState(req: NextRequest) {
  if (dbCache && Date.now() - dbCache.at < 10_000) return dbCache
  let blocked = true
  let maintenance: Maint = null
  try {
    const r = await fetch(`${req.nextUrl.origin}/api/av/indexing`, { headers: { 'x-av-internal': SECRET }, cache: 'no-store' })
    if (r.ok) { const j = (await r.json()) as { blocked?: boolean; maintenance?: Maint }; blocked = Boolean(j.blocked ?? true); maintenance = j.maintenance ?? null }
  } catch { /* fail closed */ }
  dbCache = { at: Date.now(), blocked, maintenance }
  return dbCache
}
const dbBlocked = async (req: NextRequest) => (await dbState(req)).blocked

/** Staff (any role but subscriber) still see the site in maintenance mode. Role is read from the session token's claims. */
function isStaffSession(req: NextRequest) {
  const t = req.cookies.get('payload-token')?.value
  if (!t) return false
  try {
    const claims = JSON.parse(Buffer.from(t.split('.')[1], 'base64url').toString('utf8'))
    return Boolean(claims.role && claims.role !== 'subscriber' && (!claims.exp || claims.exp * 1000 > Date.now()))
  } catch { return false }
}
const escHtml = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
function maintenancePage(m: NonNullable<Maint>) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escHtml(m.title)}${m.site ? ` – ${escHtml(m.site)}` : ''}</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0d14;color:#e8eaf2;font:16px/1.6 system-ui,sans-serif;padding:24px}main{max-width:520px;text-align:center}h1{font-size:30px;margin:0 0 12px;letter-spacing:-.02em}p{color:#9aa1b5;margin:0}</style></head><body><main><h1>${escHtml(m.title)}</h1><p>${escHtml(m.message)}</p></main></body></html>`
  return new NextResponse(html, { status: 503, headers: { 'content-type': 'text/html; charset=utf-8', 'retry-after': '3600', 'cache-control': 'no-store', 'X-Robots-Tag': ROBOTS } })
}

const withRobots = (r: NextResponse) => { r.headers.set('X-Robots-Tag', ROBOTS); return r }

/** Two-factor login: a session whose user has 2FA on may not use /admin or the API until the second step is done. */
const MFA_OPEN = /^\/(api\/users\/(logout|me|refresh-token)|api\/av\/(mfa|indexing|redirect)|admin\/(login|logout|forgot|reset))(\/|$)/
function mfaGate(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl
  if (!/^\/(admin|api)(\/|$)/.test(pathname) || MFA_OPEN.test(pathname)) return null
  if (SECRET && req.headers.get('x-av-internal') === SECRET) return null
  const claims = tokenClaims(req.cookies.get('payload-token')?.value)
  if (!claims?.totpEnabled) return null
  if (mfaCookieValid(req.cookies.get(MFA_COOKIE)?.value, claims.id, claims.sid)) return null
  if (pathname.startsWith('/api')) return NextResponse.json({ errors: [{ message: 'Two-factor verification required.' }] }, { status: 401 })
  const u = new URL('/mfa/', req.url)
  u.searchParams.set('next', pathname + req.nextUrl.search)
  return NextResponse.redirect(u, 303)
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const mfa = mfaGate(req)
  if (mfa) return withRobots(mfa)
  // Old WordPress login / dashboard bookmarks
  if (pathname === '/wp-login.php') return withRobots(NextResponse.redirect(new URL(req.nextUrl.searchParams.get('action') === 'register' ? '/register/' : '/login/', req.url), 302))
  // WordPress attachment pages
  if (req.nextUrl.searchParams.has('attachment_id')) { const u = req.nextUrl.clone(); u.pathname = '/api/av/attachment'; return NextResponse.rewrite(u) }
  // Feeds: /x/feed/, /x/feed/atom/, /comments/feed/ … → the feed handler
  if (/\/feed(\/(atom|rss2?))?\/?$/.test(pathname) && pathname !== '/feed' && pathname !== '/feed/') { const u = req.nextUrl.clone(); u.pathname = '/feed'; u.search = `?src=${encodeURIComponent(pathname)}`; const r = NextResponse.rewrite(u); return r }
  // IndexNow ownership file: /<32-hex-key>.txt
  const ik = pathname.match(/^\/([a-f0-9]{32})\.txt$/)
  if (ik) { const u = req.nextUrl.clone(); u.pathname = '/api/av/indexnow-key'; u.search = `?key=${ik[1]}`; return NextResponse.rewrite(u) }
  if (/^\/wp-admin(\/|$)/.test(pathname)) return withRobots(NextResponse.redirect(new URL('/admin', req.url), 302))
  // Maintenance mode (Settings → General): visitors get 503 + Retry-After; staff, /admin and /api keep working.
  if (isPublicPath(pathname) && req.headers.get('x-av-internal') !== SECRET && !/^\/(login|register|lost-password|reset-password|mfa)(\/|$)/.test(pathname) && !isStaffSession(req)) {
    const m = (await dbState(req)).maintenance
    if (m) return maintenancePage(m)
  }
  const res = isPublicPath(pathname) ? ((await redirectRule(req)) ?? route(req)) : NextResponse.next()
  // Crawl block on EVERY response (pages, admin, API, images): wrong env, wrong host, or switch ON → noindex.
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
  const blocked = !isProduction || !hostIndexable(host) || (pathname.startsWith('/api/av/') ? true : await dbBlocked(req))
  if (blocked) res.headers.set('X-Robots-Tag', ROBOTS)
  return res
}

/** Rank Math Redirections: exact status codes (301/302/307, 410 Gone, 451) before any content is served. */
async function redirectRule(req: NextRequest): Promise<NextResponse | null> {
  if (req.method !== 'GET' && req.method !== 'HEAD') return null
  const { pathname, search } = req.nextUrl
  if (pathname === '/') return null
  try {
    const r = await fetch(`${req.nextUrl.origin}/api/av/redirect?path=${encodeURIComponent(pathname)}&q=${encodeURIComponent(search)}`, { headers: { 'x-av-internal': process.env.PAYLOAD_SECRET || '' }, cache: 'no-store' })
    const hit = (await r.json()) as { code: number; to: string | null } | null
    if (!hit) return null
    if (hit.code === 410 || hit.code === 451) {
      const label = hit.code === 410 ? 'Gone' : 'Unavailable For Legal Reasons'
      return new NextResponse(`<!doctype html><meta name="robots" content="noindex"><title>${hit.code} ${label}</title><h1>${hit.code} ${label}</h1><p>This content is no longer available.</p>`, { status: hit.code, headers: { 'content-type': 'text/html; charset=utf-8' } })
    }
    return NextResponse.redirect(new URL(hit.to!, req.url).toString(), hit.code)
  } catch {
    return null // never block the site if the lookup fails
  }
}

function route(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  if (pathname === '/') return NextResponse.next()

  if (!pathname.endsWith('/')) {
    // Plain URL (not NextURL) so the trailing slash is preserved.
    return NextResponse.redirect(new URL(`${pathname}/${search}`, req.url).toString(), 308)
  }
  const url = req.nextUrl.clone()
  url.pathname = pathname.replace(/\/+$/, '')
  return NextResponse.rewrite(url)
}


export const config = {
  // Everything except Next's own static assets, so the crawl block covers pages, /admin, /api and files.
  matcher: ['/((?!_next/static|_next/image).*)'],
}
