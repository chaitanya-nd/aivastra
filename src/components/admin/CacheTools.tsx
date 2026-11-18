import type { AdminViewServerProps } from 'payload'
import { ToolView } from './ToolView'
import { ToolButton } from './ToolButton'

export function CacheTools(props: AdminViewServerProps) {
  const isAdmin = (props.initPageResult.req.user as any)?.role === 'admin'
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Cache <small style={{ fontSize: 13, color: 'var(--av-dim)', fontWeight: 400 }}>LiteSpeed Cache · Cloudflare</small></h1>
      <div className="wpd-grid">
        <section className="wpw"><h2>Purge all</h2>
          <div style={{ padding: '16px 20px' }}>
            <p style={{ marginTop: 0, color: 'var(--av-mute)' }}>Pages are cached and refreshed automatically whenever you publish. Purge to force every page, menu and setting to be rebuilt right now.</p>
            {isAdmin ? <ToolButton action="purge" label="Purge all caches" /> : <p className="wpw-warn">Only administrators can purge caches.</p>}
          </div>
        </section>
        <section className="wpw"><h2>CDN</h2>
          <p style={{ padding: '16px 20px', margin: 0, color: 'var(--av-mute)' }}>Edge caching is handled by your CDN in production. Add a deploy hook calling <code>POST /api/revalidate</code> with <code>x-revalidate-secret</code> to purge it on publish.</p>
        </section>
      </div>
    </ToolView>
  )
}
