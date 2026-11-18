import { NextResponse } from 'next/server'
import { matchRedirect } from '@/lib/redirects'

/** Internal: called by src/proxy.ts for every public request. Not for browsers. */
export async function GET(req: Request) {
  if (req.headers.get('x-av-internal') !== process.env.PAYLOAD_SECRET) return new NextResponse(null, { status: 404 })
  const u = new URL(req.url)
  const hit = await matchRedirect(u.searchParams.get('path') || '/', u.searchParams.get('q') || '')
  return NextResponse.json(hit)
}
