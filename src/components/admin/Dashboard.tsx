import type { ServerProps } from 'payload'
import Link from 'next/link'
import { crawlersBlocked } from '@/lib/env'
import { QuickDraft } from './QuickDraft'

const IC: Record<string, string> = {
  posts: 'M4 5h16M4 10h16M4 15h10M4 20h7',
  pages: 'M7 3h7l5 5v13H7zM14 3v5h5',
  guides: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5',
  cases: 'M3 8h18v12H3zM8 8V5h8v3M3 13h18',
  updates: 'M21 12a9 9 0 1 1-3-6.7M21 4v5h-5',
  reviews: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z',
  media: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M9 9.5h.01',
  'form-submissions': 'M4 4h16v16H4zM8 9h8M8 13h8M8 17h4',
  plus: 'M12 5v14M5 12h14',
  menu: 'M4 7h16M4 12h16M4 17h16',
  redirect: 'M5 12h14m-5-5 5 5-5 5',
  seo: 'M4 19V9m6 10V5m6 14v-7m6 7H2',
  arrow: 'M7 17 17 7M8 7h9v9',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',
}
const Ico = ({ n }: { n: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={IC[n]} /></svg>
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
  const tones = ['violet', 'cyan', 'green', 'amber', 'rose', 'blue', 'violet', 'cyan']
  const total = posts + pages
  const gaps = Math.min(total, noDesc + noTitle)
  const pct = total ? Math.round(((total - gaps) / total) * 100) : 100
  const name = (user as any)?.name || (user as any)?.email || 'there'
  const visible = !crawlersBlocked(settings)
  const R = 52
  const C = 2 * Math.PI * R
  return (
    <div className="dx">
      <section className="dx-hero">
        <div className="dx-hero-t">
          <h1>Welcome back, {name}</h1>
          <p>Everything for aivastra.com — content, SEO, menus and redirects — in one workspace.</p>
        <div className="dx-actions">
            <Link className="dx-act primary" href="/admin/collections/posts/create"><Ico n="edit" />Write a post</Link>
            <Link className="dx-act" href="/admin/collections/pages"><Ico n="pages" />Edit pages</Link>
            <Link className="dx-act" href="/admin/collections/media/create"><Ico n="media" />Add media</Link>
            <Link className="dx-act" href="/admin/globals/navigation"><Ico n="menu" />Menus</Link>
            <Link className="dx-act" href="/admin/collections/redirects"><Ico n="redirect" />Redirections</Link>
            {(role === 'admin' || role === 'seo') && <Link className="dx-act" href="/admin/seo-audit"><Ico n="seo" />SEO audit</Link>}
          </div>
        </div>
        <div className="dx-snap" aria-label="Content snapshot">
          <div><b>{posts + pages + guides + cases + updates + reviews}</b><span>Published items</span></div>
          <div><b>{draftsAll}</b><span>Draft posts</span></div>
          <div><b>{media}</b><span>Media files</span></div>
        </div>
      </section>

      <section className="dx-kpis" aria-label="At a glance">
        {glance.map(([n, l, s], i) => (
          <Link key={s} href={`/admin/collections/${s}`} className={`dx-kpi ${tones[i]}`}>
            <span className="dx-kpi-i"><Ico n={s} /></span>
            <span className="dx-kpi-n">{n}</span>
            <span className="dx-kpi-l">{l}</span>
            <span className="dx-kpi-go"><Ico n="arrow" /></span>
          </Link>
        ))}
      </section>

      <div className="dx-cols">
        <div className="dx-main">
          <section className="dx-card">
            <header><h2>Recently published</h2><Link href="/admin/collections/posts">View all posts</Link></header>
            <ul className="dx-rows">
              {recent.docs.map((d: any) => (
                <li key={d.id}><span className="dx-dot ok" /><Link href={`/admin/collections/posts/${d.id}`}>{d.title}</Link><time>{fmt(d.publishedAt)}</time></li>
              ))}
              {recent.docs.length === 0 && <li className="dx-empty">Nothing published yet.</li>}
            </ul>
          </section>
          <section className="dx-card">
            <header><h2>Drafts in progress</h2><span className="dx-pill">{draftsAll} draft{draftsAll === 1 ? '' : 's'}</span></header>
            <ul className="dx-rows">
              {drafts.docs.map((d: any) => (
                <li key={d.id}><span className="dx-dot warn" /><Link href={`/admin/collections/posts/${d.id}`}>{d.title}</Link><time>{fmt(d.updatedAt)}</time></li>
              ))}
              {drafts.docs.length === 0 && <li className="dx-empty">No drafts — you’re all caught up.</li>}
            </ul>
          </section>
        </div>

        <aside className="dx-side">
          <section className="dx-card">
            <header><h2>SEO health</h2><span className="dx-pill">Rank Math</span></header>
            <div className="dx-ring">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r={R} className="trk" />
                <circle cx="60" cy="60" r={R} className="val" strokeDasharray={`${(C * pct) / 100} ${C}`} transform="rotate(-90 60 60)" />
              </svg>
              <div><b>{pct}%</b><span>metadata coverage</span></div>
            </div>
            <ul className="dx-checks">
              <li className={noTitle ? 'warn' : 'ok'}><b>{noTitle}</b> pages without a custom SEO title</li>
              <li className={noDesc ? 'warn' : 'ok'}><b>{noDesc}</b> posts without a meta description</li>
              <li className="ok"><b>{redirects}</b> active redirections</li>
            </ul>
            <footer><Link href="/admin/seo-audit">Open full SEO audit →</Link></footer>
          </section>
          <section className="dx-card">
            <header><h2>Quick draft</h2></header>
            <div className="dx-qd"><QuickDraft /></div>
          </section>
          <p className="dx-foot"><Ico n="globe" />Environment <b>{env}</b> · <Link href="/admin/search-visibility">{visible ? 'Visible to search engines' : 'Search engines blocked'}</Link></p>
        </aside>
      </div>
    </div>
  )
}
