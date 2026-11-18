import type { Metadata } from 'next'
import { BodyClass } from '@/components/theme/BodyClass'
import { BlogCard } from '@/components/theme/BlogCards'
import { getClient, getSettings } from '@/lib/data'
import { applyVars } from '@/lib/seo'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ s?: string }> }): Promise<Metadata> {
  const st = await getSettings()
  const q = ((await searchParams).s ?? '').trim().slice(0, 80)
  const tpl = st.searchTitle || 'Search results for %search_query% %sep% %sitename%'
  return { title: { absolute: applyVars(tpl, { search_query: q, sep: st.separator || '-', sitename: st.siteName }) }, robots: { index: st.noindexSearch === false, follow: true } }
}

/** search.php */
export default async function Search({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s = '' } = await searchParams
  const q = s.trim().slice(0, 80)
  const payload = await getClient()
  const res = q
    ? await payload.find({
        collection: 'posts',
        where: { and: [{ _status: { equals: 'published' } }, { or: [{ title: { like: q } }, { excerpt: { like: q } }] }] },
        limit: 18,
        depth: 1,
        overrideAccess: true,
      })
    : { docs: [] as any[] }
  return (
    <>
      <BodyClass classes="search search-results" />
      <section id="main-heading">
        <div className="container">
          <h1>{q ? (res.docs.length ? `Search results for: ${q}` : `No results found for: ${q}`) : 'Search'}</h1>
        </div>
      </section>
      <main className="blog-main-layout">
        <div className="container">
          <form role="search" method="get" className="search-form" action="/search/" style={{ margin: '0 auto 24px', maxWidth: 520 }}>
            <input type="search" className="search-field" placeholder="Search articles…" name="s" defaultValue={q} />
            <input type="submit" className="search-submit" value="Search" />
          </form>
          <div className="blog-grid">{res.docs.map((d: any) => <BlogCard key={d.id} p={d} />)}</div>
        </div>
      </main>
    </>
  )
}
