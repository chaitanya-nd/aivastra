import type { Access, FieldAccess } from 'payload'
import { can, fieldCan, isStaff } from './caps'

export { can, fieldCan, isStaff, userCan, capsOf } from './caps'

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)
export const isAdmin: Access = ({ req: { user } }) => (user as any)?.role === 'admin'
/** Any staff role (not subscribers). */
export const isStaffAccess: Access = ({ req: { user } }) => isStaff(user)

// Capability-backed helpers (names kept for existing call sites)
export const canEditContent = can('edit_posts')
export const canEditSEO = can('manage_seo_tools')
export const seoFieldAccess: FieldAccess = fieldCan('edit_seo')

/** Published docs are public; drafts only for staff (subscribers are logged in but not staff). */
export const publishedOrStaff: Access = ({ req: { user } }) => (isStaff(user) ? true : { _status: { equals: 'published' } })
export const anyone: Access = () => true
