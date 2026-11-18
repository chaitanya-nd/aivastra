import type { Field } from 'payload'
import { formatSlug } from '@/lib/slug'

/** WordPress-style editable slug, auto-filled from the title when empty. */
export const slugField = (from = 'title', unique = true, collection?: string): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  required: true,
  unique,
  admin: collection
    ? { components: { Field: { path: '/components/admin/wp/Permalink#Permalink', clientProps: { collection } } } }
    : { position: 'sidebar', description: 'URL slug. Changing it auto-creates a 301 from the old URL.' },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return formatSlug(value)
        const src = data?.[from]
        return typeof src === 'string' ? formatSlug(src) : value
      },
    ],
  },
})
