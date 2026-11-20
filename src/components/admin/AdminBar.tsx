import type { ServerProps } from 'payload'
import { STROKE } from './nav-icons'
import { crawlersBlocked } from '@/lib/env'
import { ThemeToggle } from './ThemeToggle'

/** Top bar: quick-create menu, site link, theme switch and account menu. */
export async function AdminBar({ user, payload }: ServerProps) {
  const settings: any = await payload.findGlobal({ slug: 'site-settings', depth: 0 }).catch(() => undefined)
  const blocked = crawlersBlocked(settings)
  const name = (user as any)?.name || (user as any)?.email || 'there'
  const role = (user as any)?.role as string | undefined
  const initials = String(name).split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('') || 'A'
  const siteName = 'AI Vastra'
  const Icon = ({ n }: { n: string }) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={STROKE[n]} /></svg>
  return (
    <div className="wpbar">
      <div className="wpbar-l">
        <div className="wpbar-i wpbar-new" tabIndex={0}>
          <span className="wpbar-cta"><Icon n="plus" /> New</span>
          <div className="wpbar-menu">
            <a href="/admin/collections/posts/create"><Icon n="post" />Post</a>
            <a href="/admin/collections/pages/create"><Icon n="page" />Page</a>
            <a href="/admin/collections/guides/create"><Icon n="article" />Guide</a>
            <a href="/admin/collections/cases/create"><Icon n="star" />Case study</a>
            <a href="/admin/collections/updates/create"><Icon n="update" />Product update</a>
            <a href="/admin/collections/media/create"><Icon n="media" />Media</a>
          </div>
        </div>
        <a href="/admin/collections/redirects" className="wpbar-i"><Icon n="redirect" /> Redirects</a>
        <a href="/admin/search-visibility" className={`wpbar-i wpbar-idx ${blocked ? 'blocked' : 'open'}`} title="Search engine indexing"><i />{blocked ? 'Indexing blocked' : 'Indexing allowed'}</a>
      </div>
      <div className="wpbar-r">
        <a href="/" target="_blank" rel="noreferrer" className="wpbar-i wpbar-site"><Icon n="site" /> {siteName} <Icon n="external" /></a>
        <ThemeToggle />
        <div className="wpbar-i wpbar-user" tabIndex={0}>
          <span className="wpbar-av">{initials}</span>
          <span className="wpbar-who"><b>{name}</b>{role ? <small>{role}</small> : null}</span>
          <Icon n="chevron" />
          <div className="wpbar-menu right">
            <a href={`/admin/collections/users/${(user as any)?.id ?? ''}`}><Icon n="users" />Edit profile</a>
            <a href="/admin/logout"><Icon n="redirect" />Log out</a>
          </div>
        </div>
      </div>
    </div>
  )
}
