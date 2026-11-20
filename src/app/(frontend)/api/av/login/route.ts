import { NextResponse } from 'next/server'
import { getClient } from '@/lib/data'
import { authCookie, clientIp, rateLimited, safeBack } from '@/lib/membership'

export const dynamic = 'force-dynamic'

/** Front-end login (wp-login.php): staff go to /admin, subscribers back to where they came from. */
export async function POST(req: Request) {
  const f = await req.formData().catch(() => null)
  const back = safeBack(f?.get('redirect_to'))
  const fail = (msg: string) => NextResponse.redirect(new URL(`/login/?error=${encodeURIComponent(msg)}&redirect_to=${encodeURIComponent(back)}`, req.url), 303)
  if (!f) return fail('Please try again.')
  if (rateLimited(`login:${clientIp(req)}`, 10)) return fail('Too many attempts. Please wait a few minutes.')
  const email = String(f.get('email') || '').trim().toLowerCase()
  const password = String(f.get('password') || '')
  const payload = await getClient()
  try {
    const found: any = (await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
    if (found && found.emailVerified === false) return fail('Please confirm your email address first — check your inbox for the link.')
    const { token, user } = await payload.login({ collection: 'users', data: { email, password }, overrideAccess: true })
    const staff = (user as any)?.role && (user as any).role !== 'subscriber'
    // Staff with two-factor login finish at /mfa/ (the admin is gated until then)
    const dest = staff && (user as any).totpEnabled ? `/mfa/?next=${encodeURIComponent(back === '/' ? '/admin' : back)}` : staff && back === '/' ? '/admin' : back
    const res = NextResponse.redirect(new URL(dest, req.url), 303)
    if (token) { const c = authCookie(payload, token, new URL(req.url).protocol === 'https:'); res.cookies.set(c.name, c.value, c.options) }
    return res
  } catch {
    return fail('Unknown email address or incorrect password.')
  }
}
