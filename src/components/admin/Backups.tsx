import type { AdminViewServerProps } from 'payload'
import { ToolView } from './ToolView'
import { ToolButton } from './ToolButton'

export function Backups(props: AdminViewServerProps) {
  const isAdmin = (props.initPageResult.req.user as any)?.role === 'admin'
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Backups <small style={{ fontSize: 13, color: 'var(--av-dim)', fontWeight: 400 }}>UpdraftPlus</small></h1>
      <div className="wpd-grid">
        <section className="wpw"><h2>Backup now</h2>
          <div style={{ padding: '16px 20px' }}>
            <p style={{ marginTop: 0, color: 'var(--av-mute)' }}>Downloads one JSON file with every page, post, guide, case study, update, review, taxonomy, media record, redirection, form and submission, plus menus and settings (including drafts). Users are exported without password data.</p>
            {isAdmin ? <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><ToolButton action="backup" label="Backup now (download)" download /><ToolButton action="backup-media" label="Media files (.tar.gz)" download /></div> : <p className="wpw-warn">Only administrators can export backups.</p>}
          </div>
        </section>
        <section className="wpw"><h2>Database &amp; files</h2>
          <p style={{ padding: '16px 20px', margin: 0, color: 'var(--av-mute)' }}>Full database backups run at the infrastructure level: <code>make db-dump</code> locally, and the managed Postgres snapshots in production. “Media files” downloads the local media folder as .tar.gz when there is one; once media is in the storage bucket (R2) it is versioned there.</p>
        </section>
      </div>
    </ToolView>
  )
}
