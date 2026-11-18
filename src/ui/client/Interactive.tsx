'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

/** Rotating hero slides (crossfade) — all slides stay in the DOM. */
export function HeroSlides({ slides }: { slides: ReactNode[] }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 3500)
    return () => clearInterval(t)
  }, [paused, slides.length])
  return (
    <div className="av-slides" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.map((s, n) => (
        <div className={`av-slide${n === i ? ' is-on' : ''}`} key={n} aria-hidden={n !== i}>{s}</div>
      ))}
      <div className="av-dots">
        {slides.map((_, n) => (
          <button key={n} className={n === i ? 'is-on' : ''} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} />
        ))}
      </div>
    </div>
  )
}

/** Pill toggle that swaps between panels (Elara-style "Without / With" switch). */
export function Toggle({ tabs, panels }: { tabs: string[]; panels: ReactNode[] }) {
  const [i, setI] = useState(0)
  return (
    <div className="av-toggle-wrap">
      <div className="av-toggle" role="tablist" style={{ ['--n' as any]: tabs.length, ['--i' as any]: i }}>
        <span className="av-toggle-thumb" />
        {tabs.map((t, n) => (
          <button role="tab" aria-selected={n === i} className={n === i ? 'is-on' : ''} key={t} onClick={() => setI(n)}>{t}</button>
        ))}
      </div>
      <div className="av-panels">
        {panels.map((p, n) => (
          <div role="tabpanel" className={`av-panel${n === i ? ' is-on' : ''}`} key={n} aria-hidden={n !== i}>{p}</div>
        ))}
      </div>
    </div>
  )
}

/** Pinned horizontal scroller: vertical scroll drives sideways movement. */
export function HScroll({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const w = wrap.current
    const t = track.current
    if (!w || !t) return
    const mq = window.matchMedia('(min-width: 900px)')
    const size = () => {
      if (!mq.matches) {
        w.style.height = ''
        t.style.transform = ''
        return
      }
      const dist = t.scrollWidth - window.innerWidth + 120
      w.style.height = `${window.innerHeight + Math.max(0, dist)}px`
      w.dataset.dist = String(Math.max(0, dist))
      update()
    }
    const update = () => {
      if (!mq.matches) return
      const dist = Number(w.dataset.dist || 0)
      const r = w.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)))
      t.style.transform = `translate3d(${-dist * p}px,0,0)`
      w.style.setProperty('--hp', String(p))
    }
    size()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', size)
    const imgs = Array.from(t.querySelectorAll('img'))
    imgs.forEach((im) => im.addEventListener('load', size))
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', size)
      imgs.forEach((im) => im.removeEventListener('load', size))
    }
  }, [])
  return (
    <div className="av-hs" ref={wrap}>
      <div className="av-hs-stick">
        <div className="av-hs-track" ref={track}>{children}</div>
        <div className="av-hs-bar"><i /></div>
      </div>
    </div>
  )
}

/** FAQ accordion with FAQPage microdata, animated height. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="av-faq" itemScope itemType="https://schema.org/FAQPage">
      {items.map((it, n) => (
        <div className={`av-faq-i${open === n ? ' is-open' : ''}`} key={n} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
          <h3 itemProp="name">
            <button aria-expanded={open === n} onClick={() => setOpen(open === n ? null : n)}>
              <span>{it.q}</span>
              <i aria-hidden="true" />
            </button>
          </h3>
          <div className="av-faq-a" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
            <div itemProp="text" dangerouslySetInnerHTML={{ __html: it.a }} />
          </div>
        </div>
      ))}
    </div>
  )
}
