import type { ServerProps } from 'payload'
import { capsOf } from '@/access/caps'
import { WpNavClient, type MenuItem } from './WpNavClient'

const C = (slug: string) => `/admin/collections/${slug}`
const G = (slug: string) => `/admin/globals/${slug}`

/** Left navigation (grouped by section, with flyout sub-menus). */
export async function WpNav({ user, payload }: ServerProps) {
  const pending = await payload.count({ collection: 'comments' as any, where: { status: { equals: 'pending' } }, overrideAccess: true }).then((r) => r.totalDocs).catch(() => 0)
  const role = (user as any)?.role as string | undefined
  const caps = await capsOf(payload, user)
  const canSEO = caps.has('manage_seo_tools')
  const isAdmin = role === 'admin'
  const has = (c: Parameters<typeof caps.has>[0]) => caps.has(c)
  const pendingReview = await payload.count({ collection: 'posts', where: { and: [{ reviewStatus: { equals: 'pending' } }, { _status: { equals: 'draft' } }] }, overrideAccess: true }).then((r) => r.totalDocs).catch(() => 0)
  const items: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', href: '/admin', exact: true },
    { type: 'sep', label: 'Content' },
    { label: 'Posts', icon: 'post', href: C('posts'), badge: has('publish_posts') ? pendingReview : 0, sub: [
      { label: 'All Posts', href: C('posts'), exact: true }, { label: 'Add New', href: `${C('posts')}/create` },
      ...(pendingReview && has('publish_posts') ? [{ label: `Pending review (${pendingReview})`, href: `${C('posts')}?where[reviewStatus][equals]=pending&where[_status][equals]=draft`, noActive: true }] : []),
      ...(has('manage_categories') ? [{ label: 'Categories', href: C('categories') }, { label: 'Tags', href: C('tags') }] : []),
      { label: 'Calendar', href: '/admin/calendar' }, { label: 'Patterns', href: C('patterns') } ] },
    ...(has('upload_files') ? [{ label: 'Media', icon: 'media', href: C('media'), sub: [{ label: 'Library', href: C('media'), exact: true }, { label: 'Add New', href: `${C('media')}/create` }, { label: 'Unused media', href: '/admin/media-usage' }] } as MenuItem] : []),
    { label: 'Pages', icon: 'page', href: C('pages'), sub: [{ label: 'All Pages', href: C('pages'), exact: true }, { label: 'Add New', href: `${C('pages')}/create` }] },
    { label: 'Guides', icon: 'article', href: C('guides'), sub: [{ label: 'All Guides', href: C('guides'), exact: true }, { label: 'Add New', href: `${C('guides')}/create` }, { label: 'Section categories', href: C('section-categories') }] },
    { label: 'Case Studies', icon: 'star', href: C('cases'), sub: [{ label: 'All Case Studies', href: C('cases'), exact: true }, { label: 'Add New', href: `${C('cases')}/create` }] },
    { label: 'Product Updates', icon: 'update', href: C('updates'), sub: [{ label: 'All Updates', href: C('updates'), exact: true }, { label: 'Add New', href: `${C('updates')}/create` }] },
    { label: 'Reviews', icon: 'star', href: C('reviews'), sub: [{ label: 'All Reviews', href: C('reviews'), exact: true }, { label: 'Add New', href: `${C('reviews')}/create` }] },
    ...(has('moderate_comments') ? [{ label: 'Comments', icon: 'comment', href: C('comments'), badge: pending, sub: [{ label: 'All Comments', href: C('comments'), exact: true }, { label: `Pending${pending ? ` (${pending})` : ''}`, href: `${C('comments')}?where[status][equals]=pending`, noActive: true }] } as MenuItem] : []),
    ...(has('manage_forms') ? [{ label: 'Contact', icon: 'form', href: C('forms'), sub: [{ label: 'Contact Forms', href: C('forms'), exact: true }, { label: 'Add New', href: `${C('forms')}/create` }, { label: 'Messages (submissions)', href: C('form-submissions') }] } as MenuItem] : []),
    { type: 'sep', label: 'Growth & tools' },
    ...(canSEO ? [{ label: 'Rank Math SEO', icon: 'seo', href: '/admin/seo-audit', sub: [
      { label: 'Dashboard (SEO audit)', href: '/admin/seo-audit' },
      { label: 'Analytics & rank tracker', href: '/admin/analytics' },
      { label: 'Bulk SEO editor', href: '/admin/seo-bulk' },
      { label: 'Link reports (orphans, broken)', href: '/admin/link-report' },
      { label: 'Auto links', href: C('auto-links') },
      { label: 'Search visibility', href: '/admin/search-visibility' },
      { label: 'Titles & Meta', href: G('site-settings'), noActive: true },
      { label: 'Redirections', href: C('redirects') },
      { label: '404 Monitor', href: C('not-found-log') },
      { label: 'Sitemap settings', href: `${G('plugin-settings')}`, noActive: true },
      { label: 'Sitemap', href: '/sitemap_index.xml', external: true },
      { label: 'robots.txt', href: '/robots.txt', external: true },
      { label: 'llms.txt', href: '/llms.txt', external: true } ] } as MenuItem] : []),
    ...(isAdmin ? [{ label: 'Tools', icon: 'tools', href: '/admin/backups', sub: [{ label: 'Backups (UpdraftPlus)', href: '/admin/backups' }, { label: 'Export & Import', href: '/admin/export-import' }, { label: 'Site Health', href: '/admin/site-health' }, { label: 'Activity log', href: C('activity-log') }, { label: 'Privacy (export / erase data)', href: '/admin/privacy' }, { label: 'Cache (LiteSpeed)', href: '/admin/cache' }, { label: 'File manager (Media)', href: C('media') }] } as MenuItem] : []),
    { type: 'sep', label: 'Workspace' },
    ...(has('edit_theme_options') ? [{ label: 'Appearance', icon: 'brush', href: G('navigation'), sub: [{ label: 'Menus', href: G('navigation') }, { label: 'Widgets', href: '/admin/widgets' }, { label: 'Theme options (Global content)', href: G('global-content') }] } as MenuItem] : []),
    { label: 'Users', icon: 'users', href: C('users'), sub: [{ label: 'All Users', href: C('users'), exact: true }, ...(isAdmin ? [{ label: 'Add New', href: `${C('users')}/create` }, { label: 'Role Manager', href: '/admin/roles' }] : []), { label: 'Two-factor login', href: '/admin/two-factor' }, { label: 'Your Profile', href: user ? `${C('users')}/${(user as any).id}` : C('users') }] },
    ...(has('manage_options') ? [{ label: 'Settings', icon: 'settings', href: G('site-settings'), sub: [
      { label: 'General & SEO', href: G('site-settings') }, { label: 'Plugin settings', href: G('plugin-settings') }, { label: 'Discussion', href: G('plugin-settings'), noActive: true }, { label: 'Reading', href: G('plugin-settings'), noActive: true }, { label: 'Permalinks', href: '/admin/permalinks' }, { label: 'Menus', href: G('navigation') }, { label: 'Global content', href: G('global-content') } ] } as MenuItem] : []),
  ]
  return <WpNavClient items={items} />
}
