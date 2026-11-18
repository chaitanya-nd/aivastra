import type { CollectionConfig } from 'payload'
import { canEditSEO } from '@/access'

/** Rank Math → 404 Monitor */
export const NotFoundLog: CollectionConfig = {
  slug: 'not-found-log',
  labels: { singular: '404 log entry', plural: '404 Monitor' },
  admin: { group: 'SEO & Tools', useAsTitle: 'uri', defaultColumns: ['uri', 'hits', 'referer', 'lastSeen'], listSearchableFields: ['uri'], description: 'Every URL visitors or bots requested that does not exist. Create a redirection for the useful ones.' },
  access: { read: canEditSEO, create: () => false, update: canEditSEO, delete: canEditSEO },
  defaultSort: '-lastSeen',
  fields: [
    { name: 'uri', type: 'text', required: true, unique: true, index: true, label: 'URI' },
    { name: 'hits', type: 'number', defaultValue: 1 },
    { name: 'referer', type: 'text', label: 'Referer' },
    { name: 'userAgent', type: 'text', label: 'User agent' },
    { name: 'lastSeen', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'redirectTo', type: 'text', label: 'Redirect to', admin: { description: 'Fill in and save — a 301 redirection is created automatically.' } },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, context }) => {
        if (!doc.redirectTo || context?.fromMonitor) return doc
        const exists = await req.payload.find({ collection: 'redirects', where: { from: { equals: doc.uri } }, limit: 1, depth: 0, req })
        if (!exists.totalDocs)
          await req.payload.create({ collection: 'redirects', data: { from: doc.uri, type: '301', to: { type: 'custom', url: doc.redirectTo } } as any, req, context: { disableRevalidate: true } })
        await req.payload.delete({ collection: 'not-found-log', id: doc.id, req, context: { fromMonitor: true } })
        return doc
      },
    ],
  },
}
