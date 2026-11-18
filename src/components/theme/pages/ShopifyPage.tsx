import { findMany } from '@/lib/data'
import { FormRenderer } from '@/components/FormRenderer'
import { Accordion, html, strip } from '../util'

const UP = 'https://aivastra.com/wp-content/uploads'
const STEP_CARDS = [
  { icon: `${UP}/2026/06/step1.webp`, image: `${UP}/2026/10/shoper-upload-img.webp`, title: 'Shopper Uploads Their Photo' },
  { icon: `${UP}/2026/06/step3-1.webp`, image: `${UP}/2026/10/existing-product-img.webp`, title: 'Use Existing Product Images' },
  { icon: `${UP}/2026/06/step1-1.webp`, image: `${UP}/2026/10/ai-try-on-img.webp`, title: 'AI Generates the Try-On' },
  { icon: `${UP}/2026/06/step4.webp`, image: `${UP}/2026/10/catelogue-img.webp`, title: 'Works Across Your Catalogue' },
]

const Hdr = ({ children, cls = '' }: { children?: string; cls?: string }) => (
  <p className={`${cls} in-shop-hdr`.trim()}><strong>{strip(children)}</strong></p>
)
const Raw = ({ v, tag: Tag = 'div', className }: { v?: string; tag?: 'div' | 'p'; className?: string }) =>
  v ? <Tag className={className} dangerouslySetInnerHTML={html(v)} /> : null

