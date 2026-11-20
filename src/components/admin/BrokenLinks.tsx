'use client'

import { useEffect, useState } from 'react'

type R = { at: string; running: boolean; checked: number; broken: { url: string; status: number | string; sources: { collection: string; id: number; title: string }[] }[] }

export function BrokenLinks() {
  const [r, setR] = useState<R | null>(null)
  const load = () => fetch('/api/av/link-scan', { credentials: 'include' }).then((x) => x.json()).then(setR).catch(() => {})
  useEffect(() => { load() }, [])
  useEffect(() => { if (!r?.running) return; const t = setInterval(load, 3000); return () => clearInterval(t) }, [r?.running])
  const start = async () => { await fetch('/api/av/link-scan', { method: 'POST', credentials: 'include' }); setR((x) => ({ ...(x as R), running: true })); setTimeout(load, 1500) }
  return (
    <section className="wpw"><h2>Broken links <small>{r?.at ? `last scan ${new Date(r.at).toLocaleString()} · ${r.checked} links checked` : 'not scanned yet'}</small></h2>
      <div style={{ padding: '12px 22px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <button type="button" className="wp-btn primary" disabled={r?.running} onClick={start}>{r?.running ? 'Scanning…' : 'Scan now'}</button>
        <span style={{ color: 'var(--av-mute)', fontSize: 13 }}>Checks every link in published content (internal and external).</span>
      </div>
      <ul className="wpw-list" style={{ padding: '4px 0', maxHeight: 520, overflow: 'auto' }}>
        {r?.broken.map((b) => (
          <li key={b.url} style={{ display: 'grid', gap: 3 }}>
            <span style={{ display: 'flex', gap: 8 }}><b style={{ color: 'var(--av-err)', minWidth: 74 }}>{b.status}</b><a href={b.url} target="_blank" rel="noreferrer" style={{ wordBreak: 'break-all' }}>{b.url}</a></span>
            <span style={{ fontSize: 12 }}>in {b.sources.map((s, i) => <span key={`${s.collection}${s.id}`}>{i ? ', ' : ''}<a href={`/admin/collections/${s.collection}/${s.id}`}>{s.title}</a></span>)}</span>
          </li>
        ))}
        {r?.at && !r.broken.length && <li><span style={{ color: 'var(--av-ok)' }}>No broken links found.</span></li>}
      </ul>
    </section>
  )
}
