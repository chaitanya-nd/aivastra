'use client'

import { FieldDescription, FieldLabel, useField } from '@payloadcms/ui'
import type { CodeFieldClientComponent } from 'payload'
import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useRef, useState } from 'react'
import { Ic } from './Ic'

/**
 * WordPress "classic editor" for the HTML fields: a Visual tab (WYSIWYG, edit text directly)
 * and a Text tab (the raw HTML — "page code").
 */
export const WpEditor: CodeFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue } = useField<string>({ path })
  const [mode, setMode] = useState<'visual' | 'text'>('visual')
  const [media, setMedia] = useState(false)
  const [patterns, setPatterns] = useState(false)
  const [near, setNear] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const ed = useRef<any>(null)
  const touched = useRef(false)
  const base = useRef<string | null>(null) // TinyMCE's normalised copy of the loaded HTML — opening a doc must not count as an edit
  const tarea = useRef<HTMLTextAreaElement>(null)
  const html = typeof value === 'string' ? value : ''

  // TinyMCE is heavy: only start it once the box is near the viewport (pages have ~20 of them)
  useEffect(() => {
    const el = wrap.current
    if (!el || near) return
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setNear(true); io.disconnect() } }, { rootMargin: '400px' })
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  const insertHtml = (h: string) => {
    if (mode === 'text') {
      const t = tarea.current
      const at = t?.selectionStart ?? html.length
      setValue(html.slice(0, at) + h + html.slice(t?.selectionEnd ?? at))
    } else ed.current?.insertContent(h)
  }
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="wpe field-type" ref={wrap}>
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div className="wpe-box">
        <div className="wpe-top">
          <div className="wpe-media"><button type="button" className="wp-btn" disabled={readOnly} onClick={() => setMedia(true)}><Ic n="media" /> Add media</button> <button type="button" className="wp-btn" disabled={readOnly} onClick={() => setPatterns(true)}><Ic n="page" /> Insert pattern</button></div>
          <div className="wpe-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={mode === 'visual'} className={mode === 'visual' ? 'is-on' : ''} onClick={() => setMode('visual')}>Visual</button>
            <button type="button" role="tab" aria-selected={mode === 'text'} className={mode === 'text' ? 'is-on' : ''} onClick={() => setMode('text')}>Text</button>
          </div>
        </div>
        {mode === 'visual' ? (
          near ? (
            <Editor
              tinymceScriptSrc="/tinymce/tinymce.min.js"
              licenseKey="gpl"
              initialValue={html}
              disabled={readOnly}
              onInit={(_, editor) => { ed.current = editor; base.current = editor.getContent() }}
              onEditorChange={(v) => { if (!touched.current && (base.current === null || v === base.current)) return; touched.current = true; setValue(v) }}
              init={{
                height: 420,
                menubar: false,
                branding: false,
                promotion: false,
                statusbar: true,
                resize: true,
                skin: document.documentElement.dataset.theme === 'light' ? 'oxide' : 'oxide-dark',
                content_css: document.documentElement.dataset.theme === 'light' ? 'default' : 'dark',
                toolbar_mode: 'wrap',
                plugins: ['lists', 'link', 'image', 'media', 'table', 'pagebreak', 'charmap', 'fullscreen', 'wordcount', 'searchreplace', 'code', 'autoresize'],
                // WordPress classic-editor toolbar: row 1 + the "kitchen sink" row
                toolbar: 'blocks bold italic bullist numlist blockquote alignleft aligncenter alignright link unlink | strikethrough hr forecolor pastetext removeformat charmap table media wpmore pagebreak outdent indent undo redo fullscreen',
                block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre',
                // keep the theme markup exactly as written (carousels, wrappers, data-attributes…)
                verify_html: false,
                valid_children: '+body[style],+a[div|p|h1|h2|h3|h4|h5|h6|ul|ol|li|section]',
                extended_valid_elements: '*[*]',
                convert_urls: false,
                relative_urls: false,
                entity_encoding: 'raw',
                paste_data_images: false,
                paste_webkit_styles: 'none',
                paste_remove_styles_if_webkit: true,
                smart_paste: true,
                autoresize_bottom_margin: 12,
                min_height: 260,
                max_height: 700,
                content_style: (() => { const c = getComputedStyle(document.documentElement); const v = (n: string, d: string) => c.getPropertyValue(n).trim() || d; return `body{font:16px/1.65 -apple-system,Segoe UI,Roboto,sans-serif;padding:10px 14px;color:${v('--av-text', '#dfe2ec')};background:${v('--av-input', '#0e1016')}}img{max-width:100%;height:auto}a{color:${v('--av-link', '#a99fff')}}` })(),
                pagebreak_separator: '<!--nextpage-->',
                pagebreak_split_block: true,
                setup: (editor) => {
                  editor.on('PastePreProcess', (e) => { e.content = cleanPaste(e.content) })
                  // WordPress "Insert Read More tag": the excerpt on the blog ends here
                  editor.ui.registry.addButton('wpmore', { text: 'More', tooltip: 'Insert Read More tag', onAction: () => editor.insertContent('<!--more-->') })
                },
              }}
            />
          ) : <div className="wpe-ph">Loading editor…</div>
        ) : (
          <textarea ref={tarea} className="wpe-text" value={html} readOnly={readOnly} spellCheck={false} onChange={(e) => setValue(e.target.value)} />
        )}
        <div className="wpe-foot">Word count: {words}{mode === 'text' ? ' · HTML (theme classes are kept as-is)' : ''}</div>
      </div>
      {patterns && <PatternModal onClose={() => setPatterns(false)} onInsert={(h) => { insertHtml(h); setPatterns(false) }} />}
      {media && <MediaModal onClose={() => setMedia(false)} onInsert={(h) => { insertHtml(h); setMedia(false) }} />}
      <FieldDescription description={field.admin?.description as string | undefined} path={path} />
    </div>
  )
}

