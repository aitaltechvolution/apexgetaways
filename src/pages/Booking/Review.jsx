import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plane, Hotel, Car, User, Mail, Phone, CheckCircle, ArrowLeft, ArrowRight, Shield } from 'lucide-react'
import SEO from '../../components/SEO'
import { useBooking } from '../../store/BookingContext'
import { formatNGN } from '../../data'

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white text-right max-w-[60%]">{value}</span>
    </div>
  )
}

export default function ReviewPage() {
  const { booking } = useBooking()
  const navigate = useNavigate()
  const { bookingType, selectedFlight, selectedReturnFlight, selectedHotel, selectedRoomType,
          pickupVehicle, pickupFrom, pickupTo, pickupDate, pickupTime,
          passengers, cabinClass, hotelCheckIn, hotelCheckOut, hotelRooms,
          passengers_info, contact } = booking

  const totalPax = (passengers?.adults || 1) + (passengers?.children || 0)

  const flightTotal = () => {
    const base = (selectedFlight?.[cabinClass] || 0) + (selectedReturnFlight?.[cabinClass] || 0)
    return base * totalPax
  }
  const hotelTotal = selectedRoomType && selectedHotel
    ? selectedRoomType.price * Math.max(1, Math.round((new Date(hotelCheckOut) - new Date(hotelCheckIn)) / 86400000))
    : 0
  const pickupTotal = pickupVehicle?.basePrice || 0

  const grandTotal = bookingType === 'flight' ? flightTotal()
    : bookingType === 'hotel' ? hotelTotal
    : pickupTotal

  return (
    <>
      <SEO title="Review Booking" />

      {/* Step indicator */}
      <div className="bg-white dark:bg-card-dark border-b border-gray-100 dark:border-gray-800 pt-20">
        <div className="container-pad py-4">
          <div className="flex items-center gap-3 max-w-md">
            {['Search', 'Select', 'Passengers', 'Review', 'Confirm'].map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i < 3 ? 'bg-green-500 text-white' : i === 3 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}>
                  {i < 3 ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === 3 ? 'text-primary' : i < 3 ? 'text-green-600' : 'text-gray-400'}`}>{s}</span>
                {i < 4 && <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="section-pad bg-surface-light dark:bg-surface-dark">
        <div className="container-pad max-w-3xl mx-auto">
          <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">Review Your Booking</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Please review all details carefully before confirming.</p>

          <div className="space-y-5">
            {/* Flight summary */}
            {bookingType === 'flight' && selectedFlight && (
              <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-6">
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Plane size={18} className="text-primary" /> Flight Details
                </h3>
                <Row label="Trip Type" value={booking.flightType === 'roundTrip' ? 'Round Trip' : booking.flightType === 'oneWay' ? 'One Way' : 'Multi-City'} />
                <Row label="Outbound Flight" value={`${selectedFlight.airline} ${selectedFlight.flightNo} · ${selectedFlight.from} → ${selectedFlight.to}`} />
                <Row label="Departure" value={`${selectedFlight.date} at ${selectedFlight.dep}`} />
                {selectedReturnFlight && (
                  <>
                    <Row label="Return Flight" value={`${selectedReturnFlight.airline} ${selectedReturnFlight.flightNo} · ${selectedReturnFlight.from} → ${selectedReturnFlight.to}`} />
                    <Row label="Return Departure" value={`${selectedReturnFlight.date} at ${selectedReturnFlight.dep}`} />
                  </>
                )}
                <Row label="Cabin Class" value={cabinClass?.replace('_', ' ').toUpperCase()} />
                <Row label="Passengers" value={`${passengers?.adults} adult${passengers?.adults > 1 ? 's' : ''}${passengers?.children > 0 ? `, ${passengers.children} child${passengers.children > 1 ? 'ren' : ''}` : ''}`} />
                <Row label="Baggage" value={selectedFlight.baggage} />
                <div className="flex justify-between pt-3 mt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="font-bold text-gray-900 dark:text-white">Total Fare</span>
                  <span className="font-extrabold text-primary text-lg">{formatNGN(flightTotal())}</span>
                </div>
              </div>
            )}

            {/* Hotel summary */}
            {bookingType === 'hotel' && selectedHotel && (
              <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-6">
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Hotel size={18} className="text-primary" /> Hotel Details
                </h3>
                <Row label="Hotel" value={selectedHotel.name} />
                <Row label="Room Type" value={selectedRoomType?.type} />
                <Row label="Check-in" value={hotelCheckIn} />
                <Row label="Check-out" value={hotelCheckOut} />
                <Row label="Rooms" value={String(hotelRooms)} />
                <Row label="Address" value={selectedHotel.address} />
                {selectedHotel.freeCancellation && <Row label="Cancellation" value="✅ Free cancellation" />}
                {selectedHotel.breakfastIncluded && <Row label="Breakfast" value="✅ Included" />}
                <div className="flex justify-between pt-3 mt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
                  <span className="font-extrabold text-primary text-lg">{formatNGN(hotelTotal)}</span>
                </div>
              </div>
            )}

            {/* Pickup summary */}
            {bookingType === 'pickup' && pickupVehicle && (
              <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-6">
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Car size={18} className="text-primary" /> Transfer Details
                </h3>
                <Row label="Vehicle" value={`${pickupVehicle.name} (${pickupVehicle.desc})`} />
                <Row label="Pickup" value={pickupFrom} />
                <Row label="Drop-off" value={pickupTo} />
                <Row label="Date & Time" value={`${pickupDate} at ${pickupTime}`} />
                <Row label="Passengers" value={String(booking.pickupPassengers)} />
                {booking.pickupReturnNeeded && <Row label="Return" value={`${booking.pickupReturnDate} at ${booking.pickupReturnTime}`} />}
                {booking.pickupNotes && <Row label="Notes" value={booking.pickupNotes} />}
                <div className="flex justify-between pt-3 mt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="font-bold text-gray-900 dark:text-white">Estimated Fare</span>
                  <span className="font-extrabold text-primary text-lg">{formatNGN(pickupTotal)}</span>
                </div>
              </div>
            )}

            {/* Passenger details */}
            {passengers_info?.length > 0 && (
              <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-6">
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User size={18} className="text-primary" /> Passenger Details
                </h3>
                {passengers_info.map((p, i) => (
                  <div key={i} className="mb-3 last:mb-0">
                    {passengers_info.length > 1 && <p className="text-xs font-bold text-gray-400 mb-1">Passenger {i + 1}</p>}
                    <Row label="Name" value={`${p.title} ${p.firstName} ${p.lastName}`} />
                    {p.nationality && <Row label="Nationality" value={p.nationality} />}
                    {p.passportNo && <Row label="Passport No." value={p.passportNo} />}
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Row label="Contact Email" value={contact?.email} />
                  <Row label="Contact Phone" value={contact?.phone} />
                </div>
              </div>
            )}

            {/* Total & Trust */}
            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-900 dark:text-white text-lg">Grand Total</span>
                <span className="font-extrabold text-primary text-2xl">{formatNGN(grandTotal)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield size={13} className="text-green-500" />
                Secure booking — your payment is protected by bank-grade encryption
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-all">
              <ArrowLeft size={15} /> Back
            </button>
            <button onClick={() => navigate('/booking/confirmation')}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-primary-gradient shadow-glow hover:shadow-none transition-all hover:scale-[1.02]">
              Confirm & Proceed to Payment <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
