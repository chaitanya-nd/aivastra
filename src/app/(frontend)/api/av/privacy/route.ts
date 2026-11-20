import { NextResponse } from 'next/server'
import { getClient } from '@/lib/data'

export const dynamic = 'force-dynamic'

/** Tools → Privacy: export or erase one person's personal data (GDPR / DPDP), admins only. */
export async function POST(req: Request) {
  const payload = await getClient()
  const { user } = await payload.auth({ headers: req.headers })
  if ((user as any)?.role !== 'admin') return NextResponse.json({ error: 'Administrators only.' }, { status: 403 })
  const { email: raw, action } = await req.json().catch(() => ({}))
  const email = String(raw || '').trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })

  const account: any = (await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] ?? null
  const comments = (await payload.find({ collection: 'comments' as any, where: { authorEmail: { equals: email } }, pagination: false, limit: 10000, depth: 0, overrideAccess: true })).docs as any[]
  const subs = (await payload.find({ collection: 'form-submissions' as any, where: { 'submissionData.value': { equals: email } }, pagination: false, limit: 10000, depth: 0, overrideAccess: true }).catch(() => ({ docs: [] }))).docs as any[]

  if (action === 'export') {
    const data = {
      exportedAt: new Date().toISOString(),
      email,
      account: account && { id: account.id, name: account.name, email: account.email, role: account.role, createdAt: account.createdAt, bio: account.bio, website: account.website },
      comments: comments.map((c) => ({ id: c.id, date: c.createdAt, content: c.content, name: c.authorName, website: c.authorUrl, ip: c.ip, userAgent: c.userAgent, status: c.status, on: c.post })),
      formSubmissions: subs.map((s) => ({ id: s.id, date: s.createdAt, form: s.form, fields: s.submissionData })),
    }
    return new NextResponse(JSON.stringify(data, null, 2), { headers: { 'content-type': 'application/json', 'content-disposition': `attachment; filename="personal-data-${email.replace(/[^a-z0-9]+/gi, '-')}.json"` } })
  }
  if (action === 'erase') {
    for (const c of comments) await payload.update({ collection: 'comments' as any, id: c.id, data: { authorName: 'Anonymous', authorEmail: null, authorUrl: null, ip: null, userAgent: null, notifyReplies: false } as any, overrideAccess: true, user })
    for (const s of subs) await payload.delete({ collection: 'form-submissions' as any, id: s.id, overrideAccess: true, user })
    let accountRemoved = false
    if (account && account.role === 'subscriber') { await payload.delete({ collection: 'users', id: account.id, overrideAccess: true, user }); accountRemoved = true }
    return NextResponse.json({ ok: true, anonymisedComments: comments.length, deletedSubmissions: subs.length, accountRemoved, staffAccountKept: Boolean(account && !accountRemoved) })
  }
  return NextResponse.json({ found: { account: Boolean(account), comments: comments.length, formSubmissions: subs.length } })
}
