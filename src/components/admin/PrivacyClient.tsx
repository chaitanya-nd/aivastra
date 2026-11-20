'use client'

import { useState } from 'react'

export function PrivacyClient() {
  const [email, setEmail] = useState('')
  const [found, setFound] = useState<{ account: boolean; comments: number; formSubmissions: number } | null>(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const post = (action: string) => fetch('/api/av/privacy', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, action }) })
  async function lookup() {
    setBusy(true); setMsg(''); setFound(null)
    const r = await post('lookup'); const j = await r.json(); setBusy(false)
    if (!r.ok) return setMsg(j.error)
    setFound(j.found)
  }
  async function exportData() {
    const r = await post('export')
    if (!r.ok) return setMsg((await r.json()).error)
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(await r.blob()), download: `personal-data-${email}.json` })
    a.click()
  }
  async function erase() {
    if (!confirm(`Erase personal data for ${email}? Comments are anonymised, form messages deleted and a subscriber account removed. This cannot be undone.`)) return
    setBusy(true)
    const r = await post('erase'); const j = await r.json(); setBusy(false)
    setMsg(r.ok ? `Done: ${j.anonymisedComments} comments anonymised, ${j.deletedSubmissions} form messages deleted${j.accountRemoved ? ', account removed' : ''}${j.staffAccountKept ? ' (a staff account exists and was kept — remove it under Users if needed)' : ''}.` : j.error)
    setFound(null)
  }
  return (
    <section className="wpw">
      <h2>Find a person’s data</h2>
      <div style={{ padding: '16px 22px', display: 'grid', gap: 14, maxWidth: 640 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input type="email" placeholder="person@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: 1 }} />
          <button type="button" className="wp-btn primary" disabled={busy || !email} onClick={lookup}>Look up</button>
        </div>
        {found && (
          <>
            <ul className="sv-checks" style={{ border: '1px solid var(--av-line2)', borderRadius: 10 }}>
              <li className={found.account ? 'ok' : 'no'}><b>User account</b><span>{found.account ? 'Found' : 'None'}</span></li>
              <li className={found.comments ? 'ok' : 'no'}><b>Comments</b><span>{found.comments}</span></li>
              <li className={found.formSubmissions ? 'ok' : 'no'}><b>Form messages</b><span>{found.formSubmissions}</span></li>
            </ul>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="wp-btn" onClick={exportData}>Download export (JSON)</button>
              <button type="button" className="wp-btn" style={{ color: 'var(--av-err)' }} disabled={busy} onClick={erase}>Erase personal data</button>
            </div>
          </>
        )}
        {msg && <p className="sv-note" style={{ margin: 0 }}>{msg}</p>}
      </div>
    </section>
  )
}
