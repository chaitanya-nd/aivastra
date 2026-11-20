import { bodyOf, hasBody } from '@/lib/body'
import Link from 'next/link'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs'
import { Blocks } from '@/components/Blocks'
import { Faq } from '@/components/Faq'
import { JsonLd } from '@/components/JsonLd'
import { LivePreview } from '@/components/LivePreview'
import { Cover } from '@/components/Cover'
import { CustomSchema } from '@/components/CustomSchema'
import { PostCard } from '@/components/PostCard'
import { RichText } from '@/components/RichText'
import { Toc } from '@/components/Toc'
import { SingleCase, SingleGuide } from '@/components/theme/pages/SingleEntry'
import { SinglePost } from '@/components/theme/pages/SinglePost'
import { DocumentPage } from '@/components/theme/pages/DocumentPage'
import { ListingPage } from '@/components/theme/pages/Listing'
import { MarketplacesPage } from '@/components/theme/pages/MarketplacesPage'
import { ShopifyPage } from '@/components/theme/pages/ShopifyPage'
import { BodyClass, pageBodyClass } from '@/components/theme/BodyClass'
import { AboutPage } from '@/components/theme/pages/AboutPage'
import { ShowcasePage } from '@/components/theme/pages/ShowcasePage'
import { VirtualTryOnPage } from '@/components/theme/pages/VirtualTryOnPage'
import { BlogIndex } from '@/components/theme/pages/BlogIndex'
import { CategoryPage } from '@/components/theme/pages/CategoryPage'
import { ContactPage } from '@/components/theme/pages/ContactPage'
import { DefaultPage } from '@/components/theme/pages/DefaultPage'
import { Home as FrontPage } from '@/ui/pages/Home'
import { PricingPage } from '@/components/theme/pages/PricingPage'
import { findMany, getGlobalContent, getSettings, isDraft } from '@/lib/data'
import { extractHeadings } from '@/lib/richtext'
import { articleSchema, withDefaultSchema } from '@/lib/schema'
import { getPath, withTrailingSlash } from '@/lib/urls'

const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

/** Page router: ported WordPress templates render with the theme markup; the rest fall back to generic blocks. */
export async function PageTemplate({ doc, crumbs, page, basePath }: { doc: any; crumbs: Crumb[]; page: number; basePath: string }) {
  const [draft, gc] = await Promise.all([isDraft(), getGlobalContent()])
  const themed = async () => {
    switch (doc.template) {
      case 'front-page': return <FrontPage doc={doc} gc={gc} />
      case 'category': return <CategoryPage doc={doc} gc={gc} />
      case 'pricing': return <PricingPage doc={doc} gc={gc} />
      case 'contact': return <ContactPage doc={doc} gc={gc} />
      case 'about': return <AboutPage doc={doc} gc={gc} />
      case 'case-studies': return <ListingPage kind="case" doc={doc} gc={gc} />
      case 'guide': return <ListingPage kind="guide" doc={doc} gc={gc} />
      case 'update': return <ListingPage kind="update" doc={doc} gc={gc} />
      case 'document': return <DocumentPage doc={doc} gc={gc} />
      case 'shopify': return <ShopifyPage doc={doc} gc={gc} />
      case 'market-places': return <MarketplacesPage doc={doc} gc={gc} />
      case 'virtual-try-on': return <VirtualTryOnPage doc={doc} gc={gc} />
      case 'ai-showcase': return <ShowcasePage doc={doc} gc={gc} />
      case 'blog': return <BlogIndex gc={gc} page={page} faqSource={doc.acf} />
      case 'default': return <DefaultPage doc={doc} gc={gc} />
      default: return null
    }
  }
  const themedNode = await themed()
  return (
    <>
      {draft && <LivePreview />}
      <CustomSchema html={doc.meta?.customSchema} />
      {themedNode && <BodyClass classes={pageBodyClass(doc.template)} />}
      {themedNode ?? (
        <div className="cms">
          {doc.slug !== 'home' && crumbs.length > 0 && (
            <div className="container">
              <Breadcrumbs items={crumbs} />
            </div>
          )}
          <Blocks blocks={doc.layout} page={page} basePath={basePath} />
          {hasBody(doc) && (
            <article className="container narrow sec">
              <h1>{doc.title}</h1>
              <RichText data={bodyOf(doc)} />
            </article>
          )}
        </div>
      )}
    </>
  )
}

