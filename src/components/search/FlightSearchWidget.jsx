import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftRight, Plus, Minus, Search, ChevronDown } from 'lucide-react'
import { useBooking } from '../../store/BookingContext'
import AirportInput from './AirportInput'

const TABS = [
  { key:'round-trip',  label:'Round Trip'  },
  { key:'one-way',     label:'One Way'     },
  { key:'multi-city',  label:'Multi-City'  },
]
const CABINS = ['ECONOMY','PREMIUM_ECONOMY','BUSINESS','FIRST']
const CABIN_LABELS = { ECONOMY:'Economy', PREMIUM_ECONOMY:'Premium Economy', BUSINESS:'Business', FIRST:'First Class' }

function PassengerDropdown({ adults, children, infants, onChange }) {
  const [open, setOpen] = useState(false)
  const total = adults + children + infants
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
        {total} Passenger{total!==1?'s':''} <ChevronDown size={14} className={`transition-transform ${open?'rotate-180':''}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card-hover p-4 z-50">
          {[['Adults','(12+)',adults,'adults'],['Children','(2–11)',children,'children'],['Infants','(under 2)',infants,'infants']].map(([label,sub,val,key]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <div><p className="font-semibold text-sm text-gray-800 dark:text-white">{label}</p><p className="text-xs text-gray-400">{sub}</p></div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => onChange(key, Math.max(key==='adults'?1:0, val-1))} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-30" disabled={val<=(key==='adults'?1:0)}>
                  <Minus size={13} />
                </button>
                <span className="w-6 text-center font-bold text-sm text-gray-800 dark:text-white">{val}</span>
                <button type="button" onClick={() => onChange(key, Math.min(key==='adults'?9:4, val+1))} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <Plus size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FlightSearchWidget({ compact = false }) {
  const { flightSearch, multiCityLegs, dispatch } = useBooking()
  const navigate = useNavigate()
  const [cabinOpen, setCabinOpen] = useState(false)
  const s = flightSearch
  const set = (payload) => dispatch({ type:'SET_FLIGHT_SEARCH', payload })

  const swap = () => set({ origin: s.destination, originLabel: s.destinationLabel, destination: s.origin, destinationLabel: s.originLabel })

  const handleSearch = (e) => {
    e.preventDefault()
    if (!s.origin || !s.destination) return
    navigate('/flights/results')
  }

  const inputCls = 'flex-1 min-w-0 bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 hover:border-primary transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'

  return (
    <div className="bg-white dark:bg-card-dark rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 overflow-visible">
      {/* Trip type tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800">
        {TABS.map(t => (
          <button key={t.key} type="button" onClick={() => set({ type: t.key })}
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${s.type===t.key ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className={`p-4 ${compact ? '' : 'md:p-5'}`}>
        {/* ONE WAY / ROUND TRIP */}
        {s.type !== 'multi-city' && (
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            {/* Origin */}
            <div className={`${inputCls}`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">From</p>
              <AirportInput value={s.origin} label={s.originLabel} placeholder="Departure city" onChange={({ code, label }) => set({ origin: code, originLabel: label })} />
            </div>

            {/* Swap */}
            <button type="button" onClick={swap} className="hidden md:flex w-9 h-9 self-center shrink-0 rounded-full border border-gray-200 dark:border-gray-700 items-center justify-center hover:border-primary hover:text-primary transition-all hover:rotate-180 duration-300">
              <ArrowLeftRight size={14} />
            </button>

            {/* Destination */}
            <div className={`${inputCls}`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">To</p>
              <AirportInput value={s.destination} label={s.destinationLabel} placeholder="Destination city" onChange={({ code, label }) => set({ destination: code, destinationLabel: label })} />
            </div>

            {/* Dates */}
            <div className={`${inputCls}`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Depart</p>
              <input type="date" value={s.departureDate} min={new Date().toISOString().slice(0,10)} onChange={e => set({ departureDate: e.target.value })} className="bg-transparent text-sm font-medium text-gray-800 dark:text-white outline-none w-full" required />
            </div>

            {s.type === 'round-trip' && (
              <div className={`${inputCls}`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Return</p>
                <input type="date" value={s.returnDate} min={s.departureDate || new Date().toISOString().slice(0,10)} onChange={e => set({ returnDate: e.target.value })} className="bg-transparent text-sm font-medium text-gray-800 dark:text-white outline-none w-full" />
              </div>
            )}
          </div>
        )}

        {/* MULTI-CITY */}
        {s.type === 'multi-city' && (
          <div className="space-y-3 mb-3">
            {multiCityLegs.map((leg, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-3 items-center">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{i+1}</span>
                <div className={inputCls}><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">From</p><AirportInput value={leg.origin} label={leg.originLabel} onChange={({code,label})=>dispatch({type:'SET_MULTI_LEG',payload:{index:i,data:{origin:code,originLabel:label}}})} /></div>
                <div className={inputCls}><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">To</p><AirportInput value={leg.destination} label={leg.destinationLabel} onChange={({code,label})=>dispatch({type:'SET_MULTI_LEG',payload:{index:i,data:{destination:code,destinationLabel:label}}})} /></div>
                <div className={inputCls}><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p><input type="date" value={leg.date} min={new Date().toISOString().slice(0,10)} onChange={e=>dispatch({type:'SET_MULTI_LEG',payload:{index:i,data:{date:e.target.value}}})} className="bg-transparent text-sm font-medium text-gray-800 dark:text-white outline-none w-full" /></div>
                {multiCityLegs.length > 2 && <button type="button" onClick={()=>dispatch({type:'REMOVE_MULTI_LEG',payload:i})} className="shrink-0 w-8 h-8 rounded-full border border-red-200 text-red-400 hover:bg-red-50 flex items-center justify-center"><Minus size={13}/></button>}
              </div>
            ))}
            {multiCityLegs.length < 5 && (
              <button type="button" onClick={()=>dispatch({type:'ADD_MULTI_LEG'})} className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline ml-8">
                <Plus size={15}/> Add another city
              </button>
            )}
          </div>
        )}

        {/* Bottom bar: passengers + cabin + search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
            <PassengerDropdown adults={s.adults} children={s.children} infants={s.infants} onChange={(key,val)=>set({[key]:val})} />
          </div>

          {/* Cabin */}
          <div className="relative">
            <button type="button" onClick={() => setCabinOpen(!cabinOpen)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary transition-colors">
              {CABIN_LABELS[s.cabin]} <ChevronDown size={13} className={`transition-transform ${cabinOpen?'rotate-180':''}`} />
            </button>
            {cabinOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-card-hover z-50 overflow-hidden">
                {CABINS.map(c => (
                  <button key={c} type="button" onClick={()=>{set({cabin:c});setCabinOpen(false)}} className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${s.cabin===c?'text-primary font-semibold bg-primary/5':''}`}>
                    {CABIN_LABELS[c]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="ml-auto flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-sm text-white bg-primary-gradient shadow-glow hover:shadow-none transition-all hover:scale-105">
            <Search size={15}/> Search Flights
          </button>
        </div>
      </form>
    </div>
  )
}
