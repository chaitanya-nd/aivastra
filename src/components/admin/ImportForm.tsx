'use client'
import { useState } from 'react'

export function ImportForm() {
  const [msg, setMsg] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true); setMsg([])
    try {
      const data = JSON.parse(await f.text())
      const r = await fetch('/api/tools/import', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) })
      const j = await r.json()
      setMsg(r.ok ? [`Imported — ${j.created} created, ${j.updated} updated, ${j.failed} failed.`, ...(j.errors ?? [])] : [j.error || 'Import failed'])
    } catch (err: any) { setMsg([`Could not read that file: ${err.message}`]) } finally { setBusy(false); e.target.value = '' }
  }
  return (
    <div style={{ padding: '16px 20px', display: 'grid', gap: 12 }}>
      <p style={{ margin: 0, color: 'var(--av-mute)' }}>Choose a JSON file made by <b>Export</b> or <b>Backups</b>. Items are matched by slug (redirections by source URL): existing ones are updated, new ones are created. Settings and menus in the file are restored too. Users are never imported.</p>
      <label className="wp-btn primary" style={{ width: 'fit-content' }}>{busy ? 'Importing…' : 'Choose file & import'}<input type="file" accept="application/json,.json" hidden disabled={busy} onChange={onFile} /></label>
      {msg.map((m, i) => <p key={i} className="wpw-foot" style={{ border: 0, padding: 0, margin: 0 }}>{m}</p>)}
    </div>
  )
}
