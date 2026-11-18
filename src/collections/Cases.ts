import { bodyFields } from '@/fields/body'
import { externalCoverFields } from '@/fields/cover'
import { faqFields } from '@/fields/faq'
import { contentCollection } from './factory'

export const Cases = contentCollection({
  slug: 'cases',
  labels: { singular: 'Case study', plural: 'Case studies' },
  defaultColumns: ['title', 'slug', 'client', 'category', '_status'],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'client', type: 'text' },
            { name: 'studyParagraph', type: 'textarea', label: 'Banner paragraph', admin: { description: 'Shown under the title (old ACF "case_studies_paragraph").' } },
            {
              name: 'studyTop',
              type: 'array',
              label: 'Top facts (Industry, Goal, …)',
              labels: { singular: 'Fact', plural: 'Facts' },
              fields: [{ name: 'title', type: 'text', required: true }, { name: 'subtitle', type: 'text' }],
            },
            { name: 'excerpt', type: 'textarea' },
            { name: 'featuredImage', type: 'upload', relationTo: 'media' },
            ...externalCoverFields,
            {
              name: 'metrics',
              type: 'array',
              labels: { singular: 'Metric', plural: 'Metrics' },
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
            ...bodyFields(),
          ],
        },
        { label: 'FAQ', fields: faqFields },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'section-categories',
      filterOptions: { kind: { equals: 'case' } },
      admin: { position: 'sidebar' },
    },
  ],
})
