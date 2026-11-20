'use client'

import { PreviewButton, PublishButton, SaveDraftButton, useDocumentInfo, useField } from '@payloadcms/ui'
import Link from 'next/link'
import { useState } from 'react'
import { Ic } from '../Ic'
import { useCaps } from '../useCaps'

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
  const vis = useField<string>({ path: 'visibility' })
  const pw = useField<string>({ path: 'postPassword' })
  const sticky = useField<boolean>({ path: 'sticky' })
  const review = useField<string>({ path: 'reviewStatus' })
  const caps = useCaps()
  const canPublish = !caps || caps.has('publish_posts')
  const submitForReview = () => {
    review.setValue('pending')
    setTimeout(() => (document.getElementById('action-save-draft') as HTMLButtonElement | null)?.click(), 50)
  }
  const [editVis, setEditVis] = useState(false)
  const [editDate, setEditDate] = useState(false)
  const [busy, setBusy] = useState(false)
  const published = status.value === 'published'
  const pending = !published && review.value === 'pending'
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
          <li><Ic n="status" className="wpx-ic" /> Status: <b>{published ? 'Published' : pending ? 'Pending Review' : 'Draft'}</b></li>
          <li style={{ flexWrap: 'wrap' }}>
            <Ic n="eye" className="wpx-ic" /> Visibility: <b>{vis.value === 'private' ? 'Private' : vis.value === 'password' ? 'Password protected' : 'Public'}{sticky.value ? ', Sticky' : ''}</b>
            {collectionSlug === 'posts' && <button type="button" className="wpx-link" onClick={() => setEditVis(!editVis)}>{editVis ? 'Close' : 'Edit'}</button>}
            {editVis && collectionSlug === 'posts' && (
              <div className="wpx-vis">
                {(['public', 'password', 'private'] as const).map((k) => (
                  <label key={k}><input type="radio" name="wpx-vis" checked={(vis.value || 'public') === k} onChange={() => vis.setValue(k)} /> {k === 'public' ? 'Public' : k === 'password' ? 'Password protected' : 'Private'}</label>
                ))}
                {vis.value === 'password' && <input type="text" placeholder="Password" value={pw.value || ''} onChange={(e) => pw.setValue(e.target.value)} />}
                {(vis.value || 'public') === 'public' && <label><input type="checkbox" checked={Boolean(sticky.value)} onChange={(e) => sticky.setValue(e.target.checked)} /> Stick this post to the front page</label>}
              </div>
            )}
          </li>
          <li>
            <Ic n="calendar" className="wpx-ic" />{' '}
            {future ? 'Schedule for' : published ? 'Published on' : 'Publish'}: <b>{pub.value ? nice(pub.value) : 'immediately'}</b>{' '}
            <button type="button" className="wpx-link" onClick={() => setEditDate(!editDate)}>Edit</button>
            {editDate && (
              <div className="wpx-date">
                <input type="datetime-local" value={toLocal(pub.value)} onChange={(e) => pub.setValue(e.target.value ? new Date(e.target.value).toISOString() : null)} />
                <button type="button" className="wpx-link" onClick={() => { pub.setValue(null); setEditDate(false) }}>Reset</button>
              </div>
            )}
          </li>
          {id && <li><Ic n="history" className="wpx-ic" /> Revisions: <b>{versionCount ?? 0}</b> <Link href={`/admin/collections/${collectionSlug}/${id}/versions`}>Browse</Link></li>}
          {data?.modifiedAt && <li><Ic n="edit" className="wpx-ic" /> Last modified: <b>{nice(data.modifiedAt)}</b></li>}
        </ul>
      </div>
      <div className="wpx-foot">
        {id ? <button type="button" className="wpx-trash" disabled={busy} onClick={trash}>Move to Trash</button> : <span />}
        {canPublish
          ? <PublishButton label={published ? 'Update' : future ? 'Schedule' : 'Publish'} />
          : <button type="button" className="wp-btn primary" onClick={submitForReview}>{pending ? 'Update review request' : 'Submit for Review'}</button>}
      </div>
    </div>
  )
}
