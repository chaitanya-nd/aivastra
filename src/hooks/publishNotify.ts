import type { CollectionAfterChangeHook } from 'payload'
import { outboundAllowed } from '@/lib/env'
import { absoluteUrl, getPath } from '@/lib/urls'

const NOTIFY = ['posts', 'guides', 'cases', 'updates', 'reviews']

/** Settings → Writing & publishing: one email the first time a document goes live. Never blocks the save. */
export const notifyOnPublish =
  (collection: string): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req }) => {
    if (!NOTIFY.includes(collection) || req.context?.disableRevalidate || !outboundAllowed) return doc
    if (doc?._status !== 'published' || previousDoc?._status === 'published' || doc.publishedNotified) return doc
    try {
      const ps: any = await req.payload.findGlobal({ slug: 'plugin-settings', depth: 0, req })
      if (!ps?.notifyOnPublish) return doc
      const to = String(ps.notifyOnPublishTo || process.env.ADMIN_EMAIL || '').split(',').map((s) => s.trim()).filter(Boolean)
      if (!to.length) return doc
      const url = absoluteUrl(getPath(collection, doc))
      const by = (req.user as any)?.name || (req.user as any)?.email || 'Scheduled publish'
      void req.payload.sendEmail({ to, subject: `[AI Vastra] Published: “${doc.title}”`, text: `“${doc.title}” is now live.\n\n${url}\n\nPublished by ${by}.` }).catch(() => {})
    } catch { /* never block publishing */ }
    return doc
  }
