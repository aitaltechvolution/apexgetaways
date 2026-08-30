import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import { COUNTRIES, NIGERIA_STATES } from '../data/locations'

// Combined, searchable list: Nigeria (whole) first, then Nigerian states,
// then every other country.
const ALL_LOCATIONS = [
  { scope: 'country', code: 'NG', name: 'Nigeria (whole country)', currency: 'NGN' },
  ...NIGERIA_STATES.map(s => ({ scope: 'state', code: s.code, name: s.name, currency: s.currency })),
  ...COUNTRIES.filter(c => c.code !== 'NG').map(c => ({ scope: 'country', code: c.code, name: c.name, currency: c.currency })),
]

export default function LocationPicker({ value, onChange, placeholder = 'Search country or Nigerian state…' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef(null)

  useEffect(() => {
    const onClick = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const filtered = query.trim()
    ? ALL_LOCATIONS.filter(l => l.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 30)
    : ALL_LOCATIONS.slice(0, 30)

  const select = (loc) => { onChange(loc); setQuery(''); setOpen(false) }

  return (
    <div ref={wrapRef} className="relative">
      {value ? (
        <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl"
          style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}>
          <span className="text-base font-semibold text-primary">
            {value.name} <span className="text-gray-600 font-normal">({value.currency})</span>
          </span>
          <button type="button" onClick={() => onChange(null)} className="p-1 rounded-full hover:bg-white">
            <X size={14} className="text-gray-600"/>
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"/>
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="w-full pl-10 pr-9 py-3 rounded-xl text-base"
              style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#111827', outline: 'none' }}
            />
            <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"/>
          </div>
          {open && (
            <div className="absolute z-30 left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-xl"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(10,22,40,0.12)' }}>
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-base text-gray-600">No matches</p>
              ) : filtered.map(loc => (
                <button key={`${loc.scope}-${loc.code}`} type="button" onClick={() => select(loc)}
                  className="w-full text-left px-4 py-2.5 text-base hover:bg-gray-50 flex items-center justify-between"
                  style={{ color: '#111827' }}>
                  <span>{loc.name}</span>
                  <span className="text-gray-600 text-sm">{loc.currency}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
