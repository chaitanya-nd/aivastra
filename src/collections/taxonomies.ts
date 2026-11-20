import type { CollectionConfig } from 'payload'
import { anyone, can } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { slugChangeRedirect } from '@/hooks/slugRedirect'

const base = (slug: string, labels: { singular: string; plural: string }, uniqueSlug = true): CollectionConfig => ({
  slug,
  labels,
  admin: { useAsTitle: 'name', group: 'Taxonomy', defaultColumns: ['name', 'slug', 'updatedAt'] },
  access: { read: anyone, create: can('manage_categories'), update: can('manage_categories'), delete: can('manage_categories') },
  hooks: {
    afterChange: [slugChangeRedirect(slug), revalidateAfterChange(slug)],
    afterDelete: [revalidateAfterDelete(slug)],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name', uniqueSlug),
    { name: 'description', type: 'textarea' },
  ],
})

export const Categories: CollectionConfig = (() => {
  const c = base('categories', { singular: 'Category', plural: 'Categories' })
  c.fields.push({
    name: 'parent',
    type: 'relationship',
    relationTo: 'categories',
    filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    admin: { position: 'sidebar' },
  })
  return c
})()

export const Tags: CollectionConfig = base('tags', { singular: 'Tag', plural: 'Tags' })

/** Guide / Case / Update categories (WP: guide_category, case_category, update_category). */
export const SectionCategories: CollectionConfig = (() => {
  const c = base('section-categories', {
    singular: 'Section category',
    plural: 'Section categories',
  }, false) // slug only unique per kind (guide/update both have "getting-started")
  c.fields.push({
    name: 'kind',
    type: 'select',
    required: true,
    defaultValue: 'guide',
    options: [
      { label: 'Guide category', value: 'guide' },
      { label: 'Case study category', value: 'case' },
      { label: 'Product update category', value: 'update' },
    ],
    admin: { position: 'sidebar' },
  })
  return c
})()
