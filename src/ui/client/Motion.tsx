'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Site-wide motion: smooth scrolling (Lenis), scroll-driven reveals, word-by-word headings,
 * parallax, count-ups, magnetic buttons, card tilt, custom cursor and a progress bar.
 * It only animates existing elements (data-* attributes) — never adds text.
 */
export function Motion() {
  const pathname = usePathname()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const off: (() => void)[] = []
    let lenis: Lenis | null = null

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (t: number) => lenis?.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      off.push(() => {
        gsap.ticker.remove(tick)
        lenis?.destroy()
      })
      ;(window as any).__lenis = lenis
    }

    // progress bar
    const bar = document.querySelector<HTMLElement>('.av-progress')
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      bar?.style.setProperty('--p', h > 0 ? String(Math.min(1, window.scrollY / h)) : '0')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    off.push(() => window.removeEventListener('scroll', onScroll))

    const ctx = gsap.context(() => {
      const $$ = <T extends HTMLElement>(s: string) => gsap.utils.toArray<T>(s)

      if (!reduce) {
        // word-by-word headings
        $$('.av-words').forEach((el) => {
          const wi = el.querySelectorAll('.av-wi')
          gsap.set(wi, { yPercent: 115, rotate: 4 })
          ScrollTrigger.create({
            trigger: el,
            start: 'top 92%',
            once: true,
            onEnter: () => gsap.to(wi, { yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045 }),
          })
        })
        // generic reveal
        $$('[data-reveal]').forEach((el) => {
          const delay = Number(el.dataset.reveal) || 0
          gsap.set(el, { opacity: 0, y: 44 })
          ScrollTrigger.create({
            trigger: el,
            start: 'top 93%',
            once: true,
            onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, delay, ease: 'power3.out' }),
          })
        })
        // scroll parallax
        $$('[data-parallax]').forEach((el) => {
          const amt = (Number(el.dataset.parallax) || 0.1) * 160
          gsap.fromTo(el, { y: -amt }, { y: amt, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
        })
        // horizontal drift on scroll
        $$('[data-drift]').forEach((el) => {
          const amt = Number(el.dataset.drift) || 60
          gsap.fromTo(el, { x: -amt }, { x: amt, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
        })
        // count-ups: animates the number inside the existing text (e.g. "10X", "80%")
        $$('[data-count]').forEach((el) => {
          const final = el.textContent ?? ''
          const m = final.match(/(\d+(?:\.\d+)?)/)
          if (!m) return
          const to = Number(m[1])
          const obj = { v: 0 }
          ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () =>
              gsap.to(obj, {
                v: to,
                duration: 1.8,
                ease: 'power2.out',
                onUpdate: () => (el.textContent = final.replace(m[1], String(Math.round(obj.v)))),
                onComplete: () => (el.textContent = final),
              }),
          })
        })
      }

      if (fine && !reduce) {
        // magnetic buttons
        $$('[data-magnetic]').forEach((el) => {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
          const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect()
            xTo((e.clientX - (r.left + r.width / 2)) * 0.25)
            yTo((e.clientY - (r.top + r.height / 2)) * 0.35)
          }
          const leave = () => {
            xTo(0)
            yTo(0)
          }
          el.addEventListener('pointermove', move)
          el.addEventListener('pointerleave', leave)
          off.push(() => {
            el.removeEventListener('pointermove', move)
            el.removeEventListener('pointerleave', leave)
          })
        })
        // 3D tilt + spotlight on cards
        $$('[data-tilt]').forEach((el) => {
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect()
            const px = (e.clientX - r.left) / r.width
            const py = (e.clientY - r.top) / r.height
            el.style.setProperty('--mx', `${px * 100}%`)
            el.style.setProperty('--my', `${py * 100}%`)
            gsap.to(el, { rotateY: (px - 0.5) * 9, rotateX: (0.5 - py) * 9, transformPerspective: 900, duration: 0.5, ease: 'power2.out' })
          }
          const leave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' })
          el.addEventListener('pointermove', move)
          el.addEventListener('pointerleave', leave)
          off.push(() => {
            el.removeEventListener('pointermove', move)
            el.removeEventListener('pointerleave', leave)
          })
        })
        // hero tiles follow the pointer (depth parallax)
        const field = document.querySelector<HTMLElement>('[data-field]')
        if (field) {
          const tiles = Array.from(field.querySelectorAll<HTMLElement>('[data-depth]'))
          const move = (e: PointerEvent) => {
            const r = field.getBoundingClientRect()
            const nx = (e.clientX - r.left) / r.width - 0.5
            const ny = (e.clientY - r.top) / r.height - 0.5
            tiles.forEach((t) => {
              const d = Number(t.dataset.depth) || 1
              gsap.to(t, { x: nx * 38 * d, y: ny * 30 * d, duration: 1.2, ease: 'power3.out', overwrite: 'auto' })
            })
          }
          field.addEventListener('pointermove', move)
          off.push(() => field.removeEventListener('pointermove', move))
        }
      }
    })

    // custom cursor
    let cursor: HTMLDivElement | null = null
    if (fine && !reduce) {
      cursor = document.createElement('div')
      cursor.className = 'av-cursor'
      document.body.appendChild(cursor)
      const cx = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3' })
      const cy = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3' })
      const move = (e: PointerEvent) => {
        cx(e.clientX)
        cy(e.clientY)
        const hot = (e.target as HTMLElement)?.closest?.('a,button,[data-cursor],summary,input,textarea')
        cursor?.classList.toggle('is-hot', !!hot)
        cursor?.classList.add('is-on')
      }
      const leave = () => cursor?.classList.remove('is-on')
      window.addEventListener('pointermove', move, { passive: true })
      document.addEventListener('pointerleave', leave)
      off.push(() => {
        window.removeEventListener('pointermove', move)
        document.removeEventListener('pointerleave', leave)
        cursor?.remove()
      })
    }

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = window.setTimeout(refresh, 1200)
    off.push(() => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(t)
    })

    return () => {
      ctx.revert()
      off.forEach((f) => f())
      ;(window as any).__lenis = undefined
    }
  }, [pathname])

  return <div className="av-progress" aria-hidden="true" />
}
