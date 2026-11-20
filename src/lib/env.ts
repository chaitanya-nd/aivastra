/**
 * Deployment environment + the ONE rule that decides whether search engines may index this site.
 *
 * Fail-closed: crawlers are blocked unless EVERY condition below holds.
 *   1. SITE_ENV=production
 *   2. the site's host is in INDEXABLE_HOSTS (comma list, e.g. "aivastra.com,www.aivastra.com")
 *   3. "Block search engines" is explicitly OFF in Admin → Search visibility
 * Anything missing, unreadable or unknown counts as blocked. Used by meta robots, the X-Robots-Tag
 * header (src/proxy.ts), robots.txt, sitemap, feed and llms.txt.
 */
import { SITE_URL } from './urls'

export type SiteEnv = 'local' | 'staging' | 'production'
export const SITE_ENV: SiteEnv = (['local', 'staging', 'production'].includes(process.env.SITE_ENV || '') ? process.env.SITE_ENV : 'local') as SiteEnv
export const isProduction = SITE_ENV === 'production'

export const hostOf = (v?: string | null) => {
  if (!v) return ''
  try { return new URL(v.includes('://') ? v : `https://${v}`).host.toLowerCase() } catch { return '' }
}
export const INDEXABLE_HOSTS = (process.env.INDEXABLE_HOSTS || '').split(',').map((s) => hostOf(s.trim())).filter(Boolean)
export const SITE_HOST = hostOf(SITE_URL)
export const hostIndexable = (host?: string | null) => INDEXABLE_HOSTS.includes(hostOf(host))

type Settings = { blockIndexing?: boolean | null } | null | undefined

/** Human-readable reasons crawlers are blocked ([] = indexable). `host` defaults to the configured site host. */
export function blockReasons(settings?: Settings, host: string = SITE_HOST): string[] {
  const r: string[] = []
  if (!isProduction) r.push(`SITE_ENV is “${SITE_ENV}” — only “production” can be indexed`)
  if (!INDEXABLE_HOSTS.length) r.push('INDEXABLE_HOSTS is not set')
  else if (!hostIndexable(host)) r.push(`host “${host || 'unknown'}” is not in INDEXABLE_HOSTS`)
  if (settings?.blockIndexing !== false) r.push('“Block search engines” is ON (Admin → Search visibility)')
  return r
}
/** Effective "block all crawlers" decision. */
export const crawlersBlocked = (settings?: Settings, host?: string) => blockReasons(settings, host).length > 0

/** True only on the real, live host: analytics/tracking scripts load here and nowhere else. */
export const isLiveHost = isProduction && hostIndexable(SITE_HOST)
export const trackingAllowed = isLiveHost
/** Outbound side effects (form emails, Mailchimp). Test deploys can opt in with ALLOW_OUTBOUND=true. */
export const outboundAllowed = isLiveHost || process.env.ALLOW_OUTBOUND === 'true'

