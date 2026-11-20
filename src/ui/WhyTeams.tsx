import { THEME_URL } from '@/components/theme/util'
import { WhyShow } from './client/Interactive'

/** "Why teams choose Ai Vastra" — stats strip + switchable source → catalogue visual */
const COPY = {
  catalogue: {
    stats: [['1,000', 'Images in the largest pack'], ['5', 'Categories: men, women, boys, girls, jewellery'], ['3', 'Easy steps to a finished catalogue'], ['1', 'Flat-lay photo is all it takes']],
    tag: 'FOR FASHION BRANDS AND SELLERS',
    title: 'Skip the studio shoot.',
    body: 'Upload one flat-lay and get on-model catalogue photos in every pose and background, ready for your store and marketplaces.',
    srcLabel: 'YOUR PHOTO',
    outLabel: 'YOUR CATALOGUE',
  },
  tryon: {
    stats: [['2,000', 'Try-ons in the largest pack'], ['0', 'Credits deducted for a failed try-on'], ['2', 'Ways to integrate: website and Shopify'], ['0', 'Monthly subscription, credits never expire']],
    tag: 'FOR STORES AND ONLINE SHOPPERS',
    title: 'Let shoppers try it on before they buy.',
    body: 'Add virtual try-on to your website or Shopify store, white-labelled as your own. Shoppers see the garment on themselves, and you only pay for try-ons that succeed.',
    srcLabel: 'THE GARMENT',
    outLabel: 'SHOPPER TRY-ON',
  },
}

export function WhyTeams({ variant = 'catalogue' }: { variant?: 'catalogue' | 'tryon' }) {
  const c = COPY[variant]
  return (
    <section className="av-why">
      <div className="av-wrap">
        <p className="av-why-eyebrow">WHY TEAMS CHOOSE <b>AI VASTRA</b></p>
        <div className="av-why-card" data-reveal>
          <div className="av-why-stats">
            {c.stats.map(([n, l]) => (
              <div className="av-why-stat" key={l}><b>{n}</b><span>{l}</span></div>
            ))}
          </div>
          <div className="av-why-row">
            <div className="av-why-copy">
              <span className="av-why-tag">{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
            <WhyShow srcLabel={c.srcLabel} outLabel={c.outLabel} sets={[
              { tab: 'Women', label: 'Dress', src: '/hero/flat/flatlay-dress.png', out: ['/hero/after-red.png', '/hero/after-cream.png', '/hero/flat/model-main.png'] },
              { tab: 'Men', label: 'Sherwani set', src: '/garments/men/sherwani-and-pyjama.webp', out: ['https://aivastra.com/wp-content/uploads/2026/10/Nehru-jacket.webp', 'https://aivastra.com/wp-content/uploads/2026/08/Rectangle-49-1.webp', 'https://aivastra.com/wp-content/uploads/2026/10/Nehru-jacket-Img.webp'] },
              { tab: 'Jewellery', label: 'Necklace set', src: '/hero/jewel/jewellery-set.png', out: ['/hero/jewel/model-pose-3.png', `${THEME_URL}/images/jewelleryimg.webp`, '/hero/jewel/model-main.png'] },
            ]} />
          </div>
        </div>
      </div>
    </section>
  )
}
