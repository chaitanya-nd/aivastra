import type { AdminViewServerProps } from 'payload'
import { INDEXABLE_HOSTS, SITE_ENV, blockReasons, isLiveHost, outboundAllowed, trackingAllowed } from '@/lib/env'
import { SITE_URL } from '@/lib/urls'
import { ToolView } from './ToolView'

type Check = { label: string; status: 'good' | 'recommended' | 'critical'; note: string }

/** Tools → Site Health (WordPress): status checks with what to do about each. */
export async function SiteHealth(props: AdminViewServerProps) {
  const { payload } = props.initPageResult.req
  const checks: Check[] = []
  const add = (label: string, ok: boolean, note: string, bad: 'recommended' | 'critical' = 'recommended') => checks.push({ label, status: ok ? 'good' : bad, note })
  const safe = async <T,>(f: () => Promise<T>, d: T) => { try { return await f() } catch { return d } }

  const dbOk = await safe(async () => { await payload.count({ collection: 'users' }); return true }, false)
  add('Database connection', dbOk, dbOk ? 'Postgres is reachable.' : 'Cannot query the database — check DATABASE_URL and that Postgres is running.', 'critical')
  add('Secret key', (process.env.PAYLOAD_SECRET || '').length >= 32, 'PAYLOAD_SECRET should be a random string of 32+ characters.', 'critical')
  add('Environment', true, `SITE_ENV=${SITE_ENV}. ${SITE_ENV === 'production' ? 'Search engines may index the site.' : 'Search engines are blocked (noindex + robots Disallow) until SITE_ENV=production.'}`)
  const ss: any = await safe<any>(() => payload.findGlobal({ slug: 'site-settings', depth: 0 }), {})
  const ps: any = await safe<any>(() => payload.findGlobal({ slug: 'plugin-settings', depth: 0 }), {})
  const reasons = blockReasons(ss)
  add('Search engine visibility', isLiveHost ? reasons.length === 0 : reasons.length > 0, reasons.length ? `Crawlers are blocked: ${reasons.join('; ')}.` : 'Crawlers are allowed (live host, switch OFF). Manage it in Search visibility.')
  add('Indexable host allowlist', INDEXABLE_HOSTS.length > 0, INDEXABLE_HOSTS.length ? `INDEXABLE_HOSTS=${INDEXABLE_HOSTS.join(', ')}` : 'INDEXABLE_HOSTS is empty — the site can never be indexed (safe for test deploys; set it on the live site).')
  add('Tracking & outbound mail isolation', isLiveHost || (!trackingAllowed && !outboundAllowed), isLiveHost ? 'Live host: analytics and real emails are active.' : 'Analytics scripts are off and form emails / Mailchimp are suppressed on this deployment.')
  add('HTTPS', SITE_ENV !== 'production' || SITE_URL.startsWith('https://'), `Site URL is ${SITE_URL}${SITE_ENV === 'production' && !SITE_URL.startsWith('https://') ? ' — production should use https.' : ''}`)
  add('Email delivery (SMTP)', !!process.env.SMTP_HOST, process.env.SMTP_HOST ? 'Form notifications are sent through SMTP.' : 'SMTP_HOST is empty — form notification emails are only logged to the console.')
  add('Mailchimp', !!process.env.MAILCHIMP_API_KEY && !!(ps?.mcAudienceId || process.env.MAILCHIMP_LIST_ID), 'Needs MAILCHIMP_API_KEY and an Audience ID (Settings → Plugin settings → Mailchimp).')
  add('Media storage', process.env.STORAGE === 'r2' ? !!process.env.R2_BUCKET : true, process.env.STORAGE === 'r2' ? 'Cloudflare R2 is configured.' : 'Media is stored locally / hotlinked. Move to R2 before going live.')
  add('XML sitemap', ps?.sitemapEnabled !== false, 'Served at /sitemap_index.xml (Rank Math style).')
  const noDesc = await safe(async () => (await payload.count({ collection: 'posts', where: { and: [{ _status: { equals: 'published' } }, { 'meta.description': { exists: false } }] } })).totalDocs, 0)
  add('Posts without a meta description', noDesc === 0, noDesc ? `${noDesc} published posts fall back to the excerpt/auto description. Rank Math → set one per post.` : 'All published posts have a description.')
  const n404 = await safe(async () => (await payload.count({ collection: 'not-found-log' as any })).totalDocs, 0)
  add('404 Monitor', n404 < 25, n404 ? `${n404} logged 404 URLs — review them in Rank Math → 404 Monitor and add redirections.` : 'No 404s logged.')
  const rules = await safe(async () => (await payload.count({ collection: 'redirects', where: { active: { not_equals: false } } })).totalDocs, 0)
  checks.push({ label: 'Redirections', status: 'good', note: `${rules} active redirection rule(s).` })
  add('Node.js version', Number(process.versions.node.split('.')[0]) >= 20, `Running Node ${process.versions.node}.`)

  const order = { critical: 0, recommended: 1, good: 2 } as const
  const sorted = [...checks].sort((a, b) => order[a.status] - order[b.status])
  const count = (s: Check['status']) => checks.filter((c) => c.status === s).length
  const color = { good: 'var(--av-ok)', recommended: 'var(--av-warn)', critical: 'var(--av-err)' }
  const word = { good: 'Good', recommended: 'Should be improved', critical: 'Critical' }
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Site Health</h1>
      <div className="wpd-grid">
        <section className="wpw"><h2>Status</h2>
          <p style={{ padding: '16px 20px', margin: 0, color: 'var(--av-mute)' }}>
            <b style={{ color: color.critical }}>{count('critical')} critical</b> · <b style={{ color: color.recommended }}>{count('recommended')} recommended</b> · <b style={{ color: color.good }}>{count('good')} good</b>
          </p>
        </section>
      </div>
      <section className="wpw" style={{ marginTop: 18 }}><h2>Checks</h2>
        <ul className="wpw-list" style={{ padding: '4px 0' }}>
          {sorted.map((c) => (
            <li key={c.label} style={{ display: 'grid', gridTemplateColumns: '220px 150px 1fr', gap: 12, alignItems: 'baseline' }}>
              <b>{c.label}</b><span style={{ color: color[c.status] }}>● {word[c.status]}</span><span style={{ color: 'var(--av-mute)' }}>{c.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </ToolView>
  )
}
