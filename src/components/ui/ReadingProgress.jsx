import { useState, useEffect } from 'react'
export function ReadingProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    }
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return <div className="fixed top-0 left-0 z-50 h-0.5 bg-primary-gradient transition-all duration-150" style={{width:`${pct}%`}} />
}
