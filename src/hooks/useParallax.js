import { useEffect, useRef } from 'react'
export default function useParallax(speed = 0.35) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const fn = () => { const r = el.parentElement?.getBoundingClientRect(); if(r) el.style.transform = `translateY(${r.top*speed}px)` }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [speed])
  return ref
}
