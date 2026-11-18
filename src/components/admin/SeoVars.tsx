import type { UIFieldServerComponent } from 'payload'

const VARS: [string, string][] = [
  ['%title%', 'Post / page / term title'], ['%sitename%', 'Site name'], ['%sitedesc%', 'Tagline'], ['%sep%', 'Separator character'],
  ['%excerpt%', 'Excerpt or first words'], ['%category%', 'Primary category'], ['%date%', 'Published date'], ['%modified%', 'Modified date'],
  ['%name%', 'Author name'], ['%term%', 'Category/tag name'], ['%term_description%', 'Category/tag description'], ['%page%', 'Page number'], ['%currentyear%', 'Current year'],
]
export const SeoVars: UIFieldServerComponent = () => (
  <div className="wpw" style={{ marginBottom: 18 }}>
    <h2>Template variables <small>Rank Math</small></h2>
    <ul className="wpw-list" style={{ columns: 2, padding: '10px 0' }}>
      {VARS.map(([v, d]) => <li key={v}><code>{v}</code><span>{d}</span></li>)}
    </ul>
  </div>
)
