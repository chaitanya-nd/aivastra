const box = { maxWidth: 480, paddingTop: 60, paddingBottom: 80 }
const grid = { display: 'grid', gap: 14 }
const Alert = ({ error, ok }: { error?: string; ok?: string }) => (error ? <p role="alert" style={{ color: '#d93450' }}>{error}</p> : ok ? <p role="status" style={{ color: '#1f9d55' }}>{ok}</p> : null)

export function LostPassword({ sent, error }: { sent?: boolean; error?: string }) {
  return (
    <div className="container sec cms" style={box}>
      <h1>Lost your password?</h1>
      <p>Enter your email address and we will send you a link to create a new password.</p>
      <Alert error={error} ok={sent ? 'If an account exists for that email, a reset link is on its way.' : undefined} />
      <form action="/api/av/account/lost-password" method="post" style={grid}>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <button type="submit" className="ui-view-more-btn">Get new password</button>
      </form>
      <p style={{ marginTop: 18 }}><a href="/login/">← Back to log in</a></p>
    </div>
  )
}

export function ResetPassword({ token, error }: { token: string; error?: string }) {
  return (
    <div className="container sec cms" style={box}>
      <h1>Set a new password</h1>
      <Alert error={error} />
      <form action="/api/av/account/reset-password" method="post" style={grid}>
        <input type="hidden" name="token" value={token} />
        <label>New password<input name="password" type="password" autoComplete="new-password" minLength={10} required /></label>
        <button type="submit" className="ui-view-more-btn">Save password</button>
      </form>
    </div>
  )
}

export function AccountPage({ user, saved, error }: { user: any; saved?: boolean; error?: string }) {
  return (
    <div className="container sec cms" style={box}>
      <h1>Your account</h1>
      <p>Signed in as <b>{user.email}</b>. {user.role !== 'subscriber' && <a href="/admin">Go to the dashboard →</a>}</p>
      <Alert error={error} ok={saved ? 'Your profile was updated.' : undefined} />
      <form action="/api/av/account/profile" method="post" style={grid}>
        <label>Display name<input name="name" defaultValue={user.name || ''} maxLength={80} required /></label>
        <label>New password <small>(leave empty to keep the current one)</small><input name="password" type="password" autoComplete="new-password" minLength={10} /></label>
        <button type="submit" className="ui-view-more-btn">Update profile</button>
      </form>
      <p style={{ marginTop: 18 }}><a href="/api/users/logout">Log out</a></p>
    </div>
  )
}
