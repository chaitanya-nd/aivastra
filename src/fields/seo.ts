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
    admin: { description: 'Primary keyword this page targets — scored live in the SEO analysis above.' },
  },
  {
    name: 'secondaryKeywords',
    type: 'text',
    label: 'Secondary keywords',
    admin: { description: 'Optional, comma separated. Each one is checked in the analysis.' },
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
      { label: 'Blog post', value: 'BlogPosting' },
      { label: 'News article', value: 'NewsArticle' },
      { label: 'Web page', value: 'WebPage' },
      { label: 'FAQ page', value: 'FAQPage' },
      { label: 'How-to', value: 'HowTo' },
      { label: 'Product', value: 'Product' },
      { label: 'Software application', value: 'SoftwareApplication' },
      { label: 'Course', value: 'Course' },
      { label: 'Event', value: 'Event' },
      { label: 'Video', value: 'VideoObject' },
      { label: 'None', value: 'none' },
    ],
  },
  {
    name: 'schemaData',
    type: 'group',
    label: 'Schema details',
    admin: { condition: (_: any, s: any) => ['HowTo', 'Product', 'SoftwareApplication', 'Course', 'Event', 'VideoObject'].includes(s?.schemaType), description: 'Fill in what applies to the selected schema type. Empty fields are left out.' },
    fields: [
      { name: 'name', type: 'text', label: 'Name (defaults to the title)' },
      { name: 'description', type: 'textarea', label: 'Description (defaults to the meta description)' },
      // HowTo
      { name: 'totalTime', type: 'text', label: 'Total time (ISO 8601, e.g. PT30M)', admin: { condition: (_: any, s: any) => s?.schemaType === 'HowTo' } },
      { name: 'steps', type: 'array', label: 'Steps', admin: { condition: (_: any, s: any) => s?.schemaType === 'HowTo' }, fields: [{ name: 'name', type: 'text', required: true }, { name: 'text', type: 'textarea' }, { name: 'image', type: 'text', label: 'Image URL' }] },
      // Product / Software
      { type: 'row', admin: { condition: (_: any, s: any) => ['Product', 'SoftwareApplication', 'Course', 'Event'].includes(s?.schemaType) }, fields: [
        { name: 'price', type: 'text', label: 'Price' },
        { name: 'currency', type: 'text', label: 'Currency', defaultValue: 'INR' },
        { name: 'availability', type: 'select', label: 'Availability', options: ['InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly'] },
      ] },
      { name: 'brand', type: 'text', label: 'Brand', admin: { condition: (_: any, s: any) => s?.schemaType === 'Product' } },
      { name: 'sku', type: 'text', label: 'SKU', admin: { condition: (_: any, s: any) => s?.schemaType === 'Product' } },
      { type: 'row', admin: { condition: (_: any, s: any) => s?.schemaType === 'SoftwareApplication' }, fields: [
        { name: 'applicationCategory', type: 'text', label: 'Category', defaultValue: 'BusinessApplication' },
        { name: 'operatingSystem', type: 'text', label: 'Operating system', defaultValue: 'Web' },
      ] },
      { type: 'row', admin: { condition: (_: any, s: any) => ['Product', 'SoftwareApplication', 'Course'].includes(s?.schemaType) }, fields: [
        { name: 'ratingValue', type: 'number', label: 'Rating (1–5)', min: 1, max: 5 },
        { name: 'reviewCount', type: 'number', label: 'Review count', min: 0 },
      ] },
      // Course
      { name: 'provider', type: 'text', label: 'Course provider', admin: { condition: (_: any, s: any) => s?.schemaType === 'Course' } },
      // Event
      { type: 'row', admin: { condition: (_: any, s: any) => s?.schemaType === 'Event' }, fields: [
        { name: 'startDate', type: 'date', label: 'Starts', admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'endDate', type: 'date', label: 'Ends', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ] },
      { name: 'eventMode', type: 'select', label: 'Attendance', options: [{ label: 'Online', value: 'OnlineEventAttendanceMode' }, { label: 'In person', value: 'OfflineEventAttendanceMode' }, { label: 'Mixed', value: 'MixedEventAttendanceMode' }], admin: { condition: (_: any, s: any) => s?.schemaType === 'Event' } },
      { name: 'location', type: 'text', label: 'Venue / URL', admin: { condition: (_: any, s: any) => s?.schemaType === 'Event' } },
      // Video
      { name: 'videoUrl', type: 'text', label: 'Video URL (embed or file)', admin: { condition: (_: any, s: any) => s?.schemaType === 'VideoObject' } },
      { type: 'row', admin: { condition: (_: any, s: any) => s?.schemaType === 'VideoObject' }, fields: [
        { name: 'duration', type: 'text', label: 'Duration (ISO 8601, e.g. PT2M30S)' },
        { name: 'uploadDate', type: 'date', label: 'Upload date' },
      ] },
      { name: 'thumbnailUrl', type: 'text', label: 'Thumbnail URL (defaults to the featured image)', admin: { condition: (_: any, s: any) => s?.schemaType === 'VideoObject' } },
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
