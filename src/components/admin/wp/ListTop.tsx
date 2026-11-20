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
  const [bulk, setBulk] = useState(false)
  const [terms, setTerms] = useState<{ cats: any[]; tags: any[]; users: any[] }>({ cats: [], tags: [], users: [] })
  const [be, setBe] = useState({ addCats: [] as string[], addTags: [] as string[], author: '', status: '', format: '', sticky: '', comments: '' })
  const inTrash = path.endsWith('/trash')
  const base = `/admin/collections/${slug}`
  const current = sp.get('where[_status][equals]') ?? ''
  const versioned = !['media', 'users', 'categories', 'tags', 'section-categories', 'redirects', 'forms', 'form-submissions', 'not-found-log'].includes(slug ?? '')

  useEffect(() => {
    if (!slug || !versioned) return
    ;(async () => {
      const get = async (st: string | null) => (await (await fetch(`/api/${slug}?limit=1&depth=0&draft=true${st ? `&where[_status][equals]=${st}` : ''}`, { credentials: 'include' })).json()).totalDocs ?? 0
      const trashed = (await (await fetch(`/api/${slug}?limit=1&depth=0&trash=true&where[deletedAt][exists]=true`, { credentials: 'include' })).json()).totalDocs ?? 0
      const pending = (await (await fetch(`/api/${slug}?limit=1&depth=0&draft=true&where[reviewStatus][equals]=pending&where[_status][equals]=draft`, { credentials: 'include' })).json()).totalDocs ?? 0
      setCounts({ '': await get(null), published: await get('published'), draft: await get('draft'), pending, trash: trashed })
    })()
  }, [slug, versioned, sp])

  const go = (st: string) => {
    const q = new URLSearchParams(sp.toString())
    q.delete('where[_status][equals]'); q.delete('where[reviewStatus][equals]'); q.delete('page')
    if (st) q.set('where[_status][equals]', st)
    router.push(`${base}?${q.toString()}`)
  }
  async function openBulk() {
    setBulk(true)
    if (terms.users.length) return
    const get = (u: string) => fetch(u, { credentials: 'include' }).then((r) => r.json()).then((j) => j.docs ?? []).catch(() => [])
    const [cats, tags, users] = await Promise.all([slug === 'posts' ? get('/api/categories?limit=500&depth=0&sort=name') : [], slug === 'posts' ? get('/api/tags?limit=500&depth=0&sort=name') : [], get('/api/users?limit=200&depth=0&sort=name')])
    setTerms({ cats, tags, users })
  }
  async function applyBulk() {
    if (!selectedIDs.length) return
    setBusy(true)
    for (const id of selectedIDs) {
      const body: any = {}
      if (be.addCats.length || be.addTags.length) {
        const cur = await fetch(`/api/${slug}/${id}?depth=0&draft=true`, { credentials: 'include' }).then((r) => r.json()).catch(() => ({}))
        const ids = (xs: any[] = []) => xs.map((x) => (typeof x === 'object' ? x?.id : x)).filter(Boolean).map(Number)
        if (be.addCats.length) body.categories = [...new Set([...ids(cur.categories), ...be.addCats.map(Number)])]
        if (be.addTags.length) body.tags = [...new Set([...ids(cur.tags), ...be.addTags.map(Number)])]
      }
      if (be.author) body.author = Number(be.author)
      if (be.status) body._status = be.status
      if (be.format) body.format = be.format
      if (be.sticky) body.sticky = be.sticky === 'yes'
      if (be.comments) body.commentsMode = be.comments
      if (Object.keys(body).length) await fetch(`/api/${slug}/${id}`, { method: 'PATCH', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
    }
    setBusy(false); setBulk(false); setAction(''); setBe({ addCats: [], addTags: [], author: '', status: '', format: '', sticky: '', comments: '' }); router.refresh()
  }
  async function apply() {
    if (action === 'edit') return selectedIDs.length ? openBulk() : undefined
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
          <li><button type="button" className={sp.get('where[reviewStatus][equals]') === 'pending' ? 'on' : ''} onClick={() => { const q = new URLSearchParams(); q.set('where[reviewStatus][equals]', 'pending'); q.set('where[_status][equals]', 'draft'); router.push(`${base}?${q}`) }}>Pending <span>({counts.pending ?? '…'})</span></button><i>|</i></li>
          <li><button type="button" className={inTrash ? 'on' : ''} onClick={() => router.push(inTrash ? base : `${base}/trash`)}>Trash <span>({counts.trash ?? '…'})</span></button></li>
        </ul>
      )}
      <div className="wpl-bar">
        <div className="wpl-bulk">
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="">Bulk actions</option>
            {inTrash ? <><option value="restore">Restore</option><option value="delete">Delete permanently</option></> : <>
              {versioned && <option value="edit">Edit</option>}
              {versioned && <option value="published">Publish</option>}
              {versioned && <option value="draft">Move to Draft</option>}
              <option value="trash">Move to Trash</option></>}
          </select>
          <button type="button" className="wp-btn" disabled={!action || !selectedIDs.length || busy} onClick={apply}>{busy ? 'Working…' : 'Apply'}</button>
          {selectedIDs.length > 0 && <span className="wpx-mute">{selectedIDs.length} selected</span>}
        </div>
        <button type="button" className="wp-btn wpl-so" onClick={() => setOpts(!opts)}>View options {opts ? '▴' : '▾'}</button>
      </div>
      {bulk && (
        <div className="wpl-bulkedit">
          <div className="wpl-be-h"><b>Bulk Edit</b><span>{selectedIDs.length} item{selectedIDs.length === 1 ? '' : 's'} selected · empty fields stay unchanged</span></div>
          <div className="wpl-be-grid">
            {slug === 'posts' && <label>Add categories<select multiple size={6} value={be.addCats} onChange={(e) => setBe({ ...be, addCats: Array.from(e.target.selectedOptions).map((o) => o.value) })}>{terms.cats.map((c) => <option key={c.id} value={String(c.id)}>{c.name ?? c.title}</option>)}</select></label>}
            {slug === 'posts' && <label>Add tags<select multiple size={6} value={be.addTags} onChange={(e) => setBe({ ...be, addTags: Array.from(e.target.selectedOptions).map((o) => o.value) })}>{terms.tags.map((c) => <option key={c.id} value={String(c.id)}>{c.name ?? c.title}</option>)}</select></label>}
            <div className="wpl-be-col">
              {slug === 'posts' && <label>Author<select value={be.author} onChange={(e) => setBe({ ...be, author: e.target.value })}><option value="">— No change —</option>{terms.users.filter((u) => u.role !== 'subscriber').map((u) => <option key={u.id} value={String(u.id)}>{u.name || u.email}</option>)}</select></label>}
              <label>Status<select value={be.status} onChange={(e) => setBe({ ...be, status: e.target.value })}><option value="">— No change —</option><option value="published">Published</option><option value="draft">Draft</option></select></label>
              {slug === 'posts' && <label>Comments<select value={be.comments} onChange={(e) => setBe({ ...be, comments: e.target.value })}><option value="">— No change —</option><option value="default">Site default</option><option value="open">Allow</option><option value="closed">Do not allow</option></select></label>}
            </div>
            {slug === 'posts' && (
              <div className="wpl-be-col">
                <label>Format<select value={be.format} onChange={(e) => setBe({ ...be, format: e.target.value })}><option value="">— No change —</option>{['standard', 'aside', 'gallery', 'link', 'image', 'quote', 'status', 'video', 'audio', 'chat'].map((f) => <option key={f} value={f}>{f[0].toUpperCase() + f.slice(1)}</option>)}</select></label>
                <label>Sticky<select value={be.sticky} onChange={(e) => setBe({ ...be, sticky: e.target.value })}><option value="">— No change —</option><option value="yes">Sticky</option><option value="no">Not sticky</option></select></label>
              </div>
            )}
          </div>
          <div className="wpl-be-f"><button type="button" className="wp-btn" onClick={() => setBulk(false)}>Cancel</button><button type="button" className="wp-btn primary" disabled={busy} onClick={applyBulk}>{busy ? 'Updating…' : 'Update'}</button></div>
        </div>
      )}
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
