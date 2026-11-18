import { findMany, getPluginSettings } from '@/lib/data'
import { FooterFormBand } from '../Footer'
import { BlogCard } from '../BlogCards'
import { Accordion, FormBlock } from '../util'

const TABS: [string, string][] = [
  ['all', 'All Categories'],
  ['ai-technology', 'AI Technology'],
  ['fashion-industry', 'Fashion Industry'],
  ['e-commerce', 'E-Commerce'],
  ['catalogue-design', 'Catalogue Design'],
  ['virtual-models', 'Virtual Models'],
  ['ai-workflow', 'AI Workflow'],
]

/** index.php — blog home / category archive. Tabs link to /category/{slug}/ (static, crawlable) instead of ?cat_filter=. */
export async function BlogIndex({ gc, page = 1, term, basePath = '/blog/', faqSource }: { gc: any; page?: number; term?: any; basePath?: string; faqSource?: any }) {
  const where = term ? { categories: { in: [term.id] } } : {}
  const per = Math.max(1, Number((await getPluginSettings())?.postsPerPage) || 9)
  const res = await findMany('posts', { where, limit: per, page, depth: 1 })
  const active = term?.slug ?? 'all'
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`
  return (
    <>
      <section id="main-heading">
        <div className="container">
          <div className="inr-bnr-title"><h1>{term ? term.name : 'Ideas, Insights, and Answers for Fashion Brands '}</h1></div>
          <p>{term?.description || 'Be at the cutting edge. All the info you need on AI fashion photoshoots, virtual try-on and smarter ways to grow your brand.'}</p>
        </div>
      </section>
      <main className="blog-main-layout">
        <div className="container">
          <div className="ui-filter-toolbar">
            <div className="blog-tabs-row">
              {TABS.map(([slug, label]) => (
                <a key={slug} className={`tab-pill ${active === slug ? 'active-tab' : ''}`} href={slug === 'all' ? '/blog/' : `/category/${slug}/`}>{label}</a>
              ))}
            </div>
          </div>
          <div className="blog-grid" id="blog-posts-container">
            {res.docs.length ? res.docs.map((p: any) => <BlogCard key={p.id} p={p} />) : <p className="no-articles">No articles found.</p>}
          </div>
          {(res.totalPages ?? 1) > 1 && (
            <div className="ui-view-more-row" style={{ gap: 12 }}>
              {page > 1 && <a className="ui-view-more-btn" href={page === 2 ? base : `${base}page/${page - 1}/`} rel="prev">Newer</a>}
              {page < res.totalPages && <a className="ui-view-more-btn" href={`${base}page/${page + 1}/`} rel="next">View More</a>}
            </div>
          )}
        </div>
      </main>
      <div className="blg-form-sctn ">
        <div className="container">
          <div className="blg-form-sec">
            <h2 className="text-heading">Get AI Fashion Tips in Your Inbox </h2>
            <p>Join thousands of Indian fashion sellers and brand owners who get our weekly insights on AI catalogues, try-on tech, and growing smarter online. </p>
            <FormBlock form={gc.newsletterForm || gc.contactForm} />
          </div>
        </div>
      </div>
      {faqSource && (
        <main id="page-content" className="default-page">
          <div className="container"><div className="page-col-full"><section id="page-column">
            <Accordion a={{ ...faqSource, category_accordion_title: 'Quick Answers for New Readers', category_accordion_eyebrow: 'First time here? These are the questions most people ask before they start with Ai Vastra.' }} />
          </section></div></div>
        </main>
      )}
      <FooterFormBand className="blg" title={gc.footer_form_left_title} content={gc.footer_form_left_content} formTitle={gc.footer_form_right_title} form={gc.contactForm} />
    </>
  )
}
