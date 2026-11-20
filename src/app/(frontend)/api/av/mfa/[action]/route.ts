import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { getClient } from '@/lib/data'
import { clientIp, rateLimited, safeBack } from '@/lib/membership'
import { hashCode, MFA_COOKIE, mfaCookieValue, newSecret, otpauthUri, recoveryCodes, tokenClaims, verifyTotp } from '@/lib/totp'

export const dynamic = 'force-dynamic'
const TTL = 60 * 60 * 12

async function me(req: Request) {
  const payload = await getClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return null
  const full: any = await payload.findByID({ collection: 'users', id: user.id, depth: 0, overrideAccess: true, showHiddenFields: true })
  return { payload, user: full }
}
const sidOf = (req: Request) => tokenClaims(req.headers.get('cookie')?.match(/(?:^|;\s*)payload-token=([^;]+)/)?.[1])?.sid || ''
const withCookie = (res: NextResponse, req: Request, userId: string | number) => {
  res.cookies.set(MFA_COOKIE, mfaCookieValue(userId, sidOf(req), TTL), { httpOnly: true, sameSite: 'lax', secure: new URL(req.url).protocol === 'https:', path: '/', maxAge: TTL })
  return res
}
/** A TOTP code or an unused recovery code (which is then consumed). */
async function check(ctx: NonNullable<Awaited<ReturnType<typeof me>>>, code: string, secret = ctx.user.totpSecret) {
  if (verifyTotp(secret, code)) return true
  const codes: string[] = Array.isArray(ctx.user.recoveryCodes) ? ctx.user.recoveryCodes : []
  const h = hashCode(code)
  if (!codes.includes(h)) return false
  await ctx.payload.update({ collection: 'users', id: ctx.user.id, data: { recoveryCodes: codes.filter((c) => c !== h) } as any, overrideAccess: true, context: { skipActivity: true } })
  return true
}

export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params
  if (rateLimited(`mfa:${clientIp(req)}`, 12, 5 * 60_000)) return NextResponse.json({ error: 'Too many attempts. Wait a few minutes.' }, { status: 429 })
  const ctx = await me(req)
  const isForm = (req.headers.get('content-type') || '').includes('form')
  const body: any = isForm ? Object.fromEntries((await req.formData()).entries()) : await req.json().catch(() => ({}))
  const code = String(body.code || '').trim()

  if (action === 'verify') {
    const next = safeBack(body.next || '/admin')
    if (!ctx) return NextResponse.redirect(new URL('/admin/login', req.url), 303)
    if (!ctx.user.totpEnabled) return NextResponse.redirect(new URL(next, req.url), 303)
    if (!(await check(ctx, code))) return NextResponse.redirect(new URL(`/mfa/?error=1&next=${encodeURIComponent(next)}`, req.url), 303)
    return withCookie(NextResponse.redirect(new URL(next, req.url), 303), req, ctx.user.id)
  }
  if (!ctx) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const { payload, user } = ctx

  if (action === 'setup') {
    const secret = newSecret()
    await payload.update({ collection: 'users', id: user.id, data: { totpPending: secret } as any, overrideAccess: true, context: { skipActivity: true } })
    const uri = otpauthUri(secret, user.email)
    return NextResponse.json({ secret, uri, qr: await QRCode.toDataURL(uri, { margin: 1, width: 220 }) })
  }
  if (action === 'enable') {
    if (!user.totpPending || !verifyTotp(user.totpPending, code)) return NextResponse.json({ error: 'That code is not valid. Check the time on your phone and try again.' }, { status: 400 })
    const codes = recoveryCodes()
    await payload.update({ collection: 'users', id: user.id, data: { totpSecret: user.totpPending, totpPending: null, totpEnabled: true, recoveryCodes: codes.map(hashCode) } as any, overrideAccess: true })
    return withCookie(NextResponse.json({ ok: true, recoveryCodes: codes }), req, user.id)
  }
  if (action === 'disable') {
    if (!user.totpEnabled || !(await check(ctx, code))) return NextResponse.json({ error: 'Enter a current code (or a recovery code) to turn two-factor login off.' }, { status: 400 })
    await payload.update({ collection: 'users', id: user.id, data: { totpSecret: null, totpPending: null, totpEnabled: false, recoveryCodes: null } as any, overrideAccess: true })
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 404 })
}
