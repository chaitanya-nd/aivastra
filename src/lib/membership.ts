import type { Payload } from 'payload'

const hits = new Map<string, number[]>()
export const rateLimited = (key: string, max = 6, windowMs = 10 * 60_000) => {
  const now = Date.now()
  const a = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  a.push(now); hits.set(key, a)
  return a.length > max
}
export const clientIp = (req: Request) => (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'

/** Same cookie Payload's own login sets, so the visitor is recognised by comments (and the admin, for staff). */
export function authCookie(payload: Payload, token: string, secure: boolean) {
  const users: any = payload.collections.users.config
  const maxAge = Number(users.auth?.tokenExpiration) || 7200
  return { name: `${payload.config.cookiePrefix || 'payload'}-token`, value: token, options: { httpOnly: true, sameSite: 'lax' as const, secure, path: '/', maxAge } }
}
/** Only same-site relative paths are allowed as a redirect target. */
export const safeBack = (v: unknown) => (typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') ? v : '/')
