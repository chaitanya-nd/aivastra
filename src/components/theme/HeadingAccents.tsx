'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const SELECTORS = [
  '#main-heading h1',
  '#main-heading h2',
  '.inr-bnr-title h1',
  '.inr-bnr-title h2',
  'main h1',
  'main h2',
  'section h2',
  '.text-heading',
  '.cmn-title',
  '.av-display',
  '.av-showcase-h',
  '.hm-form-title',
  '.av-why-copy h3',
  '.ftr-form-sctn h2',
  '.pricing h1',
  '.pricing h2',
  '.about-generate-creation-sec h2',
].join(',')

// High-priority brand/action phrases to highlight if present in the heading
const KEY_PHRASES = [
  'Faster with AI',
  'Faster with Ai',
  'Virtual Try-On',
  'Virtual Try-on',
  'Catalogue Generation',
  'Catalogue Creation',
  'Fashion Catalogue',
  'Complete Catalogue',
  'Fashion Visualization',
  'Schedule A Demo',
  'AI Photoshoots',
  'Studio Shoot',
  'Studio shoot',
  'Case Studies',
  'Product Updates',
  'Pricing Plans',
  'Get In Touch',
  'Frequently Asked Questions',
  'AI Vastra',
  'Ai Vastra',
]

function applyAccentToHeading(el: HTMLElement) {
  if (el.dataset.purpleDone === '1') return
  // If already contains a highlighted segment, don't re-process
  if (el.querySelector('.av-purple, .av-acc, em')) {
    el.dataset.purpleDone = '1'
    return
  }

  const raw = el.textContent?.trim() || ''
  if (!raw) return

  // Check if any key phrase exists in the text
  for (const phrase of KEY_PHRASES) {
    const idx = raw.indexOf(phrase)
    if (idx !== -1) {
      // If simple text node
      if (el.children.length === 0) {
        const before = raw.substring(0, idx)
        const matched = raw.substring(idx, idx + phrase.length)
        const after = raw.substring(idx + phrase.length)
        el.innerHTML = `${before}<span class="av-purple">${matched}</span>${after}`
        el.dataset.purpleDone = '1'
        return
      }
    }
  }

  const words = raw.split(/\s+/).filter(Boolean)
  if (words.length === 0) return

  // Pick number of words from the end to color
  const count = words.length === 1 ? 1 : words.length <= 3 ? 1 : 2
  const targetWords = words.slice(-count).join(' ')
  const prefix = words.slice(0, -count).join(' ')

  if (el.children.length === 0) {
    el.innerHTML = (prefix ? prefix + ' ' : '') + `<span class="av-purple">${targetWords}</span>`
    el.dataset.purpleDone = '1'
    return
  }

  // If element already has some inline children (like strong or icon), wrap the last text node
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  let lastTextNode: Text | null = null
  let node: Node | null
  while ((node = walker.nextNode())) {
    if (node.nodeValue && node.nodeValue.trim().length > 0) {
      lastTextNode = node as Text
    }
  }

  if (lastTextNode && lastTextNode.nodeValue) {
    const nodeText = lastTextNode.nodeValue
    const nodeWords = nodeText.trim().split(/\s+/)
    const n = Math.min(count, nodeWords.length)
    const hl = nodeWords.slice(-n).join(' ')
    const pre = nodeWords.slice(0, -n).join(' ')

    const span = document.createElement('span')
    span.className = 'av-purple'
    span.textContent = hl

    const parent = lastTextNode.parentNode
    if (parent) {
      if (pre) {
        parent.insertBefore(document.createTextNode(pre + ' '), lastTextNode)
      }
      parent.insertBefore(span, lastTextNode)
      parent.removeChild(lastTextNode)
    }
  }

  el.dataset.purpleDone = '1'
}

export function HeadingAccents() {
  const pathname = usePathname()

  useEffect(() => {
    const run = () => {
      const headings = document.querySelectorAll<HTMLElement>(SELECTORS)
      headings.forEach((h) => {
        if (!h.closest('.site-header, #floatingMenu, .av-ftr-bottom, nav')) {
          applyAccentToHeading(h)
        }
      })
    }

    // Run on initial mount and route change
    run()

    // Observe dynamic changes (e.g. tabs switching or lazy loaded sections)
    const observer = new MutationObserver(() => run())
    observer.observe(document.body, { childList: true, subtree: true })

    const timeout = setTimeout(run, 600)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [pathname])

  return null
}
