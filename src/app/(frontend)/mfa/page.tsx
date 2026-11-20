import type { Metadata } from 'next'
import { safeBack } from '@/lib/membership'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Two-factor login', robots: { index: false, follow: false } }

/** Second login step for accounts with two-factor login. */
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  return (
    <div className="container sec cms" style={{ maxWidth: 440, paddingTop: 80, paddingBottom: 100 }}>
      <h1>Two-factor login</h1>
      <p>Enter the 6-digit code from your authenticator app, or one of your recovery codes.</p>
      {sp.error && <p role="alert" style={{ color: '#d93450' }}>That code is not valid. Try again.</p>}
      <form action="/api/av/mfa/verify" method="post" style={{ display: 'grid', gap: 14 }}>
        <input type="hidden" name="next" value={safeBack(sp.next || '/admin')} />
        <label>Code<input name="code" inputMode="numeric" autoComplete="one-time-code" autoFocus required maxLength={11} /></label>
        <button type="submit" className="ui-view-more-btn">Verify</button>
      </form>
      <p style={{ marginTop: 18 }}><a href="/api/users/logout">Sign out</a></p>
    </div>
  )
}
