import { createHmac, timingSafeEqual } from 'node:crypto'

/** Cookie value proving the visitor typed the current password for this post (changing the password logs everyone out). */
export const unlockToken = (id: string | number, password: string) =>
  createHmac('sha256', process.env.PAYLOAD_SECRET || 'dev').update(`${id}:${password}`).digest('hex')
export const unlockCookie = (id: string | number) => `avpp_${id}`
export const tokenMatches = (cookie: string | undefined, id: string | number, password: string) => {
  if (!cookie || !password) return false
  const a = Buffer.from(cookie), b = Buffer.from(unlockToken(id, password))
  return a.length === b.length && timingSafeEqual(a, b)
}
