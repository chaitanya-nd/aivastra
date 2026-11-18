/**
 * Deployment environment. Only `production` is allowed to be indexed by search engines:
 * local / staging always get noindex (meta robots, X-Robots-Tag header, robots.txt Disallow),
 * regardless of the "Block all search engines" switch in Site settings.
 */
export type SiteEnv = 'local' | 'staging' | 'production'
export const SITE_ENV: SiteEnv = (['local', 'staging', 'production'].includes(process.env.SITE_ENV || '') ? process.env.SITE_ENV : 'local') as SiteEnv
export const isProduction = SITE_ENV === 'production'
/** Effective "block all crawlers" decision. */
export const crawlersBlocked = (settings?: { blockIndexing?: boolean | null }) => !isProduction || Boolean(settings?.blockIndexing)
