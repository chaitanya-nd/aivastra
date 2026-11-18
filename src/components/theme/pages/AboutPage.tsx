import { FooterFormBand } from '../Footer'
import { LatestPosts } from '../BlogCards'
import { findMany } from '@/lib/data'
import { Accordion, DemoButton, html, strip } from '../util'

/** about-page-template.php */
export async function AboutPage({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  const latest = (await findMany('posts', { limit: 3, depth: 1 })).docs as any[]
  const exp = (a.experiences_list ?? []) as any[]
  const mission = (a.mission_list ?? []) as any[]
  const virtual = (a.virtual_experiences_list ?? []) as any[]
  return (
    <>
      <section id="main-heading" className="about">
        <div className="container">
          {(a.about_banner_title || a.about_banner_content) && (
            <>
              <div className="inr-bnr-title"><h1>{strip(a.about_banner_title)}</h1></div>
              <div dangerouslySetInnerHTML={html(a.about_banner_content)} />
              <div className="contact-btn about"><a className="cmn-btn" id="popupbtn" href={a.about_banner_button_link || undefined}>{a.about_banner_button_text}</a></div>
            </>
          )}
        </div>
      </section>
      <main className="page-content about-page">
        <div className="container">
          <section id="page-column" className="full-width">
            <div className="about-catalogue-page">
              <div className="about-mission-page-lst">
                <div className="about-catalogue-page-lft">
                  {a.experiences_image && <div className="experiences__image"><img src={a.experiences_image} alt={strip(a.experiences_title)} loading="lazy" /></div>}
                </div>
                <div className="about-catalogue-page-rgt">
                  {(a.experiences_title || a.experiences_content || exp.length > 0) && (
                    <>
                      <h2>{strip(a.experiences_title)}</h2>
                      <div dangerouslySetInnerHTML={html(a.experiences_content)} />
                      <ul>{exp.filter((e) => e.experiences_items).map((e, i) => <li key={i}>{strip(e.experiences_items)}</li>)}</ul>
                      <div className="innr-about-btn"><DemoButton>{a.experiences_button}</DemoButton></div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="about-mission-page">
              <div className="about-mission-page-lst">
                <div className="about-mission-page-lft">
                  <h2 className="mission-title">{strip(a.mission_title)}</h2>
                  <div dangerouslySetInnerHTML={html(a.mission_content)} />
                  <div className="about-mission-grid">
                    {mission.map((m, i) => (
                      <div className="about-mission-box" key={i}>
                        <div className="about-mission-box-cnt">
                          {m.mission_image && <img src={m.mission_image} alt={strip(m.mission_list_title)} />}
                          <div className="mission-box-title">{strip(m.mission_list_title)}</div>
                        </div>
                        <div className="mission-box-title"><strong>{strip(m.mission_list_sub_title)}</strong></div>
                      </div>
                    ))}
                  </div>
                  <div className="innr-about-btn"><DemoButton>{a.mission_button_text}</DemoButton></div>
                </div>
                <div className="mission-right-image">{a.mission_right_image && <img src={a.mission_right_image} alt={strip(a.mission_title)} />}</div>
              </div>
            </div>
            <div className="about-generate-creation-sec">
              <div className="container">
                <div className="about-generate-creation-cnt">
                  <h2 className="text-heading">{strip(a.virtual_experiences_title)}</h2>
                  <div dangerouslySetInnerHTML={html(a.virtual_experiences_content)} />
                </div>
                <div className="about-generate-creation-lst">
                  {virtual.map((v, i) => (
                    <div className="about-generate-itm" key={i}>
                      <div className="about-generate-itm-img">{v.virtual_experiences_image && <img src={v.virtual_experiences_image} alt={strip(v.virtual_experiences_item_title)} />}</div>
                      <div className="about-generate-itm-cnt"><div className="about-faster-title">{strip(v.virtual_experiences_item_title)}</div></div>
                    </div>
                  ))}
                </div>
                <div className="hm-about-generate-btn"><DemoButton>{strip(a.virtual_experiences_button)}</DemoButton></div>
              </div>
            </div>
            <div className="about-faster-sec">
              <div className="container">
                <div className="about-faster-cnt">
                  <h2 className="text-heading">{strip(a.smarter_fashion_title)}</h2>
                  <div dangerouslySetInnerHTML={html(a.smarter_fashion_content)} />
                </div>
                <div className="about-faster-creation-lst" dangerouslySetInnerHTML={html(a.smarter_fashion_items)} />
              </div>
            </div>
            <div className="about-table-sec">
              <div className="container">
                <div className="about-table-cnt">
                  <h2 className="text-heading">{strip(a.table_section_title)}</h2>
                  <div dangerouslySetInnerHTML={html(a.table_section_content)} />
                </div>
                <div className="table-wrapper" dangerouslySetInnerHTML={html(a.table_section_items)} />
              </div>
            </div>
          </section>
        </div>
        <section className="hm-blog-sec">
          <div className="container">
            <div className="hm-blog-top"><div className="hm-blog-top-cnt"><h2 className="text-heading">{strip(a.blog_title)}</h2><p>{strip(a.blog_content)}</p></div></div>
            <LatestPosts posts={latest} excerptWords={18} />
            <div className="hm-post-btn"><a href={a.blog_button_link || '/blog/'} className="cmn-btn two">{strip(a.blog_button)}</a></div>
          </div>
        </section>
        <section id="page-column" className="full-width">
          {/* the original prints the eyebrow as <h2> and the title as <p> */}
          <Accordion a={{ ...a, category_accordion_title: a.category_accordion_eyebrow, category_accordion_eyebrow: strip(a.category_accordion_title) }} />
        </section>
      </main>
      <FooterFormBand className="about-page" title={a.form_left_title} content={strip(a.form_left_content)} formTitle={a.form_right_title} form={gc.contactForm} />
    </>
  )
}
