import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

/** External trigger: POST { path?, tag?, all? } with header x-revalidate-secret. */
export async function POST(req: Request) {
  if (!process.env.REVALIDATE_SECRET || req.headers.get('x-revalidate-secret') !== process.env.REVALIDATE_SECRET)
    return NextResponse.json({ ok: false }, { status: 401 })
  const { path, tag, all } = (await req.json().catch(() => ({}))) as { path?: string; tag?: string; all?: boolean }
  if (all) revalidatePath('/', 'layout')
  if (path) revalidatePath(path)
  if (tag) revalidateTag(tag, 'max')
  return NextResponse.json({ ok: true, path, tag })
}
