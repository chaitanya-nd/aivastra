import { getPluginSettings } from '@/lib/data'
import type { Heading } from '@/lib/richtext'

export async function Toc({ headings }: { headings: Heading[] }) {
  const ps = await getPluginSettings()
  if (ps?.tocEnabled === false) return null
  const depth = Number(ps?.tocDepth || 4)
  headings = headings.filter((h) => h.level <= depth)
  if (headings.length < (ps?.tocMinHeadings ?? 2)) return null
  return (
    <nav className="toc" aria-label="Table of contents">
      <strong>{ps?.tocTitle || 'Table of contents'}</strong>
      <ol>
        {headings.map((h) => (
          <li key={h.id} className={`l${h.level}`}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
