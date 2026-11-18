'use client'
import { type ReactNode, useState } from 'react'

export function Tabs({ tabs }: { tabs: { id: string; label: string; node: ReactNode }[] }) {
  const [active, setActive] = useState(0)
  if (!tabs.length) return null
  return (
    <div className="tabs">
      <div role="tablist" className="tab-list">
        {tabs.map((t, i) => (
          <button key={t.id} role="tab" aria-selected={i === active} className={i === active ? 'on' : ''} onClick={() => setActive(i)} type="button">
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{tabs[active].node}</div>
    </div>
  )
}
