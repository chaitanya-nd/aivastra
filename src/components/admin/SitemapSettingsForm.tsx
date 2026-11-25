'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { SitemapTypeReport } from '@/lib/sitemap'

type Plugin = {
  sitemapEnabled: boolean; sitemapMaxLinks: number; sitemapImages: boolean
  sitemapExcludePosts: string; sitemapExcludeTerms: string; sitemapAuthors: boolean; sitemapSectionTerms: boolean
  authorArchives: boolean; newsSitemap: boolean; newsPublicationName: string; videoSitemap: boolean
}
type Props = {
  siteUrl: string; blocked: boolean; canEdit: boolean; plugin: Plugin
  typeIncluded: Record<string, boolean>; typeNoindex: Record<string, boolean>
  report: SitemapTypeReport[]; authorCount: number
}

const fmt = (d?: string) => (d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—')
const ADMIN_COLL: Record<string, string> = { posts: 'posts', pages: 'pages', guides: 'guides', cases: 'cases', updates: 'updates', reviews: 'reviews', categories: 'categories', tags: 'tags', 'section-categories': 'section-categories' }

function Toggle({ on, onChange, disabled }: { on: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={on} disabled={disabled} className={`smx-sw${on ? ' on' : ''}`} onClick={() => onChange(!on)}>
      <i /><span>{on ? 'On' : 'Off'}</span>
    </button>
  )
}

function Row({ title, help, children }: { title: string; help?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="smx-row">
      <div className="smx-row-l"><h4>{title}</h4>{help && <p>{help}</p>}</div>
      <div className="smx-row-r">{children}</div>
    </div>
  )
}

export function SitemapSettingsForm(p: Props) {
  const router = useRouter()
  const [plugin, setPlugin] = useState<Plugin>(p.plugin)
  const [types, setTypes] = useState<Record<string, boolean>>(p.typeIncluded)
  const [tab, setTab] = useState<string>('general')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [copied, setCopied] = useState(false)
  // last saved values — updated right after a save, and again when the refreshed server data arrives
  const [base, setBase] = useState({ plugin: p.plugin, types: p.typeIncluded })
  const serverKey = JSON.stringify([p.plugin, p.typeIncluded])
  useEffect(() => { setBase({ plugin: p.plugin, types: p.typeIncluded }) }, [serverKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const indexUrl = `${p.siteUrl}/sitemap_index.xml`
  const dirty = JSON.stringify(plugin) !== JSON.stringify(base.plugin) || JSON.stringify(types) !== JSON.stringify(base.types)
  const set = <K extends keyof Plugin>(k: K, v: Plugin[K]) => setPlugin((x) => ({ ...x, [k]: v }))
  const files = p.report.flatMap((r) => r.files.map((f) => ({ ...f, label: r.label })))
  const extra = [base.plugin.authorArchives && base.plugin.sitemapAuthors && 'author-sitemap.xml', base.plugin.newsSitemap && 'news-sitemap.xml', base.plugin.videoSitemap && 'video-sitemap.xml'].filter(Boolean) as string[]
  const totalUrls = p.report.reduce((a, r) => a + r.included.length, 0)
  const lastUpdated = p.report.map((r) => r.lastmod).filter(Boolean).sort().at(-1)
  const status = !base.plugin.sitemapEnabled ? 'off' : p.blocked ? 'blocked' : 'live'

  const TABS = useMemo(() => [
    { id: 'general', label: 'General', group: 'Sitemap' },
    ...p.report.filter((r) => r.kind === 'doc').map((r) => ({ id: r.key, label: r.label, group: 'Content types' })),
    ...p.report.filter((r) => r.kind === 'term').map((r) => ({ id: r.key, label: r.label, group: 'Taxonomies' })),
    { id: 'authors', label: 'Authors', group: 'Other sitemaps' },
    { id: 'news', label: 'News sitemap', group: 'Other sitemaps' },
    { id: 'video', label: 'Video sitemap', group: 'Other sitemaps' },
  ], [p.report])

  async function save() {
    if (!p.canEdit || busy) return
    setBusy(true); setMsg(null)
    try {
      const r1 = await fetch('/api/globals/plugin-settings', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...plugin, sitemapMaxLinks: Math.max(1, Math.min(50000, Number(plugin.sitemapMaxLinks) || 200)) }) })
      if (!r1.ok) throw new Error(`Sitemap options: ${(await r1.json().catch(() => ({})))?.errors?.[0]?.message || r1.statusText}`)
      const changed = Object.keys(types).filter((k) => types[k] !== base.types[k])
      if (changed.length) {
        // send each changed group complete, so its other settings (title, description, robots…) are kept as they are
        const cur = await (await fetch('/api/globals/site-settings?depth=0', { credentials: 'include' })).json()
        const body: any = {}
        for (const k of changed) body[k] = { ...(cur?.[k] ?? {}), inSitemap: types[k] }
        const r2 = await fetch('/api/globals/site-settings', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
        if (!r2.ok) throw new Error(`Content types: ${(await r2.json().catch(() => ({})))?.errors?.[0]?.message || r2.statusText}`)
      }
      setBase({ plugin, types })
      setMsg({ ok: true, text: 'Settings saved. The sitemap overview is refreshing…' })
      router.refresh()
    } catch (e: any) {
      setMsg({ ok: false, text: `Could not save — ${e.message}` })
    }
    setBusy(false)
  }

  const rep = p.report.find((r) => r.key === tab)
  const groups = [...new Set(TABS.map((t) => t.group))]

  return (
    <div className="smx">
      <header className="smx-head">
        <div>
          <h1>Sitemap Settings</h1>
          <p>An XML sitemap tells Google and Bing which pages of your site exist and when they last changed. It is built automatically from your published content — choose here what goes into it.</p>
        </div>
      </header>

      {/* ── sitemap index ── */}
      <section className="smx-card smx-index">
        <div className="smx-index-top">
          <div>
            <span className={`smx-badge ${status}`}>{status === 'live' ? 'Live' : status === 'blocked' ? 'Hidden from search engines' : 'Turned off'}</span>
            <h2>Your sitemap index</h2>
            <p className="smx-mute">
              {status === 'live' && 'Search engines can read it. Submit this URL once in Google Search Console and Bing Webmaster Tools.'}
              {status === 'blocked' && <>Anyone can open it in the browser, as on WordPress. Search engines are blocked on this site for now (robots.txt and a noindex header keep them out). Allow them under <a href="/admin/search-visibility">Search visibility</a> when the site goes live.</>}
              {status === 'off' && 'The sitemap is switched off (General → Enable sitemap). Search engines get “Not found”.'}
            </p>
          </div>
        </div>
        <div className="smx-url">
          <code>{indexUrl}</code>
          <button type="button" className="smx-btn" onClick={() => navigator.clipboard.writeText(indexUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}>{copied ? 'Copied' : 'Copy URL'}</button>
          <a className="smx-btn primary" href="/sitemap_index.xml" target="_blank" rel="noopener">Open sitemap ↗</a>
          <a className="smx-btn" href="/admin/sitemap-view">Table view</a>
        </div>
        <dl className="smx-stats">
          <div><dt>URLs in sitemap</dt><dd>{totalUrls}</dd></div>
          <div><dt>Sitemap files</dt><dd>{files.length + extra.length}</dd></div>
          <div><dt>Links per file</dt><dd>{p.plugin.sitemapMaxLinks}</dd></div>
          <div><dt>Last content change</dt><dd className="sm">{fmt(lastUpdated)}</dd></div>
        </dl>
        <table className="smx-t">
          <thead><tr><th>Sitemap file</th><th>Contains</th><th className="r">URLs</th><th className="r">Last modified</th></tr></thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.file}><td><a href={`/${f.file}`} target="_blank" rel="noopener">{f.file} ↗</a></td><td>{f.label}</td><td className="r">{f.urls}</td><td className="r">{fmt(f.lastmod)}</td></tr>
            ))}
            {extra.map((f) => (
              <tr key={f}><td><a href={`/${f}`} target="_blank" rel="noopener">{f} ↗</a></td><td>{f.startsWith('author') ? 'Author archives' : f.startsWith('news') ? 'Google News (last 48 h)' : 'Videos'}</td><td className="r">—</td><td className="r">—</td></tr>
            ))}
            {!files.length && !extra.length && <tr><td colSpan={4} className="smx-mute">No sitemap files — nothing is included yet.</td></tr>}
          </tbody>
        </table>
      </section>

      {/* ── options ── */}
      <section className="smx-card smx-opts">
        <nav className="smx-tabs" aria-label="Sitemap options">
          {groups.map((g) => (
            <div key={g}>
              <h5>{g}</h5>
              {TABS.filter((t) => t.group === g).map((t) => {
                const r = p.report.find((x) => x.key === t.id)
                return (
                  <button key={t.id} type="button" className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
                    <span>{t.label}</span>
                    {r && <em>{(r.key === 'section_category' ? !base.plugin.sitemapSectionTerms : r.typeOff) ? 'off' : r.included.length}</em>}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="smx-panel">
          {tab === 'general' && (
            <>
              <h3>General</h3>
              <Row title="Enable sitemap" help="Turn the whole XML sitemap on or off. When off, every sitemap URL returns “Not found”.">
                <Toggle on={plugin.sitemapEnabled} onChange={(v) => set('sitemapEnabled', v)} disabled={!p.canEdit} />
              </Row>
              <Row title="Links per sitemap" help="Maximum number of URLs in one sitemap file. When a type has more, it is split into post-sitemap.xml, post-sitemap2.xml … Rank Math default: 200.">
                <input type="number" min={1} max={50000} className="smx-in num" value={plugin.sitemapMaxLinks} disabled={!p.canEdit} onChange={(e) => set('sitemapMaxLinks', Number(e.target.value))} />
              </Row>
              <Row title="Images in sitemaps" help="List the images used in each item’s content under its sitemap entry (the Images column), so Google Images can find them — as Rank Math did.">
                <Toggle on={plugin.sitemapImages} onChange={(v) => set('sitemapImages', v)} disabled={!p.canEdit} />
              </Row>
              <Row title="Exclude posts / pages" help={<>Slugs to leave out, separated by commas. Applies to posts, pages, guides, case studies, product updates and reviews. Example: <code>thank-you, old-offer</code></>}>
                <textarea className="smx-in" rows={3} value={plugin.sitemapExcludePosts} disabled={!p.canEdit} onChange={(e) => set('sitemapExcludePosts', e.target.value)} placeholder="slug-one, slug-two" />
              </Row>
              <Row title="Exclude terms" help={<>Category / tag slugs to leave out, separated by commas. Example: <code>uncategorized</code></>}>
                <textarea className="smx-in" rows={3} value={plugin.sitemapExcludeTerms} disabled={!p.canEdit} onChange={(e) => set('sitemapExcludeTerms', e.target.value)} placeholder="term-one, term-two" />
              </Row>
              <div className="smx-note">
                <b>What is never in the sitemap:</b> drafts and scheduled items, trashed items, anything set to <i>noindex</i>, items with “Hide from sitemap” ticked, and non-public items. Each type’s tab lists exactly which items are left out and why.
              </div>
            </>
          )}

          {rep && (() => {
            const k = rep.settingsKey
            const section = rep.key === 'section_category'
            const on = section ? plugin.sitemapSectionTerms : (types[k] ?? true)
            const setOn = (v: boolean) => (section ? set('sitemapSectionTerms', v) : setTypes((t) => ({ ...t, [k]: v })))
            return (
              <>
                <h3>{rep.label}</h3>
                <Row title={`Include ${rep.label.toLowerCase()} in sitemap`} help={section ? 'Guide, case-study and product-update categories (section_category-sitemap.xml). Off on the WordPress site.' : `Add every published ${rep.label.toLowerCase().replace(/s$/, '')} to ${rep.files[0]?.file || `${rep.key}-sitemap.xml`}.`}>
                  <Toggle on={on} onChange={setOn} disabled={!p.canEdit} />
                </Row>
                {p.typeNoindex[k] && (
                  <div className="smx-note warn">This type is set to <b>noindex</b> in <a href="/admin/globals/site-settings">Titles &amp; Meta</a>, so it is kept out of the sitemap even when the switch is on.</div>
                )}
                <div className="smx-sub">
                  <h4>In the sitemap <span>{rep.typeOff ? 0 : rep.included.length}</span></h4>
                  {rep.typeOff ? <p className="smx-mute">None — {rep.typeOff}.</p> : rep.included.length === 0 ? <p className="smx-mute">No published items.</p> : (
                    <>
                      <p className="smx-mute">File{rep.files.length > 1 ? 's' : ''}: {rep.files.map((f, i) => <span key={f.file}>{i > 0 && ', '}<a href={`/${f.file}`} target="_blank" rel="noopener">{f.file} ↗</a> ({f.urls})</span>)}</p>
                      <ul className="smx-list">
                        {rep.included.slice(0, 300).map((d) => (
                          <li key={d.url}>{d.id != null ? <a href={`/admin/collections/${ADMIN_COLL[rep.coll]}/${d.id}`}>{d.title}</a> : <b>{d.title}</b>}<span>{d.url.replace(p.siteUrl, '')}</span><time>{fmt(d.lastmod).split(',').slice(0, 2).join(',')}</time></li>
                        ))}
                      </ul>
                      {rep.included.length > 300 && <p className="smx-mute">…and {rep.included.length - 300} more.</p>}
                    </>
                  )}
                </div>
                <div className="smx-sub">
                  <h4>Left out <span>{rep.excluded.length}</span></h4>
                  {rep.excluded.length === 0 ? <p className="smx-mute">Nothing is left out{rep.kind === 'doc' ? ' (drafts are never included)' : ''}.</p> : (
                    <ul className="smx-list ex">
                      {rep.excluded.map((d) => (
                        <li key={`${d.id}`}><a href={`/admin/collections/${ADMIN_COLL[rep.coll]}/${d.id}`}>{d.title}</a><span>{d.reason}</span></li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )
          })()}

          {tab === 'authors' && (
            <>
              <h3>Authors</h3>
              <Row title="Author archives" help={<>Turns on the author pages (<code>/author/name/</code>). Turning this off also removes the author sitemap.</>}>
                <Toggle on={plugin.authorArchives} onChange={(v) => set('authorArchives', v)} disabled={!p.canEdit} />
              </Row>
              <Row title="Include author sitemap" help={<>Adds <code>author-sitemap.xml</code> with every author who has at least one published post. Off on the WordPress site.</>}>
                <Toggle on={plugin.sitemapAuthors} onChange={(v) => set('sitemapAuthors', v)} disabled={!p.canEdit || !plugin.authorArchives} />
              </Row>
              <p className="smx-mute">{p.authorCount} user{p.authorCount === 1 ? '' : 's'} with an author page.</p>
            </>
          )}

          {tab === 'news' && (
            <>
              <h3>News sitemap</h3>
              <Row title="Google News sitemap" help={<>Adds <code>news-sitemap.xml</code> with posts published in the last 48 hours. Only useful if the site is approved in Google News.</>}>
                <Toggle on={plugin.newsSitemap} onChange={(v) => set('newsSitemap', v)} disabled={!p.canEdit} />
              </Row>
              {plugin.newsSitemap && (
                <Row title="Publication name" help="Exactly as registered in Google News Publisher Center.">
                  <input className="smx-in" value={plugin.newsPublicationName} disabled={!p.canEdit} onChange={(e) => set('newsPublicationName', e.target.value)} />
                </Row>
              )}
            </>
          )}

          {tab === 'video' && (
            <>
              <h3>Video sitemap</h3>
              <Row title="Video sitemap" help={<>Adds <code>video-sitemap.xml</code> listing posts, guides, case studies, updates and reviews that embed a YouTube / Vimeo video or use the Video schema.</>}>
                <Toggle on={plugin.videoSitemap} onChange={(v) => set('videoSitemap', v)} disabled={!p.canEdit} />
              </Row>
            </>
          )}
        </div>
      </section>

      <footer className="smx-bar">
        {!p.canEdit && <span className="smx-mute">You can view these settings; only administrators can change them.</span>}
        {msg && <span className={msg.ok ? 'smx-ok' : 'smx-err'}>{msg.text}</span>}
        {dirty && <span className="smx-mute">Unsaved changes</span>}
        <button type="button" className="smx-btn" disabled={!dirty || busy} onClick={() => { setPlugin(base.plugin); setTypes(base.types); setMsg(null) }}>Discard</button>
        <button type="button" className="smx-btn primary" disabled={!p.canEdit || !dirty || busy} onClick={save}>{busy ? 'Saving…' : 'Save Changes'}</button>
      </footer>
    </div>
  )
}
