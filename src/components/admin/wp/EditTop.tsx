'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type Box = { key: string; label: string; match: (el: Element) => boolean }
const byId = (id: string) => (el: Element) => el.id === id
const byText = (t: string) => (el: Element) => el.id.startsWith('field-collapsible') && (el.textContent || '').slice(0, 60).toLowerCase().includes(t)

const BOXES: Record<string, Box[]> = {
  posts: [
    { key: 'excerpt', label: 'Excerpt', match: byId('field-excerpt') },
    { key: 'faq', label: 'FAQ', match: byText('faq') },
    { key: 'author', label: 'Author', match: byId('field-author') },
    { key: 'seo', label: 'Rank Math SEO', match: byId('field-meta') },
    { key: 'image', label: 'Featured image', match: byText('featured image') },
    { key: 'toc', label: 'Table of Contents', match: byText('table of contents') },
  ],
  pages: [
    { key: 'seo', label: 'Rank Math SEO', match: byId('field-meta') },
    { key: 'attrs', label: 'Page Attributes', match: byId('field-template') },
  ],
}
const HELP: Record<string, string[]> = {
  posts: [
    'Title & permalink — type the title; the permalink (slug) is generated from it. Click Edit next to the permalink to change it.',
    'Body — use Visual for formatting or Text for raw HTML. “Add Media” inserts images from the library, an upload, or a URL.',
    'Publish box — Save Draft keeps it private; Publish makes it live; click Edit next to the date to schedule. Revisions → Browse lists earlier saves.',
    'Categories / Tags — tick categories (★ marks the primary one used for breadcrumbs); type tags separated by commas.',
    'Rank Math SEO — focus keyword, SEO title, description, social image, robots and canonical URL for this post.',
    'View options — hide the boxes you do not use.',
  ],
  pages: [
    'Title & permalink — pages keep their parent path (e.g. /documentations/getting-started/).',
    'Page Attributes — Parent builds the URL path, Template chooses the layout and which fields show, Order sorts pages in menus.',
    'Publish box — same as posts: Save Draft, Preview, Publish/Update, scheduling and Revisions.',
    'Rank Math SEO — all meta, robots and schema settings for this page.',
  ],
}
const store = (slug: string) => `av-screen-${slug}`

/** WordPress "Screen Options" + "Help" tabs at the top right of the edit screen. */
export function EditTop() {
  const { collectionSlug } = useDocumentInfo() as any
  const slug = (collectionSlug as string) ?? 'posts'
  const boxes = BOXES[slug] ?? [{ key: 'seo', label: 'Rank Math SEO', match: byId('field-meta') }]
  const help = HELP[slug] ?? HELP.posts
  const [open, setOpen] = useState<'' | 'screen' | 'help'>('')
  const [hidden, setHidden] = useState<string[]>([])

  useEffect(() => {
    try { setHidden(JSON.parse(localStorage.getItem(store(slug)) || '[]')) } catch { /* ignore */ }
  }, [slug])
  useEffect(() => {
    const apply = () => {
      const all = document.querySelectorAll('.document-fields [id^="field-"], .document-fields .collapsible')
      for (const b of boxes) all.forEach((el) => { if (b.match(el)) (el as HTMLElement).style.display = hidden.includes(b.key) ? 'none' : '' })
    }
    apply()
    const mo = new MutationObserver(apply)
    mo.observe(document.querySelector('.document-fields') ?? document.body, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [hidden, boxes])
  const toggle = (k: string) => {
    const n = hidden.includes(k) ? hidden.filter((x) => x !== k) : [...hidden, k]
    setHidden(n)
    try { localStorage.setItem(store(slug), JSON.stringify(n)) } catch { /* ignore */ }
  }
  return (
    <div className="wpe-top-tabs">
      <div className="wpe-top-btns">
        <button type="button" className={open === 'screen' ? 'on' : ''} onClick={() => setOpen(open === 'screen' ? '' : 'screen')}>View options {open === 'screen' ? '▴' : '▾'}</button>
        <button type="button" className={open === 'help' ? 'on' : ''} onClick={() => setOpen(open === 'help' ? '' : 'help')}>Help {open === 'help' ? '▴' : '▾'}</button>
      </div>
      {open === 'screen' && (
        <div className="wpe-top-panel">
          <strong>Boxes</strong>
          {boxes.map((b) => <label key={b.key}><input type="checkbox" checked={!hidden.includes(b.key)} onChange={() => toggle(b.key)} /> {b.label}</label>)}
        </div>
      )}
      {open === 'help' && (
        <div className="wpe-top-panel col">
          <strong>Overview</strong>
          <ul>{help.map((h) => <li key={h}>{h}</li>)}</ul>
        </div>
      )}
    </div>
  )
}
