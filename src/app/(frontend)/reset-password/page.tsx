import type { Metadata } from 'next'
import { ResetPassword } from '@/components/theme/pages/AccountForms'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Reset password', robots: { index: false, follow: false } }
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  return <ResetPassword token={sp.token || ''} error={sp.error} />
}
