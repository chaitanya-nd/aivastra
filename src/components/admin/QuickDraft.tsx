'use client'

import { useState } from 'react'

export function QuickDraft() {
  const [title, setTitle] = useState('')
  const [state, setState] = useState<'idle' | 'busy' | 'err'>('idle')
  const [msg, setMsg] = useState('')
  async function save(e: React.FormEvent) {
    e.preventDefault()
    setState('busy')
    try {
      const r = await fetch('/api/posts?draft=true', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: title || 'Untitled draft', _status: 'draft' }) })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.errors?.[0]?.message || 'Could not save')
      window.location.href = `/admin/collections/posts/${j.doc.id}`
    } catch (err: any) {
      setState('err')
      setMsg(err.message)
    }
  }
  return (
    <form onSubmit={save} className="wpw-qd">
      <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" /></label>
      <button className="wp-btn" disabled={state === 'busy'}>{state === 'busy' ? 'Saving…' : 'Save Draft'}</button>
      {state === 'err' && <p className="wpw-err">{msg}</p>}
    </form>
  )
}
