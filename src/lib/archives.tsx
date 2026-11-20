import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { BodyClass } from '@/components/theme/BodyClass'
import { ListingPage } from '@/components/theme/pages/Listing'
import { BlogIndex } from '@/components/theme/pages/BlogIndex'
import { Pagination } from '@/components/Pagination'
import { PostCard } from '@/components/PostCard'
import { findMany, findTerm, getClient, getGlobalContent, getPluginSettings, getSettings } from '@/lib/data'
import { BlogCard } from '@/components/theme/BlogCards'
import { JsonLd } from '@/components/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { getPath, SITE_URL } from '@/lib/urls'

type Cfg = { term: string; items: string; field: string; kind?: string; label: string }

export const ARCHIVES: Record<string, Cfg> = {
  category: { term: 'categories', items: 'posts', field: 'categories', label: 'Category' },
  tag: { term: 'tags', items: 'posts', field: 'tags', label: 'Tag' },
  'guide-category': { term: 'section-categories', items: 'guides', field: 'category', kind: 'guide', label: 'Guide category' },
  'case-category': { term: 'section-categories', items: 'cases', field: 'category', kind: 'case', label: 'Case category' },
  'update-category': { term: 'section-categories', items: 'updates', field: 'category', kind: 'update', label: 'Update category' },
}

export const parsePage = (rest?: string[]): number | null => {
  if (!rest || rest.length === 0) return 1
  if (rest.length === 2 && rest[0] === 'page' && /^\d+$/.test(rest[1]) && Number(rest[1]) > 1) return Number(rest[1])
  return null
}

async function load(type: string, slug: string) {
  const cfg = ARCHIVES[type]
  const term = await findTerm(cfg.term as any, slug, cfg.kind)
  if (!term || (cfg.kind && term.kind !== cfg.kind)) return null
  return { cfg, term }
}

export async function archiveMetadata(type: string, slug: string, rest?: string[]): Promise<Metadata> {
  const found = await load(type, slug)
  if (!found) return {}
  const settings = await getSettings()
  const doc = { ...found.term, title: found.term.meta?.title || `${found.term.name} — ${found.cfg.label}` }
  const md = buildMetadata({ collection: found.cfg.term, doc, settings })
  return (parsePage(rest) ?? 1) > 1 && settings.noindexPaginated !== false ? { ...md, robots: { index: false, follow: true } } : md
}

export async function ArchivePage({ type, slug, rest }: { type: string; slug: string; rest?: string[] }) {
  const page = parsePage(rest)
  if (!page) notFound()
  const found = await load(type, slug)
  if (!found) notFound()
  const { cfg, term } = found
  if (cfg.kind) return <><BodyClass classes="archive tax-category" /><ListingPage kind={cfg.kind as 'case' | 'guide' | 'update'} term={term} gc={await getGlobalContent()} /></>
  if (type === 'category') return <><BodyClass classes="archive category blog" /><BlogIndex gc={await getGlobalContent()} page={page} term={term} basePath={getPath('categories', term)} /></>
  const where = { [cfg.field]: cfg.field === 'category' ? { equals: term.id } : { in: [term.id] } }
  const res = await findMany(cfg.items as any, { where, limit: Math.max(1, Number((await getPluginSettings())?.postsPerPage) || 9), page })
  if (page > 1 && res.docs.length === 0) notFound()
  const base = getPath(cfg.term, term)
  return (
    <div className="container sec cms">
      <Breadcrumbs items={[{ name: term.name, path: base }]} />
      <h1>{term.name}</h1>
      {term.description && <p className="lead">{term.description}</p>}
      <div className="grid g3">
        {res.docs.map((d: any) => (
          <PostCard key={d.id} doc={d} collection={cfg.items} />
        ))}
      </div>
      {res.docs.length === 0 && <p>No entries yet.</p>}
      <Pagination page={res.page || 1} totalPages={res.totalPages} basePath={base} />
    </div>
  )
}

/** /guide/, /case/, /updates/, /review/ archives (WP has_archive). */
export async function CptArchive({ collection, title, rest }: { collection: string; title: string; rest?: string[] }) {
  const page = parsePage(rest)
  if (!page) notFound()
  const res = await findMany(collection as any, { limit: 12, page })
  if (page > 1 && res.docs.length === 0) notFound()
  const base = getPath(collection, { slug: '' }).replace(/\/$/, '')
  return (
    <div className="container sec cms">
      <Breadcrumbs items={[{ name: title, path: base }]} />
      <h1>{title}</h1>
      <div className="grid g3">
        {res.docs.map((d: any) => (
          <PostCard key={d.id} doc={d} collection={collection} />
        ))}
      </div>
      <Pagination page={res.page || 1} totalPages={res.totalPages} basePath={base} />
    </div>
  )
}

