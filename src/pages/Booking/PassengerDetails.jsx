import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, ArrowRight, ArrowLeft, Upload, CheckCircle, Camera, AlertTriangle, X } from 'lucide-react'
import SEO from '../../components/SEO'
import { useBooking } from '../../store/BookingContext'
import { useAuth } from '../../store/AuthContext'
import { uploadPassport, updateUserDoc } from '../../lib/supabase'
import { StepBar } from './Extras'
import EmptyBookingGuard from '../../components/booking/EmptyBookingGuard'

const TITLES    = ['Mr','Mrs','Ms','Dr','Prof','Engr']
const COUNTRIES = ['Nigeria','Ghana','Kenya','South Africa','Egypt','United Kingdom','United States','Canada','UAE','Germany','France','Italy','India','China','Australia','Other']
const GENDERS   = ['Male','Female']
const MEALS     = ['Standard','Vegetarian','Vegan','Halal','Kosher','Child','None']

function isPassportExpiring(expiry, travelDate) {
  if (!expiry || !travelDate) return false
  const exp   = new Date(expiry)
  const travel = new Date(travelDate)
  travel.setMonth(travel.getMonth() + 6)
  return exp < travel
}

function PassengerForm({ index, data, onChange, isLead, travelDate }) {
  const [uploading, setUploading] = useState(false)
  const { user } = useAuth()
  const fileRef = useRef(null)

  const F = (label, field, props = {}) => (
    <div>
      <label className="block text-[13px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#4B5563' }}>{label}{props.required && ' *'}</label>
      <input value={data[field] || ''} onChange={e => onChange(field, e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-base text-primary focus:outline-none transition-all"
        style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}
        onFocus={e => e.target.style.borderColor = '#C9A84C'}
        onBlur={e => e.target.style.borderColor = '#E5E7EB'}
        {...props} />
    </div>
  )

  const Sel = (label, field, options) => (
    <div>
      <label className="block text-[13px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#4B5563' }}>{label}</label>
      <select value={data[field] || ''} onChange={e => onChange(field, e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-base text-primary focus:outline-none transition-all"
        style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', appearance: 'none' }}>
        {options.map(o => <option key={o} value={o} style={{ background: '#FFFFFF' }}>{o}</option>)}
      </select>
    </div>
  )

  const handlePassportUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const url = await uploadPassport(user.uid, file)
      onChange('passportUrl', url)
      if (isLead) await updateUserDoc(user.uid, { passportUrl: url })
    } finally { setUploading(false) }
  }

  const passportWarn = isPassportExpiring(data.passportExpiry, travelDate)

  return (
    <div className="p-6 rounded-2xl space-y-5" style={{ background:'#FFFFFF', border:'1px solid rgba(201,168,76,0.2)', boxShadow:'0 4px 20px rgba(10,22,40,0.06)' }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-base" style={{ background: 'linear-gradient(135deg,#C9A84C,#F5C842)', color: '#0A1628' }}>{index + 1}</div>
        <div>
          <p className="font-bold text-primary">{isLead ? 'Lead Passenger' : `Passenger ${index + 1}`}</p>
          <p className="text-sm" style={{ color: '#4B5563' }}>Details must match international passport exactly</p>
        </div>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Sel('Title', 'title', TITLES)}
        {F('First Name', 'firstName', { required: true, placeholder: 'As on passport' })}
        {F('Middle Name', 'middleName', { placeholder: 'Optional' })}
        {F('Last Name', 'lastName', { required: true, placeholder: 'As on passport' })}
      </div>

      {/* Personal details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {F('Date of Birth', 'dob', { type: 'date', required: true })}
        {Sel('Gender', 'gender', GENDERS)}
        {Sel('Nationality', 'nationality', COUNTRIES)}
      </div>

      {/* Passport */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {F('Passport / ID Number', 'passportNo', { required: true, placeholder: 'A12345678' })}
        <div>
          {F('Passport Expiry', 'passportExpiry', { type: 'date', required: true })}
          {passportWarn && (
            <p className="mt-1.5 text-sm flex items-center gap-1" style={{ color: '#f59e0b' }}>
              <AlertTriangle size={11} /> Passport expires within 6 months of travel
            </p>
          )}
        </div>
        {F('Frequent Flyer No.', 'frequentFlyer', { placeholder: 'Optional' })}
      </div>

      {/* Passport upload */}
      <div className="p-4 rounded-xl" style={{ background: '#F3F4F6', border: '1px dashed #E5E7EB' }}>
        <p className="text-sm font-bold text-primary mb-2"> Passport Scan / Photo (optional but recommended)</p>
        <p className="text-sm mb-3" style={{ color: '#4B5563' }}>Upload a clear scan or photo of the passport data page. This helps our team process your ticket faster.</p>
        {data.passportUrl ? (
          <div className="flex items-center gap-3">
            <CheckCircle size={16} style={{ color: '#22c55e' }} />
            <span className="text-base text-green-700 font-semibold">Passport uploaded</span>
            <button onClick={() => onChange('passportUrl', '')} className="text-sm text-red-600 underline ml-auto">Remove</button>
          </div>
        ) : (
          <div>
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handlePassportUpload} />
            <button type="button" onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C' }}>
              {uploading ? <><span className="animate-spin"></span> Uploading…</> : <><Upload size={13} /> Upload Passport</>}
            </button>
          </div>
        )}
      </div>

      {/* Contact info for lead passenger */}
      {isLead && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2" style={{ borderTop: '1px solid #F3F4F6' }}>
          <div className="sm:col-span-2">
            <p className="text-sm font-bold text-primary mb-3"> Contact Information (lead passenger)</p>
          </div>
          {F('Email Address', 'email', { type: 'email', required: true, placeholder: 'you@example.com' })}
          {F('Phone / WhatsApp', 'phone', { required: true, placeholder: '+234 800 000 0000' })}
          {F('Alternative Phone', 'altPhone', { placeholder: 'Optional' })}
          {Sel('Meal Preference', 'mealPref', MEALS)}
        </div>
      )}

      {!isLead && Sel('Meal Preference', 'mealPref', MEALS)}
    </div>
  )
}

