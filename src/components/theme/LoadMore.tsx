'use client'
import { useState } from 'react'

/** "View More" on the blog index: fetches the next page and appends its cards in place (the link still works without JS). */
export function LoadMore({ next, total, target = 'blog-posts-container' }: { next: number; total: number; target?: string }) {
  const [page, setPage] = useState(next)
  const [busy, setBusy] = useState(false)
  if (page > total) return null
  const href = (n: number, base = window.location.pathname.replace(/page\/\d+\/?$/, '')) => `${base.replace(/\/?$/, '/')}page/${n}/`
  const more = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      const html = await (await fetch(href(page))).text()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const grid = document.getElementById(target)
      doc.querySelectorAll(`#${target} > *`).forEach((n) => grid?.appendChild(document.importNode(n, true)))
      setPage(page + 1)
    } finally { setBusy(false) }
  }
  return <a className="ui-view-more-btn" href={typeof window === 'undefined' ? `page/${page}/` : href(page)} rel="next" onClick={more} aria-busy={busy}>{busy ? 'Loading…' : 'View More'}</a>
}
