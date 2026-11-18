import type { Access, FieldAccess } from 'payload'

type Role = 'admin' | 'seo' | 'editor'
type U = { role?: Role } | null | undefined

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)
export const hasRole =
  (...roles: Role[]): Access =>
  ({ req: { user } }) =>
    Boolean(user && roles.includes((user as U)?.role as Role))
export const isAdmin = hasRole('admin')
export const canEditContent = hasRole('admin', 'seo', 'editor')
export const canEditSEO = hasRole('admin', 'seo')

/** Published docs are public; drafts only for logged-in staff. */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
export const anyone: Access = () => true

export const seoFieldAccess: FieldAccess = ({ req: { user } }) =>
  Boolean(user && ['admin', 'seo'].includes((user as U)?.role as string))
