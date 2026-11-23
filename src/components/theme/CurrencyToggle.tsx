'use client'

import { useEffect, useState } from 'react'

function applyVisibility(currency: 'inr' | 'usd') {
  const root = document.getElementById('pricing-currency-root')
  if (!root) return
  root.setAttribute('data-currency', currency)
  root.querySelectorAll<HTMLElement>('.price-inr').forEach((el) => {
    el.style.setProperty('display', currency === 'inr' ? 'inline' : 'none', 'important')
  })
  root.querySelectorAll<HTMLElement>('.price-usd').forEach((el) => {
    el.style.setProperty('display', currency === 'usd' ? 'inline' : 'none', 'important')
  })
}

export function CurrencyToggle() {
  const [currency, setCurrency] = useState<'inr' | 'usd'>('inr')

  // Run on mount AND whenever currency changes
  useEffect(() => {
    applyVisibility(currency)
  }, [currency])

  return (
    <div className="av-currency-toggle-wrap">
      <span className="av-currency-label">Currency:</span>
      <div className="av-currency-toggle" role="group" aria-label="Select currency">
        <button
          className={`av-currency-btn${currency === 'inr' ? ' active' : ''}`}
          onClick={() => setCurrency('inr')}
          aria-pressed={currency === 'inr'}
        >
          🇮🇳 ₹ INR
        </button>
        <button
          className={`av-currency-btn${currency === 'usd' ? ' active' : ''}`}
          onClick={() => setCurrency('usd')}
          aria-pressed={currency === 'usd'}
        >
          🇺🇸 $ USD
        </button>
      </div>
    </div>
  )
}
