import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { tokenExpiration: 60 * 60 * 12 },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: isAdmin,
    delete: isAdmin,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user }, id }) => Boolean(user && (user.role === 'admin' || user.id === id)),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin — everything', value: 'admin' },
        { label: 'SEO manager — content + SEO + redirects', value: 'seo' },
        { label: 'Editor — content only', value: 'editor' },
      ],
      access: { update: ({ req: { user } }) => user?.role === 'admin' },
    },
    { name: 'avatar', type: 'upload', relationTo: 'media', label: 'Author avatar' },
    { name: 'bio', type: 'textarea' },
  ],
}
