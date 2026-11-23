import { FooterFormBand } from '../Footer'
import { html, strip } from '../util'
import { CardStack } from '@/ui/client/Interactive'

const Btn = ({ href, children, cls = 'cmn-btn' }: { href?: string; children?: string; cls?: string }) => (
  <a href={href || '#'} id="popupbtn" className={cls}>{strip(children)}</a>
)

const renderAccent = (title?: string) => {
  if (!title) return null
  const clean = strip(title)
  if (/Virtual Try-On/i.test(clean)) {
    const parts = clean.split(/(Virtual Try-On\??)/i)
    return <>{parts[0]}<span className="av-purple">{parts[1]}</span>{parts[2] ?? ''}</>
  }
  if (/Fashion Business/i.test(clean)) {
    const parts = clean.split(/(Fashion Business)/i)
    return <>{parts[0]}<span className="av-purple">{parts[1]}</span>{parts[2] ?? ''}</>
  }
  const words = clean.split(' ')
  if (words.length <= 2) return <>{clean}</>
  return <>{words.slice(0, -2).join(' ')} <span className="av-purple">{words.slice(-2).join(' ')}</span></>
}

/** virtual-try-on.php — ACF names contain "-" ("virtual_try-on_title"); we sanitize them to "_". */
export function VirtualTryOnPage({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  const g = (k: string) => a[`virtual_try_on_${k}`]
  const shoppers = (g('shoppers_list') ?? []) as any[]
  const business = (g('business_list') ?? []) as any[]
  const wardrobe = (g('wardrobe_list') ?? []) as any[]
  const fashion = (g('fashion_list') ?? []) as any[]
  return (
    <>
      <section id="main-heading" className="tryon">
        <div className="container">
          <div className="inr-bnr-title"><h1>{strip(g('title')) || doc.title}</h1></div>
          <h6>{strip(g('sub_title'))}</h6>
          <div dangerouslySetInnerHTML={html(g('content'))} />
          <div className="contact-btn about"><Btn href={g('button_link')}>{g('button_text')}</Btn></div>
        </div>
      </section>
      <main className="page-content tryon-page">
        <div className="container">
          <section id="page-column" className="full-width">
            <div className="about-catalogue-page">
              <div className="about-catalogue-page-lst">
                <div className="about-catalogue-page-lft">{g('free_trial_image') && <img src={g('free_trial_image')} alt={strip(g('free_trial_title'))} />}</div>
                <div className="about-catalogue-page-rgt">
                  <h2>{renderAccent(g('free_trial_title'))}</h2>
                  <p dangerouslySetInnerHTML={html(g('free_trial_content'))} />
                  <div className="innr-about-btn"><Btn href={g('free_trial_button_link')}>{g('free_trial_button_text')}</Btn></div>
                </div>
              </div>
            </div>
            <div className="virtual-page">
              <div className="steps-cnt">
                <h2 className="text-heading">{renderAccent(g('shoppers_title'))}</h2>
                <div dangerouslySetInnerHTML={html(g('shoppers_content'))} />
              </div>
              <div id="catalogue-content" className="tab-panel active">
                {shoppers.length > 0 && (
                  <div className="steps-list">
                    {shoppers.map((s, i) => (
                      <div className="step-card" key={i}>
                        <div className="step-top">
                          {s.virtual_try_on_shoppers_list_icon && <div className="step-icon"><img src={s.virtual_try_on_shoppers_list_icon} alt={strip(s.virtual_try_on_shoppers_list_title)} /></div>}
                          <div className="step-top-cnt">
                            {s.virtual_try_on_shoppers_list_title && <strong>{strip(s.virtual_try_on_shoppers_list_title)}</strong>}
                            {s.virtual_try_on_shoppers_list_sub_title && <span>{strip(s.virtual_try_on_shoppers_list_sub_title)}</span>}
                          </div>
                        </div>
                        {s.virtual_try_on_shoppers_list_image && <div className="step-top-img"><img src={s.virtual_try_on_shoppers_list_image} alt={strip(s.virtual_try_on_shoppers_list_title)} /></div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="about-catalogue-page tryon page">
              <div className="about-catalogue-page-lst">
                <div className="about-catalogue-page-rgt">
                  <h2>{renderAccent(g('business_title'))}</h2>
                  <p>{strip(g('business_content'))}</p>
                  {business.length > 0 && <ul>{business.map((b, i) => <li key={i}>{strip(b.virtual_try_on_business_list_text)}</li>)}</ul>}
                  <div className="btnpadding"><Btn href={g('business_button_link')}>{g('business_button')}</Btn></div>
                </div>
                <div className="about-catalogue-page-lft">{g('right_image') && <img src={g('right_image')} alt="Virtual Try-On Right Image" />}</div>
              </div>
            </div>
            <div className="about-generate-creation-sec tryon">
              <div className="container">
                <div className="about-generate-creation-cnt">
                  <h2 className="text-heading">{renderAccent(g('wardrobe_title'))}</h2>
                  <p dangerouslySetInnerHTML={html(g('wardrobe_content'))} />
                </div>
                {wardrobe.length > 0 && (
                  <div className="about-generate-creation-lst">
                    {wardrobe.map((w, i) => (
                      <div className="about-generate-itm" key={i}>
                        <div className="about-generate-itm-img">{w.virtual_try_on_wardrobe_image && <img src={w.virtual_try_on_wardrobe_image} alt={strip(w.virtual_try_on_wardrobe_text)} />}</div>
                        <div className="about-generate-itm-cnt"><h6>{strip(w.virtual_try_on_wardrobe_text)}</h6></div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="hm-about-generate-btn"><Btn href={g('wardrobe_button_link')}>{g('wardrobe_button')}</Btn></div>
              </div>
            </div>
            {fashion.length > 0 ? (
              <div className="av-cc av-tryon-stack">
                <CardStack
                  intro={
                    <div className="av-cc-intro">
                      <h2 className="av-display sm">{renderAccent(g('fashion_title'))}</h2>
                      <p className="av-lead light" dangerouslySetInnerHTML={html(g('fashion_content'))} />
                    </div>
                  }
                  cards={fashion.map((f, i) => (
                    <article className="av-cc-card" key={i}>
                      <figure>{f.virtual_try_on_fashion_list_image && <img src={/boutique/i.test(f.virtual_try_on_fashion_list_title ?? '') ? 'https://aivastra.com/wp-content/uploads/2026/04/mens-traditional-1-3-1024x673-1.png' : f.virtual_try_on_fashion_list_image} alt={strip(f.virtual_try_on_fashion_list_title)} loading="lazy" />}</figure>
                      <span className="av-cc-n">0{i + 1}</span>
                      <h3>{strip(f.virtual_try_on_fashion_list_title)}</h3>
                      <p>{strip(f.virtual_try_on_fashion_list_sub_title)}</p>
                    </article>
                  ))}
                />
              </div>
            ) : (
              <div className="hm-catalogue-creation-cnt tryon">
                <h2 className="text-heading">{renderAccent(g('fashion_title'))}</h2>
                <p dangerouslySetInnerHTML={html(g('fashion_content'))} />
              </div>
            )}
          </section>
        </div>
        <section id="page-column" className="full-width">
          {(a.accordion_list ?? []).length > 0 && (
            <div className="inr-faqs-sec">
              <div className="container">
                <h2>{strip(a.category_accordion_eyebrow)}</h2>
                <div className="accordion-lst" itemScope itemType="https://schema.org/FAQPage">
                  {(a.accordion_list as any[]).map((q, i) => (
                    <div className="accordion-profile" key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                      <h3 itemProp="name"><a href="javascript:void(0);">{strip(q.accordion_question)}</a></h3>
                      <div className="accordion-profile-content" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                        <div itemProp="text" dangerouslySetInnerHTML={html(q.accordion_answer)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <FooterFormBand className="tryon-page" title={g('footer_top_title')} content={strip(g('footer_top_content'))} formTitle={g('footer_form_title')} form={gc.contactForm} />
    </>
  )
}
