'use client'

import { useState } from 'react'

export function TwoFactorClient({ enabled, email, recoveryLeft }: { enabled: boolean; email: string; recoveryLeft: number }) {
  const [on, setOn] = useState(enabled)
  const [setup, setSetup] = useState<{ secret: string; qr: string } | null>(null)
  const [code, setCode] = useState('')
  const [codes, setCodes] = useState<string[] | null>(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const call = async (action: string, body: any = {}) => {
    setBusy(true); setErr('')
    try {
      const r = await fetch(`/api/av/mfa/${action}`, { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Something went wrong')
      return j
    } catch (e: any) { setErr(e.message); return null } finally { setBusy(false) }
  }
  return (
    <section className="wpw">
      <h2>{on ? 'Two-factor login is on' : 'Two-factor login is off'}</h2>
      <div style={{ padding: '16px 22px', display: 'grid', gap: 14, maxWidth: 620 }}>
        {codes && (
          <div className="sv-confirm">
            <h4>Save your recovery codes</h4>
            <p style={{ margin: '0 0 10px', color: 'var(--av-mute)', fontSize: 13 }}>Each code works once if you lose your phone. They will not be shown again.</p>
            <pre style={{ margin: 0, fontSize: 15, lineHeight: 1.8 }}>{codes.join('\n')}</pre>
          </div>
        )}
        {!on && !setup && (
          <>
            <p style={{ margin: 0, color: 'var(--av-mute)' }}>After your password, you will also enter a 6-digit code from an authenticator app (Google Authenticator, 1Password, Authy, Microsoft Authenticator).</p>
            <div><button type="button" className="wp-btn primary" disabled={busy} onClick={async () => { const j = await call('setup'); if (j) setSetup(j) }}>Set up two-factor login</button></div>
          </>
        )}
        {!on && setup && (
          <>
            <p style={{ margin: 0 }}>1. Scan this code with your authenticator app (account: {email}).</p>
            <img src={setup.qr} alt="QR code for your authenticator app" width={200} height={200} style={{ borderRadius: 10, background: '#fff', padding: 6 }} />
            <p style={{ margin: 0, color: 'var(--av-mute)', fontSize: 13 }}>Can’t scan? Enter this key: <code>{setup.secret.replace(/(.{4})/g, '$1 ').trim()}</code></p>
            <p style={{ margin: 0 }}>2. Enter the 6-digit code it shows.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={6} placeholder="123456" style={{ width: 140 }} />
              <button type="button" className="wp-btn primary" disabled={busy || code.length !== 6} onClick={async () => { const j = await call('enable', { code }); if (j) { setOn(true); setCodes(j.recoveryCodes); setSetup(null); setCode('') } }}>Turn on</button>
            </div>
          </>
        )}
        {on && (
          <>
            <p style={{ margin: 0, color: 'var(--av-mute)' }}>Recovery codes left: {codes ? codes.length : recoveryLeft}. To turn two-factor login off, enter a current code.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={code} onChange={(e) => setCode(e.target.value)} maxLength={11} placeholder="Code" style={{ width: 160 }} />
              <button type="button" className="wp-btn" disabled={busy || !code} onClick={async () => { const j = await call('disable', { code }); if (j) { setOn(false); setCodes(null); setCode('') } }}>Turn off</button>
            </div>
          </>
        )}
        {err && <p className="sv-note err" style={{ margin: 0 }}>{err}</p>}
      </div>
    </section>
  )
}
