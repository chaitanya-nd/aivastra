import type { GlobalAfterChangeHook } from 'payload'
import { blockReasons } from '@/lib/env'

/** Audit trail: who switched search-engine indexing on/off, when, and what was blocking it at that moment. */
export const logIndexingChange: GlobalAfterChangeHook = async ({ doc, previousDoc, req }) => {
  if (Boolean(doc?.blockIndexing) === Boolean(previousDoc?.blockIndexing)) return doc
  try {
    await req.payload.create({
      collection: 'indexing-log',
      overrideAccess: true,
      req,
      data: { indexingAllowed: doc.blockIndexing === false, changedBy: (req.user as any)?.id ?? null, changedByEmail: (req.user as any)?.email ?? 'system', host: req.headers?.get?.('host') ?? '', stillBlockedBy: blockReasons(doc).join('; ') || 'nothing — site is indexable' },
    })
  } catch { /* logging must never block a save */ }
  return doc
}
