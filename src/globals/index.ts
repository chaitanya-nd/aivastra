import { randomBytes } from 'node:crypto'
import type { GlobalConfig } from 'payload'
import { canEditSEO, canEditContent, anyone, isAdmin, can } from '@/access'
import { bustCaps } from '@/access/caps'
import { globalContentFields } from '@/acf/build'
import { linkField } from '@/fields/link'
import { revalidateGlobal } from '@/hooks/revalidate'
import { logIndexingChange } from '@/hooks/indexingLog'

const robotsOptions = [
  { label: 'No Index', value: 'noindex' },
  { label: 'No Follow', value: 'nofollow' },
  { label: 'No Archive', value: 'noarchive' },
  { label: 'No Image Index', value: 'noimageindex' },
  { label: 'No Snippet', value: 'nosnippet' },
]
const schemaOptions = [
  { label: 'Automatic (by content type)', value: 'auto' },
  { label: 'Article', value: 'Article' },
  { label: 'BlogPosting', value: 'BlogPosting' },
  { label: 'NewsArticle', value: 'NewsArticle' },
  { label: 'WebPage', value: 'WebPage' },
  { label: 'HowTo', value: 'HowTo' },
  { label: 'Product', value: 'Product' },
  { label: 'SoftwareApplication', value: 'SoftwareApplication' },
  { label: 'Course', value: 'Course' },
  { label: 'None', value: 'none' },
]
const TIMEZONES = ['Asia/Kolkata', 'UTC', 'Asia/Dubai', 'Asia/Singapore', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Australia/Sydney']

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'General & SEO Settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: can('manage_options') },
  hooks: { afterChange: [revalidateGlobal('site-settings'), logIndexingChange] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', required: true, defaultValue: 'AI Vastra' },
            { name: 'tagline', type: 'text' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
            { type: 'row', fields: [
              { name: 'siteLanguage', type: 'text', label: 'Site language', defaultValue: 'en', admin: { description: 'BCP 47 code for <html lang>, e.g. en, en-IN, hi' } },
              { name: 'timezone', type: 'select', label: 'Timezone', defaultValue: 'Asia/Kolkata', options: TIMEZONES },
              { name: 'dateFormat', type: 'select', label: 'Date format', defaultValue: 'MMM d, yyyy', options: [
                { label: 'Nov 20, 2026', value: 'MMM d, yyyy' }, { label: 'November 20, 2026', value: 'MMMM d, yyyy' }, { label: '20 November 2026', value: 'd MMMM yyyy' },
                { label: '2026-11-20', value: 'yyyy-MM-dd' }, { label: '20/11/2026', value: 'dd/MM/yyyy' }, { label: '11/20/2026', value: 'MM/dd/yyyy' },
              ] },
            ] },
            { name: 'homepageDisplays', type: 'radio', label: 'Your homepage displays', defaultValue: 'page', options: [{ label: 'A static page (the page with slug “home”, or the one chosen below)', value: 'page' }, { label: 'Your latest posts', value: 'posts' }] },
            { name: 'homepagePage', type: 'relationship', relationTo: 'pages', label: 'Homepage', admin: { condition: (_: any, s: any) => s?.homepageDisplays !== 'posts', description: 'Leave empty to use the page with slug “home”.' } },
            { name: 'privacyPolicyPage', type: 'relationship', relationTo: 'pages', label: 'Privacy Policy page', admin: { description: 'Linked from registration and comment forms.' } },
            { type: 'collapsible', label: 'Maintenance mode', admin: { initCollapsed: true }, fields: [
              { name: 'maintenanceMode', type: 'checkbox', label: 'Show a maintenance page to visitors', defaultValue: false, access: { update: ({ req: { user } }) => (user as any)?.role === 'admin' }, admin: { description: 'Logged-in staff still see the site. Visitors get HTTP 503 with Retry-After, so search engines keep your rankings.' } },
              { name: 'maintenanceTitle', type: 'text', label: 'Heading', defaultValue: 'We’ll be back soon' },
              { name: 'maintenanceMessage', type: 'textarea', label: 'Message', defaultValue: 'We are doing some scheduled maintenance. Please check back shortly.' },
            ] },
          ],
        },
        {
          label: 'Global Meta',
          fields: [
            { name: 'separator', type: 'select', label: 'Separator Character', defaultValue: '-', options: [{ label: '-', value: '-' }, { label: '–', value: '–' }, { label: '—', value: '—' }, { label: '·', value: '·' }, { label: '•', value: '•' }, { label: '|', value: '|' }, { label: '»', value: '»' }, { label: '~', value: '~' }], admin: { description: 'Used where a title template contains %sep%.' } },
            { name: 'titleTemplate', type: 'text', label: 'Fallback title template', defaultValue: '%s - AI Vastra', admin: { description: '%s is replaced by the page title. Used when no per-type template is set.' } },
            { name: 'defaultDescription', type: 'textarea', label: 'Default meta description' },
            { name: 'robotsGlobal', type: 'select', label: 'Robots Meta', hasMany: true, options: robotsOptions, admin: { description: 'Applied to every page that has no more specific setting.' } },
            { name: 'defaultOgImage', type: 'upload', relationTo: 'media', label: 'OpenGraph Thumbnail', admin: { description: 'Used when a page has no social image.' } },
            { name: 'twitterHandle', type: 'text', label: 'Twitter username' },
            { name: 'twitterCard', type: 'select', label: 'Twitter card type', defaultValue: 'summary_large_image', options: [{ label: 'Summary Card with Large Image', value: 'summary_large_image' }, { label: 'Summary Card', value: 'summary' }] },
            { name: 'facebookUrl', type: 'text', label: 'Facebook page URL' },
            {
              name: 'blockIndexing',
              type: 'checkbox',
              label: 'Block search engines',
              defaultValue: true,
              access: { update: ({ req: { user } }) => (user as any)?.role === 'admin' },
              admin: { description: 'ON by default. Search engines are only allowed in when this is OFF and the deployment is the live site (SITE_ENV=production, host in INDEXABLE_HOSTS). Manage it in Admin → Search visibility.' },
            },
          ],
        },
        {
          label: 'Homepage',
          fields: [
            { name: 'homeTitle', type: 'text', label: 'Homepage Title', admin: { description: 'Leave empty to use the Home page SEO title.' } },
            { name: 'homeDescription', type: 'textarea', label: 'Homepage Description' },
            { name: 'homeOgImage', type: 'upload', relationTo: 'media', label: 'Homepage Thumbnail' },
          ],
        },
        {
          label: 'Post types',
          fields: [
            { type: 'ui', name: 'varsHelp', admin: { components: { Field: '/components/admin/SeoVars#SeoVars' } } },
            {
              name: 'pages',
              label: 'Pages',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', label: 'Pages Title', admin: { description: 'Default: %title% %sep% %sitename%' } },
                { name: 'description', type: 'textarea', label: 'Pages Description', admin: { description: 'Default: %excerpt%' } },
                { name: 'robots', type: 'select', label: 'Pages Robots Meta', hasMany: true, options: robotsOptions, admin: { description: 'Pick noindex to hide every Pages from search engines.' } },
                { name: 'inSitemap', type: 'checkbox', label: 'Include in sitemap', defaultValue: true },
                { name: 'schemaType', type: 'select', label: 'Schema Type', defaultValue: 'auto', options: schemaOptions },
              ],
            },
            {
              name: 'posts',
              label: 'Posts',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', label: 'Posts Title', admin: { description: 'Default: %title% %sep% %sitename%' } },
                { name: 'description', type: 'textarea', label: 'Posts Description', admin: { description: 'Default: %excerpt%' } },
                { name: 'robots', type: 'select', label: 'Posts Robots Meta', hasMany: true, options: robotsOptions, admin: { description: 'Pick noindex to hide every Posts from search engines.' } },
                { name: 'inSitemap', type: 'checkbox', label: 'Include in sitemap', defaultValue: true },
                { name: 'schemaType', type: 'select', label: 'Schema Type', defaultValue: 'auto', options: schemaOptions },
              ],
            },
            {
              name: 'guides',
              label: 'Guides',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', label: 'Guides Title', admin: { description: 'Default: %title% %sep% %sitename%' } },
                { name: 'description', type: 'textarea', label: 'Guides Description', admin: { description: 'Default: %excerpt%' } },
                { name: 'robots', type: 'select', label: 'Guides Robots Meta', hasMany: true, options: robotsOptions, admin: { description: 'Pick noindex to hide every Guides from search engines.' } },
                { name: 'inSitemap', type: 'checkbox', label: 'Include in sitemap', defaultValue: true },
                { name: 'schemaType', type: 'select', label: 'Schema Type', defaultValue: 'auto', options: schemaOptions },
              ],
            },
            {
              name: 'cases',
              label: 'Case Studies',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', label: 'Case Studies Title', admin: { description: 'Default: %title% %sep% %sitename%' } },
                { name: 'description', type: 'textarea', label: 'Case Studies Description', admin: { description: 'Default: %excerpt%' } },
                { name: 'robots', type: 'select', label: 'Case Studies Robots Meta', hasMany: true, options: robotsOptions, admin: { description: 'Pick noindex to hide every Case Studies from search engines.' } },
                { name: 'inSitemap', type: 'checkbox', label: 'Include in sitemap', defaultValue: true },
                { name: 'schemaType', type: 'select', label: 'Schema Type', defaultValue: 'auto', options: schemaOptions },
              ],
            },
            {
              name: 'updates',
              label: 'Product Updates',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', label: 'Product Updates Title', admin: { description: 'Default: %title% %sep% %sitename%' } },
                { name: 'description', type: 'textarea', label: 'Product Updates Description', admin: { description: 'Default: %excerpt%' } },
                { name: 'robots', type: 'select', label: 'Product Updates Robots Meta', hasMany: true, options: robotsOptions, admin: { description: 'Pick noindex to hide every Product Updates from search engines.' } },
                { name: 'inSitemap', type: 'checkbox', label: 'Include in sitemap', defaultValue: true },
                { name: 'schemaType', type: 'select', label: 'Schema Type', defaultValue: 'auto', options: schemaOptions },
              ],
            },
            {
              name: 'reviews',
              label: 'Reviews',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', label: 'Reviews Title', admin: { description: 'Default: %title% %sep% %sitename%' } },
                { name: 'description', type: 'textarea', label: 'Reviews Description', admin: { description: 'Default: %excerpt%' } },
                { name: 'robots', type: 'select', label: 'Reviews Robots Meta', hasMany: true, options: robotsOptions, admin: { description: 'Pick noindex to hide every Reviews from search engines.' } },
                { name: 'inSitemap', type: 'checkbox', label: 'Include in sitemap', defaultValue: true },
                { name: 'schemaType', type: 'select', label: 'Schema Type', defaultValue: 'auto', options: schemaOptions },
              ],
            },
          ],
        },
        {
          label: 'Taxonomies',
          fields: [
            {
              name: 'categories',
              label: 'Categories',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', label: 'Categories Title', admin: { description: 'Default: %title% %sep% %sitename%' } },
                { name: 'description', type: 'textarea', label: 'Categories Description', admin: { description: 'Default: %term_description%' } },
                { name: 'robots', type: 'select', label: 'Categories Robots Meta', hasMany: true, options: robotsOptions, admin: { description: 'Pick noindex to hide every Categories from search engines.' } },
                { name: 'inSitemap', type: 'checkbox', label: 'Include in sitemap', defaultValue: true },
                { name: 'schemaType', type: 'select', label: 'Schema Type', defaultValue: 'auto', options: schemaOptions },
              ],
            },
            {
              name: 'tags',
              label: 'Tags',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', label: 'Tags Title', admin: { description: 'Default: %title% %sep% %sitename%' } },
                { name: 'description', type: 'textarea', label: 'Tags Description', admin: { description: 'Default: %term_description%' } },
                { name: 'robots', type: 'select', label: 'Tags Robots Meta', hasMany: true, options: robotsOptions, admin: { description: 'Pick noindex to hide every Tags from search engines.' } },
                { name: 'inSitemap', type: 'checkbox', label: 'Include in sitemap', defaultValue: true },
                { name: 'schemaType', type: 'select', label: 'Schema Type', defaultValue: 'auto', options: schemaOptions },
              ],
            },
          ],
        },
        {
          label: 'Misc pages',
          fields: [
            { name: 'searchTitle', type: 'text', label: 'Search Results Title', defaultValue: 'Search results for %search_query% %sep% %sitename%' },
            { name: 'notFoundTitle', type: 'text', label: '404 Page Title', defaultValue: 'Page Not Found %sep% %sitename%' },
            { name: 'noindexSearch', type: 'checkbox', label: 'Noindex search results', defaultValue: true },
            { name: 'noindexPaginated', type: 'checkbox', label: 'Noindex paginated pages (page 2+)', defaultValue: true },
          ],
        },
        {
          label: 'Schema & Local SEO',
          fields: [
            { name: 'legalName', type: 'text' },
            { name: 'foundingYear', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'phone', type: 'text' },
            { name: 'address', type: 'textarea', admin: { description: 'Free-text address (used when the structured address below is empty).' } },

            { name: 'orgType', type: 'select', label: 'Person or company type', defaultValue: 'Organization', options: ['Organization', 'Corporation', 'LocalBusiness', 'ProfessionalService', 'Store', 'OnlineBusiness'] },
            { name: 'localAddress', type: 'group', label: 'Structured address (Local SEO)', fields: [
              { type: 'row', fields: [{ name: 'street', type: 'text', label: 'Street' }, { name: 'locality', type: 'text', label: 'City' }, { name: 'region', type: 'text', label: 'State' }] },
              { type: 'row', fields: [{ name: 'postalCode', type: 'text', label: 'PIN / ZIP' }, { name: 'country', type: 'text', label: 'Country code', defaultValue: 'IN' }] },
            ] },
            { type: 'row', fields: [
              { name: 'geoLat', type: 'number', label: 'Latitude' },
              { name: 'geoLng', type: 'number', label: 'Longitude' },
              { name: 'priceRange', type: 'text', label: 'Price range', admin: { description: 'e.g. ₹₹' } },
            ] },
            { name: 'openingHours', type: 'array', label: 'Opening hours', admin: { description: 'Local businesses only.' }, fields: [{ type: 'row', fields: [
              { name: 'days', type: 'select', hasMany: true, options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
              { name: 'opens', type: 'text', label: 'Opens (HH:MM)' },
              { name: 'closes', type: 'text', label: 'Closes (HH:MM)' },
            ] }] },
            {
              name: 'socials',
              type: 'array',
              labels: { singular: 'Profile', plural: 'Social profiles' },
              fields: [
                { name: 'platform', type: 'select', options: ['facebook', 'instagram', 'linkedin', 'x', 'youtube', 'pinterest', 'other'] },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Analytics, scripts & robots',
          fields: [
            { name: 'headScripts', type: 'code', admin: { language: 'html', description: 'Injected in <head> (analytics, verification tags). Replaces "Insert Headers and Footers".' } },
            { name: 'bodyScripts', type: 'code', admin: { language: 'html', description: 'Injected at the end of <body>.' } },
            { name: 'robotsExtra', type: 'textarea', admin: { description: 'Extra lines appended to robots.txt.' } },
            { name: 'llmsTxt', type: 'textarea', admin: { description: 'Body of /llms.txt (leave empty to auto-generate).' } },
          ],
        },
      ],
    },
  ],
}

