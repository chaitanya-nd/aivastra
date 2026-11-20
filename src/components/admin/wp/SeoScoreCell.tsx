'use client'

/** List column: Rank Math-style SEO score badge. */
export function SeoScoreCell({ cellData }: any) {
  if (typeof cellData !== 'number') return <span className="seo-badge none" title="No focus keyword">N/A</span>
  const tone = cellData >= 80 ? 'good' : cellData >= 50 ? 'ok' : 'bad'
  return <span className={`seo-badge ${tone}`} title="SEO score">{cellData} / 100</span>
}
