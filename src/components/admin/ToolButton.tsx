'use client'
import { useState } from 'react'
export function ToolButton({ action, label, download }: { action: string; label: string; download?: boolean }) {
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  async function run() {
    setBusy(true); setMsg('')
    try {
      const r = await fetch(`/api/tools?action=${action}`, { credentials: 'include' })
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Failed')
      if (download) {
        const b = await r.blob(); const a = document.createElement('a'); a.href = URL.createObjectURL(b)
        a.download = r.headers.get('content-disposition')?.match(/filename="(.+)"/)?.[1] || 'backup.json'; a.click(); setMsg('Backup downloaded.')
      } else setMsg('Done — all cached pages will be rebuilt on the next visit.')
    } catch (e: any) { setMsg(e.message) } finally { setBusy(false) }
  }
  return <div><button className="wp-btn primary" disabled={busy} onClick={run}>{busy ? 'Working…' : label}</button>{msg && <p className="wpw-foot" style={{ border: 0, padding: '10px 0 0' }}>{msg}</p>}</div>
}
