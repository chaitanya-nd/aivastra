import type { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import { ToolView } from './ToolView'

const AREAS = [
  { name: 'Header — Main menu', desc: 'Links, dropdowns and the call-to-action button in the site header.', href: '/admin/globals/navigation' },
  { name: 'Footer — Columns', desc: 'Link columns, social links and copyright text in the footer.', href: '/admin/globals/navigation' },
  { name: 'Footer / popup — Contact form', desc: 'The “Get In Touch” form shown in the footer band and popups.', href: '/admin/globals/global-content' },
  { name: 'Blog — Newsletter band', desc: 'The newsletter sign-up form above the blog footer.', href: '/admin/globals/global-content' },
  { name: 'Single post — Author box & FAQ', desc: 'Per-post: Author box fields and the FAQ accordion on each post’s edit screen.', href: '/admin/collections/posts' },
  { name: 'Scripts — Header / body / footer', desc: 'Tracking pixels and custom code injected sitewide.', href: '/admin/globals/plugin-settings' },
]

/** Appearance → Widgets: every widget area of the theme and where to edit it. */
export function Widgets(props: AdminViewServerProps) {
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Widgets</h1>
      <p style={{ color: 'var(--av-mute)', maxWidth: 720 }}>This theme has fixed widget areas (it is not a drag-and-drop sidebar theme). Each area below is edited in the screen it links to.</p>
      <div className="wpd-grid">
        {AREAS.map((a) => (
          <section className="wpw" key={a.name}><h2>{a.name}</h2>
            <div style={{ padding: '14px 20px' }}><p style={{ margin: '0 0 12px', color: 'var(--av-mute)' }}>{a.desc}</p><Link className="wp-btn primary" href={a.href}>Edit</Link></div>
          </section>
        ))}
      </div>
    </ToolView>
  )
}
