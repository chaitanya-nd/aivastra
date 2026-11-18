'use client'
import type { ReactNode } from 'react'

/**
 * crypto.randomUUID exists only in secure contexts (HTTPS / localhost). Payload's session code calls it,
 * so opening the admin over plain http on the LAN broke login (form just reloaded). Polyfill at module load.
 */
if (typeof window !== 'undefined' && window.crypto && !window.crypto.randomUUID) {
  ;(window.crypto as any).randomUUID = () => {
    const b = crypto.getRandomValues(new Uint8Array(16))
    b[6] = (b[6]! & 15) | 64
    b[8] = (b[8]! & 63) | 128
    const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
  }
}

export function UuidPolyfill({ children }: { children?: ReactNode }) {
  return <>{children}</>
}
