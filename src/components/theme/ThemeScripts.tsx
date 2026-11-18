'use client'
import { useEffect } from 'react'

const SCRIPTS = ['/theme/js/jquery.min.js', '/theme/js/owl.carousel.min.js', '/theme/js/custom-scripts.js', '/theme/js/theme-init.js']

const load = (src: string) =>
  new Promise<void>((resolve) => {
    const el = document.createElement('script')
    el.src = src
    el.onload = () => resolve()
    el.onerror = () => resolve()
    document.body.appendChild(el)
  })

/**
 * The WordPress theme's behaviour (menus, accordions, sliders, popup) is jQuery/DOM based.
 * We load it after hydration, then replay DOMContentLoaded so its listeners attach.
 */
export function ThemeScripts() {
  useEffect(() => {
    const w = window as any
    if (w.__themeScripts) return
    w.__themeScripts = true
    ;(async () => {
      for (const s of SCRIPTS) await load(s)
      document.dispatchEvent(new Event('DOMContentLoaded'))
    })()
  }, [])
  return null
}
