import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, Plane, Hotel, Car, Package, ArrowRight, ChevronDown, ArrowLeftRight } from 'lucide-react'
import AirportInput from '../search/AirportInput'
import { useBooking } from '../../store/BookingContext'

const BG_SLIDES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&q=80',
  'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=80',
]

const TABS = [
  { id: 'flights',  icon: Plane,   label: 'Flights' },
  { id: 'hotels',   icon: Hotel,   label: 'Hotels' },
  { id: 'pickup',   icon: Car,     label: 'Pickup' },
  { id: 'packages', icon: Package, label: 'Packages' },
]

const STATS = [
  { val: '5,000+', label: 'Travellers Served' },
  { val: '50+',    label: 'Countries' },
  { val: '24/7',   label: 'Support' },
  { val: '100%',   label: 'Trusted' },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const { booking, update } = useBooking()

  const [slide, setSlide]         = useState(0)
  const [tab, setTab]             = useState(booking.heroTab || 'flights')
  const [flightType, setFlightType] = useState(booking.heroFlightType || 'roundTrip')
  const [from, setFrom]           = useState(booking.heroFrom || null)
  const [to, setTo]               = useState(booking.heroTo || null)
  const [departure, setDeparture] = useState(booking.heroDeparture || '')
  const [returnDate, setReturnDate] = useState(booking.heroReturn || '')
  const [hotelCity, setHotelCity] = useState(booking.heroHotelCity || '')
  const [checkIn, setCheckIn]     = useState(booking.heroCheckIn || '')
  const [checkOut, setCheckOut]   = useState(booking.heroCheckOut || '')
  const [pickupFrom, setPickupFrom] = useState(booking.heroPickupFrom || '')
  const [pickupTo,   setPickupTo]   = useState(booking.heroPickupTo   || '')
  const [pickupDate, setPickupDate] = useState(booking.heroPickupDate || '')

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % BG_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const today = new Date().toISOString().split('T')[0]

  const handleSearch = e => {
    e.preventDefault()
    update({
      heroTab: tab, heroFlightType: flightType,
      heroFrom: from, heroTo: to, heroDeparture: departure, heroReturn: returnDate,
      heroHotelCity: hotelCity, heroCheckIn: checkIn, heroCheckOut: checkOut,
      heroPickupFrom: pickupFrom, heroPickupTo: pickupTo, heroPickupDate: pickupDate,
    })
    navigate(tab === 'packages' ? '/packages' : `/booking/${tab}`)
  }

  const iCls = "w-full px-4 py-3 rounded-xl text-base text-white placeholder-white/40 focus:outline-none transition-all"
  const iSt  = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }
  const iFoc = e => { e.target.style.borderColor = 'rgba(201,168,76,0.7)'; e.target.style.background = 'rgba(255,255,255,0.12)' }
  const iBlr = e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.08)' }

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background slider */}
      {BG_SLIDES.map((bg, i) => (
        <div key={bg} className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: slide === i ? 1 : 0, zIndex: 0 }}>
          <img src={bg} alt="" className="w-full h-full object-cover"/>
        </div>
      ))}
      <div className="absolute inset-0 z-1" style={{ background: 'linear-gradient(to bottom,rgba(5,13,26,0.65) 0%,rgba(5,13,26,0.85) 60%,rgba(5,13,26,0.97) 100%)' }}/>
      <div className="absolute inset-0 z-1 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 50%,rgba(201,168,76,0.06) 0%,transparent 60%)' }}/>

      {/* Slide dots */}
      <div className="absolute bottom-28 right-8 z-20 flex flex-col gap-2">
        {BG_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)}
            className="rounded-full transition-all duration-300"
            style={{ width: slide === i ? '6px' : '4px', height: slide === i ? '20px' : '4px', background: slide === i ? '#C9A84C' : 'rgba(255,255,255,0.3)' }}/>
        ))}
      </div>

      <div className="relative z-10 container-pad pt-40 pb-16 w-full">
        <div className="max-w-4xl mx-auto">

          {/* Headline — no badge/tagline above */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="font-display font-bold text-white leading-[1.05] mb-4 text-balance"
            style={{ fontSize: 'clamp(2.8rem,6vw,5.2rem)' }}>
            Opening Doors to{' '}
            <span style={{ background: 'linear-gradient(135deg,#C9A84C,#F5C842)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              New Destinations.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-base text-white/55 mb-10 max-w-lg leading-relaxed">
            Flights · Visa · Hotels · Packages · Study Abroad · Immigration
          </motion.p>

          {/* Booking widget */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="rounded-3xl overflow-hidden"
            style={{ background: 'rgba(10,22,40,0.88)', border: '1px solid rgba(201,168,76,0.18)', backdropFilter: 'blur(24px)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>

            {/* Tabs */}
            <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {TABS.map(({ id, icon: Icon, label }) => (
                <button key={id} type="button" onClick={() => setTab(id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold uppercase tracking-wider transition-all"
                  style={{
                    color: tab === id ? '#C9A84C' : 'rgba(255,255,255,0.55)',
                    borderBottom: tab === id ? '2px solid #C9A84C' : '2px solid transparent',
                    background: tab === id ? 'rgba(201,168,76,0.05)' : 'transparent',
                  }}>
                  <Icon size={14}/><span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="p-5 md:p-6">
              {/* FLIGHTS */}
              {tab === 'flights' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {[['oneWay', 'One Way'], ['roundTrip', 'Round Trip'], ['multiCity', 'Multi-City']].map(([v, l]) => (
                      <button key={v} type="button" onClick={() => setFlightType(v)}
                        className="px-4 py-1.5 rounded-full text-sm font-bold transition-all"
                        style={{
                          background: flightType === v ? '#C9A84C' : 'rgba(255,255,255,0.06)',
                          color: flightType === v ? '#0A1628' : 'rgba(255,255,255,0.7)',
                          border: `1px solid ${flightType === v ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                        }}>{l}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_36px_1fr] gap-2 items-end">
                    <AirportInput value={from} onChange={setFrom} placeholder="From — city or airport" label="From"
                      className="[&_input]:bg-white/8 [&_input]:border-white/15 [&_input]:text-white [&_input]:placeholder-white/40 [&_label]:text-white/45 [&_label]:text-[13px]"/>
                    <button type="button" onClick={() => { const t = from; setFrom(to); setTo(t) }}
                      className="self-end w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 hidden md:flex"
                      style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}>
                      <ArrowLeftRight size={14}/>
                    </button>
                    <AirportInput value={to} onChange={setTo} placeholder="To — city or airport" label="To"
                      className="[&_input]:bg-white/8 [&_input]:border-white/15 [&_input]:text-white [&_input]:placeholder-white/40 [&_label]:text-white/45 [&_label]:text-[13px]"/>
                  </div>
                  <div className={`grid gap-3 ${flightType === 'roundTrip' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <div>
                      <p className="text-[13px] text-white/45 font-bold uppercase tracking-wider mb-1.5">Departure</p>
                      <input type="date" min={today} value={departure} onChange={e => setDeparture(e.target.value)}
                        className={iCls} style={iSt} onFocus={iFoc} onBlur={iBlr}/>
                    </div>
                    {flightType === 'roundTrip' && (
                      <div>
                        <p className="text-[13px] text-white/45 font-bold uppercase tracking-wider mb-1.5">Return</p>
                        <input type="date" min={departure || today} value={returnDate} onChange={e => setReturnDate(e.target.value)}
                          className={iCls} style={iSt} onFocus={iFoc} onBlur={iBlr}/>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* HOTELS */}
              {tab === 'hotels' && (
                <div className="space-y-3">
                  <div>
                    <p className="text-[13px] text-white/45 font-bold uppercase tracking-wider mb-1.5">Destination</p>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: '#C9A84C' }}/>
                      <input value={hotelCity} onChange={e => setHotelCity(e.target.value)} placeholder="City or destination"
                        className={`${iCls} pl-9`} style={iSt} onFocus={iFoc} onBlur={iBlr}/>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[13px] text-white/45 font-bold uppercase tracking-wider mb-1.5">Check-in</p>
                      <input type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)}
                        className={iCls} style={iSt} onFocus={iFoc} onBlur={iBlr}/>
                    </div>
                    <div>
                      <p className="text-[13px] text-white/45 font-bold uppercase tracking-wider mb-1.5">Check-out</p>
                      <input type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)}
                        className={iCls} style={iSt} onFocus={iFoc} onBlur={iBlr}/>
                    </div>
                  </div>
                </div>
              )}

              {/* PICKUP */}
              {tab === 'pickup' && (
                <div className="space-y-3">
                  <div>
                    <p className="text-[13px] text-white/45 font-bold uppercase tracking-wider mb-1.5">Pickup Location</p>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400 z-10"/>
                      <input value={pickupFrom} onChange={e => setPickupFrom(e.target.value)} placeholder="Airport or hotel"
                        className={`${iCls} pl-8`} style={iSt} onFocus={iFoc} onBlur={iBlr}/>
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] text-white/45 font-bold uppercase tracking-wider mb-1.5">Drop-off</p>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-400 z-10"/>
                      <input value={pickupTo} onChange={e => setPickupTo(e.target.value)} placeholder="Destination address"
                        className={`${iCls} pl-8`} style={iSt} onFocus={iFoc} onBlur={iBlr}/>
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] text-white/45 font-bold uppercase tracking-wider mb-1.5">Date</p>
                    <input type="date" min={today} value={pickupDate} onChange={e => setPickupDate(e.target.value)}
                      className={iCls} style={iSt} onFocus={iFoc} onBlur={iBlr}/>
                  </div>
                </div>
              )}

              {/* PACKAGES */}
              {tab === 'packages' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1">
                  {['Dubai', 'Canada', 'Paris', 'London', 'Turkey', 'Maldives'].map(dest => (
                    <button key={dest} type="button" onClick={() => navigate('/packages')}
                      className="py-2.5 rounded-xl text-base font-semibold text-white/70 hover:text-white transition-all hover:scale-105"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {dest}
                    </button>
                  ))}
                </div>
              )}

              {tab !== 'packages' && (
                <button type="submit" className="w-full mt-4 btn-gold flex items-center justify-center gap-2 py-4 text-base">
                  <Search size={16}/>
                  {tab === 'flights' ? 'Search Flights' : tab === 'hotels' ? 'Find Hotels' : 'Book Transfer'}
                </button>
              )}
            </form>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
            className="flex flex-wrap gap-x-10 gap-y-4 mt-10">
            {STATS.map(({ val, label }) => (
              <div key={label}>
                <p className="font-display font-bold text-2xl" style={{ color: '#C9A84C' }}>{val}</p>
                <p className="text-sm text-white/40">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <ChevronDown size={20} className="text-gold animate-bounce"/>
      </div>
    </section>
  )
}
