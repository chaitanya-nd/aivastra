import type { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import { ToolView } from './ToolView'

const COLLS = ['posts', 'guides', 'cases', 'updates', 'reviews'] as const
const LABEL: Record<string, string> = { posts: 'Post', guides: 'Guide', cases: 'Case study', updates: 'Update', reviews: 'Review' }
type Entry = { id: string | number; title: string; collection: string; at: string; kind: 'published' | 'scheduled' }

/** Posts → Calendar: published and scheduled content by day (WordPress "Editorial Calendar"). */
export async function EditorialCalendar(props: AdminViewServerProps) {
  const { payload } = props.initPageResult.req
  const sp = (props.searchParams || {}) as Record<string, string>
  const now = new Date()
  const [y, m] = /^\d{4}-\d{2}$/.test(sp.month || '') ? sp.month.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1]
  const from = new Date(y, m - 1, 1), to = new Date(y, m, 1)
  const entries: Entry[] = []

  for (const collection of COLLS) {
    const res = await payload.find({ collection, where: { and: [{ _status: { equals: 'published' } }, { publishedAt: { greater_than_equal: from.toISOString() } }, { publishedAt: { less_than: to.toISOString() } }] }, depth: 0, pagination: false, limit: 1000, overrideAccess: true, select: { title: true, publishedAt: true } as any }).catch(() => ({ docs: [] as any[] }))
    for (const d of res.docs as any[]) entries.push({ id: d.id, title: d.title || '(no title)', collection, at: d.publishedAt, kind: 'published' })
  }
  const jobs = await payload.find({ collection: 'payload-jobs' as any, where: { and: [{ taskSlug: { equals: 'schedulePublish' } }, { completedAt: { exists: false } }, { waitUntil: { greater_than_equal: from.toISOString() } }, { waitUntil: { less_than: to.toISOString() } }] }, depth: 0, pagination: false, limit: 500, overrideAccess: true }).catch(() => ({ docs: [] as any[] }))
  for (const j of jobs.docs as any[]) {
    const ref = j.input?.doc
    if (!ref?.relationTo || j.input?.type === 'unpublish') continue
    const d: any = await payload.findByID({ collection: ref.relationTo, id: ref.value, depth: 0, draft: true, overrideAccess: true }).catch(() => null)
    if (d) entries.push({ id: d.id, title: d.title || '(no title)', collection: ref.relationTo, at: j.waitUntil, kind: 'scheduled' })
  }
  const drafts = await payload.find({ collection: 'posts', where: { _status: { equals: 'draft' } }, sort: '-updatedAt', limit: 8, depth: 0, overrideAccess: true, select: { title: true, updatedAt: true } as any })

  const byDay = new Map<number, Entry[]>()
  for (const e of entries) { const d = new Date(e.at).getDate(); byDay.set(d, [...(byDay.get(d) ?? []), e]) }
  const days = new Date(y, m, 0).getDate()
  const lead = (from.getDay() + 6) % 7 // Monday first
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const iso = (yy: number, mm: number) => `${yy}-${String(mm).padStart(2, '0')}`
  const prev = m === 1 ? iso(y - 1, 12) : iso(y, m - 1), next = m === 12 ? iso(y + 1, 1) : iso(y, m + 1)
  const today = now.getFullYear() === y && now.getMonth() + 1 === m ? now.getDate() : -1
  const scheduled = entries.filter((e) => e.kind === 'scheduled').length

  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Calendar <small>Editorial</small></h1>
      <div className="cal-bar">
        <Link className="wp-btn" href={`/admin/calendar?month=${prev}`}>‹ Previous</Link>
        <h2>{from.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <Link className="wp-btn" href={`/admin/calendar?month=${next}`}>Next ›</Link>
        <span className="cal-legend"><i className="published" /> Published <i className="scheduled" /> Scheduled ({scheduled})</span>
        <Link className="wp-btn primary" href="/admin/collections/posts/create">New post</Link>
      </div>
      <div className="cal-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="cal-h">{d}</div>)}
        {cells.map((d, i) => (
          <div key={i} className={`cal-d${d === null ? ' empty' : ''}${d === today ? ' today' : ''}`}>
            {d !== null && <b>{d}</b>}
            {d !== null && (byDay.get(d) ?? []).sort((a, b) => a.at.localeCompare(b.at)).map((e) => (
              <Link key={`${e.collection}${e.id}${e.kind}`} href={`/admin/collections/${e.collection}/${e.id}`} className={`cal-e ${e.kind}`} title={`${LABEL[e.collection]} · ${new Date(e.at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}>
                {e.title}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <section className="wpw" style={{ marginTop: 22 }}><h2>Unscheduled drafts</h2>
        <ul className="wpw-list" style={{ padding: '4px 0' }}>
          {(drafts.docs as any[]).map((d) => <li key={d.id}><Link href={`/admin/collections/posts/${d.id}`}>{d.title || '(no title)'}</Link><span>{new Date(d.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></li>)}
          {drafts.docs.length === 0 && <li><span style={{ color: 'var(--av-mute)' }}>No drafts.</span></li>}
        </ul>
        <p className="wpw-foot">To schedule a draft, open it and use Publish → Schedule.</p>
      </section>
    </ToolView>
  )
}