/** Word / Google Docs paste cleanup: drop styles, classes, mso/Docs wrappers, empty spans; keep structure + real bold/italic. */
function cleanPaste(raw: string): string {
  const doc = new DOMParser().parseFromString(raw, 'text/html')
  doc.querySelectorAll('style,script,meta,link,xml,o\\:p,title,head').forEach((n) => n.remove())
  doc.body.querySelectorAll('*').forEach((el) => {
    const st = (el.getAttribute('style') || '').toLowerCase()
    if (el.tagName === 'SPAN' || el.tagName === 'FONT') {
      const bold = /font-weight:\s*(bold|[6-9]00)/.test(st)
      const italic = /font-style:\s*italic/.test(st)
      if (bold || italic) {
        let inner = el.innerHTML
        if (italic) inner = `<em>${inner}</em>`
        if (bold) inner = `<strong>${inner}</strong>`
        el.replaceWith(Object.assign(document.createElement('span'), { innerHTML: inner }))
      }
    }
  })
  doc.body.querySelectorAll('b[id^="docs-internal-guid"]').forEach((b) => b.replaceWith(...Array.from(b.childNodes)))
  doc.body.querySelectorAll('*').forEach((el) => {
    for (const a of Array.from(el.attributes)) {
      if (['style', 'class', 'id', 'lang', 'dir', 'role', 'align', 'width', 'height', 'valign', 'border', 'cellpadding', 'cellspacing'].includes(a.name) || a.name.startsWith('data-') || a.name.startsWith('aria-')) {
        if (!(el.tagName === 'IMG' && ['width', 'height'].includes(a.name))) el.removeAttribute(a.name)
      }
    }
  })
  // unwrap spans/fonts, drop empty inline tags, collapse Word's "&nbsp;" runs
  for (let i = 0; i < 3; i++) doc.body.querySelectorAll('span,font,o\\:p').forEach((n) => n.replaceWith(...Array.from(n.childNodes)))
  doc.body.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6,strong,em,b,i,u').forEach((n) => { if (!n.textContent?.trim() && !n.querySelector('img,br')) n.remove() })
  return doc.body.innerHTML.replace(/(&nbsp;|\u00a0){2,}/g, ' ').replace(/<!--[\s\S]*?-->/g, '')
}

type M = { id: number; url?: string; filename?: string; alt?: string; mimeType?: string }

