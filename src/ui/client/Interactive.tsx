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
      <svg className="av-tryon-arrow" viewBox="0 0 110 60" aria-hidden="true"><path d="M2 48 C 40 56, 70 40, 100 24" fill="none" stroke="url(#ag)" strokeWidth="3" strokeLinecap="round" /><path d="M86 18 L102 23 L93 37" fill="none" stroke="#7c5cff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><defs><linearGradient id="ag" x1="0" x2="1"><stop stopColor="#b07cff" /><stop offset="1" stopColor="#7c5cff" /></linearGradient></defs></svg>
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

type CatTab = { label: string; icon: 'dress' | 'shirt' | 'gem'; inputLabel: string; input: string; images: { src: string; pos?: string; on?: string }[] }
const TabIcon = ({ k }: { k: CatTab['icon'] }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {k === 'shirt' && <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />}
    {k === 'dress' && <path d="M9 2h6M9 2l1 6-3 4 1 10h8l1-10-3-4 1-6M10 8h4" />}
    {k === 'gem' && <path d="M6 3h12l4 6-10 13L2 9ZM11 3 8 9l4 13 4-13-3-6M2 9h20" />}
  </svg>
)
/** Category showcase: tabs → flat-lay input → draggable, auto-scrolling on-model strip with dots. */
export function CategoryShowcase({ tabs, aside, footer }: { tabs: CatTab[]; aside?: ReactNode; footer?: ReactNode }) {
  const [t, setT] = useState(0)
  const [dot, setDot] = useState(0)
  const [worn, setWorn] = useState(0) // index of the garment whose on-model photo is shown
  const cur = tabs[t]
  const loop = [...cur.images, ...cur.images] // duplicated so the strip loops seamlessly
  const strip = useRef<HTMLDivElement>(null)
  const hold = useRef(false) // true while hovering / dragging / touching → auto-scroll pauses
  const drag = useRef<{ x: number; l: number } | null>(null)
  const step = () => { const f = strip.current?.firstElementChild?.firstElementChild as HTMLElement | null; return f ? f.offsetWidth + 14 : 1 }
  useEffect(() => {
    const el = strip.current
    if (!el) return
    el.scrollLeft = 0
    setDot(0); setWorn(0)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0.15 })
    io.observe(el)
    let raf = 0, last = 0, pos = 0, set = 0
    const SPEED = 75 // px per second — gentle drift
    const tick = (now: number) => {
      const dt = Math.min(64, now - (last || now)); last = now
      if (Math.abs(el.scrollLeft - set) > 1.5) pos = el.scrollLeft // user dragged / swiped → follow them
      if (visible && !hold.current && !reduce) pos += (SPEED * dt) / 1000
      else pos = el.scrollLeft
      const half = el.scrollWidth / 2
      if (pos >= half) pos -= half
      else if (pos < 0) pos += half
      el.scrollLeft = pos
      set = el.scrollLeft
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [t])
  const card = useRef<HTMLDivElement>(null)
  // person shown = on-model photo of the nearest garment (at or before the applied one) that has one
  const shown = (() => { const n = cur.images.length; for (let i = 0; i < n; i++) { const k = (((worn - i) % n) + n) % n; if (cur.images[k].on) return k } return -1 })()
  const seen = useRef({ t: -1, w: -1 })
  useEffect(() => {
    const prev = seen.current
    seen.current = { t, w: worn }
    const N = cur.images.length
    if (prev.t !== t || prev.w % N === worn % N) return // only animate a garment change within the same tab
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tile = strip.current?.querySelector('.av-showcase-img.is-worn img') as HTMLImageElement | null
    const dest = card.current
    if (!tile || !dest) return
    const a = tile.getBoundingClientRect(), b = dest.getBoundingClientRect()
    const fly = document.createElement('img')
    fly.src = tile.src
    try { // cut the white studio background out so only the garment flies
      const cv = document.createElement('canvas'), w = 360, h = Math.round(360 * (tile.naturalHeight / tile.naturalWidth)) || 360
      cv.width = w; cv.height = h
      const cx = cv.getContext('2d')!
      cx.drawImage(tile, 0, 0, w, h)
      const d = cx.getImageData(0, 0, w, h), px = d.data
      // remove the plain studio backdrop (and its soft shadow): flood inward from the edges, but only through
      // roomy background areas (7×7 all backdrop-like) so thin white details of a garment aren't eaten
      const N = w * h, like = new Uint8Array(N)
      for (let k = 0; k < N; k++) { const r = px[k * 4], g = px[k * 4 + 1], bl = px[k * 4 + 2], mn = Math.min(r, g, bl); like[k] = Math.max(r, g, bl) - mn < 12 && mn >= 180 ? 1 : 0 }
      const R = 3, I = new Int32Array((w + 1) * (h + 1))
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) I[(y + 1) * (w + 1) + x + 1] = like[y * w + x] + I[y * (w + 1) + x + 1] + I[(y + 1) * (w + 1) + x] - I[y * (w + 1) + x]
      const roomy = (x: number, y: number) => {
        const x0 = Math.max(0, x - R), y0 = Math.max(0, y - R), x1 = Math.min(w, x + R + 1), y1 = Math.min(h, y + R + 1)
        return I[y1 * (w + 1) + x1] - I[y0 * (w + 1) + x1] - I[y1 * (w + 1) + x0] + I[y0 * (w + 1) + x0] === (x1 - x0) * (y1 - y0)
      }
      const gone = new Uint8Array(N), q: number[] = []
      const push = (x: number, y: number) => { const k = y * w + x; if (!gone[k] && like[k] && roomy(x, y)) { gone[k] = 1; q.push(k) } }
      for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1) }
      for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y) }
      while (q.length) {
        const k = q.pop()!, x = k % w, y = (k - x) / w
        if (x > 0) push(x - 1, y); if (x < w - 1) push(x + 1, y)
        if (y > 0) push(x, y - 1); if (y < h - 1) push(x, y + 1)
      }
      for (let pass = 0; pass < R; pass++) { // grow back the few pixels the roomy test held off
        const add: number[] = []
        for (let k = 0; k < N; k++) if (!gone[k] && like[k]) { const x = k % w; if ((x > 0 && gone[k - 1]) || (x < w - 1 && gone[k + 1]) || (k >= w && gone[k - w]) || (k < N - w && gone[k + w])) add.push(k) }
        for (const k of add) gone[k] = 1
      }
      for (let k = 0; k < N; k++) if (gone[k]) px[k * 4 + 3] = 0
      cx.putImageData(d, 0, 0)
      fly.src = cv.toDataURL('image/png')
    } catch { /* keep the original image if the canvas is blocked */ }
    Object.assign(fly.style, { position: 'fixed', left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', objectFit: 'contain', zIndex: '60', pointerEvents: 'none', filter: 'drop-shadow(0 0 14px rgba(77,163,255,.7))' })
    document.body.appendChild(fly)
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2)
    const k = Math.min(1, (b.width * 0.7) / a.width)
    const an = fly.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.85}px,${dy * 0.85}px) scale(${(1 + k) / 2})`, opacity: 1, offset: 0.7 },
      { transform: `translate(${dx}px,${dy}px) scale(${k})`, opacity: 0 },
    ], { duration: 900, easing: 'cubic-bezier(.5,0,.2,1)' })
    an.onfinish = () => fly.remove()
    return () => fly.remove()
  }, [worn, t])
  const onScroll = () => {
    const el = strip.current
    if (!el) return
    const k = Math.round((el.scrollLeft % (el.scrollWidth / 2)) / step()) % cur.images.length
    if (k !== dot) setDot(k)
    // garment crossing the strip's centre gets "applied" to the person
    const c = Math.floor((el.scrollLeft + el.clientWidth / 2) / step())
    if (c !== worn) setWorn(c)
  }
  return (
    <div className="av-showcase">
      {aside && <div className="av-showcase-aside">{aside}</div>}
      <div className="av-showcase-main">
        <div className="av-showcase-tabs" role="tablist">
          {tabs.map((x, k) => (
            <button key={x.label} role="tab" aria-selected={k === t} className={k === t ? 'is-on' : ''} onClick={() => setT(k)}><TabIcon k={x.icon} />{x.label}</button>
          ))}
        </div>
        <div className="av-showcase-stage" key={t}>
          <figure className="av-showcase-in">
            <div ref={card}>
              {cur.images.map((im, k) => im.on && <img key={k} src={im.on} alt={k === shown ? cur.inputLabel : ''} className={k === shown ? 'is-on' : ''} />)}
              {shown < 0 && <img src={cur.input} alt={cur.inputLabel} className="is-on" />}
            </div>
            <figcaption>{cur.inputLabel}</figcaption>
          </figure>
          <span className="av-showcase-arrow" aria-hidden="true">→</span>
          <div
            className="av-showcase-strip" ref={strip} onScroll={onScroll}
            onMouseLeave={() => { hold.current = false; drag.current = null }}
            onTouchStart={() => { hold.current = true }}
            onTouchEnd={() => { hold.current = false }}
            onPointerDown={(e) => { if (e.pointerType === 'mouse') { hold.current = true; drag.current = { x: e.clientX, l: strip.current!.scrollLeft } } }}
            onPointerMove={(e) => { if (drag.current) strip.current!.scrollLeft = drag.current.l - (e.clientX - drag.current.x) }}
            onPointerUp={() => { drag.current = null; hold.current = false }}
          >
            <div className="av-showcase-track">
              {loop.map((im, k) => (
                <div className={'av-showcase-img' + (k === worn ? ' is-worn' : '')} key={k} aria-hidden={k >= cur.images.length}><img src={im.src} alt="" loading="lazy" style={{ objectPosition: im.pos || 'center top' }} /></div>
              ))}
            </div>
          </div>
        </div>
        <div className="av-showcase-dots">
          {cur.images.map((_, k) => <button key={k} className={k === dot ? 'is-on' : ''} aria-label={`Image ${k + 1}`} onClick={() => strip.current?.scrollTo({ left: k * step(), behavior: 'smooth' })} />)}
        </div>
      </div>
      {footer && <div className="av-showcase-foot">{footer}</div>}
    </div>
  )
}

/** Scroll-driven vertical ticker: columns slide up/down in alternating directions as the page scrolls, looping endlessly. */
export function ScrollTicker({ cols }: { cols: string[][] }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const lists = [...el.querySelectorAll<HTMLElement>('.av-tk-col')]
    let raf = 0, cur = 0, target = 0
    const calc = () => {
      const r = el.getBoundingClientRect()
      target = (window.innerHeight - r.top) * 0.5
    }
    const apply = () => {
      cur += (target - cur) * 0.12
      lists.forEach((u, i) => {
        const H = u.scrollHeight / 3
        if (!H) return
        const t = ((cur % H) + H) % H
        u.style.transform = `translate3d(0, ${i % 2 === 0 ? -t : t - H}px, 0)`
      })
      raf = Math.abs(target - cur) > 0.2 ? requestAnimationFrame(apply) : 0
    }
    const kick = () => { calc(); if (!raf) raf = requestAnimationFrame(apply) }
    calc(); cur = target; apply()
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    return () => { window.removeEventListener('scroll', kick); window.removeEventListener('resize', kick); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div className="av-tk" ref={root}>
      {cols.map((col, i) => (
        <div className="av-tk-win" key={i}>
          <div className="av-tk-col">
            {[0, 1, 2].flatMap((k) => col.map((src, j) => (
              <figure key={`${k}-${j}`} aria-hidden={k > 0}><img src={src} alt="" loading="lazy" /></figure>
            )))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Pinned 3D stacked cards: each card swings in from the right while earlier cards tuck behind on the left. */
export function CardStack({ intro, cards }: { intro: ReactNode; cards: ReactNode[] }) {
  const wrap = useRef<HTMLDivElement>(null)
  const n = cards.length
  useEffect(() => {
    const w = wrap.current
    if (!w) return
    const items = [...w.querySelectorAll<HTMLElement>('.av-stk-card')]
    const mq = window.matchMedia('(min-width: 900px)')
    let raf = 0
    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
    const draw = () => {
      raf = 0
      if (!mq.matches) { items.forEach((c) => { c.style.transform = ''; c.style.opacity = ''; c.style.filter = '' }); return }
      const r = w.getBoundingClientRect()
      const p = clamp(-r.top / Math.max(1, r.height - window.innerHeight))
      const a = p * (n - 1 + 0.7) - 0.7 // active float: card i is front when a === i
      w.style.setProperty('--hp', String(p))
      items.forEach((c, i) => {
        const t = a - i
        if (t < 0) {
          const u = clamp(-t) // 1 = off-stage right, 0 = arrived
          c.style.transform = `translate3d(${u * 105}%,0,${-u * 80}px) rotateY(${-u * 32}deg)`
          c.style.opacity = String(1 - u * 0.9)
          c.style.filter = ''
        } else {
          const d = Math.min(t, 2.6)
          c.style.transform = `translate3d(${-d * 11}%,0,${-d * 60}px) rotateY(${Math.min(1, d) * 8}deg) scale(${1 - d * 0.045})`
          c.style.opacity = String(clamp(1 - Math.max(0, t - 2.4) * 1.6))
          c.style.filter = `brightness(${1 - Math.min(1, d) * 0.28 - Math.max(0, d - 1) * 0.1})`
        }
        c.style.zIndex = String(10 + i)
      })
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw) }
    draw()
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    return () => { window.removeEventListener('scroll', kick); window.removeEventListener('resize', kick); cancelAnimationFrame(raf) }
  }, [n])
  return (
    <div className="av-stk" ref={wrap} style={{ ['--n' as string]: n }}>
      <div className="av-stk-stick">
        <div className="av-stk-intro">{intro}</div>
        <div className="av-stk-stage">
          {cards.map((c, i) => <div className="av-stk-card" key={i}>{c}</div>)}
        </div>
        <div className="av-hs-bar"><i /></div>
      </div>
    </div>
  )
}

/** Footer wordmark: when it scrolls into view each letter drops in slowly from above and bounces to rest. */
export function FooterMark() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const letters = [...el.querySelectorAll<HTMLElement>('.av-ftr-l')]
    let anims: Animation[] = []
    const arm = () => { anims.forEach((x) => x.cancel()); anims = []; el.dataset.armed = '1' }
    arm()
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (anims.length) return
        const out = 'cubic-bezier(0,.55,.45,1)', inn = 'cubic-bezier(.55,0,1,.45)'
        anims = letters.map((l, i) => l.animate([
          { transform: 'translateY(-1.3em)', opacity: 0, easing: inn },
          { transform: 'translateY(0)', opacity: 1, offset: 0.46, easing: out },
          { transform: 'translateY(-.26em)', opacity: 1, offset: 0.64, easing: inn },
          { transform: 'translateY(0)', opacity: 1, offset: 0.8, easing: out },
          { transform: 'translateY(-.07em)', opacity: 1, offset: 0.9, easing: inn },
          { transform: 'translateY(0)', opacity: 1 },
        ], { duration: 1500, delay: 100 + i * 90, fill: 'both' }))
        delete el.dataset.armed
      } else if (e.boundingClientRect.top > 0 && anims.length) arm() // scrolled back above it → reset
    }, { threshold: 0.5 })
    io.observe(el)
    return () => { io.disconnect(); anims.forEach((x) => x.cancel()) }
  }, [])
  const L = ({ c, children }: { c?: string; children: ReactNode }) => <span className={`av-ftr-l ${c ?? ''}`}>{children}</span>
  return (
    <div className="av-ftr-mark" aria-hidden="true" ref={root}>
      <L>a</L><L>i</L><span className="av-ftr-sp" /><L>v</L><L>a</L><L>s</L><L>t</L><L>r</L><L>a</L>
    </div>
  )
}

/* "Why teams choose" visual: pick a category, the flat-lay and catalogue fan change together */
export function WhyShow({ sets, srcLabel = 'YOUR PHOTO', outLabel = 'YOUR CATALOGUE' }: { srcLabel?: string; outLabel?: string; sets: { tab: string; label: string; src: string; out: [string, string, string] }[] }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [picked, setPicked] = useState(false) // a manual pick stops the auto-rotation
  useEffect(() => {
    if (paused || picked || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % sets.length), 3500)
    return () => clearInterval(t)
  }, [paused, picked, sets.length])
  const s = sets[i]
  return (
    <div className="av-why-visual-wrap" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="av-why-tabs" role="tablist">
        {sets.map((t, n) => (
          <button key={t.tab} role="tab" aria-selected={n === i} className={n === i ? 'is-on' : ''} onClick={() => { setI(n); setPicked(true) }}>{t.tab}</button>
        ))}
      </div>
      <div className="av-why-visual" key={i}>
        <div className="av-why-col"><small>{srcLabel}</small><img className="av-why-src" src={s.src} alt={s.label} loading="lazy" /><b>{s.label}</b></div>
        <span className="av-why-arrow" aria-hidden="true" />
        <div className="av-why-col wide"><small>{outLabel}</small>
          <div className="av-why-fan">
            <img src={s.out[0]} alt="" loading="lazy" />
            <img src={s.out[1]} alt="" loading="lazy" />
            <img src={s.out[2]} alt={`${s.tab} catalogue photo`} loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  )
}
