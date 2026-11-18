'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Link = { type: 'reference' | 'custom'; reference?: { relationTo: string; value: number | string } | null; url?: string | null; label?: string; newTab?: boolean | null }
type Item = { id?: string; link: Link; children?: Item[]; _k: string; _open?: boolean; _orig?: string }
type Col = { id?: string; title: string; links: Item[] }
type Choice = { relationTo: string; id: number | string; title: string; path: string }

const uid = () => Math.random().toString(36).slice(2, 10)
const SOURCES: { key: string; label: string; rel: string; titleField: string }[] = [
  { key: 'pages', label: 'Pages', rel: 'pages', titleField: 'title' },
  { key: 'posts', label: 'Posts', rel: 'posts', titleField: 'title' },
  { key: 'guides', label: 'Guides', rel: 'guides', titleField: 'title' },
  { key: 'cases', label: 'Case studies', rel: 'cases', titleField: 'title' },
  { key: 'updates', label: 'Product updates', rel: 'updates', titleField: 'title' },
  { key: 'categories', label: 'Categories', rel: 'categories', titleField: 'name' },
]

const hydrate = (raw: any, withKids: boolean): Item => ({
  id: raw.id,
  link: { type: raw.link?.type ?? 'custom', reference: raw.link?.reference ?? null, url: raw.link?.url ?? '', label: raw.link?.label ?? '', newTab: raw.link?.newTab ?? false },
  children: withKids ? (raw.children ?? []).map((c: any) => hydrate(c, false)) : [],
  _k: uid(),
})
const dehydrate = (it: Item, withKids: boolean): any => ({
  ...(it.id ? { id: it.id } : {}),
  link: { type: it.link.type, newTab: !!it.link.newTab, label: it.link.label, ...(it.link.type === 'reference' ? { reference: it.link.reference, url: null } : { url: it.link.url, reference: null }) },
  ...(withKids ? { children: (it.children ?? []).map((c) => dehydrate(c, false)) } : {}),
})

