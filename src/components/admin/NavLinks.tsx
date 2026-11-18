import Link from 'next/link'

export const NavLinks = () => (
  <div style={{ marginTop: 12 }}>
    <Link href="/admin/seo-audit" style={{ display: 'block', padding: '6px 0', fontWeight: 600 }}>
      SEO audit
    </Link>
    <a href="/" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '6px 0' }}>
      View site ↗
    </a>
  </div>
)
