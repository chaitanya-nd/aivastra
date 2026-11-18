import { Media } from './Media'

/** Featured image: Media-library image if set, else the external URL (pre-storage). */
export function Cover({ doc, size = 'card', className, priority }: { doc: any; size?: string; className?: string; priority?: boolean }) {
  if (doc?.featuredImage && typeof doc.featuredImage === 'object') {
    return <Media media={doc.featuredImage} size={size} className={className} priority={priority} />
  }
  if (doc?.featuredImageUrl) {
    // biome-ignore lint/performance/noImgElement: external URL until media storage is connected
    return <img src={doc.featuredImageUrl} alt={doc.featuredImageAlt || doc.title || ''} className={className} loading={priority ? 'eager' : 'lazy'} />
  }
  return null
}

export const hasCover = (doc: any) => Boolean((doc?.featuredImage && typeof doc.featuredImage === 'object') || doc?.featuredImageUrl)
