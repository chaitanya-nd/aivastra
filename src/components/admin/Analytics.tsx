import type { AdminViewServerProps } from 'payload'
import { analytics4, googleConfig, searchConsole } from '@/lib/google'
import { ToolView } from './ToolView'

const n = (v: number) => new Intl.NumberFormat('en-US', { notation: v >= 10000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(v)
const delta = (a: number, b: number, invert = false) => {
  if (!b) return null
  const d = ((a - b) / b) * 100
  const good = invert ? d < 0 : d > 0
  return <em className={good ? 'up' : 'down'}>{d > 0 ? '+' : ''}{d.toFixed(1)}%</em>
}

/** Rank Math → Analytics: Search Console + GA4 overview (read-only, service account). */
/** Rank tracker: position per query per day (impression-weighted over pages) from the daily snapshots. */
async function rankTracker(payload: any) {
  const since = new Date(Date.now() - 40 * 86400_000).toISOString().slice(0, 10)
  const res = await payload.find({ collection: 'rank-snapshots', where: { date: { greater_than_equal: since } }, pagination: false, limit: 50000, depth: 0, overrideAccess: true }).catch(() => ({ docs: [] }))
  const byQ = new Map<string, Map<string, { w: number; imp: number; clicks: number }>>()
  for (const r of res.docs as any[]) {
    const days = byQ.get(r.query) ?? new Map()
    const d = days.get(r.date) ?? { w: 0, imp: 0, clicks: 0 }
    d.w += (r.position || 0) * (r.impressions || 0); d.imp += r.impressions || 0; d.clicks += r.clicks || 0
    days.set(r.date, d); byQ.set(r.query, days)
  }
  const kws = await payload.find({ collection: 'posts', where: { 'meta.focusKeyword': { exists: true } }, pagination: false, limit: 2000, depth: 0, overrideAccess: true, select: { meta: true } }).catch(() => ({ docs: [] }))
  const tracked = new Set((kws.docs as any[]).map((d) => String(d.meta?.focusKeyword || '').trim().toLowerCase()).filter(Boolean))
  const dates = [...new Set((res.docs as any[]).map((r) => r.date))].sort()
  const latest = dates.at(-1)
  const at = (days: Map<string, any>, back: number) => {
    if (!latest) return null
    const target = new Date(new Date(latest).getTime() - back * 86400_000).toISOString().slice(0, 10)
    const d = [...days.entries()].filter(([k]) => k <= target).sort(([a], [b]) => b.localeCompare(a))[0]?.[1]
    return d && d.imp ? d.w / d.imp : null
  }
  const rows = [...byQ.entries()].map(([q, days]) => ({ q, tracked: tracked.has(q.toLowerCase()), now: at(days, 0), d7: at(days, 7), d28: at(days, 28), imp: [...days.values()].reduce((a, x) => a + x.imp, 0), clicks: [...days.values()].reduce((a, x) => a + x.clicks, 0) }))
    .filter((r) => r.now !== null)
    .sort((a, b) => Number(b.tracked) - Number(a.tracked) || b.imp - a.imp)
    .slice(0, 40)
  return { rows, days: dates.length, latest, untracked: [...tracked].filter((k) => !byQ.has(k)).slice(0, 20) }
}
const move = (now: number | null, then: number | null) => {
  if (now === null || then === null) return <span style={{ color: 'var(--av-dim)' }}>–</span>
  const d = then - now
  if (Math.abs(d) < 0.5) return <span style={{ color: 'var(--av-dim)' }}>0</span>
  return <em className={d > 0 ? 'up' : 'down'} style={{ fontStyle: 'normal', color: d > 0 ? 'var(--av-ok)' : 'var(--av-err)' }}>{d > 0 ? '▲' : '▼'} {Math.abs(d).toFixed(1)}</em>
}

export async function Analytics(props: AdminViewServerProps) {
  const rt = await rankTracker(props.initPageResult.req.payload)
  const cfg = googleConfig()
  const ready = Boolean(cfg.account && (cfg.gsc || cfg.ga4))
  let gsc: Awaited<ReturnType<typeof searchConsole>> | null = null, ga: Awaited<ReturnType<typeof analytics4>> | null = null
  let gscErr = '', gaErr = ''
  if (cfg.account && cfg.gsc) gsc = await searchConsole(cfg.gsc).catch((e) => { gscErr = String(e.message || e); return null })
  if (cfg.account && cfg.ga4) ga = await analytics4(cfg.ga4).catch((e) => { gaErr = String(e.message || e); return null })

  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Analytics <small>Search Console · GA4</small></h1>
      {!ready && (
        <section className="wpw"><h2>Connect Google</h2>
          <div style={{ padding: '16px 22px', color: 'var(--av-mute)' }}>
            <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
              <li>In Google Cloud, create a service account, enable the <b>Search Console API</b> and <b>Google Analytics Data API</b>, and download a JSON key.</li>
              <li>Add the service account’s email as a user (Restricted / Viewer) in Search Console and in GA4 property access.</li>
              <li>Set <code>GOOGLE_SERVICE_ACCOUNT</code> (the JSON, raw or base64), <code>GSC_PROPERTY</code> (e.g. <code>sc-domain:aivastra.com</code>) and <code>GA4_PROPERTY_ID</code> in the server environment, then restart.</li>
            </ol>
          </div>
        </section>
      )}
      {cfg.gsc && (
        <section className="wpw an-sec"><h2>Search performance <small>last 28 days vs previous 28</small></h2>
          {gscErr ? <p className="an-err">Search Console: {gscErr}</p> : gsc && (
            <>
              <div className="an-kpis">
                <div><span>Clicks</span><b>{n(gsc.current.clicks)}</b>{delta(gsc.current.clicks, gsc.previous.clicks)}</div>
                <div><span>Impressions</span><b>{n(gsc.current.impressions)}</b>{delta(gsc.current.impressions, gsc.previous.impressions)}</div>
                <div><span>Avg. CTR</span><b>{(gsc.current.ctr * 100).toFixed(1)}%</b>{delta(gsc.current.ctr, gsc.previous.ctr)}</div>
                <div><span>Avg. position</span><b>{gsc.current.position.toFixed(1)}</b>{delta(gsc.current.position, gsc.previous.position, true)}</div>
              </div>
              <div className="an-cols">
                <table className="an-t"><thead><tr><th>Top queries</th><th>Clicks</th><th>Impr.</th><th>Pos.</th></tr></thead>
                  <tbody>{gsc.queries.map((r: any) => <tr key={r.keys[0]}><td>{r.keys[0]}</td><td>{n(r.clicks)}</td><td>{n(r.impressions)}</td><td>{r.position.toFixed(1)}</td></tr>)}</tbody></table>
                <table className="an-t"><thead><tr><th>Top pages</th><th>Clicks</th><th>Impr.</th><th>Pos.</th></tr></thead>
                  <tbody>{gsc.pages.map((r: any) => <tr key={r.keys[0]}><td><a href={r.keys[0]} target="_blank" rel="noreferrer">{r.keys[0].replace(/^https?:\/\/[^/]+/, '') || '/'}</a></td><td>{n(r.clicks)}</td><td>{n(r.impressions)}</td><td>{r.position.toFixed(1)}</td></tr>)}</tbody></table>
              </div>
            </>
          )}
        </section>
      )}
      {cfg.gsc && (
        <section className="wpw an-sec"><h2>Rank tracker <small>{rt.days ? `${rt.days} days of history · latest ${rt.latest}` : 'collects one Search Console snapshot per day (04:30)'}</small></h2>
          {rt.rows.length ? (
            <table className="an-t" style={{ margin: '0 22px 18px', width: 'calc(100% - 44px)' }}>
              <thead><tr><th>Keyword</th><th>Position</th><th>7 days</th><th>28 days</th><th>Clicks</th><th>Impr.</th></tr></thead>
              <tbody>{rt.rows.map((r) => <tr key={r.q}><td>{r.tracked && <b title="Focus keyword of a post" style={{ color: 'var(--av-a)' }}>★ </b>}{r.q}</td><td>{r.now!.toFixed(1)}</td><td>{move(r.now, r.d7)}</td><td>{move(r.now, r.d28)}</td><td>{n(r.clicks)}</td><td>{n(r.imp)}</td></tr>)}</tbody>
            </table>
          ) : <p style={{ padding: '14px 22px', margin: 0, color: 'var(--av-mute)' }}>No history yet. The first snapshot is stored the night after Google is connected.</p>}
          {rt.untracked.length > 0 && <p className="wpw-foot">Focus keywords with no impressions yet: {rt.untracked.join(', ')}</p>}
        </section>
      )}
      {cfg.ga4 && (
        <section className="wpw an-sec"><h2>Site traffic <small>GA4 · last 28 days vs previous 28</small></h2>
          {gaErr ? <p className="an-err">Analytics: {gaErr}</p> : ga && (
            <>
              <div className="an-kpis">
                <div><span>Users</span><b>{n(ga.current[0])}</b>{delta(ga.current[0], ga.previous[0])}</div>
                <div><span>Sessions</span><b>{n(ga.current[1])}</b>{delta(ga.current[1], ga.previous[1])}</div>
                <div><span>Page views</span><b>{n(ga.current[2])}</b>{delta(ga.current[2], ga.previous[2])}</div>
                <div><span>Engagement rate</span><b>{(ga.current[3] * 100).toFixed(1)}%</b>{delta(ga.current[3], ga.previous[3])}</div>
              </div>
              <table className="an-t" style={{ margin: '0 22px 18px', width: 'calc(100% - 44px)' }}><thead><tr><th>Top pages</th><th>Views</th><th>Users</th></tr></thead>
                <tbody>{ga.pages.map((p: any) => <tr key={p.path}><td>{p.path}</td><td>{n(p.views)}</td><td>{n(p.users)}</td></tr>)}</tbody></table>
            </>
          )}
        </section>
      )}
    </ToolView>
  )
}
