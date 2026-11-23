import { WhyShow } from './client/Interactive'

/** "Why teams choose Ai Vastra" — stats strip + switchable source → catalogue visual */
const COPY = {
  catalogue: {
    stats: [['1,000', 'Images in the largest pack'], ['5', 'Categories: men, women, boys, girls, jewellery'], ['3', 'Easy steps to a finished catalogue'], ['1', 'Flat-lay photo is all it takes']],
    tag: 'FOR FASHION BRANDS AND SELLERS',
    title: <>Skip the <span className="av-purple">studio shoot</span>.</>,
    body: 'Upload one flat-lay and get on-model catalogue photos in every pose and background, ready for your store and marketplaces.',
    srcLabel: 'YOUR PHOTO',
    outLabel: 'YOUR CATALOGUE',
  },
  tryon: {
    stats: [['2,000', 'Try-ons in the largest pack'], ['0', 'Credits deducted for a failed try-on'], ['2', 'Ways to integrate: website and Shopify'], ['0', 'Monthly subscription, credits never expire']],
    tag: 'FOR STORES AND ONLINE SHOPPERS',
    title: <>Let shoppers try it on <span className="av-purple">before they buy</span>.</>,
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
              { tab: 'Women', items: [
                { label: 'Saree', src: '/garments/women/saree-flat-lay.webp', out: '/results/women/saree.webp' },
                { label: 'Long frock', src: '/garments/women/long-frock.webp', out: '/results/women/longfrock.webp' },
                { label: 'Cocktail dress', src: '/garments/women/cocktail.webp', out: '/results/women/cocktail.webp' },
              ] },
              { tab: 'Men', items: [
                { label: 'Blazer', src: '/garments/men/blazer.webp', out: '/results/men/blazer.webp' },
                { label: 'Suit', src: '/garments/men/one-piece-suit.webp', out: '/results/men/onepiecesuit.webp' },
                { label: 'Kurta', src: '/garments/men/kurta.webp', out: '/results/men/kurta.webp' },
              ] },
              { tab: 'Boys', items: [
                { label: 'Blazer', src: '/garments/boys/blazer.webp', out: '/results/boys/blazer.webp' },
                { label: 'Suit', src: '/garments/boys/suit.webp', out: '/results/boys/suit.webp' },
                { label: 'Kurta', src: '/garments/boys/kurta.webp', out: '/results/boys/kurta.webp' },
              ] },
              { tab: 'Girls', items: [
                { label: 'Blazer', src: '/garments/girls/blazer.webp', out: '/results/girls/blazer.webp' },
                { label: 'Mini frock', src: '/garments/girls/mini-frock.webp', out: '/results/girls/minifrock.webp' },
                { label: 'Long frock', src: '/garments/girls/long-frock.webp', out: '/results/girls/long-frock.webp' },
              ] },
              { tab: 'Jewellery', items: [
                { label: 'Earrings', src: '/results/jewellery/product-4.webp', out: '/results/jewellery/earrings-model.webp' },
                { label: 'Bracelet', src: '/results/jewellery/product-2.webp', out: '/results/jewellery/bracelet-model.webp' },
                { label: 'Necklace', src: '/results/jewellery/product-1.webp', out: '/results/jewellery/necklace-saree.webp' },
              ] },
            ]} />
          </div>
        </div>
      </div>
    </section>
  )
}
