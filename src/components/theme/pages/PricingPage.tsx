import { FooterFormBand } from '../Footer'
import { html, strip } from '../util'
import { WhyTeams } from '@/ui/WhyTeams'
import { WhySlot } from '@/ui/client/WhySlot'
import { CurrencyToggle } from '../CurrencyToggle'

/** pricing-page.php */
export function PricingPage({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  // drop a slot between each plan set (catalogue + try-on) and its FAQs; <WhyTeams/> is portalled into it
  let n = 0
  const block = String(a.pricing_block_content ?? '').replace(/<div class="inr-faqs-sec">/g, (m) => `<div id="why-slot-${++n}"></div>${m}`)
  const slots = Array.from({ length: n }, (_, i) => `why-slot-${i + 1}`)
  return (
    <>
      <section id="main-heading" className="pricing">
        <div className="container">
          <div className="inr-bnr-title"><h1>{a.pricing_banner_title || doc.title}</h1></div>
          <p>{a.pricing_banner_content}</p>
        </div>
      </section>
      <main className="page-content pricing-page" id="pricing-currency-root" data-currency="inr">
        <div className="container">
          <CurrencyToggle />
          <section id="page-column" className="full-width" dangerouslySetInnerHTML={html(block)} />
        </div>
      </main>
      {slots.map((id, i) => <WhySlot key={id} id={id}><WhyTeams variant={i === 0 ? 'catalogue' : 'tryon'} /></WhySlot>)}
      <FooterFormBand className="tryon-page" title={a.pricing_footer_title} content={strip(a.pricing_footer_content)} formTitle={a.pricing_footer_form_title} form={gc.contactForm} />
    </>
  )
}
