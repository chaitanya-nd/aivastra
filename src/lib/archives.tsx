import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { BodyClass } from '@/components/theme/BodyClass'
import { ListingPage } from '@/components/theme/pages/Listing'
import { BlogIndex } from '@/components/theme/pages/BlogIndex'
import { Pagination } from '@/components/Pagination'
import { PostCard } from '@/components/PostCard'
import { findMany, findTerm, getGlobalContent, getPluginSettings, getSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { getPath } from '@/lib/urls'

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
