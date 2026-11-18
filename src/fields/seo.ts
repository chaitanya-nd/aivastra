import type { Field } from 'payload'
import { seoFieldAccess } from '@/access'

/**
 * Extra Rank Math-style fields appended to the SEO plugin's `meta` group
 * (title / description / image / preview come from @payloadcms/plugin-seo).
 */
export const extraSeoFields: Field[] = [
  {
    name: 'focusKeyword',
    type: 'text',
    label: 'Focus keyword',
    admin: { description: 'Primary keyword this page targets (used by the SEO audit).' },
  },
  {
    name: 'canonicalUrl',
    type: 'text',
    label: 'Canonical URL',
    admin: { description: 'Leave empty to use the page URL. Set only to point elsewhere.' },
  },
  {
    type: 'row',
    fields: [
      { name: 'noindex', type: 'checkbox', label: 'noindex', defaultValue: false },
      { name: 'nofollow', type: 'checkbox', label: 'nofollow', defaultValue: false },
    ],
  },
  {
    name: 'schemaType',
    type: 'select',
    label: 'Schema type',
    defaultValue: 'auto',
    options: [
      { label: 'Automatic (by content type)', value: 'auto' },
      { label: 'Article', value: 'Article' },
      { label: 'BlogPosting', value: 'BlogPosting' },
      { label: 'WebPage', value: 'WebPage' },
      { label: 'FAQPage', value: 'FAQPage' },
      { label: 'Product / SoftwareApplication', value: 'SoftwareApplication' },
      { label: 'None', value: 'none' },
    ],
  },
  {
    name: 'customSchema',
    type: 'code',
    label: 'Custom JSON-LD',
    admin: { language: 'html', description: 'Optional raw <script type="application/ld+json"> (kept from the old Schema plugin).' },
  },
  {
    name: 'ogTitle',
    type: 'text',
    label: 'Social title (OG/Twitter)',
    admin: { description: 'Optional. Falls back to the meta title.' },
  },
  {
    name: 'ogDescription',
    type: 'textarea',
    label: 'Social description',
    admin: { description: 'Optional. Falls back to the meta description.' },
  },
].map((f) => ({ ...f, access: { update: seoFieldAccess } })) as Field[]
