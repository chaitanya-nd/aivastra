import type { CollectionConfig } from 'payload'
import { canEditSEO } from '@/access'
import { bustAutoLinks } from '@/lib/autoLinks'
import { revalidatePath } from 'next/cache'

/** Auto internal linking: the first mention of a keyword in any article body links to the given URL (render-time, content is untouched). */
export const AutoLinks: CollectionConfig = {
  slug: 'auto-links',
  labels: { singular: 'Auto link', plural: 'Auto links' },
  admin: { group: 'SEO & Tools', useAsTitle: 'keyword', defaultColumns: ['keyword', 'url', 'active'], description: 'The first unlinked mention of each keyword in a post, guide or case study becomes a link. Never links a page to itself, inside headings or existing links.' },
  access: { read: () => true, create: canEditSEO, update: canEditSEO, delete: canEditSEO },
  hooks: { afterChange: [({ doc }) => { bustAutoLinks(); try { revalidatePath('/', 'layout') } catch { /* outside a request */ } return doc }], afterDelete: [() => bustAutoLinks()] },
  fields: [
    { name: 'keyword', type: 'text', required: true, admin: { description: 'Comma-separate variants: "virtual try-on, virtual tryon"' } },
    { name: 'url', type: 'text', required: true, admin: { description: 'Path like /virtual-try-on/ or a full URL' } },
    { type: 'row', fields: [
      { name: 'active', type: 'checkbox', defaultValue: true },
      { name: 'caseSensitive', type: 'checkbox', defaultValue: false },
      { name: 'newTab', type: 'checkbox', defaultValue: false },
      { name: 'nofollow', type: 'checkbox', defaultValue: false },
    ] },
    { name: 'maxPerPage', type: 'number', defaultValue: 1, min: 1, max: 5, label: 'Links per page' },
  ],
}
