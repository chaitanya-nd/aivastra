import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AuthForm } from '@/components/theme/pages/AuthForm'
import { getPluginSettings, getSettings } from '@/lib/data'
import { getPath } from '@/lib/urls'
import { safeBack } from '@/lib/membership'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Register', robots: { index: false, follow: false } }

type Props = { searchParams: Promise<Record<string, string | undefined>> }

export default async function Page({ searchParams }: Props) {
  const sp = await searchParams
  const ps: any = await getPluginSettings().catch(() => null)
  const canRegister = Boolean(ps?.usersCanRegister)
  if (!canRegister) notFound()
  const ss: any = await getSettings()
  const privacyUrl = ss?.privacyPolicyPage && typeof ss.privacyPolicyPage === 'object' ? `${getPath('pages', ss.privacyPolicyPage).replace(/\/$/, '')}/` : null
  const notice = sp.verified ? 'Email confirmed — you can log in now.' : sp.check ? 'Almost done: we emailed you a link to confirm your address.' : undefined
  return <AuthForm mode="register" error={sp.error} redirectTo={safeBack(sp.redirect_to)} canRegister={canRegister} notice={notice} privacyUrl={privacyUrl} />
}
