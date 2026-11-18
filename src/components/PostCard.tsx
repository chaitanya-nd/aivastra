import Link from 'next/link'
import { getPath, withTrailingSlash } from '@/lib/urls'
import { Cover, hasCover } from './Cover'

export function PostCard({ doc, collection }: { doc: any; collection: string }) {
  const href = withTrailingSlash(getPath(collection, doc))
  const cat = Array.isArray(doc.categories) ? doc.categories[0] : doc.category
  const date = doc.publishedAt || doc.releaseDate
  return (
    <article className="card">
      <Link href={href} className="card-img" tabIndex={-1} aria-hidden>
        {hasCover(doc) ? <Cover doc={doc} size="card" /> : <div className="ph" />}
      </Link>
      <div className="card-body">
        {cat && typeof cat === 'object' && <span className="pill">{cat.name}</span>}
        <h3>
          <Link href={href}>{doc.title}</Link>
        </h3>
        {doc.excerpt && <p>{doc.excerpt}</p>}
        {date && <time dateTime={date}>{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</time>}
      </div>
    </article>
  )
}
