import type { AdminViewServerProps } from 'payload'
import { SeoBulkClient } from './SeoBulkClient'
import { ToolView } from './ToolView'

/** Rank Math → Bulk edit SEO: title, description and focus keyword for many items at once. */
export function SeoBulk(props: AdminViewServerProps) {
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Bulk SEO editor <small>Rank Math</small></h1>
      <SeoBulkClient />
    </ToolView>
  )
}
