import type { Metadata } from 'next'
import { AuthorArchive, authorMetadata } from '@/lib/archives'

export const revalidate = 3600
export const dynamicParams = true
export const generateStaticParams = async () => []

type Props = { params: Promise<{ slug: string; rest?: string[] }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, rest } = await params
  return authorMetadata(slug, rest)
}

export default async function Page({ params }: Props) {
  const { slug, rest } = await params
  return <AuthorArchive slug={slug} rest={rest} />
}
