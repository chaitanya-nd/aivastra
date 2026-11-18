import { Accordion, DemoButton, html, strip, texturize } from '../util'
import { FooterFormBand } from '../Footer'

const Sub = ({ c }: { c?: string }) => (c ? <h6 className="cmn-sub-title">{strip(c)}</h6> : null)
const Ttl = ({ c }: { c?: string }) => (c ? <h2 className="text-heading cmn-title">{strip(c)}</h2> : null)
const Img44 = ({ src, alt, cls = '' }: { src?: string; alt: string; cls?: string }) => (src ? <div className={`built-itm-img ${cls}`.trim()}><img src={src} alt={alt || 'Image'} width={44} height={44} /></div> : null)

function Table({ head, rows, math = false }: { head: [string, string, string]; rows: [string, string, string][]; math?: boolean }) {
  return (
    <div className="comparison-table-wrap">
      <table className="comparison-table">
        <thead><tr><th>{strip(head[0])}</th><th>{strip(head[1])}</th><th className={math ? 'math-lst' : undefined}>{strip(head[2])}</th></tr></thead>
        <tbody>
          {rows.map((r, i) => <tr key={i}><td>{strip(r[0])}</td><td className="mid">{strip(r[1])}</td><td className={math ? 'math-lst' : undefined}>{strip(r[2])}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}

const Buttons = () => (
  <div className="cmn-btn-lst">
    <div className="contact-btn about"><DemoButton>Book A Free Demo</DemoButton></div>
    <div className="contact-btn about"><DemoButton>Book A Free Demo</DemoButton></div>
  </div>
)

/** market-places.php (Myntra / Amazon / … product-photography landing pages) */
export function MarketplacesPage({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  const built = (a.built_list ?? []) as any[]
  const sellers = (a.sellers_list ?? []) as any[]
  const cmp = (a.comparison_list ?? []) as any[]
  const math = (a.math_comparison_list ?? []) as any[]
  const works = (a.works_list ?? []) as any[]
  const launch = (a.launch_list ?? []) as any[]
  return (
    <>
      <section id="main-heading" className="tryon">
        <div className="container">
          <div className="market-bnr-cnt">
            {a.banner_top_title && <div className="hm-banner-sec-cnt inr"><p className="inr-bnr-top-title-cnt">{strip(a.banner_top_title)} </p></div>}
            <div className="inr-bnr-title"><h1>{texturize(doc.title)}</h1></div>
            {a.sub_title && <p className="market-sub-title">{strip(a.sub_title)}</p>}
            {a.description && <p dangerouslySetInnerHTML={html(a.description)} />}
            <Buttons />
          </div>
        </div>
      </section>
      <main className="page-content tryon-page">
        <section id="page-column" className="full-width">
          {(a.answer_first_sub_title || a.answer_first_title || a.answer_first_content) && (
            <div className="hm-steps-sec model">
              <div className="container">
                <div className="about-generate-creation-cnt">
                  <Sub c={a.answer_first_sub_title} /><Ttl c={a.answer_first_title} />
                  {a.answer_first_content && <div className="cmn-top-cnt" dangerouslySetInnerHTML={html(a.answer_first_content)} />}
                </div>
              </div>
            </div>
          )}
          {(a.built_sub_title || a.built_title || built.length > 0) && (
            <div className="about-generate-creation-sec document-page tryon">
              <div className="container">
                <div className="about-generate-creation-cnt"><Sub c={a.built_sub_title} /><Ttl c={a.built_title} /></div>
                {built.length > 0 && (
                  <div className="guide-category-grid">
                    {built.map((b, i) => (
                      <div className="guide-category-card" key={i}>
                        <Img44 src={b.built_item_image} alt={`${strip(b.built_item_title)} Image`} />
                        <div className="built_item-cnt">
                          {b.built_item_title && <div className="why-teams-itm-title"><h6>{strip(b.built_item_title)}</h6></div>}
                          {b.built_item_content && <div className="why-teams-itm-cnt" dangerouslySetInnerHTML={html(b.built_item_content)} />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {(a.sellers_sub_title || a.sellers_title || sellers.length > 0) && (
            <section className="guide-category-sec document-page">
              <div className="container">
                <div className="about-generate-creation-cnt"><Sub c={a.sellers_sub_title} /><Ttl c={a.sellers_title} /></div>
                {sellers.length > 0 && (
                  <div className="guide-category-grid">
                    {sellers.map((s, i) => (
                      <div className="guide-category-card" key={i}>
                        <Img44 src={s.sellers_item_image} alt={strip(s.sellers_item_title)} cls="sellers" />
                        {s.sellers_item_title && <div className="why-teams-itm-title"><h6>{strip(s.sellers_item_title)}</h6></div>}
                        {s.sellers_item_content && <div className="why-teams-itm-cnt" dangerouslySetInnerHTML={html(s.sellers_item_content)} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
          {(a.traditional_sub_title || a.traditional_title || a.table_feature_heading || a.left_title || a.right_title || cmp.length > 0) && (
            <section className="traditional-sec side">
              <div className="container">
                <div className="about-generate-creation-cnt"><Sub c={a.traditional_sub_title} /><Ttl c={a.traditional_title} /></div>
                {cmp.length > 0 && <Table head={[a.table_feature_heading, a.left_title, a.right_title]} rows={cmp.map((r) => [r.feature, r.left_content, r.right_content])} />}
              </div>
            </section>
          )}
          {(a.math_sub_title || a.math_title || a.math_content || math.length > 0 || a.math_bottom_content) && (
            <section className="traditional-sec math">
              <div className="container">
                <div className="about-generate-creation-cnt">
                  <Sub c={a.math_sub_title} /><Ttl c={a.math_title} />
                  {a.math_content && <p className="cmn-top-cnt" dangerouslySetInnerHTML={html(a.math_content)} />}
                </div>
                {(a.math_table_feature_heading || a.math_left_title || a.math_right_title || math.length > 0) && (
                  <Table math head={[a.math_table_feature_heading, a.math_left_title, a.math_right_title]} rows={math.map((r) => [r.math_feature, r.math_left_content, r.math_right_content])} />
                )}
                {a.math_bottom_content && <div className="math-sec-btm-cnt" dangerouslySetInnerHTML={html(a.math_bottom_content)} />}
              </div>
            </section>
          )}
          {(a.works_sub_title || a.works_title || works.length > 0) && (
            <section className="guide-category-sec document-page">
              <div className="container">
                <div className="about-generate-creation-cnt"><Sub c={a.works_sub_title} /><Ttl c={a.works_title} /></div>
                {works.length > 0 && (
                  <div className="guide-category-grid">
                    {works.map((w, i) => (
                      <div className="guide-category-card" key={i}>
                        {(w.works_item_image || w.works_image_title) && (
                          <div className="works-img-lst">
                            <Img44 src={w.works_item_image} alt={strip(w.works_item_title)} />
                            {w.works_image_title && <div className="why-teams-itm-title"><h6>{strip(w.works_image_title)}</h6></div>}
                          </div>
                        )}
                        {w.works_item_title && <div className="why-teams-itm-title"><h6>{strip(w.works_item_title)}</h6></div>}
                        {w.works_item_content && <div className="why-teams-itm-cnt" dangerouslySetInnerHTML={html(w.works_item_content)} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
          {(a.launch_sub_title || a.launch_title || a.launch_content || launch.length > 0) && (
            <div className="hm-steps-sec document-page built">
              <div className="container">
                <div className="launch-photography-cnt">
                  <div className="launch-photography-lft">
                    <Sub c={a.launch_sub_title} /><Ttl c={a.launch_title} />
                    {a.launch_content && <p className="cmn-top-cnt" dangerouslySetInnerHTML={html(a.launch_content)} />}
                    {launch.length > 0 && <ol className="launch-photography-lst">{launch.filter((l) => l.launch_list_content).map((l, i) => <li key={i} dangerouslySetInnerHTML={html(l.launch_list_content)} />)}</ol>}
                    <Buttons />
                  </div>
                  <div className="launch-photography-rit">
                    <Sub c={a.launch_right_sub_title} />
                    {a.launch_right_photography_count && <h4>{strip(a.launch_right_photography_count)}</h4>}
                    {a.launch_right_title && <h5>{strip(a.launch_right_title)}</h5>}
                    {a.launch_right_content && <p dangerouslySetInnerHTML={html(a.launch_right_content)} />}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
        <section id="page-column" className="full-width">
          <Accordion a={{ ...a, category_accordion_title: 'Virtual Try-On FAQs ', category_accordion_eyebrow: undefined }} />
        </section>
      </main>
      <FooterFormBand className="tryon-page" title="Experience the Future of Fashion Visualization" content="Create premium fashion catalogues and immersive virtual try-on experiences that help your business grow faster." formTitle="Get In Touch" form={gc.contactForm} />
    </>
  )
}
