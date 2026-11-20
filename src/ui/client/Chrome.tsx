'use client'

import { useEffect, useState } from 'react'
import { FormRenderer } from '@/components/FormRenderer'

export type NavItem = { label: string; href: string; newTab?: boolean; children?: { label: string; href: string }[] }

/** Floating pill header with dropdowns + full-screen mobile menu. */
export function HeaderBar({ logo, items, signText, signHref, catalogueText }: { logo: string; items: NavItem[]; signText?: string; signHref?: string; catalogueText?: string }) {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hide, setHide] = useState(false)
  useEffect(() => {
    let last = 0
    const on = () => {
      const y = window.scrollY
      setSolid(y > 24)
      setHide(y > last && y > 400)
      last = y
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('av-lock', open)
    ;(window as any).__lenis?.[open ? 'stop' : 'start']?.()
  }, [open])
  return (
    <>
      <header className={`av-hdr${solid ? ' is-solid' : ''}${hide && !open ? ' is-hide' : ''}`}>
        <div className="av-hdr-pill">
          <a href="/" rel="home" className="av-logo"><img src={logo} alt="Ai Vastra" width={174} height={34} /></a>
          <nav className="av-nav" aria-label="Primary">
            {items.map((it) => (
              <div className={`av-nav-i${it.children?.length ? ' has-sub' : ''}`} key={it.label + it.href}>
                <a href={it.href} {...(it.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{it.label}</a>
                {it.children?.length ? (
                  <div className="av-sub">
                    {it.children.map((c) => <a href={c.href} key={c.href + c.label}>{c.label}</a>)}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
          <div className="av-hdr-cta">
            {catalogueText && <a data-demo className="av-link">{catalogueText}</a>}
            {signText && <a href={signHref || '#'} target="_blank" rel="noopener" className="av-btn av-btn-sm" data-magnetic>{signText}</a>}
          </div>
          <button className="av-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><i /><i /></button>
        </div>
      </header>
      <div className={`av-mnav${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <nav>
          {items.map((it, i) => (
            <div key={it.label + it.href} style={{ ['--i' as any]: i }}>
              <a href={it.href} onClick={() => setOpen(false)}>{it.label}</a>
              {it.children?.length ? <div className="av-mnav-sub">{it.children.map((c) => <a key={c.href + c.label} href={c.href} onClick={() => setOpen(false)}>{c.label}</a>)}</div> : null}
            </div>
          ))}
        </nav>
        {signText && <a href={signHref || '#'} target="_blank" rel="noopener" className="av-btn">{signText}</a>}
      </div>
    </>
  )
}

/** Demo-request modal: opens from any element with `data-demo` / legacy `#popupbtn`. */
export function DemoModal({ form, title }: { form: any; title: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const click = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.('[data-demo], #popupbtn')) {
        e.preventDefault()
        setOpen(true)
      }
    }
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('click', click)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('click', click)
      document.removeEventListener('keydown', key)
    }
  }, [])
  useEffect(() => {
    ;(window as any).__lenis?.[open ? 'stop' : 'start']?.()
  }, [open])
  return (
    <div className={`av-modal${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-hidden={!open} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="av-modal-box">
        <button className="av-modal-x" aria-label="Close" onClick={() => setOpen(false)}>×</button>
        <h2 className="av-h3">{title}</h2>
        {form && <FormRenderer form={form} />}
      </div>
    </div>
  )
}
