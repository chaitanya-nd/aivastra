import type { AdminViewServerProps } from 'payload'
import { TwoFactorClient } from './TwoFactorClient'
import { ToolView } from './ToolView'

/** Users → Two-factor login (Wordfence / Two Factor plugin). */
export async function TwoFactor(props: AdminViewServerProps) {
  const { user, payload } = props.initPageResult.req
  const u: any = user ? await payload.findByID({ collection: 'users', id: user.id, depth: 0, overrideAccess: true, showHiddenFields: true }) : null
  const admins = await payload.find({ collection: 'users', where: { role: { equals: 'admin' } }, depth: 0, limit: 100, overrideAccess: true })
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Two-factor login <small>Security</small></h1>
      <TwoFactorClient enabled={Boolean(u?.totpEnabled)} email={u?.email ?? ''} recoveryLeft={Array.isArray(u?.recoveryCodes) ? u.recoveryCodes.length : 0} />
      {(user as any)?.role === 'admin' && (
        <section className="wpw" style={{ marginTop: 20 }}><h2>Administrators</h2>
          <ul className="sv-checks">{(admins.docs as any[]).map((a) => <li key={a.id} className={a.totpEnabled ? 'ok' : 'no'}><b>{a.name || a.email}</b><span>{a.totpEnabled ? 'Two-factor login on' : 'Password only — ask them to turn on two-factor login'}</span></li>)}</ul>
        </section>
      )}
    </ToolView>
  )
}
