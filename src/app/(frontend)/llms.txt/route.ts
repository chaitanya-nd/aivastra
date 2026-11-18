import { getClient, getSettings } from '@/lib/data'
import { absoluteUrl, getPath, SITE_URL } from '@/lib/urls'

export const revalidate = 3600

export async function GET() {
  const s = await getSettings()
  if (s.llmsTxt) return new Response(s.llmsTxt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  const payload = await getClient()
  const [pages, posts] = await Promise.all(
    (['pages', 'posts'] as const).map((collection) =>
      payload.find({ collection, where: { _status: { equals: 'published' } }, limit: 200, depth: 0, sort: '-updatedAt', overrideAccess: true }),
    ),
  )
  const line = (c: string) => (d: any) => `- [${d.title}](${absoluteUrl(getPath(c, d))})${d.meta?.description ? `: ${d.meta.description}` : ''}`
  const body = [
    `# ${s.siteName}`,
    s.defaultDescription ? `\n> ${s.defaultDescription}` : '',
    `\n## Pages`,
    ...pages.docs.map(line('pages')),
    `\n## Articles`,
    ...posts.docs.slice(0, 100).map(line('posts')),
    `\nSitemap: ${SITE_URL}/sitemap_index.xml`,
  ].join('\n')
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
