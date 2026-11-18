import { findMany, getSettings } from '@/lib/data'
import { absoluteUrl, getPath, SITE_URL } from '@/lib/urls'

export const revalidate = 3600
const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** WordPress served RSS at /feed/ — keep it for subscribers & crawlers. */
export async function GET() {
  const s = await getSettings()
  const { docs } = await findMany('posts', { limit: 20 })
  const items = docs
    .map(
      (d: any) => `<item><title>${esc(d.title)}</title><link>${absoluteUrl(getPath('posts', d))}</link><guid isPermaLink="true">${absoluteUrl(getPath('posts', d))}</guid><pubDate>${new Date(d.publishedAt || d.createdAt).toUTCString()}</pubDate><description>${esc(d.excerpt || '')}</description></item>`,
    )
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(s.siteName)}</title><link>${SITE_URL}/</link><description>${esc(s.tagline || s.siteName)}</description>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
