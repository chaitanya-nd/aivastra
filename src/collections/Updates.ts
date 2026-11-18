import { bodyFields } from '@/fields/body'
import { externalCoverFields } from '@/fields/cover'
import { contentCollection } from './factory'

export const Updates = contentCollection({
  slug: 'updates',
  labels: { singular: 'Product update', plural: 'Product updates' },
  defaultColumns: ['title', 'slug', 'version', 'releaseDate', '_status'],
  fields: [
    { name: 'excerpt', type: 'textarea' },
    ...externalCoverFields,
    ...bodyFields(),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'section-categories',
      filterOptions: { kind: { equals: 'update' } },
      admin: { position: 'sidebar' },
    },
    { name: 'version', type: 'text', admin: { position: 'sidebar', description: 'e.g. v2.4' } },
    { name: 'releaseDate', type: 'date', admin: { position: 'sidebar' } },
  ],
})
