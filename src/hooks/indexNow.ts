import type { CollectionAfterChangeHook } from 'payload'
import { crawlersBlocked, isLiveHost } from '@/lib/env'
import { indexNowKey } from '@/lib/indexnow'
import { absoluteUrl, getPath, SITE_URL } from '@/lib/urls'

/** Rank Math "Instant Indexing": tell IndexNow (Bing, Yandex, Seznam, Naver) about new/updated URLs. Live site only. */
export const pingIndexNow =
  (collection: string): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req }) => {
    if (!isLiveHost || req.context?.disableRevalidate) return doc
    const live = doc?._status === 'published'
    const wasLive = previousDoc?._status === 'published'
    if (!live && !wasLive) return doc
    try {
      const [ps, ss]: any[] = await Promise.all([req.payload.findGlobal({ slug: 'plugin-settings', depth: 0, req }), req.payload.findGlobal({ slug: 'site-settings', depth: 0, req })])
      if (ps?.indexNowEnabled === false || crawlersBlocked(ss) || doc.meta?.noindex) return doc
      const urls = [absoluteUrl(getPath(collection, doc))]
      if (previousDoc?.slug && previousDoc.slug !== doc.slug) urls.push(absoluteUrl(getPath(collection, previousDoc)))
      const host = new URL(SITE_URL).host
      void fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host, key: indexNowKey(ps), keyLocation: `${SITE_URL}/${indexNowKey(ps)}.txt`, urlList: urls }),
      }).then((r) => req.payload.logger.info(`[indexnow] ${r.status} ${urls.join(' ')}`)).catch(() => {})
    } catch { /* never block publishing */ }
    return doc
  }
