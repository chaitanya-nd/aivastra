import { FormBlock, Accordion, DemoButton, html, strip, texturize } from '../util'

/** template-contact.php */
export function ContactPage({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  const socials = (a.contact_social_media ?? []) as any[]
  const locations = (a.contact_locations_section_list ?? []) as any[]
  return (
    <>
      <section id="main-heading" className="contact">
        <div className="container"><div className="inr-bnr-title"><h1>{texturize(doc.title)}</h1></div></div>
      </section>
      <div className="contact-form-sctn">
        <div className="container">
          <div className="form-sec">
            <div className="contact-frm-lft">
              <h2 className="text-heading">{strip(a.contact_title)}</h2>
              <p dangerouslySetInnerHTML={html(a.contact_content)} />
              <div className="frm-blk">
                <div className="frm-blk-soc">
                  <div className="ftr-contact">
                    <div className="ftr-links mail"><a href={a.contact_mail_link}>{a.contact_mail_text}</a></div>
                    <div className="ftr-links call"><a href={a.contact_phone_link}>{a.contact_phone_text}</a></div>
                  </div>
                  {socials.length > 0 && (
                    <div className="share-scl-blk">
                      <h4>{a.contact_social_media_title}</h4>
                      <div className="share-scl-icon-blk">
                        {socials.map((s, i) => (
                          <div className="share-scl-icon shpfy" key={i}>
                            <a href={s.contact_social_media_link} target="_blank" rel="noopener noreferrer">
                              {s.contact_social_media_image && <img className="dsk" src={s.contact_social_media_image} alt="Social Icon" />}
                              {s.contact_social_media_hover_image && <img className="mob" src={s.contact_social_media_hover_image} alt="Social Icon Hover" />}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {a.whatsapp_qr_link && a.whtasapp_qr && (
                  <div className="cont-whtasapp-qr">
                    <a href={a.whatsapp_qr_link} target="_blank" rel="noopener noreferrer"><img className="dsk" src={a.whtasapp_qr} alt="WhatsApp QR" /></a>
                  </div>
                )}
              </div>
            </div>
            <div className="hm-form">
              <h4>{a.contact_form_title}</h4>
              <FormBlock form={gc.contactForm} />
            </div>
          </div>
          {locations.length > 0 && (
            <div className="contac-map-btm">
              <h2 className="text-heading">{a.contact_locations_title}</h2>
              <div className="contac-map-lst">
                {locations.map((l, i) => (
                  <div className="contac-map-itm" key={i}>
                    <div className="cnt-map-add">
                      <h6>{l.contact_locations_section_title}</h6>
                      <p><a href={l.contact_locations_section_map_link} target="_blank" rel="noopener" dangerouslySetInnerHTML={html(l.contact_locations_section_content)} /></p>
                    </div>
                    <div className="contac-map-frme" dangerouslySetInnerHTML={html(l.contact_locations_section_map)} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="page-col-full">
        <section id="page-column">
          {/* the original template prints the eyebrow as <h2> and the title as <p> */}
          <Accordion a={{ ...a, category_accordion_title: a.category_accordion_eyebrow, category_accordion_eyebrow: strip(a.category_accordion_title) }} className="document-page" />
        </section>
      </div>
      <div className="ftr-form-sctn cntinner">
        <div className="container">
          <div className="form-sec">
            <div className="frm-lft">
              <h2 className="text-heading">{strip(a.contact_footer_top_title)}</h2>
              <p dangerouslySetInnerHTML={html(a.contact_footer_top_content)} />
              <div className="innr-form-btn"><DemoButton>{a.contact_footer_top_button}</DemoButton></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
