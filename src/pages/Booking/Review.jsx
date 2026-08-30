import { useNavigate } from 'react-router-dom'
import { Plane, Hotel, Car, User, Mail, Phone, Luggage, Shield, ArrowLeft, ArrowRight, CheckCircle, Clock } from 'lucide-react'
import SEO from '../../components/SEO'
import { useBooking } from '../../store/BookingContext'
import { formatNGN } from '../../data'
import { StepBar } from './Extras'
import EmptyBookingGuard from '../../components/booking/EmptyBookingGuard'

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex justify-between py-2 text-base" style={{ borderBottom: '1px solid #F3F4F6' }}>
      <span style={{ color: '#4B5563' }}>{label}</span>
      <span className="font-semibold text-primary text-right max-w-[60%]">{value}</span>
    </div>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="p-5 rounded-2xl" style={{ background:'#FFFFFF', border:'1px solid rgba(201,168,76,0.2)', boxShadow:'0 4px 20px rgba(10,22,40,0.06)' }}>
      <h3 className="font-bold text-base text-primary mb-4 flex items-center gap-2">
        {Icon && <Icon size={15} style={{ color: '#C9A84C' }} />}{title}
      </h3>
      {children}
    </div>
  )
}

export default function ReviewPage() {
  const { booking, getFareBreakdown } = useBooking()
  const navigate = useNavigate()
  const fd = getFareBreakdown()

  if (!booking.bookingType) return <EmptyBookingGuard show={true} />

  const {
    bookingType, selectedFlight, selectedReturnFlight,
    selectedSeats, selectedReturnSeats, cabinClass,
    baggage, addons, passengers_info, contact,
    selectedHotel, selectedRoomType, hotelCheckIn, hotelCheckOut, hotelRooms,
    pickupVehicle, pickupFrom, pickupTo, pickupDate, pickupTime,
  } = booking

  const extras = (bookingType === 'flight' ? (baggage?.outbound?.price || 0) + (baggage?.return?.price || 0) : 0) + (addons?.insurance ? 15000 : 0)
  const grandTotal = fd ? fd.total + extras : 0

  return (
    <>
      <SEO title="Review Booking" />
      <StepBar step={3} />

      <section className="py-10" style={{ background: '#F8F6F2', minHeight: '80vh' }}>
        <div className="container-pad max-w-4xl mx-auto">
          <h1 className="font-display font-bold text-primary text-2xl mb-2">Review Your Booking</h1>
          <p className="text-base mb-8" style={{ color: '#4B5563' }}>
            Check all details carefully before payment. Changes after payment may incur fees.
          </p>

          <div className="space-y-4">
            {/* Flight */}
            {bookingType === 'flight' && selectedFlight && (
              <Section title="Flight Details" icon={Plane}>
                <Row label="Trip Type" value={booking.flightType === 'roundTrip' ? 'Round Trip' : booking.flightType === 'oneWay' ? 'One Way' : 'Multi-City'} />
                <Row label="Outbound" value={`${selectedFlight.airline} ${selectedFlight.flightNo} · ${selectedFlight.from} → ${selectedFlight.to}`} />
                <Row label="Departs" value={`${selectedFlight.date} at ${selectedFlight.dep}`} />
                <Row label="Arrives" value={selectedFlight.arr} />
                {selectedReturnFlight && <>
                  <Row label="Return" value={`${selectedReturnFlight.airline} ${selectedReturnFlight.flightNo} · ${selectedReturnFlight.from} → ${selectedReturnFlight.to}`} />
                  <Row label="Return Departs" value={`${selectedReturnFlight.date} at ${selectedReturnFlight.dep}`} />
                </>}
                <Row label="Cabin" value={cabinClass?.replace('_', ' ').toUpperCase()} />
                <Row label="Seats" value={[...(selectedSeats || []), ...(selectedReturnSeats || [])].join(', ') || 'Airline assigned'} />
                <Row label="Baggage" value={baggage?.outbound?.label || '—'} />
                {baggage?.return && <Row label="Return Baggage" value={baggage.return.label} />}
                <Row label="Meal" value={addons?.mealPref} />
                <Row label="Insurance" value={addons?.insurance ? 'Included' : 'Not added'} />
              </Section>
            )}

            {/* Hotel */}
            {bookingType === 'hotel' && selectedHotel && (
              <Section title="Hotel Details" icon={Hotel}>
                <Row label="Hotel" value={selectedHotel.name} />
                <Row label="Room" value={selectedRoomType?.type} />
                <Row label="Check-in" value={hotelCheckIn} />
                <Row label="Check-out" value={hotelCheckOut} />
                <Row label="Rooms" value={String(hotelRooms)} />
                <Row label="Free Cancel" value={selectedHotel.freeCancellation ? 'Yes' : 'No'} />
              </Section>
            )}

            {/* Pickup */}
            {bookingType === 'pickup' && pickupVehicle && (
              <Section title="Transfer Details" icon={Car}>
                <Row label="Vehicle" value={`${pickupVehicle.name} (${pickupVehicle.desc})`} />
                <Row label="From" value={pickupFrom} />
                <Row label="To" value={pickupTo} />
                <Row label="Date & Time" value={`${pickupDate} at ${pickupTime}`} />
              </Section>
            )}

            {/* Passengers */}
            {passengers_info?.length > 0 && (
              <Section title={`Passengers (${passengers_info.length})`} icon={User}>
                {passengers_info.map((p, i) => (
                  <div key={i} className={i > 0 ? 'mt-4 pt-4' : ''} style={i > 0 ? { borderTop: '1px solid #F3F4F6' } : {}}>
                    {passengers_info.length > 1 && (
                      <p className="text-[13px] font-bold mb-2" style={{ color: '#C9A84C' }}>
                        {i === 0 ? 'Lead Passenger' : `Passenger ${i + 1}`}
                      </p>
                    )}
                    <Row label="Name" value={`${p.title || ''} ${p.firstName} ${p.middleName || ''} ${p.lastName}`.trim()} />
                    <Row label="DOB" value={p.dob} />
                    <Row label="Passport" value={p.passportNo} />
                    <Row label="Expiry" value={p.passportExpiry} />
                    <Row label="Nationality" value={p.nationality} />
                    {p.passportUrl && <Row label="Scan" value="Uploaded" />}
                  </div>
                ))}
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                  <Row label="Email" value={contact?.email} />
                  <Row label="Phone" value={contact?.phone} />
                </div>
              </Section>
            )}

            {/* Price breakdown */}
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <h3 className="font-bold text-primary mb-4">Price Breakdown</h3>
              {fd && bookingType === 'flight' && (<>
                <Row label={`Base fare — ${fd.pax.adults} adult${fd.pax.adults > 1 ? 's' : ''}`} value={formatNGN(fd.adultTotal)} />
                {fd.pax.children > 0 && <Row label={`${fd.pax.children} child${fd.pax.children > 1 ? 'ren' : ''} (75%)`} value={formatNGN(fd.childTotal)} />}
                {fd.pax.infants  > 0 && <Row label={`${fd.pax.infants} infant${fd.pax.infants > 1 ? 's' : ''} (10%)`} value={formatNGN(fd.infantTotal)} />}
                <Row label="Taxes & surcharges (7.5%)" value={formatNGN(fd.taxes)} />
              </>)}
              {fd && bookingType === 'hotel' && (
                <Row label={`${formatNGN(fd.perNight)} × ${fd.nights} night${fd.nights > 1 ? 's' : ''} × ${fd.rooms} room${fd.rooms > 1 ? 's' : ''}`} value={formatNGN(fd.subtotal)} />
              )}
              {fd && bookingType === 'pickup' && (
                <Row label={pickupVehicle?.name ? `${pickupVehicle.name}${booking.pickupReturnNeeded ? ' (round trip)' : ''}` : 'Transfer'} value={formatNGN(fd.subtotal)} />
              )}
              {(baggage?.outbound?.price || 0) > 0 && (
                <Row label="Baggage fee" value={formatNGN((baggage?.outbound?.price || 0) + (baggage?.return?.price || 0))} />
              )}
              {addons?.insurance && <Row label="Travel insurance" value={formatNGN(15000)} />}
              <div className="flex justify-between pt-3 mt-2 font-bold text-lg" style={{ borderTop: '1px solid rgba(201,168,76,0.25)' }}>
                <span className="text-primary">Total</span>
                <span style={{ color: '#C9A84C' }}>{formatNGN(grandTotal)}</span>
              </div>
            </div>

            {/* Payment notice */}
            <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <Shield size={16} className="shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
              <div>
                <p className="text-base font-bold" style={{ color: '#16803d' }}>Secured by Paystack</p>
                <p className="text-sm mt-0.5" style={{ color: '#4B5563' }}>
                  Card details are encrypted and never stored on our servers.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-base font-bold border-2 transition-all"
              style={{ borderColor: '#E5E7EB', color: '#374151' }}>
              <ArrowLeft size={14} /> Back
            </button>
            <button onClick={() => navigate('/booking/payment')}
              className="flex-1 btn-gold py-3.5 flex items-center justify-center gap-2 font-bold text-base">
              Pay {formatNGN(grandTotal)} <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
