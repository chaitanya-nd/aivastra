import { bodyOf, hasBody } from '@/lib/body'
import { RichText } from '@/components/RichText'
import { FooterFormBand } from '../Footer'
import { Accordion, strip, texturize } from '../util'

/** page.php */
export function DefaultPage({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  return (
    <>
      <section id="main-heading" className="contact">
        <div className="container">
          <div className="inr-bnr-title"><h1>{texturize(doc.title)}</h1></div>
        </div>
      </section>
      <main id="page-content" className="default-page default">
        <div className="container">
          <div className="page-col-full">
            <section id="page-column">
              {hasBody(doc) && <RichText data={bodyOf(doc)} />}
              <Accordion a={{ ...a, category_accordion_title: undefined, category_accordion_eyebrow: undefined }} />
            </section>
          </div>
        </div>
      </main>
      <FooterFormBand title={gc.footer_top_left_title} content={strip(gc.footer_top_left_content)} formTitle={gc.footer_top_right_title} form={gc.contactForm} />
    </>
  )
}
