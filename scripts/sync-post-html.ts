/**
 * Fill `contentHtml` for posts that only have the flattened Lexical body (tables, embeds etc. get lost in the Lexical conversion),
 * using the live site's rendered HTML. Posts that already have contentHtml are left alone.
 *   set -a; . ./.env; set +a; pnpm tsx scripts/sync-post-html.ts [slug…]
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const ORIGIN = 'https://aivastra.com'
const clean = (h: string) =>
  h.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, '')
    .replace(/\[\/?[a-z_]+[^\]]*\]/gi, '')
    .replace(/(href=["'])https?:\/\/(?:new\.|www\.)?aivastra\.(?:com|local)(?=["'\/#?])/gi, '$1')
    .replace(/<h1/gi, '<h2').replace(/<\/h1>/gi, '</h2>')
    .replace(/<table\b([^>]*)>/gi, (_m, a) => `<table${a.replace(/\s(width|height)=["'][^"']*["']/gi, '').replace(/\sstyle=["'][^"']*["']/gi, '')}>`)

async function main() {
  const only = process.argv.slice(2)
  const payload = await getPayload({ config })
  const live = new Map<string, string>()
  for (let page = 1; ; page++) {
    const r = await fetch(`${ORIGIN}/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=slug,content`)
    if (!r.ok) break
    const d = await r.json()
    for (const p of d) live.set(p.slug, p.content.rendered)
    if (d.length < 100) break
  }
  const posts = await payload.find({ collection: 'posts', limit: 1000, depth: 0, pagination: false, draft: false })
  let n = 0
  for (const p of posts.docs as any[]) {
    if (only.length && !only.includes(p.slug)) continue
    if (p.contentHtml?.trim()) continue
    const html = live.get(p.slug)
    if (!html) continue
    await payload.update({ collection: 'posts', id: p.id, data: { contentHtml: clean(html) } as any, context: { disableRevalidate: true } })
    n++
  }
  payload.logger.info(`[html] updated ${n}`)
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
