import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access'

/** Search visibility → change history. Written only by the Site settings hook. */
export const IndexingLog: CollectionConfig = {
  slug: 'indexing-log',
  labels: { singular: 'Indexing change', plural: 'Indexing changes' },
  admin: { group: 'SEO & Tools', hidden: true, useAsTitle: 'changedByEmail', defaultColumns: ['createdAt', 'indexingAllowed', 'changedByEmail', 'host'] },
  access: { read: isAdmin, create: () => false, update: () => false, delete: () => false },
  defaultSort: '-createdAt',
  fields: [
    { name: 'indexingAllowed', type: 'checkbox', label: 'Indexing allowed' },
    { name: 'changedBy', type: 'relationship', relationTo: 'users' },
    { name: 'changedByEmail', type: 'text' },
    { name: 'host', type: 'text' },
    { name: 'stillBlockedBy', type: 'text', label: 'Blocked by (at that moment)' },
  ],
}
