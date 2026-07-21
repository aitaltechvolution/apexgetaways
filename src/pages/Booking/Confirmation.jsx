import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Plane, Hotel, Car, Mail, Phone, Clock, ArrowRight, Luggage, Shield } from 'lucide-react'
import SEO from '../../components/SEO'
import { useBooking } from '../../store/BookingContext'
import { formatNGN, BRAND } from '../../data'
import { StepBar } from './Extras'
import confetti from 'canvas-confetti'

function InfoRow({ label, value, icon: Icon }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      {Icon && <Icon size={13} className="shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />}
      <span className="text-xs w-28 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      <span className="text-xs font-semibold text-white flex-1">{value}</span>
    </div>
  )
}

export default function ConfirmationPage() {
  const { booking, reset, getFareBreakdown } = useBooking()
  const fired = useRef(false)

  useEffect(() => {
    if (!fired.current) {
      fired.current = true
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.55 }, colors: ['#C9A84C', '#F5C842', '#ffffff', '#0A1628'] })
    }
  }, [])

  const { orderRef, bookingType, selectedFlight, selectedReturnFlight,
    selectedSeats, selectedReturnSeats, contact, passengers_info,
    baggage, addons, paymentRef } = booking

  const fd = getFareBreakdown?.()
  const extras = (baggage?.outbound?.price || 0) + (baggage?.return?.price || 0) + (addons?.insurance ? 15000 : 0)
  const total = fd ? fd.total + extras : 0

  const TypeIcon = bookingType === 'hotel' ? Hotel : bookingType === 'pickup' ? Car : Plane

  return (
    <>
      <SEO title="Booking Confirmed" />
      <StepBar step={5} />

      <section className="py-12" style={{ background: '#070D1A', minHeight: '80vh' }}>
        <div className="container-pad max-w-2xl mx-auto">

          {/* Success header */}
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }} className="text-center mb-10">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.25)' }}>
              <CheckCircle size={44} style={{ color: '#22c55e' }} />
            </div>
            <h1 className="font-display font-bold text-white text-3xl mb-2">Payment Confirmed</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Your booking is confirmed. Your e-ticket will be issued within <strong className="text-gold">2–4 hours</strong>.
            </p>
          </motion.div>

          {/* Booking reference */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl mb-5 text-center"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Booking Reference</p>
            <p className="font-display font-bold tracking-widest mb-1" style={{ fontSize: '2.2rem', color: '#C9A84C' }}>
              {orderRef || 'APX-DEMO'}
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Payment ref: {paymentRef || 'demo_ref'}</p>
            {total > 0 && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <CheckCircle size={15} style={{ color: '#22c55e' }} />
                <span className="text-sm font-bold text-green-400">{formatNGN(total)} — Payment Received</span>
              </div>
            )}
          </motion.div>

          {/* Trip summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl mb-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <TypeIcon size={16} style={{ color: '#C9A84C' }} /> Trip Summary
            </h2>
            {selectedFlight && (
              <div>
                <InfoRow label="Airline" value={`${selectedFlight.airline} ${selectedFlight.flightNo}`} icon={Plane} />
                <InfoRow label="Outbound" value={`${selectedFlight.from} → ${selectedFlight.to} · ${selectedFlight.date} · Departs ${selectedFlight.dep}`} />
                {selectedReturnFlight && <InfoRow label="Return" value={`${selectedReturnFlight.from} → ${selectedReturnFlight.to} · ${selectedReturnFlight.date}`} />}
                {(selectedSeats?.length > 0 || selectedReturnSeats?.length > 0) && (
                  <InfoRow label="Seats" value={[...(selectedSeats || []), ...(selectedReturnSeats || [])].join(', ')} icon={Plane} />
                )}
                {baggage?.outbound && <InfoRow label="Baggage" value={baggage.outbound.label} icon={Luggage} />}
                {addons?.insurance && <InfoRow label="Insurance" value="Travel insurance included" icon={Shield} />}
              </div>
            )}
            {passengers_info?.length > 0 && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {passengers_info.map((p, i) => (
                  <InfoRow key={i}
                    label={i === 0 ? 'Lead Passenger' : `Passenger ${i + 1}`}
                    value={`${p.title || ''} ${p.firstName} ${p.lastName} · ${p.passportNo}`} />
                ))}
              </div>
            )}
          </motion.div>

          {/* What happens next */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={16} style={{ color: '#C9A84C' }} /> What Happens Next
            </h2>
            <ol className="space-y-3">
              {[
                ['Within 2–4 hrs', 'Our team processes your booking and issues your e-ticket'],
                ['By email', `Confirmation with PNR and ticket PDF sent to ${contact?.email || 'your email'}`],
                ['By phone', `Our agent may call ${contact?.phone || 'your number'} to confirm`],
                ['Before departure', 'Use your PNR to check in online with the airline'],
              ].map(([time, text], i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg,#C9A84C,#F5C842)', color: '#0A1628' }}>{i + 1}</span>
                  <div>
                    <span className="text-xs font-bold" style={{ color: '#C9A84C' }}>{time} — </span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{text}</span>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="p-4 rounded-2xl mb-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold text-white mb-3">Need Help?</p>
            <div className="flex flex-wrap gap-2">
              <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}>
                <Phone size={12} />{BRAND.phone}
              </a>
              <a href={`https://wa.me/${BRAND.whatsapp.replace('+', '')}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                style={{ background: '#25D366' }}>
                <Phone size={12} /> WhatsApp
              </a>
              <a href={`mailto:${BRAND.email}?subject=Booking ${orderRef}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                <Mail size={12} />{BRAND.email}
              </a>
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/dashboard" onClick={reset} className="btn-gold px-8 py-3.5">View My Bookings</Link>
            <Link to="/" onClick={reset} className="btn-outline-gold px-8 py-3.5">Back to Home</Link>
          </div>
        </div>
      </section>
    </>
  )
}
