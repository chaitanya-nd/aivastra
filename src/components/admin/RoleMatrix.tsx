'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type R = { key: string; label: string; locked: boolean; users: number }
export function RoleMatrix({ roles, caps, initial, defaults, canEdit }: { roles: R[]; caps: { key: string; label: string }[]; initial: Record<string, string[]>; defaults: Record<string, string[]>; canEdit: boolean }) {
  const router = useRouter()
  const [m, setM] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const dirty = JSON.stringify(m) !== JSON.stringify(initial)
  const flip = (r: string, c: string) => setM((x) => ({ ...x, [r]: x[r].includes(c) ? x[r].filter((y) => y !== c) : [...x[r], c] }))
  async function save(next = m) {
    setBusy(true); setMsg('')
    const editable = Object.fromEntries(roles.filter((r) => !r.locked).map((r) => [r.key, next[r.key]]))
    const res = await fetch('/api/globals/role-capabilities', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ matrix: editable }) })
    setBusy(false)
    setMsg(res.ok ? 'Saved. Changes apply within 30 seconds.' : 'Could not save.')
    if (res.ok) router.refresh()
  }
  return (
    <section className="wpw">
      <div style={{ overflowX: 'auto' }}>
        <table className="rm-t">
          <thead><tr><th>Capability</th>{roles.map((r) => <th key={r.key}>{r.label}<small>{r.users} user{r.users === 1 ? '' : 's'}</small></th>)}</tr></thead>
          <tbody>
            {caps.map((c) => (
              <tr key={c.key}>
                <td>{c.label}<code>{c.key}</code></td>
                {roles.map((r) => (
                  <td key={r.key}><input type="checkbox" aria-label={`${r.label}: ${c.label}`} checked={m[r.key]?.includes(c.key) ?? false} disabled={!canEdit || r.locked} onChange={() => flip(r.key, c.key)} /></td>
                ))}
              </tr>
            ))}
            <tr><td>Access the admin panel</td>{roles.map((r) => <td key={r.key}>{r.key === 'subscriber' ? '—' : '✓'}</td>)}</tr>
            <tr><td>Manage users and roles</td>{roles.map((r) => <td key={r.key}>{r.key === 'admin' ? '✓' : '—'}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <div className="rm-f">
        <span>{canEdit ? 'Administrator and Subscriber are fixed. Assign roles under Users → edit user → Role.' : 'Only administrators can change capabilities.'}{msg && <b> {msg}</b>}</span>
        {canEdit && <>
          <button type="button" className="wp-btn" disabled={busy} onClick={() => { setM(defaults); void save(defaults) }}>Reset to defaults</button>
          <button type="button" className="wp-btn primary" disabled={!dirty || busy} onClick={() => save()}>{busy ? 'Saving…' : 'Save changes'}</button>
        </>}
      </div>
    </section>
  )
}
