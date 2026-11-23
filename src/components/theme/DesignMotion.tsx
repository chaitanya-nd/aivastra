'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Visual-only motion layer. Never touches text or markup structure:
 * it only adds `data-ds` attributes / classes so design.css can animate elements in.
 * Without JS (or with reduced motion) everything is simply visible.
 */
const REVEAL = [
  '.hm-banner-sec-cnt > *',
  '.hm-brand-sec h2', '.hm-brand-sec-lst > *',
  '.hm-create-ready-title', '.hm-create-ready-category',
  '.hm-steps-sec h2', '.hm-steps-sec .steps-cnt', '.step-card',
  '.hm-photoshoots-content > *', '.hm-photoshoots-image',
  '.hm-catalogue-creation-cnt > *', '.hm-catlgue-crtion-itm',
  '.hm-brand-choose-header > *', '.hm-brand-choose-card',
  '.hm-results-header > *', '.hm-results-col',
  '.hm-choose-perfect-lft > *', '.hm-choose-perfect-rgt',
  '.hm-blog-top > *', '.blog-card', '.card-itm',
  '.about-generate-itm', '.about-catalogue-page-lft', '.about-catalogue-page-rgt',
  '.inr-bnr-title', '.inr-faqs-sec h2', '.accordion-profile',
  '.pricing-table', '.about-table-sec .table-wrapper',
  '.guide-category-card', '.inr-aiphoto-rit-btm-itm',
  '.hm-form', '.form-sec', '.blg-form-sec', '.contac-map-itm',
].join(',')

export function DesignMotion() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // scroll progress + header state + TOC spy
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const h = root.scrollHeight - window.innerHeight
        root.style.setProperty('--ds-p', h > 0 ? String(Math.min(1, window.scrollY / h)) : '0')
        document.body.classList.toggle('ds-scrolled', window.scrollY > 8)

        // Active Table of Contents heading spy
        const headings = document.querySelectorAll<HTMLElement>('.av-prose h2, .av-prose h3, .av-prose h4')
        if (headings.length > 0) {
          const links = document.querySelectorAll<HTMLAnchorElement>('.lwptoc_item a')
          let activeId = ''
          const offset = window.scrollY + 130
          for (let i = 0; i < headings.length; i++) {
            const el = headings[i]
            if (el.offsetTop <= offset) {
              activeId = el.id
            } else {
              break
            }
          }
          links.forEach((a) => {
            const href = a.getAttribute('href')?.replace('#', '')
            const isMatch = Boolean(href && href === activeId)
            a.classList.toggle('active', isMatch)
            a.closest('.lwptoc_item')?.classList.toggle('active', isMatch)
          })
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // spotlight: card glow follows the cursor
    const CARDS = '.hm-brand-choose-card,.inr-aiphoto-rit-btm-itm,.step-card,.card-itm,.guide-category-card,.hm-results-col,.blog-card,.hm-catlgue-crtion-itm,.Shoppers-card,.inr-int-item,.av-why-card,.av-cc-card,.av-post,.av-stat,.av-cta-form,.pricing-table .card,.accordion-profile,.hmblg-item,.hm-form,.frm-blk,.table-wrapper,.av-look-main'
    const onMove = (e: PointerEvent) => {
      const c = (e.target as HTMLElement | null)?.closest?.(CARDS) as HTMLElement | null
      if (!c) return
      const r = c.getBoundingClientRect()
      c.style.setProperty('--mx', `${e.clientX - r.left}px`)
      c.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })

    if (reduce || !('IntersectionObserver' in window))
      return () => {
        window.removeEventListener('scroll', onScroll)
        document.removeEventListener('pointermove', onMove)
      }

    const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL)).filter(
      (el) => !el.closest('.site-header, #floatingMenu, .ftr-block-sec') && !el.classList.contains('is-in'),
    )
    // stagger siblings
    const seen = new Map<Element, number>()
    els.forEach((el) => {
      const p = el.parentElement!
      const i = seen.get(p) ?? 0
      seen.set(p, i + 1)
      el.setAttribute('data-ds', el.matches('.hm-create-ready-category, .hm-photoshoots-image, .about-generate-itm img') ? 'zoom' : 'up')
      el.style.setProperty('--ds-i', String(Math.min(i, 6)))
    })
    root.classList.add('ds-js')

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    // safety net: never leave content hidden
    const t = window.setTimeout(() => els.forEach((el) => el.classList.add('is-in')), 4000)

    return () => {
      io.disconnect()
      window.clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointermove', onMove)
      root.classList.remove('ds-js')
    }
  }, [pathname])

  return <div className="ds-progress" aria-hidden="true" />
}
