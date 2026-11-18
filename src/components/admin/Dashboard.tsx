import type { ServerProps } from 'payload'
import Link from 'next/link'
import { QuickDraft } from './QuickDraft'

const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '')

export async function Dashboard({ payload, user }: ServerProps) {
  const count = async (collection: string, where?: any) => (await payload.count({ collection: collection as any, ...(where ? { where } : {}) })).totalDocs
  const [posts, pages, guides, cases, updates, reviews, media, draftsAll, noDesc, noTitle, redirects, subs] = await Promise.all([
    count('posts', { _status: { equals: 'published' } }),
    count('pages', { _status: { equals: 'published' } }),
    count('guides', { _status: { equals: 'published' } }),
    count('cases', { _status: { equals: 'published' } }),
    count('updates', { _status: { equals: 'published' } }),
    count('reviews', { _status: { equals: 'published' } }),
    count('media'),
    count('posts', { _status: { equals: 'draft' } }),
    count('posts', { and: [{ _status: { equals: 'published' } }, { 'meta.description': { exists: false } }] }),
    count('pages', { and: [{ _status: { equals: 'published' } }, { 'meta.title': { exists: false } }] }),
    count('redirects'),
    count('form-submissions'),
  ])
  const [recent, drafts, settings] = await Promise.all([
    payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 5, depth: 0, select: { title: true, publishedAt: true } }),
    payload.find({ collection: 'posts', where: { _status: { equals: 'draft' } }, sort: '-updatedAt', limit: 5, depth: 0, select: { title: true, updatedAt: true } }),
    payload.findGlobal({ slug: 'site-settings', depth: 0 }),
  ])
  const env = process.env.SITE_ENV || 'local'
  const role = (user as any)?.role
  const glance: [number, string, string][] = [
    [posts, 'Posts', 'posts'], [pages, 'Pages', 'pages'], [guides, 'Guides', 'guides'], [cases, 'Case studies', 'cases'],
    [updates, 'Product updates', 'updates'], [reviews, 'Reviews', 'reviews'], [media, 'Media files', 'media'], [subs, 'Form submissions', 'form-submissions'],
  ]
  return (
    <div className="wpd">
      <h1 className="wpd-title">Dashboard</h1>
      <div className="wpd-welcome">
        <div>
          <h2>Welcome back to AI Vastra Studio</h2>
          <p>Edit pages, posts, menus, SEO and redirects for aivastra.com from one place.</p>
        </div>
        <div className="wpd-welcome-cols">
          <div><h3>Get started</h3><Link className="wp-btn primary" href="/admin/collections/pages">Edit your pages</Link></div>
          <div><h3>Next steps</h3><Link href="/admin/collections/posts/create">Write a blog post</Link><Link href="/admin/collections/media/create">Add media</Link></div>
          <div><h3>More actions</h3><Link href="/admin/globals/navigation">Manage menus</Link><Link href="/admin/collections/redirects">Redirections</Link>{(role === 'admin' || role === 'seo') && <Link href="/admin/seo-audit">SEO audit</Link>}</div>
        </div>
      </div>
      <div className="wpd-grid">
        <section className="wpw">
          <h2>At a Glance</h2>
          <ul className="wpw-glance">
            {glance.map(([n, l, s]) => <li key={s}><Link href={`/admin/collections/${s}`}><b>{n}</b> {l}</Link></li>)}
          </ul>
          <p className="wpw-foot">Next.js + Payload CMS · environment <b>{env}</b>{settings.blockIndexing || env !== 'production' ? <> · <span className="wpw-warn">Search engines discouraged</span></> : <> · <span className="wpw-ok">Visible to search engines</span></>}</p>
        </section>
        <section className="wpw">
          <h2>SEO Overview <small>Rank Math</small></h2>
          <ul className="wpw-seo">
            <li className={noTitle ? 'warn' : 'ok'}><b>{noTitle}</b> pages without a custom SEO title</li>
            <li className={noDesc ? 'warn' : 'ok'}><b>{noDesc}</b> posts without a meta description</li>
            <li className="ok"><b>{redirects}</b> active redirections</li>
          </ul>
          <p className="wpw-foot"><Link href="/admin/seo-audit">Open the full SEO audit →</Link></p>
        </section>
        <section className="wpw">
          <h2>Quick Draft</h2>
          <QuickDraft />
          {drafts.docs.length > 0 && <>
            <h3 className="wpw-sub">Your recent drafts</h3>
            <ul className="wpw-list">{drafts.docs.map((d: any) => <li key={d.id}><Link href={`/admin/collections/posts/${d.id}`}>{d.title}</Link><span>{fmt(d.updatedAt)}</span></li>)}</ul>
          </>}
        </section>
        <section className="wpw">
          <h2>Activity</h2>
          <h3 className="wpw-sub">Recently Published</h3>
          <ul className="wpw-list">{recent.docs.map((d: any) => <li key={d.id}><span className="d">{fmt(d.publishedAt)}</span><Link href={`/admin/collections/posts/${d.id}`}>{d.title}</Link></li>)}</ul>
          <p className="wpw-foot">{draftsAll} draft post{draftsAll === 1 ? '' : 's'}</p>
        </section>
      </div>
    </div>
  )
}