const menuLink = linkField()

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menus (Appearance)',
  admin: { group: 'Settings', components: { views: { edit: { default: { Component: '/components/admin/MenuBuilder#MenuBuilder' } } } } },
  access: { read: anyone, update: can('edit_theme_options') },
  hooks: { afterChange: [revalidateGlobal('navigation')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header (Main menu)',
          fields: [
            {
              name: 'header',
              type: 'array',
              labels: { singular: 'Menu item', plural: 'Menu items' },
              fields: [
                menuLink,
                {
                  name: 'children',
                  type: 'array',
                  labels: { singular: 'Sub-item', plural: 'Dropdown items' },
                  fields: [menuLink, { name: 'description', type: 'text' }],
                },
              ],
            },
            linkField({ name: 'headerButton' }),
          ],
        },
        {
          label: 'Footer columns',
          fields: [
            {
              name: 'footerColumns',
              type: 'array',
              labels: { singular: 'Column', plural: 'Columns' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'links', type: 'array', fields: [menuLink] },
              ],
            },
            { name: 'legalLinks', type: 'array', fields: [menuLink] },
            { name: 'copyright', type: 'text', defaultValue: '© {year} AI Vastra. All rights reserved.' },
          ],
        },
      ],
    },
  ],
}

export const GlobalContent: GlobalConfig = {
  slug: 'global-content',
  label: 'Global content',
  admin: { group: 'Settings', description: 'Header buttons, footer, contact details and socials (the old ACF "Global Content" options page).' },
  access: { read: anyone, update: can('edit_theme_options') },
  hooks: { afterChange: [revalidateGlobal('global-content')] },
  fields: [
    ...globalContentFields,
    { name: 'contactForm', type: 'relationship', relationTo: 'forms', label: 'Footer / popup contact form' },
    { name: 'newsletterForm', type: 'relationship', relationTo: 'forms', label: 'Newsletter form (blog band)' },
  ],
}

