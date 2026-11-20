import type { AdminViewServerProps } from 'payload'
import { INDEXABLE_HOSTS, SITE_ENV, SITE_HOST, blockReasons, isLiveHost, outboundAllowed, trackingAllowed } from '@/lib/env'
import { IndexingToggle } from './IndexingToggle'
import { ToolView } from './ToolView'

const fmt = (d?: string) => (d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '')

/** Admin → Search visibility: the single place to see and control whether search engines may index this site. */
export async function SearchVisibility(props: AdminViewServerProps) {
  const { req } = props.initPageResult
  const { payload, user } = req
  const isAdmin = (user as any)?.role === 'admin'
  const settings: any = await payload.findGlobal({ slug: 'site-settings', depth: 0 }).catch(() => undefined)
  const reasons = blockReasons(settings)
  const blocked = reasons.length > 0
  const switchOn = settings?.blockIndexing !== false
  const log = await payload.find({ collection: 'indexing-log', sort: '-createdAt', limit: 8, depth: 0, overrideAccess: true }).catch(() => ({ docs: [] as any[] }))
  const layers: [string, boolean, string][] = [
    ['Environment', SITE_ENV === 'production', `SITE_ENV=${SITE_ENV}`],
    ['Domain allowlist', INDEXABLE_HOSTS.includes(SITE_HOST), INDEXABLE_HOSTS.length ? `${SITE_HOST} ${INDEXABLE_HOSTS.includes(SITE_HOST) ? 'is' : 'is not'} in INDEXABLE_HOSTS (${INDEXABLE_HOSTS.join(', ')})` : 'INDEXABLE_HOSTS is empty'],
    ['Admin switch', !switchOn, switchOn ? 'Block search engines is ON' : 'Block search engines is OFF'],
  ]
  const extras: [string, boolean, string][] = [
    ['Analytics & tracking scripts', trackingAllowed, trackingAllowed ? 'Loaded (live host)' : 'Not loaded on this deployment'],
    ['Form emails & Mailchimp', outboundAllowed, outboundAllowed ? 'Sent to real recipients' : 'Suppressed on this deployment'],
  ]
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Search visibility <small>Indexing control</small></h1>
      <section className={`sv-state ${blocked ? 'blocked' : 'open'}`}>
        <div>
          <span className="sv-dot" />
          <h2>{blocked ? 'Search engines are blocked' : 'Search engines can index this site'}</h2>
          <p>{blocked ? 'Every page, the sitemap, the feed and llms.txt tell crawlers to stay away.' : 'Pages are indexable and the sitemap is published.'}</p>
        </div>
        {blocked && <ul>{reasons.map((r) => <li key={r}>{r}</li>)}</ul>}
      </section>
      <div className="wpd-grid" style={{ marginTop: 20 }}>
        <section className="wpw"><h2>Control</h2>
          <div style={{ padding: '16px 20px' }}><IndexingToggle blocked={switchOn} canEdit={isAdmin} lockedBy={blocked && !switchOn ? reasons : []} /></div>
        </section>
        <section className="wpw"><h2>All three must pass to allow indexing</h2>
          <ul className="sv-checks">{layers.map(([l, ok, n]) => <li key={l} className={ok ? 'ok' : 'no'}><b>{l}</b><span>{n}</span></li>)}</ul>
        </section>
        <section className="wpw"><h2>This deployment</h2>
          <ul className="sv-checks">{extras.map(([l, ok, n]) => <li key={l} className={ok ? 'ok' : 'no'}><b>{l}</b><span>{n}</span></li>)}</ul>
          <p className="wpw-foot">{isLiveHost ? 'This is the live host.' : 'Not the live host — safe for testing.'}</p>
        </section>
        <section className="wpw"><h2>Change history</h2>
          <ul className="wpw-list" style={{ padding: '4px 0' }}>
            {log.docs.map((d: any) => <li key={d.id}><span className="d">{fmt(d.createdAt)}</span><span style={{ flex: 1 }}>{d.indexingAllowed ? 'Indexing allowed' : 'Indexing blocked'} · {d.changedByEmail}</span></li>)}
            {log.docs.length === 0 && <li><span style={{ color: 'var(--av-mute)' }}>No changes recorded yet.</span></li>}
          </ul>
        </section>
      </div>
    </ToolView>
  )
}
