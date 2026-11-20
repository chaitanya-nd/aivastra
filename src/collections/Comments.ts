import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import { outboundAllowed } from '@/lib/env'
import { getPath, SITE_URL } from '@/lib/urls'
import { can, isStaff } from '@/access'

export const COMMENTABLE = ['posts', 'pages', 'guides', 'cases', 'updates', 'reviews'] as const
const staff = ({ req: { user } }: any) => isStaff(user)

/** WordPress Comments (wp_comments): moderated, threaded, per-doc open/closed. Created by /api/av/comment, managed in Comments. */
/** Email the parent comment's author when a reply is approved (they ticked "Notify me of replies"). */
const notifyParent: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  if (!outboundAllowed || doc.status !== 'approved' || previousDoc?.status === 'approved' || !doc.parent) return doc
  try {
    const parentId = typeof doc.parent === 'object' ? doc.parent.id : doc.parent
    const parent: any = await req.payload.findByID({ collection: 'comments' as any, id: parentId, depth: 0, overrideAccess: true, req })
    if (!parent?.notifyReplies || !parent.authorEmail || parent.authorEmail === doc.authorEmail) return doc
    const ref = doc.post
    const target: any = ref?.value ? await req.payload.findByID({ collection: ref.relationTo, id: typeof ref.value === 'object' ? ref.value.id : ref.value, depth: 0, overrideAccess: true, req }).catch(() => null) : null
    const link = target ? `${SITE_URL}${getPath(ref.relationTo, target)}/#comment-${doc.id}` : SITE_URL
    void req.payload.sendEmail({ to: parent.authorEmail, subject: `New reply to your comment${target ? ` on “${target.title}”` : ''}`, text: `${doc.authorName || 'Someone'} replied to your comment:\n\n${doc.content}\n\nRead it: ${link}\n\nYou receive this because you asked to be notified of replies.` }).catch(() => {})
  } catch { /* never block moderation */ }
  return doc
}

export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: { singular: 'Comment', plural: 'Comments' },
  admin: {
    group: 'Content',
    useAsTitle: 'content',
    defaultColumns: ['authorName', 'content', 'post', 'createdAt'],
    listSearchableFields: ['content', 'authorName', 'authorEmail'],
    components: { beforeListTable: ['/components/admin/wp/CommentsTop#CommentsTop'] },
  },
  defaultSort: '-createdAt',
  hooks: { afterChange: [notifyParent] },
  access: {
    // public can read approved comments (private fields are hidden below); staff see everything
    read: ({ req: { user } }) => (isStaff(user) ? true : { status: { equals: 'approved' } }),
    create: can('moderate_comments'),
    update: can('moderate_comments'),
    delete: can('moderate_comments'),
  },
  fields: [
    { name: 'content', type: 'textarea', required: true, label: 'Comment', admin: { components: { Cell: '/components/admin/wp/CommentCell#CommentCell' } } },
    { name: 'status', type: 'select', required: true, defaultValue: 'pending', index: true, options: [{ label: 'Approved', value: 'approved' }, { label: 'Pending', value: 'pending' }, { label: 'Spam', value: 'spam' }, { label: 'Trash', value: 'trash' }], admin: { position: 'sidebar' } },
    { name: 'post', type: 'relationship', relationTo: [...COMMENTABLE], required: true, label: 'In response to', index: true, admin: { position: 'sidebar', components: { Cell: '/components/admin/wp/CommentPost#CommentPost' } } },
    { name: 'parent', type: 'relationship', relationTo: 'comments' as any, label: 'Reply to', admin: { position: 'sidebar' } },
    { name: 'authorName', type: 'text', label: 'Name', admin: { components: { Cell: '/components/admin/wp/CommentAuthor#CommentAuthor' } } },
    { name: 'authorEmail', type: 'email', label: 'Email', access: { read: staff } },
    { name: 'authorUrl', type: 'text', label: 'Website' },
    { name: 'notifyReplies', type: 'checkbox', label: 'Email the author about replies', defaultValue: false, access: { read: staff }, admin: { position: 'sidebar' } },
    { name: 'user', type: 'relationship', relationTo: 'users', label: 'Registered user', admin: { position: 'sidebar', readOnly: true } },
    { name: 'ip', type: 'text', label: 'IP address', access: { read: staff }, admin: { position: 'sidebar', readOnly: true } },
    { name: 'userAgent', type: 'text', label: 'User agent', access: { read: staff }, admin: { position: 'sidebar', readOnly: true } },
  ],
}
