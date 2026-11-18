import type { Block, Field } from 'payload'
import { linkField } from '@/fields/link'

const cta = (name = 'cta'): Field => linkField({ name })

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imageUrl', type: 'text', label: 'Image URL (until storage)' },
    { name: 'align', type: 'select', defaultValue: 'left', options: ['left', 'center'] },
    { name: 'buttons', type: 'array', maxRows: 3, fields: [cta('link'), { name: 'style', type: 'select', defaultValue: 'primary', options: ['primary', 'secondary'] }] },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Rich text', plural: 'Rich text' },
  fields: [
    { name: 'content', type: 'richText', required: true },
    { name: 'width', type: 'select', defaultValue: 'narrow', options: ['narrow', 'wide'] },
  ],
}

export const ImageText: Block = {
  slug: 'imageText',
  interfaceName: 'ImageTextBlock',
  labels: { singular: 'Image + text', plural: 'Image + text' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'imagePosition', type: 'select', defaultValue: 'right', options: ['left', 'right'] },
    { name: 'bullets', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    cta(),
  ],
}

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: { singular: 'Feature grid', plural: 'Feature grids' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    { name: 'columns', type: 'select', defaultValue: '3', options: ['2', '3', '4'] },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'imageUrl', type: 'text' },
      ],
    },
  ],
}

export const Steps: Block = {
  slug: 'steps',
  interfaceName: 'StepsBlock',
  labels: { singular: 'Steps / process', plural: 'Steps' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const TabsBlock: Block = {
  slug: 'tabs',
  interfaceName: 'TabsBlock',
  labels: { singular: 'Tabs (e.g. fashion categories)', plural: 'Tabs' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'tabs',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'heading', type: 'text' },
        { name: 'content', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        cta(),
      ],
    },
  ],
}

export const FAQBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: { singular: 'FAQ accordion', plural: 'FAQ accordions' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', defaultValue: 'Frequently asked questions' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const Pricing: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  labels: { singular: 'Pricing plans', plural: 'Pricing plans' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'plans',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'text', required: true },
        { name: 'period', type: 'text', defaultValue: '/month' },
        { name: 'description', type: 'textarea' },
        { name: 'highlighted', type: 'checkbox' },
        { name: 'features', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
        cta(),
      ],
    },
  ],
}

export const CTA: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    cta(),
    { name: 'tone', type: 'select', defaultValue: 'dark', options: ['dark', 'light', 'brand'] },
  ],
}

export const PostFeed: Block = {
  slug: 'postFeed',
  interfaceName: 'PostFeedBlock',
  labels: { singular: 'Content feed', plural: 'Content feeds' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'posts',
      options: [
        { label: 'Blog posts', value: 'posts' },
        { label: 'Guides', value: 'guides' },
        { label: 'Case studies', value: 'cases' },
        { label: 'Product updates', value: 'updates' },
        { label: 'Reviews', value: 'reviews' },
      ],
    },
    { name: 'limit', type: 'number', defaultValue: 9, min: 1, max: 60 },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { description: 'Blog posts only. Leave empty for all.', condition: (_, s) => s?.source === 'posts' },
    },
    { name: 'paginate', type: 'checkbox', defaultValue: true, label: 'Show pagination (?page=N)' },
  ],
}

export const ContactBlock: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  labels: { singular: 'Contact form', plural: 'Contact forms' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'text', type: 'textarea' },
    { name: 'form', type: 'relationship', relationTo: 'forms', required: true },
    {
      name: 'details',
      type: 'array',
      labels: { singular: 'Contact detail', plural: 'Contact details' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}

export const HtmlBlock: Block = {
  slug: 'html',
  interfaceName: 'HtmlBlock',
  labels: { singular: 'Custom HTML', plural: 'Custom HTML' },
  fields: [
    { name: 'label', type: 'text', admin: { description: 'Internal name (e.g. the old ACF field).' } },
    { name: 'html', type: 'code', required: true, admin: { language: 'html' } },
  ],
}

export const pageBlocks: Block[] = [
  Hero, RichTextBlock, ImageText, FeatureGrid, Steps, TabsBlock, FAQBlock,
  Testimonials, Pricing, CTA, PostFeed, ContactBlock, HtmlBlock,
]
