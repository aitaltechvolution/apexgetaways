import { createContext, useContext, useState, useEffect } from 'react'

const BookingContext = createContext(null)
export const useBooking = () => useContext(BookingContext)

const STORAGE_KEY = 'apex_booking_draft'

const INIT = {
  flightType: 'roundTrip',
  segments: [{ from:null, to:null, date:'' }, { from:null, to:null, date:'' }],
  passengers: { adults:1, children:0, infants:0 },
  cabinClass: 'economy',
  selectedFlight: null,
  selectedReturnFlight: null,
  selectedSeats: [],
  selectedReturnSeats: [],
  hotelCity: '',
  hotelCheckIn: '',
  hotelCheckOut: '',
  hotelRooms: 1,
  hotelGuests: 2,
  selectedHotel: null,
  selectedRoomType: null,
  pickupFrom: '',
  pickupTo: '',
  pickupDate: '',
  pickupTime: '',
  pickupPassengers: 1,
  pickupVehicle: null,
  pickupReturnNeeded: false,
  pickupReturnDate: '',
  pickupReturnTime: '',
  pickupNotes: '',
  passengers_info: [],
  contact: { name:'', email:'', phone:'' },
  bookingType: null,
  step: 1,
  // Hero search widget state (persists when navigating to flight page)
  heroTab: 'flights',
  heroFlightType: 'roundTrip',
  heroFrom: null,
  heroTo: null,
  heroDeparture: '',
  heroReturn: '',
  heroPassengers: { adults:1, children:0, infants:0 },
  heroCabinClass: 'economy',
  heroHotelCity: '',
  heroCheckIn: '',
  heroCheckOut: '',
  heroPickupFrom: '',
  heroPickupTo: '',
  heroPickupDate: '',
}

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? { ...INIT, ...JSON.parse(raw) } : INIT
  } catch { return INIT }
}

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(loadDraft)

  // Persist every change to sessionStorage
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(booking)) }
    catch {}
  }, [booking])

  const update = (patch) => setBooking(b => ({ ...b, ...patch }))
  const reset = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setBooking(INIT)
  }

  const totalPassengers = (b = booking) =>
    b.passengers.adults + b.passengers.children + b.passengers.infants

  return (
    <BookingContext.Provider value={{ booking, update, reset, totalPassengers }}>
      {children}
    </BookingContext.Provider>
  )
}
