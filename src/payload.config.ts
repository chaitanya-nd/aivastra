import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { migrations } from './migrations'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { canEditContent, canEditSEO } from '@/access'
import { ExternalImage } from '@/blocks/lexical'
import { Cases } from '@/collections/Cases'
import { Guides } from '@/collections/Guides'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Posts } from '@/collections/Posts'
import { Reviews } from '@/collections/Reviews'
import { Updates } from '@/collections/Updates'
import { Users } from '@/collections/Users'
import { Categories, SectionCategories, Tags } from '@/collections/taxonomies'
import { extraSeoFields } from '@/fields/seo'
import { syncToMailchimp } from '@/hooks/mailchimp'
import { bustRedirectCache } from '@/lib/redirects'
import { beforeEmail, dropIfNotStored, guardSubmission } from '@/hooks/formSettings'
import { GlobalContent, Navigation, PluginSettings, SiteSettings } from '@/globals'
import { NotFoundLog } from '@/collections/NotFoundLog'
import { Comments } from '@/collections/Comments'
import { getPath, SITE_URL } from '@/lib/urls'
import { storagePlugins } from '@/storage'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const SEO_COLLECTIONS = [
  'pages',
  'posts',
  'guides',
  'cases',
  'updates',
  'reviews',
  'categories',
  'tags',
  'section-categories',
]

