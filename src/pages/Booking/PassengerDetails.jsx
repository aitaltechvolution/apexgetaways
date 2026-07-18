import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, CreditCard, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import SEO from '../../components/SEO'
import { useBooking } from '../../store/BookingContext'
import { formatNGN } from '../../data'

const COUNTRIES = ['Nigeria','Ghana','Kenya','South Africa','UK','USA','Canada','UAE','Germany','France','Other']

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</label>
      {children}
    </div>
  )
}

const iCls = "w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"

export default function PassengerDetailsPage() {
  const { booking, update } = useBooking()
  const navigate = useNavigate()

  const totalPax = (booking.passengers?.adults || 1) + (booking.passengers?.children || 0)
  const numForms = booking.bookingType === 'flight' ? totalPax : 1

  const [contacts, setContacts] = useState(
    Array.from({ length: numForms }, () => ({
      title: 'Mr', firstName: '', lastName: '',
      dob: '', nationality: 'Nigeria',
      passportNo: '', passportExpiry: '',
      email: '', phone: '',
    }))
  )
  const [mainEmail, setMainEmail] = useState('')
  const [mainPhone, setMainPhone] = useState('')
  const [agreedTerms, setAgreedTerms] = useState(false)

  const updateContact = (i, field, val) => {
    setContacts(c => c.map((p, idx) => idx === i ? { ...p, [field]: val } : p))
  }

  const canProceed = contacts.every(c => c.firstName && c.lastName) && mainEmail && mainPhone && agreedTerms

  const proceed = () => {
    update({ passengers_info: contacts, contact: { email: mainEmail, phone: mainPhone } })
    navigate('/booking/review')
  }

  return (
    <>
      <SEO title="Passenger Details" />

      {/* Step indicator */}
      <div className="bg-white dark:bg-card-dark border-b border-gray-100 dark:border-gray-800 pt-20">
        <div className="container-pad py-4">
          <div className="flex items-center gap-3 max-w-md">
            {['Search', 'Select', 'Passengers', 'Review', 'Confirm'].map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i < 2 ? 'bg-green-500 text-white' : i === 2 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}>
                  {i < 2 ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === 2 ? 'text-primary' : i < 2 ? 'text-green-600' : 'text-gray-400'}`}>{s}</span>
                {i < 4 && <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="section-pad bg-surface-light dark:bg-surface-dark">
        <div className="container-pad max-w-3xl mx-auto">
          <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">Passenger Details</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Enter details exactly as they appear on the travel document.</p>

          {contacts.map((contact, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-6 mb-5">
              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">{i + 1}</div>
                {numForms > 1 ? `Passenger ${i + 1}${i === 0 ? ' (Lead)' : ''}` : 'Your Details'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Title">
                  <select value={contact.title} onChange={e => updateContact(i, 'title', e.target.value)} className={iCls}>
                    {['Mr','Mrs','Ms','Dr','Prof'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="First Name *">
                  <input value={contact.firstName} onChange={e => updateContact(i, 'firstName', e.target.value)}
                    placeholder="As on passport" className={iCls} />
                </Field>
                <Field label="Last Name *">
                  <input value={contact.lastName} onChange={e => updateContact(i, 'lastName', e.target.value)}
                    placeholder="As on passport" className={iCls} />
                </Field>
                <Field label="Date of Birth">
                  <input type="date" value={contact.dob} onChange={e => updateContact(i, 'dob', e.target.value)} className={iCls} />
                </Field>
                <Field label="Nationality">
                  <select value={contact.nationality} onChange={e => updateContact(i, 'nationality', e.target.value)} className={iCls}>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                {booking.bookingType === 'flight' && (
                  <>
                    <Field label="Passport / ID Number">
                      <input value={contact.passportNo} onChange={e => updateContact(i, 'passportNo', e.target.value)}
                        placeholder="A12345678" className={iCls} />
                    </Field>
                    <Field label="Passport Expiry">
                      <input type="date" value={contact.passportExpiry} onChange={e => updateContact(i, 'passportExpiry', e.target.value)} className={iCls} />
                    </Field>
                  </>
                )}
              </div>
            </motion.div>
          ))}

          {/* Contact info */}
          <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-6 mb-6">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <Mail size={18} className="text-primary" /> Contact Information
            </h3>
            <p className="text-xs text-gray-400 mb-4">Booking confirmation and e-tickets will be sent to these details.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email Address *">
                <input type="email" value={mainEmail} onChange={e => setMainEmail(e.target.value)}
                  placeholder="you@example.com" className={iCls} />
              </Field>
              <Field label="Phone / WhatsApp *">
                <input value={mainPhone} onChange={e => setMainPhone(e.target.value)}
                  placeholder="+234 800 000 0000" className={iCls} />
              </Field>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 mb-8 cursor-pointer">
            <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              I agree to the <a href="/terms" className="text-primary font-semibold">Terms of Service</a> and <a href="/privacy" className="text-primary font-semibold">Privacy Policy</a>. I confirm that all passenger details are accurate and match the travel documents.
            </span>
          </label>

          <div className="flex gap-3">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-all">
              <ArrowLeft size={15} /> Back
            </button>
            <button onClick={proceed} disabled={!canProceed}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-primary-gradient shadow-glow hover:shadow-none transition-all hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none">
              Review Booking <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
