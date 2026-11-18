import Image from 'next/image'
import { SITE_URL } from '@/lib/urls'

export function Media({ media, size = 'card', className, priority }: { media: any; size?: string; className?: string; priority?: boolean }) {
  if (!media || typeof media !== 'object' || !media.url) return null
  const s = media.sizes?.[size]
  const raw: string = s?.url || media.url
  // Payload returns absolute URLs when serverURL is set; next/image wants a local path (or a configured remote host).
  const src = raw.startsWith(SITE_URL) ? raw.slice(SITE_URL.length) : raw
  const w = s?.width || media.width || 1200
  const h = s?.height || media.height || 675
  return <Image src={src} alt={media.alt || ''} width={w} height={h} className={className} priority={priority} sizes="(max-width: 800px) 100vw, 720px" />
}
