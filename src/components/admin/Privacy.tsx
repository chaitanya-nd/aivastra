import type { AdminViewServerProps } from 'payload'
import { PrivacyClient } from './PrivacyClient'
import { ToolView } from './ToolView'

/** Tools → Export / Erase Personal Data (WordPress privacy tools). */
export function Privacy(props: AdminViewServerProps) {
  const isAdmin = (props.initPageResult.req.user as any)?.role === 'admin'
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Privacy <small>Export & erase personal data</small></h1>
      {isAdmin ? <PrivacyClient /> : <p>Only administrators can use the privacy tools.</p>}
    </ToolView>
  )
}
