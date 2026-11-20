import { createSign } from 'node:crypto'

/**
 * Google Search Console + Analytics 4 (Rank Math "Analytics" / Site Kit), read-only, via a service account.
 *   GOOGLE_SERVICE_ACCOUNT  JSON key (raw or base64) of a service account added as a user to both properties
 *   GSC_PROPERTY            e.g. "sc-domain:aivastra.com" or "https://aivastra.com/"
 *   GA4_PROPERTY_ID         numeric GA4 property id
 */
type SA = { client_email: string; private_key: string }
const SCOPES = 'https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/analytics.readonly'
const b64url = (b: Buffer | string) => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')

function account(): SA | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT || ''
  if (!raw) return null
  try { return JSON.parse(raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8')) } catch { return null }
}
export const googleConfig = () => ({ account: account(), gsc: process.env.GSC_PROPERTY || '', ga4: process.env.GA4_PROPERTY_ID || '' })

let token: { value: string; exp: number } | null = null
async function accessToken(sa: SA) {
  if (token && token.exp > Date.now() + 60_000) return token.value
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify({ iss: sa.client_email, scope: SCOPES, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }))}`
  const sig = createSign('RSA-SHA256').update(unsigned).sign(sa.private_key)
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${b64url(sig)}` }) })
  const j: any = await r.json()
  if (!r.ok) throw new Error(j.error_description || j.error || `token ${r.status}`)
  token = { value: j.access_token, exp: Date.now() + j.expires_in * 1000 }
  return token.value
}

const cache = new Map<string, { at: number; data: any }>()
async function call(url: string, body: any) {
  const key = url + JSON.stringify(body)
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < 3600_000) return hit.data
  const sa = account()
  if (!sa) throw new Error('GOOGLE_SERVICE_ACCOUNT is not set')
  const r = await fetch(url, { method: 'POST', headers: { authorization: `Bearer ${await accessToken(sa)}`, 'content-type': 'application/json' }, body: JSON.stringify(body) })
  const j: any = await r.json()
  if (!r.ok) throw new Error(j.error?.message || `Google API ${r.status}`)
  cache.set(key, { at: Date.now(), data: j })
  return j
}

const day = (offset: number) => new Date(Date.now() - offset * 86400_000).toISOString().slice(0, 10)

/** Search Console: totals for the last 28 days (GSC data lags ~3 days) and the 28 before, plus top queries / pages. */
export async function searchConsole(property: string) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`
  const range = (a: number, b: number) => ({ startDate: day(a), endDate: day(b) })
  const [cur, prev, queries, pages] = await Promise.all([
    call(url, { ...range(30, 3) }),
    call(url, { ...range(58, 31) }),
    call(url, { ...range(30, 3), dimensions: ['query'], rowLimit: 15 }),
    call(url, { ...range(30, 3), dimensions: ['page'], rowLimit: 15 }),
  ])
  const t = (x: any) => x.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 }
  return { current: t(cur), previous: t(prev), queries: queries.rows ?? [], pages: pages.rows ?? [] }
}

/** GA4: users, sessions, views for 28 days vs the previous 28, and top pages. */
export async function analytics4(propertyId: string) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`
  const metrics = [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'engagementRate' }]
  const [totals, pages] = await Promise.all([
    call(url, { dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday', name: 'current' }, { startDate: '56daysAgo', endDate: '29daysAgo', name: 'previous' }], metrics }),
    call(url, { dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }], dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }], limit: 15, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }] }),
  ])
  const pick = (name: string) => (totals.rows ?? []).find((r: any) => r.dimensionValues?.some((d: any) => d.value === name))?.metricValues?.map((v: any) => Number(v.value)) ?? [0, 0, 0, 0]
  return { current: pick('current'), previous: pick('previous'), pages: (pages.rows ?? []).map((r: any) => ({ path: r.dimensionValues[0].value, views: Number(r.metricValues[0].value), users: Number(r.metricValues[1].value) })) }
}

/** One day of query × page rows (the day GSC has finalised, ~3 days ago). Up to 1000 rows. */
export async function searchConsoleDaily(property: string) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`
  const date = day(3)
  const j = await call(url, { startDate: date, endDate: date, dimensions: ['query', 'page'], rowLimit: 1000 })
  return { date, rows: (j.rows ?? []) as { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[] }
}
