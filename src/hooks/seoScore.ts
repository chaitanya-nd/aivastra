import type { CollectionBeforeChangeHook } from 'payload'
import { analyze, stripHtml } from '@/components/admin/seo/analyze'
import { getPath, SITE_URL } from '@/lib/urls'

const host = (() => { try { return new URL(SITE_URL).host } catch { return '' } })()

/** Same score as the editor's SEO box, computed on save so lists can show and filter by it. Null without a focus keyword. */
export function scoreOf(collection: string, d: any): number | null {
  const keyword = String(d?.meta?.focusKeyword || '').trim()
  if (!keyword) return null
  const path = getPath(collection, d)
  return analyze({
    keyword,
    seoTitle: String(d?.meta?.title || '') || (d?.title ? `${d.title} - AI Vastra` : ''),
    description: String(d?.meta?.description || '') || stripHtml(String(d?.excerpt || '')).slice(0, 160),
    slug: String(d?.slug || ''),
    url: `${SITE_URL}${path.endsWith('/') ? path : `${path}/`}`,
    html: String(d?.contentHtml || ''),
    showToc: d?.showToc !== false,
    siteHost: host,
  }).score
}

export const storeSeoScore = (collection: string): CollectionBeforeChangeHook => ({ data, originalDoc }) => {
  const merged = { ...(originalDoc || {}), ...data, meta: { ...(originalDoc?.meta || {}), ...(data?.meta || {}) } }
  data.seoScore = scoreOf(collection, merged)
  return data
}
