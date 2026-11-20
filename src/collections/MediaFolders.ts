import type { CollectionConfig } from 'payload'
import { canEditContent } from '@/access'

/** Media Library folders (like the WordPress folders plugins): each media item can sit in one folder. */
export const MediaFolders: CollectionConfig = {
  slug: 'media-folders',
  labels: { singular: 'Media folder', plural: 'Media folders' },
  admin: { group: 'Content', useAsTitle: 'name', hidden: true },
  access: { read: canEditContent, create: canEditContent, update: canEditContent, delete: canEditContent },
  fields: [{ name: 'name', type: 'text', required: true, unique: true }],
}
