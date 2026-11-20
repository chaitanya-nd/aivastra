import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AccountPage } from '@/components/theme/pages/AccountForms'
import { getClient } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Your account', robots: { index: false, follow: false } }
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const payload = await getClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/login/?redirect_to=/account/')
  return <AccountPage user={user} saved={Boolean(sp.saved || sp.reset)} error={sp.error} />
}
