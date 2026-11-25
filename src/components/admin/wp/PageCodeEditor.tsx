'use client'

import { CodeEditor, useDocumentInfo, useFormModified } from '@payloadcms/ui'
import { useEffect, useMemo, useState } from 'react'
import { getPath } from '@/lib/urls'

/**
 * WordPress-style "Code editor" for a page: every piece of text / HTML this page shows on the
 * frontend, as one editable HTML document. Each value is wrapped in marker comments
 *   <!-- field: acf.some_section -->  …html…  <!-- /field: acf.some_section -->
 * Saving writes the edited values straight back to the page (keeps its Draft / Published status).
 * A second tab shows the live rendered HTML of the page (read-only) for reference.
 */

type Leaf = { path: string; value: string }

const isMeta = (k: string) => k === 'id' || k === 'blockType' || k === 'blockName'

/** Collect every non-empty string inside the page's content (acf group + body). */
function leaves(doc: any): Leaf[] {
  const out: Leaf[] = []
  const walk = (v: any, path: string) => {
    if (typeof v === 'string') {
      if (v.trim()) out.push({ path, value: v })
    } else if (Array.isArray(v)) {
      v.forEach((x, i) => walk(x, `${path}.${i}`))
    } else if (v && typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) if (!isMeta(k)) walk(x, `${path}.${k}`)
    }
  }
  walk(doc?.acf, 'acf')
  if (typeof doc?.contentHtml === 'string' && doc.contentHtml.trim()) out.push({ path: 'contentHtml', value: doc.contentHtml })
  return out
}

const toCode = (ls: Leaf[]) => ls.map((l) => `<!-- field: ${l.path} -->\n${l.value}\n<!-- /field: ${l.path} -->`).join('\n\n')

function parse(code: string): Map<string, string> {
  const m = new Map<string, string>()
  const re = /<!-- field: (\S+) -->\n?([\s\S]*?)\n?<!-- \/field: \1 -->/g
  let x: RegExpExecArray | null
  while ((x = re.exec(code))) m.set(x[1]!, x[2]!)
  return m
}

/** Set `value` at a dotted path ("acf.list.0.title") inside a plain object. */
function setAt(obj: any, path: string, value: string) {
  const ks = path.split('.')
  let o = obj
  for (let i = 0; i < ks.length - 1; i++) {
    if (o == null) return false
    o = o[ks[i]!]
  }
  if (o == null || typeof o !== 'object') return false
  o[ks[ks.length - 1]!] = value
  return true
}

