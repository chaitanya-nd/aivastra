'use client'

import { useAllFormFields, useDocumentInfo } from '@payloadcms/ui'
import { useEffect, useMemo, useState } from 'react'
import { getPath, SITE_URL } from '@/lib/urls'
import { analyze, keywordCount, stripHtml, type Test } from './analyze'

const GROUPS: Test['group'][] = ['Basic SEO', 'Additional', 'Title readability', 'Content readability']
const LINKABLE = ['posts', 'guides', 'cases', 'updates', 'reviews', 'pages'] as const
type Suggestion = { id: string | number; title: string; url: string; collection: string; linked: boolean }

const host = (() => { try { return new URL(SITE_URL).host } catch { return '' } })()
const cut = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s)

/** Rank Math-style SEO box: live score + checklist, Google preview, secondary keywords and internal link suggestions. */
export function SeoPanel() {
  const [fields] = useAllFormFields()
  const { collectionSlug, id } = useDocumentInfo()
  const v = (p: string) => (fields?.[p]?.value as any) ?? ''
  const [tab, setTab] = useState<'analysis' | 'preview' | 'social' | 'links'>('analysis')
  const [ogImg, setOgImg] = useState<string>('')
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [dupe, setDupe] = useState<number>(0)
  const [sugs, setSugs] = useState<Suggestion[] | null>(null)

  const title = String(v('title') || '')
  const slug = String(v('slug') || '')
  const html = String(v('contentHtml') || '')
  const keyword = String(v('meta.focusKeyword') || '').trim()
  const secondary = String(v('meta.secondaryKeywords') || '').split(',').map((s) => s.trim()).filter(Boolean)
  const seoTitle = String(v('meta.title') || '') || (title ? `${title} - AI Vastra` : '')
  const description = String(v('meta.description') || '') || stripHtml(String(v('excerpt') || '')).slice(0, 160)
  // Form state stores an array field as a row count; the rows live under `breadcrumbs.<n>.url`.
  const crumbRows = Number(v('breadcrumbs')) || 0
  const crumbUrl = crumbRows > 0 ? String(v(`breadcrumbs.${crumbRows - 1}.url`) || '') : ''
  const path = collectionSlug ? getPath(collectionSlug, { slug, breadcrumbs: crumbUrl ? [{ url: crumbUrl }] : undefined } as any) : `/${slug}`
  const url = `${SITE_URL}${path.endsWith('/') ? path : `${path}/`}`
  const showToc = v('showToc') !== false
  const ogTitle = String(v('meta.ogTitle') || '') || seoTitle
  const ogDesc = String(v('meta.ogDescription') || '') || description
  const imgRef = v('meta.image') || v('featuredImage')
  const imgUrl = String(v('featuredImageUrl') || '')
  useEffect(() => {
    if (tab !== 'social') return
    const id = typeof imgRef === 'object' ? imgRef?.id : imgRef
    if (!id) return setOgImg(imgUrl)
    fetch(`/api/media/${id}?depth=0`, { credentials: 'include' }).then((r) => r.json()).then((m) => setOgImg(m?.sizes?.og?.url || m?.url || imgUrl)).catch(() => setOgImg(imgUrl))
  }, [tab, imgRef, imgUrl])

  const res = useMemo(() => analyze({ keyword, seoTitle, description, slug, url, html, showToc, siteHost: host }), [keyword, seoTitle, description, slug, url, html, showToc])

  // Is the focus keyword already used elsewhere in this collection?
  useEffect(() => {
    if (!keyword || !collectionSlug) return setDupe(0)
    const t = setTimeout(() => {
      fetch(`/api/${collectionSlug}?limit=1&depth=0&where[meta.focusKeyword][equals]=${encodeURIComponent(keyword)}${id ? `&where[id][not_equals]=${id}` : ''}`, { credentials: 'include' })
        .then((r) => r.json()).then((j) => setDupe(j.totalDocs ?? 0)).catch(() => setDupe(0))
    }, 600)
    return () => clearTimeout(t)
  }, [keyword, collectionSlug, id])

  // Internal link suggestions (on demand)
  useEffect(() => {
    if (tab !== 'links') return
    const terms = [keyword, ...secondary].filter(Boolean)
    const words = terms.length ? terms : title.split(/\s+/).filter((w) => w.length > 4).slice(0, 3)
    if (!words.length) return setSugs([])
    setSugs(null)
    ;(async () => {
      const out = new Map<string, Suggestion>()
      for (const coll of LINKABLE) {
        const q = new URLSearchParams({ limit: '6', depth: '0', 'select[title]': 'true', 'select[slug]': 'true', 'select[breadcrumbs]': 'true' })
        words.forEach((w, i) => q.set(`where[or][${i}][title][like]`, w))
        const j = await fetch(`/api/${coll}?${q}`, { credentials: 'include' }).then((r) => r.json()).catch(() => ({ docs: [] }))
        for (const d of j.docs ?? []) {
          if (coll === collectionSlug && String(d.id) === String(id)) continue
          const p = getPath(coll, d)
          const u = p.endsWith('/') ? p : `${p}/`
          out.set(`${coll}:${d.id}`, { id: d.id, title: d.title, url: u, collection: coll, linked: html.includes(`href="${u}`) || html.includes(`href="${SITE_URL}${u}`) })
        }
      }
      setSugs([...out.values()].slice(0, 12))
    })()
  }, [tab, keyword, secondary.join(','), title, collectionSlug, id, html])

  const tests: Test[] = keyword ? [...res.tests, { id: 'unique', group: 'Additional', weight: 0, ok: dupe === 0, text: dupe ? `Focus keyword is already used on ${dupe} other ${dupe === 1 ? 'item' : 'items'}.` : 'Focus keyword has not been used before.' }] : res.tests
  const tone = !keyword ? 'none' : res.score >= 80 ? 'good' : res.score >= 50 ? 'ok' : 'bad'
  const copy = (t: string) => navigator.clipboard?.writeText(t).catch(() => {})

  return (
    <div className="seo-panel">
      <div className="seo-head">
        <div className={`seo-score ${tone}`}><b>{keyword ? res.score : '–'}</b><span>/ 100</span></div>
        <div className="seo-head-t">
          <strong>SEO analysis</strong>
          <span>{keyword ? `${res.words} words · keyword density ${res.density}%` : 'Enter a focus keyword below to score this content.'}</span>
        </div>
        <div className="seo-tabs" role="tablist">
          {(['analysis', 'preview', 'social', 'links'] as const).map((t) => <button key={t} type="button" className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t === 'analysis' ? 'Checklist' : t === 'preview' ? 'Search preview' : t === 'social' ? 'Social preview' : 'Link suggestions'}</button>)}
        </div>
      </div>

      {tab === 'analysis' && (
        <div className="seo-body">
          {GROUPS.map((g) => {
            const list = tests.filter((x) => x.group === g)
            if (!list.length) return null
            const bad = list.filter((x) => !x.ok).length
            return (
              <details key={g} className="seo-group" open={g === 'Basic SEO'}>
                <summary><span>{g}</span><em className={bad ? 'bad' : 'good'}>{bad ? `${bad} to fix` : 'All good'}</em></summary>
                <ul>{list.map((x) => <li key={x.id} className={x.ok ? 'ok' : 'no'}>{x.text}</li>)}</ul>
              </details>
            )
          })}
          {secondary.length > 0 && (
            <details className="seo-group" open>
              <summary><span>Secondary keywords</span><em className="good">{secondary.length}</em></summary>
              <ul>{secondary.map((k) => { const n = keywordCount(html, k); return <li key={k} className={n ? 'ok' : 'no'}>“{k}” — {n ? `used ${n} time${n === 1 ? '' : 's'}` : 'not used in the content yet'}</li> })}</ul>
            </details>
          )}
        </div>
      )}

      {tab === 'preview' && (
        <div className="seo-body">
          <div className="seo-dev">
            <button type="button" className={device === 'desktop' ? 'on' : ''} onClick={() => setDevice('desktop')}>Desktop</button>
            <button type="button" className={device === 'mobile' ? 'on' : ''} onClick={() => setDevice('mobile')}>Mobile</button>
          </div>
          <div className={`serp ${device}`}>
            <div className="serp-site"><span className="serp-fav">A</span><div><b>AI Vastra</b><small>{cut(url.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/').join(' › '), device === 'mobile' ? 40 : 70)}</small></div></div>
            <a className="serp-title">{cut(seoTitle || 'Add a title', device === 'mobile' ? 78 : 60)}</a>
            <p className="serp-desc">{cut(description || 'Add a meta description so Google shows your own summary here.', device === 'mobile' ? 120 : 160)}</p>
          </div>
          <p className="seo-hint">Title {seoTitle.length}/60 · Description {description.length}/160. Edit them in the fields below.</p>
        </div>
      )}

      {tab === 'social' && (
        <div className="seo-body seo-social">
          <div>
            <small className="seo-net">Facebook / LinkedIn</small>
            <div className="og-card fb">
              {ogImg ? <img src={ogImg} alt="" /> : <div className="og-noimg">No image — set a social image or featured image</div>}
              <div className="og-t"><small>{host.replace(/^www\./, '').toUpperCase()}</small><b>{cut(ogTitle || 'Add a title', 88)}</b><span>{cut(ogDesc, 110)}</span></div>
            </div>
          </div>
          <div>
            <small className="seo-net">X (Twitter) · large image card</small>
            <div className="og-card x">
              {ogImg ? <img src={ogImg} alt="" /> : <div className="og-noimg">No image</div>}
              <div className="og-t"><b>{cut(ogTitle || 'Add a title', 70)}</b><span>{cut(ogDesc, 100)}</span><small>{host.replace(/^www\./, '')}</small></div>
            </div>
          </div>
          <p className="seo-hint" style={{ gridColumn: '1 / -1' }}>Edit the social title, description and image on the Social tab below. They fall back to the SEO title, description and featured image.</p>
        </div>
      )}

      {tab === 'links' && (
        <div className="seo-body">
          {sugs === null && <p className="seo-hint">Finding related content…</p>}
          {sugs && sugs.length === 0 && <p className="seo-hint">No related content found. Add a focus keyword to get suggestions.</p>}
          {sugs && sugs.length > 0 && (
            <ul className="seo-sugs">
              {sugs.map((s) => (
                <li key={`${s.collection}:${s.id}`}>
                  <div><b>{s.title}</b><small>{s.url}</small></div>
                  {s.linked ? <em>Linked</em> : <button type="button" className="wp-btn" onClick={() => copy(`<a href="${s.url}">${s.title}</a>`)}>Copy link</button>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
