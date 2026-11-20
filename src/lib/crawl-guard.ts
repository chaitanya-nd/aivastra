import { headers } from 'next/headers'
import { getSettings } from '@/lib/data'
import { crawlersBlocked } from '@/lib/env'

/** For crawler-facing files (sitemap, feed, llms.txt): when crawling is blocked they simply do not exist. */
export async function blockedResponse(): Promise<Response | null> {
  const s = await getSettings().catch(() => undefined)
  const h = await headers()
  if (!crawlersBlocked(s, h.get('x-forwarded-host') || h.get('host') || undefined)) return null
  return new Response('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' } })
}
