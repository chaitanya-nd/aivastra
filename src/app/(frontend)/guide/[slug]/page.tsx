import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { findOne, getSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { EntryTemplate } from '@/lib/templates'
import { getPath, withTrailingSlash } from '@/lib/urls'

export const revalidate = 3600
export const dynamicParams = true
export const generateStaticParams = async () => []

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await findOne('guides', { slug: { equals: slug } })
  if (!doc) return {}
  return buildMetadata({ collection: 'guides', doc, settings: await getSettings(), type: 'article' })
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const doc = await findOne('guides', { slug: { equals: slug } })
  if (!doc) {
    notFound()
  }
  return <EntryTemplate doc={doc} collection="guides" />
}
