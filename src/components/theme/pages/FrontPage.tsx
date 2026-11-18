import { findMany } from '@/lib/data'
import { FooterFormBand } from '../Footer'
import { Accordion, excerptOf, html, THEME_URL, words } from '../util'

const SECTIONS: [string, string, boolean][] = [
  // [acf field, section class, wrapped in .container]
  ['home_banner_section', 'hm-banner-sec', false],
  ['home_brand_section', 'hm-brand-sec', false],
  ['hm_create_ready_section', 'hm-create-ready-sec', false],
  ['home_steps_section', 'hm-steps-sec', false],
  ['home_photoshoots_section', 'hm-photoshoots-sec', true],
  ['home_choose_perfect_section', 'hm-choose-perfect-sec', true],
  ['home_customers_section', 'hm-customers-sec', true],
  ['home_catalogue_creation_section', 'hm-catalogue-creation-sec', true],
  ['home_brand_choose_section', 'hm-brand-choose-sec', true],
  ['home_results_section', 'hm-results-sec', true],
]

const monthYear = (d?: string) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '')

/** front-page.php */
export async function FrontPage({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  const latest = (await findMany('posts', { limit: 3, depth: 1 })).docs as any[]
  return (
    <>
      {SECTIONS.map(([field, cls, wrap]) =>
        a[field] ? (
          <section className={cls} key={field}>
            {wrap ? <div className="container" dangerouslySetInnerHTML={html(a[field])} /> : <div dangerouslySetInnerHTML={html(a[field])} style={{ display: 'contents' }} />}
          </section>
        ) : null,
      )}
      <section className="hm-blog-sec">
        <div className="container">
          <div className="hm-blog-top">
            <div className="hm-blog-top-cnt">
              <h2 className="text-heading">{a.home_blog_title}</h2>
              <p>{a.home_blog_sub_title}</p>
            </div>
          </div>
          <div className="hm-blog-blk">
            {latest.length === 0 && <p>No posts found.</p>}
            {latest.map((p) => {
              const cat = Array.isArray(p.categories) ? p.categories.find((c: any) => typeof c === 'object') : null
              const href = `/${p.slug}/`
              return (
                <div className="hmblg-item" key={p.id}>
                  <div className="hmblg-post-img">
                    <a href={href}><img src={p.featuredImageUrl || `${THEME_URL}/images/newdefault-img.jpg`} alt={p.title} /></a>
                  </div>
                  <div className="hmblgcnt">
                    <div className="blog-meta">
                      <span className="gradient-text">{cat?.name ?? 'Blog'}</span>
                      <span>|</span>
                      <span className="gradient-date">{monthYear(p.publishedAt)}</span>
                    </div>
                    <h3><a href={href}>{words(p.title, 8)}</a></h3>
                    <p>{excerptOf(p, 10)}</p>
                    <div className="hmpost_btn"><a href={href}>Learn More</a></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="hm-post-btn"><a href="/blog/" className="cmn-btn two">View More Blogs</a></div>
        </div>
      </section>
      <section id="page-column" className="full-width">
        <Accordion a={a} />
      </section>
      <FooterFormBand title={gc.footer_form_left_title} content={gc.footer_form_left_content} formTitle={gc.footer_form_right_title} form={gc.contactForm} />
    </>
  )
}
