import { createContext, useContext, useState, useEffect } from 'react'

const BookingContext = createContext(null)
export const useBooking = () => useContext(BookingContext)

const KEY = 'apex_booking_v5'

const INIT = {
  // ── Search ─────────────────────────────────
  bookingType: null,        // 'flight' | 'hotel' | 'pickup' | 'bus'
  // Flight
  flightType: 'roundTrip', // oneWay | roundTrip | multiCity
  segments: [{ from:null, to:null, date:'' }, { from:null, to:null, date:'' }],
  passengers: { adults:1, children:0, infants:0 },
  cabinClass: 'economy',
  // ── Selected ──────────────────────────────
  selectedFlight: null,
  selectedReturnFlight: null,
  selectedSeats: [],           // ['12A','12B']
  selectedReturnSeats: [],
  // Baggage per segment
  baggage: {
    outbound: { pieces:1, weight:'23kg', price:0 },
    return:   { pieces:1, weight:'23kg', price:0 },
  },
  addons: { insurance:false, insurancePrice:15000, mealPref:'standard', specialAssistance:false },
  // Hotel
  hotelCity:'', hotelCheckIn:'', hotelCheckOut:'', hotelRooms:1, hotelGuests:2,
  selectedHotel:null, selectedRoomType:null,
  // Pickup / Bus
  pickupFrom:'', pickupTo:'', pickupDate:'', pickupTime:'',
  pickupPassengers:1, pickupVehicle:null,
  pickupReturnNeeded:false, pickupReturnDate:'', pickupReturnTime:'', pickupNotes:'',
  // ── Passengers ─────────────────────────────
  passengers_info: [],        // [{title,firstName,middleName,lastName,dob,gender,nationality,passportNo,passportExpiry,email,phone,frequentFlyer,mealPref}]
  contact: { name:'', email:'', phone:'', altPhone:'' },
  // ── Payment ────────────────────────────────
  paymentRef: null,
  orderId: null,
  orderRef: null,
  // ── Hero state (persisted across nav) ─────
  heroTab:'flights', heroFlightType:'roundTrip',
  heroFrom:null, heroTo:null, heroDeparture:'', heroReturn:'',
  heroPassengers:{ adults:1, children:0, infants:0 }, heroCabinClass:'economy',
  heroHotelCity:'', heroCheckIn:'', heroCheckOut:'',
  heroPickupFrom:'', heroPickupTo:'', heroPickupDate:'',
}

function load() {
  try { const r = sessionStorage.getItem(KEY); return r ? { ...INIT, ...JSON.parse(r) } : INIT }
  catch { return INIT }
}

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(load)

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(booking)) } catch {}
  }, [booking])

  const update  = (patch) => setBooking(b => ({ ...b, ...patch }))
  const reset   = () => { sessionStorage.removeItem(KEY); setBooking(INIT) }
  const totalPax = (b = booking) => b.passengers.adults + b.passengers.children + b.passengers.infants

  // Fare breakdown
  const getFareBreakdown = () => {
    const f = booking.selectedFlight
    const r = booking.selectedReturnFlight
    if (!f) return null
    const priceKey = booking.cabinClass || 'economy'
    const outFare  = f[priceKey] || f.economy || 0
    const retFare  = r ? (r[priceKey] || r.economy || 0) : 0
    const pax      = booking.passengers
    const adultTotal  = (outFare + retFare) * pax.adults
    const childTotal  = (outFare + retFare) * 0.75 * pax.children
    const infantTotal = (outFare + retFare) * 0.1  * pax.infants
    const baggageFee  = (booking.baggage?.outbound?.price || 0) + (booking.baggage?.return?.price || 0)
    const insuranceFee = booking.addons?.insurance ? (booking.addons.insurancePrice || 15000) : 0
    const subtotal = adultTotal + childTotal + infantTotal
    const taxes    = Math.round(subtotal * 0.075)
    const total    = subtotal + taxes + baggageFee + insuranceFee
    return { outFare, retFare, adultTotal, childTotal, infantTotal, subtotal, taxes, baggageFee, insuranceFee, total, pax }
  }

  return (
    <BookingContext.Provider value={{ booking, update, reset, totalPax, getFareBreakdown }}>
      {children}
    </BookingContext.Provider>
  )
}
