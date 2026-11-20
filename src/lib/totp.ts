import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

/** RFC 6238 TOTP (Google Authenticator, 1Password, Authy …): 30 s steps, 6 digits, SHA-1. */
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
export const newSecret = () => {
  const b = randomBytes(20)
  let bits = '', out = ''
  for (const x of b) bits += x.toString(2).padStart(8, '0')
  for (let i = 0; i + 5 <= bits.length; i += 5) out += B32[parseInt(bits.slice(i, i + 5), 2)]
  return out
}
const decode = (s: string) => {
  let bits = ''
  for (const c of s.replace(/=+$/, '').toUpperCase()) { const v = B32.indexOf(c); if (v >= 0) bits += v.toString(2).padStart(5, '0') }
  const out: number[] = []
  for (let i = 0; i + 8 <= bits.length; i += 8) out.push(parseInt(bits.slice(i, i + 8), 2))
  return Buffer.from(out)
}
const hotp = (key: Buffer, counter: number) => {
  const c = Buffer.alloc(8)
  c.writeBigUInt64BE(BigInt(counter))
  const h = createHmac('sha1', key).update(c).digest()
  const o = h[h.length - 1] & 15
  return String(((h.readUInt32BE(o) & 0x7fffffff) % 1_000_000)).padStart(6, '0')
}
/** Accepts the current code and one step either side (clock drift). */
export function verifyTotp(secret: string, code: string) {
  const c = code.replace(/\s/g, '')
  if (!/^\d{6}$/.test(c) || !secret) return false
  const key = decode(secret)
  const now = Math.floor(Date.now() / 30_000)
  return [-1, 0, 1].some((d) => { const exp = Buffer.from(hotp(key, now + d)); const got = Buffer.from(c); return exp.length === got.length && timingSafeEqual(exp, got) })
}
export const otpauthUri = (secret: string, account: string, issuer = 'AI Vastra CMS') =>
  `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`

export const recoveryCodes = () => Array.from({ length: 8 }, () => randomBytes(5).toString('hex').replace(/(.{5})/, '$1-'))
export const hashCode = (c: string) => createHmac('sha256', process.env.PAYLOAD_SECRET || '').update(c.trim().toLowerCase()).digest('hex')

/** Second-factor cookie: "<userId>.<sid>.<expires>.<sig>" — valid only for that user and login session. */
export const MFA_COOKIE = 'av-mfa'
const sig = (v: string) => createHmac('sha256', `mfa:${process.env.PAYLOAD_SECRET || ''}`).update(v).digest('base64url')
export const mfaCookieValue = (userId: string | number, sid: string, ttlSec: number) => { const v = `${userId}.${sid || '-'}.${Date.now() + ttlSec * 1000}`; return `${v}.${sig(v)}` }
export function mfaCookieValid(cookie: string | undefined, userId: string | number, sid: string | undefined) {
  if (!cookie) return false
  const parts = cookie.split('.')
  if (parts.length !== 4) return false
  const [u, s, exp, mac] = parts
  const expect = Buffer.from(sig(`${u}.${s}.${exp}`)), got = Buffer.from(mac)
  return expect.length === got.length && timingSafeEqual(expect, got) && u === String(userId) && s === (sid || '-') && Number(exp) > Date.now()
}
/** Session claims from Payload's token (signature is verified by Payload on every real request). */
export function tokenClaims(token: string | undefined): any {
  if (!token) return null
  try { return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8')) } catch { return null }
}
