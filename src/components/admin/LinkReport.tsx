import type { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import { orphans } from '@/lib/brokenLinks'
import { incomingMap } from '@/lib/linkIndex'
import { BrokenLinks } from './BrokenLinks'
import { ToolView } from './ToolView'

const LABEL: Record<string, string> = { posts: 'Post', pages: 'Page', guides: 'Guide', cases: 'Case study', updates: 'Update', reviews: 'Review' }

/** Rank Math → Link reports: orphan content and broken links. */
export async function LinkReport(props: AdminViewServerProps) {
  const { payload } = props.initPageResult.req
  const list = await orphans(payload, await incomingMap(payload))
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Link reports <small>Internal linking</small></h1>
      <div className="wpd-grid">
        <section className="wpw"><h2>Orphan content <small>{list.length} published items with no internal links pointing to them</small></h2>
          <ul className="wpw-list" style={{ padding: '4px 0', maxHeight: 560, overflow: 'auto' }}>
            {list.map((o) => <li key={`${o.collection}${o.id}`}><Link href={`/admin/collections/${o.collection}/${o.id}`}>{o.title}</Link><span>{LABEL[o.collection]} · {o.path}</span></li>)}
            {list.length === 0 && <li><span>Every published item has at least one incoming link.</span></li>}
          </ul>
          <p className="wpw-foot">Link to these from related articles — search engines find and rank orphan pages poorly. The SEO box’s “Link suggestions” tab helps.</p>
        </section>
        <BrokenLinks />
      </div>
    </ToolView>
  )
}