export { isAdmin }

/** Users → Role Manager: which capabilities each role has (admin & subscriber are fixed). */
export const RoleCapabilities: GlobalConfig = {
  slug: 'role-capabilities',
  label: 'Role capabilities',
  admin: { hidden: true },
  access: { read: ({ req: { user } }) => Boolean(user), update: isAdmin },
  hooks: { afterChange: [() => bustCaps()] },
  fields: [{ name: 'matrix', type: 'json' }],
}

export const PluginSettings: GlobalConfig = {
  slug: 'plugin-settings',
  label: 'Plugin Settings',
  admin: { group: 'Settings', description: 'Options of the former WordPress plugins: Rank Math sitemap, Breadcrumb NavXT, LuckyWP Table of Contents, Mailchimp, Insert Headers & Footers.' },
  access: { read: anyone, update: can('manage_options') },
  hooks: { afterChange: [revalidateGlobal('plugin-settings')], beforeChange: [({ data }) => { if (!data.indexNowKey) data.indexNowKey = randomBytes(16).toString('hex'); return data }] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Sitemap (Rank Math)', fields: [
          { name: 'sitemapEnabled', type: 'checkbox', label: 'Enable sitemap', defaultValue: true },
          { name: 'sitemapMaxLinks', type: 'number', label: 'Links per sitemap', defaultValue: 200, admin: { description: 'Rank Math default 200.' } },
          { name: 'sitemapImages', type: 'checkbox', label: 'Include images', defaultValue: true },
          { name: 'sitemapExcludePosts', type: 'text', label: 'Exclude posts / pages (slugs, comma separated)' },
          { name: 'sitemapExcludeTerms', type: 'text', label: 'Exclude terms (slugs, comma separated)' },
        ] },
        { label: 'Breadcrumbs (NavXT)', fields: [
          { name: 'bcSeparator', type: 'select', label: 'Breadcrumb separator', defaultValue: 'arrow', options: [{ label: 'Theme arrow (default)', value: 'arrow' }, { label: '/', value: '/' }, { label: '>', value: '>' }, { label: '»', value: '»' }, { label: '|', value: '|' }, { label: '·', value: '·' }] },
          { name: 'bcHomeLabel', type: 'text', label: 'Home breadcrumb text', defaultValue: 'Home' },
          { name: 'bcShowHome', type: 'checkbox', label: 'Show the home breadcrumb', defaultValue: true },
          { name: 'bcLinkCurrent', type: 'checkbox', label: 'Link the current item', defaultValue: false },
          { name: 'bcHide', type: 'checkbox', label: 'Hide breadcrumbs on the site', defaultValue: false },
        ] },
        { label: 'Table of contents (LuckyWP)', fields: [
          { name: 'tocTitle', type: 'text', label: 'Header', defaultValue: 'Contents' },
          { name: 'tocMinHeadings', type: 'number', label: 'Minimum number of headings', defaultValue: 2 },
          { name: 'tocDepth', type: 'select', label: 'Depth', defaultValue: '4', options: [{ label: 'H2 only', value: '2' }, { label: 'H2 – H3', value: '3' }, { label: 'H2 – H4', value: '4' }] },
          { name: 'tocNumbered', type: 'checkbox', label: 'Numbered list', defaultValue: true },
          { name: 'tocEnabled', type: 'checkbox', label: 'Automatically insert the table of contents', defaultValue: true },
        ] },
        { label: 'Mailchimp', fields: [
          { name: 'mcAudienceId', type: 'text', label: 'Audience (list) ID', admin: { description: 'Overrides MAILCHIMP_LIST_ID env.' } },
          { name: 'mcDoubleOptIn', type: 'checkbox', label: 'Double opt-in', defaultValue: false },
          { name: 'mcTags', type: 'text', label: 'Tags added to subscribers', admin: { description: 'Comma separated.' } },
          { type: 'ui', name: 'mcStatus', admin: { components: { Field: '/components/admin/EnvStatus#EnvStatus' } } },
        ] },
        { label: 'Headers & footers', fields: [
          { name: 'headerScripts', type: 'code', label: 'Scripts in header', admin: { language: 'html', description: 'Printed in <head> (in addition to Analytics → Scripts).' } },
          { name: 'bodyOpenScripts', type: 'code', label: 'Scripts in body (after <body>)', admin: { language: 'html' } },
          { name: 'footerScripts', type: 'code', label: 'Scripts in footer', admin: { language: 'html' } },
        ] },
        { label: 'Reading', fields: [
          { name: 'postsPerPage', type: 'number', label: 'Blog pages show at most', defaultValue: 9, min: 1, max: 50, admin: { description: 'Settings → Reading: posts per page on the blog, category and tag archives.' } },
        ] },
        { label: 'Discussion', fields: [
          { name: 'commentsEnabled', type: 'checkbox', label: 'Allow people to submit comments on new posts', defaultValue: false, admin: { description: 'Site default. Each post can override this (Discussion box on the edit screen). The original site had comments off.' } },
          { name: 'commentsRequireNameEmail', type: 'checkbox', label: 'Comment author must fill out name and email', defaultValue: true },
          { name: 'commentsLoggedInOnly', type: 'checkbox', label: 'Users must be registered and logged in to comment', defaultValue: false },
          { name: 'commentsClose', type: 'checkbox', label: 'Automatically close comments on old posts', defaultValue: false },
          { name: 'commentsCloseDays', type: 'number', label: '…after this many days', defaultValue: 14, admin: { condition: (_: any, s: any) => Boolean(s?.commentsClose) } },
          { name: 'commentsThreaded', type: 'checkbox', label: 'Enable threaded (nested) comments', defaultValue: true },
          { name: 'commentsDepth', type: 'number', label: 'Nested levels deep', defaultValue: 3, min: 1, max: 10 },
          { name: 'commentsPerPage', type: 'number', label: 'Break comments into pages with this many top level comments per page', defaultValue: 20, admin: { description: '0 shows all comments on one page.' } },
          { name: 'commentsOrder', type: 'select', label: 'Comments should be displayed with the … comments at the top', defaultValue: 'asc', options: [{ label: 'older', value: 'asc' }, { label: 'newer', value: 'desc' }] },
          { name: 'commentsNotify', type: 'checkbox', label: 'Email me whenever anyone posts a comment', defaultValue: true },
          { name: 'commentsNotifyEmail', type: 'email', label: 'Notification email', admin: { description: 'Falls back to ADMIN_EMAIL. Needs SMTP to actually send (Tools → Site Health).' } },
          { name: 'commentsHold', type: 'checkbox', label: 'Comment must be manually approved', defaultValue: false },
          { name: 'commentsKnownAuto', type: 'checkbox', label: 'Comment author must have a previously approved comment', defaultValue: true },
          { name: 'commentsMaxLinks', type: 'number', label: 'Hold a comment in the queue if it contains this many or more links', defaultValue: 2 },
          { name: 'commentsModWords', type: 'textarea', label: 'Comment Moderation', admin: { description: 'One word, IP or email per line. Matching comments are held for moderation.' } },
          { name: 'commentsBlockWords', type: 'textarea', label: 'Disallowed Comment Keys', admin: { description: 'One word, IP or email per line. Matching comments are marked as spam.' } },
        ] },
        { label: 'Writing & publishing', fields: [
          { name: 'notifyOnPublish', type: 'checkbox', label: 'Email when a post is published', defaultValue: false, admin: { description: 'Sends one email the first time a post, guide, case study, update or review goes live. Only on the live site.' } },
          { name: 'notifyOnPublishTo', type: 'text', label: 'Send publish notifications to', admin: { condition: (_: any, s: any) => Boolean(s?.notifyOnPublish), description: 'Comma separated. Falls back to ADMIN_EMAIL.' } },
          { name: 'relatedMode', type: 'select', label: '“Read more” under articles shows', defaultValue: 'latest', options: [{ label: 'Latest posts (as on the old site)', value: 'latest' }, { label: 'Related posts (same categories / tags)', value: 'related' }] },
          { name: 'showPrevNext', type: 'checkbox', label: 'Show previous / next post links under articles', defaultValue: false },
          { name: 'usersCanRegister', type: 'checkbox', label: 'Anyone can register', defaultValue: false, admin: { description: 'Settings → General → Membership. New accounts get the Subscriber role (can comment, no admin access). Registration page: /register/' } },
        ] },
        { label: 'Instant indexing & sitemaps', fields: [
          { name: 'indexNowEnabled', type: 'checkbox', label: 'Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver) on publish', defaultValue: true, admin: { description: 'Only runs on the live site with search engines allowed (Search visibility).' } },
          { name: 'indexNowKey', type: 'text', label: 'IndexNow API key', admin: { readOnly: true, description: 'Generated automatically (until saved, a key derived from PAYLOAD_SECRET is used); served at /<key>.txt for verification.' } },
          { name: 'dateArchives', type: 'checkbox', label: 'Enable date archives (/2026/ and /2026/11/)', defaultValue: true, admin: { description: 'Always noindex, as in Rank Math.' } },
          { name: 'authorArchives', type: 'checkbox', label: 'Enable author archives (/author/name/)', defaultValue: true },
          { name: 'newsSitemap', type: 'checkbox', label: 'News sitemap (/news-sitemap.xml)', defaultValue: false, admin: { description: 'Posts published in the last 48 hours, for Google News publishers.' } },
          { name: 'newsPublicationName', type: 'text', label: 'News publication name', defaultValue: 'AI Vastra', admin: { condition: (_: any, s: any) => Boolean(s?.newsSitemap) } },
          { name: 'videoSitemap', type: 'checkbox', label: 'Video sitemap (/video-sitemap.xml)', defaultValue: false, admin: { description: 'Posts with an embedded YouTube / Vimeo video or a Video schema.' } },
        ] },
      ],
    },
  ],
}
