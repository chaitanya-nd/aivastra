'use client'

import { useSelection } from '@payloadcms/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const TABS: [string, string][] = [['', 'All'], ['pending', 'Pending'], ['approved', 'Approved'], ['spam', 'Spam'], ['trash', 'Trash']]
const api = (q: string) => fetch(`/api/comments?limit=1&depth=0&${q}`, { credentials: 'include' }).then((r) => r.json()).then((j) => j.totalDocs ?? 0)

/** WordPress Comments list header: All | Pending | Approved | Spam | Trash + bulk actions. */
export function CommentsTop() {
  const router = useRouter()
  const path = usePathname()
  const sp = useSearchParams()
  const { selectedIDs } = useSelection()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [action, setAction] = useState('')
  const [busy, setBusy] = useState(false)
  const cur = sp.get('where[status][equals]') ?? (sp.get('where[status][in]') ? '' : '')

  useEffect(() => {
    ;(async () => {
      const c: Record<string, number> = {}
      for (const [k] of TABS) c[k] = await api(k ? `where[status][equals]=${k}` : 'where[status][in]=pending,approved')
      setCounts(c)
    })()
  }, [sp])

  const go = (k: string) => {
    const q = new URLSearchParams(sp.toString())
    q.delete('where[status][equals]'); q.delete('where[status][in]'); q.delete('page')
    q.set(k ? 'where[status][equals]' : 'where[status][in]', k || 'pending,approved')
    router.push(`${path}?${q.toString()}`)
  }
  async function apply() {
    if (!action || !selectedIDs.length) return
    if (action === 'delete' && !confirm(`Permanently delete ${selectedIDs.length} comment(s)?`)) return
    setBusy(true)
    for (const id of selectedIDs) {
      if (action === 'delete') await fetch(`/api/comments/${id}`, { method: 'DELETE', credentials: 'include' })
      else await fetch(`/api/comments/${id}`, { method: 'PATCH', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: action }) })
    }
    setBusy(false); setAction(''); router.refresh()
  }
  const inTrash = cur === 'trash' || cur === 'spam'
  return (
    <div className="wpl-top">
      <ul className="wpl-status">
        {TABS.map(([k, label]) => (
          <li key={k}>
            <button type="button" className={(cur || '') === k ? 'on' : ''} onClick={() => go(k)}>{label} <span>({counts[k] ?? '…'})</span></button>
            {k !== 'trash' && <i>|</i>}
          </li>
        ))}
      </ul>
      <div className="wpl-bar">
        <div className="wpl-bulk">
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="">Bulk actions</option>
            {inTrash ? <><option value="pending">Restore</option><option value="delete">Delete permanently</option></> : <>
              <option value="approved">Approve</option><option value="pending">Unapprove</option><option value="spam">Mark as spam</option><option value="trash">Move to Trash</option></>}
          </select>
          <button type="button" className="wp-btn" disabled={!action || !selectedIDs.length || busy} onClick={apply}>{busy ? 'Working…' : 'Apply'}</button>
        </div>
      </div>
    </div>
  )
}
