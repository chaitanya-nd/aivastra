import { type NextRequest, NextResponse } from 'next/server'
import { isProduction } from '@/lib/env'

/**
 * Keep WordPress-style trailing-slash URLs for the public site only
 * (/blog/ /my-post/), while leaving /api, /admin and files untouched.
 *   /my-post   → 308 → /my-post/
 *   /my-post/  → served by the route at /my-post (internal rewrite)
 */
export async function proxy(req: NextRequest) {
  const res = (await redirectRule(req)) ?? route(req)
  if (!isProduction) res.headers.set('X-Robots-Tag', 'noindex, nofollow')
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
  matcher: [
    // everything except: api, admin, next internals, and any path containing a file extension
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
}
