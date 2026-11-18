import type { Field } from 'payload'

/** Featured image by URL — used until media storage (R2) is connected. */
export const externalCoverFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'featuredImageUrl', type: 'text', label: 'Featured image URL', admin: { width: '70%', description: 'Used when no Media image is selected.' } },
      { name: 'featuredImageAlt', type: 'text', label: 'Featured image alt', admin: { width: '30%' } },
    ],
  },
]
