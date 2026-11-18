import type { Metadata } from 'next'
import { CptArchive } from '@/lib/archives'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Case studies', alternates: { canonical: '/case/' } }

export default function Page() {
  return <CptArchive collection="cases" title="Case studies" />
}
