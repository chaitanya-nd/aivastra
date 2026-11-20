import type { Metadata } from 'next'
import { LostPassword } from '@/components/theme/pages/AccountForms'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Lost password', robots: { index: false, follow: false } }
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  return <LostPassword sent={Boolean(sp.sent)} error={sp.error} />
}
