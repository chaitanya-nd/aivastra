import { FooterFormBand } from '../Footer'
import { Accordion, DemoButton, FormBlock, html, strip, texturize } from '../util'

const Sub = ({ children }: { children?: string | null }) => (children ? <h6 className="cmn-sub-title">{strip(children)}</h6> : null)
const Title = ({ children }: { children?: string | null }) => (children ? <h2 className="text-heading cmn-title">{strip(children)}</h2> : null)

/** template-parts/category.php — the 8 garment landing pages (sarees, kurtis, …). */
export function CategoryPage({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  const btn = a.category_button
  const why = (a.why_teams_list ?? []) as any[]
  const creation = (a.creation_list ?? []) as any[]
  const proof = (a.proof_list ?? []) as any[]
  const shoot = (a.aiphotoshoot_list ?? []) as any[]
  const cost = (a.aiphotoshoot_cost_list ?? []) as any[]
  const showcase = (a.showcase_list ?? []) as any[]
  return (
    <>
      <section id="main-heading" className="tryon">
        <div className="container">
          {a.banner_top_title && (
            <div className="hm-banner-sec-cnt inr">
              <h6>{strip(a.banner_top_title)} </h6>
              <p className="inr-bnr-top-title-cnt">Ai Vastra</p>
            </div>
          )}
          <div className="inr-bnr-title"><h1>{texturize(doc.title)}</h1></div>
          {a.sub_title && <h6 className="cmn-sub-title">{strip(a.sub_title)}</h6>}
          {a.description && <p>{strip(a.description)}</p>}
          <div className="cmn-btn-lst">
            <div className="contact-btn about"><DemoButton>Book A Free Demo</DemoButton></div>
            {btn?.url && (
              <div className="contact-btn about">
                <a className="cmn-btn cmn-btn-two" href={btn.url} target={btn.target || '_self'}>{btn.title}</a>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="page-content tryon-page">
        <div className="container">
          <section id="page-column" className="full-width">
            {(a.why_teams_sub_title || a.why_teams_title || why.length > 0) && (
              <div className="hm-steps-sec document-page">
                <div className="container">
                  <div className="about-generate-creation-cnt">
                    <Sub>{a.why_teams_sub_title}</Sub>
                    <Title>{a.why_teams_title}</Title>
                  </div>
                  {why.length > 0 && (
                    <div className="guide-category-grid">
                      {why.map((w, i) => (
                        <div className="guide-category-card" key={i}>
                          {w.why_teams_item_title && <div className="why-teams-itm-title"><h6>{strip(w.why_teams_item_title)}</h6></div>}
                          {w.why_teams_item_content && <div className="why-teams-itm-cnt"><p dangerouslySetInnerHTML={html(w.why_teams_item_content)} /></div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {(a.creation_sub_title || a.creation_title || a.creation_description || creation.length > 0) && (
              <div className="about-generate-creation-sec tryon">
                <div className="container">
                  <div className="about-generate-creation-cnt">
                    <Sub>{a.creation_sub_title}</Sub>
                    <Title>{a.creation_title}</Title>
                    {a.creation_description && <p className="cmn-top-cnt">{strip(a.creation_description)}</p>}
                  </div>
                  {creation.length > 0 && (
                    <div className="about-generate-creation-lst">
                      {creation.map((c, i) => (
                        <div className="about-generate-itm" key={i}>
                          {c.creation_item_image && <div className="about-generate-itm-img"><img src={c.creation_item_image} alt={`${strip(c.creation_item_title)} Image`} width={412} height={528} /></div>}
                          {c.creation_item_title && <div className="about-generate-itm-cnt"><h6>{strip(c.creation_item_title)}</h6></div>}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="hm-about-generate-btn"><a className="cmn-btn" href={a.creation_link}>{a.creation_text}</a></div>
                </div>
              </div>
            )}

            {(a.proof_sub_title || a.proof_title || a.proof_content || proof.length > 0) && (
              <div className="hm-steps-sec document-page proof-sec">
                <div className="container">
                  <div className="about-generate-creation-cnt">
                    <Sub>{a.proof_sub_title}</Sub>
                    <Title>{a.proof_title}</Title>
                    {a.proof_content && <p className="cmn-top-cnt">{strip(a.proof_content)}</p>}
                  </div>
                  {proof.length > 0 && (
                    <div className="guide-category-grid">
                      {proof.map((p, i) => (
                        <div className="guide-category-card" key={i}>
                          {p.proof_item_title && <div className="why-teams-itm-title"><h6>{strip(p.proof_item_title)}</h6></div>}
                          {p.proof_item_content && <div className="why-teams-itm-cnt"><p dangerouslySetInnerHTML={html(p.proof_item_content)} /></div>}
                        </div>
                      ))}
                    </div>
                  )}
                  {a.inner_brand_choose_section && <div className="hm-brand-choose-sec inr" dangerouslySetInnerHTML={html(a.inner_brand_choose_section)} />}
                </div>
              </div>
            )}

            {(a.aiphotoshoot_sub_title || a.aiphotoshoot_title || a.aiphotoshoot_top_content || a.aiphotoshoot_right_content || a.aiphotoshoot_logo_image || a.aiphotoshoot_logo_title || shoot.length > 0) && (
              <div className="inr-aiphotoshoot-sec">
                <div className="container">
                  <div className="about-generate-creation-cnt aiphotoshoot">
                    <div className="inr-aiphotoshoot-top-lft">
                      <Sub>{a.aiphotoshoot_sub_title}</Sub>
                      <Title>{a.aiphotoshoot_title}</Title>
                      {a.aiphotoshoot_top_content && <p className="cmn-top-cnt">{strip(a.aiphotoshoot_top_content)}</p>}
                    </div>
                    <div className="inr-aiphotoshoot-top-rit">
                      <div className="your-western-btn desk"><a className="cmn-btn" href={a.photoshoots_link}>{a.photoshoots_text}</a></div>
                    </div>
                  </div>
                  <div className="inr-aiphotoshoot-list">
                    {shoot.length > 0 && (
                      <div className="inr-aiphotoshoot-lft">
                        {shoot.map((s, i) => (
                          <div className="inr-aiphoto-lft-itm" key={i}>
                            {s.aiphotoshoot_item_image && <div className="inr-aiphoto-lft-img"><img src={s.aiphotoshoot_item_image} alt={`${strip(s.aiphotoshoot_item_title)} Image`} width={246} height={356} /></div>}
                            {s.aiphotoshoot_item_title && <div className="inr-aiphoto-itm-title"><p>{strip(s.aiphotoshoot_item_title)}</p></div>}
                            {s.aiphotoshoot_item_hvr && <div className="inr-aiphoto-itm-hvr"><a href={s.aiphotoshoot_item_hvr}>{strip(s.aiphotoshoot_item_title)}</a></div>}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="inr-aiphoto-rit">
                      <div className="inr-aiphoto-rit-top">
                        {a.aiphotoshoot_right_content && <div className="inr-aiphoto-rit-top-cnt"><p dangerouslySetInnerHTML={html(a.aiphotoshoot_right_content)} /></div>}
                        <div className="inr-aiphoto-rit-logo-lst">
                          {a.aiphotoshoot_logo_image && <div className="inr-aiphoto-rit-top-logo"><img src={a.aiphotoshoot_logo_image} alt={strip(a.aiphotoshoot_logo_title)} width={64} height={32} /></div>}
                          {a.aiphotoshoot_logo_title && <div className="inr-aiphoto-rit-top-title"><p>{strip(a.aiphotoshoot_logo_title)}</p></div>}
                        </div>
                      </div>
                      <div className="inr-aiphoto-rit-btm">
                        {cost.map((c, i) => (
                          <div className="inr-aiphoto-rit-btm-itm" key={i}>
                            {c.aiphotoshoot_cost && <div className="inr-aiphoto-rit-btm-title"><h5>{strip(c.aiphotoshoot_cost)}</h5></div>}
                            {c.aiphotoshoot_cost_content && <div className="inr-aiphoto-rit-btm-cnt"><p dangerouslySetInnerHTML={html(c.aiphotoshoot_cost_content)} /></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="your-western-btn mob"><a className="cmn-btn" href={a.photoshoots_link}>{a.photoshoots_text}</a></div>
                </div>
              </div>
            )}

            {(a.showcase_sub_title || a.showcase_title || showcase.length > 0) && (
              <div className="inr-showcase-sec">
                <div className="container">
                  {(a.showcase_sub_title || a.showcase_title) && (
                    <div className="inr-showcase-cnt">
                      <Sub>{a.showcase_sub_title}</Sub>
                      <Title>{a.showcase_title}</Title>
                      <p className="cmn-top-cnt" dangerouslySetInnerHTML={html(a.showcase_content)} />
                    </div>
                  )}
                  {showcase.length > 0 && (
                    <div className="showcase-wrapper">
                      <div className="showcase-lst">
                        {[0, 1].flatMap((pass) =>
                          showcase.map((s, i) => (
                            <div className="showcase-itm" key={`${pass}-${i}`}>
                              {s.showcase_item_image && <div className="showcase-itm-img"><img src={s.showcase_item_image} alt={strip(s.showcase_item_title)} width={412} height={528} /></div>}
                              {s.showcase_item_title && <div className="showcase-itm-title"><h6>{strip(s.showcase_item_title)}</h6></div>}
                              {s.showcase_item_hvr && <div className="inr-showcase-itm-hvr"><a href={s.showcase_item_hvr}>{strip(s.showcase_item_title)}</a></div>}
                            </div>
                          )),
                        )}
                      </div>
                    </div>
                  )}
                  <div className="hm-about-generate-btn"><a className="cmn-btn" href={a.showcase_link}>{a.showcase_text}</a></div>
                </div>
              </div>
            )}

            {(a.models_title || a.models_content) && (
              <div className="hm-steps-sec model">
                <div className="container">
                  <div className="about-generate-creation-cnt">
                    <Title>{a.models_title}</Title>
                    {a.models_content && <p className="cmn-top-cnt" dangerouslySetInnerHTML={html(a.models_content)} />}
                  </div>
                  <div className="cmn-btn-lst model">
                    <div className="contact-btn about"><DemoButton>{a.models_book}</DemoButton></div>
                    <div className="contact-btn about"><DemoButton two>{a.models_start}</DemoButton></div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
        <section id="page-column" className="full-width">
          <Accordion a={{ ...a, category_accordion_eyebrow: undefined }} />
        </section>
      </main>
      <FooterFormBand className="tryon-page" title={a.category_form_title} content={a.category_form_content} formTitle="Get In Touch" form={gc.contactForm} />
    </>
  )
}
export { FormBlock }
