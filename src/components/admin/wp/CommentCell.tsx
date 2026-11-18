'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const J = { 'content-type': 'application/json' }

/** Comments → Comment column: text + hover actions Approve | Reply | Edit | Spam | Trash (WordPress). */
export function CommentCell({ rowData, cellData }: any) {
  const router = useRouter()
  const [reply, setReply] = useState(false)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const id = rowData?.id
  const st: string = rowData?.status
  if (!id) return <>{String(cellData ?? '')}</>
  const set = async (status: string) => { await fetch(`/api/comments/${id}`, { method: 'PATCH', credentials: 'include', headers: J, body: JSON.stringify({ status }) }); router.refresh() }
  const purge = async () => { if (confirm('Delete this comment permanently?')) { await fetch(`/api/comments/${id}`, { method: 'DELETE', credentials: 'include' }); router.refresh() } }
  async function send() {
    if (!text.trim()) return
    setBusy(true)
    const me = await fetch('/api/users/me', { credentials: 'include' }).then((r) => r.json()).then((j) => j.user)
    await fetch('/api/comments', { method: 'POST', credentials: 'include', headers: J, body: JSON.stringify({ content: text, status: 'approved', post: rowData.post, parent: id, authorName: me?.name || me?.email, authorEmail: me?.email, user: me?.id }) })
    if (st === 'pending') await set('approved')
    setBusy(false); setReply(false); setText(''); router.refresh()
  }
  return (
    <div className="wpl-title">
      <div className={`wpc-text st-${st}`}>{st === 'pending' && <em className="wpc-badge">Pending</em>}{st === 'spam' && <em className="wpc-badge spam">Spam</em>}{String(cellData)}</div>
      <div className="wpl-actions">
        {st === 'trash' || st === 'spam'
          ? <><button type="button" onClick={() => set('pending')}>Restore</button> | <button type="button" className="del" onClick={purge}>Delete Permanently</button></>
          : <>
            {st === 'approved' ? <button type="button" onClick={() => set('pending')}>Unapprove</button> : <button type="button" onClick={() => set('approved')}>Approve</button>} | <button type="button" onClick={() => setReply(!reply)}>Reply</button> | <Link href={`/admin/collections/comments/${id}`}>Edit</Link> | <button type="button" className="del" onClick={() => set('spam')}>Spam</button> | <button type="button" className="del" onClick={() => set('trash')}>Trash</button>
          </>}
      </div>
      {reply && (
        <div className="wpc-reply">
          <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply…" />
          <div><button type="button" className="wp-btn primary" disabled={busy} onClick={send}>{busy ? 'Replying…' : 'Reply'}</button> <button type="button" className="wp-btn" onClick={() => setReply(false)}>Cancel</button></div>
        </div>
      )}
    </div>
  )
}