export function PageCodeEditor() {
  const { id, collectionSlug } = useDocumentInfo()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'edit' | 'live'>('edit')
  const [doc, setDoc] = useState<any>(null)
  const [code, setCode] = useState('')
  const [orig, setOrig] = useState('')
  const [live, setLive] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const modified = useFormModified() // unsaved edits in the regular Content fields

  const load = async () => {
    setDoc(null); setMsg(null)
    const r = await fetch(`/api/${collectionSlug}/${id}?depth=0&draft=true`, { credentials: 'include' })
    const d = await r.json()
    const c = toCode(leaves(d))
    setDoc(d); setCode(c); setOrig(c)
  }

  useEffect(() => { if (open && id && !doc) load() }, [open, id]) // eslint-disable-line react-hooks/exhaustive-deps

  const path = useMemo(() => (doc ? getPath(collectionSlug || 'pages', doc) : ''), [doc, collectionSlug])

  useEffect(() => {
    if (!open || tab !== 'live' || !path || live !== null) return
    fetch(path === '/' ? '/' : `${path.replace(/\/$/, '')}/`, { credentials: 'include' })
      .then((r) => r.text())
      .then((h) => {
        const body = h.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? h
        // drop scripts / Next internals so only the page markup remains
        setLive(body.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<template[\s\S]*?<\/template>/gi, '').replace(/>\s*</g, '>\n<').trim())
      })
      .catch(() => setLive('Could not load the live page.'))
  }, [open, tab, path, live])

  async function save() {
    if (!doc || busy) return
    const edited = parse(code)
    const before = new Map(leaves(doc).map((l) => [l.path, l.value]))
    const next = JSON.parse(JSON.stringify(doc))
    let changed = 0
    const unknown: string[] = []
    for (const [p, v] of edited) {
      if (!before.has(p)) { unknown.push(p); continue }
      // the code editor normalises Windows line endings; that alone is not an edit
      if (before.get(p)!.replace(/\r\n/g, '\n') === v) continue
      if (setAt(next, p, v)) changed++
      else unknown.push(p)
    }
    const missing = [...before.keys()].filter((p) => !edited.has(p))
    if (missing.length) {
      setMsg({ ok: false, text: `Not saved — a field marker was removed or changed: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '…' : ''}. Keep every <!-- field: … --> and <!-- /field: … --> line.` })
      return
    }
    if (unknown.length) {
      setMsg({ ok: false, text: `Not saved — unknown field marker: ${unknown.slice(0, 3).join(', ')}. Add new fields in the Content tab instead.` })
      return
    }
    if (!changed) { setMsg({ ok: true, text: 'No changes to save.' }); return }
    if (modified && !confirm('You also have unsaved changes in the form above. Saving the code will reload the page and discard those. Continue?')) return
    setBusy(true); setMsg(null)
    const body: any = { acf: next.acf, _status: doc._status || 'draft' }
    if (edited.has('contentHtml')) body.contentHtml = next.contentHtml
    const draft = (doc._status || 'draft') === 'draft' ? '&draft=true' : ''
    const r = await fetch(`/api/${collectionSlug}/${id}?depth=0${draft}`, { method: 'PATCH', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
    setBusy(false)
    if (!r.ok) {
      const e = await r.json().catch(() => ({}))
      setMsg({ ok: false, text: `Save failed: ${e?.errors?.[0]?.message || r.statusText}` })
      return
    }
    setMsg({ ok: true, text: `Saved ${changed} change${changed === 1 ? '' : 's'}. Reloading…` })
    // reload so the Content tab editors show the new values
    setTimeout(() => window.location.reload(), 700)
  }

  if (!id) return null
  const dirty = code !== orig
  return (
    <div className="wpx-box wpcode pcode">
      <button type="button" className="wpcode-h" onClick={() => setOpen(!open)}>
        <span><b>Code editor</b> <em>Edit this page’s text and HTML as code, then save</em></span><span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="wpcode-b">
          <div className="wpcode-tabs">
            <button type="button" className={tab === 'edit' ? 'on' : ''} onClick={() => setTab('edit')}>Page content (editable)</button>
            <button type="button" className={tab === 'live' ? 'on' : ''} onClick={() => setTab('live')}>Live page HTML (read-only)</button>
          </div>
          {tab === 'edit' && (
            !doc ? <p className="wpx-mute">Loading…</p> : (
              <>
                <p className="wpx-mute">Every text and HTML block of this page. Change text or markup between the <code>&lt;!-- field: … --&gt;</code> lines — keep those marker lines as they are. Saving keeps the page’s current status ({doc._status === 'published' ? 'Published — changes go live' : 'Draft'}).</p>
                <div className="pcode-editor">
                  <CodeEditor language="html" value={code} onChange={(v) => setCode(v ?? '')} minHeight={420} maxHeight={760} options={{ wordWrap: 'on', minimap: { enabled: false }, fontSize: 13 }} />
                </div>
                <div className="pcode-bar">
                  <button type="button" className="wp-btn pcode-save" disabled={!dirty || busy} onClick={save}>{busy ? 'Saving…' : 'Save code'}</button>
                  <button type="button" className="wp-btn" disabled={!dirty || busy} onClick={() => { setCode(orig); setMsg(null) }}>Discard changes</button>
                  {path && <a className="wp-btn" href={path === '/' ? '/' : `${path.replace(/\/$/, '')}/`} target="_blank" rel="noopener">View page</a>}
                  {msg && <span className={msg.ok ? 'pcode-ok' : 'pcode-err'}>{msg.text}</span>}
                </div>
              </>
            )
          )}
          {tab === 'live' && (
            live === null ? <p className="wpx-mute">Loading…</p> : (
              <>
                <p className="wpx-mute">The HTML your visitors get for <code>{path}</code> (published version). For reference — edit in the “Page content” tab.</p>
                <div className="pcode-editor"><CodeEditor language="html" value={live} readOnly minHeight={420} maxHeight={760} options={{ wordWrap: 'on', minimap: { enabled: false }, fontSize: 13, readOnly: true }} /></div>
              </>
            )
          )}
        </div>
      )}
    </div>
  )
}
