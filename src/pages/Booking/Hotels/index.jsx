import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Hotel, Star, MapPin, Wifi, ChevronDown, ChevronUp,
  CheckCircle, ArrowRight, RefreshCcw, Search, Car, Coffee } from 'lucide-react'
import SEO from '../../../components/SEO'
import { generateHotels, formatNGN } from '../../../data'
import { fetchHotelImages } from '../../../lib/api'
import { useBooking } from '../../../store/BookingContext'

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({length:5}).map((_,i) => (
        <Star key={i} size={12} fill={i<count?'#F5A623':'none'} className={i<count?'text-accent':'text-gray-300 dark:text-gray-600'}/>
      ))}
    </div>
  )
}

function HotelCard({ hotel, onSelect, selected }) {
  const [expanded, setExpanded] = useState(false)
  const [activeRoom, setActiveRoom] = useState(0)
  const isSelected = selected?.hotel?.id === hotel.id

  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
      className={`bg-white dark:bg-card-dark rounded-2xl border overflow-hidden transition-all duration-200 ${isSelected ? 'border-primary shadow-glow' : 'border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-0.5'}`}>
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-56 shrink-0 overflow-hidden">
          <img src={hotel.img} alt={hotel.name} className="w-full h-48 md:h-full object-cover transition-transform duration-500 hover:scale-105"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"/>
          {hotel.freeCancellation && <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">Free Cancel</span>}
          {hotel.breakfastIncluded && <span className="absolute top-2 right-2 bg-accent text-navy text-[10px] font-bold px-2 py-1 rounded-lg">Breakfast ✓</span>}
        </div>
        {/* Body */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <StarRating count={hotel.stars}/>
                <span className="text-xs text-gray-400">{hotel.chain}</span>
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white leading-tight">{hotel.name}</h3>
              <p className="flex items-center gap-1 text-xs text-gray-400 mt-1"><MapPin size={10}/>{hotel.address}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 mb-1 justify-end">
                <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">{hotel.rating}</span>
                <span className="text-xs text-gray-400">{hotel.reviews} reviews</span>
              </div>
              <p className="font-extrabold text-lg text-primary">{formatNGN(hotel.perNight)}</p>
              <p className="text-xs text-gray-400">per night · {hotel.nights} night{hotel.nights!==1?'s':''}</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-0.5">Total: {formatNGN(hotel.total)}</p>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.amenities.slice(0,5).map(a => (
              <span key={a} className="text-[10px] font-medium px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{a}</span>
            ))}
            {hotel.amenities.length>5 && <span className="text-[10px] font-medium px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400">+{hotel.amenities.length-5}</span>}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button onClick={() => setExpanded(!expanded)} type="button"
              className="flex items-center gap-1 text-xs font-semibold text-primary">
              {expanded ? <><ChevronUp size={12}/>Hide rooms</> : <><ChevronDown size={12}/>View rooms</>}
            </button>
            <button onClick={() => onSelect({hotel, room:hotel.roomTypes[activeRoom]})} type="button"
              className={`ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 ${isSelected ? 'bg-green-500 text-white' : 'bg-primary-gradient text-white shadow-glow hover:shadow-none'}`}>
              {isSelected ? <><CheckCircle size={14}/>Selected</> : 'Select Hotel'}
            </button>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Room Types</p>
                  <div className="space-y-2">
                    {hotel.roomTypes.map((room,i) => (
                      <div key={room.type} onClick={() => setActiveRoom(i)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${activeRoom===i ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 hover:border-primary/40'}`}>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{room.type}</p>
                          <p className="text-xs text-gray-400">{room.beds}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="font-bold text-primary">{formatNGN(room.price)}</p>
                            <p className="text-xs text-gray-400">/night</p>
                          </div>
                          {activeRoom===i && <CheckCircle size={16} className="text-primary"/>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default function HotelsPage() {
  const { booking, update } = useBooking()
  const navigate = useNavigate()

  const [city, setCity] = useState(booking.heroHotelCity || booking.hotelCity || '')
  const [checkIn, setCheckIn] = useState(booking.heroCheckIn || booking.hotelCheckIn || '')
  const [checkOut, setCheckOut] = useState(booking.heroCheckOut || booking.hotelCheckOut || '')
  const [rooms, setRooms] = useState(booking.hotelRooms || 1)
  const [guests, setGuests] = useState(booking.hotelGuests || 2)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hotels, setHotels] = useState([])
  const [selected, setSelected] = useState(null)
  const [sortBy, setSortBy] = useState('price')
  const [filterStars, setFilterStars] = useState('all')

  const today = new Date().toISOString().split('T')[0]

  const search = useCallback(async () => {
    if (!city || !checkIn || !checkOut) return
    setLoading(true)
    try {
      // Generate hotels then fetch real images
      const base = generateHotels(city, checkIn, checkOut)
      const imgs = await fetchHotelImages(city, base.length)
      const hotelsWithRealImgs = base.map((h, i) => ({
        ...h,
        img: imgs[i % imgs.length] || h.img
      }))
      setHotels(hotelsWithRealImgs)
      setSearched(true)
      setSelected(null)
    } finally {
      setLoading(false)
    }
  }, [city, checkIn, checkOut])

  const sorted = [...hotels]
    .filter(h => filterStars==='all' ? true : h.stars===Number(filterStars))
    .sort((a,b) => sortBy==='price' ? a.perNight-b.perNight : sortBy==='rating' ? b.rating-a.rating : b.stars-a.stars)

  const proceed = () => {
    update({
      bookingType:'hotel',
      hotelCity:city, hotelCheckIn:checkIn, hotelCheckOut:checkOut,
      hotelRooms:rooms, hotelGuests:guests,
      selectedHotel:selected?.hotel, selectedRoomType:selected?.room,
    })
    navigate('/booking/passengers')
  }

  return (
    <>
      <SEO title="Search Hotels" description="Find and book hotels worldwide — best rates, real photos." />

      <section className="relative bg-navy dark:bg-black pt-24 pb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1400&q=80" alt="" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 to-navy"/>
        </div>
        <div className="relative container-pad">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-4">
              <Hotel size={12}/> Best Rates · Real Photos · Instant Confirmation
            </div>
            <h1 className="font-extrabold text-4xl md:text-5xl text-white mb-2">Search Hotels</h1>
            <p className="text-blue-200">Budget to 5-star luxury · 190+ countries</p>
          </div>

          <div className="bg-white dark:bg-card-dark rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">City / Destination</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"/>
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="Lagos, Dubai, London…"
                    className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Check-in</label>
                <input type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Check-out</label>
                <input type="date" min={checkIn||today} value={checkOut} onChange={e => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Rooms</label>
                <input type="number" min={1} max={10} value={rooms} onChange={e => setRooms(Number(e.target.value))}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Guests</label>
                <input type="number" min={1} max={20} value={guests} onChange={e => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all"/>
              </div>
              <div className="col-span-2 flex items-end">
                <button onClick={search} type="button" disabled={!city||!checkIn||!checkOut||loading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-primary-gradient shadow-glow hover:shadow-none transition-all hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
                  {loading ? <><RefreshCcw size={15} className="animate-spin"/>Searching…</> : <><Search size={15}/>Search Hotels</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {searched && (
        <section className="section-pad bg-surface-light dark:bg-surface-dark">
          <div className="container-pad">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {sorted.length} hotels in <strong className="text-gray-900 dark:text-white">{city}</strong>
                {checkIn && checkOut && ` · ${checkIn} – ${checkOut}`}
              </p>
              <div className="flex flex-wrap gap-2">
                <select value={filterStars} onChange={e => setFilterStars(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all">
                  <option value="all">All stars</option>
                  <option value="5">5 ★</option>
                  <option value="4">4 ★</option>
                  <option value="3">3 ★</option>
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all">
                  <option value="price">Price ↑</option>
                  <option value="rating">Rating ↓</option>
                  <option value="stars">Stars ↓</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              {sorted.map(h => <HotelCard key={h.id} hotel={h} onSelect={setSelected} selected={selected}/>)}
            </div>

            {selected && (
              <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl bg-white dark:bg-card-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between gap-4 z-40">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{selected.hotel.name} · {selected.room.type}</p>
                  <p className="font-extrabold text-xl text-primary">{formatNGN(selected.room.price * selected.hotel.nights)}</p>
                  <p className="text-xs text-gray-400">{selected.hotel.nights} night{selected.hotel.nights!==1?'s':''} · {rooms} room{rooms!==1?'s':''}</p>
                </div>
                <button onClick={proceed}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-primary-gradient shadow-glow hover:shadow-none transition-all hover:scale-105">
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
