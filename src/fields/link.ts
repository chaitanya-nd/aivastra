import type { Field } from 'payload'

export const LINKABLE = ['pages', 'posts', 'guides', 'cases', 'updates', 'reviews', 'categories'] as const

export const linkField = (opts?: { name?: string; label?: boolean }): Field => ({
  name: opts?.name ?? 'link',
  type: 'group',
  admin: { hideGutter: true },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'custom',
          options: [
            { label: 'Internal page', value: 'reference' },
            { label: 'Custom URL', value: 'custom' },
          ],
          admin: { layout: 'horizontal', width: '50%' },
        },
        { name: 'newTab', type: 'checkbox', label: 'Open in new tab', admin: { width: '50%' } },
      ],
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: [...LINKABLE],
      admin: { condition: (_, s) => s?.type === 'reference' },
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL',
      admin: { condition: (_, s) => s?.type !== 'reference' },
    },
    ...(opts?.label === false
      ? []
      : ([{ name: 'label', type: 'text' }] as Field[])),
  ],
})
