'use client'

import { useField } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type Cat = { id: number; name: string; parent?: number | { id: number } | null }
const pid = (c: Cat) => (c.parent && typeof c.parent === 'object' ? c.parent.id : (c.parent as number | null | undefined))

/** WordPress "Categories" metabox: checkbox tree, primary (★), Add New Category. */
export function CategoryBox() {
  const cats = useField<number[]>({ path: 'categories' })
  const primary = useField<number | null>({ path: 'primaryCategory' })
  const [list, setList] = useState<Cat[]>([])
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [parent, setParent] = useState('')
  const value = (cats.value ?? []).map((v: any) => (typeof v === 'object' ? v.id : v))

  const load = () => fetch('/api/categories?limit=500&depth=0&sort=name', { credentials: 'include' }).then((r) => r.json()).then((j) => setList(j.docs ?? []))
  useEffect(() => { load() }, [])

  const toggle = (id: number) => {
    const next = value.includes(id) ? value.filter((x: number) => x !== id) : [...value, id]
    cats.setValue(next)
    if (!next.includes(primary.value as number)) primary.setValue(next[0] ?? null)
    else if (next.length === 1) primary.setValue(next[0])
  }
  async function create() {
    if (!name.trim()) return
    const r = await fetch('/api/categories', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: name.trim(), ...(parent ? { parent: Number(parent) } : {}) }) })
    const j = await r.json()
    if (r.ok) { await load(); cats.setValue([...value, j.doc.id]); setName(''); setAdding(false) }
    else alert(j?.errors?.[0]?.message || 'Could not add category')
  }
  const kids = (p: number | null) => list.filter((c) => (pid(c) ?? null) === p)
  const row = (c: Cat, depth: number): any => (
    <li key={c.id} style={{ paddingLeft: depth * 16 }}>
      <label><input type="checkbox" checked={value.includes(c.id)} onChange={() => toggle(c.id)} /> {c.name}</label>
      {value.includes(c.id) && <button type="button" title="Primary category (Rank Math)" className={`wpx-star${primary.value === c.id ? ' on' : ''}`} onClick={() => primary.setValue(c.id)}>★</button>}
      {kids(c.id).length > 0 && <ul>{kids(c.id).map((k) => row(k, depth + 1))}</ul>}
    </li>
  )
  return (
    <div className="wpx-box">
      <h3>Categories</h3>
      <div className="wpx-body">
        <div className="wpx-tabs"><span className="on">All Categories</span></div>
        <ul className="wpx-cats">{kids(null).map((c) => row(c, 0))}{list.length === 0 && <li className="wpx-mute">No categories found.</li>}</ul>
        {adding ? (
          <div className="wpx-add">
            <input placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
            <select value={parent} onChange={(e) => setParent(e.target.value)}><option value="">— Parent Category —</option>{list.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <button type="button" className="wp-btn" onClick={create}>Add New Category</button>
          </div>
        ) : <button type="button" className="wpx-link" onClick={() => setAdding(true)}>+ Add New Category</button>}
        <p className="wpx-mute" style={{ margin: '8px 0 0' }}>★ marks the primary category (used for breadcrumbs).</p>
      </div>
    </div>
  )
}
