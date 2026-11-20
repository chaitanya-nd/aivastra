/** Recompute the stored SEO score of every post / page / guide … (run once after deploying, or after changing the analysis). */
import config from '@payload-config'
import { getPayload } from 'payload'
import { scoreOf } from '@/hooks/seoScore'

const payload = await getPayload({ config })
let n = 0
for (const collection of ['posts', 'pages', 'guides', 'cases', 'updates', 'reviews'] as const) {
  const res = await payload.find({ collection, pagination: false, limit: 10000, depth: 0, overrideAccess: true, draft: false } as any)
  for (const d of res.docs as any[]) {
    const score = scoreOf(collection, d)
    if (score !== (d.seoScore ?? null)) { await payload.db.updateOne({ collection, where: { id: { equals: d.id } }, data: { seoScore: score } } as any); n++ }
  }
}
console.log(`Updated ${n} scores.`)
process.exit(0)
