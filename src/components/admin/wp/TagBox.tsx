'use client'

import { useField } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type Tag = { id: number; name: string }

/** WordPress "Tags" metabox: type, comma to add, click ✕ to remove. */
export function TagBox() {
  const f = useField<number[]>({ path: 'tags' })
  const [all, setAll] = useState<Tag[]>([])
  const [text, setText] = useState('')
  const ids = (f.value ?? []).map((v: any) => (typeof v === 'object' ? v.id : v))
  useEffect(() => { fetch('/api/tags?limit=1000&depth=0&sort=name', { credentials: 'include' }).then((r) => r.json()).then((j) => setAll(j.docs ?? [])) }, [])
  const byId = new Map(all.map((t) => [t.id, t]))

  async function add() {
    const names = text.split(',').map((s) => s.trim()).filter(Boolean)
    if (!names.length) return
    const next = [...ids]
    let list = all
    for (const n of names) {
      let t = list.find((x) => x.name.toLowerCase() === n.toLowerCase())
      if (!t) {
        const r = await fetch('/api/tags', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: n }) })
        const j = await r.json()
        if (!r.ok) continue
        t = j.doc as Tag
        list = [...list, t]
      }
      if (!next.includes(t.id)) next.push(t.id)
    }
    setAll(list); f.setValue(next); setText('')
  }
  return (
    <div className="wpx-box">
      <h3>Tags</h3>
      <div className="wpx-body">
        <div className="wpx-add row">
          <input list="wpx-tags" placeholder="Add tags" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } }} />
          <button type="button" className="wp-btn" onClick={add}>Add</button>
          <datalist id="wpx-tags">{all.map((t) => <option key={t.id} value={t.name} />)}</datalist>
        </div>
        <p className="wpx-mute">Separate tags with commas</p>
        <ul className="wpx-chips">{ids.map((id: number) => <li key={id}><button type="button" aria-label="Remove" onClick={() => f.setValue(ids.filter((x: number) => x !== id))}>✕</button> {byId.get(id)?.name ?? `#${id}`}</li>)}</ul>
      </div>
    </div>
  )
}
