import { useState, useEffect, useRef } from 'react'
export default function useCounter(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start)
  const ref = useRef(null)
  const observer = useRef(null)
  useEffect(() => {
    observer.current = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const step = (end - start) / (duration / 16)
        let current = start
        const timer = setInterval(() => {
          current += step
          if (current >= end) { setCount(end); clearInterval(timer) }
          else setCount(Math.floor(current))
        }, 16)
        observer.current.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.current.observe(ref.current)
    return () => observer.current?.disconnect()
  }, [end, duration, start])
  return { count, ref }
}
