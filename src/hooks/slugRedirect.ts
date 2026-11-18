import type { CollectionAfterChangeHook } from 'payload'
import { getPath, withTrailingSlash } from '@/lib/urls'

/**
 * SEO safety net: when a published document's slug (and therefore URL)
 * changes, automatically create a 301 from the old path to the new one.
 */
export const slugChangeRedirect =
  (collection: string): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req, operation }) => {
    if (operation !== 'update' || !previousDoc?.slug || previousDoc.slug === doc.slug) return doc
    if (previousDoc._status && previousDoc._status !== 'published') return doc
    if (doc._status && doc._status !== 'published') return doc

    const from = getPath(collection, previousDoc)
    const to = getPath(collection, doc)
    if (from === to || from === '/') return doc

    try {
      const existing = await req.payload.find({
        collection: 'redirects',
        where: { from: { equals: from } },
        limit: 1,
        depth: 0,
        req,
      })
      if (existing.totalDocs === 0) {
        await req.payload.create({
          collection: 'redirects',
          data: {
            from,
            type: '301',
            to: { type: 'reference', reference: { relationTo: collection as any, value: doc.id } },
          } as any,
          req,
          context: { disableRevalidate: true },
        })
        req.payload.logger.info(`Auto 301: ${withTrailingSlash(from)} → ${withTrailingSlash(to)}`)
      }
    } catch (err) {
      req.payload.logger.error({ err }, 'Failed to create slug-change redirect')
    }
    return doc
  }
