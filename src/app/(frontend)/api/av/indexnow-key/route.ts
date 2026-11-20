import { getPluginSettings } from '@/lib/data'
import { indexNowKey } from '@/lib/indexnow'

export const dynamic = 'force-dynamic'

/** /<key>.txt (rewritten in next.config.mjs): IndexNow ownership verification. */
export async function GET(req: Request) {
  // After the proxy rewrite req.url is still the public /<key>.txt URL
  const u = new URL(req.url)
  const key = u.searchParams.get('key') || u.pathname.match(/([a-f0-9]{32})\.txt$/)?.[1] || ''
  const ps: any = await getPluginSettings().catch(() => null)
  const expected = indexNowKey(ps)
  if (key !== expected) return new Response('Not found', { status: 404 })
  return new Response(expected, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
