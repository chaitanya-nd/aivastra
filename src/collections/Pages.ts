import { bodyFields } from '@/fields/body'
import { acfGroupFields, TEMPLATES, TEMPLATE_LABELS } from '@/acf/build'
import { pageBlocks } from '@/blocks/config'
import { contentCollection } from './factory'

export const Pages = contentCollection({
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  defaultColumns: ['title', 'slug', 'template', 'parent', '_status', 'updatedAt'],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          description: 'The text, headings, images and buttons of this page. Use the Visual / Text tabs inside each box.',
          fields: [{ name: 'acf', type: 'group', label: false, admin: { hideGutter: true }, fields: acfGroupFields }],
        },
        {
          label: 'Page body',
          description: 'Optional free-form body (use for legal pages such as Privacy / Terms).',
          fields: [...bodyFields('Body')],
        },
        {
          label: 'Page builder (optional)',
          description: 'Extra sections added below the template content. Drag to reorder.',
          fields: [
            { name: 'layout', type: 'blocks', blocks: pageBlocks, labels: { singular: 'Section', plural: 'Sections' } },
          ],
        },
        {
          label: 'Legacy data',
          description: 'Original WordPress values (read-only reference).',
          fields: [
            { name: 'legacyTemplate', type: 'text', admin: { readOnly: true, description: 'WordPress page template this page used.' } },
            { name: 'legacyFields', type: 'json', admin: { description: 'Original WordPress/ACF values.' } },
          ],
        },
      ],
    },
    { type: 'ui', name: 'pageContentCode', admin: { components: { Field: '/components/admin/wp/PageCodeEditor#PageCodeEditor' } } },
    { type: 'ui', name: 'pageCode', admin: { components: { Field: '/components/admin/wp/PageCode#PageCode' } } },
    {
      name: 'template',
      type: 'select',
      defaultValue: 'default',
      options: TEMPLATES.map((t) => ({ label: TEMPLATE_LABELS[t] ?? t, value: t })),
      admin: { position: 'sidebar', description: 'Page Attributes → Template. Decides the layout and which content fields show.' },
    },
    {
      name: 'menuOrder',
      type: 'number',
      label: 'Order',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Page Attributes → Order. Needs help? Use the Help tab above the screen title.' },
    },
    {
      name: 'showFooterForm',
      type: 'checkbox',
      label: 'Show footer contact form',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Replaces ACF "Inner Footer Form Section".' },
    },
    {
      name: 'hideFromSitemap',
      type: 'checkbox',
      admin: { position: 'sidebar' },
    },
  ],
})
