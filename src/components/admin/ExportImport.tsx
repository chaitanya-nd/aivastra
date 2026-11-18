import type { AdminViewServerProps } from 'payload'
import { ToolView } from './ToolView'
import { ImportForm } from './ImportForm'
import { ToolButton } from './ToolButton'

const TYPES = [['all', 'All content'], ['posts', 'Posts'], ['pages', 'Pages'], ['guides', 'Guides'], ['cases', 'Case studies'], ['updates', 'Product updates'], ['reviews', 'Reviews'], ['comments', 'Comments'], ['redirects', 'Redirections'], ['forms', 'Contact forms']]

/** Tools → Export / Import (WordPress). */
export function ExportImport(props: AdminViewServerProps) {
  const isAdmin = (props.initPageResult.req.user as any)?.role === 'admin'
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Export &amp; Import</h1>
      {!isAdmin ? <p className="wpw-warn">Only administrators can export or import.</p> : (
        <div className="wpd-grid">
          <section className="wpw"><h2>Export</h2>
            <div style={{ padding: '16px 20px', display: 'grid', gap: 12 }}>
              <p style={{ margin: 0, color: 'var(--av-mute)' }}>Download a JSON file of the content you choose (drafts included). Use <b>Import</b> to load it into another site.</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{TYPES.map(([k, l]) => <ToolButton key={k} action={k === 'all' ? 'backup' : `export&type=${k}`} label={l} download />)}</div>
            </div>
          </section>
          <section className="wpw"><h2>Import</h2><ImportForm /></section>
        </div>
      )}
    </ToolView>
  )
}
