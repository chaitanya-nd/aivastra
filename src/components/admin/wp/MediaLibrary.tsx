'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Doc = { id: number | string; filename?: string; alt?: string; mimeType?: string; url?: string; thumbnailURL?: string; updatedAt?: string; folder?: number | null }
type Folder = { id: number; name: string }
const PER = 48

/** Media → Library: WordPress-style thumbnail grid fed live from the media collection. */
export function MediaLibrary() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [type, setType] = useState('')
  const [q, setQ] = useState('')
  const [term, setTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [folders, setFolders] = useState<Folder[]>([])
  const [folder, setFolder] = useState('')
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [moveTo, setMoveTo] = useState('')
  const [tick, setTick] = useState(0)

  const loadFolders = () => fetch('/api/media-folders?limit=500&depth=0&sort=name', { credentials: 'include' }).then((r) => r.json()).then((j) => setFolders(j.docs ?? [])).catch(() => {})
  useEffect(() => { loadFolders() }, [])
  async function newFolder() {
    const name = prompt('Folder name')?.trim()
    if (!name) return
    await fetch('/api/media-folders', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name }) })
    loadFolders()
  }
  async function move() {
    if (!picked.size) return
    for (const id of picked) await fetch(`/api/media/${id}`, { method: 'PATCH', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ folder: moveTo ? Number(moveTo) : null }) })
    setPicked(new Set()); setTick((t) => t + 1)
  }
  const toggle = (id: string) => setPicked((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n })

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); setTerm(q) }, 300)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    const p = new URLSearchParams({ limit: String(PER), page: String(page), depth: '0', sort: '-updatedAt' })
    if (type) p.set('where[mimeType][like]', type)
    if (folder === 'none') p.set('where[folder][exists]', 'false')
    else if (folder) p.set('where[folder][equals]', folder)
    if (term) p.set('where[or][0][filename][like]', term), p.set('where[or][1][alt][like]', term)
    setLoading(true)
    fetch(`/api/media?${p}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => { setDocs(j.docs ?? []); setTotal(j.totalDocs ?? 0); setPages(j.totalPages ?? 1) })
      .catch(() => setDocs([]))
      .finally(() => setLoading(false))
  }, [page, type, term, folder, tick])

  return (
    <div className="wmed">
      <style>{`.collection-list--media .table-wrap,.collection-list--media .table,.collection-list--media .paginator,.collection-list--media .collection-list__page-controls,.collection-list--media .list-controls{display:none!important}
.wmed-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:6px 0 18px}
.wmed-bar select,.wmed-bar input{background:var(--theme-input-bg);color:var(--av-text);border:1px solid var(--av-line);border-radius:9px;padding:8px 12px;font:inherit}
.wmed-count{margin-left:auto;color:var(--av-mute)}
.wmed-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.wmed-tile{position:relative;display:block;aspect-ratio:1;border:1px solid var(--av-line);border-radius:var(--av-r);overflow:hidden;background:var(--av-raise);text-decoration:none;color:var(--av-text);transition:.15s}
.wmed-tile:hover{border-color:var(--av-a);box-shadow:0 0 0 2px var(--av-a-soft)}
.wmed-tile img{width:100%;height:100%;object-fit:cover;display:block}
.wmed-file{display:grid;place-items:center;height:100%;padding:10px;text-align:center;color:var(--av-mute);word-break:break-all}
.wmed-name{position:absolute;inset:auto 0 0;padding:18px 8px 6px;font-size:11px;background:linear-gradient(transparent,rgba(0,0,0,.75));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0;transition:.15s}
.wmed-tile:hover .wmed-name{opacity:1}
.wmed-pick{position:absolute;top:8px;left:8px;width:18px;height:18px;opacity:0;transition:.15s}.wmed-cell{position:relative}.wmed-cell:hover .wmed-pick,.wmed-pick:checked{opacity:1}
.wmed-move{padding:10px 14px;border:1px solid var(--av-line);border-radius:12px;background:var(--av-surface);margin:-6px 0 16px}
.wmed-pg{display:flex;gap:10px;align-items:center;justify-content:center;margin:22px 0}
.wmed-pg button{background:var(--av-raise);color:var(--av-text);border:1px solid var(--av-line);border-radius:9px;padding:7px 14px;cursor:pointer}
.wmed-pg button:disabled{opacity:.4;cursor:default}`}</style>
      <div className="wmed-bar">
        <Link className="wp-btn primary" href="/admin/collections/media/create">Add New</Link>
        <select value={type} onChange={(e) => { setPage(1); setType(e.target.value) }} aria-label="Filter by type">
          <option value="">All media items</option>
          <option value="image/">Images</option>
          <option value="application/">Documents</option>
          <option value="video/">Video</option>
        </select>
        <select value={folder} onChange={(e) => { setPage(1); setFolder(e.target.value) }} aria-label="Folder">
          <option value="">All folders</option>
          <option value="none">Unfiled</option>
          {folders.map((f) => <option key={f.id} value={String(f.id)}>{f.name}</option>)}
        </select>
        <button type="button" className="wp-btn" onClick={newFolder}>New folder</button>
        <input type="search" placeholder="Search media" value={q} onChange={(e) => setQ(e.target.value)} />
        <Link className="wp-btn" href="/admin/media-usage">Unused media</Link>
        <span className="wmed-count">{loading ? 'Loading…' : `${total} item${total === 1 ? '' : 's'}`}</span>
      </div>
      {picked.size > 0 && (
        <div className="wmed-bar wmed-move">
          <span>{picked.size} selected</span>
          <select value={moveTo} onChange={(e) => setMoveTo(e.target.value)} aria-label="Move to folder">
            <option value="">No folder</option>
            {folders.map((f) => <option key={f.id} value={String(f.id)}>{f.name}</option>)}
          </select>
          <button type="button" className="wp-btn primary" onClick={move}>Move</button>
          <button type="button" className="wp-btn" onClick={() => setPicked(new Set())}>Clear</button>
        </div>
      )}
      <div className="wmed-grid">
        {docs.map((d) => (
          <div key={d.id} className="wmed-cell"><Link className="wmed-tile" href={`/admin/collections/media/${d.id}`} title={d.alt || d.filename}>
            {d.mimeType?.startsWith('image/') && (d.thumbnailURL || d.url)
              ? // eslint-disable-next-line @next/next/no-img-element
                <img src={d.thumbnailURL || d.url} alt={d.alt || ''} loading="lazy" />
              : <span className="wmed-file">{d.filename}</span>}
            <span className="wmed-name">{d.filename}</span>
          </Link>
            <input type="checkbox" className="wmed-pick" aria-label={`Select ${d.filename}`} checked={picked.has(String(d.id))} onChange={() => toggle(String(d.id))} />
          </div>
        ))}
      </div>
      {!loading && docs.length === 0 && <p style={{ color: 'var(--av-mute)' }}>No media found.</p>}
      {pages > 1 && (
        <div className="wmed-pg">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>‹ Prev</button>
          <span>Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next ›</button>
        </div>
      )}
    </div>
  )
}
