import type { ServerProps } from 'payload'
import { ICONS } from './wp-icons'

/** WordPress-style black admin bar across the top. */
export function AdminBar({ user, payload }: ServerProps) {
  const name = (user as any)?.name || (user as any)?.email || 'there'
  const siteName = 'AI Vastra'
  void payload
  const Icon = ({ n }: { n: string }) => <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={ICONS[n]} fill="currentColor" /></svg>
  return (
    <div className="wpbar">
      <div className="wpbar-l">
        <a href="/admin" className="wpbar-i" title="Dashboard"><Icon n="dashboard" /></a>
        <a href="/" target="_blank" rel="noreferrer" className="wpbar-i"><Icon n="site" /> {siteName}</a>
        <div className="wpbar-i wpbar-new" tabIndex={0}>
          <span>＋ New</span>
          <div className="wpbar-menu">
            <a href="/admin/collections/posts/create">Post</a>
            <a href="/admin/collections/pages/create">Page</a>
            <a href="/admin/collections/guides/create">Guide</a>
            <a href="/admin/collections/cases/create">Case study</a>
            <a href="/admin/collections/updates/create">Product update</a>
            <a href="/admin/collections/media/create">Media</a>
          </div>
        </div>
        <a href="/admin/collections/redirects" className="wpbar-i">Redirects</a>
      </div>
      <div className="wpbar-r">
        <div className="wpbar-i wpbar-new" tabIndex={0}>
          <span>Howdy, <b>{name}</b></span>
          <div className="wpbar-menu right">
            <a href={`/admin/collections/users/${(user as any)?.id ?? ''}`}>Edit Profile</a>
            <a href="/admin/logout">Log Out</a>
          </div>
        </div>
      </div>
    </div>
  )
}
