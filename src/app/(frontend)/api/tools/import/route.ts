import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/** Order matters: taxonomies before the content that references them. */
const ORDER = ['categories', 'tags', 'section-categories', 'pages', 'posts', 'guides', 'cases', 'updates', 'reviews', 'redirects', 'forms', 'comments']
const KEY: Record<string, string> = { redirects: 'from' }
const GLOBALS = ['site-settings', 'navigation', 'global-content', 'plugin-settings']
const DROP = ['id', 'createdAt', 'updatedAt', '_status', 'deletedAt', 'sizes', 'breadcrumbs', 'shortcode']

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || (user as any).role !== 'admin') return NextResponse.json({ error: 'Admins only' }, { status: 403 })
  const body: any = await req.json().catch(() => null)
  if (!body?.collections && !body?.globals) return NextResponse.json({ error: 'Not an AI Vastra export / backup file.' }, { status: 400 })
  let created = 0, updated = 0, failed = 0
  const errors: string[] = []
  const strip = (d: any) => { const o = { ...d }; for (const k of DROP) delete o[k]; return o }

  for (const c of ORDER) {
    const docs: any[] = body.collections?.[c] ?? []
    for (const d of docs) {
      const key = KEY[c] ?? 'slug'
      const val = d[key] ?? (c === 'comments' ? undefined : undefined)
      try {
        const data: any = strip(d)
        if (c === 'comments') { await payload.create({ collection: 'comments' as any, data, overrideAccess: true }); created++; continue }
        if (!val) { failed++; errors.push(`${c}: item without ${key} skipped`); continue }
        const found = await payload.find({ collection: c as any, where: { [key]: { equals: val } }, limit: 1, depth: 0, overrideAccess: true, draft: true })
        const status = d._status === 'draft' ? 'draft' : 'published'
        if (found.docs[0]) { await payload.update({ collection: c as any, id: found.docs[0].id, data: { ...data, ...(c !== 'redirects' && c !== 'forms' && c !== 'categories' && c !== 'tags' && c !== 'section-categories' ? { _status: status } : {}) }, overrideAccess: true, context: { disableRevalidate: true, keepModified: true } }); updated++ }
        else { await payload.create({ collection: c as any, data: { ...data, ...(['redirects', 'forms', 'categories', 'tags', 'section-categories'].includes(c) ? {} : { _status: status }) }, overrideAccess: true, context: { disableRevalidate: true, keepModified: true } }); created++ }
      } catch (e: any) { failed++; if (errors.length < 12) errors.push(`${c} “${val ?? '?'}”: ${String(e?.message || e).slice(0, 140)}`) }
    }
  }
  for (const g of GLOBALS) if (body.globals?.[g]) {
    try { await payload.updateGlobal({ slug: g as any, data: strip(body.globals[g]), overrideAccess: true }); updated++ } catch (e: any) { failed++; errors.push(`${g}: ${String(e?.message || e).slice(0, 140)}`) }
  }
  revalidatePath('/', 'layout')
  return NextResponse.json({ ok: true, created, updated, failed, errors })
}
