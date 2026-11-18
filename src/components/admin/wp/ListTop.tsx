'use client'

import { useSelection } from '@payloadcms/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const STATUS: [string, string, string | null][] = [['', 'All', null], ['published', 'Published', 'published'], ['draft', 'Drafts', 'draft']]

/** WordPress list-table header: All | Published | Drafts, Bulk actions + Apply, Screen Options. */
export function ListTop() {
  const path = usePathname()
  const router = useRouter()
  const sp = useSearchParams()
  const slug = path.split('/collections/')[1]?.split('/')[0]
  const { selectedIDs } = useSelection()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [action, setAction] = useState('')
  const [busy, setBusy] = useState(false)
  const [opts, setOpts] = useState(false)
  const inTrash = path.endsWith('/trash')
  const base = `/admin/collections/${slug}`
  const current = sp.get('where[_status][equals]') ?? ''
  const versioned = !['media', 'users', 'categories', 'tags', 'section-categories', 'redirects', 'forms', 'form-submissions', 'not-found-log'].includes(slug ?? '')

  useEffect(() => {
    if (!slug || !versioned) return
    ;(async () => {
      const get = async (st: string | null) => (await (await fetch(`/api/${slug}?limit=1&depth=0&draft=true${st ? `&where[_status][equals]=${st}` : ''}`, { credentials: 'include' })).json()).totalDocs ?? 0
      const trashed = (await (await fetch(`/api/${slug}?limit=1&depth=0&trash=true&where[deletedAt][exists]=true`, { credentials: 'include' })).json()).totalDocs ?? 0
      setCounts({ '': await get(null), published: await get('published'), draft: await get('draft'), trash: trashed })
    })()
  }, [slug, versioned, sp])

  const go = (st: string) => {
    const q = new URLSearchParams(sp.toString())
    q.delete('where[_status][equals]'); q.delete('page')
    if (st) q.set('where[_status][equals]', st)
    router.push(`${base}?${q.toString()}`)
  }
  async function apply() {
    if (!action || !selectedIDs.length) return
    if (action === 'delete' && !confirm(`Permanently delete ${selectedIDs.length} item(s)? This cannot be undone.`)) return
    setBusy(true)
    const json = { 'content-type': 'application/json' }
    for (const id of selectedIDs) {
      if (action === 'trash' && !versioned) await fetch(`/api/${slug}/${id}`, { method: 'DELETE', credentials: 'include' })
      else if (action === 'trash') await fetch(`/api/${slug}/${id}`, { method: 'PATCH', credentials: 'include', headers: json, body: JSON.stringify({ deletedAt: new Date().toISOString() }) })
      else if (action === 'restore') await fetch(`/api/${slug}/${id}?trash=true`, { method: 'PATCH', credentials: 'include', headers: json, body: JSON.stringify({ deletedAt: null }) })
      else if (action === 'delete') await fetch(`/api/${slug}/${id}?trash=true`, { method: 'DELETE', credentials: 'include' })
      else await fetch(`/api/${slug}/${id}`, { method: 'PATCH', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ _status: action }) })
    }
    setBusy(false); setAction(''); router.refresh()
  }
  const perPage = Number(sp.get('limit') ?? 10)
  const setLimit = (n: number) => { const q = new URLSearchParams(sp.toString()); q.set('limit', String(n)); q.delete('page'); router.push(`${path}?${q.toString()}`) }

  return (
    <div className="wpl-top">
      {versioned && (
        <ul className="wpl-status">
          {STATUS.map(([k, label, st], i) => (
            <li key={k}>
              <button type="button" className={!inTrash && current === (st ?? '') ? 'on' : ''} onClick={() => go(st ?? '')}>{label} <span>({counts[k] ?? '…'})</span></button>
              <i>|</i>
            </li>
          ))}
          <li><button type="button" className={inTrash ? 'on' : ''} onClick={() => router.push(inTrash ? base : `${base}/trash`)}>Trash <span>({counts.trash ?? '…'})</span></button></li>
        </ul>
      )}
      <div className="wpl-bar">
        <div className="wpl-bulk">
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="">Bulk actions</option>
            {inTrash ? <><option value="restore">Restore</option><option value="delete">Delete permanently</option></> : <>
              {versioned && <option value="published">Publish</option>}
              {versioned && <option value="draft">Move to Draft</option>}
              <option value="trash">Move to Trash</option></>}
          </select>
          <button type="button" className="wp-btn" disabled={!action || !selectedIDs.length || busy} onClick={apply}>{busy ? 'Working…' : 'Apply'}</button>
          {selectedIDs.length > 0 && <span className="wpx-mute">{selectedIDs.length} selected</span>}
        </div>
        <button type="button" className="wp-btn wpl-so" onClick={() => setOpts(!opts)}>Screen Options {opts ? '▴' : '▾'}</button>
      </div>
      {opts && (
        <div className="wpl-opts">
          <strong>Pagination</strong>
          <label>Number of items per page: <input type="number" min={1} max={200} defaultValue={perPage} onBlur={(e) => setLimit(Math.max(1, Math.min(200, Number(e.target.value) || 10)))} onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} /></label>
          <span className="wpx-mute">Use the “Columns” button in the toolbar to show or hide columns.</span>
        </div>
      )}
    </div>
  )
}
