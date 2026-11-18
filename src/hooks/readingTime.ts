import type { CollectionBeforeChangeHook } from 'payload'

const textOf = (node: any): string => {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text + ' '
  return (node.children || []).map(textOf).join('')
}

export const computeReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  const html = typeof data?.contentHtml === 'string' ? data.contentHtml.replace(/<[^>]+>/g, ' ') : ''
  const words = (html || textOf(data?.content?.root)).trim().split(/\s+/).filter(Boolean).length
  if (words) data.readingTime = Math.max(1, Math.round(words / 220))
  return data
}
