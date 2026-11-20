import type { CollectionConfig } from 'payload'
import { canEditSEO } from '@/access'

/** Rank tracker history (one row per day × query × page), filled by the rankSnapshot job. */
export const RankSnapshots: CollectionConfig = {
  slug: 'rank-snapshots',
  labels: { singular: 'Rank snapshot', plural: 'Rank snapshots' },
  admin: { group: 'SEO & Tools', hidden: true, useAsTitle: 'query' },
  access: { read: canEditSEO, create: () => false, update: () => false, delete: () => false },
  defaultSort: '-date',
  fields: [
    { name: 'date', type: 'text', index: true, required: true },
    { name: 'query', type: 'text', index: true },
    { name: 'page', type: 'text', index: true },
    { name: 'clicks', type: 'number' },
    { name: 'impressions', type: 'number' },
    { name: 'ctr', type: 'number' },
    { name: 'position', type: 'number' },
  ],
}
