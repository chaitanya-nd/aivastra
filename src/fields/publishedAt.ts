import type { Field } from 'payload'

export const publishedAtField: Field = {
  name: 'publishedAt',
  type: 'date',
  admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' }, components: { Field: '/components/admin/wp/Hidden#Hidden' } },
  hooks: {
    beforeChange: [
      ({ siblingData, value }) => {
        if (siblingData?._status === 'published' && !value) return new Date()
        return value
      },
    ],
  },
}
