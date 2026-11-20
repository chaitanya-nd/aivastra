import { headers } from 'next/headers'
import { getSettings } from '@/lib/data'
import { crawlersBlocked } from '@/lib/env'
import { SITE_URL } from '@/lib/urls'

export const dynamic = 'force-dynamic'

/** robots.txt — fully driven by Site settings (staging block, extra rules). */
export async function GET() {
  const s = await getSettings().catch(() => undefined)
  const h = await headers()
  const lines = crawlersBlocked(s, h.get('x-forwarded-host') || h.get('host') || undefined)
    ? ['User-agent: *', 'Disallow: /']
    : [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin/',
        'Disallow: /api/',
        'Disallow: /search/',
        '',
        `Sitemap: ${SITE_URL}/sitemap_index.xml`,
        ...(s?.robotsExtra ? ["", s.robotsExtra] : []),
      ]
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })
}
