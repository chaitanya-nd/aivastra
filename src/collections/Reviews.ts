import { bodyFields } from '@/fields/body'
import { contentCollection } from './factory'

export const Reviews = contentCollection({
  slug: 'reviews',
  labels: { singular: 'Review', plural: 'Reviews' },
  defaultColumns: ['title', 'platform', 'rating', '_status'],
  fields: [
    { name: 'reviewer', type: 'text' },
    { name: 'reviewerRole', type: 'text' },
    { name: 'rating', type: 'number', min: 1, max: 5 },
    {
      name: 'platform',
      type: 'select',
      defaultValue: 'self',
      options: ['self', 'google', 'shopify', 'g2', 'capterra', 'trustpilot', 'facebook', 'other'].map(
        (v) => ({ label: v, value: v }),
      ),
    },
    { name: 'sourceUrl', type: 'text' },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'madeForYouItems',
      type: 'array',
      label: 'Shopify "Made for you if…" carousel cards',
      labels: { singular: 'Card', plural: 'Cards' },
      admin: { description: 'Each card appears in the Shopify page carousel (old ACF "Review Details").' },
      fields: [
        { name: 'star', type: 'text', label: 'Star image URL' },
        { name: 'text', type: 'textarea', label: 'Review text (HTML)' },
        { name: 'profile', type: 'text', label: 'Profile image URL' },
        { name: 'author', type: 'textarea', label: 'Author / label (HTML)' },
      ],
    },
    ...bodyFields(),
  ],
})
