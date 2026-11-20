import { NextResponse } from 'next/server'
import { getClient } from '@/lib/data'
import { unlockCookie, unlockToken } from '@/lib/postPassword'
import { getPath } from '@/lib/urls'

export const dynamic = 'force-dynamic'
const tries = new Map<string, number[]>()

/** Password-protected posts: POST form (id, password) → cookie for 10 days → back to the post. */
export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  const now = Date.now()
  const t = (tries.get(ip) ?? []).filter((x) => now - x < 60_000)
  t.push(now); tries.set(ip, t)
  const form = await req.formData().catch(() => null)
  const id = String(form?.get('id') || '')
  const password = String(form?.get('post_password') || '')
  const payload = await getClient()
  const doc: any = id ? await payload.findByID({ collection: 'posts', id, depth: 0, overrideAccess: true }).catch(() => null) : null
  if (!doc || doc._status !== 'published' || doc.visibility !== 'password') return new NextResponse('Not found', { status: 404 })
  const back = new URL(`${getPath('posts', doc).replace(/\/$/, '')}/`, req.url)
  if (t.length > 8 || password !== doc.postPassword) {
    const bad = NextResponse.redirect(back, 303)
    bad.cookies.set('avpp_err', String(doc.id), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 30 })
    return bad
  }
  const res = NextResponse.redirect(back, 303)
  res.cookies.delete('avpp_err')
  res.cookies.set(unlockCookie(doc.id), unlockToken(doc.id, password), { httpOnly: true, sameSite: 'lax', secure: back.protocol === 'https:', path: '/', maxAge: 10 * 24 * 3600 })
  return res
}
