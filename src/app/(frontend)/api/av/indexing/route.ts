import { timingSafeEqual } from 'node:crypto'
import { getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

/** Internal: the database half of the crawl-block decision, polled by src/proxy.ts. Secret-protected, fails closed. */
export async function GET(req: Request) {
  const secret = process.env.PAYLOAD_SECRET || ''
  const sent = req.headers.get('x-av-internal') || ''
  const ok = secret.length > 0 && sent.length === secret.length && timingSafeEqual(Buffer.from(sent), Buffer.from(secret))
  if (!ok) return new Response(null, { status: 404 })
  try {
    const s = await getSettings()
    // Only the DB switch matters here; env + host are checked by the proxy itself.
    const a = s as any
    return Response.json({ blocked: a?.blockIndexing !== false, maintenance: a?.maintenanceMode ? { title: a.maintenanceTitle || 'We’ll be back soon', message: a.maintenanceMessage || '', site: a.siteName || '' } : null })
  } catch {
    return Response.json({ blocked: true, maintenance: null })
  }
}