/* ───────── Author & date archives (WordPress /author/name/ and /2026/11/) ───────── */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function PostGrid({ title, intro, docs, page, totalPages, base, head }: { title: string; intro?: string; docs: any[]; page: number; totalPages?: number; base: string; head?: React.ReactNode }) {
  return (
    <>
      <section id="main-heading">
        <div className="container">
          {head}
          <div className="inr-bnr-title"><h1>{title}</h1></div>
          {intro && <p>{intro}</p>}
        </div>
      </section>
      <main className="blog-main-layout">
        <div className="container">
          <div className="blog-grid" id="blog-posts-container">
            {docs.length ? docs.map((p: any) => <BlogCard key={p.id} p={p} />) : <p className="no-articles">No articles found.</p>}
          </div>
          {(totalPages ?? 1) > 1 && (
            <div className="ui-view-more-row" style={{ gap: 12 }}>
              {page > 1 && <a className="ui-view-more-btn" href={page === 2 ? base : `${base}page/${page - 1}/`} rel="prev">Newer</a>}
              {page < (totalPages ?? 1) && <a className="ui-view-more-btn" href={`${base}page/${page + 1}/`} rel="next">View More</a>}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

async function findAuthor(slug: string) {
  const payload = await getClient()
  const res = await payload.find({ collection: 'users', where: { slug: { equals: slug } }, limit: 1, depth: 1, overrideAccess: true })
  const u: any = res.docs[0]
  return u && u.role !== 'subscriber' ? u : null
}

export async function authorMetadata(slug: string, rest?: string[]): Promise<Metadata> {
  const ps = await getPluginSettings()
  const u = ps?.authorArchives === false ? null : await findAuthor(slug)
  if (!u) return {}
  const page = parsePage(rest) ?? 1
  const settings = await getSettings()
  const md = buildMetadata({ collection: 'pages', doc: { title: `${u.name}, Author at ${settings.siteName || 'AI Vastra'}`, slug: `author/${u.slug}`, excerpt: u.bio || undefined, meta: { title: `${u.name}, Author at ${settings.siteName || 'AI Vastra'}` } }, settings })
  return { ...md, alternates: { canonical: `${SITE_URL}/author/${u.slug}/${page > 1 ? `page/${page}/` : ''}` }, ...(page > 1 ? { robots: { index: false, follow: true } } : {}) }
}

export async function AuthorArchive({ slug, rest }: { slug: string; rest?: string[] }) {
  const page = parsePage(rest)
  const ps = await getPluginSettings()
  if (!page || ps?.authorArchives === false) notFound()
  const u = await findAuthor(slug)
  if (!u) notFound()
  const per = Math.max(1, Number(ps?.postsPerPage) || 9)
  const res = await findMany('posts', { where: { author: { equals: u.id } }, limit: per, page, depth: 1 })
  if (page > 1 && res.docs.length === 0) notFound()
  const base = `/author/${u.slug}/`
  const avatar = u.avatar && typeof u.avatar === 'object' ? (u.avatar.url as string) : null
  const sameAs = [u.website, u.twitter, u.linkedin].filter(Boolean)
  return (
    <>
      <BodyClass classes={`archive author author-${u.slug} blog`} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ProfilePage', mainEntity: { '@type': 'Person', name: u.name, jobTitle: u.jobTitle || undefined, description: u.bio || undefined, image: avatar || undefined, url: `${SITE_URL}${base}`, sameAs: sameAs.length ? sameAs : undefined, worksFor: { '@id': `${SITE_URL}/#organization` } } }} />
      <PostGrid
        title={u.name}
        intro={u.bio || (u.jobTitle ? `${u.jobTitle} at AI Vastra.` : undefined)}
        docs={res.docs}
        page={page}
        totalPages={res.totalPages}
        base={base}
        head={avatar ? <img src={avatar} alt={u.name} width={88} height={88} style={{ borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }} /> : undefined}
      />
    </>
  )
}

/** ['2026'] | ['2026','11'] → date range, or null. */
export function parseDateArchive(segments: string[]) {
  if (!segments.length || segments.length > 2 || !/^\d{4}$/.test(segments[0])) return null
  const year = Number(segments[0])
  const month = segments[1] !== undefined ? (/^\d{2}$/.test(segments[1]) ? Number(segments[1]) : NaN) : null
  if (year < 1990 || year > 2100 || Number.isNaN(month) || (month !== null && (month < 1 || month > 12))) return null
  const from = new Date(Date.UTC(year, month ? month - 1 : 0, 1))
  const to = new Date(Date.UTC(month ? year : year + 1, month ? month : 0, 1))
  return { year, month, from: from.toISOString(), to: to.toISOString(), label: month ? `${MONTHS[month - 1]} ${year}` : String(year), base: `/${segments.join('/')}/` }
}

export async function dateArchiveEnabled() {
  return (await getPluginSettings())?.dateArchives !== false
}

export async function DateArchive({ segments, page }: { segments: string[]; page: number }) {
  const d = parseDateArchive(segments)
  if (!d || !(await dateArchiveEnabled())) notFound()
  const per = Math.max(1, Number((await getPluginSettings())?.postsPerPage) || 9)
  const res = await findMany('posts', { where: { and: [{ publishedAt: { greater_than_equal: d.from } }, { publishedAt: { less_than: d.to } }] }, limit: per, page, depth: 1 })
  if (!res.totalDocs || (page > 1 && !res.docs.length)) notFound()
  return (
    <>
      <BodyClass classes="archive date blog" />
      <PostGrid title={`Archives: ${d.label}`} docs={res.docs} page={page} totalPages={res.totalPages} base={d.base} />
    </>
  )
}