/** shopify-page.php */
export async function ShopifyPage({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  const reviews = (await findMany('reviews', { limit: 10, depth: 0 })).docs as any[]
  const cards = reviews.flatMap((r) => (r.madeForYouItems ?? []) as any[])
  const pills = (a.shopify_banner_trust_pills ?? []) as any[]
  const stats = (a.shopify_the_real_problem_stat_bar ?? []) as any[]
  const problem = (a.shopify_the_real_problem_cards ?? []) as any[]
  const logos = (a.shopify_shopping_logos_items ?? []) as any[]
  const left = (a.shopify_how_it_works_left_list ?? []) as any[]
  const built = (a.shopify_built_for_your_catalogue_cards ?? []) as any[]
  const integ = (a.shopify_integration_cards ?? []) as any[]
  const integBtm = (a.shopify_integration_btm_cards ?? []) as any[]
  const biz = (a.shopify_what_it_does_for_your_business_cards ?? []) as any[]
  const stack = (a.shopify_plays_well_with_your_stack_cards ?? []) as any[]
  const tags = (a.shopify_frm_lft_trust_tags ?? []) as any[]
  const iconCls = ['icon-orange', 'icon-pink', 'icon-red']
  return (
    <>
      <section id="main-heading" className="about">
        <div className="container">
          <div className="about-catalogue-page-lst shopfy">
            <div className="shopfy">
              <div className="hm-banner-sec-cnt inr"><div className="banner-sub-headding">{strip(a.shopify_banner_sub_title)}</div></div>
              <div className="inr-bnr-title"><h1 dangerouslySetInnerHTML={html(a.shopify_banner_title)} /></div>
              <div className="inr-bnr-tagline"><h2 dangerouslySetInnerHTML={html(a.shopify_banner_small_title)} /></div>
              <Raw v={a.shopify_banner_content} />
              <div className="contact-btn about"><div className="hm-banner-btn-lsting shopify-hm-banner-btn-lsting" dangerouslySetInnerHTML={html(a.shopify_banner_buttons)} /></div>
              <div className="shopify-bnr-trust-pills">
                {pills.map((p, i) => (
                  <div className="hm-banner-sec-cnt inr sp-bnr-trst-pils" key={i}><h6>{strip(p.shopify_banner_trust_pills_title)}</h6></div>
                ))}
              </div>
              <div className="in-bnr-cont" dangerouslySetInnerHTML={html(a.shopify_banner_btm_cont)} />
              {a.catalogue_image && <img src={a.catalogue_image} alt="" loading="eager" />}
            </div>
          </div>
        </div>
      </section>
      <main className="page-content shopify-page">
        <div className="container">
          <section id="page-column" className="full-width">
            <div className="hm-steps-sec topsec btm inner-step-sec">
              <div className="container">
                <div className="guide-category-grid img">
                  {STEP_CARDS.map((c) => (
                    <div className="step-card guide-category-card" key={c.title}>
                      <div className="step-top">
                        <div className="step-icon"><img src={c.icon} alt="step" width={25} height={25} loading="lazy" /></div>
                        <div className="why-teams-itm-tit"><h6><small>{c.title}</small></h6></div>
                      </div>
                      <img src={c.image} alt={c.title} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <section className="hm-steps-sec bottmsec prbmreal inr-virtual-sec">
              <div className="container">
                <div className="virtual-blk">
                  <div className="virtual-blk-left">
                    <Hdr>{a.shopify_the_real_problem_sub_title}</Hdr>
                    <h2 className="text-heading cmn-title">{strip(a.shopify_the_real_problem_title)}</h2>
                    <Raw v={a.shopify_the_real_problem_content} />
                  </div>
                  <div className="virtual-blk-right">{a.virtual_blk_img && <img src={a.virtual_blk_img} alt="" />}</div>
                </div>
                {stats.length > 0 && (
                  <div className="hm-brand-choose-sec inr shopify-stat-bar-cards">
                    <div className="hm-brand-choose-grid virtual-choose">
                      {stats.map((s, i) => (
                        <div className={`hm-brand-choose-card inr-chose-card ${i === 1 ? 'divider' : ''}`} key={i}>
                          <div className="hm-brand-choose-stat">
                            {s.shopify_the_real_problem_stat_bar_icon && (
                              <div className={`hm-brand-icon ${iconCls[Math.min(i, 2)]}`}><img src={s.shopify_the_real_problem_stat_bar_icon} alt="" width={34} height={47} loading="lazy" /></div>
                            )}
                            <h5>{strip(s.shopify_the_real_problem_stat_bar_title)}</h5>
                          </div>
                          <div dangerouslySetInnerHTML={html(s.shopify_the_real_problem_stat_bar_cont)} style={{ display: 'contents' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {problem.length > 0 && (
                  <div className="guide-category-flex virtual-btm-blk">
                    {problem.map((c, i) => (
                      <div className="flex" key={i}>
                        <p><strong>{strip(c.shopify_the_real_problem_card_title)}</strong></p>
                        <div dangerouslySetInnerHTML={html(c.shopify_the_real_problem_card_content)} style={{ display: 'contents' }} />
                      </div>
                    ))}
                  </div>
                )}
                <div className="cntr" dangerouslySetInnerHTML={html(a.shopify_the_real_problem_btm_cont)} />
              </div>
            </section>

            <div className="inr-showcase-shpy-sec inr-awards">
              <div className="container">
                <div className="showcase-shpy-wrapper"><h2 className="text-heading cmn-title">{strip(a.shopify_shopping_logos_sub_title)}</h2></div>
                {logos.length > 0 && (
                  <div className="showcase-shpy-lst owl-carousel">
                    {logos.filter((l) => l.shopify_shopping_logos_images).map((l, i) => (
                      <div className="showcase-shpy-itm" key={i}><img src={l.shopify_shopping_logos_images} alt="Logo" loading="lazy" /></div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="hm-steps-sec topsec work inr-work-sec">
              <div className="container">
                <Hdr>{a.shopify_how_it_works_sub_title}</Hdr>
                <h2 className="text-heading cmn-title">{strip(a.shopify_how_it_works_title)}</h2>
                <div className="developer-needed" dangerouslySetInnerHTML={html(a.shopify_how_it_works_content)} />
                <div className="guide-category-grid-lst">
                  <div className="guide-category-grid shopify-guide-category-grid inr-why-blk">
                    {left.map((l, i) => (
                      <div className="guide-category-card" key={i}>
                        <div className="why-teams-itm-title Shopify-why-teams-itm-title inner-why-sec">
                          <div className="inr-why-item">
                            <h6>{strip(l.shopify_how_it_works_lft_title)}</h6>
                            <div dangerouslySetInnerHTML={html(l.shopify_how_it_works_lft_cont)} style={{ display: 'contents' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="guide-category-prjt inr-why-right">
                    <div dangerouslySetInnerHTML={html(a.shopify_how_it_works_rgt_content)} style={{ display: 'contents' }} />
                    <div className="inr-why-rgt-img" dangerouslySetInnerHTML={html(a.shopify_how_it_works_rgt_video)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="hm-steps-sec bottmsec flex inshop-sec">
              <div className="container">
                <Hdr>{a.shopify_built_for_your_catalogue_sub_title}</Hdr>
                <h2 className="text-heading cmn-title">{strip(a.shopify_built_for_your_catalogue_title)}</h2>
                <Raw v={a.shopify_built_for_your_catalogue_content} />
                {built.length > 0 && (
                  <div className="guide-category-grid stpflex inr-stp-sec owl-carousel">
                    {built.map((c, i) => (
                      <div className="guide-category-card inshop-item" key={i}>
                        <a href={c.shopify_built_for_your_catalogue_card_link || '#'}>
                          <div className="why-teams-itm-title">
                            {c.shopify_built_for_your_catalogue_image && <div className="why-img"><img src={c.shopify_built_for_your_catalogue_image} alt="" loading="lazy" /></div>}
                            <div dangerouslySetInnerHTML={html(c.shopify_built_for_your_catalogue_card_cont)} style={{ display: 'contents' }} />
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                <div className="cntr" dangerouslySetInnerHTML={html(a.shopify_built_for_your_catalogue_btm_cont)} />
              </div>
            </div>

            <div className="hm-steps-sec topsec btm image inr-intgration-sec">
              <div className="container">
                <Hdr cls="integration">{a.shopify_integration_sub_title}</Hdr>
                <h2 className="text-heading cmn-title">{strip(a.shopify_integration_title)}</h2>
                <Raw v={a.shopify_integration_content} />
                {integ.length > 0 && (
                  <div className="guide-category-grid img">
                    {integ.map((c, i) => (
                      <div className="guide-category-card in-guide-category-card" key={i}>
                        <div className="in-shop-guide-category-card">
                          <div className="in-guide-category-card-img">{c.shopify_integration_card_sml_image && <img src={c.shopify_integration_card_sml_image} alt={strip(c.shopify_integration_card_title)} loading="lazy" />}</div>
                          <div className="why-teams-itm-tit"><h6>{strip(c.shopify_integration_card_title)}</h6></div>
                        </div>
                        <div className="showcase-shpy-itm-img">
                          <div className="dsk">{c.shopify_integration_card_big_image && <img src={c.shopify_integration_card_big_image} alt={strip(c.shopify_integration_card_title)} loading="lazy" />}</div>
                          <div className="mob">{c.shopify_integration_card_big_image_hvr && <img src={c.shopify_integration_card_big_image_hvr} alt={strip(c.shopify_integration_card_title)} loading="lazy" />}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {integBtm.length > 0 && (
                  <div className="guide-category-flex inr-int-blk">
                    {integBtm.map((c, i) => (
                      <div className={`inr-int-item flex ${i + 1 > 3 ? 'sub' : ''}`} key={i}>
                        <div className="inr-int-top">
                          {c.inr_int_item_icon && <img src={c.inr_int_item_icon} alt="Integration Icon" />}
                          {c.inr_int_item_number !== undefined && c.inr_int_item_number !== '' && <span>{strip(c.inr_int_item_number)}</span>}
                        </div>
                        <h6><strong>{strip(c.shopify_integration_btm_card_title)}</strong></h6>
                        <div dangerouslySetInnerHTML={html(c.shopify_integration_btm_card_cont)} style={{ display: 'contents' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="Shoppers-sec inr-shoppers-sec">
              <div className="container">
                <Hdr>{a.shopify_what_it_does_for_your_business_sub_title}</Hdr>
                <h2 className="text-heading cmn-title">{strip(a.shopify_what_it_does_for_your_business_title)}</h2>
                <div className="inr-shop-cnt" dangerouslySetInnerHTML={html(a.shopify_what_it_does_for_your_business_content)} />
                {biz.length > 0 && (
                  <div className="Shoppers-grid">
                    {biz.map((c, i) => (
                      <div className="Shoppers-card" key={i}>
                        {c.shopify_what_it_does_for_your_business_cord_icon && <div className="inr-int-top"><img src={c.shopify_what_it_does_for_your_business_cord_icon} alt="what-business-icon" /></div>}
                        <div className="Shoppers-title"><h6>{strip(c.shopify_what_it_does_for_your_business_card_title)}</h6></div>
                        <div className="Shoppers-cnt" dangerouslySetInnerHTML={html(c.shopify_what_it_does_for_your_business_cord_cont)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="hm-steps-sec topsec prjt grd inr-stack-sec">
              <div className="container">
                <div className="inr-stack-blk">
                  <div className="in-stack-left">
                    <Hdr cls="integration">{a.shopify_plays_well_with_your_stack_sub_title}</Hdr>
                    <h2 className="text-heading cmn-title">{strip(a.shopify_plays_well_with_your_stack_title)}</h2>
                    <Raw v={a.shopify_plays_well_with_your_stack_content} />
                    <Raw v={a.shopify_plays_well_with_your_stack_btn} />
                  </div>
                  {stack.length > 0 && (
                    <div className="guide-category-grid ply in-stack-right">
                      {stack.map((c, i) => (
                        <div className="guide-category-card" key={i}>
                          {(c.klaviyo_img_blk ?? []).length > 0 && (
                            <div className="klaviyo-img-blk">{(c.klaviyo_img_blk as any[]).filter((x) => x.klaviyo_icon).map((x, j) => <img key={j} src={x.klaviyo_icon} alt="" loading="lazy" />)}</div>
                          )}
                          <div className="why-teams-itm-title">
                            <h6>{strip(c.shopify_plays_well_with_your_stack_card_title)}</h6>
                            <p>{strip(c.shopify_plays_well_with_your_stack_card_cont)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="hm-steps-sec bottmsec rvw inr-review-sec">
              <div className="container">
                <div className="guide-category-grid-lst">
                  <div className="guide-category-grid-lst-lft">
                    <Hdr>{a.shopify_made_for_you_if_sub_title}</Hdr>
                    <h2 className="text-heading cmn-title">{strip(a.shopify_made_for_you_if_title)}</h2>
                    <div dangerouslySetInnerHTML={html(a.shopify_made_for_you_if_rgt_star_cont)} style={{ display: 'contents' }} />
                  </div>
                </div>
                {cards.length > 0 && (
                  <div className="guide-category-grid testi owl-carousel">
                    {cards.map((c, i) => (
                      <div className="guide-category-card" key={i}>
                        {c.star && <div className="review-stars"><img src={c.star} alt="rating" loading="lazy" /></div>}
                        <div className="review-text" dangerouslySetInnerHTML={html(c.text)} />
                        <div className="review-author">
                          {c.profile && <img src={c.profile} alt="" width={40} height={40} loading="lazy" />}
                          <div className="review-author-info" dangerouslySetInnerHTML={html(c.author)} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <section id="page-column" className="full-width">
              {(a.accordion_list ?? []).length > 0 && (
                <div className="inr-faqs-sec">
                  <div className="container">
                    {a.category_accordion_eyebrow && <p><strong dangerouslySetInnerHTML={html(a.category_accordion_eyebrow)} /></p>}
                    {a.category_accordion_title && <h2 dangerouslySetInnerHTML={html(a.category_accordion_title)} />}
                    <Accordion a={a} wrap={false} />
                  </div>
                </div>
              )}
            </section>
          </section>
        </div>
      </main>
      <FooterBand a={a} tags={tags} form={gc.contactForm} />
    </>
  )
}

function FooterBand({ a, tags, form }: { a: any; tags: any[]; form: any }) {
  return (
    <div className="ftr-form-sctn about-page in-shopfy-page">
      <div className="container">
        <div className="form-sec">
          <div className="frm-lft">
            <h2 className="text-heading" dangerouslySetInnerHTML={html(a.shopify_form_title)} />
            <p dangerouslySetInnerHTML={html(a.shopify_form_content)} />
            <div className="contact-btn about"><div className="hm-banner-btn-lsting shopify-ftr-btns-two" dangerouslySetInnerHTML={html(a.shopify_frm_lft_buttons)} /></div>
            {tags.length > 0 && <div className="shopfy-list"><ul>{tags.map((t, i) => <li key={i}>{strip(t.shopify_frm_lft_trust_tags_cont)}</li>)}</ul></div>}
          </div>
          <div className="hm-form"><h4>Get In Touch</h4>{form && typeof form === 'object' && <FormRenderer form={form} />}</div>
        </div>
      </div>
    </div>
  )
}