/** Blog post template — breadcrumbs, TOC, FAQ, related posts, schema. */
export async function PostTemplate({ doc, collection = 'posts' }: { doc: any; collection?: string }) {
  const [settings, draft] = await Promise.all([getSettings(), isDraft()])
  const path = getPath(collection, doc)
  const cat = (doc.primaryCategory && typeof doc.primaryCategory === 'object' && doc.primaryCategory) || (Array.isArray(doc.categories) && doc.categories.find((c: any) => typeof c === 'object')) || null
  const crumbs: Crumb[] = [
    ...(collection === 'posts' ? [{ name: 'Blog', path: '/blog' }] : []),
    ...(cat ? [{ name: cat.name, path: getPath('categories', cat) }] : []),
    { name: doc.title, path },
  ]
  const headings = doc.showToc === false ? [] : extractHeadings(bodyOf(doc))
  const related = collection === 'posts' && cat
    ? (await findMany('posts', { where: { and: [{ categories: { in: [cat.id] } }, { id: { not_equals: doc.id } }] }, limit: 3 })).docs
    : []
  const author = doc.author && typeof doc.author === 'object' ? doc.author : null
  const tags = (doc.tags || []).filter((t: any) => typeof t === 'object')

  return (
    <>
      {draft && <LivePreview />}
      <JsonLd data={articleSchema(withDefaultSchema(doc, collection, settings), path, settings, collection === 'posts' ? 'BlogPosting' : 'Article')} />
      <CustomSchema html={doc.meta?.customSchema} />
      <article className="container post">
        <Breadcrumbs items={crumbs} />
        <header className="post-head">
          {cat && <Link href={withTrailingSlash(getPath('categories', cat))} className="pill">{cat.name}</Link>}
          <h1>{doc.title}</h1>
          <p className="meta">
            {author && <span>By {author.name}</span>}
            {doc.publishedAt && <time dateTime={doc.publishedAt}>{fmt(doc.publishedAt)}</time>}
            {doc.readingTime ? <span>{doc.readingTime} min read</span> : null}
          </p>
          <Cover doc={doc} size="hero" priority className="cover" />
        </header>
        <div className="post-body">
          <Toc headings={headings} />
          {hasBody(doc) && <RichText data={bodyOf(doc)} />}
          {tags.length > 0 && (
            <p className="tags">
              {tags.map((t: any) => (
                <Link key={t.id} href={withTrailingSlash(getPath('tags', t))}>#{t.name}</Link>
              ))}
            </p>
          )}
        </div>
      </article>
      <Faq title={doc.faqTitle} items={doc.faq} />
      {related.length > 0 && (
        <section className="container sec">
          <h2>Related articles</h2>
          <div className="grid g3">
            {related.map((r: any) => (
              <PostCard key={r.id} doc={r} collection="posts" />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

/** Guide / case / update / review → theme single templates. */
export async function EntryTemplate({ doc, collection }: { doc: any; collection: string }) {
  const gc = await getGlobalContent()
  const cls = `single single-${collection.replace(/s$/, '')}`
  const body = collection === 'guides' ? <SingleGuide doc={doc} gc={gc} /> : collection === 'cases' ? <SingleCase doc={doc} gc={gc} /> : <SinglePost doc={doc} gc={gc} collection={collection} />
  return (
    <>
      <BodyClass classes={cls} />
      {body}
    </>
  )
}
