import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, Plane } from 'lucide-react'
import { AIRPORTS } from '../../data'

export default function AirportInput({
  value, onChange, placeholder = 'City or Airport', label, className = '', icon
}) {
  const [query, setQuery] = useState(value ? `${value.city} (${value.code})` : '')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Sync display when value changes externally
  useEffect(() => {
    setQuery(value ? `${value.city} (${value.code})` : '')
  }, [value?.code])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Scroll highlighted item into view
  useEffect(() => {
    if (cursor >= 0 && listRef.current) {
      const item = listRef.current.children[cursor]
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [cursor])

  const search = (q) => {
    if (q.length < 1) { setResults([]); setOpen(false); setCursor(-1); return }
    const lq = q.toLowerCase()
    const filtered = AIRPORTS.filter(a =>
      a.city.toLowerCase().startsWith(lq) ||
      a.code.toLowerCase().startsWith(lq) ||
      a.country.toLowerCase().startsWith(lq) ||
      a.name.toLowerCase().includes(lq)
    ).sort((a, b) => {
      // Prioritize exact code match, then city starts-with
      const aCode = a.code.toLowerCase() === lq ? 0 : 1
      const bCode = b.code.toLowerCase() === lq ? 0 : 1
      return aCode - bCode
    }).slice(0, 7)
    setResults(filtered)
    setOpen(filtered.length > 0)
    setCursor(-1)
  }

  const handleChange = (e) => {
    const q = e.target.value
    setQuery(q)
    // If user clears, also clear selection
    if (!q) onChange(null)
    search(q)
  }

  const select = useCallback((airport) => {
    onChange(airport)
    setQuery(`${airport.city} (${airport.code})`)
    setOpen(false)
    setResults([])
    setCursor(-1)
  }, [onChange])

  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor(c => Math.min(c + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor(c => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (cursor >= 0 && cursor < results.length) select(results[cursor])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setCursor(-1)
    } else if (e.key === 'Tab') {
      // Auto-select first on Tab if nothing selected
      if (cursor === -1 && results.length > 0) select(results[0])
    }
  }

  const Icon = icon || MapPin

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-bold text-gray-600 dark:text-gray-600 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none z-10" />
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={() => { if (results.length > 0) setOpen(true) }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700
            bg-white dark:bg-card-dark text-base text-gray-900 dark:text-white
            placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2
            focus:ring-primary/20 transition-all"
          aria-expanded={open}
          aria-autocomplete="list"
          role="combobox"
        />
      </div>

      {open && results.length > 0 && (
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-card-dark
            rounded-2xl shadow-card-hover border border-gray-100 dark:border-gray-800
            z-50 overflow-hidden max-h-72 overflow-y-auto"
          role="listbox"
        >
          {results.map((a, i) => (
            <button
              key={a.code}
              onMouseDown={(e) => { e.preventDefault(); select(a) }}
              onMouseEnter={() => setCursor(i)}
              role="option"
              aria-selected={cursor === i}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                border-b border-gray-50 dark:border-gray-800 last:border-0
                ${cursor === i ? 'bg-primary/8 dark:bg-primary/15' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors
                ${cursor === i ? 'bg-primary text-white' : 'bg-primary/10'}`}>
                <span className={`text-sm font-extrabold ${cursor === i ? 'text-white' : 'text-primary'}`}>
                  {a.code}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-base text-gray-900 dark:text-white">{a.city}</p>
                  <span className="text-sm text-gray-600">·</span>
                  <p className="text-sm text-gray-600">{a.country}</p>
                </div>
                <p className="text-sm text-gray-600 truncate">{a.name}</p>
              </div>
              <Plane size={12} className="text-gray-300 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
