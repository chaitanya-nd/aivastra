import type { AdminViewServerProps } from 'payload'
import { COLLECTION_BASE, getPath, SITE_URL } from '@/lib/urls'
import { ToolView } from './ToolView'

const ROWS: [string, string, string][] = [
  ['Pages', 'pages', 'Parent path + slug (e.g. /documentations/getting-started/)'],
  ['Posts', 'posts', '/%postname%/'],
  ['Guides', 'guides', `${COLLECTION_BASE.guides}/%postname%/`],
  ['Case studies', 'cases', `${COLLECTION_BASE.cases}/%postname%/`],
  ['Product updates', 'updates', `${COLLECTION_BASE.updates}/%postname%/`],
  ['Reviews', 'reviews', `${COLLECTION_BASE.reviews}/%postname%/`],
  ['Category base', 'categories', `${COLLECTION_BASE.categories}/%category%/`],
  ['Tag base', 'tags', `${COLLECTION_BASE.tags}/%post_tag%/`],
]

/** Settings → Permalinks. The structure is fixed to the WordPress one (so rankings carry over); every real URL is editable per item. */
export async function Permalinks(props: AdminViewServerProps) {
  const { payload } = props.initPageResult.req
  const examples = await Promise.all(ROWS.map(async ([, c]) => {
    const d: any = (await payload.find({ collection: c as any, limit: 1, depth: 0, overrideAccess: true, ...(c === 'pages' ? { where: { slug: { not_equals: 'home' } } } : {}) } as any)).docs[0]
    return d ? `${SITE_URL}${getPath(c, d)}/`.replace(/\/\/$/, '/') : '—'
  }))
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Permalink Settings</h1>
      <section className="wpw"><h2>Common Settings</h2>
        <ul className="wpw-list" style={{ padding: '6px 0' }}>
          {['Plain', 'Day and name', 'Month and name', 'Numeric', 'Post name', 'Custom Structure'].map((o) => (
            <li key={o} style={{ display: 'flex', gap: 12, justifyContent: 'flex-start', alignItems: 'center' }}><input type="radio" disabled checked={o === 'Post name'} readOnly /> <b>{o}</b> {o === 'Post name' && <code>{SITE_URL}/sample-post/</code>}</li>
          ))}
        </ul>
        <p className="wpw-foot" style={{ border: 0 }}>The structure is locked to <b>Post name</b> with a trailing slash — identical to the original WordPress site, so every existing URL and ranking keeps working. Change an individual URL with the <b>Permalink → Edit</b> link on any post or page; a redirection is created automatically when you do.</p>
      </section>
      <section className="wpw" style={{ marginTop: 18 }}><h2>Structure by content type</h2>
        <ul className="wpw-list" style={{ padding: '4px 0' }}>
          {ROWS.map(([label, , pat], i) => (
            <li key={label} style={{ display: 'grid', gridTemplateColumns: '170px 1fr 1fr', gap: 12 }}><b>{label}</b><code>{pat}</code><span style={{ color: 'var(--av-mute)', wordBreak: 'break-all' }}>{examples[i]}</span></li>
          ))}
        </ul>
      </section>
      <section className="wpw" style={{ marginTop: 18 }}><h2>Optional</h2>
        <p style={{ padding: '14px 20px', margin: 0, color: 'var(--av-mute)' }}>Trailing slash: always on (301 from the slash-less URL). Redirections for moved URLs: Rank Math → Redirections. Unknown URLs are logged in Rank Math → 404 Monitor.</p>
      </section>
    </ToolView>
  )
}
