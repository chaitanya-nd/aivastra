import type { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import { authorSitemapOn, entries, sitemapReport, SITEMAP_LABELS, SOURCES } from '@/lib/sitemap'
import { SITE_URL } from '@/lib/urls'
import { ToolView } from './ToolView'

const fmt = (d?: string) => (d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—')

/** Readable view of one sitemap file (or the index) — what search engines receive, as a table. */
export async function SitemapView(props: AdminViewServerProps) {
  const { payload } = props.initPageResult.req
  const sp = (await props.searchParams) as Record<string, string | undefined>
  const file = String(sp?.file || 'sitemap_index.xml')
  const [ps, settings]: any[] = await Promise.all([
    payload.findGlobal({ slug: 'plugin-settings' as any, depth: 0, overrideAccess: true }),
    payload.findGlobal({ slug: 'site-settings' as any, depth: 0, overrideAccess: true }),
  ])
  const max = Math.max(1, Number(ps?.sitemapMaxLinks) || 200)
  const raw = `/${file}`
  const m = file.match(/^([a-z_]+)-sitemap(\d*)\.xml$/)
  const src = m ? SOURCES.find((s) => s.key === m[1]) : undefined

  let body: React.ReactNode
  let title = file
  let sub = ''
  if (file === 'sitemap_index.xml') {
    const rep = await sitemapReport(settings, ps)
    const files = rep.flatMap((r) => r.files.map((f) => ({ ...f, label: r.label })))
    const extra = [authorSitemapOn(ps) && 'author-sitemap.xml', ps?.newsSitemap && 'news-sitemap.xml', ps?.videoSitemap && 'video-sitemap.xml'].filter(Boolean) as string[]
    title = 'Sitemap index'
    sub = `This index lists ${files.length + extra.length} sitemap files. Search engines read it first, then each file.`
    body = (
      <table className="smx-t smv-t">
        <thead><tr><th>#</th><th>Sitemap file</th><th>Contains</th><th className="r">URLs</th><th className="r">Last modified</th></tr></thead>
        <tbody>
          {files.map((f, i) => (
            <tr key={f.file}><td className="smv-n">{i + 1}</td><td><Link href={`/admin/sitemap-view?file=${f.file}`}>{f.file}</Link></td><td>{f.label}</td><td className="r">{f.urls}</td><td className="r">{fmt(f.lastmod)}</td></tr>
          ))}
          {extra.map((f, i) => (
            <tr key={f}><td className="smv-n">{files.length + i + 1}</td><td><a href={`/${f}`} target="_blank" rel="noopener">{f}</a></td><td>{f.startsWith('author') ? 'Author archives' : f.startsWith('news') ? 'Google News (last 48 h)' : 'Videos'}</td><td className="r">—</td><td className="r">—</td></tr>
          ))}
        </tbody>
      </table>
    )
  } else if (src) {
    const page = Number(m![2] || 1)
    const all = await entries(src, settings, ps)
    const rows = all.slice((page - 1) * max, page * max)
    title = file
    sub = rows.length ? `${SITEMAP_LABELS[src.key] || src.key} — ${rows.length} URL${rows.length === 1 ? '' : 's'}${all.length > max ? ` (part ${page} of ${Math.ceil(all.length / max)})` : ''}.` : 'This sitemap file is empty or does not exist.'
    body = rows.length ? (
      <table className="smx-t smv-t">
        <thead><tr><th>#</th><th>URL</th><th className="r">Images</th><th className="r">Last modified</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.loc}>
              <td className="smv-n">{(page - 1) * max + i + 1}</td>
              <td><a href={r.loc.replace(SITE_URL, '') || '/'} target="_blank" rel="noopener">{r.loc}</a></td>
              <td className="r">{r.images.length}</td>
              <td className="r">{fmt(r.lastmod)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : null
  } else {
    sub = 'This file is generated on request. Open the raw XML to see it.'
    body = null
  }

  return (
    <ToolView props={props}>
      <div className="smx smv">
        <p className="smv-crumbs"><Link href="/admin/sitemap-settings">Sitemap Settings</Link> › {file === 'sitemap_index.xml' ? 'Sitemap index' : <><Link href="/admin/sitemap-view">Sitemap index</Link> › {file}</>}</p>
        <header className="smx-head smv-head">
          <div><h1>{title}</h1><p>{sub}</p></div>
          <div className="smv-actions">
            <code>{SITE_URL}{raw}</code>
            <a className="smx-btn primary" href={raw} target="_blank" rel="noopener">Open {file === 'sitemap_index.xml' ? 'sitemap' : 'file'} ↗</a>
          </div>
        </header>
        {body && <section className="smx-card smv-card">{body}</section>}
      </div>
    </ToolView>
  )
}
