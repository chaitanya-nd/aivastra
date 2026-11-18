import type { CollectionConfig } from 'payload'
import { anyone, canEditContent } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content', useAsTitle: 'filename', defaultColumns: ['filename', 'alt', 'updatedAt'] },
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canEditContent },
  upload: {
    // Local disk for now. Swap to R2 via src/storage.ts (STORAGE_DRIVER=r2).
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4'],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 320, height: 200, position: 'centre' },
      { name: 'card', width: 720, height: 450, position: 'centre' },
      { name: 'hero', width: 1600, withoutEnlargement: true },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Alt text — required for SEO and accessibility.' },
    },
    { name: 'caption', type: 'text' },
  ],
}
