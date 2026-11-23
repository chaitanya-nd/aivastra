'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getPath, SITE_URL } from '@/lib/urls'

/** Comments → "In response to": post title, link to edit + view comment on the site. */
export function CommentPost({ cellData, rowData }: any) {
  const rel: string | undefined = cellData?.relationTo
  const v = cellData?.value
  const id = typeof v === 'object' ? v?.id : v
  const [doc, setDoc] = useState<any>(typeof v === 'object' ? v : null)
  useEffect(() => {
    if (rel && id && !doc) fetch(`/api/${rel}/${id}?depth=0`, { credentials: 'include' }).then((r) => r.json()).then(setDoc).catch(() => {})
  }, [rel, id, doc])
  if (!rel || !id) return <>—</>
  return (
    <div className="wpc-author">
      <Link href={`/admin/collections/${rel}/${id}`}><b style={{ color: '#7dd3fc' }}>{doc?.title ?? `#${id}`}</b></Link>
      {doc?.slug && <a href={`${SITE_URL}${getPath(rel, doc)}/#comment-${rowData?.id}`} target="_blank" rel="noreferrer">View comment on site ↗</a>}
    </div>
  )
}
