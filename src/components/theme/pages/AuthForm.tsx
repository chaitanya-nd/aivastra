/** Minimal front-end login / registration form in the theme's markup. */
export function AuthForm({ mode, error, redirectTo, canRegister, notice, privacyUrl }: { mode: 'login' | 'register'; error?: string; redirectTo: string; canRegister: boolean; notice?: string; privacyUrl?: string | null }) {
  const login = mode === 'login'
  return (
    <div className="container sec cms" style={{ maxWidth: 480, paddingTop: 60, paddingBottom: 80 }}>
      <h1>{login ? 'Log in' : 'Create an account'}</h1>
      {!login && <p>Register to join the discussion. Your account can comment on articles.</p>}
      {error && <p role="alert" style={{ color: '#d93450' }}>{error}</p>}
      {notice && <p role="status" style={{ color: '#1f9d55' }}>{notice}</p>}
      <form action={login ? '/api/av/login' : '/api/av/register'} method="post" className="wpcf7-form" style={{ display: 'grid', gap: 14 }}>
        <input type="hidden" name="redirect_to" value={redirectTo} />
        {!login && <label>Name<input name="name" autoComplete="name" required /></label>}
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete={login ? 'current-password' : 'new-password'} minLength={login ? undefined : 10} required /></label>
        {!login && <input name="website_url" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: -9999 }} aria-hidden="true" />}
        {!login && privacyUrl && <p style={{ margin: 0, fontSize: 14 }}>By registering you agree to our <a href={privacyUrl}>privacy policy</a>.</p>}
        <button type="submit" className="ui-view-more-btn">{login ? 'Log in' : 'Register'}</button>
      </form>
      <p style={{ marginTop: 18 }}>
        {login ? (canRegister ? <a href={`/register/?redirect_to=${encodeURIComponent(redirectTo)}`}>Create an account</a> : null) : <a href={`/login/?redirect_to=${encodeURIComponent(redirectTo)}`}>Already registered? Log in</a>}
        {login && <> {canRegister ? '· ' : ''}<a href="/lost-password/">Lost your password?</a></>}
      </p>
    </div>
  )
}
