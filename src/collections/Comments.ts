import type { CollectionConfig } from 'payload'
import { canEditContent } from '@/access'

export const COMMENTABLE = ['posts', 'pages', 'guides', 'cases', 'updates', 'reviews'] as const
const staff = ({ req: { user } }: any) => Boolean(user && ['admin', 'seo', 'editor'].includes(user.role))

/** WordPress Comments (wp_comments): moderated, threaded, per-doc open/closed. Created by /api/av/comment, managed in Comments. */
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
  access: {
    // public can read approved comments (private fields are hidden below); staff see everything
    read: ({ req: { user } }) => (user && ['admin', 'seo', 'editor'].includes((user as any).role) ? true : { status: { equals: 'approved' } }),
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  fields: [
    { name: 'content', type: 'textarea', required: true, label: 'Comment', admin: { components: { Cell: '/components/admin/wp/CommentCell#CommentCell' } } },
    { name: 'status', type: 'select', required: true, defaultValue: 'pending', index: true, options: [{ label: 'Approved', value: 'approved' }, { label: 'Pending', value: 'pending' }, { label: 'Spam', value: 'spam' }, { label: 'Trash', value: 'trash' }], admin: { position: 'sidebar' } },
    { name: 'post', type: 'relationship', relationTo: [...COMMENTABLE], required: true, label: 'In response to', index: true, admin: { position: 'sidebar', components: { Cell: '/components/admin/wp/CommentPost#CommentPost' } } },
    { name: 'parent', type: 'relationship', relationTo: 'comments' as any, label: 'Reply to', admin: { position: 'sidebar' } },
    { name: 'authorName', type: 'text', label: 'Name', admin: { components: { Cell: '/components/admin/wp/CommentAuthor#CommentAuthor' } } },
    { name: 'authorEmail', type: 'email', label: 'Email', access: { read: staff } },
    { name: 'authorUrl', type: 'text', label: 'Website' },
    { name: 'user', type: 'relationship', relationTo: 'users', label: 'Registered user', admin: { position: 'sidebar', readOnly: true } },
    { name: 'ip', type: 'text', label: 'IP address', access: { read: staff }, admin: { position: 'sidebar', readOnly: true } },
    { name: 'userAgent', type: 'text', label: 'User agent', access: { read: staff }, admin: { position: 'sidebar', readOnly: true } },
  ],
}
