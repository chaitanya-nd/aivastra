import { findMany } from '@/lib/data'
import { FooterFormBand } from '../Footer'
import { Accordion, THEME_URL, excerptOf, html, strip, words, bodyText } from '../util'

const version = (v?: string) => (v ? (/^version/i.test(v) ? v : `Version ${v}`) : '')

/** template-document.php (/documentations/) */
export async function DocumentPage({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  const [guides, updates] = await Promise.all([findMany('guides', { limit: 6, sort: 'order' }), findMany('updates', { limit: 3, sort: '-publishedAt' })])
  const cats = (a.guide_categories ?? []) as any[]
  return (
    <>
      <section id="main-heading" className="document">
        <div className="container">
          <div className="inr-bnr-title"><h1 dangerouslySetInnerHTML={html(a.documentation_banner_title)} /></div>
          <p dangerouslySetInnerHTML={html(a.documentation_banner_content)} />
        </div>
      </section>
      <div className="search-container">
        <div className="search-form">
          <div className="hdr-src"><div className="input-wrapper" dangerouslySetInnerHTML={html(a.documentation_search)} /></div>
          <div className="srcbox">
            <form role="search" method="get" className="search-form" action="/search/">
              <input type="search" name="s" className="search-field" placeholder="Search documentation, guides, workflows, and integrations..." />
              <button type="submit" className="search-submit">Search</button>
            </form>
            <div className="close_search" />
          </div>
        </div>
      </div>
      <main id="page-content" className="document-page">
        <section id="page-column" className="full-width">
          {cats.length > 0 && (
            <div className="guide-category-sec">
              <div className="container">
                <div className="guide-category-grid">
                  {cats.map((c, i) => (
                    <div className="guide-category-card" key={i}>
                      <div className="guide-icon">
                        {c.icon && <img className="normal-icon" src={c.icon} alt={strip(c.title)} />}
                        {c.hover_icon && <img className="hover-icon" src={c.hover_icon} alt={strip(c.title)} />}
                      </div>
                      <div className="guide-content">
                        <h5>{strip(c.title)}</h5>
                        <p>{strip(c.description)}</p>
                        <div className="guide-footer">
                          <span>{strip(c.guide_count)} Guides</span>
                          <span className="arrow">{c.link?.url ? <a href={c.link.url}>View Guides</a> : <a>View Guides</a>}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {guides.docs.length > 0 && (
            <div className="guides-section">
              <div className="container">
                <div className="guides-header"><h5>Most Popular Guides</h5><a href="/documentations/getting-started/">View More</a></div>
                <div className="guides-grid">
                  {guides.docs.map((g: any) => (
                    <div className="guide-card" key={g.id}>
                      <div className="guide-image"><img src={g.featuredImageUrl || `${THEME_URL}/images/newdefault-img.jpg`} alt={g.title} loading="lazy" /></div>
                      <div className="guide-content"><h5>{g.title}</h5><p>{excerptOf(g, 15)}</p></div>
                      <div className="guide-card-link"><a href={`/guide/${g.slug}/`}>link</a></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <section className="latest-updates">
            <div className="container">
              <div className="guides-header"><h5>Product Updates</h5><a href="/documentations/product-updates/">View More</a></div>
              <div className="updates-grid">
                {updates.docs.map((u: any) => (
                  <div className="update-card" key={u.id}>
                    <div className="update-top">
                      {u.featuredImageUrl && <div className="update-image"><img src={u.featuredImageUrl} alt={u.title} /></div>}
                      <div className="update-content">
                        {u.version && <span className="version-badge">{version(u.version)}</span>}
                        <h6>{u.title}</h6>
                        <div className="update-content-cnt">{words(bodyText(u), 20)}</div>
                      </div>
                    </div>
                    <div className="guide-card-link"><a href={`/updates/${u.slug}/`}>link</a></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </main>
      <div className="page-col-full">
        <section id="page-column">
          <Accordion a={{ ...a, category_accordion_title: a.category_accordion_eyebrow, category_accordion_eyebrow: strip(a.category_accordion_title) }} className="document-page" />
        </section>
      </div>
      <FooterFormBand className="documentation" title={a.documentation_footer_top_title} content={strip(a.documentation_footer_top_content)} formTitle={a.documentation_footer_top_form_title} form={gc.contactForm} />
    </>
  )
}
