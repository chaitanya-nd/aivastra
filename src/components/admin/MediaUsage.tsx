import type { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import { ToolView } from './ToolView'

const SOURCES = ['posts', 'pages', 'guides', 'cases', 'updates', 'reviews', 'categories', 'tags', 'section-categories', 'users', 'patterns'] as const
const GLOBALS = ['site-settings', 'navigation', 'global-content', 'plugin-settings'] as const
const IMAGE_KEYS = new Set(['image', 'featuredImage', 'logo', 'favicon', 'defaultOgImage', 'homeOgImage', 'avatar'])
const FILE = /([^/"'\s?#()<>\\]+?)(?:-\d+x\d+)?\.(png|jpe?g|webp|gif|svg|avif|pdf|mp4)\b/gi
const base = (name: string) => name.toLowerCase().replace(/-\d+x\d+(?=\.[a-z0-9]+$)/, '').replace(/\.(jpe?g)$/, '.jpg')

/** Media → Unused media: files no post, page, setting or author refers to (by relationship or by URL in the content). */
export async function MediaUsage(props: AdminViewServerProps) {
  const { payload } = props.initPageResult.req
  const ids = new Set<string>()
  const names = new Set<string>()
  const walk = (v: any, key?: string) => {
    if (v == null) return
    if (typeof v === 'string') { for (const m of v.matchAll(FILE)) names.add(base(`${m[1]}.${m[2]}`)); return }
    if (typeof v === 'number') { if (key && IMAGE_KEYS.has(key)) ids.add(String(v)); return }
    if (Array.isArray(v)) { v.forEach((x) => walk(x, key)); return }
    if (typeof v === 'object') {
      if (key && IMAGE_KEYS.has(key) && v.id != null) ids.add(String(v.id))
      for (const [k, x] of Object.entries(v)) walk(x, k)
    }
  }
  for (const collection of SOURCES) {
    const res = await payload.find({ collection: collection as any, depth: 0, pagination: false, limit: 10000, overrideAccess: true, draft: true } as any).catch(() => ({ docs: [] as any[] }))
    res.docs.forEach((d: any) => walk(d))
  }
  for (const slug of GLOBALS) walk(await payload.findGlobal({ slug: slug as any, depth: 0, overrideAccess: true }).catch(() => null))

  const all = await payload.find({ collection: 'media', depth: 0, pagination: false, limit: 10000, overrideAccess: true, sort: '-createdAt' })
  const unused = (all.docs as any[]).filter((m) => !ids.has(String(m.id)) && !names.has(base(String(m.filename || ''))) && !(m.externalUrl && names.has(base(String(m.externalUrl).split('/').pop() || ''))))
  return (
    <ToolView props={props}>
      <h1 className="wpd-title">Unused media <small>Media Library</small></h1>
      <p style={{ color: 'var(--av-mute)', marginTop: 0, maxWidth: 760 }}>{unused.length} of {all.totalDocs} media items are not used by any post, page, pattern, setting or author — neither as a featured / SEO image nor by URL in the content. Review before deleting: files linked from outside this site will not show up here.</p>
      <div className="wmed-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14 }}>
        {unused.slice(0, 300).map((m) => (
          <Link key={m.id} href={`/admin/collections/media/${m.id}`} className="wpm-unused" title={m.filename}>
            {String(m.mimeType || '').startsWith('image/') ? <img src={m.thumbnailURL || m.url} alt={m.alt || ''} loading="lazy" /> : <span>{m.filename}</span>}
            <em>{m.filename}</em>
          </Link>
        ))}
      </div>
      {unused.length > 300 && <p style={{ color: 'var(--av-mute)' }}>Showing the newest 300.</p>}
    </ToolView>
  )
}
