import { bodyFields } from '@/fields/body'
import { externalCoverFields } from '@/fields/cover'
import { faqFields } from '@/fields/faq'
import { contentCollection } from './factory'

export const Guides = contentCollection({
  slug: 'guides',
  labels: { singular: 'Guide', plural: 'Guides' },
  defaultColumns: ['title', 'slug', 'category', 'order', '_status'],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'excerpt', type: 'textarea' },
            { name: 'featuredImage', type: 'upload', relationTo: 'media' },
            ...externalCoverFields,
            ...bodyFields(),
          ],
        },
        { label: 'FAQ', fields: faqFields },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'section-categories',
      filterOptions: { kind: { equals: 'guide' } },
      admin: { position: 'sidebar' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
})