/** WordPress "Appearance → Menus" screen. */
export function MenuBuilder() {
  const [header, setHeader] = useState<Item[]>([])
  const [cols, setCols] = useState<Col[]>([])
  const [rest, setRest] = useState<any>({})
  const [menu, setMenu] = useState<string>('header')
  const [msg, setMsg] = useState<{ t: 'ok' | 'err'; s: string } | null>(null)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [lists, setLists] = useState<Record<string, Choice[]>>({})
  const [open, setOpen] = useState('pages')
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<Record<string, boolean>>({})
  const [custom, setCustom] = useState({ url: 'https://', label: '' })
  const drag = useRef<{ path: number[] } | null>(null)

  useEffect(() => {
    ;(async () => {
      const g = await (await fetch('/api/globals/navigation?depth=0', { credentials: 'include' })).json()
      setHeader((g.header ?? []).map((h: any) => hydrate(h, true)))
      setCols((g.footerColumns ?? []).map((c: any) => ({ id: c.id, title: c.title, links: (c.links ?? []).map((l: any) => hydrate(l, false)) })))
      setRest({ headerButton: g.headerButton, legalLinks: g.legalLinks, copyright: g.copyright })
      const out: Record<string, Choice[]> = {}
      await Promise.all(SOURCES.map(async (s) => {
        const r = await fetch(`/api/${s.rel}?limit=300&depth=0&sort=${s.rel === 'posts' ? '-publishedAt' : s.titleField}&select[${s.titleField}]=true&select[slug]=true`, { credentials: 'include' })
        const j = await r.json()
        out[s.key] = (j.docs ?? []).map((d: any) => ({ relationTo: s.rel, id: d.id, title: d[s.titleField], path: `/${d.slug}/` }))
      }))
      setLists(out)
    })()
  }, [])

  const isHeader = menu === 'header'
  const colIdx = isHeader ? -1 : Number(menu.split(':')[1])
  const items: Item[] = isHeader ? header : cols[colIdx]?.links ?? []
  const setItems = (next: Item[]) => {
    setDirty(true)
    if (isHeader) setHeader(next)
    else setCols((c) => c.map((x, i) => (i === colIdx ? { ...x, links: next } : x)))
  }
  const update = (path: number[], fn: (it: Item) => Item | null) => {
    const next = structuredClone(items)
    if (path.length === 1) {
      const r = fn(next[path[0]])
      if (r) next[path[0]] = r
      else next.splice(path[0], 1)
    } else {
      const kids = next[path[0]].children!
      const r = fn(kids[path[1]])
      if (r) kids[path[1]] = r
      else kids.splice(path[1], 1)
    }
    setItems(next)
  }
  const move = (path: number[], dir: -1 | 1) => {
    const next = structuredClone(items)
    const arr = path.length === 1 ? next : next[path[0]].children!
    const i = path[path.length - 1]
    const j = i + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    setItems(next)
  }
  const indent = (i: number) => {
    if (!isHeader || i === 0) return
    const next = structuredClone(items)
    const [it] = next.splice(i, 1)
    it.children = []
    next[i - 1].children = [...(next[i - 1].children ?? []), it]
    setItems(next)
  }
  const outdent = (p: number, c: number) => {
    const next = structuredClone(items)
    const [it] = next[p].children!.splice(c, 1)
    next.splice(p + 1, 0, { ...it, children: [] })
    setItems(next)
  }
  const dropOn = (target: number[]) => {
    const src = drag.current?.path
    drag.current = null
    if (!src || src.join() === target.join()) return
    const next = structuredClone(items)
    const arr = (p: number[]) => (p.length === 1 ? next : next[p[0]].children!)
    const [it] = arr(src).splice(src[src.length - 1], 1)
    if (src.length === 1 && target.length === 2 && src[0] < target[0]) target = [target[0] - 1, target[1]]
    if (src.length === 1 && it.children?.length && target.length === 2) { next.splice(src[0], 0, it); return }
    if (target.length === 2 && !it.children) it.children = []
    arr(target).splice(target[target.length - 1], 0, it)
    setItems(next)
  }

  const add = (list: Item[]) => setItems([...items, ...list])
  const addPicked = (key: string) => {
    const chosen = (lists[key] ?? []).filter((c) => picked[`${c.relationTo}:${c.id}`])
    if (!chosen.length) return
    add(chosen.map((c) => ({ _k: uid(), link: { type: 'reference', reference: { relationTo: c.relationTo, value: c.id }, label: c.title, newTab: false }, children: [], _orig: c.title })))
    setPicked({})
  }
  const addCustom = () => {
    if (!custom.label.trim() || !custom.url.trim()) return setMsg({ t: 'err', s: 'Enter both a URL and the link text.' })
    add([{ _k: uid(), link: { type: 'custom', url: custom.url.trim(), label: custom.label.trim(), newTab: false }, children: [] }])
    setCustom({ url: 'https://', label: '' })
  }

  const save = async () => {
    setBusy(true)
    setMsg(null)
    try {
      const body = { ...rest, header: header.map((h) => dehydrate(h, true)), footerColumns: cols.map((c) => ({ ...(c.id ? { id: c.id } : {}), title: c.title, links: c.links.map((l) => dehydrate(l, false)) })) }
      const r = await fetch('/api/globals/navigation', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.errors?.[0]?.message || 'Save failed')
      setDirty(false)
      setMsg({ t: 'ok', s: 'Menu has been updated.' })
    } catch (e: any) {
      setMsg({ t: 'err', s: e.message })
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const menuName = isHeader ? 'Header (Main menu)' : `Footer — ${cols[colIdx]?.title ?? ''}`
  const filtered = (key: string) => (lists[key] ?? []).filter((c) => c.title?.toLowerCase().includes(q.toLowerCase()))
  const typeLabel = (it: Item) => (it.link.type === 'custom' ? 'Custom Link' : (SOURCES.find((s) => s.rel === it.link.reference?.relationTo)?.label.replace(/s$/, '') ?? 'Page'))
  const nodes = useMemo(() => items, [items])

  const card = (it: Item, path: number[], level: number) => (
    <li key={it._k} className="wpm-li">
      <div className={`wpm-item${it._open ? ' is-open' : ''}`} draggable onDragStart={(e) => { drag.current = { path }; e.dataTransfer.effectAllowed = 'move' }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.stopPropagation(); dropOn(path) }}>
        <div className="wpm-item-bar" onClick={() => update(path, (x) => ({ ...x, _open: !x._open }))}>
          <span className="wpm-grip" aria-hidden="true">⋮⋮</span>
          <span className="wpm-item-title">{it.link.label || '(no label)'}{level > 0 && <em> sub item</em>}</span>
          <span className="wpm-item-type">{typeLabel(it)}</span>
          <span className="wpm-caret">{it._open ? '▴' : '▾'}</span>
        </div>
        {it._open && (
          <div className="wpm-item-body">
            <label>Navigation Label<input value={it.link.label ?? ''} onChange={(e) => update(path, (x) => ({ ...x, link: { ...x.link, label: e.target.value } }))} /></label>
            {it.link.type === 'custom' && <label>URL<input value={it.link.url ?? ''} onChange={(e) => update(path, (x) => ({ ...x, link: { ...x.link, url: e.target.value } }))} /></label>}
            <label className="wpm-check"><input type="checkbox" checked={!!it.link.newTab} onChange={(e) => update(path, (x) => ({ ...x, link: { ...x.link, newTab: e.target.checked } }))} /> Open link in a new tab</label>
            {it._orig && <p className="wpm-orig">Original: {it._orig}</p>}
            <div className="wpm-move">
              <span>Move</span>
              <button type="button" onClick={() => move(path, -1)}>Up one</button>
              <button type="button" onClick={() => move(path, 1)}>Down one</button>
              {isHeader && level === 0 && path[0] > 0 && <button type="button" onClick={() => indent(path[0])}>Under {items[path[0] - 1]?.link.label}</button>}
              {level === 1 && <button type="button" onClick={() => outdent(path[0], path[1])}>Out from under {items[path[0]].link.label}</button>}
            </div>
            <button type="button" className="wpm-remove" onClick={() => update(path, () => null)}>Remove</button>
          </div>
        )}
      </div>
      {level === 0 && isHeader && (it.children?.length ?? 0) > 0 && (
        <ul className="wpm-sub" onDragOver={(e) => e.preventDefault()}>{it.children!.map((c, j) => card(c, [path[0], j], 1))}</ul>
      )}
    </li>
  )

  return (
    <div className="wpm">
      <h1 className="wpd-title">Menus</h1>
      {msg && <div className={`wpm-note ${msg.t}`}>{msg.s}</div>}
      <div className="wpm-select">
        <label>Select a menu to edit:</label>
        <select value={menu} onChange={(e) => { if (!dirty || confirm('You have unsaved menu changes. Switch anyway? (Unsaved edits stay in this page until you leave.)')) setMenu(e.target.value) }}>
          <option value="header">Header (Main menu)</option>
          {cols.map((c, i) => <option key={c.id ?? i} value={`footer:${i}`}>Footer — {c.title}</option>)}
        </select>
        <button type="button" className="wp-btn" onClick={() => { const t = prompt('New footer menu name'); if (t) { setCols([...cols, { title: t, links: [] }]); setMenu(`footer:${cols.length}`); setDirty(true) } }}>create a new menu</button>
      </div>
      <div className="wpm-grid">
        <div className="wpm-left">
          {SOURCES.map((s) => (
            <section className="wpm-box" key={s.key}>
              <h3 onClick={() => setOpen(open === s.key ? '' : s.key)}>{s.label}<span>{open === s.key ? '▴' : '▾'}</span></h3>
              {open === s.key && (
                <div className="wpm-box-in">
                  <input className="wpm-search" placeholder={`Search ${s.label}`} value={q} onChange={(e) => setQ(e.target.value)} />
                  <div className="wpm-checks">
                    {filtered(s.key).map((c) => (
                      <label key={`${c.relationTo}:${c.id}`}><input type="checkbox" checked={!!picked[`${c.relationTo}:${c.id}`]} onChange={(e) => setPicked({ ...picked, [`${c.relationTo}:${c.id}`]: e.target.checked })} /> {c.title}</label>
                    ))}
                    {filtered(s.key).length === 0 && <p className="wpm-orig">Nothing found.</p>}
                  </div>
                  <button type="button" className="wp-btn" onClick={() => addPicked(s.key)}>Add to Menu</button>
                </div>
              )}
            </section>
          ))}
          <section className="wpm-box">
            <h3 onClick={() => setOpen(open === 'custom' ? '' : 'custom')}>Custom Links<span>{open === 'custom' ? '▴' : '▾'}</span></h3>
            {open === 'custom' && (
              <div className="wpm-box-in">
                <label>URL<input value={custom.url} onChange={(e) => setCustom({ ...custom, url: e.target.value })} /></label>
                <label>Link Text<input value={custom.label} onChange={(e) => setCustom({ ...custom, label: e.target.value })} /></label>
                <button type="button" className="wp-btn" onClick={addCustom}>Add to Menu</button>
              </div>
            )}
          </section>
        </div>
        <div className="wpm-right">
          <div className="wpm-box">
            <div className="wpm-head">
              <label>Menu Name <input value={isHeader ? 'Header (Main menu)' : cols[colIdx]?.title ?? ''} disabled={isHeader} onChange={(e) => { setCols((c) => c.map((x, i) => (i === colIdx ? { ...x, title: e.target.value } : x))); setDirty(true) }} /></label>
              <button type="button" className="wp-btn primary" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save Menu'}</button>
            </div>
            <div className="wpm-body">
              <h3 className="wpm-h">Menu Structure</h3>
              <p className="wpm-help">{items.length ? 'Drag each item into the order you prefer (or use the Move buttons). Click the arrow on the right of the item to reveal additional configuration options.' : 'Add menu items from the column on the left.'}</p>
              <ul className="wpm-list" onDragOver={(e) => e.preventDefault()}>{nodes.map((it, i) => card(it, [i], 0))}</ul>
              <h3 className="wpm-h">Menu Settings</h3>
              <p className="wpm-help"><b>Display location:</b> {isHeader ? 'Primary menu (site header and mobile menu)' : `Footer column “${cols[colIdx]?.title}”`}</p>
            </div>
            <div className="wpm-foot">
              {!isHeader ? <button type="button" className="wpm-remove" onClick={() => { if (confirm('Delete this footer menu?')) { setCols(cols.filter((_, i) => i !== colIdx)); setMenu('header'); setDirty(true) } }}>Delete Menu</button> : <span />}
              <button type="button" className="wp-btn primary" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save Menu'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
