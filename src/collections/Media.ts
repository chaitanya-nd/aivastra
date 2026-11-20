import type { CollectionConfig } from 'payload'
import { anyone, can } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    components: { beforeListTable: ['/components/admin/wp/MediaLibrary#MediaLibrary'] },
  },
  hooks: {
    // Image SEO (Rank Math): fill a missing alt text from the file name, e.g. "ai-saree-draping.webp" → "ai saree draping".
    beforeValidate: [
      ({ data, req }) => {
        if (data && !String(data.alt || '').trim()) {
          const name = String(data.filename || (req as any)?.file?.name || '').replace(/\.[a-z0-9]+$/i, '').replace(/-\d+x\d+$/, '')
          if (name) data.alt = name.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
        }
        return data
      },
    ],
    // Records imported from WordPress keep pointing at the live file until R2 exists.
    afterRead: [
      ({ doc }) => {
        if (doc?.externalUrl) {
          doc.url = doc.externalUrl
          doc.thumbnailURL = doc.externalUrl
        }
        return doc
      },
    ],
  },
  access: { read: anyone, create: can('upload_files'), update: can('upload_files'), delete: can('upload_files') },
  upload: {
    // Local disk for now. Swap to R2 via src/storage.ts (STORAGE_DRIVER=r2).
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4'],
    filesRequiredOnCreate: false,
    adminThumbnail: ({ doc }) => (doc as any).externalUrl || (doc as any).sizes?.thumbnail?.url || (doc as any).url || null,
    focalPoint: true,
    // Image editing in the admin: crop and focal point (works on uploaded files, not on remote links to the old site)
    crop: true,
    imageSizes: [
      { name: 'thumbnail', width: 320, height: 200, position: 'centre' },
      { name: 'medium', width: 768, withoutEnlargement: true },
      { name: 'large', width: 1024, withoutEnlargement: true },
      { name: 'card', width: 720, height: 450, position: 'centre' },
      { name: 'hero', width: 1600, withoutEnlargement: true },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      // Not "required" in the form: an empty alt is filled from the file name on save (hook above).
      admin: { description: 'Alt text — required for SEO and accessibility. Filled from the file name if left empty.' },
    },
    { name: 'caption', type: 'text' },
    { name: 'folder', type: 'relationship', relationTo: 'media-folders', label: 'Folder', index: true, admin: { position: 'sidebar' } },
    { name: 'externalUrl', type: 'text', admin: { readOnly: true, position: 'sidebar', description: 'Remote file this record points at (WordPress import).' } },
  ],
}
