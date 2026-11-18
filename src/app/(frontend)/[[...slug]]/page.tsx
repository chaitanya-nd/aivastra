import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { log404, getGlobalContent, getSettings, resolvePath } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { BodyClass } from '@/components/theme/BodyClass'
import { SinglePost } from '@/components/theme/pages/SinglePost'
import { PageTemplate } from '@/lib/templates'
import { getPath, withTrailingSlash } from '@/lib/urls'
import type { Crumb } from '@/components/Breadcrumbs'

export const revalidate = 3600
export const dynamicParams = true
export const generateStaticParams = async () => []

type Props = { params: Promise<{ slug?: string[] }> }

/** /blog/page/2/ → page 2 of the "blog" page; the rest is the page path. */
function split(slug: string[] = []) {
  const n = slug.length
  if (n >= 3 && slug[n - 2] === 'page' && /^\d+$/.test(slug[n - 1])) {
    return { segments: slug.slice(0, n - 2), page: Number(slug[n - 1]) }
  }
  return { segments: slug, page: 1 }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments, page } = split((await params).slug)
  const hit = await resolvePath(segments)
  if (!hit) return {}
  const settings = await getSettings()
  const md = buildMetadata({
    collection: hit.collection,
    doc: hit.doc,
    settings,
    type: hit.collection === 'posts' ? 'article' : 'website',
  })
  return page > 1 && settings.noindexPaginated !== false ? { ...md, robots: { index: false, follow: true } } : md
}

export default async function Page({ params }: Props) {
  const { segments, page } = split((await params).slug)
  const hit = await resolvePath(segments)

  if (!hit) {
    if (segments.length && !/\.[a-z0-9]{2,5}$/i.test(segments.at(-1)!)) {
      const h = await headers()
      void log404(`/${segments.join('/')}`, h.get('referer'), h.get('user-agent'))
    }
    notFound()
  }

  if (hit.collection === 'posts')
    return (
      <>
        <BodyClass classes="single single-post" />
        <SinglePost doc={hit.doc} gc={await getGlobalContent()} />
      </>
    )

  const path = getPath('pages', hit.doc)
  const trail: Crumb[] = (hit.doc.breadcrumbs || [])
    .map((b: any) => ({ name: b.label, path: b.url }))
    .filter((b: Crumb) => b.path)
  return <PageTemplate doc={hit.doc} crumbs={trail} page={page} basePath={path} />
}
