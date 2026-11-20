'use client'

/** List column: internal · external · incoming links (Rank Math link counter). */
export function LinksCell({ rowData }: any) {
  const v = (k: string) => (typeof rowData?.[k] === 'number' ? rowData[k] : '–')
  return (
    <span className="wpl-links" title="Internal · External · Incoming links">
      <b title="Internal links">{v('internalLinks')}</b><i>·</i><b title="External links">{v('externalLinks')}</b><i>·</i><b title="Incoming links">{v('incomingLinks')}</b>
    </span>
  )
}
