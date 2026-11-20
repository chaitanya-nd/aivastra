import type { CollectionConfig } from 'payload'
import { canEditContent } from '@/access'
import { bodyFields } from '@/fields/body'

/** WordPress patterns / reusable blocks: saved HTML snippets editors insert from the classic editor ("Insert pattern"). */
export const Patterns: CollectionConfig = {
  slug: 'patterns',
  labels: { singular: 'Pattern', plural: 'Patterns' },
  admin: { group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'category', 'updatedAt'], description: 'Reusable content (CTAs, tables, callouts). Insert one into any post from the editor’s “Insert pattern” button.' },
  access: { read: canEditContent, create: canEditContent, update: canEditContent, delete: canEditContent },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'text', admin: { position: 'sidebar', description: 'e.g. Call to action, Table, Callout' } },
    ...bodyFields('Content').filter((f: any) => f.name === 'contentHtml'),
  ],
}
