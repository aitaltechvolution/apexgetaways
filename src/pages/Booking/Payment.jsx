import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Lock, CreditCard, ArrowLeft, CheckCircle, RefreshCcw } from 'lucide-react'
import SEO from '../../components/SEO'
import { useBooking } from '../../store/BookingContext'
import { useAuth } from '../../store/AuthContext'
import { saveBooking, initPaystack, BOOKING_STATUSES } from '../../lib/firebase'
import { formatNGN } from '../../data'
import { StepBar } from './Extras'

export default function PaymentPage() {
  const { booking, update, getFareBreakdown, reset } = useBooking()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fd = getFareBreakdown()
  const extras = (booking.baggage?.outbound?.price || 0) + (booking.baggage?.return?.price || 0) + (booking.addons?.insurance ? 15000 : 0)
  const grandTotal = fd ? fd.total + extras : 0
  const email = booking.contact?.email || user?.email || ''

  const handlePaystack = async () => {
    if (!email) { setError('Email address is required for payment.'); return }
    setLoading(true); setError('')

    // 1. Save booking as pending_payment first
    let bookingId, orderRef
    try {
      const result = await saveBooking(user?.uid || 'guest', {
        ...booking,
        total: grandTotal,
        currency: 'NGN',
      })
      bookingId = result.id
      orderRef  = result.orderRef
      update({ orderId: bookingId, orderRef })
    } catch (e) {
      // Demo: generate fake IDs
      bookingId = `demo_${Date.now()}`
      orderRef  = `APX-${Date.now().toString(36).toUpperCase().slice(-6)}`
      update({ orderId: bookingId, orderRef })
    }

    // 2. Open Paystack
    const paystackRef = `${orderRef}-${Date.now()}`
    initPaystack({
      email,
      amount: grandTotal,
      ref: paystackRef,
      metadata: {
        orderRef, bookingType: booking.bookingType,
        passengerName: booking.contact?.name || '',
        phone: booking.contact?.phone || '',
      },
      onSuccess: async (res) => {
        // 3. Mark as payment_received
        try {
          const { updateBooking } = await import('../../lib/firebase')
          await updateBooking(bookingId, {
            status: BOOKING_STATUSES.PAYMENT_RECEIVED,
            paymentRef: res.reference,
          })
        } catch {}
        update({ paymentRef: res.reference })
        setLoading(false)
        navigate('/booking/confirmation')
      },
      onClose: () => { setLoading(false); setError('Payment was cancelled. Click "Pay Now" to try again.') },
    })
  }

  return (
    <>
      <SEO title="Secure Payment" />
      <StepBar step={4} />

      <section className="py-10" style={{ background: '#070D1A', minHeight: '80vh' }}>
        <div className="container-pad max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-white text-2xl mb-2">Secure Payment</h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>Complete your booking with Paystack — Nigeria's most trusted payment gateway.</p>

          {/* Order summary */}
          <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <h2 className="font-bold text-white mb-4">Order Summary</h2>
            {booking.selectedFlight && (
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <span className="text-2xl">{booking.selectedFlight.logo}</span>
                <div>
                  <p className="font-semibold text-sm text-white">{booking.selectedFlight.airline} · {booking.selectedFlight.flightNo}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{booking.selectedFlight.from} → {booking.selectedFlight.to} · {booking.selectedFlight.date}</p>
                  {booking.selectedReturnFlight && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>+ Return: {booking.selectedReturnFlight.from} → {booking.selectedReturnFlight.to}</p>}
                </div>
              </div>
            )}
            <div className="space-y-2 text-sm">
              {fd && <>
                <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.5)' }}><span>Fare subtotal</span><span>{formatNGN(fd.subtotal)}</span></div>
                <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.5)' }}><span>Taxes & fees</span><span>{formatNGN(fd.taxes)}</span></div>
              </>}
              {extras > 0 && <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.5)' }}><span>Extras</span><span>{formatNGN(extras)}</span></div>}
              <div className="flex justify-between font-bold text-xl pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="text-white">Total Due</span>
                <span style={{ color: '#C9A84C' }}>{formatNGN(grandTotal)}</span>
              </div>
            </div>
            <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Reference: {booking.orderRef || 'Will be generated after payment'}</p>
          </div>

          {/* Contact for receipt */}
          <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs font-bold text-white mb-1">Receipt will be sent to:</p>
            <p className="text-sm" style={{ color: '#C9A84C' }}>{email || 'No email set'}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{booking.contact?.phone}</p>
          </div>

          {/* Security badges */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Lock, label: '256-bit SSL', sub: 'Encrypted' },
              { icon: Shield, label: 'Paystack', sub: 'Secured' },
              { icon: CheckCircle, label: 'PCI DSS', sub: 'Compliant' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Icon size={18} style={{ color: '#22c55e' }} />
                <p className="text-xs font-bold text-white">{label}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Payment methods accepted */}
          <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold text-white mb-3">Accepted Payment Methods</p>
            <div className="flex flex-wrap gap-2">
              {[' Debit/Credit Card', ' Bank Transfer', ' USSD', ' Bank Account', ' QR Code'].map(m => (
                <span key={m} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' }}>{m}</span>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-4 rounded-xl text-sm font-bold border-2 transition-all" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
              <ArrowLeft size={14} /> Back
            </button>
            <motion.button onClick={handlePaystack} disabled={loading || grandTotal <= 0}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50 text-navy"
              style={{ background: loading ? 'rgba(201,168,76,0.5)' : 'linear-gradient(135deg,#C9A84C,#F5C842)' }}>
              {loading ? <><RefreshCcw size={16} className="animate-spin"/> Processing…</> : <><Lock size={16}/> Pay {formatNGN(grandTotal)} Now</>}
            </motion.button>
          </div>

          <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
            By completing payment you agree to our Terms & Conditions. Your e-ticket will be issued within 2-4 hours.
          </p>
        </div>
      </section>
    </>
  )
}
