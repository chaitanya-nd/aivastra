import { blockedResponse } from '@/lib/crawl-guard'
import { findMany, findTerm, getClient, getSettings } from '@/lib/data'
import { absoluteUrl, getPath, SITE_URL } from '@/lib/urls'

export const dynamic = 'force-dynamic'
const esc = (v: string) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const pub = (d: any) => (d.visibility ?? 'public') === 'public'

type Item = { title: string; link: string; date: string; text: string; author?: string }
type Feed = { title: string; link: string; self: string; description: string; items: Item[] }

/**
 * WordPress feeds (the proxy rewrites the public URLs here):
 *   /feed/  /feed/atom/  /comments/feed/  /category/x/feed/  /tag/x/feed/  /author/x/feed/  /<post>/feed/ (its comments)
 */
export async function GET(req: Request) {
  const blocked = await blockedResponse()
  if (blocked) return blocked
  const u = new URL(req.url)
  let src = (u.searchParams.get('src') || u.pathname).replace(/\/+$/, '')
  const atom = /\/atom$/.test(src)
  src = src.replace(/\/(atom|rss2?)$/, '').replace(/\/feed$/, '')
  const s: any = await getSettings()
  const site = s.siteName || 'AI Vastra'
  const feed = await build(src, site, s)
  if (!feed) return new Response('Not found', { status: 404 })
  const self = `${SITE_URL}${feed.self}`
  return atom ? atomXml(feed, self) : rssXml(feed, self)
}

const postItems = (docs: any[]): Item[] => docs.filter(pub).map((d) => ({ title: d.title, link: absoluteUrl(getPath('posts', d)), date: d.publishedAt || d.createdAt, text: d.excerpt || d.meta?.description || '', author: typeof d.author === 'object' ? d.author?.name : undefined }))

async function build(src: string, site: string, s: any): Promise<Feed | null> {
  const desc = s.tagline || site
  if (!src) return { title: site, link: `${SITE_URL}/`, self: '/feed/', description: desc, items: postItems((await findMany('posts', { limit: 20, depth: 1 })).docs) }
  let m: RegExpMatchArray | null
  if ((m = src.match(/^\/(category|tag)\/([^/]+)$/))) {
    const term: any = await findTerm(m[1] === 'category' ? 'categories' : 'tags', decodeURIComponent(m[2]))
    if (!term) return null
    const field = m[1] === 'category' ? 'categories' : 'tags'
    return { title: `${site} » ${term.name}`, link: absoluteUrl(getPath(field, term)), self: `${src}/feed/`, description: term.description || desc, items: postItems((await findMany('posts', { where: { [field]: { in: [term.id] } }, limit: 20, depth: 1 })).docs) }
  }
  if ((m = src.match(/^\/author\/([^/]+)$/))) {
    const payload = await getClient()
    const u: any = (await payload.find({ collection: 'users', where: { slug: { equals: m[1] } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
    if (!u || u.role === 'subscriber') return null
    return { title: `${site} » Posts by ${u.name}`, link: `${SITE_URL}/author/${u.slug}/`, self: `${src}/feed/`, description: u.bio || desc, items: postItems((await findMany('posts', { where: { author: { equals: u.id } }, limit: 20, depth: 1 })).docs) }
  }
  const payload = await getClient()
  const comments = async (where: any) => (await payload.find({ collection: 'comments' as any, where: { and: [{ status: { equals: 'approved' } }, where] }, sort: '-createdAt', limit: 30, depth: 1, overrideAccess: true })).docs as any[]
  const commentItem = (c: any, onTitle?: string): Item => {
    const doc = c.post?.value && typeof c.post.value === 'object' ? c.post.value : null
    const link = doc ? `${absoluteUrl(getPath(c.post.relationTo, doc))}#comment-${c.id}` : `${SITE_URL}/`
    return { title: `Comment on ${onTitle || doc?.title || 'a post'} by ${c.authorName || 'Anonymous'}`, link, date: c.createdAt, text: c.content, author: c.authorName }
  }
  if (src === '/comments') {
    const list = (await comments({})).filter((c) => !c.post?.value || c.post.value._status === 'published')
    return { title: `Comments for ${site}`, link: `${SITE_URL}/`, self: '/comments/feed/', description: desc, items: list.map((c) => commentItem(c)) }
  }
  if ((m = src.match(/^\/([^/]+)$/))) {
    const post: any = (await findMany('posts', { where: { slug: { equals: decodeURIComponent(m[1]) } }, limit: 1, depth: 0 })).docs[0]
    if (!post || !pub(post)) return null
    const list = await comments({ 'post.value': { equals: post.id }, 'post.relationTo': { equals: 'posts' } })
    return { title: `Comments on: ${post.title}`, link: absoluteUrl(getPath('posts', post)), self: `${src}/feed/`, description: desc, items: list.map((c) => commentItem(c, post.title)) }
  }
  return null
}

function rssXml(f: Feed, self: string) {
  const items = f.items.map((i) => `<item><title>${esc(i.title)}</title><link>${esc(i.link)}</link><guid isPermaLink="true">${esc(i.link)}</guid><pubDate>${new Date(i.date).toUTCString()}</pubDate>${i.author ? `<dc:creator><![CDATA[${i.author}]]></dc:creator>` : ''}<description><![CDATA[${i.text}]]></description></item>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>${esc(f.title)}</title><atom:link href="${esc(self)}" rel="self" type="application/rss+xml"/><link>${esc(f.link)}</link><description>${esc(f.description)}</description><lastBuildDate>${new Date(f.items[0]?.date || Date.now()).toUTCString()}</lastBuildDate>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}

function atomXml(f: Feed, self: string) {
  const entries = f.items.map((i) => `<entry><title>${esc(i.title)}</title><link rel="alternate" href="${esc(i.link)}"/><id>${esc(i.link)}</id><updated>${new Date(i.date).toISOString()}</updated>${i.author ? `<author><name>${esc(i.author)}</name></author>` : ''}<summary type="html"><![CDATA[${i.text}]]></summary></entry>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${esc(f.title)}</title><subtitle>${esc(f.description)}</subtitle><link rel="alternate" href="${esc(f.link)}"/><link rel="self" href="${esc(self.replace(/\/?$/, '/atom/').replace('/feed/atom/atom/', '/feed/atom/'))}"/><id>${esc(f.link)}</id><updated>${new Date(f.items[0]?.date || Date.now()).toISOString()}</updated>${entries}</feed>`
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } })
}
