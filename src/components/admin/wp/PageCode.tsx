'use client'

import { useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type F = { label: string; file: string; abs: string; lines: number; src: string | null }

/** "Page code" metabox: which Next.js files render this page, with their source (read-only). */
export function PageCode() {
  const template = useFormFields(([f]) => (f.template?.value as string) || 'default')
  const [data, setData] = useState<{ title: string; files: F[] } | null>(null)
  const [i, setI] = useState(0)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    setData(null); setI(0)
    fetch(`/api/av/page-code?template=${encodeURIComponent(template)}`, { credentials: 'include' }).then((r) => r.json()).then(setData).catch(() => setData({ title: '', files: [] }))
  }, [template, open])

  const f = data?.files[i]
  return (
    <div className="wpx-box wpcode">
      <button type="button" className="wpcode-h" onClick={() => setOpen(!open)}>
        <span><b>Page code</b> <em>Next.js source for the “{template}” template — read-only</em></span><span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="wpcode-b">
          <p className="wpx-mute">This page is rendered by the files below. Content, SEO, meta, URL and redirects are managed here in the admin; to change the <em>layout or markup</em>, edit these files in the repository (the site hot-reloads in development).</p>
          {!data ? <p className="wpx-mute">Loading…</p> : (
            <>
              <div className="wpcode-tabs">{data.files.map((x, n) => <button key={x.file} type="button" className={n === i ? 'on' : ''} onClick={() => setI(n)}>{x.file.split('/').pop()}</button>)}</div>
              {f && (
                <>
                  <div className="wpcode-meta">
                    <span>{f.label}</span>
                    <code>{f.file}</code>
                    <span>{f.lines} lines</span>
                    <button type="button" className="wp-btn" onClick={() => { if (f.src) navigator.clipboard.writeText(f.src).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }) }}>{copied ? 'Copied' : 'Copy'}</button>
                    <a className="wp-btn" href={`vscode://file/${f.abs}`}>Open in VS Code</a>
                  </div>
                  {f.src ? <pre className="wpcode-src"><code>{f.src}</code></pre> : <p className="wpx-mute">Source not available in this build (deployed builds ship compiled code). Path: <code>{f.file}</code></p>}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
