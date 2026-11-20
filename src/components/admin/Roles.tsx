import type { AdminViewServerProps } from 'payload'
import { CAPS, DEFAULT_CAPS, LOCKED, ROLE_LABELS, ROLES, type Cap } from '@/access/caps'
import { RoleMatrix } from './RoleMatrix'
import { ToolView } from './ToolView'

/** Users → Role Manager: editable capability matrix (WordPress User Role Editor / Rank Math Role Manager). */
export async function Roles(props: AdminViewServerProps) {
  const { payload, user } = props.initPageResult.req
  const g: any = await payload.findGlobal({ slug: 'role-capabilities' as any, depth: 0, overrideAccess: true }).catch(() => null)
  const saved = (g?.matrix ?? {}) as Record<string, Cap[]>
  const matrix = Object.fromEntries(ROLES.map((r) => [r, LOCKED.includes(r) || !Array.isArray(saved[r]) ? DEFAULT_CAPS[r] : saved[r]]))
  const counts = Object.fromEntries(await Promise.all(ROLES.map(async (r) => [r, (await payload.count({ collection: 'users', where: { role: { equals: r } }, overrideAccess: true })).totalDocs] as const)))
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Role Manager <small>Users</small></h1>
      <RoleMatrix
        roles={ROLES.map((r) => ({ key: r, label: ROLE_LABELS[r], locked: LOCKED.includes(r), users: counts[r] ?? 0 }))}
        caps={Object.entries(CAPS).map(([key, label]) => ({ key, label }))}
        initial={matrix}
        defaults={DEFAULT_CAPS}
        canEdit={(user as any)?.role === 'admin'}
      />
    </ToolView>
  )
}
