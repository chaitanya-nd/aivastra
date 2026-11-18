'use client'
import { useMemo, useRef, useState } from 'react'
import type { PublicComment } from '@/lib/comments'

type Props = { collection: string; id: number | string; open: boolean; initial: { page: number; totalPages: number; comments: PublicComment[] }; settings: { threaded: boolean; depth: number; requireNameEmail: boolean; loggedInOnly: boolean; order: 'asc' | 'desc' } }
const fmt = (d: string) => new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })

export function CommentsClient({ collection, id, open, initial, settings }: Props) {
  const [items, setItems] = useState(initial.comments)
  const [page, setPage] = useState(initial.page)
  const [replyTo, setReplyTo] = useState<PublicComment | null>(null)
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'pending'>('idle')
  const [err, setErr] = useState('')
  const born = useRef(Date.now())
  const form = useRef<HTMLFormElement>(null)
  const topCount = items.filter((c) => !c.parent).length

  const tree = useMemo(() => {
    const kids = new Map<number | null, PublicComment[]>()
    for (const c of items) { const k = settings.threaded ? c.parent : null; kids.set(k, [...(kids.get(k) ?? []), c]) }
    return kids
  }, [items, settings.threaded])

  async function more() {
    const r = await fetch(`/api/av/comment?doc=${collection}:${id}&page=${page + 1}`).then((x) => x.json())
    setItems((cur) => [...cur, ...r.comments.filter((c: PublicComment) => !cur.some((x) => x.id === c.id))])
    setPage(r.page)
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(''); setState('sending')
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries())
    const r = await fetch('/api/av/comment', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...fd, collection, id, parent: replyTo?.id, t: born.current }) })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) { setErr(j.error || 'Could not post your comment.'); setState('idle'); return }
    setState(j.status === 'approved' ? 'ok' : 'pending'); setReplyTo(null); form.current?.reset()
    if (j.status === 'approved') { const l = await fetch(`/api/av/comment?doc=${collection}:${id}&page=1`).then((x) => x.json()); setItems(l.comments); setPage(1) }
  }
  const render = (list: PublicComment[], depth: number): React.ReactNode => (
    <ol className={depth ? 'children' : 'comment-list'}>
      {list.map((c) => (
        <li key={c.id} id={`comment-${c.id}`} className="comment">
          <article className="comment-body">
            <header className="comment-meta">
              <span className="comment-avatar" aria-hidden>{c.name.slice(0, 1).toUpperCase()}</span>
              <b className="fn">{c.url ? <a href={c.url} rel="nofollow ugc noopener" target="_blank">{c.name}</a> : c.name}</b>
              <time dateTime={c.date}>{fmt(c.date)}</time>
            </header>
            <div className="comment-content">{c.content.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
            {open && settings.threaded && depth < settings.depth - 1 && <button type="button" className="comment-reply-link" onClick={() => { setReplyTo(c); form.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}>Reply</button>}
          </article>
          {settings.threaded && tree.get(c.id) && render(tree.get(c.id)!, depth + 1)}
        </li>
      ))}
    </ol>
  )
  return (
    <section id="comments" className="av-comments">
      <div className="container">
        <h3 className="comments-title">{topCount === 0 ? 'Leave a Reply' : `${items.length} ${items.length === 1 ? 'Comment' : 'Comments'}`}</h3>
        {items.length > 0 && render(tree.get(null) ?? [], 0)}
        {page < initial.totalPages && <button type="button" className="comment-more" onClick={more}>Load more comments</button>}
        {!open ? <p className="no-comments">Comments are closed.</p> : settings.loggedInOnly ? <p>You must be <a href="/admin/login">logged in</a> to post a comment.</p> : (
          <form ref={form} onSubmit={submit} className="comment-form" id="respond">
            <h4>{replyTo ? <>Reply to {replyTo.name} <button type="button" className="comment-cancel" onClick={() => setReplyTo(null)}>Cancel reply</button></> : 'Leave a Reply'}</h4>
            {state === 'ok' && <p className="comment-note ok">Thanks — your comment is published.</p>}
            {state === 'pending' && <p className="comment-note">Your comment is awaiting moderation. It will appear once approved.</p>}
            {err && <p className="comment-note err">{err}</p>}
            <p className="comment-notes">{settings.requireNameEmail ? 'Your email address will not be published. Required fields are marked *' : ''}</p>
            <p><label>Comment *<textarea name="content" rows={6} required maxLength={5000} /></label></p>
            <p><label>Name {settings.requireNameEmail && '*'}<input name="name" required={settings.requireNameEmail} maxLength={80} /></label></p>
            <p><label>Email {settings.requireNameEmail && '*'}<input name="email" type="email" required={settings.requireNameEmail} maxLength={120} /></label></p>
            <p><label>Website<input name="url" type="url" maxLength={200} /></label></p>
            <p style={{ position: 'absolute', left: '-9999px' }} aria-hidden><label>Leave empty<input name="website_url" tabIndex={-1} autoComplete="off" /></label></p>
            <p><button type="submit" className="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Posting…' : 'Post Comment'}</button></p>
          </form>
        )}
      </div>
    </section>
  )
}
