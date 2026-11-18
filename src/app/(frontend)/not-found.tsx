import type { Metadata } from 'next'
import { BodyClass } from '@/components/theme/BodyClass'
import { getSettings } from '@/lib/data'
import { applyVars } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const st = await getSettings()
  return { title: { absolute: applyVars(st.notFoundTitle || 'Page Not Found %sep% %sitename%', { sep: st.separator || '-', sitename: st.siteName }) }, robots: { index: false, follow: true } }
}

/** 404.php */
export default function NotFound() {
  return (
    <>
      <BodyClass classes="error404" />
      <section className="av-nf">
        <p className="av-nf-code">404</p>
        <h1>404 - Page Not Found</h1>
        <p className="av-nf-text">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="av-nf-actions">
          <a className="av-nf-primary" href="/">Back to home</a>
          <a className="av-nf-ghost" href="/blog/">Read the blog</a>
        </div>
      </section>
    </>
  )
}
