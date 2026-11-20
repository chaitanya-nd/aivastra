import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { COMMENTABLE } from '@/collections/Comments'
import { userCan } from '@/access/caps'
import { akismetIsSpam } from '@/lib/akismet'
import { commentSettings, commentsOpen, listComments, moderate } from '@/lib/comments'
import { getPath, SITE_URL } from '@/lib/urls'

export const dynamic = 'force-dynamic'

const hits = new Map<string, number[]>()
const limited = (ip: string) => {
  const now = Date.now()
  const a = (hits.get(ip) ?? []).filter((t) => now - t < 60_000)
  a.push(now); hits.set(ip, a)
  return a.length > 4
}
const clean = (v: unknown, n: number) => String(v ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, n)

/** GET ?doc=posts:12&page=2 → approved comments, threaded, paginated (used by "Older comments"). */
export async function GET(req: Request) {
  const u = new URL(req.url)
  const [coll, id] = (u.searchParams.get('doc') || '').split(':')
  if (!COMMENTABLE.includes(coll as any) || !id) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  return NextResponse.json(await listComments(coll, id, Math.max(1, Number(u.searchParams.get('page')) || 1)))
}

/** POST — public comment submission (honeypot, time trap, rate limit, WP moderation rules). */
export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  const b = await req.json().catch(() => null)
  if (!b) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  if (b.website_url || (b.t && Date.now() - Number(b.t) < 2500)) return NextResponse.json({ ok: true, status: 'pending' }) // bots: pretend success
  if (limited(ip)) return NextResponse.json({ error: 'You are posting comments too quickly. Slow down.' }, { status: 429 })

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  const s = await commentSettings()
  const coll = String(b.collection), id = b.id
  if (!COMMENTABLE.includes(coll as any) || !id) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  const doc: any = await payload.findByID({ collection: coll as any, id, depth: 0, overrideAccess: true }).catch(() => null)
  if (!doc || doc._status === 'draft') return NextResponse.json({ error: 'Comments are not available.' }, { status: 404 })
  if (!commentsOpen(doc, s)) return NextResponse.json({ error: 'Comments are closed.' }, { status: 403 })
  if (s.loggedInOnly && !user) return NextResponse.json({ error: 'You must be logged in to post a comment.' }, { status: 401 })

  const content = clean(b.content, 5000)
  const name = user ? (user as any).name || user.email : clean(b.name, 80)
  const email = user ? user.email : clean(b.email, 120).toLowerCase()
  const url = clean(b.url, 200)
  if (!content) return NextResponse.json({ error: 'Please type your comment text.' }, { status: 400 })
  if (!user && s.requireNameEmail) {
    if (!name) return NextResponse.json({ error: 'Please fill the required field: Name.' }, { status: 400 })
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  let parent: number | undefined
  if (b.parent && s.threaded) {
    const p: any = await payload.findByID({ collection: 'comments' as any, id: b.parent, depth: 0, overrideAccess: true }).catch(() => null)
    if (p && String(p.post?.value) === String(id) && p.status === 'approved') parent = p.id
  }
  // WordPress: "Duplicate comment detected"
  const dup = await payload.count({ collection: 'comments' as any, where: { and: [{ content: { equals: content } }, { authorEmail: { equals: email } }, { 'post.value': { equals: id } }] }, overrideAccess: true })
  if (dup.totalDocs) return NextResponse.json({ error: 'Duplicate comment detected; it looks as though you have already said that.' }, { status: 409 })

  let status: 'approved' | 'pending' | 'spam' = user && (await userCan(payload, user, 'moderate_comments')) ? 'approved' : await moderate({ content, email, name, url, ip }, s)
  if (status !== 'spam' && !user) {
    const spam = await akismetIsSpam({ ip, userAgent: req.headers.get('user-agent') || '', referrer: req.headers.get('referer') || '', permalink: `${SITE_URL}${getPath(coll, doc)}`, name, email, url, content })
    if (spam) status = 'spam'
  }
  const created: any = await payload.create({ collection: 'comments' as any, data: { content, status, post: { relationTo: coll as any, value: id }, parent, authorName: name, authorEmail: email, authorUrl: url || undefined, notifyReplies: b.notify === '1' || b.notify === true, user: user?.id, ip, userAgent: clean(req.headers.get('user-agent'), 250) } as any, overrideAccess: true })

  if (status !== 'spam' && s.notify) {
    const to = s.notifyEmail || process.env.ADMIN_EMAIL || ''
    if (to) payload.sendEmail({ to, subject: `[AI Vastra] ${status === 'pending' ? 'Please moderate' : 'New comment'}: “${doc.title}”`, text: `${name} <${email}> wrote on ${SITE_URL}${getPath(coll, doc)}\n\n${content}\n\nModerate: ${SITE_URL}/admin/collections/comments/${created.id}` }).catch(() => {})
  }
  if (status === 'approved') revalidatePath(getPath(coll, doc))
  return NextResponse.json({ ok: true, status })
}
