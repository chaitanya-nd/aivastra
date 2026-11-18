import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'

const COLLECTIONS = ['pages', 'posts', 'guides', 'cases', 'updates', 'reviews'] as const

type Issue = { level: 'error' | 'warn'; text: string }

function audit(doc: any, collection: string): Issue[] {
  const m = doc.meta || {}
  const issues: Issue[] = []
  if (!m.title) issues.push({ level: 'warn', text: 'No custom meta title (falls back to title)' })
  else if (m.title.length > 60) issues.push({ level: 'warn', text: `Meta title ${m.title.length} chars (>60)` })
  if (!m.description) issues.push({ level: 'error', text: 'Missing meta description' })
  else if (m.description.length < 70) issues.push({ level: 'warn', text: `Meta description short (${m.description.length})` })
  else if (m.description.length > 160) issues.push({ level: 'warn', text: `Meta description long (${m.description.length})` })
  if (!m.image && !doc.featuredImage) issues.push({ level: 'warn', text: 'No social/featured image' })
  if (collection === 'posts' && !m.focusKeyword) issues.push({ level: 'warn', text: 'No focus keyword' })
  if (m.noindex) issues.push({ level: 'warn', text: 'Set to noindex' })
  return issues
}

export async function SeoAudit(props: AdminViewServerProps) {
  const { initPageResult, params, searchParams } = props
  const { req } = initPageResult
  const { payload } = req

  const rows: { collection: string; doc: any; issues: Issue[] }[] = []
  for (const collection of COLLECTIONS) {
    const res = await payload.find({
      collection,
      limit: 500,
      depth: 0,
      pagination: false,
      where: { _status: { equals: 'published' } },
    })
    for (const doc of res.docs) {
      const issues = audit(doc, collection)
      if (issues.length) rows.push({ collection, doc, issues })
    }
  }
  rows.sort(
    (a, b) =>
      b.issues.filter((i) => i.level === 'error').length - a.issues.filter((i) => i.level === 'error').length ||
      b.issues.length - a.issues.length,
  )
  const errors = rows.reduce((n, r) => n + r.issues.filter((i) => i.level === 'error').length, 0)

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1>SEO audit</h1>
        <p>
          {rows.length} published documents need attention · {errors} errors. Only published content is checked.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--theme-elevation-150)' }}>
              <th style={{ padding: 8 }}>Document</th>
              <th style={{ padding: 8 }}>Type</th>
              <th style={{ padding: 8 }}>Issues</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ collection, doc, issues }) => (
              <tr key={`${collection}-${doc.id}`} style={{ borderBottom: '1px solid var(--theme-elevation-100)', verticalAlign: 'top' }}>
                <td style={{ padding: 8 }}>
                  <Link href={`/admin/collections/${collection}/${doc.id}`}>{doc.title}</Link>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>/{doc.slug}</div>
                </td>
                <td style={{ padding: 8 }}>{collection}</td>
                <td style={{ padding: 8 }}>
                  {issues.map((i, n) => (
                    <div key={n} style={{ color: i.level === 'error' ? '#c0392b' : '#8a6d00' }}>
                      {i.level === 'error' ? '● ' : '○ '}
                      {i.text}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: 16 }}>
                  All published content passes the checks. 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Gutter>
    </DefaultTemplate>
  )
}
