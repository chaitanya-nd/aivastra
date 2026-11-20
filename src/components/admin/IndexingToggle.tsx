'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

/** Admin-only switch for "Block search engines". Turning blocking OFF needs an explicit typed confirmation. */
export function IndexingToggle({ blocked, canEdit, lockedBy }: { blocked: boolean; canEdit: boolean; lockedBy: string[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [typed, setTyped] = useState('')
  const [err, setErr] = useState('')

  async function save(next: boolean) {
    setBusy(true); setErr('')
    try {
      const r = await fetch('/api/globals/site-settings', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ blockIndexing: next }) })
      if (!r.ok) throw new Error((await r.json().catch(() => null))?.errors?.[0]?.message || 'Could not save')
      setConfirm(false); setTyped(''); router.refresh()
    } catch (e: any) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <div className="sv-toggle">
      <div className="sv-row">
        <div>
          <b>Block search engines</b>
          <span>{blocked ? 'Crawlers are told to stay away (noindex, robots.txt Disallow, no sitemap).' : 'Crawlers are allowed in, as long as the deployment checks below also pass.'}</span>
        </div>
        <button type="button" role="switch" aria-checked={blocked} disabled={!canEdit || busy} className={`sv-sw${blocked ? ' on' : ''}`} onClick={() => (blocked ? setConfirm(true) : save(true))}>
          <i />
        </button>
      </div>
      {!canEdit && <p className="sv-note">Only administrators can change this switch.</p>}
      {blocked === false && lockedBy.length > 0 && <p className="sv-note warn">The switch is OFF, but this deployment still blocks crawlers: {lockedBy.join('; ')}.</p>}
      {confirm && (
        <div className="sv-confirm">
          <h4>Allow search engines to index this site?</h4>
          <ul>
            <li>Only do this on the real, live domain — never on a test copy.</li>
            <li>The sitemap and robots.txt will start advertising every public URL.</li>
            <li>Sitemap, canonical URLs and analytics must point at the live domain.</li>
          </ul>
          <label>Type <code>ALLOW</code> to confirm<input value={typed} onChange={(e) => setTyped(e.target.value)} autoFocus /></label>
          <div className="sv-actions">
            <button type="button" className="wp-btn primary" disabled={typed !== 'ALLOW' || busy} onClick={() => save(false)}>{busy ? 'Saving…' : 'Allow indexing'}</button>
            <button type="button" className="wp-btn" onClick={() => { setConfirm(false); setTyped('') }}>Cancel</button>
          </div>
        </div>
      )}
      {err && <p className="sv-note err">{err}</p>}
    </div>
  )
}
