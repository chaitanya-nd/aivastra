'use client'

import { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, type ReactNode } from 'react'

/**
 * Endless horizontal scroller with start / end arrows. The cards are rendered three times
 * and the scroll position is silently wrapped, so it keeps moving forward with no blank end.
 */
export function ScrollRow({ children, gridClassName = '' }: { children: ReactNode; gridClassName?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const items = Children.toArray(children)
  const loop = items.length > 1

  const setWidth = useCallback(() => {
    const g = ref.current?.firstElementChild as HTMLElement | null
    if (!g || g.children.length < items.length * 2) return 0
    return (g.children[items.length] as HTMLElement).getBoundingClientRect().left - (g.children[0] as HTMLElement).getBoundingClientRect().left
  }, [items.length])

  useEffect(() => {
    const el = ref.current
    if (!el || !loop) return
    const w = setWidth()
    if (w) el.scrollLeft = w
    const onScroll = () => {
      if (busy.current) return
      const sw = setWidth()
      if (!sw) return
      if (el.scrollLeft < sw * 0.5) el.scrollLeft += sw
      else if (el.scrollLeft >= sw * 1.5) el.scrollLeft -= sw
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    const size = () => {
      const n = el.clientWidth < 700 ? 2 : 4
      el.style.setProperty('--sr-w', `${(el.clientWidth - (n - 1) * 12) / n}px`)
    }
    size()
    const ro = new ResizeObserver(() => { size(); const s = setWidth(); if (s && el.scrollLeft < s * 0.5) el.scrollLeft += s })
    ro.observe(el)
    return () => { el.removeEventListener('scroll', onScroll); ro.disconnect() }
  }, [loop, setWidth])

  const anim = useRef(0)
  const go = (dir: number) => {
    const el = ref.current
    const c = el?.querySelector('.guide-category-card') as HTMLElement | null
    if (!el || !c) return
    const sw = setWidth()
    const pitch = sw ? sw / items.length : c.offsetWidth + 12
    busy.current = true
    cancelAnimationFrame(anim.current)
    el.style.scrollSnapType = 'none'
    // always travel in the pressed direction; the wrap below is invisible because the copies are identical
    let from = el.scrollLeft
    const to0 = Math.round(from / pitch) * pitch + dir * pitch
    let to = to0
    const t0 = performance.now(), dur = 520
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3)
      el.scrollLeft = from + (to - from) * e
      if (sw) {
        if (el.scrollLeft >= sw * 2) { el.scrollLeft -= sw; from -= sw; to -= sw }
        else if (el.scrollLeft < sw * 0.5) { el.scrollLeft += sw; from += sw; to += sw }
      }
      if (k < 1) anim.current = requestAnimationFrame(tick)
      else { el.style.scrollSnapType = ''; busy.current = false }
    }
    anim.current = requestAnimationFrame(tick)
  }

  const sets = loop ? [0, 1, 2] : [0]
  return (
    <div className="av-scrollrow has-over">
      <button type="button" className="av-sr-btn prev" aria-label="Scroll left" onClick={() => go(-1)}>←</button>
      <div className="av-sr-track" ref={ref}>
        <div className={gridClassName}>
          {sets.flatMap((s) => items.map((c, i) => (isValidElement(c) ? cloneElement(c, { key: `${s}-${i}` }) : c)))}
        </div>
      </div>
      <button type="button" className="av-sr-btn next" aria-label="Scroll right" onClick={() => go(1)}>→</button>
    </div>
  )
}
