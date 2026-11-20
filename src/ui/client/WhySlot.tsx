'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** Renders children into a placeholder element that lives inside CMS-provided HTML. */
export function WhySlot({ id, children }: { id: string; children: ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null)
  useEffect(() => { setEl(document.getElementById(id)) }, [id])
  return el ? createPortal(children, el) : null
}
