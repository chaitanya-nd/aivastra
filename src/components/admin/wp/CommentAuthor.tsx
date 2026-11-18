'use client'

/** Comments → Author column: name, email, IP (WordPress). */
export function CommentAuthor({ rowData, cellData }: any) {
  return (
    <div className="wpc-author">
      <b>{cellData || 'Anonymous'}</b>
      {rowData?.authorEmail && <a href={`mailto:${rowData.authorEmail}`}>{rowData.authorEmail}</a>}
      {rowData?.authorUrl && <a href={rowData.authorUrl} target="_blank" rel="noreferrer">{rowData.authorUrl.replace(/^https?:\/\//, '')}</a>}
      {rowData?.ip && <span>{rowData.ip}</span>}
    </div>
  )
}
