import { NextResponse } from 'next/server'
import { getClient } from '@/lib/data'
import { absoluteUrl, getPath, SITE_URL } from '@/lib/urls'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const cdata = (v: unknown) => `<![CDATA[${String(v ?? '').replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
const wpDate = (iso?: string) => (iso ? new Date(iso).toISOString().replace('T', ' ').slice(0, 19) : '0000-00-00 00:00:00')
const TYPES: Record<string, string> = { posts: 'post', pages: 'page', guides: 'guide', cases: 'case', updates: 'update', reviews: 'review' }

/** Tools → Export: WordPress eXtended RSS (WXR 1.2), importable with WordPress → Tools → Import → WordPress. Admins only. */
export async function GET(req: Request) {
  const payload = await getClient()
  const { user } = await payload.auth({ headers: req.headers })
  if ((user as any)?.role !== 'admin') return new NextResponse('Administrators only', { status: 403 })
  const only = new URL(req.url).searchParams.get('type')
  const ss: any = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const users = (await payload.find({ collection: 'users', pagination: false, limit: 1000, depth: 0, overrideAccess: true })).docs as any[]
  const login = (id: any) => users.find((u) => u.id === (typeof id === 'object' ? id?.id : id))?.slug || 'admin'
  const cats = (await payload.find({ collection: 'categories', pagination: false, limit: 5000, depth: 0, overrideAccess: true })).docs as any[]
  const tags = (await payload.find({ collection: 'tags', pagination: false, limit: 5000, depth: 0, overrideAccess: true })).docs as any[]

  const out: string[] = []
  out.push(`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
