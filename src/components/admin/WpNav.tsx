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
    { label: 'Overview', icon: 'dashboard', href: '/admin', exact: true },
    { type: 'sep', label: 'Content' },
    { label: 'Blog', icon: 'post', href: C('posts'), badge: has('publish_posts') ? pendingReview : 0, sub: [
      { label: 'All articles', href: C('posts'), exact: true }, { label: 'Write new article', href: `${C('posts')}/create` },
      ...(pendingReview && has('publish_posts') ? [{ label: `Waiting for review (${pendingReview})`, href: `${C('posts')}?where[reviewStatus][equals]=pending&where[_status][equals]=draft`, noActive: true }] : []),
      ...(has('manage_categories') ? [{ label: 'Categories', href: C('categories') }, { label: 'Tags', href: C('tags') }] : []),
      { label: 'Content calendar', href: '/admin/calendar' }, { label: 'Reusable blocks', href: C('patterns') } ] },
    ...(has('upload_files') ? [{ label: 'Media library', icon: 'media', href: C('media'), sub: [{ label: 'All files', href: C('media'), exact: true }, { label: 'Upload files', href: `${C('media')}/create` }, { label: 'Unused files', href: '/admin/media-usage' }] } as MenuItem] : []),
    { label: 'Website pages', icon: 'page', href: C('pages'), sub: [{ label: 'All pages', href: C('pages'), exact: true }, { label: 'Create page', href: `${C('pages')}/create` }] },
    // Guides, case studies, product updates and reviews: the /documentations/, /case-studies/ and /review/ sections of the site, grouped in one menu.
    { label: 'Resources', icon: 'article', href: C('guides'), sub: [
      { label: 'Help guides', href: C('guides') }, { label: 'Case studies', href: C('cases') }, { label: 'Product updates', href: C('updates') },
      { label: 'Customer reviews', href: C('reviews') }, { label: 'Resource categories', href: C('section-categories') } ] },
    ...(has('moderate_comments') ? [{ label: 'Comments', icon: 'comment', href: C('comments'), badge: pending, sub: [{ label: 'All comments', href: C('comments'), exact: true }, { label: `Awaiting approval${pending ? ` (${pending})` : ''}`, href: `${C('comments')}?where[status][equals]=pending`, noActive: true }] } as MenuItem] : []),
    ...(has('manage_forms') ? [{ label: 'Forms & leads', icon: 'form', href: C('forms'), sub: [{ label: 'All forms', href: C('forms'), exact: true }, { label: 'Create form', href: `${C('forms')}/create` }, { label: 'Leads (form entries)', href: C('form-submissions') }] } as MenuItem] : []),
    { type: 'sep', label: 'Grow' },
    ...(canSEO ? [{ label: 'SEO', icon: 'seo', href: '/admin/seo-audit', sub: [
      { label: 'SEO audit', href: '/admin/seo-audit' },
      { label: 'Traffic & rankings', href: '/admin/analytics' },
      { label: 'Bulk SEO editor', href: '/admin/seo-bulk' },
      { label: 'Link health', href: '/admin/link-report' },
      { label: 'Automatic internal links', href: C('auto-links') },
      { label: 'Search visibility', href: '/admin/search-visibility' },
      { label: 'Titles & meta tags', href: G('site-settings'), noActive: true },
      { label: 'Redirects', href: C('redirects') },
      { label: 'Broken URLs (404)', href: C('not-found-log') },
      { label: 'Sitemap', href: '/admin/sitemap-settings' },
      { label: 'Open sitemap.xml', href: '/sitemap_index.xml', external: true },
      { label: 'robots.txt', href: '/robots.txt', external: true },
      { label: 'llms.txt', href: '/llms.txt', external: true } ] } as MenuItem] : []),
    ...(isAdmin ? [{ label: 'Maintenance', icon: 'tools', href: '/admin/backups', sub: [{ label: 'Backups', href: '/admin/backups' }, { label: 'Import / export', href: '/admin/export-import' }, { label: 'System status', href: '/admin/site-health' }, { label: 'Activity log', href: C('activity-log') }, { label: 'Personal data requests', href: '/admin/privacy' }, { label: 'Cache', href: '/admin/cache' }, { label: 'File browser', href: C('media') }] } as MenuItem] : []),
    { type: 'sep', label: 'Manage' },
    ...(has('edit_theme_options') ? [{ label: 'Site design', icon: 'brush', href: G('navigation'), sub: [{ label: 'Navigation menus', href: G('navigation') }, { label: 'Sidebar & footer blocks', href: '/admin/widgets' }, { label: 'Site-wide content', href: G('global-content') }] } as MenuItem] : []),
    { label: 'Team', icon: 'users', href: C('users'), sub: [{ label: 'All members', href: C('users'), exact: true }, ...(isAdmin ? [{ label: 'Invite member', href: `${C('users')}/create` }, { label: 'Roles & permissions', href: '/admin/roles' }] : []), { label: 'Two-factor login', href: '/admin/two-factor' }, { label: 'My profile', href: user ? `${C('users')}/${(user as any).id}` : C('users') }] },
    ...(has('manage_options') ? [{ label: 'Settings', icon: 'settings', href: G('site-settings'), sub: [
      { label: 'General', href: G('site-settings') }, { label: 'Features', href: G('plugin-settings') }, { label: 'Comments', href: G('plugin-settings'), noActive: true }, { label: 'Publishing', href: G('plugin-settings'), noActive: true }, { label: 'URL structure', href: '/admin/permalinks' }, { label: 'Navigation menus', href: G('navigation') }, { label: 'Site-wide content', href: G('global-content') } ] } as MenuItem] : []),
  ]
  return <WpNavClient items={items} />
}
