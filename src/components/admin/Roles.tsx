import type { AdminViewServerProps } from 'payload'
import { ToolView } from './ToolView'

const CAPS: [string, boolean, boolean, boolean][] = [
  ['Edit pages, posts, guides, case studies, updates, reviews', true, true, true],
  ['Publish content', true, true, true],
  ['Upload and edit media', true, true, true],
  ['Edit menus and global content', true, true, true],
  ['Edit SEO fields on content (title, description, schema, robots)', true, true, false],
  ['Titles & Meta, sitemap and plugin settings', true, true, false],
  ['Redirections and 404 Monitor', true, true, false],
  ['Contact forms and messages', true, true, true],
  ['Create / delete users and change roles', true, false, false],
  ['Backups and cache purge', true, false, false],
]
const mark = (b: boolean) => <span style={{ color: b ? 'var(--av-ok)' : 'var(--av-dim)' }}>{b ? '✓' : '—'}</span>

export function Roles(props: AdminViewServerProps) {
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Role Manager <small style={{ fontSize: 13, color: 'var(--av-dim)', fontWeight: 400 }}>Rank Math</small></h1>
      <section className="wpw">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Capability', 'Administrator', 'SEO manager', 'Editor'].map((h) => <th key={h} style={{ textAlign: h === 'Capability' ? 'left' : 'center', padding: '14px 20px', color: 'var(--av-mute)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>)}</tr></thead>
          <tbody>{CAPS.map(([c, a, s, e]) => <tr key={c} style={{ borderTop: '1px solid var(--av-line2)' }}><td style={{ padding: '12px 20px' }}>{c}</td><td style={{ textAlign: 'center' }}>{mark(a)}</td><td style={{ textAlign: 'center' }}>{mark(s)}</td><td style={{ textAlign: 'center' }}>{mark(e)}</td></tr>)}</tbody>
        </table>
        <p className="wpw-foot">Assign a role per user under Users → edit user → Role.</p>
      </section>
    </ToolView>
  )
}
