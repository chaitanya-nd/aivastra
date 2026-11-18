import type { Metadata } from 'next'
import { CptArchive } from '@/lib/archives'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Reviews', alternates: { canonical: '/review/' } }

export default function Page() {
  return <CptArchive collection="reviews" title="Reviews" />
}
