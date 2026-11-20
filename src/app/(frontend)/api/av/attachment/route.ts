import { NextResponse } from 'next/server'
import { getClient } from '@/lib/data'

export const dynamic = 'force-dynamic'

/** ?attachment_id=123 (WordPress attachment pages) → 301 to the file itself, as Rank Math's "Redirect attachments" does. */
export async function GET(req: Request) {
  const u = new URL(req.url)
  const id = u.searchParams.get('attachment_id') || u.searchParams.get('id') || ''
  const payload = await getClient()
  const m: any = /^\d+$/.test(id) ? await payload.findByID({ collection: 'media', id, depth: 0, overrideAccess: true }).catch(() => null) : null
  const to = m?.externalUrl || m?.url
  return to ? NextResponse.redirect(new URL(to, req.url), 301) : NextResponse.redirect(new URL('/', req.url), 301)
}
