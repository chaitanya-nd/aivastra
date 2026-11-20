import { bodyFields } from '@/fields/body'
import { externalCoverFields } from '@/fields/cover'
import { faqFields } from '@/fields/faq'
import { computeReadingTime } from '@/hooks/readingTime'
import { contentCollection } from './factory'

/** Post edit screen laid out like WordPress: title → permalink → editor → Excerpt → SEO box; sidebar: Publish, Categories, Tags, Featured image. */
export const Posts = contentCollection({
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Posts' },
  defaultColumns: ['title', 'author', 'categories', 'tags', 'seoScore', 'links', 'publishedAt', '_status'],
  hooks: { beforeChange: [computeReadingTime] },
  fields: [
    ...bodyFields(),
    { name: 'excerpt', type: 'textarea', label: 'Excerpt', admin: { description: 'Excerpts are optional hand-crafted summaries of your content that can be used in your theme. Learn more about manual excerpts.' } },
    {
      type: 'collapsible',
      label: 'FAQ (accordion + FAQPage schema)',
      admin: { initCollapsed: true },
      fields: faqFields,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Author',
      defaultValue: ({ user }: any) => user?.id,
    },
    // Visibility (edited from the Publish box, like WordPress)
    { name: 'visibility', type: 'select', defaultValue: 'public', index: true, options: [{ label: 'Public', value: 'public' }, { label: 'Password protected', value: 'password' }, { label: 'Private', value: 'private' }], admin: { position: 'sidebar', components: { Field: '/components/admin/wp/Hidden#Hidden' } } },
    { name: 'postPassword', type: 'text', access: { read: ({ req: { user } }) => Boolean(user && (user as any).role !== 'subscriber') }, admin: { position: 'sidebar', components: { Field: '/components/admin/wp/Hidden#Hidden' } } },
    { name: 'sticky', type: 'checkbox', defaultValue: false, index: true, admin: { position: 'sidebar', components: { Field: '/components/admin/wp/Hidden#Hidden' } } },
    {
      name: 'format',
      type: 'select',
      label: 'Format',
      defaultValue: 'standard',
      options: ['standard', 'aside', 'gallery', 'link', 'image', 'quote', 'status', 'video', 'audio', 'chat'].map((v) => ({ label: v[0].toUpperCase() + v.slice(1), value: v })),
      admin: { position: 'sidebar', description: 'Post format — adds a format-* class for the theme.' },
    },
    {
      type: 'collapsible',
      label: 'Custom Fields',
      admin: { initCollapsed: true },
      fields: [
        { name: 'customFields', type: 'array', labels: { singular: 'Custom field', plural: 'Custom fields' }, admin: { description: 'Free-form name / value pairs (WordPress post meta). Available in the API.' }, fields: [{ type: 'row', fields: [{ name: 'key', type: 'text', label: 'Name', required: true }, { name: 'value', type: 'textarea', label: 'Value' }] }] },
      ],
    },
    // sidebar metaboxes
    { name: 'commentsMode', type: 'select', label: 'Discussion — comments', defaultValue: 'default', options: [{ label: 'Site default (Settings → Plugin settings → Discussion)', value: 'default' }, { label: 'Allow comments', value: 'open' }, { label: 'Closed', value: 'closed' }], admin: { position: 'sidebar' } },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true, admin: { position: 'sidebar', components: { Field: '/components/admin/wp/CategoryBox#CategoryBox' } } },
    { name: 'primaryCategory', type: 'relationship', relationTo: 'categories', admin: { position: 'sidebar', components: { Field: '/components/admin/wp/Hidden#Hidden' } } },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true, admin: { position: 'sidebar', components: { Field: '/components/admin/wp/TagBox#TagBox' } } },
    {
      type: 'collapsible',
      label: 'Featured image',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'featuredImage', type: 'upload', relationTo: 'media', label: 'Set featured image' },
        ...externalCoverFields,
      ],
    },
    {
      type: 'collapsible',
      label: 'Table of Contents',
      admin: { position: 'sidebar', initCollapsed: true },
      fields: [
        { name: 'showToc', type: 'checkbox', label: 'Show table of contents', defaultValue: true },
        { name: 'readingTime', type: 'number', admin: { readOnly: true, description: 'Minutes (auto)' } },
      ],
    },
  ],
})
