import Link from 'next/link'

export function Pagination({ page, totalPages, basePath }: { page: number; totalPages: number; basePath: string }) {
  if (totalPages <= 1) return null
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`
  const href = (p: number) => (p === 1 ? base : `${base}page/${p}/`)
  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 && <Link href={href(page - 1)} rel="prev">← Newer</Link>}
      <span>
        Page {page} of {totalPages}
      </span>
      {page < totalPages && <Link href={href(page + 1)} rel="next">Older →</Link>}
    </nav>
  )
}
