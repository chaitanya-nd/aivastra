import { getGlobalContent, getNavigation, getSettings } from '@/lib/data'
import { FormRenderer } from '../FormRenderer'
import { WpMenu } from './menu'

const THEME = 'https://aivastra.com/wp-content/themes/aivastrachild'
const html = (s?: string | null) => ({ __html: s ?? '' })

/** The "form + headline" band that sits above the footer on most pages. */
export function FooterFormBand({ title, content, formTitle, form, className = '' }: { title?: string | null; content?: string | null; formTitle?: string | null; form: any; className?: string }) {
  return (
    <div className={`ftr-form-sctn ${className}`}>
      <div className="container">
        <div className="form-sec">
          <div className="frm-lft">
            <h2 className="text-heading">{title}</h2>
            <p>{content}</p>
          </div>
          <div className="hm-form">
            <div className="hm-form-title">{formTitle}</div>
            {form && typeof form === 'object' && <FormRenderer form={form} />}
          </div>
        </div>
      </div>
    </div>
  )
}

/** 1:1 port of the theme's footer.php (without the form band — pages render that themselves). */
export async function Footer() {
  const [nav, gc, settings] = await Promise.all([getNavigation(), getGlobalContent(), getSettings()])
  const g = gc as any
  const cols = (nav.footerColumns ?? []) as any[]
  const col = (c: any) =>
    c ? (
      <div className="ftrlnks-itm" key={c.id}>
        <div className="ftr-local-title">{c.title}</div>
        <WpMenu items={c.links ?? []} className="footer-menu-list" />
      </div>
    ) : null
  const form = typeof g.contactForm === 'object' ? g.contactForm : null
  const socials = (g.social_media ?? []) as any[]
  return (
    <>
      <div className="ftr-block-sec">
        <div className="container">
          <div className="ftr-block-list">
            <div className="ftr-logo-blk">
              <div className="ftr-logo">
                <a href="/" rel="home"><img src="/brand/AV-new-logo-horizontal-iconcolor.png" alt={settings.siteName} width={910} height={189} /></a>
              </div>
              <div className="ftr-loca-blk">
                <div className="ftr-loca-itm">
                  <div className="ftr-local-title">{g.corporate_title}</div>
                  <p dangerouslySetInnerHTML={html(g.corporate_content)} />
                </div>
                <div className="ftr-loca-itm head-offc">
                  <div className="ftr-local-title">{g.head_title}</div>
                  <p dangerouslySetInnerHTML={html(g.head_content)} />
                </div>
              </div>
              <div className="ftrlnks-itm cnt ftrsoc-blk">
                <div className="ftr-contact">
                  <div className="ftr-links mail"><a href={g.mail_link}>{g.mail_text}</a></div>
                  <div className="ftr-links call"><a href={g.phone_link}>{g.phone_text}</a></div>
                </div>
                <div className="ftr-soc">
                  <div className="ftr-cnt-blk">
                    <div className="share-scl-blk">
                      {socials.length > 0 && (
                        <div className="share-scl-icon-blk">
                          {socials.map((s, i) =>
                            s.social_media_link && s.social_media_image ? (
                              <div className="share-scl-icon shpfy" key={s.id ?? i}>
                                <a href={s.social_media_link} target="_blank" rel="noopener noreferrer">
                                  <img className="dsk" src={s.social_media_image} alt="" />
                                  {s.social_media_hover_image && <img className="mob" src={s.social_media_hover_image} alt="" />}
                                </a>
                              </div>
                            ) : null,
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {g.google_link && g.google_image && (
                    <div className="ggleimg">
                      <a href={g.google_link} target="_blank" rel="noopener noreferrer"><img className="dsk" src={g.google_image} alt="Google" /></a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="ftrlnks-itm ftr-solutionsmenu-itm cnt">{col(cols[0])}</div>
            <div className="ftr-lnks-blk frst"><div className="ftr-lnks-lst">{col(cols[1])}{col(cols[2])}</div></div>
            <div className="ftr-lnks-blk"><div className="ftr-lnks-lst">{col(cols[3])}{col(cols[4])}</div></div>
          </div>
        </div>
      </div>
      <div className="ftr-copyrights-sec">
        <div className="container">
          <div className="cpy-inr">
            <p className="copy-para">© {new Date().getFullYear()} {settings.siteName} • All Rights Reserved. </p>
            <p>A product by <a href="https://www.nicedigitals.com/" target="_blank" rel="noopener"> <img src={`${THEME}/images/nice-digitals-logo.webp`} alt="Nice Digitals" width={500} height={130} /></a></p>
            <p className="copy-para"><a href="/terms/">Terms</a><a href="/privacy-policy/">Privacy Policy</a></p>
          </div>
        </div>
      </div>
      <div className="ftr-brandlogo">
        <div className="ftr-logobfr"><img className="mob" src={`${THEME}/images/aivastralogo.png`} alt="aivastralogo" /></div>
      </div>
      {g.whatsapp_link && g.whatsapp_image && (
        <div className="floating-whtasapp-img">
          <a href={g.whatsapp_link} target="_blank" rel="noopener noreferrer"><img className="dsk" src={g.whatsapp_image} alt="WhatsApp" /></a>
        </div>
      )}
      <div className="ftr-form-sctnpopfrm">
        <div className="form-sec">
          <div className="popup-overlay" id="popupForm" style={{ display: 'none' }}>
            <div className="hm-form popup-box">
              <span className="close-popup">&times;</span>
              <h2 className="text-heading">Schedule A Demo</h2>
              {form && <FormRenderer form={form} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
