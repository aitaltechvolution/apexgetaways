import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plane, ArrowLeftRight, Plus, Minus, ChevronDown, ChevronUp,
  Clock, Luggage, RefreshCcw, CheckCircle, AlertCircle, ArrowRight, X
} from 'lucide-react'
import SEO from '../../../components/SEO'
import AirportInput from '../../../components/search/AirportInput'
import SeatMap from '../../../components/booking/SeatMap'
import { generateFlights, formatNGN } from '../../../data'
import { useBooking } from '../../../store/BookingContext'

const CABIN_CLASSES = [
  { value:'economy', label:'Economy' },
  { value:'premium_economy', label:'Premium Economy' },
  { value:'business', label:'Business' },
  { value:'first', label:'First Class' },
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
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Passengers</label>
      <button onClick={() => setOpen(!open)} type="button"
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all">
        <span>{total} Passenger{total!==1?'s':''}</span>
        <ChevronDown size={15} className="text-gray-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-card-dark rounded-2xl shadow-card-hover border border-gray-100 dark:border-gray-800 z-50 p-4 space-y-4">
            {[['adults','Adults','12+ yrs'],['children','Children','2-11 yrs'],['infants','Infants','Under 2']].map(([k,lbl,sub]) => (
              <div key={k} className="flex items-center justify-between">
                <div><p className="font-semibold text-sm text-gray-900 dark:text-white">{lbl}</p><p className="text-xs text-gray-400">{sub}</p></div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => adjust(k,-1)} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"><Minus size={13}/></button>
                  <span className="w-5 text-center font-bold text-sm">{value[k]}</span>
                  <button type="button" onClick={() => adjust(k,1)} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"><Plus size={13}/></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setOpen(false)} className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold">Done</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FlightCard({ flight, cabinClass, onSelect, selected, onPickSeats, seats }) {
  const [expanded, setExpanded] = useState(false)
  const price = flight[cabinClass] || flight.economy
  const isSelected = selected?.id === flight.id
  const mySeats = seats || []

  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
      className={`bg-white dark:bg-card-dark rounded-2xl border transition-all duration-200 overflow-hidden ${isSelected ? 'border-primary shadow-glow' : 'border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-0.5'}`}>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-4">
          {/* Airline */}
          <div className="flex items-center gap-2 w-36 shrink-0">
            <span className="text-2xl">{flight.logo}</span>
            <div>
              <p className="font-bold text-xs text-gray-900 dark:text-white">{flight.airline}</p>
              <p className="text-[11px] text-gray-400">{flight.flightNo}</p>
            </div>
          </div>
          {/* Times */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-center">
              <p className="font-bold text-xl text-gray-900 dark:text-white">{flight.dep}</p>
              <p className="text-xs text-gray-400">{flight.from}</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 min-w-[80px]">
              <p className="text-[11px] text-gray-400">{flight.duration}</p>
              <div className="relative w-full flex items-center">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"/>
                <Plane size={12} className="text-primary mx-1 shrink-0"/>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"/>
              </div>
              <p className="text-[11px] text-gray-400">{flight.stops===0?'Direct':`${flight.stops} stop${flight.stops>1?'s':''}${flight.stopCity?' · '+flight.stopCity:''}`}</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl text-gray-900 dark:text-white">{flight.arr}</p>
              <p className="text-xs text-gray-400">{flight.to}</p>
            </div>
          </div>
          {/* Price + CTA */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <div className="text-right">
              <p className="font-extrabold text-lg text-primary">{formatNGN(price)}</p>
              <p className="text-[11px] text-gray-400">per person</p>
              <p className={`text-[10px] font-semibold mt-0.5 ${flight.refundable?'text-green-600':'text-gray-400'}`}>{flight.refundable?'Refundable':'Non-refund.'}</p>
            </div>
            <button onClick={() => onSelect(flight)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 ${isSelected ? 'bg-green-500 text-white' : 'bg-primary-gradient text-white shadow-glow hover:shadow-none'}`}>
              {isSelected ? <span className="flex items-center gap-1"><CheckCircle size={14}/>Selected</span> : 'Select'}
            </button>
          </div>
        </div>

        {/* Seat badges */}
        {isSelected && mySeats.length > 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Seats:</span>
            {mySeats.map(s => (
              <span key={s} className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-bold">{s}</span>
            ))}
            <button onClick={() => onPickSeats(flight)} className="text-xs text-primary underline">Change</button>
          </div>
        )}
        {isSelected && mySeats.length === 0 && (
          <button onClick={() => onPickSeats(flight)} className="mt-3 text-xs text-primary font-semibold underline flex items-center gap-1">
            <Plane size={11}/> Choose your seat (optional)
          </button>
        )}

        {/* Details toggle */}
        <button onClick={() => setExpanded(!expanded)} className="mt-3 flex items-center gap-1 text-xs text-primary font-semibold">
          {expanded ? <><ChevronUp size={12}/>Hide details</> : <><ChevronDown size={12}/>Flight details</>}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div><p className="text-xs text-gray-400 mb-1">Duration</p><p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1"><Clock size={12}/>{flight.duration}</p></div>
              <div><p className="text-xs text-gray-400 mb-1">Baggage</p><p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1"><Luggage size={12}/>{flight.baggage}</p></div>
              <div><p className="text-xs text-gray-400 mb-1">Cabin</p><p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{cabinClass.replace('_',' ')}</p></div>
              <div><p className="text-xs text-gray-400 mb-1">Seats left</p>
                <p className={`text-sm font-semibold flex items-center gap-1 ${flight.seatsLeft<=3?'text-red-500':'text-gray-900 dark:text-white'}`}>
                  <AlertCircle size={12}/>{flight.seatsLeft} left
                </p>
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

  // Restore state from booking context (persisted via sessionStorage)
  const [type, setType] = useState(booking.heroFlightType || booking.flightType || 'roundTrip')
  const [segments, setSegments] = useState(() => {
    // Pre-fill from hero if available
    if (booking.heroFrom || booking.heroTo) {
      return [
        { from: booking.heroFrom || null, to: booking.heroTo || null, date: booking.heroDeparture || '' },
        { from: booking.heroTo || null, to: booking.heroFrom || null, date: booking.heroReturn || '' },
      ]
    }
    return booking.segments?.length ? booking.segments : [{ from:null,to:null,date:'' },{ from:null,to:null,date:'' }]
  })
  const [passengers, setPassengers] = useState(booking.heroPassengers || booking.passengers || { adults:1,children:0,infants:0 })
  const [cabinClass, setCabinClass] = useState(booking.heroCabinClass || booking.cabinClass || 'economy')

  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [outboundFlights, setOutboundFlights] = useState([])
  const [returnFlights, setReturnFlights] = useState([])
  const [selectedOut, setSelectedOut] = useState(null)
  const [selectedRet, setSelectedRet] = useState(null)
  const [sortBy, setSortBy] = useState('price')
  const [filterStops, setFilterStops] = useState('all')

  // Seat map state
  const [seatMapFlight, setSeatMapFlight] = useState(null) // which flight we're picking seats for
  const [seatMapIsReturn, setSeatMapIsReturn] = useState(false)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedReturnSeats, setSelectedReturnSeats] = useState([])

  const totalPax = passengers.adults + passengers.children

  const updateSeg = (i, patch) => setSegments(s => s.map((seg,idx) => idx===i ? {...seg,...patch} : seg))
  const swapAirports = (i) => setSegments(s => s.map((seg,idx) => idx===i ? {...seg,from:seg.to,to:seg.from} : seg))
  const addLeg = () => setSegments(s => [...s, {from:null,to:null,date:''}])
  const removeLeg = (i) => setSegments(s => s.filter((_,idx) => idx!==i))

  const today = new Date().toISOString().split('T')[0]

  const search = () => {
    if (!segments[0].from || !segments[0].to || !segments[0].date) return
    setLoading(true)
    setSelectedOut(null); setSelectedRet(null)
    setSelectedSeats([]); setSelectedReturnSeats([])
    setTimeout(() => {
      setOutboundFlights(generateFlights(segments[0].from.code, segments[0].to.code, segments[0].date))
      if (type==='roundTrip' && segments[1].date) {
        setReturnFlights(generateFlights(segments[0].to.code, segments[0].from.code, segments[1].date))
      } else { setReturnFlights([]) }
      setLoading(false); setSearched(true)
    }, 1200)
  }

  const openSeatMap = (flight, isReturn = false) => {
    setSeatMapFlight(flight)
    setSeatMapIsReturn(isReturn)
  }

  const handleSeatConfirm = (seats) => {
    if (seatMapIsReturn) setSelectedReturnSeats(seats)
    else setSelectedSeats(seats)
    setSeatMapFlight(null)
  }

  const sortFn = (a,b) => sortBy==='price' ? a[cabinClass]-b[cabinClass] : sortBy==='duration' ? a.durationMins-b.durationMins : a.dep.localeCompare(b.dep)
  const filterFn = f => filterStops==='all' ? true : filterStops==='direct' ? f.stops===0 : f.stops>0
  const sortedOut = [...outboundFlights].filter(filterFn).sort(sortFn)
  const sortedRet = [...returnFlights].filter(filterFn).sort(sortFn)

  const canProceed = selectedOut && (type!=='roundTrip' || selectedRet)

  const totalFare = () => {
    const base = (selectedOut?.[cabinClass]||0) + (selectedRet?.[cabinClass]||0)
    return base * totalPax
  }

  const proceed = () => {
    update({
      bookingType:'flight', flightType:type, segments, passengers, cabinClass,
      selectedFlight: selectedOut, selectedReturnFlight: selectedRet,
      selectedSeats, selectedReturnSeats,
    })
    navigate('/booking/passengers')
  }

  return (
    <>
      <SEO title="Search Flights" description="Search and book flights worldwide — one-way, round trip, or multi-city." />

      {/* Seat Map Modal */}
      {seatMapFlight && (
        <SeatMap
          flight={seatMapFlight}
          passengers={totalPax}
          selectedClass={cabinClass}
          onConfirm={handleSeatConfirm}
          onClose={() => setSeatMapFlight(null)}
        />
      )}

      {/* Hero Search */}
      <section className="relative bg-navy dark:bg-black pt-24 pb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80" alt="" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 to-navy"/>
        </div>
        <div className="relative container-pad">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-4">
              <Plane size={12}/> Best Flight Deals — All Airlines
            </div>
            <h1 className="font-extrabold text-4xl md:text-5xl text-white mb-2">Search Flights</h1>
            <p className="text-blue-200">One-way · Round trip · Multi-city</p>
          </div>

          <div className="bg-white dark:bg-card-dark rounded-3xl shadow-2xl p-6 md:p-8">
            {/* Trip type */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {[['oneWay','One Way'],['roundTrip','Round Trip'],['multiCity','Multi-City']].map(([val,lbl]) => (
                <button key={val} type="button" onClick={() => { setType(val); setSearched(false) }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${type===val ? 'bg-primary text-white shadow-glow' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                  {lbl}
                </button>
              ))}
            </div>

            {/* Segments */}
            <div className="space-y-4">
              {(type==='multiCity' ? segments : segments.slice(0,1)).map((seg,i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr] gap-3 items-end">
                  <AirportInput value={seg.from} onChange={v => updateSeg(i,{from:v})} label={i===0?'From':`From (Leg ${i+1})`} placeholder="Departure city"/>
                  <button type="button" onClick={() => swapAirports(i)} className="hidden md:flex w-10 h-10 mb-0.5 rounded-xl border border-gray-200 dark:border-gray-700 items-center justify-center hover:border-primary hover:text-primary transition-colors text-gray-400 self-end">
                    <ArrowLeftRight size={15}/>
                  </button>
                  <AirportInput value={seg.to} onChange={v => updateSeg(i,{to:v})} label={i===0?'To':`To (Leg ${i+1})`} placeholder="Destination city"/>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{type==='multiCity'?`Depart (Leg ${i+1})`:'Departure Date'}</label>
                    <input type="date" min={today} value={seg.date} onChange={e => updateSeg(i,{date:e.target.value})}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
                  </div>
                  {type==='multiCity' && i>1 && (
                    <button type="button" onClick={() => removeLeg(i)} className="self-end w-10 h-10 rounded-xl border border-red-200 text-red-400 flex items-center justify-center hover:bg-red-50 transition-colors"><X size={15}/></button>
                  )}
                </div>
              ))}

              {type==='roundTrip' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-start-4">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Return Date</label>
                    <input type="date" min={segments[0].date||today} value={segments[1].date} onChange={e => updateSeg(1,{date:e.target.value})}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
                  </div>
                </div>
              )}

              {type==='multiCity' && segments.length < 5 && (
                <button type="button" onClick={addLeg} className="flex items-center gap-2 text-sm font-bold text-primary border-2 border-dashed border-primary/30 hover:border-primary rounded-xl px-4 py-3 w-full justify-center transition-all">
                  <Plus size={15}/> Add Another City
                </button>
              )}
            </div>

            {/* Class + Passengers + Search */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Cabin Class</label>
                <select value={cabinClass} onChange={e => setCabinClass(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all">
                  {CABIN_CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <PassengerPicker value={passengers} onChange={setPassengers}/>
              <div className="flex items-end">
                <button onClick={search} type="button" disabled={!segments[0].from||!segments[0].to||!segments[0].date||loading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-primary-gradient shadow-glow hover:shadow-none transition-all hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
                  {loading ? <><RefreshCcw size={15} className="animate-spin"/>Searching…</> : <><Plane size={15}/>Search Flights</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      {searched && (
        <section className="section-pad bg-surface-light dark:bg-surface-dark">
          <div className="container-pad">
            {/* Sort/Filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {sortedOut.length} flights · {segments[0].from?.city} → {segments[0].to?.city}
              </p>
              <div className="flex flex-wrap gap-2">
                <select value={filterStops} onChange={e => setFilterStops(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all">
                  <option value="all">All stops</option>
                  <option value="direct">Direct only</option>
                  <option value="stops">With stops</option>
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all">
                  <option value="price">Sort: Price</option>
                  <option value="duration">Sort: Duration</option>
                  <option value="dep">Sort: Departure</option>
                </select>
              </div>
            </div>

            {/* Outbound */}
            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
              {type==='roundTrip' ? '✈️ Outbound' : '✈️ Flights'} · {segments[0].from?.city} → {segments[0].to?.city}
            </h2>
            <div className="space-y-3 mb-10">
              {sortedOut.map(f => (
                <FlightCard key={f.id} flight={f} cabinClass={cabinClass}
                  onSelect={setSelectedOut} selected={selectedOut}
                  onPickSeats={(fl) => openSeatMap(fl, false)}
                  seats={selectedOut?.id===f.id ? selectedSeats : []}/>
              ))}
            </div>

            {/* Return */}
            {type==='roundTrip' && sortedRet.length > 0 && (
              <>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                  🔁 Return · {segments[0].to?.city} → {segments[0].from?.city}
                </h2>
                <div className="space-y-3 mb-10">
                  {sortedRet.map(f => (
                    <FlightCard key={f.id} flight={f} cabinClass={cabinClass}
                      onSelect={setSelectedRet} selected={selectedRet}
                      onPickSeats={(fl) => openSeatMap(fl, true)}
                      seats={selectedRet?.id===f.id ? selectedReturnSeats : []}/>
                  ))}
                </div>
              </>
            )}

            {/* Sticky summary */}
            {canProceed && (
              <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl bg-white dark:bg-card-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between gap-4 z-40">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Total · {totalPax} passenger{totalPax>1?'s':''}</p>
                  <p className="font-extrabold text-xl text-primary">{formatNGN(totalFare())}</p>
                  {(selectedSeats.length > 0 || selectedReturnSeats.length > 0) && (
                    <p className="text-xs text-green-600 font-semibold mt-0.5">
                      Seats: {[...selectedSeats,...selectedReturnSeats].join(', ')}
                    </p>
                  )}
                </div>
                <button onClick={proceed} className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-primary-gradient shadow-glow hover:shadow-none transition-all hover:scale-105">
                  Continue <ArrowRight size={15}/>
                </button>
              </motion.div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
