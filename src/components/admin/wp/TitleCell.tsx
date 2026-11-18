'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { getPath, SITE_URL } from '@/lib/urls'
import { TEMPLATES, TEMPLATE_LABELS } from '@/acf/build'

const toLocal = (iso?: string | null) => {
  if (!iso) return ''
  const d = new Date(iso); const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

/** WordPress list-table title cell: bold title (— Draft), hover row actions: ID | Edit | Quick Edit | Trash | View. */
export function TitleCell(props: any) {
  const { rowData, cellData, collectionSlug } = props
  const router = useRouter()
  const inTrash = usePathname().endsWith('/trash')
  const [terms, setTerms] = useState<{ cats: any[]; tags: any[] }>({ cats: [], tags: [] })
  const [qe, setQe] = useState(false)
  const [f, setF] = useState({ title: rowData?.title ?? '', slug: rowData?.slug ?? '', publishedAt: toLocal(rowData?.publishedAt), _status: rowData?._status ?? 'draft', menuOrder: rowData?.menuOrder ?? 0, template: rowData?.template ?? 'default', categories: ((rowData?.categories ?? []) as any[]).map((c) => String(typeof c === 'object' ? c.id : c)), tags: ((rowData?.tags ?? []) as any[]).map((c) => String(typeof c === 'object' ? c.id : c)) })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const id = rowData?.id
  const edit = `/admin/collections/${collectionSlug}/${id}`
  const view = `${SITE_URL}${getPath(collectionSlug, rowData)}`

  const hasTerms = collectionSlug === 'posts'
  useEffect(() => {
    if (!qe || !hasTerms || terms.cats.length) return
    Promise.all(['categories', 'tags'].map((c) => fetch(`/api/${c}?limit=500&depth=0&sort=title`, { credentials: 'include' }).then((r) => r.json()))).then(([a, b]) => setTerms({ cats: a.docs ?? [], tags: b.docs ?? [] }))
  }, [qe, hasTerms, terms.cats.length])
  const multi = (k: 'categories' | 'tags') => (e: React.ChangeEvent<HTMLSelectElement>) => setF({ ...f, [k]: Array.from(e.target.selectedOptions).map((o) => o.value) })

  async function save() {
    setBusy(true); setErr('')
    const body: any = { title: f.title, slug: f.slug, _status: f._status }
    if (f.publishedAt !== toLocal(rowData?.publishedAt)) body.publishedAt = f.publishedAt ? new Date(f.publishedAt).toISOString() : null // only when changed
    if (collectionSlug === 'pages') { body.menuOrder = Number(f.menuOrder) || 0; body.template = f.template }
    if (hasTerms) { body.categories = f.categories.map(Number); body.tags = f.tags.map(Number) }
    const r = await fetch(`/api/${collectionSlug}/${id}`, { method: 'PATCH', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
    const j = await r.json()
    setBusy(false)
    if (!r.ok) return setErr(j?.errors?.[0]?.message || 'Could not save')
    setQe(false); router.refresh()
  }
  const json = { 'content-type': 'application/json' }
  async function trash() {
    await fetch(`/api/${collectionSlug}/${id}`, { method: 'PATCH', credentials: 'include', headers: json, body: JSON.stringify({ deletedAt: new Date().toISOString() }) })
    router.refresh()
  }
  async function restore() {
    await fetch(`/api/${collectionSlug}/${id}?trash=true`, { method: 'PATCH', credentials: 'include', headers: json, body: JSON.stringify({ deletedAt: null }) })
    router.refresh()
  }
  async function purge() {
    if (!confirm(`Delete “${cellData}” permanently? This cannot be undone.`)) return
    await fetch(`/api/${collectionSlug}/${id}?trash=true`, { method: 'DELETE', credentials: 'include' })
    router.refresh()
  }
  if (!id) return <>{String(cellData ?? '')}</>
  return (
    <div className="wpl-title">
      <Link href={edit} className="wpl-t">{String(cellData || '(no title)')}{rowData?._status === 'draft' && <em> — Draft</em>}</Link>
      <div className="wpl-actions">
        {inTrash
          ? <><button type="button" onClick={restore}>Restore</button> | <button type="button" className="del" onClick={purge}>Delete Permanently</button></>
          : <><span>ID: {id}</span> | <Link href={edit}>Edit</Link> | <button type="button" onClick={() => setQe(true)}>Quick Edit</button> | <button type="button" className="del" onClick={trash}>Trash</button> | <a href={view} target="_blank" rel="noreferrer">View</a></>}
      </div>
      {qe && createPortal(
        <div className="wpe-modal" onClick={() => setQe(false)}>
          <div className="wpe-modal-box" style={{ width: 'min(560px,92vw)' }} onClick={(e) => e.stopPropagation()}>
            <div className="wpe-modal-h"><h3>Quick Edit</h3><button type="button" className="wpx-link" onClick={() => setQe(false)}>✕ Cancel</button></div>
            <div className="wpe-modal-body wpe-url" style={{ maxWidth: 'none' }}>
              <label>Title<input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></label>
              <label>Slug<input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} /></label>
              <label>Date<input type="datetime-local" value={f.publishedAt} onChange={(e) => setF({ ...f, publishedAt: e.target.value })} /></label>
              {collectionSlug === 'pages' && <label>Template<select value={f.template} onChange={(e) => setF({ ...f, template: e.target.value })}>{TEMPLATES.map((t) => <option key={t} value={t}>{TEMPLATE_LABELS[t] ?? t}</option>)}</select></label>}
              {hasTerms && <label>Categories<select multiple size={6} value={f.categories} onChange={multi('categories')}>{terms.cats.map((c) => <option key={c.id} value={String(c.id)}>{c.title ?? c.name}</option>)}</select></label>}
              {hasTerms && <label>Tags<select multiple size={6} value={f.tags} onChange={multi('tags')}>{terms.tags.map((c) => <option key={c.id} value={String(c.id)}>{c.title ?? c.name}</option>)}</select></label>}
              {collectionSlug === 'pages' && <label>Order<input type="number" value={f.menuOrder} onChange={(e) => setF({ ...f, menuOrder: e.target.value as any })} /></label>}
              <label>Status<select value={f._status} onChange={(e) => setF({ ...f, _status: e.target.value })}><option value="published">Published</option><option value="draft">Draft</option></select></label>
              {err && <p className="wpw-err">{err}</p>}
            </div>
            <div className="wpe-modal-f"><button type="button" className="wp-btn" onClick={() => setQe(false)}>Cancel</button><button type="button" className="wp-btn primary" disabled={busy} onClick={save}>{busy ? 'Updating…' : 'Update'}</button></div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
