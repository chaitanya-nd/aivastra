import { APIError, type CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '@/access'
import { slugify } from '@/lib/slug'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 12,
    // Limit login attempts (WordPress Limit Login Attempts / Wordfence): 5 failures lock the account for 15 minutes
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    // Application passwords: per-user API key for scripts and integrations (Authorization: users API-Key <key>)
    useAPIKey: true,
  },
  hooks: {
    // Unconfirmed self-registrations cannot sign in through any door (front end, admin or API)
    beforeLogin: [({ user }) => { if ((user as any)?.emailVerified === false) throw new APIError('Please confirm your email address first.', 403); return user }],
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
  },
  access: {
    // Subscribers (self-registered commenters) never get into the admin.
    admin: ({ req: { user } }) => isStaff(user),
    create: isAdmin,
    delete: isAdmin,
    // Staff see every user; a subscriber only sees their own account.
    read: ({ req: { user } }) => (isStaff(user) ? true : user ? { id: { equals: user.id } } : false),
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
        { label: 'Author — writes and publishes own posts', value: 'author' },
        { label: 'Contributor — writes own drafts, submits for review', value: 'contributor' },
        { label: 'Subscriber — can comment, no admin access', value: 'subscriber' },
      ],
      access: { update: ({ req: { user } }) => user?.role === 'admin' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      label: 'Author URL slug',
      admin: { position: 'sidebar', description: 'Author archive: /author/<slug>/. Filled from the name if empty.' },
      hooks: { beforeValidate: [({ value, data }) => value || (data?.name ? slugify(String(data.name)) : value)] },
    },
    { name: 'avatar', type: 'upload', relationTo: 'media', label: 'Author avatar' },
    // Two-factor login (TOTP) — managed in Users → Two-factor login, never exposed through the API
    { name: 'totpEnabled', type: 'checkbox', defaultValue: false, saveToJWT: true, admin: { readOnly: true, position: 'sidebar', description: 'Two-factor login. Manage it in Users → Two-factor login.' }, access: { update: () => false } },
    { name: 'totpSecret', type: 'text', hidden: true },
    { name: 'totpPending', type: 'text', hidden: true },
    { name: 'recoveryCodes', type: 'json', hidden: true },
    // Self-registered subscribers confirm their email first
    { name: 'emailVerified', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', readOnly: true }, access: { update: ({ req: { user } }) => (user as any)?.role === 'admin' } },
    { name: 'verifyToken', type: 'text', hidden: true },
    { name: 'jobTitle', type: 'text', label: 'Job title', admin: { description: 'Shown in the author box and in Person schema.' } },
    { name: 'bio', type: 'textarea', label: 'Biographical info', admin: { description: 'Shown in the author box under posts and on the author archive.' } },
    {
      type: 'row',
      fields: [
        { name: 'website', type: 'text', label: 'Website' },
        { name: 'twitter', type: 'text', label: 'X / Twitter URL' },
        { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
      ],
    },
  ],
}
