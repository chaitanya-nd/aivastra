'use client'

import { useEffect, useState } from 'react'

const COLLS = [['posts', 'Posts'], ['pages', 'Pages'], ['guides', 'Guides'], ['cases', 'Case studies'], ['updates', 'Updates'], ['reviews', 'Reviews']] as const
type Row = { id: number; title: string; slug: string; seoScore: number | null; meta: { title?: string; description?: string; focusKeyword?: string; noindex?: boolean } }
type Edit = { title: string; description: string; focusKeyword: string; noindex: boolean }

export function SeoBulkClient() {
  const [coll, setColl] = useState('posts')
  const [filter, setFilter] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<Row[] | null>(null)
  const [pages, setPages] = useState(1)
  const [edits, setEdits] = useState<Record<number, Edit>>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setRows(null)
    const p = new URLSearchParams({ limit: '25', page: String(page), depth: '0', sort: 'seoScore', draft: 'true' })
    ;['title', 'slug', 'seoScore', 'meta'].forEach((f) => p.set(`select[${f}]`, 'true'))
    if (q) p.set('where[title][like]', q)
    if (filter === 'low') p.set('where[seoScore][less_than]', '50')
    if (filter === 'mid') { p.set('where[and][0][seoScore][greater_than_equal]', '50'); p.set('where[and][1][seoScore][less_than]', '80') }
    if (filter === 'nokw') p.set('where[seoScore][exists]', 'false')
    if (filter === 'nodesc') p.set('where[or][0][meta.description][exists]', 'false')
    fetch(`/api/${coll}?${p}`, { credentials: 'include' }).then((r) => r.json()).then((j) => { setRows(j.docs ?? []); setPages(j.totalPages || 1) })
  }, [coll, filter, q, page, tick])

  const val = (r: Row): Edit => edits[r.id] ?? { title: r.meta?.title || '', description: r.meta?.description || '', focusKeyword: r.meta?.focusKeyword || '', noindex: Boolean(r.meta?.noindex) }
  const set = (r: Row, k: keyof Edit, v: any) => setEdits((e) => ({ ...e, [r.id]: { ...val(r), [k]: v } }))
  async function saveAll() {
    setSaving(true); setMsg('')
    let ok = 0, bad = 0
    for (const [id, e] of Object.entries(edits)) {
      const r = await fetch(`/api/${coll}/${id}`, { method: 'PATCH', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ meta: e }) })
      if (r.ok) ok++; else bad++
    }
    setSaving(false); setEdits({}); setMsg(`${ok} saved${bad ? `, ${bad} failed` : ''}.`); setTick((t) => t + 1)
  }
  const dirty = Object.keys(edits).length
  return (
    <section className="wpw">
      <div className="sb-bar">
        <select value={coll} onChange={(e) => { setColl(e.target.value); setPage(1); setEdits({}) }}>{COLLS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1) }}>
          <option value="">All</option><option value="low">Score below 50</option><option value="mid">Score 50–79</option><option value="nokw">No focus keyword</option><option value="nodesc">No meta description</option>
        </select>
        <input type="search" placeholder="Search titles" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
        <span className="sb-msg">{msg}</span>
        <button type="button" className="wp-btn primary" disabled={!dirty || saving} onClick={saveAll}>{saving ? 'Saving…' : `Save ${dirty || ''} change${dirty === 1 ? '' : 's'}`}</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="sb-t">
          <thead><tr><th>Item</th><th>Score</th><th>Focus keyword</th><th>SEO title</th><th>Meta description</th><th>noindex</th></tr></thead>
          <tbody>
            {rows === null && <tr><td colSpan={6} style={{ color: 'var(--av-mute)' }}>Loading…</td></tr>}
            {rows?.length === 0 && <tr><td colSpan={6} style={{ color: 'var(--av-mute)' }}>Nothing matches.</td></tr>}
            {rows?.map((r) => { const v = val(r); return (
              <tr key={r.id} className={edits[r.id] ? 'dirty' : ''}>
                <td><a href={`/admin/collections/${coll}/${r.id}`}>{r.title || '(no title)'}</a><small>/{r.slug}/</small></td>
                <td>{typeof r.seoScore === 'number' ? <span className={`seo-badge ${r.seoScore >= 80 ? 'good' : r.seoScore >= 50 ? 'ok' : 'bad'}`}>{r.seoScore}</span> : <span className="seo-badge none">N/A</span>}</td>
                <td><input value={v.focusKeyword} onChange={(e) => set(r, 'focusKeyword', e.target.value)} /></td>
                <td><input value={v.title} placeholder={`${r.title} - AI Vastra`} onChange={(e) => set(r, 'title', e.target.value)} /><small className={v.title.length > 60 ? 'over' : ''}>{v.title.length}/60</small></td>
                <td><textarea rows={2} value={v.description} onChange={(e) => set(r, 'description', e.target.value)} /><small className={v.description.length > 160 ? 'over' : ''}>{v.description.length}/160</small></td>
                <td style={{ textAlign: 'center' }}><input type="checkbox" checked={v.noindex} onChange={(e) => set(r, 'noindex', e.target.checked)} /></td>
              </tr>
            ) })}
          </tbody>
        </table>
      </div>
      <div className="sb-foot">
        <button type="button" className="wp-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹ Previous</button>
        <span>Page {page} of {pages}</span>
        <button type="button" className="wp-btn" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next ›</button>
      </div>
    </section>
  )
}
