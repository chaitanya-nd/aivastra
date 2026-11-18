import type { UIFieldServerComponent } from 'payload'
const row = (k: string, ok: boolean, hint: string) => <li key={k}><code>{k}</code><span style={{ color: ok ? 'var(--av-ok)' : 'var(--av-warn)' }}>{ok ? 'configured' : hint}</span></li>
export const EnvStatus: UIFieldServerComponent = () => (
  <div className="wpw" style={{ marginBottom: 18 }}>
    <h2>Connection status</h2>
    <ul className="wpw-list" style={{ padding: '8px 0' }}>
      {row('MAILCHIMP_API_KEY', !!process.env.MAILCHIMP_API_KEY, 'missing — add to .env')}
      {row('MAILCHIMP_LIST_ID', !!process.env.MAILCHIMP_LIST_ID, 'missing — or set the Audience ID above')}
      {row('SMTP_HOST (form emails)', !!process.env.SMTP_HOST, 'missing — mails are logged, not sent')}
    </ul>
  </div>
)
