import type { Metadata } from 'next'
import { CptArchive } from '@/lib/archives'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Product updates', alternates: { canonical: '/updates/' } }

export default function Page() {
  return <CptArchive collection="updates" title="Product updates" />
}
