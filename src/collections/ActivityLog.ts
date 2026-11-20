import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access'

/** Site-wide audit trail (like WP Activity Log / Simple History). Written only by src/hooks/activity.ts. */
export const ActivityLog: CollectionConfig = {
  slug: 'activity-log',
  labels: { singular: 'Activity', plural: 'Activity log' },
  admin: { group: 'Settings', useAsTitle: 'summary', defaultColumns: ['createdAt', 'userEmail', 'action', 'summary'], listSearchableFields: ['summary', 'userEmail', 'target'], description: 'Who created, updated, published, trashed or deleted what. Kept for 180 days.' },
  access: { read: isAdmin, create: () => false, update: () => false, delete: isAdmin },
  defaultSort: '-createdAt',
  fields: [
    { name: 'action', type: 'select', index: true, options: ['create', 'update', 'publish', 'unpublish', 'trash', 'restore', 'delete', 'login', 'settings'].map((v) => ({ label: v[0].toUpperCase() + v.slice(1), value: v })) },
    { name: 'summary', type: 'text' },
    { name: 'target', type: 'text', index: true, label: 'Collection / global' },
    { name: 'targetId', type: 'text' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'userEmail', type: 'text', label: 'User' },
    { name: 'ip', type: 'text' },
  ],
}
