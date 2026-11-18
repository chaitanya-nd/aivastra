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

/** Hero virtual try-on stage: Before card → After model, garment picker swaps the look. */
export function TryOnStage({ garments, afters, before, labels }: { garments: string[]; afters: string[]; before: string; labels: { before: string; after: string } }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [picked, setPicked] = useState(false) // once a shopper picks a dress, stop auto-rotating
  useEffect(() => {
    if (paused || picked) return
    const t = setInterval(() => setI((n) => (n + 1) % garments.length), 3500)
    return () => clearInterval(t)
  }, [paused, picked, garments.length])
  return (
    <div className="av-tryon" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="av-tryon-ring" aria-hidden="true" />
      <div className="av-tryon-glow" aria-hidden="true" />
      <div className="av-tryon-after" data-parallax="0.04">
        {afters.map((s, n) => <img key={n} src={s} alt="" className={n === i ? 'is-on' : ''} />)}
      </div>
      <figure className="av-tryon-before" data-depth="0.8">
        <img src={before} alt="" />
        <figcaption>{labels.before}</figcaption>
      </figure>
      <svg className="av-tryon-arrow" viewBox="0 0 110 60" aria-hidden="true"><path d="M2 48 C 40 56, 70 40, 100 24" fill="none" stroke="url(#ag)" strokeWidth="3" strokeLinecap="round" /><path d="M86 18 L102 23 L93 37" fill="none" stroke="#ffb68a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><defs><linearGradient id="ag" x1="0" x2="1"><stop stopColor="#ff5a78" /><stop offset="1" stopColor="#ffb68a" /></linearGradient></defs></svg>
      <div className="av-tryon-picker" role="tablist">
        {garments.map((g, n) => (
          <button key={n} role="tab" aria-selected={n === i} className={n === i ? 'is-on' : ''} onClick={() => { setI(n); setPicked(true) }} aria-label={`Garment ${n + 1}`}>
            <img src={g} alt="" />
            {n === i && <i aria-hidden="true">✓</i>}
          </button>
        ))}
      </div>
      <div className="av-tryon-pill"><i aria-hidden="true">✓</i>{labels.after}</div>
    </div>
  )
}

/** Hero: rotating text + per-slide feature row + per-slide visual stage, all driven by one slide index. */
export function HeroShow({ slides, feats, stages }: { slides: ReactNode[]; feats: ReactNode[]; stages: ReactNode[] }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), 2200)
    return () => clearTimeout(t)
  }, [paused, slides.length, i]) // depends on i so clicking a dot restarts the timer
  return (
    <div className="av-hero-show" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="av-hero2-left">
        <div className="av-slides">
          {slides.map((s, n) => <div className={`av-slide${n === i ? ' is-on' : ''}`} key={n} aria-hidden={n !== i}>{s}</div>)}
        </div>
        <div className="av-dots">
          {slides.map((_, n) => <button key={n} className={n === i ? 'is-on' : ''} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} />)}
        </div>
        <div className="av-feats-stack">
          {feats.map((f, n) => <div className={`av-feats-slide${n === i ? ' is-on' : ''}`} key={n} aria-hidden={n !== i}>{f}</div>)}
        </div>
      </div>
      <div className="av-stages">
        {stages.map((s, n) => <div className={`av-stage${n === i ? ' is-on' : ''}`} key={n} aria-hidden={n !== i}>{s}</div>)}
      </div>
    </div>
  )
}

type Look = { src: string; pos?: string; zoom?: number; big?: Look }
/** Input card → big on-model frame + clickable looks rail (flat lay and jewellery banners). */
export function LookStage({ kind, inputLabel, inputIcon, inputImg, main, thumbs, pill, arrow }: { kind: 'flat' | 'jewel'; inputLabel: string; inputIcon: string; inputImg: string; main: Look; thumbs: Look[]; pill: string; arrow: string }) {
  const [sel, setSel] = useState(-1) // -1 = hero shot, 0.. = rail look
  const [paused, setPaused] = useState(false)
  const [picked, setPicked] = useState(false)
  useEffect(() => {
    if (paused || picked) return
    const t = setInterval(() => setSel((n) => (n + 1 >= thumbs.length ? -1 : n + 1)), 3200)
    return () => clearInterval(t)
  }, [paused, picked, thumbs.length])
  const looks = [main, ...thumbs.map((t) => t.big ?? t)]
  return (
    <div className={`av-look av-look-${kind}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="av-look-glow" aria-hidden="true" />
      <div className="av-look-input">
        <span className="av-look-chip"><img src={inputIcon} alt="" width={20} height={20} />{inputLabel}</span>
        <div className="av-look-input-img"><img src={inputImg} alt="" /></div>
      </div>
      <div className="av-look-main">
        {looks.map((l, n) => (
          <img key={n} src={l.src} alt="" className={n === sel + 1 ? 'is-on' : ''} style={{ objectPosition: l.pos || 'center top', transform: n === sel + 1 && l.zoom ? `scale(${l.zoom})` : undefined }} />
        ))}
        <div className="av-look-pill"><i aria-hidden="true">✓</i>{pill}</div>
      </div>
      <div className="av-look-arrow" aria-hidden="true"><img src={arrow} alt="" /></div>
      <div className="av-look-rail" role="tablist">
        {thumbs.map((t, n) => (
          <button key={n} role="tab" aria-selected={sel === n} className={sel === n ? 'is-on' : ''} onClick={() => { setSel(n); setPicked(true) }} aria-label={`Look ${n + 1}`}>
            <img src={t.src} alt="" style={{ objectPosition: t.pos || 'center top' }} />
          </button>
        ))}
      </div>
    </div>
  )
}
