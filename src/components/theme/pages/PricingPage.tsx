import { FooterFormBand } from '../Footer'
import { html, strip } from '../util'

/** pricing-page.php */
export function PricingPage({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  return (
    <>
      <section id="main-heading" className="pricing">
        <div className="container">
          <div className="inr-bnr-title"><h1>{a.pricing_banner_title || doc.title}</h1></div>
          <p>{a.pricing_banner_content}</p>
        </div>
      </section>
      <main className="page-content pricing-page">
        <div className="container">
          <section id="page-column" className="full-width" dangerouslySetInnerHTML={html(a.pricing_block_content)} />
        </div>
      </main>
      <FooterFormBand className="tryon-page" title={a.pricing_footer_title} content={strip(a.pricing_footer_content)} formTitle={a.pricing_footer_form_title} form={gc.contactForm} />
    </>
  )
}