/** WordPress "Add Media" dialog: Media Library, Upload files, Insert from URL. */
function MediaModal({ onClose, onInsert }: { onClose: () => void; onInsert: (html: string) => void }) {
  const [tab, setTab] = useState<'lib' | 'up' | 'url'>('lib')
  const [items, setItems] = useState<M[]>([])
  const [sel, setSel] = useState<M | null>(null)
  const [galleryMode, setGalleryMode] = useState(false)
  const [picked, setPicked] = useState<M[]>([])
  const [cols, setCols] = useState(3)
  const [alt, setAlt] = useState('')
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const load = () => fetch('/api/media?limit=60&sort=-createdAt&depth=0', { credentials: 'include' }).then((r) => r.json()).then((j) => setItems(j.docs ?? []))
  useEffect(() => { load() }, [])

  async function upload(files: FileList | null) {
    if (!files?.length) return
    setBusy(true); setErr('')
    try {
      for (const f of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', f)
        fd.append('_payload', JSON.stringify({ alt: f.name.replace(/\.[^.]+$/, '') }))
        const r = await fetch('/api/media', { method: 'POST', credentials: 'include', body: fd })
        const j = await r.json()
        if (!r.ok) throw new Error(j?.errors?.[0]?.message || 'Upload failed')
        setSel(j.doc)
      }
      await load(); setTab('lib')
    } catch (e: any) { setErr(e.message) } finally { setBusy(false) }
  }
  const esc = (v: string) => v.replace(/"/g, '&quot;')
  return (
    <div className="wpe-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="wpe-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="wpe-modal-h"><h3>Add Media</h3><button type="button" className="wpx-link" onClick={onClose}>✕ Close</button></div>
        <div className="wpe-modal-tabs">
          {([['lib', 'Media Library'], ['up', 'Upload files'], ['url', 'Insert from URL']] as const).map(([k, l]) => <button key={k} type="button" className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
        </div>
        <div className="wpe-modal-body">
          {err && <p className="wpw-err">{err}</p>}
          {tab === 'lib' && (items.length ? <ul className="wpe-grid">{items.map((m) => <li key={m.id} className={(galleryMode ? picked.some((x) => x.id === m.id) : sel?.id === m.id) ? 'on' : ''} onClick={() => { if (galleryMode) setPicked((p) => (p.some((x) => x.id === m.id) ? p.filter((x) => x.id !== m.id) : [...p, m])); else { setSel(m); setAlt(m.alt ?? '') } }}>{m.mimeType?.startsWith('image') ? <img src={m.url} alt={m.alt ?? ''} /> : <span>{m.filename}</span>}</li>)}</ul> : <p className="wpx-mute">No media found. Use “Upload files” or “Insert from URL”.</p>)}
          {tab === 'up' && <div className="wpe-drop"><p>Drop files to upload</p><label className="wp-btn primary">{busy ? 'Uploading…' : 'Select Files'}<input type="file" multiple hidden onChange={(e) => upload(e.target.files)} /></label></div>}
          {tab === 'url' && <div className="wpe-url"><label>Image URL<input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" /></label><label>Alternative Text<input value={alt} onChange={(e) => setAlt(e.target.value)} /></label></div>}
        </div>
        <div className="wpe-modal-f">
          {tab === 'lib' && <label className="wpe-galtoggle"><input type="checkbox" checked={galleryMode} onChange={(e) => { setGalleryMode(e.target.checked); setPicked([]) }} /> Create gallery</label>}
          {galleryMode && tab === 'lib' ? (
            <>
              <label>Columns <select value={cols} onChange={(e) => setCols(Number(e.target.value))}>{[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
              <button type="button" className="wp-btn primary" disabled={picked.length < 2} onClick={() => onInsert(`<figure class="wp-block-gallery av-gallery columns-${cols}">${picked.map((m) => `<figure class="wp-block-image"><a href="${esc(m.url ?? '')}"><img src="${esc(m.url ?? '')}" alt="${esc(m.alt ?? '')}" /></a></figure>`).join('')}</figure><p></p>`)}>Insert gallery ({picked.length})</button>
            </>
          ) : (<>
          {tab === 'lib' && sel && <label>Alt text <input value={alt} onChange={(e) => setAlt(e.target.value)} /></label>}
          <button type="button" className="wp-btn primary" disabled={tab === 'lib' ? !sel : tab === 'url' ? !url : true} onClick={() => onInsert(tab === 'url' ? `<img src="${esc(url)}" alt="${esc(alt)}" />` : `<img src="${esc(sel?.url ?? '')}" alt="${esc(alt)}" />`)}>Insert into post</button>
          </>)}
        </div>
      </div>
    </div>
  )
}

type P = { id: number; title: string; category?: string; contentHtml?: string }

/** Patterns (WordPress reusable blocks / unsynced patterns): pick one and its HTML is inserted at the cursor. */
function PatternModal({ onClose, onInsert }: { onClose: () => void; onInsert: (html: string) => void }) {
  const [list, setList] = useState<P[] | null>(null)
  const [q, setQ] = useState('')
  useEffect(() => {
    fetch('/api/patterns?limit=200&depth=0&sort=title', { credentials: 'include' }).then((r) => r.json()).then((j) => setList(j.docs ?? [])).catch(() => setList([]))
  }, [])
  const shown = (list ?? []).filter((p) => !q || `${p.title} ${p.category ?? ''}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="wpe-modal" onClick={onClose}>
      <div className="wpe-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="wpe-modal-h"><h3>Insert pattern</h3><button type="button" className="wpx-link" onClick={onClose}>✕ Close</button></div>
        <div className="wpe-modal-body">
          <input placeholder="Search patterns" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: '100%', marginBottom: 12 }} />
          {list === null && <p className="wpe-ph">Loading…</p>}
          {list && shown.length === 0 && <p className="wpe-ph">No patterns yet. Create them under Content → Patterns.</p>}
          <ul className="wpe-patterns">
            {shown.map((p) => (
              <li key={p.id}>
                <div><b>{p.title}</b>{p.category && <small>{p.category}</small>}</div>
                <button type="button" className="wp-btn primary" onClick={() => onInsert(p.contentHtml || '')}>Insert</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
