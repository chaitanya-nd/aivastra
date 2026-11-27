import { FormRenderer } from '@/components/FormRenderer'
import { getGlobalContent, getNavigation, getSettings } from '@/lib/data'
import { resolveLink } from '@/lib/links'
import { strip } from "@/components/theme/util"
import { FooterMark } from './client/Interactive'
import { DemoModal, HeaderBar, type NavItem } from './client/Chrome'
import { Faq } from './client/Interactive'

const THEME = 'https://aivastra.com/wp-content/themes/aivastrachild'
const toItems = (arr: any[]): NavItem[] =>
  arr.flatMap((it) => {
    const l = resolveLink(it.link)
    if (!l) return []
    const children = (it.children ?? []).flatMap((c: any) => {
      const cl = resolveLink(c.link)
      return cl ? [{ label: String(c.link.label), href: cl.href }] : []
    })
    return [{ label: String(it.link.label), href: l.href, newTab: l.newTab, children }]
  })

export async function AvHeader() {
  const [nav, g] = await Promise.all([getNavigation(), getGlobalContent() as Promise<any>])
  return <HeaderBar logo={"/brand/AV-new-logo-horizontal-iconcolor.png"} items={toItems((nav.header ?? []) as any[])} signText={g.sign_text} signHref={g.sign_link} catalogueText={g.catalogue_content} />
}

export async function AvFooter() {
  const [nav, gc, settings] = await Promise.all([getNavigation(), getGlobalContent(), getSettings()])
  const g = gc as any
  const cols = (nav.footerColumns ?? []) as any[]
  const form = typeof g.contactForm === 'object' ? g.contactForm : null
  const socials = (g.social_media ?? []) as any[]
  return (
    <>
      <footer className="av-ftr">
        <div className="av-wrap">
          <div className="av-ftr-grid">
            <div className="av-ftr-brand">
              <a href="/" rel="home"><img src={"/brand/AV-new-logo-horizontal-iconcolor.png"} alt={settings.siteName} width={344} height={78} /></a>
              <div className="av-ftr-loc">
                <div>
                  <h4 className="av-eyebrow">{g.corporate_title}</h4>
                  <p dangerouslySetInnerHTML={{ __html: g.corporate_content ?? '' }} />
                </div>
                <div>
                  <h4 className="av-eyebrow">{g.head_title}</h4>
                  <p dangerouslySetInnerHTML={{ __html: g.head_content ?? '' }} />
                </div>
              </div>
              <div className="av-ftr-contact">
                <a href={g.mail_link}>{g.mail_text}</a>
                <a href={g.phone_link}>{g.phone_text}</a>
              </div>
              <div className="av-ftr-soc">
                {socials.map((s, i) =>
                  s.social_media_link && s.social_media_image ? (
                    <a key={s.id ?? i} href={s.social_media_link} target="_blank" rel="noopener noreferrer" data-magnetic>
                      <img src={s.social_media_image} alt="" />
                    </a>
                  ) : null,
                )}
                {g.google_link && g.google_image && (
                  <a href={g.google_link} target="_blank" rel="noopener noreferrer" className="av-ftr-g" aria-label="Google Play" data-magnetic>
                    <img src={g.google_image} alt="Get it on Google Play" />
                  </a>
                )}
              </div>
            </div>
            {cols.map((c: any) => (
              <div className="av-ftr-col" key={c.id}>
                <h4 className="av-eyebrow">{c.title}</h4>
                <ul>
                  {toItems(c.links ?? []).map((l) => (
                    <li key={l.href + l.label}><a href={l.href} {...(l.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <FooterMark />
          <div className="av-ftr-bottom">
            <p>© {new Date().getFullYear()} {settings.siteName} • All Rights Reserved. </p>
            <p>A product by <a href="https://www.nicedigitals.com/" target="_blank" rel="noopener"><img src={`${THEME}/images/nice-digitals-logo.webp`} alt="Nice Digitals" width={500} height={130} /></a></p>
            <p><a href="/terms/">Terms</a><a href="/privacy-policy/">Privacy Policy</a></p>
          </div>
        </div>
      </footer>
      {g.whatsapp_link && g.whatsapp_image && (
        <a className="av-wa" href={g.whatsapp_link} target="_blank" rel="noopener noreferrer" data-magnetic><img src={g.whatsapp_image} alt="WhatsApp" /></a>
      )}
      <DemoModal form={form} title="Schedule A Demo" />
    </>
  )
}

/** Closing band: headline + the lead form (same copy as the old "footer form" block). */
export function CtaBand({ title, content, formTitle, form }: { title?: string | null; content?: string | null; formTitle?: string | null; form: any }) {
  return (
    <section className="av-cta">
      <div className="av-wrap av-cta-in">
        <div className="av-cta-l">
          <h2 className="av-display" data-reveal>{title}</h2>
          <p data-reveal="0.1">{content}</p>
        </div>
        <div className="av-cta-form" data-reveal="0.15">
          <div className="av-eyebrow">{formTitle}</div>
          {form && typeof form === 'object' && <FormRenderer form={form} />}
        </div>
      </div>
    </section>
  )
}

export function FaqSection({ a }: { a: any }) {
  const list = (a?.accordion_list ?? []) as { accordion_question?: string; accordion_answer?: string }[]
  if (!list.length) return null
  return (
    <section className="av-faqs">
      <div className="av-wrap av-faqs-in">
        <div className="av-faqs-h">
          {a.category_accordion_eyebrow && <p className="av-eyebrow">{strip(a.category_accordion_eyebrow)}</p>}
          {a.category_accordion_title && <h2 className="av-display sm" data-reveal>{strip(a.category_accordion_title)}</h2>}
        </div>
        <Faq items={list.map((q) => ({ q: strip(q.accordion_question), a: q.accordion_answer ?? '' }))} />
      </div>
    </section>
  )
}
