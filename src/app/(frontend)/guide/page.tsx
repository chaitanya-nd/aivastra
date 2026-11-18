import type { Metadata } from 'next'
import { CptArchive } from '@/lib/archives'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Guides', alternates: { canonical: '/guide/' } }

export default function Page() {
  return <CptArchive collection="guides" title="Guides" />
}