export default function PassengerDetailsPage() {
  const { booking, update } = useBooking()
  const navigate = useNavigate()
  const { user, userDoc } = useAuth()

  const totalPax = (booking.passengers?.adults || 1) + (booking.passengers?.children || 0)
  const travelDate = booking.segments?.[0]?.date || ''

  const [passengers, setPassengers] = useState(() =>
    Array.from({ length: totalPax }, (_, i) => ({
      title: 'Mr', firstName: '', middleName: '', lastName: '',
      dob: '', gender: 'Male', nationality: 'Nigeria',
      passportNo: '', passportExpiry: '', passportUrl: '',
      frequentFlyer: '', mealPref: booking.addons?.mealPref || 'Standard',
      email: i === 0 ? (user?.email || '') : '',
      phone: i === 0 ? (userDoc?.phone || '') : '',
      altPhone: '',
      // Pre-fill lead from userDoc
      ...(i === 0 && userDoc ? {
        firstName: userDoc.displayName?.split(' ')[0] || '',
        lastName:  userDoc.displayName?.split(' ').slice(-1)[0] || '',
        nationality: userDoc.nationality || 'Nigeria',
        passportNo: userDoc.passportNo || '',
        passportExpiry: userDoc.passportExpiry || '',
        passportUrl: userDoc.passportUrl || '',
        dob: userDoc.dob || '',
      } : {}),
      ...((booking.passengers_info?.[i]) || {}),
    }))
  )
  const [agreed, setAgreed] = useState(false)

  if (!booking.bookingType) return <EmptyBookingGuard show={true} />

  const update1 = (i, field, val) =>
    setPassengers(p => p.map((px, idx) => idx === i ? { ...px, [field]: val } : px))

  const canProceed = passengers.every(p => p.firstName && p.lastName && p.passportNo) && agreed

  const proceed = () => {
    update({
      passengers_info: passengers,
      contact: { name: `${passengers[0].firstName} ${passengers[0].lastName}`, email: passengers[0].email, phone: passengers[0].phone, altPhone: passengers[0].altPhone },
    })
    // Also save to user profile
    if (user && passengers[0]) {
      updateUserDoc(user.uid, {
        phone: passengers[0].phone,
        nationality: passengers[0].nationality,
        passportNo: passengers[0].passportNo,
        passportExpiry: passengers[0].passportExpiry,
        passportUrl: passengers[0].passportUrl,
        dob: passengers[0].dob,
        profileComplete: true,
      }).catch(() => {})
    }
    navigate('/booking/review')
  }

  return (
    <>
      <SEO title="Passenger Details" />
      <StepBar step={2} />

      <section className="py-10" style={{ background: '#F8F6F2', minHeight: '80vh' }}>
        <div className="container-pad max-w-4xl mx-auto">
          <h1 className="font-display font-bold text-primary text-2xl mb-2">Passenger Details</h1>
          <p className="text-base mb-8" style={{ color: '#4B5563' }}>
            Enter details <strong className="text-gold">exactly as they appear on the passport</strong>. Incorrect information may result in denied boarding.
          </p>

          {userDoc && !userDoc.passportNo && (
            <div className="mb-6 p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <AlertTriangle size={18} style={{ color: '#f59e0b' }} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-base font-bold" style={{ color: '#f59e0b' }}>Complete Your Profile</p>
                <p className="text-sm mt-0.5" style={{ color: '#374151' }}>Add your passport details to your profile to speed up future bookings.</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {passengers.map((p, i) => (
              <PassengerForm key={i} index={i} data={p} onChange={(f, v) => update1(i, f, v)}
                isLead={i === 0} travelDate={travelDate} />
            ))}
          </div>

          <label className="flex items-start gap-3 mt-6 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5" />
            <span className="text-base" style={{ color: '#374151' }}>
              I confirm all passenger details are accurate and match the travel documents. I agree to the{' '}
              <a href="/terms" className="underline" style={{ color: '#C9A84C' }}>Terms & Conditions</a> and{' '}
              <a href="/privacy" className="underline" style={{ color: '#C9A84C' }}>Privacy Policy</a>.
            </span>
          </label>

          <div className="flex gap-3 mt-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-base font-bold border-2 transition-all" style={{ borderColor: '#E5E7EB', color: '#1F2937' }}>
              <ArrowLeft size={14} /> Back
            </button>
            <button onClick={proceed} disabled={!canProceed}
              className="flex-1 btn-gold py-3.5 flex items-center justify-center gap-2 font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed">
              Continue — Review Booking <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
