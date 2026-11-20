import type { Access, FieldAccess, Payload } from 'payload'

/** WordPress-style roles and capabilities. Admin always has everything; the rest are editable in Users → Role Manager. */
export const ROLES = ['admin', 'seo', 'editor', 'author', 'contributor', 'subscriber'] as const
export type Role = (typeof ROLES)[number]
export const ROLE_LABELS: Record<Role, string> = { admin: 'Administrator', seo: 'SEO manager', editor: 'Editor', author: 'Author', contributor: 'Contributor', subscriber: 'Subscriber' }

export const CAPS = {
  edit_posts: 'Write content (own drafts)',
  publish_posts: 'Publish content (otherwise “Submit for Review”)',
  edit_others_posts: 'Edit content written by others',
  delete_posts: 'Delete own content',
  delete_others_posts: 'Delete content written by others',
  upload_files: 'Upload and edit media',
  manage_categories: 'Manage categories and tags',
  moderate_comments: 'Moderate comments',
  edit_seo: 'Edit SEO fields on content (title, description, schema, robots)',
  manage_seo_tools: 'Titles & Meta, sitemap, redirects, 404 monitor, auto links',
  edit_theme_options: 'Menus, widgets and global content',
  manage_forms: 'Contact forms and messages',
  manage_options: 'Site and plugin settings',
} as const
export type Cap = keyof typeof CAPS

const ALL = Object.keys(CAPS) as Cap[]
export const DEFAULT_CAPS: Record<Role, Cap[]> = {
  admin: ALL,
  seo: ALL,
  editor: ['edit_posts', 'publish_posts', 'edit_others_posts', 'delete_posts', 'delete_others_posts', 'upload_files', 'manage_categories', 'moderate_comments', 'edit_theme_options', 'manage_forms'],
  author: ['edit_posts', 'publish_posts', 'delete_posts', 'upload_files'],
  contributor: ['edit_posts', 'delete_posts'],
  subscriber: [],
}
/** Roles whose row in the matrix cannot be changed. */
export const LOCKED: Role[] = ['admin', 'subscriber']

let cache: { at: number; matrix: Record<string, Cap[]> } | null = null
export const bustCaps = () => { cache = null }

async function matrix(payload: Payload): Promise<Record<string, Cap[]>> {
  if (cache && Date.now() - cache.at < 30_000) return cache.matrix
  const g: any = await payload.findGlobal({ slug: 'role-capabilities' as any, depth: 0, overrideAccess: true }).catch(() => null)
  const saved = (g?.matrix && typeof g.matrix === 'object' ? g.matrix : {}) as Record<string, Cap[]>
  const m: Record<string, Cap[]> = {}
  for (const r of ROLES) m[r] = LOCKED.includes(r) || !Array.isArray(saved[r]) ? DEFAULT_CAPS[r] : saved[r].filter((c) => c in CAPS)
  cache = { at: Date.now(), matrix: m }
  return m
}

export async function capsOf(payload: Payload, user: any): Promise<Set<Cap>> {
  if (!user || user.collection && user.collection !== 'users') return new Set()
  if (user.role === 'admin') return new Set(ALL)
  return new Set((await matrix(payload))[user.role] ?? [])
}
export async function userCan(payload: Payload, user: any, cap: Cap) {
  return (await capsOf(payload, user)).has(cap)
}
export const can = (cap: Cap): Access => async ({ req }) => userCan(req.payload, req.user, cap)
export const fieldCan = (cap: Cap): FieldAccess => async ({ req }) => userCan(req.payload, req.user, cap)
export const isStaff = (user: any) => Boolean(user && user.role && user.role !== 'subscriber')