<title>${cdata(ss?.siteName)}</title><link>${SITE_URL}</link><description>${cdata(ss?.tagline)}</description>
<pubDate>${new Date().toUTCString()}</pubDate><language>${ss?.siteLanguage || 'en'}</language>
<wp:wxr_version>1.2</wp:wxr_version><wp:base_site_url>${SITE_URL}</wp:base_site_url><wp:base_blog_url>${SITE_URL}</wp:base_blog_url>`)
  for (const u of users.filter((x) => x.role !== 'subscriber')) out.push(`<wp:author><wp:author_id>${u.id}</wp:author_id><wp:author_login>${cdata(u.slug || u.email)}</wp:author_login><wp:author_email>${cdata(u.email)}</wp:author_email><wp:author_display_name>${cdata(u.name)}</wp:author_display_name></wp:author>`)
  for (const c of cats) out.push(`<wp:category><wp:term_id>${c.id}</wp:term_id><wp:category_nicename>${cdata(c.slug)}</wp:category_nicename><wp:category_parent>${cdata(cats.find((x) => x.id === (typeof c.parent === 'object' ? c.parent?.id : c.parent))?.slug || '')}</wp:category_parent><wp:cat_name>${cdata(c.name)}</wp:cat_name><wp:category_description>${cdata(c.description)}</wp:category_description></wp:category>`)
  for (const t of tags) out.push(`<wp:tag><wp:term_id>${t.id}</wp:term_id><wp:tag_slug>${cdata(t.slug)}</wp:tag_slug><wp:tag_name>${cdata(t.name)}</wp:tag_name></wp:tag>`)

  for (const [collection, type] of Object.entries(TYPES)) {
    if (only && only !== type) continue
    const docs = (await payload.find({ collection: collection as any, pagination: false, limit: 10000, depth: 0, overrideAccess: true, draft: true } as any)).docs as any[]
    for (const d of docs) {
      const status = d._status === 'published' ? (d.visibility === 'private' ? 'private' : 'publish') : d.reviewStatus === 'pending' ? 'pending' : 'draft'
      const terms = [
        ...((d.categories || []) as any[]).map((id) => cats.find((c) => c.id === (typeof id === 'object' ? id?.id : id))).filter(Boolean).map((c: any) => `<category domain="category" nicename="${c.slug}">${cdata(c.name)}</category>`),
        ...((d.tags || []) as any[]).map((id) => tags.find((t) => t.id === (typeof id === 'object' ? id?.id : id))).filter(Boolean).map((t: any) => `<category domain="post_tag" nicename="${t.slug}">${cdata(t.name)}</category>`),
      ].join('')
      const meta = [
        ['_yoast_wpseo_title', d.meta?.title], ['_yoast_wpseo_metadesc', d.meta?.description], ['rank_math_title', d.meta?.title], ['rank_math_description', d.meta?.description], ['rank_math_focus_keyword', d.meta?.focusKeyword],
        ...((d.customFields || []) as any[]).map((f) => [f.key, f.value]),
      ].filter(([, v]) => v).map(([k, v]) => `<wp:postmeta><wp:meta_key>${cdata(k)}</wp:meta_key><wp:meta_value>${cdata(v)}</wp:meta_value></wp:postmeta>`).join('')
      const comments = type === 'post' || type === 'page'
        ? ((await payload.find({ collection: 'comments' as any, where: { and: [{ 'post.value': { equals: d.id } }, { 'post.relationTo': { equals: collection } }] }, pagination: false, limit: 5000, depth: 0, overrideAccess: true })).docs as any[])
            .map((c) => `<wp:comment><wp:comment_id>${c.id}</wp:comment_id><wp:comment_author>${cdata(c.authorName)}</wp:comment_author><wp:comment_author_email>${cdata(c.authorEmail)}</wp:comment_author_email><wp:comment_author_url>${cdata(c.authorUrl)}</wp:comment_author_url><wp:comment_author_IP>${cdata(c.ip)}</wp:comment_author_IP><wp:comment_date>${wpDate(c.createdAt)}</wp:comment_date><wp:comment_date_gmt>${wpDate(c.createdAt)}</wp:comment_date_gmt><wp:comment_content>${cdata(c.content)}</wp:comment_content><wp:comment_approved>${c.status === 'approved' ? '1' : c.status === 'spam' ? 'spam' : '0'}</wp:comment_approved><wp:comment_type>comment</wp:comment_type><wp:comment_parent>${typeof c.parent === 'object' ? c.parent?.id ?? 0 : c.parent ?? 0}</wp:comment_parent></wp:comment>`).join('')
        : ''
      out.push(`<item><title>${cdata(d.title)}</title><link>${absoluteUrl(getPath(collection, d))}</link><pubDate>${new Date(d.publishedAt || d.createdAt).toUTCString()}</pubDate><dc:creator>${cdata(login(d.author ?? d.createdBy))}</dc:creator><guid isPermaLink="false">${SITE_URL}/?p=${d.id}</guid><description></description><content:encoded>${cdata(d.contentHtml || '')}</content:encoded><excerpt:encoded>${cdata(d.excerpt)}</excerpt:encoded><wp:post_id>${d.id}</wp:post_id><wp:post_date>${wpDate(d.publishedAt || d.createdAt)}</wp:post_date><wp:post_date_gmt>${wpDate(d.publishedAt || d.createdAt)}</wp:post_date_gmt><wp:post_modified>${wpDate(d.modifiedAt || d.updatedAt)}</wp:post_modified><wp:comment_status>${d.commentsMode === 'closed' ? 'closed' : 'open'}</wp:comment_status><wp:ping_status>closed</wp:ping_status><wp:post_name>${cdata(d.slug)}</wp:post_name><wp:status>${status}</wp:status><wp:post_parent>0</wp:post_parent><wp:menu_order>${d.menuOrder ?? 0}</wp:menu_order><wp:post_type>${type}</wp:post_type><wp:post_password>${cdata(d.visibility === 'password' ? d.postPassword : '')}</wp:post_password><wp:is_sticky>${d.sticky ? 1 : 0}</wp:is_sticky>${terms}${meta}${comments}</item>`)
    }
  }
  out.push('</channel></rss>')
  const name = `aivastra.WordPress.${new Date().toISOString().slice(0, 10)}.xml`
  return new NextResponse(out.join('\n'), { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'content-disposition': `attachment; filename="${name}"` } })
}
