import { FooterFormBand } from '../Footer'
import { Accordion, THEME_URL } from '../util'

const sanitizeTitle = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/** ai-showcase-page.php (catalogue-showcase) */
export function ShowcasePage({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  const tabs = ((a.fashion_tabs ?? []) as any[]).filter((t) => t.tab_title)
  return (
    <>
      <section id="main-heading" className="showcase">
        <div className="container">
          <div className="inr-bnr-title"><h1>Your Products. Real Models. Zero Photoshoot. </h1></div>
          <p>Browse AI catalogue photoshoots created for Indian fashion brands — across every category, style, and look. </p>
        </div>
      </section>
      <main id="page-content" className="default-page">
        <div className="container">
          <div className="page-col-full">
            <section id="page-column">
              {tabs.length > 0 && (
                <div className="fashion-tabs">
                  {tabs.map((t, i) => (
                    <button key={i} className={`tab-btn ${sanitizeTitle(t.tab_title)} ${i === 0 ? 'active' : ''}`} data-tab={`tab-${i}`}>{t.tab_title}</button>
                  ))}
                </div>
              )}
              {tabs.map((t, i) => (
                <div key={i} id={`tab-${i}`} className={`tab-content ${sanitizeTitle(t.tab_title)} ${i === 0 ? 'show' : ''}`}>
                  <div className="gallery-grid">
                    {((t.tab_images ?? []) as any[]).map((img, j) => (
                      <div className="gallery-item" key={j}>
                        <img src={img.url} alt={img.alt || ''} loading="lazy" />
                        <div className="image-overlay">
                          <div className="overlay-left">
                            <img src={`${THEME_URL}/images/vanheusen.webp`} alt="AI Vastra" width={100} height={28} />
                            <h6>Van Heusen</h6>
                          </div>
                          <div className="overlay-right"><a href="/" className="visit-btn">Visit Site</a></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Accordion a={{ ...a, category_accordion_title: 'Any Questions? We Have Answers. ', category_accordion_eyebrow: 'Everything you need to know before you start your first AI catalogue photoshoot.' }} />
            </section>
          </div>
        </div>
      </main>
      <FooterFormBand className="showcase" title="Experience the Future of Fashion Visualization" content="Create premium fashion catalogues and immersive virtual try-on experiences that help your business grow faster." formTitle="Get In Touch" form={gc.contactForm} />
    </>
  )
}
