import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { log404, getGlobalContent, getSettings, resolvePath } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { BodyClass } from '@/components/theme/BodyClass'
import { SinglePost, bodyParts } from '@/components/theme/pages/SinglePost'
import { BlogIndex } from '@/components/theme/pages/BlogIndex'
import { PageTemplate } from '@/lib/templates'
import { DateArchive, dateArchiveEnabled, parseDateArchive } from '@/lib/archives'
import { getPath, withTrailingSlash } from '@/lib/urls'
import type { Crumb } from '@/components/Breadcrumbs'

export const revalidate = 3600
export const dynamicParams = true
export const generateStaticParams = async () => []

type Props = { params: Promise<{ slug?: string[] }> }

/** /my-post/2/ → page 2 of a post split with <!--nextpage-->. */
async function multipagePost(segments: string[]) {
  if (segments.length !== 2 || !/^[2-9]\d*$|^1\d+$/.test(segments[1])) return null
  const hit = await resolvePath([segments[0]])
  if (!hit || hit.collection !== 'posts') return null
  const n = Number(segments[1])
  const parts = bodyParts(hit.doc)
  return parts && n <= parts.length ? { hit, part: n } : null
}

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
  if (!hit) {
    const mp = await multipagePost(segments)
    if (mp) {
      const md = buildMetadata({ collection: 'posts', doc: mp.hit.doc, settings: await getSettings(), type: 'article' })
      return { ...md, title: `${md.title ?? mp.hit.doc.title} – Page ${mp.part}` }
    }
    const d = parseDateArchive(segments)
    // Rank Math: date archives are always noindex
    return d && (await dateArchiveEnabled()) ? { title: `Archives: ${d.label}`, robots: { index: false, follow: true } } : {}
  }
  const settings = await getSettings()
  if (hit.collection === 'blog') return { title: { absolute: (settings as any).homeTitle || `${settings.siteName}${settings.tagline ? ` - ${settings.tagline}` : ''}` }, description: (settings as any).homeDescription || undefined, alternates: { canonical: '/' } }
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
    const mp = await multipagePost(segments)
    if (mp) return (<><BodyClass classes="single single-post" /><SinglePost doc={mp.hit.doc} gc={await getGlobalContent()} part={mp.part} /></>)
  }
  if (!hit && parseDateArchive(segments)) return <DateArchive segments={segments} page={page} />
  if (!hit) {
    if (segments.length && !/\.[a-z0-9]{2,5}$/i.test(segments.at(-1)!)) {
      const h = await headers()
      void log404(`/${segments.join('/')}`, h.get('referer'), h.get('user-agent'))
    }
    notFound()
  }

  if (hit.collection === 'blog')
    return (
      <>
        <BodyClass classes="home blog" />
        <BlogIndex gc={await getGlobalContent()} page={page} basePath="/" />
      </>
    )

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
