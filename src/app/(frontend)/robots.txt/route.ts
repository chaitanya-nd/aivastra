import { getSettings } from '@/lib/data'
import { crawlersBlocked } from '@/lib/env'
import { SITE_URL } from '@/lib/urls'

export const revalidate = 3600

/** robots.txt — fully driven by Site settings (staging block, extra rules). */
export async function GET() {
  const s = await getSettings()
  const lines = crawlersBlocked(s)
    ? ['User-agent: *', 'Disallow: /']
    : [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin/',
        'Disallow: /api/',
        'Disallow: /search/',
        '',
        `Sitemap: ${SITE_URL}/sitemap_index.xml`,
        ...(s.robotsExtra ? ['', s.robotsExtra] : []),
      ]
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
