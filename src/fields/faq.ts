import type { Field } from 'payload'

/** Replaces the ACF "accordion" repeater used on posts / pages / guides. */
export const faqFields: Field[] = [
  {
    name: 'faqTitle',
    type: 'text',
    label: 'FAQ section title',
  },
  {
    name: 'faq',
    type: 'array',
    label: 'FAQ items',
    labels: { singular: 'Question', plural: 'Questions' },
    admin: { description: 'Rendered as an accordion and emitted as FAQPage schema.' },
    fields: [
      { name: 'question', type: 'text', required: true },
      { name: 'answer', type: 'textarea', required: true },
    ],
  },
]
