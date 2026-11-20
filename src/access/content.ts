import type { Access, CollectionBeforeChangeHook, CollectionAfterChangeHook, Field } from 'payload'
import { capsOf, isStaff } from './caps'
import { outboundAllowed } from '@/lib/env'
import { SITE_URL } from '@/lib/urls'

/** Which field says who owns a document: posts have a real Author; other content types record the creator. */
export const ownerField = (slug: string) => (slug === 'posts' ? 'author' : 'createdBy')

/** Edit / delete: anyone with *_others_posts, otherwise only your own documents. */
const ownOr = (own: 'edit_posts' | 'delete_posts', others: 'edit_others_posts' | 'delete_others_posts', slug: string): Access =>
  async ({ req }) => {
    const caps = await capsOf(req.payload, req.user)
    if (caps.has(others)) return true
    if (!caps.has(own) || !req.user) return false
    return { [ownerField(slug)]: { equals: req.user.id } }
  }

export const contentAccess = (slug: string) => ({
  create: (async ({ req }) => (await capsOf(req.payload, req.user)).has('edit_posts')) as Access,
  update: ownOr('edit_posts', 'edit_others_posts', slug),
  delete: ownOr('delete_posts', 'delete_others_posts', slug),
  read: (({ req: { user } }) => (isStaff(user) ? true : { _status: { equals: 'published' } })) as Access,
})

/** Hidden ownership + review fields added to every content type. */
export const workflowFields = (slug: string): Field[] => [
  ...(slug === 'posts' ? [] : [{ name: 'createdBy', type: 'relationship', relationTo: 'users', index: true, admin: { readOnly: true, position: 'sidebar', components: { Field: '/components/admin/wp/Hidden#Hidden' } } } as Field]),
  { name: 'reviewStatus', type: 'select', defaultValue: 'none', index: true, options: [{ label: '—', value: 'none' }, { label: 'Pending Review', value: 'pending' }], admin: { position: 'sidebar', components: { Field: '/components/admin/wp/Hidden#Hidden' } } },
]

/**
 * WordPress publishing rules, enforced on the server:
 *  - no publish_posts → a publish becomes a draft marked "Pending Review" (Contributor "Submit for Review")
 *  - publishing clears "Pending Review"
 *  - the creator is recorded; authors cannot reassign posts to someone else
 */
export const workflowBeforeChange = (slug: string): CollectionBeforeChangeHook => async ({ data, originalDoc, operation, req }) => {
  const user: any = req.user
  if (!user) return data // system / scheduled jobs
  const caps = await capsOf(req.payload, user)
  if (operation === 'create' && slug !== 'posts' && !data.createdBy) data.createdBy = user.id
  if (slug === 'posts' && !caps.has('edit_others_posts')) data.author = operation === 'create' ? user.id : (originalDoc?.author?.id ?? originalDoc?.author ?? user.id)
  if (data._status === 'published' && !caps.has('publish_posts')) {
    data._status = 'draft'
    data.reviewStatus = 'pending'
  }
  if (data._status === 'published') data.reviewStatus = 'none'
  return data
}

/** Email the editors when something is submitted for review. */
export const notifyReview = (slug: string): CollectionAfterChangeHook => async ({ doc, previousDoc, req }) => {
  if (!outboundAllowed || doc?.reviewStatus !== 'pending' || previousDoc?.reviewStatus === 'pending') return doc
  try {
    const eds = await req.payload.find({ collection: 'users', where: { role: { in: ['admin', 'editor'] } }, depth: 0, limit: 50, overrideAccess: true })
    const to = (eds.docs as any[]).map((u) => u.email).filter(Boolean)
    if (to.length) void req.payload.sendEmail({ to, subject: `[AI Vastra] Pending review: “${doc.title}”`, text: `${(req.user as any)?.name || 'A contributor'} submitted “${doc.title}” for review.\n\n${SITE_URL}/admin/collections/${slug}/${doc.id}` }).catch(() => {})
  } catch { /* never block */ }
  return doc
}
