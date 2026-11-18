'use client'

import { PreviewButton, PublishButton, SaveDraftButton, useDocumentInfo, useField } from '@payloadcms/ui'
import Link from 'next/link'
import { useState } from 'react'

const toLocal = (iso?: string | null) => {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}
const nice = (iso?: string | null) => (iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '')

/** WordPress "Publish" metabox: Save Draft / Preview, Status, Visibility, Publish date, Revisions, Move to Trash, Publish. */
export function PublishBox() {
  const { id, collectionSlug, versionCount, data } = useDocumentInfo() as any
  const status = useField<string>({ path: '_status' })
  const pub = useField<string>({ path: 'publishedAt' })
  const [editDate, setEditDate] = useState(false)
  const [busy, setBusy] = useState(false)
  const published = status.value === 'published'
  const future = pub.value && new Date(pub.value) > new Date()

  async function trash() {
    if (!id || !confirm('Move this item to the Trash? You can restore it from the Trash view.')) return
    setBusy(true)
    const r = await fetch(`/api/${collectionSlug}/${id}`, { method: 'PATCH', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deletedAt: new Date().toISOString() }) })
    if (r.ok) window.location.href = `/admin/collections/${collectionSlug}`
    else { setBusy(false); alert('Could not delete.') }
  }

  return (
    <div className="wpx-box wpx-publish">
      <h3>Publish</h3>
      <div className="wpx-body">
        <div className="wpx-minor">
          <SaveDraftButton />
          <PreviewButton />
        </div>
        <ul className="wpx-misc">
          <li><span className="wpx-ic">◉</span> Status: <b>{published ? 'Published' : 'Draft'}</b></li>
          <li><span className="wpx-ic">◐</span> Visibility: <b>Public</b></li>
          <li>
            <span className="wpx-ic">▦</span>{' '}
            {future ? 'Schedule for' : published ? 'Published on' : 'Publish'}: <b>{pub.value ? nice(pub.value) : 'immediately'}</b>{' '}
            <button type="button" className="wpx-link" onClick={() => setEditDate(!editDate)}>Edit</button>
            {editDate && (
              <div className="wpx-date">
                <input type="datetime-local" value={toLocal(pub.value)} onChange={(e) => pub.setValue(e.target.value ? new Date(e.target.value).toISOString() : null)} />
                <button type="button" className="wpx-link" onClick={() => { pub.setValue(null); setEditDate(false) }}>Reset</button>
              </div>
            )}
          </li>
          {id && <li><span className="wpx-ic">↺</span> Revisions: <b>{versionCount ?? 0}</b> <Link href={`/admin/collections/${collectionSlug}/${id}/versions`}>Browse</Link></li>}
          {data?.modifiedAt && <li><span className="wpx-ic">✎</span> Last modified: <b>{nice(data.modifiedAt)}</b></li>}
        </ul>
      </div>
      <div className="wpx-foot">
        {id ? <button type="button" className="wpx-trash" disabled={busy} onClick={trash}>Move to Trash</button> : <span />}
        <PublishButton label={published ? 'Update' : future ? 'Schedule' : 'Publish'} />
      </div>
    </div>
  )
}
