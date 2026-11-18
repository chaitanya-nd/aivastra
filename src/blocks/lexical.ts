import type { Block } from 'payload'

/** Inline image referenced by URL (no media storage yet). Used by the WordPress import. */
export const ExternalImage: Block = {
  slug: 'externalImage',
  interfaceName: 'ExternalImageBlock',
  labels: { singular: 'Image (URL)', plural: 'Images (URL)' },
  fields: [
    { name: 'url', type: 'text', required: true, admin: { description: 'Absolute image URL. Swap to the Media library once storage is live.' } },
    { name: 'alt', type: 'text' },
    { name: 'caption', type: 'text' },
  ],
}
