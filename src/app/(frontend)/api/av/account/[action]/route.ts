import { NextResponse } from 'next/server'
import { getClient } from '@/lib/data'
import { outboundAllowed } from '@/lib/env'
import { authCookie, clientIp, rateLimited, safeBack } from '@/lib/membership'
import { SITE_URL } from '@/lib/urls'

export const dynamic = 'force-dynamic'
const go = (req: Request, path: string) => NextResponse.redirect(new URL(path, req.url), 303)

/** Front-end account actions: lost-password, reset-password, profile, verify (email confirmation link). */
export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params
  const f = await req.formData().catch(() => null)
  if (!f) return go(req, '/')
  const payload = await getClient()
  if (rateLimited(`acct:${action}:${clientIp(req)}`, 8)) return go(req, `/${action === 'profile' ? 'account' : action}/?error=${encodeURIComponent('Too many attempts. Please wait a few minutes.')}`)

  if (action === 'lost-password') {
    const email = String(f.get('email') || '').trim().toLowerCase()
    const user: any = (await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
    if (user) {
      const token = await payload.forgotPassword({ collection: 'users', data: { email }, disableEmail: true, overrideAccess: true } as any).catch(() => null)
      if (token && outboundAllowed) void payload.sendEmail({ to: email, subject: 'Password reset', text: `Someone asked to reset the password for ${email}.\n\nIf this was you, open this link within one hour:\n${SITE_URL}/reset-password/?token=${token}\n\nIf not, ignore this email.` }).catch(() => {})
      else if (token) payload.logger.info(`[lost-password] outbound mail is off on this deployment; reset link: ${SITE_URL}/reset-password/?token=${token}`)
    }
    // Same answer either way, so the form cannot be used to find accounts
    return go(req, '/lost-password/?sent=1')
  }

  if (action === 'reset-password') {
    const token = String(f.get('token') || '')
    const password = String(f.get('password') || '')
    if (password.length < 10) return go(req, `/reset-password/?token=${encodeURIComponent(token)}&error=${encodeURIComponent('Use a password of at least 10 characters.')}`)
    try {
      const r: any = await payload.resetPassword({ collection: 'users', data: { token, password }, overrideAccess: true })
      const res = go(req, r?.user?.role && r.user.role !== 'subscriber' ? '/admin' : '/account/?reset=1')
      if (r?.token) { const c = authCookie(payload, r.token, new URL(req.url).protocol === 'https:'); res.cookies.set(c.name, c.value, c.options) }
      return res
    } catch {
      return go(req, `/lost-password/?error=${encodeURIComponent('That reset link is invalid or has expired. Request a new one.')}`)
    }
  }

  if (action === 'profile') {
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return go(req, '/login/?redirect_to=/account/')
    const data: any = { name: String(f.get('name') || '').trim().slice(0, 80) || (user as any).name }
    const pw = String(f.get('password') || '')
    if (pw) {
      if (pw.length < 10) return go(req, `/account/?error=${encodeURIComponent('Use a password of at least 10 characters.')}`)
      data.password = pw
    }
    await payload.update({ collection: 'users', id: user.id, data, user, overrideAccess: false })
    return go(req, '/account/?saved=1')
  }
  return go(req, '/')
}

/** GET /api/av/account/verify?token=… — confirms a registration email, then signs the user in. */
export async function GET(req: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params
  if (action !== 'verify') return new NextResponse('Not found', { status: 404 })
  const token = new URL(req.url).searchParams.get('token') || ''
  const payload = await getClient()
  const user: any = token.length >= 32 ? (await payload.find({ collection: 'users', where: { verifyToken: { equals: token } }, limit: 1, depth: 0, overrideAccess: true, showHiddenFields: true })).docs[0] : null
  if (!user) return go(req, `/login/?error=${encodeURIComponent('That confirmation link is invalid or was already used.')}`)
  await payload.update({ collection: 'users', id: user.id, data: { emailVerified: true, verifyToken: null } as any, overrideAccess: true })
  return go(req, `/login/?verified=1&redirect_to=${encodeURIComponent(safeBack(new URL(req.url).searchParams.get('next')))}`)
}
