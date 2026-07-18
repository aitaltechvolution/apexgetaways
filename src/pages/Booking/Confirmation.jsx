import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Share2, Phone, Mail, Calendar } from 'lucide-react'
import SEO from '../../components/SEO'
import { useBooking } from '../../store/BookingContext'

export default function ConfirmationPage() {
  const { booking, reset } = useBooking()
  const ref = `AGT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`

  useEffect(() => {
    return () => {}
  }, [])

  return (
    <>
      <SEO title="Booking Confirmed" />
      <section className="min-h-screen bg-surface-light dark:bg-surface-dark pt-24 pb-16 flex items-center">
        <div className="container-pad max-w-2xl mx-auto">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.4 }}
            className="text-center mb-10">
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={52} className="text-green-500" />
            </div>
            <h1 className="font-extrabold text-3xl text-gray-900 dark:text-white mb-2">Booking Request Received!</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Our team will review your booking and contact you within <strong>2 hours</strong> with confirmation and payment instructions.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-7 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 dark:text-white">Booking Reference</h2>
              <span className="font-extrabold text-xl text-primary tracking-widest">{ref}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center mb-5">
              <p className="text-xs text-gray-400 mb-1">Save this reference number</p>
              <p className="font-extrabold text-2xl text-primary tracking-widest">{ref}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail size={15} className="text-primary shrink-0" />
                A confirmation email will be sent to <strong>{booking.contact?.email || 'your email'}</strong>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone size={15} className="text-primary shrink-0" />
                Our team will call <strong>{booking.contact?.phone || 'your phone'}</strong> within 2 hours
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Calendar size={15} className="text-primary shrink-0" />
                Office hours: Monday–Friday 8am–6pm · Saturday 9am–3pm
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="bg-primary/5 rounded-2xl border border-primary/20 p-5 mb-8 text-sm text-gray-600 dark:text-gray-400">
            <p className="font-bold text-gray-900 dark:text-white mb-2">What happens next?</p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Our agent reviews your booking and checks availability</li>
              <li>We contact you via phone and email with final pricing</li>
              <li>You make payment (bank transfer, card, or instalment plan)</li>
              <li>We send your e-tickets and travel documents</li>
            </ol>
          </motion.div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" onClick={reset}
              className="px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-primary-gradient shadow-glow hover:shadow-none transition-all hover:scale-105">
              Back to Home
            </Link>
            <Link to="/contact"
              className="px-7 py-3.5 rounded-xl font-bold text-sm border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
