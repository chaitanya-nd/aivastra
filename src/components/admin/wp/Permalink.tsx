'use client'

import { useField } from '@payloadcms/ui'
import { useState } from 'react'
import { getPath, SITE_URL } from '@/lib/urls'

const fmt = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/** WordPress "Permalink: https://site/<slug>/ [Edit]" row under the title. */
export function Permalink({ path, clientProps }: { path: string; clientProps?: { collection?: string } }) {
  const f = useField<string>({ path })
  const title = useField<string>({ path: 'title' })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const col = clientProps?.collection ?? 'pages'
  const slug = f.value || fmt(title.value ?? '')
  const full = (getPath(col, { slug: '__S__' } as any) as string).split('__S__')
  const prefix = `${SITE_URL}${full[0]}`
  const suffix = full[1] ?? '/'
  return (
    <div className="wpx-permalink">
      <strong>Permalink:</strong>{' '}
      {editing ? (
        <>
          <span>{prefix}</span>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus />
          <span>{suffix}</span>{' '}
          <button type="button" className="wp-btn" onClick={() => { f.setValue(fmt(draft)); setEditing(false) }}>OK</button>{' '}
          <button type="button" className="wpx-link" onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <a href={`${prefix}${slug}${suffix}`} target="_blank" rel="noreferrer">{prefix}<b>{slug || '…'}</b>{suffix}</a>{' '}
          <button type="button" className="wp-btn" onClick={() => { setDraft(slug); setEditing(true) }}>Edit</button>
        </>
      )}
    </div>
  )
}
