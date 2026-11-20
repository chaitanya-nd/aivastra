import { NextResponse } from 'next/server'
import { getClient, getPluginSettings } from '@/lib/data'
import { randomBytes } from 'node:crypto'
import { outboundAllowed } from '@/lib/env'
import { authCookie, clientIp, rateLimited, safeBack } from '@/lib/membership'
import { SITE_URL } from '@/lib/urls'

export const dynamic = 'force-dynamic'

/** WordPress "Anyone can register": creates a Subscriber (comment-only, no admin access) and logs them in. */
export async function POST(req: Request) {
  const ps: any = await getPluginSettings().catch(() => null)
  if (!ps?.usersCanRegister) return new NextResponse('Registration is closed', { status: 404 })
  const f = await req.formData().catch(() => null)
  const back = safeBack(f?.get('redirect_to'))
  const fail = (msg: string) => NextResponse.redirect(new URL(`/register/?error=${encodeURIComponent(msg)}&redirect_to=${encodeURIComponent(back)}`, req.url), 303)
  if (!f || f.get('website_url')) return NextResponse.redirect(new URL('/', req.url), 303) // honeypot
  if (rateLimited(`reg:${clientIp(req)}`, 4)) return fail('Too many attempts. Please try again later.')
  const name = String(f.get('name') || '').trim().slice(0, 80)
  const email = String(f.get('email') || '').trim().toLowerCase().slice(0, 120)
  const password = String(f.get('password') || '')
  if (!name) return fail('Please enter your name.')
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail('Please enter a valid email address.')
  if (password.length < 10) return fail('Use a password of at least 10 characters.')
  const payload = await getClient()
  const exists = await payload.count({ collection: 'users', where: { email: { equals: email } }, overrideAccess: true })
  if (exists.totalDocs) return fail('An account with this email already exists. Please log in.')
  // With outbound mail available, the address must be confirmed before the account can sign in.
  if (outboundAllowed) {
    const verifyToken = randomBytes(24).toString('hex')
    await payload.create({ collection: 'users', overrideAccess: true, data: { name, email, password, role: 'subscriber', emailVerified: false, verifyToken } as any })
    void payload.sendEmail({ to: email, subject: 'Confirm your email address', text: `Hi ${name},\n\nPlease confirm your email address to finish creating your account:\n${SITE_URL}/api/av/account/verify?token=${verifyToken}&next=${encodeURIComponent(back)}\n\nIf you did not sign up, ignore this email.` }).catch(() => {})
    return NextResponse.redirect(new URL('/register/?check=1', req.url), 303)
  }
  await payload.create({ collection: 'users', overrideAccess: true, data: { name, email, password, role: 'subscriber', emailVerified: true } as any })
  const { token } = await payload.login({ collection: 'users', data: { email, password }, overrideAccess: true })
  const res = NextResponse.redirect(new URL(back, req.url), 303)
  if (token) { const c = authCookie(payload, token, new URL(req.url).protocol === 'https:'); res.cookies.set(c.name, c.value, c.options) }
  return res
}
