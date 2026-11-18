import type { ElementType } from 'react'

/** Splits a heading into words for the reveal animation. The visible/DOM text stays identical;
 *  the last `accent` words get the serif-italic accent style. */
export function Words({ text, accent = 0, as: Tag = 'span', className = '' }: { text: string; accent?: number; as?: ElementType; className?: string }) {
  const parts = text.replace(/\s+/g, ' ').trim().split(' ')
  const cut = accent > 0 ? Math.max(0, parts.length - accent) : parts.length
  const w = (word: string, i: number) => (
    <span className="av-w" key={i}>
      <span className="av-wi">{word}</span>
    </span>
  )
  return (
    <Tag className={`av-words ${className}`.trim()}>
      {parts.slice(0, cut).map((p, i) => [w(p, i), ' '])}
      {accent > 0 && (
        <em className="av-acc">
          {parts.slice(cut).map((p, i) => [w(p, 1000 + i), i < parts.length - cut - 1 ? ' ' : ''])}
        </em>
      )}
    </Tag>
  )
}