export default buildConfig({
  // On plain http (LAN dev) leave serverURL empty: Payload otherwise adds it to the csrf list (see csrf below).
  serverURL: SITE_URL.startsWith('https://') ? SITE_URL : '',
  cors: [SITE_URL, 'http://localhost:3100'],
  // Browsers send no Sec-Fetch-Site on plain-http LAN origins, so Payload's cookie check would reject every request
  // (login bounced back to /admin/login on other PCs). Enforce the allowlist only on https (production).
  csrf: SITE_URL.startsWith('https://') ? [SITE_URL] : [],
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    theme: 'dark', // dark admin (no toggle)
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — AI Vastra CMS' },
    components: {
      providers: ['/components/admin/UuidPolyfill#UuidPolyfill'],
      beforeDashboard: ['/components/admin/Dashboard#Dashboard'],
      views: {
        seoAudit: {
          Component: '/components/admin/SeoAudit#SeoAudit',
          path: '/seo-audit',
        },
        backups: { Component: '/components/admin/Backups#Backups', path: '/backups' },
        cache: { Component: '/components/admin/CacheTools#CacheTools', path: '/cache' },
        roles: { Component: '/components/admin/Roles#Roles', path: '/roles' },
        permalinks: { Component: '/components/admin/Permalinks#Permalinks', path: '/permalinks' },
        widgets: { Component: '/components/admin/Widgets#Widgets', path: '/widgets' },
        exportImport: { Component: '/components/admin/ExportImport#ExportImport', path: '/export-import' },
        siteHealth: { Component: '/components/admin/SiteHealth#SiteHealth', path: '/site-health' },
      },
      Nav: '/components/admin/WpNav#WpNav',
      header: ['/components/admin/AdminBar#AdminBar'],
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
      collections: ['pages', 'posts', 'guides', 'cases', 'updates', 'reviews'],
    },
  },
  collections: [
    Pages,
    Posts,
    Guides,
    Cases,
    Updates,
    Reviews,
    Categories,
    Tags,
    SectionCategories,
    Media,
    Users,
    NotFoundLog,
    Comments,
  ],
  globals: [SiteSettings, Navigation, GlobalContent, PluginSettings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
      HorizontalRuleFeature(),
      BlocksFeature({ blocks: [ExternalImage] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  }),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    // Dev: schema auto-sync. Switch to migrations (`payload migrate:create`) before production.
    push: process.env.NODE_ENV !== 'production',
    // Production: apply committed migrations at startup (src/migrations). Create new ones with `pnpm migrate:create`.
    prodMigrations: migrations,
  }),
  // Form notifications. Without SMTP_HOST, Payload logs emails to the console instead.
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM || 'no-reply@aivastra.com',
        defaultFromName: 'AI Vastra',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        },
      })
    : undefined,
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  plugins: [
    ...storagePlugins(),
    nestedDocsPlugin({
      collections: ['pages'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    seoPlugin({
      collections: SEO_COLLECTIONS,
      uploadsCollection: 'media',
      tabbedUI: false,
      generateTitle: ({ doc }) => `${(doc as any)?.title ?? (doc as any)?.name ?? ''} - AI Vastra`,
      generateDescription: ({ doc }) =>
        ((doc as any)?.excerpt || (doc as any)?.description || '').toString().slice(0, 160),
      generateURL: ({ doc, collectionSlug }) => `${SITE_URL}${getPath(collectionSlug || 'pages', doc as any)}`,
      generateImage: ({ doc }) => (doc as any)?.featuredImage,
      fields: ({ defaultFields }) => {
        const d = (n: string) => defaultFields.filter((f: any) => f.name === n)
        const e = (...n: string[]) => (extraSeoFields as any[]).filter((f) => n.includes(f.name))
        const robots = (extraSeoFields as any[]).find((f) => f.type === 'row')
        return [
          {
            type: 'tabs',
            tabs: [
              { label: 'General', fields: [...d('overview'), ...e('focusKeyword'), ...d('title'), ...d('description'), ...d('preview')] },
              { label: 'Advanced', fields: [{ ...robots, fields: robots.fields.map((f: any) => ({ ...f, label: f.name === 'noindex' ? 'Robots Meta: No Index' : 'Robots Meta: No Follow' })) }, ...e('canonicalUrl')] },
              { label: 'Schema', fields: e('schemaType', 'customSchema') },
              { label: 'Social', fields: [...e('ogTitle', 'ogDescription'), ...d('image')] },
            ],
          },
        ] as any
      },
    }),
    (config: any) => ({
      ...config,
      collections: config.collections.map((c: any) => ({ ...c, fields: c.fields.map((f: any) => (f.name === 'meta' ? { ...f, label: 'Rank Math SEO' } : f)) })),
    }),
    redirectsPlugin({
      collections: ['pages', 'posts', 'guides', 'cases', 'updates', 'reviews', 'categories'],
      redirectTypes: ['301', '302', '307', '410', '451'] as any,
      overrides: {
        labels: { singular: 'Redirection', plural: 'Redirections' },
        admin: { group: 'SEO & Tools', useAsTitle: 'from', defaultColumns: ['from', 'to', 'type', 'active', 'hits', 'lastAccessed'], listSearchableFields: ['from'] },
        access: { read: () => true, create: canEditSEO, update: canEditSEO, delete: canEditSEO },
        hooks: { afterChange: [({ doc }: any) => { bustRedirectCache(); return doc }], afterDelete: [({ doc }: any) => { bustRedirectCache(); return doc }] },
        fields: ({ defaultFields }: any) => [
          ...defaultFields.map((f: any) =>
            f.name === 'to' ? { ...f, label: 'Destination URL', admin: { ...f.admin, condition: (data: any) => !['410', '451'].includes(String(data?.type)), description: 'Not needed for 410 / 451.' } } : f.name === 'from' ? { ...f, label: 'Source URL', admin: { ...f.admin, description: 'Path or pattern to match, e.g. /old-page/ (Rank Math: Source URLs).' } } : f.name === 'type' ? { ...f, label: 'Redirection type', defaultValue: '301', options: [{ label: '301 Permanent Move', value: '301' }, { label: '302 Temporary Move', value: '302' }, { label: '307 Temporary Redirect', value: '307' }, { label: '410 Content Deleted', value: '410' }, { label: '451 Content Unavailable for Legal Reasons', value: '451' }], admin: { ...f.admin, description: '301 Permanent · 302 Temporary · 307 Temporary (strict) · 410 Content deleted · 451 Unavailable for legal reasons' } } : f,
          ),
          { name: 'comparison', type: 'select', label: 'Match', defaultValue: 'exact', options: [{ label: 'Exact', value: 'exact' }, { label: 'Contains', value: 'contains' }, { label: 'Starts with', value: 'start' }, { label: 'Ends with', value: 'end' }, { label: 'Regex', value: 'regex' }], admin: { position: 'sidebar' } },
          { name: 'ignoreCase', type: 'checkbox', label: 'Ignore case', defaultValue: true, admin: { position: 'sidebar' } },
          { name: 'active', type: 'checkbox', label: 'Activated', defaultValue: true, admin: { position: 'sidebar', description: 'Deactivated redirections are kept but not applied.' } },
          { name: 'hits', type: 'number', defaultValue: 0, admin: { position: 'sidebar', readOnly: true, description: 'Times this redirection was used.' } },
          { name: 'lastAccessed', type: 'date', admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
        ],
      } as any,
    }),
    formBuilderPlugin({
      fields: { payment: false },
      beforeEmail: beforeEmail as any,
      formOverrides: {
        labels: { singular: 'Contact form', plural: 'Contact forms' },
        admin: { group: 'SEO & Tools', useAsTitle: 'title', defaultColumns: ['title', 'shortcode', 'updatedAt'] },
        fields: ({ defaultFields }: any) => {
          const by = (...n: string[]) => defaultFields.filter((f: any) => n.includes(f.name))
          const conf = defaultFields.filter((f: any) => ['confirmationType', 'confirmationMessage', 'redirect'].includes(f.name))
          return [
            { name: 'shortcode', type: 'text', label: 'Shortcode', virtual: true, admin: { position: 'sidebar', readOnly: true, description: 'Contact Form 7 id — kept for the migrated pages.' }, hooks: { afterRead: [({ data }: any) => (data?.id ? `[contact-form-7 id="${data.id}" title="${data.title}"]` : '')] } },
            { name: 'mailchimpSync', type: 'checkbox', label: 'Subscribe to Mailchimp', admin: { position: 'sidebar', description: 'Add the submitted email to the Mailchimp audience (needs MAILCHIMP_API_KEY + MAILCHIMP_LIST_ID).' } },
            {
              type: 'tabs',
              tabs: [
                { label: 'Form', fields: by('title', 'fields', 'submitButtonLabel') },
                { label: 'Mail', fields: by('emails') },
                {
                  label: 'Messages',
                  fields: [
                    ...conf,
                    { name: 'messages', type: 'group', fields: [
                      { name: 'validationError', type: 'text', label: 'Validation errors occurred', defaultValue: 'One or more fields have an error. Please check and try again.' },
                      { name: 'mailFailed', type: 'text', label: 'Sender\'s message failed to send', defaultValue: 'There was an error trying to send your message. Please try again later.' },
                      { name: 'invalidRequired', type: 'text', label: 'Required field not filled in', defaultValue: 'Please fill out this field.' },
                      { name: 'invalidEmail', type: 'text', label: 'Email address format error', defaultValue: 'Please enter a valid email address.' },
                    ] },
                  ],
                },
                { label: 'Additional settings', fields: [
                  { name: 'additionalSettings', type: 'textarea', label: 'Additional settings', admin: { description: 'One setting per line, e.g. subscribers_only: on  ·  demo_mode: on  ·  skip_mail: on' } },
                  { name: 'storeSubmissions', type: 'checkbox', label: 'Keep submissions in the CMS (Flamingo-style)', defaultValue: true },
                ] },
              ],
            },
          ]
        },
        access: { read: () => true, create: canEditContent, update: canEditContent, delete: canEditContent },
      },
      formSubmissionOverrides: { admin: { group: 'SEO & Tools' }, hooks: { beforeChange: [guardSubmission], afterChange: [syncToMailchimp, dropIfNotStored] } },
    }),
  ],
})
