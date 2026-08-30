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

  // Fare breakdown — one function for all booking types, so Review/Payment
  // never have to guess which fields exist. Every branch always returns a
  // `.total` (what actually gets charged) plus `.subtotal`/`.taxes` for the
  // summary UI.
  const getFareBreakdown = () => {
    const { bookingType, selectedFlight, selectedHotel, pickupVehicle } = booking

    if (bookingType === 'hotel' || selectedHotel) {
      const nights = booking.hotelCheckIn && booking.hotelCheckOut
        ? Math.max(1, Math.round((new Date(booking.hotelCheckOut) - new Date(booking.hotelCheckIn)) / 86400000))
        : (selectedHotel?.nights || 1)
      const rooms = booking.hotelRooms || 1
      const perNight = booking.selectedRoomType?.price || 0
      const subtotal = perNight * nights * rooms
      return { subtotal, taxes: 0, total: subtotal, nights, rooms, perNight }
    }

    if (bookingType === 'pickup' || pickupVehicle) {
      const base = pickupVehicle?.basePrice || 0
      const subtotal = base * (booking.pickupReturnNeeded ? 2 : 1)
      return { subtotal, taxes: 0, total: subtotal }
    }

    // Flights
    const f = selectedFlight
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
