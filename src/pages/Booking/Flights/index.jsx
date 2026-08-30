import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plane, ArrowLeftRight, Plus, Minus, ChevronDown, ChevronUp,
  Clock, Luggage, RefreshCcw, CheckCircle, AlertCircle, ArrowRight, X, Filter, Star
} from 'lucide-react'
import SEO from '../../../components/SEO'
import AirportInput from '../../../components/search/AirportInput'
import SeatMap from '../../../components/booking/SeatMap'
import { generateFlights, formatNGN, AIRLINES } from '../../../data'
import { getPricingSettings, applyMarkup } from '../../../lib/supabase'
import { useBooking } from '../../../store/BookingContext'

const CABIN_CLASSES = [
  { value:'economy', label:'Economy', sub:'Standard fare' },
  { value:'premium_economy', label:'Premium Economy', sub:'Extra legroom' },
  { value:'business', label:'Business', sub:'Lie-flat seats' },
  { value:'first', label:'First Class', sub:'Ultimate luxury' },
]

const BAGGAGE_OPTIONS = [
  { label:'No extra bag',   pieces:0, weight:'Cabin only', price:0 },
  { label:'1 × 20kg',      pieces:1, weight:'20kg',       price:12000 },
  { label:'1 × 23kg',      pieces:1, weight:'23kg',       price:15000 },
  { label:'1 × 32kg',      pieces:1, weight:'32kg',       price:22000 },
  { label:'2 × 23kg',      pieces:2, weight:'23kg×2',     price:28000 },
]

function PassengerPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const total = value.adults + value.children + value.infants
  const adjust = (k, d) => {
    const next = { ...value, [k]: Math.max(k==='adults'?1:0, value[k]+d) }
    if (next.adults + next.children > 9) return
    onChange(next)
  }
  return (
    <div className="relative">
      <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{color:'#4B5563'}}>Passengers</label>
      <button onClick={() => setOpen(!open)} type="button"
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base text-primary focus:outline-none transition-all"
        style={{background:'#F3F4F6',border:'1px solid #E5E7EB'}}>
        <span>{total} Passenger{total!==1?'s':''} · {CABIN_CLASSES.find(c=>c.value===value.cabinClass)?.label||'Economy'}</span>
        <ChevronDown size={15} style={{color:'#374151'}}/>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
            className="absolute top-full left-0 right-0 mt-1 z-50 rounded-2xl shadow-2xl p-5 space-y-4"
            style={{background:'#FFFFFF',border:'1px solid rgba(201,168,76,0.2)'}}>
            {[['adults','Adults','12+ years'],['children','Children','2-11 years'],['infants','Infants','Under 2']].map(([k,lbl,sub]) => (
              <div key={k} className="flex items-center justify-between">
                <div><p className="font-semibold text-base text-primary">{lbl}</p><p className="text-sm" style={{color:'#6B7280'}}>{sub}</p></div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => adjust(k,-1)} className="w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all" style={{background:'#F3F4F6',border:'1px solid #E5E7EB',color:'#111827'}}><Minus size={13}/></button>
                  <span className="w-6 text-center font-bold text-primary">{value[k]}</span>
                  <button type="button" onClick={() => adjust(k,1)} className="w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all hover:scale-110" style={{background:'linear-gradient(135deg,#C9A84C,#F5C842)',color:'#0A1628'}}><Plus size={13}/></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setOpen(false)} className="w-full py-3 rounded-xl font-bold text-base btn-gold">Done</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FlightCard({ flight, cabinClass, onSelect, selected, onPickSeats, seats, isReturn }) {
  const [expanded, setExpanded] = useState(false)
  const price = flight[cabinClass] || flight.economy
  const isSelected = selected?.id === flight.id

  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background:'#F3F4F6',
        border:`1px solid ${isSelected?'rgba(201,168,76,0.6)':'#F3F4F6'}`,
        boxShadow: isSelected ? '0 0 0 2px rgba(201,168,76,0.3)' : 'none',
      }}>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-4">
          {/* Airline */}
          <div className="flex items-center gap-2.5 w-36 shrink-0">
            <span className="text-2xl">{flight.logo}</span>
            <div>
              <p className="font-bold text-sm text-primary">{flight.airline}</p>
              <p className="text-[13px]" style={{color:'#6B7280'}}>{flight.flightNo}</p>
            </div>
          </div>
          {/* Times */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="text-center">
              <p className="font-bold text-2xl text-primary">{flight.dep}</p>
              <p className="text-sm font-semibold" style={{color:'#C9A84C'}}>{flight.from}</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 min-w-[80px]">
              <p className="text-[13px]" style={{color:'#4B5563'}}>{flight.duration}</p>
              <div className="relative w-full flex items-center">
                <div className="flex-1 h-px" style={{background:'#E5E7EB'}}/>
                <Plane size={12} style={{color:'#C9A84C'}} className="mx-1 shrink-0"/>
                <div className="flex-1 h-px" style={{background:'#E5E7EB'}}/>
              </div>
              <p className="text-[13px]" style={{color:'#4B5563'}}>
                {flight.stops===0?'Direct':`${flight.stops} stop${flight.stops>1?'s':''}${flight.stopCity?` · ${flight.stopCity}`:''}`}
              </p>
            </div>
            <div className="text-center">
              <p className="font-bold text-2xl text-primary">{flight.arr}</p>
              <p className="text-sm font-semibold" style={{color:'#C9A84C'}}>{flight.to}</p>
            </div>
          </div>
          {/* Price + select */}
          <div className="flex items-center gap-4 ml-auto shrink-0">
            <div className="text-right">
              <p className="font-bold text-xl" style={{color:'#C9A84C'}}>{formatNGN(price)}</p>
              <p className="text-[13px]" style={{color:'#6B7280'}}>per person</p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <Luggage size={10} style={{color:'#6B7280'}}/>
                <span className="text-[12px]" style={{color:'#6B7280'}}>{flight.baggage}</span>
              </div>
              <span className={`text-[12px] font-semibold ${flight.refundable?'text-green-700':'text-red-600'}`}>
                {flight.refundable?' Refundable':' Non-refundable'}
              </span>
            </div>
            <button onClick={() => onSelect(flight)}
              className={`px-5 py-3 rounded-xl font-bold text-base transition-all hover:scale-105 ${isSelected?'text-navy':'text-navy'}`}
              style={{background:isSelected?'linear-gradient(135deg,#22c55e,#16a34a)':'linear-gradient(135deg,#C9A84C,#F5C842)'}}>
              {isSelected ? ' Selected' : 'Select'}
            </button>
          </div>
        </div>

        {/* Seat badges */}
        {isSelected && seats.length > 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-sm" style={{color:'#4B5563'}}>Seats:</span>
            {seats.map(s => <span key={s} className="px-2.5 py-1 rounded-lg text-sm font-bold" style={{background:'rgba(201,168,76,0.15)',color:'#C9A84C'}}>{s}</span>)}
            <button onClick={() => onPickSeats(flight, isReturn)} className="text-sm underline" style={{color:'#C9A84C'}}>Change</button>
          </div>
        )}
        {isSelected && seats.length === 0 && (
          <button onClick={() => onPickSeats(flight, isReturn)}
            className="mt-3 text-sm font-semibold flex items-center gap-1.5 underline" style={{color:'#C9A84C'}}>
            <Plane size={11}/> Choose seat (optional — free)
          </button>
        )}

        <button onClick={() => setExpanded(!expanded)} className="mt-3 flex items-center gap-1 text-sm font-semibold" style={{color:'#374151'}}>
          {expanded ? <><ChevronUp size={12}/>Hide details</> : <><ChevronDown size={12}/>Flight details & amenities</>}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="overflow-hidden">
            <div className="px-5 pb-5 pt-0 border-t" style={{borderColor:'#F3F4F6'}}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {[
                  ['Duration', flight.duration, Clock],
                  ['Checked Bag', flight.baggage, Luggage],
                  ['Cabin', (cabinClass||'economy').replace('_',' '), Plane],
                  ['Seats left', flight.seatsLeft ? `${flight.seatsLeft} remaining` : 'Available', AlertCircle],
                ].map(([label, val, Icon]) => (
                  <div key={label}>
                    <p className="text-[13px] mb-1" style={{color:'#6B7280'}}>{label}</p>
                    <p className="text-base font-semibold text-primary flex items-center gap-1"><Icon size={12} style={{color:'#C9A84C'}}/>{val}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Cabin bag included','USB charging port','In-flight entertainment','Meal service'].map(a => (
                  <span key={a} className="text-[13px] px-2.5 py-1 rounded-full" style={{background:'#F3F4F6',color:'#4B5563'}}>{a}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FlightsPage() {
  const { booking, update } = useBooking()
  const navigate = useNavigate()

  const [type, setType]           = useState(booking.heroFlightType || booking.flightType || 'roundTrip')
  const [segments, setSegments]   = useState(() => {
    if (booking.heroFrom || booking.heroTo) return [
      { from: booking.heroFrom, to: booking.heroTo, date: booking.heroDeparture || '' },
      { from: booking.heroTo,   to: booking.heroFrom, date: booking.heroReturn || '' },
    ]
    return booking.segments?.length ? booking.segments : [{ from:null,to:null,date:'' },{ from:null,to:null,date:'' }]
  })
  const [passengers, setPassengers] = useState(booking.heroPassengers || booking.passengers || { adults:1, children:0, infants:0 })
  const [cabinClass, setCabinClass] = useState(booking.heroCabinClass || booking.cabinClass || 'economy')

  const [loading, setLoading]         = useState(false)
  const [searched, setSearched]       = useState(false)
  const [outFlights, setOutFlights]   = useState([])
  const [retFlights, setRetFlights]   = useState([])
  const [selectedOut, setSelectedOut] = useState(null)
  const [selectedRet, setSelectedRet] = useState(null)
  const [outSeats, setOutSeats]       = useState([])
  const [retSeats, setRetSeats]       = useState([])
  const [seatMapFor, setSeatMapFor]   = useState(null) // { flight, isReturn }
  const [sortBy, setSortBy]           = useState('price')
  const [filterStops, setFilterStops] = useState('all')
  const [filterAirline, setFilterAirline] = useState('all')
  const [markupAmt, setMarkupAmt]     = useState(0)
  const [dataSource, setDataSource]   = useState(null) // 'duffel' | 'demo' | null

  useEffect(() => { getPricingSettings().then(s => setMarkupAmt(s.flightMarkupAmount)) }, [])

  const withMarkup = (flights) => flights.map(f => ({
    ...f,
    economy: applyMarkup(f.economy, markupAmt),
    business: applyMarkup(f.business, markupAmt),
    first: applyMarkup(f.first, markupAmt),
    premium_economy: applyMarkup(f.premium_economy, markupAmt),
  }))

  const today = new Date().toISOString().split('T')[0]
  const totalPax = passengers.adults + passengers.children + passengers.infants

  const updateSeg = (i, patch) => setSegments(s => s.map((seg,idx) => idx===i ? {...seg,...patch} : seg))
  const swap = (i) => setSegments(s => s.map((seg,idx) => idx===i ? {...seg,from:seg.to,to:seg.from} : seg))

  const duffelPassengers = () => {
    const list = []
    for (let i=0;i<passengers.adults;i++) list.push({ type:'adult' })
    for (let i=0;i<passengers.children;i++) list.push({ age:10 }) // exact ages aren't collected at search time
    for (let i=0;i<passengers.infants;i++) list.push({ age:1 })
    return list
  }

  const searchLive = async () => {
    const res = await fetch('/api/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: segments[0].from.code, to: segments[0].to.code, date: segments[0].date,
        returnDate: type==='roundTrip' ? segments[1].date : undefined,
        passengers: duffelPassengers(), cabinClass,
      }),
    })
    if (!res.ok) throw new Error('duffel search failed')
    const { outbound, inbound } = await res.json()
    if (!outbound?.length) throw new Error('no live offers')
    return { out: outbound, ret: inbound || [] }
  }

  const doSearch = async () => {
    if (!segments[0].from || !segments[0].to || !segments[0].date) return
    setLoading(true); setSelectedOut(null); setSelectedRet(null); setOutSeats([]); setRetSeats([])
    try {
      const { out, ret } = await searchLive()
      setOutFlights(withMarkup(out))
      setRetFlights(withMarkup(ret))
      setDataSource('duffel')
    } catch {
      // No Duffel token configured, request failed, or no offers — fall back to demo data
      // so the search flow never breaks.
      await new Promise(r => setTimeout(r, 900))
      setOutFlights(withMarkup(generateFlights(segments[0].from.code, segments[0].to.code, segments[0].date)))
      if (type==='roundTrip' && segments[1].date)
        setRetFlights(withMarkup(generateFlights(segments[0].to.code, segments[0].from.code, segments[1].date)))
      else setRetFlights([])
      setDataSource('demo')
    } finally {
      setLoading(false); setSearched(true)
    }
  }

  const sortAndFilter = (list) => {
    let out = [...list]
    if (filterStops !== 'all') out = out.filter(f => filterStops==='direct' ? f.stops===0 : f.stops>0)
    if (filterAirline !== 'all') out = out.filter(f => f.airline===filterAirline)
    out.sort((a,b) => sortBy==='price' ? a[cabinClass]-b[cabinClass] : sortBy==='duration' ? a.durationMins-b.durationMins : a.dep.localeCompare(b.dep))
    return out
  }

  const canProceed = selectedOut && (type!=='roundTrip' || selectedRet)
  const outPrice = selectedOut ? (selectedOut[cabinClass]||selectedOut.economy) : 0
  const retPrice = selectedRet ? (selectedRet[cabinClass]||selectedRet.economy) : 0
  const totalFare = (outPrice + retPrice) * totalPax

  const proceed = () => {
    update({
      bookingType:'flight', flightType:type, segments, passengers, cabinClass,
      selectedFlight:selectedOut, selectedReturnFlight:selectedRet,
      selectedSeats:outSeats, selectedReturnSeats:retSeats,
    })
    navigate('/booking/extras')
  }

  const airlines = [...new Set(outFlights.map(f=>f.airline))]

  return (
    <>
      <SEO title="Search Flights"/>
      {seatMapFor && (
        <SeatMap flight={seatMapFor.flight} passengers={totalPax} selectedClass={cabinClass}
          onConfirm={seats => { seatMapFor.isReturn ? setRetSeats(seats) : setOutSeats(seats); setSeatMapFor(null) }}
          onClose={() => setSeatMapFor(null)}/>
      )}

      {/* Search header */}
      <section className="pt-20 pb-8" style={{background:'#F8F6F2',borderBottom:'1px solid rgba(201,168,76,0.2)'}}>
        <div className="container-pad">
          <div className="text-center mb-6 pt-4">
            <h1 className="font-display font-bold text-primary text-3xl">Search Flights</h1>
            <p className="text-base mt-1" style={{color:'#4B5563'}}>One-way · Round trip · Multi-city · All airlines</p>
          </div>

          <div className="rounded-2xl p-5 md:p-6" style={{background:'#F3F4F6',border:'1px solid #E5E7EB'}}>
            {/* Trip type */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {[['oneWay','One Way'],['roundTrip','Round Trip'],['multiCity','Multi-City']].map(([v,l]) => (
                <button key={v} type="button" onClick={() => { setType(v); setSearched(false) }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background:type===v?'linear-gradient(135deg,#C9A84C,#F5C842)':'#F3F4F6',
                    color:type===v?'#0A1628':'#374151',
                    border:`1px solid ${type===v?'#C9A84C':'#E5E7EB'}`,
                  }}>{l}</button>
              ))}
            </div>

            {/* Segments */}
            <div className="space-y-3 mb-4">
              {(type==='multiCity' ? segments : segments.slice(0,1)).map((seg,i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr_auto] gap-3 items-end">
                  <AirportInput value={seg.from} onChange={v=>updateSeg(i,{from:v})} label={i===0?'From':`From (Leg ${i+1})`} placeholder="Departure city or airport"/>
                  <button type="button" onClick={() => swap(i)} className="hidden md:flex w-10 h-10 rounded-xl items-center justify-center self-end transition-all hover:scale-110"
                    style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.25)',color:'#C9A84C'}}>
                    <ArrowLeftRight size={15}/>
                  </button>
                  <AirportInput value={seg.to} onChange={v=>updateSeg(i,{to:v})} label={i===0?'To':`To (Leg ${i+1})`} placeholder="Destination city or airport"/>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{color:'#4B5563'}}>
                      {type==='multiCity'?`Date (Leg ${i+1})`:'Depart'}
                    </label>
                    <input type="date" min={today} value={seg.date} onChange={e=>updateSeg(i,{date:e.target.value})}
                      className="w-full px-4 py-3.5 rounded-xl text-base text-primary focus:outline-none"
                      style={{background:'#F3F4F6',border:'1px solid #E5E7EB'}}
                      onFocus={e=>{e.target.style.borderColor='#C9A84C'}} onBlur={e=>{e.target.style.borderColor='#E5E7EB'}}/>
                  </div>
                  {type==='multiCity' && i>1 && (
                    <button type="button" onClick={() => setSegments(s=>s.filter((_,idx)=>idx!==i))}
                      className="self-end w-10 h-10 rounded-xl flex items-center justify-center" style={{border:'1px solid rgba(239,68,68,0.4)',color:'#ef4444'}}><X size={15}/></button>
                  )}
                </div>
              ))}

              {type==='roundTrip' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-start-4">
                    <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{color:'#4B5563'}}>Return</label>
                    <input type="date" min={segments[0].date||today} value={segments[1].date} onChange={e=>updateSeg(1,{date:e.target.value})}
                      className="w-full px-4 py-3.5 rounded-xl text-base text-primary focus:outline-none"
                      style={{background:'#F3F4F6',border:'1px solid #E5E7EB'}}
                      onFocus={e=>{e.target.style.borderColor='#C9A84C'}} onBlur={e=>{e.target.style.borderColor='#E5E7EB'}}/>
                  </div>
                </div>
              )}

              {type==='multiCity' && segments.length<5 && (
                <button type="button" onClick={() => setSegments(s=>[...s,{from:null,to:null,date:''}])}
                  className="flex items-center gap-2 text-base font-bold w-full justify-center py-3 rounded-xl border-2 border-dashed transition-all"
                  style={{borderColor:'rgba(201,168,76,0.3)',color:'#C9A84C'}}>
                  <Plus size={15}/> Add Another City
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{color:'#4B5563'}}>Cabin Class</label>
                <select value={cabinClass} onChange={e=>setCabinClass(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl text-base text-primary focus:outline-none"
                  style={{background:'#F3F4F6',border:'1px solid #E5E7EB',appearance:'none'}}>
                  {CABIN_CLASSES.map(c=><option key={c.value} value={c.value} style={{background:'#FFFFFF'}}>{c.label}</option>)}
                </select>
              </div>
              <PassengerPicker value={passengers} onChange={setPassengers}/>
              <div className="flex items-end">
                <button onClick={doSearch} type="button"
                  disabled={!segments[0].from||!segments[0].to||!segments[0].date||loading}
                  className="w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50 btn-gold text-navy">
                  {loading ? <><RefreshCcw size={15} className="animate-spin"/>Searching…</> : <><Plane size={15}/>Search Flights</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      {searched && (
        <section className="py-10" style={{background:'#F8F6F2',minHeight:'60vh'}}>
          <div className="container-pad">
            {dataSource === 'demo' && (
              <div className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{background:'rgba(201,168,76,0.12)', color:'#8a6d1f'}}>
                <AlertCircle size={14}/> Showing demo pricing — live flight search is unavailable right now.
              </div>
            )}
            {dataSource === 'duffel' && (
              <div className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{background:'rgba(34,197,94,0.1)', color:'#16803d'}}>
                <CheckCircle size={14}/> Live prices
              </div>
            )}
            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-2xl" style={{background:'#FFFFFF', border:'1px solid rgba(201,168,76,0.2)', boxShadow:'0 4px 20px rgba(10,22,40,0.06)'}}>
              <Filter size={15} style={{color:'#C9A84C'}}/>
              <span className="text-sm font-bold text-primary">{sortAndFilter(outFlights).length} results</span>
              <div className="flex flex-wrap gap-2 ml-auto">
                <select value={filterStops} onChange={e=>setFilterStops(e.target.value)}
                  className="px-3 py-2 rounded-xl text-sm font-bold focus:outline-none"
                  style={{background:'#F3F4F6',border:'1px solid #E5E7EB',color:'#111827'}}>
                  <option value="all">All stops</option>
                  <option value="direct">Direct only</option>
                  <option value="stops">1+ stops</option>
                </select>
                <select value={filterAirline} onChange={e=>setFilterAirline(e.target.value)}
                  className="px-3 py-2 rounded-xl text-sm font-bold focus:outline-none"
                  style={{background:'#F3F4F6',border:'1px solid #E5E7EB',color:'#111827'}}>
                  <option value="all">All airlines</option>
                  {airlines.map(a=><option key={a} value={a} style={{background:'#FFFFFF'}}>{a}</option>)}
                </select>
                <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl text-sm font-bold focus:outline-none"
                  style={{background:'#F3F4F6',border:'1px solid #E5E7EB',color:'#111827'}}>
                  <option value="price">Cheapest first</option>
                  <option value="duration">Shortest first</option>
                  <option value="dep">Earliest depart</option>
                </select>
              </div>
            </div>

            {/* Outbound */}
            <h2 className="font-bold text-lg text-primary mb-4">
              {type==='roundTrip'?' Outbound ·':' '} {segments[0].from?.city} → {segments[0].to?.city}
              <span className="text-base font-normal ml-2" style={{color:'#4B5563'}}>{segments[0].date}</span>
            </h2>
            <div className="space-y-3 mb-10">
              {sortAndFilter(outFlights).map(f => (
                <FlightCard key={f.id} flight={f} cabinClass={cabinClass}
                  onSelect={setSelectedOut} selected={selectedOut}
                  onPickSeats={(fl, isRet) => setSeatMapFor({flight:fl, isReturn:isRet})}
                  seats={selectedOut?.id===f.id ? outSeats : []} isReturn={false}/>
              ))}
            </div>

            {/* Return */}
            {type==='roundTrip' && retFlights.length>0 && (
              <>
                <h2 className="font-bold text-lg text-primary mb-4">
                   Return · {segments[0].to?.city} → {segments[0].from?.city}
                  <span className="text-base font-normal ml-2" style={{color:'#4B5563'}}>{segments[1].date}</span>
                </h2>
                <div className="space-y-3 mb-10">
                  {sortAndFilter(retFlights).map(f => (
                    <FlightCard key={f.id} flight={f} cabinClass={cabinClass}
                      onSelect={setSelectedRet} selected={selectedRet}
                      onPickSeats={(fl, isRet) => setSeatMapFor({flight:fl, isReturn:isRet})}
                      seats={selectedRet?.id===f.id ? retSeats : []} isReturn={true}/>
                  ))}
                </div>
              </>
            )}

            {/* Sticky proceed bar */}
            {canProceed && (
              <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-40 rounded-2xl p-4 flex items-center justify-between gap-4"
                style={{background:'rgba(255,255,255,0.97)',border:'1px solid rgba(201,168,76,0.3)',backdropFilter:'blur(24px)',boxShadow:'0 8px 40px rgba(10,22,40,0.15)'}}>
                <div>
                  <p className="text-sm mb-0.5" style={{color:'#4B5563'}}>Total for {totalPax} passenger{totalPax>1?'s':''}</p>
                  <p className="font-display font-bold text-xl" style={{color:'#C9A84C'}}>{formatNGN(totalFare)}</p>
                  {(outSeats.length>0||retSeats.length>0) && (
                    <p className="text-sm text-green-600 mt-0.5">Seats: {[...outSeats,...retSeats].join(', ')}</p>
                  )}
                </div>
                <button onClick={proceed} className="btn-gold px-8 py-3.5 text-base font-bold flex items-center gap-2">
                  Continue — Add Extras <ArrowRight size={15}/>
                </button>
              </motion.div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
