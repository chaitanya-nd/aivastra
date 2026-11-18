import { faqSchema } from '@/lib/schema'
import { JsonLd } from './JsonLd'

type Item = { question: string; answer: string }

export function Faq({ title, items, eyebrow }: { title?: string | null; items: Item[]; eyebrow?: string | null }) {
  if (!items?.length) return null
  return (
    <section className="faq container narrow">
      <JsonLd data={faqSchema(items)} />
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title || 'Frequently asked questions'}</h2>
      {items.map((q, i) => (
        <details key={i} open={i === 0}>
          <summary>{q.question}</summary>
          <p>{q.answer}</p>
        </details>
      ))}
    </section>
  )
}
