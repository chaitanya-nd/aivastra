import { revalidatePath, revalidateTag } from 'next/cache'
import { spawn } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import { Readable } from 'node:stream'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const BACKUP = ['pages', 'posts', 'guides', 'cases', 'updates', 'reviews', 'categories', 'tags', 'section-categories', 'media', 'redirects', 'forms', 'form-submissions', 'comments', 'users']
const GLOBALS = ['site-settings', 'navigation', 'global-content', 'plugin-settings']

/** Admin tools: ?action=backup (JSON export) · ?action=backup-media (media files .tar.gz) · ?action=purge (clear all caches). Admin role only. */
export async function GET(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || (user as any).role !== 'admin') return NextResponse.json({ ok: false, error: 'Admins only' }, { status: 403 })
  const action = new URL(req.url).searchParams.get('action')
  if (action === 'purge') {
    revalidatePath('/', 'layout')
    revalidateTag('globals', 'max')
    return NextResponse.json({ ok: true, purgedAt: new Date().toISOString() })
  }
  if (action === 'export') {
    const type = new URL(req.url).searchParams.get('type') || ''
    if (!BACKUP.includes(type) && type !== 'comments' || type === 'users') return NextResponse.json({ ok: false, error: 'Unknown content type' }, { status: 400 })
    const r = await payload.find({ collection: type as any, limit: 0, pagination: false, depth: 0, overrideAccess: true, draft: true })
    return new NextResponse(JSON.stringify({ exportedAt: new Date().toISOString(), site: process.env.NEXT_PUBLIC_SITE_URL, collections: { [type]: r.docs }, globals: {} }), { headers: { 'content-type': 'application/json', 'content-disposition': `attachment; filename="aivastra-${type}-${new Date().toISOString().slice(0, 10)}.json"` } })
  }
  if (action === 'backup') {
    const out: Record<string, unknown> = { exportedAt: new Date().toISOString(), site: process.env.NEXT_PUBLIC_SITE_URL, collections: {}, globals: {} }
    for (const c of BACKUP) {
      const r = await payload.find({ collection: c as any, limit: 0, pagination: false, depth: 0, overrideAccess: true, draft: true })
      ;(out.collections as any)[c] = c === 'users' ? r.docs.map(({ id, email, name, role }: any) => ({ id, email, name, role })) : r.docs
    }
    for (const g of GLOBALS) (out.globals as any)[g] = await payload.findGlobal({ slug: g as any, depth: 0, overrideAccess: true })
    return new NextResponse(JSON.stringify(out), { headers: { 'content-type': 'application/json', 'content-disposition': `attachment; filename="aivastra-backup-${new Date().toISOString().slice(0, 10)}.json"` } })
  }
  if (action === 'backup-media') {
    // Local media folder as .tar.gz (when media lives in R2 the bucket versioning is the backup).
    const files = await readdir('media').catch(() => [] as string[])
    if (!files.length) return NextResponse.json({ ok: false, error: 'No local media files (media is hotlinked or stored in R2).' }, { status: 404 })
    const tar = spawn('tar', ['-czf', '-', '-C', 'media', '.'])
    return new NextResponse(Readable.toWeb(tar.stdout) as any, { headers: { 'content-type': 'application/gzip', 'content-disposition': `attachment; filename="aivastra-media-${new Date().toISOString().slice(0, 10)}.tar.gz"` } })
  }
  return NextResponse.json({ ok: false }, { status: 400 })
}
