import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plane, Hotel, Car, Clock, CheckCircle, XCircle, AlertCircle,
  LogOut, Upload, User, Settings, Phone, Mail, Shield,
  ChevronDown, ChevronUp, Plus, Eye, Edit3
} from 'lucide-react'
import SEO from '../../components/SEO'
import { useAuth } from '../../store/AuthContext'
import { subscribeUserBookings, updateUserDoc, uploadPassport } from '../../lib/supabase'
import { formatNGN, BRAND } from '../../data'

const STATUS_CFG = {
  pending_payment:  { label: 'Pending Payment',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  Icon: Clock },
  payment_received: { label: 'Payment Received', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  Icon: CheckCircle },
  processing:       { label: 'Processing',       color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', Icon: AlertCircle },
  tickets_issued:   { label: 'Ticket Issued',    color: '#34d399', bg: 'rgba(52,211,153,0.12)',  Icon: CheckCircle },
  confirmed:        { label: 'Confirmed',        color: '#34d399', bg: 'rgba(52,211,153,0.12)',  Icon: CheckCircle },
  cancelled:        { label: 'Cancelled',        color: '#f87171', bg: 'rgba(248,113,113,0.12)', Icon: XCircle },
  refunded:         { label: 'Refunded',         color: '#9ca3af', bg: 'rgba(156,163,175,0.12)', Icon: CheckCircle },
}

function StatusBadge({ status }) {
  const s = STATUS_CFG[status] || STATUS_CFG.pending_payment
  const { Icon } = s
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-bold"
      style={{ background: s.bg, color: s.color }}>
      <Icon size={11} />{s.label}
    </span>
  )
}

function BookingCard({ booking }) {
  const [expanded, setExpanded] = useState(false)
  const TypeIcon = booking.bookingType === 'hotel' ? Hotel : booking.bookingType === 'pickup' ? Car : Plane
  const isActive = !['cancelled', 'refunded'].includes(booking.status)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(10,22,40,0.05)' }}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: isActive ? 'rgba(201,168,76,0.12)' : '#F3F4F6' }}>
              <TypeIcon size={18} style={{ color: isActive ? '#C9A84C' : '#6B7280' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-bold text-primary text-base capitalize">{booking.bookingType} Booking</span>
                <StatusBadge status={booking.status} />
              </div>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Ref: <span className="font-bold" style={{ color: '#C9A84C' }}>{booking.orderRef || booking.id?.slice(0, 10).toUpperCase()}</span>
              </p>
              {booking.selectedFlight && (
                <p className="text-sm mt-0.5" style={{ color: '#374151' }}>
                  {booking.selectedFlight.from} → {booking.selectedFlight.to} · {booking.selectedFlight.date}
                </p>
              )}
              <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>
                {booking.createdAt?.seconds
                  ? new Date(booking.createdAt.seconds * 1000).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Recently'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {booking.total > 0 && <p className="font-bold text-base" style={{ color: '#C9A84C' }}>{formatNGN(booking.total)}</p>}
            <button onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
              style={{ color: '#4B5563' }}>
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 space-y-1.5 text-sm overflow-hidden" style={{ borderTop: '1px solid #F3F4F6' }}>
            {booking.passengers_info?.[0] && (
              <p style={{ color: '#374151' }}>
                Passenger: {booking.passengers_info[0].firstName} {booking.passengers_info[0].lastName} · {booking.passengers_info[0].passportNo}
              </p>
            )}
            {booking.selectedSeats?.length > 0 && <p style={{ color: '#374151' }}>Seats: {booking.selectedSeats.join(', ')}</p>}
            {booking.baggage?.outbound && <p style={{ color: '#374151' }}>Baggage: {booking.baggage.outbound.label}</p>}
            {booking.addons?.insurance && <p style={{ color: '#374151' }}>Travel insurance included</p>}
            {booking.paymentRef && <p style={{ color: '#4B5563' }}>Payment: {booking.paymentRef}</p>}
            {booking.pnr && <p className="font-bold" style={{ color: '#22c55e' }}>PNR: {booking.pnr}</p>}
            {booking.adminNotes && <p style={{ color: '#60a5fa' }}>Note: {booking.adminNotes}</p>}
            {(booking.status === 'confirmed' || booking.status === 'tickets_issued') && (
              <a href={booking.ticketUrl || '#'} className="inline-flex items-center gap-1.5 mt-2 px-3 py-2 rounded-lg text-sm font-bold"
                style={{ background: 'linear-gradient(135deg,#C9A84C,#F5C842)', color: '#0A1628' }}>
                <Eye size={12} /> View Ticket
              </a>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function ProfileTab({ userDoc, user }) {
  const [form, setForm] = useState({
    displayName: '', phone: '', nationality: '', dob: '',
    address: '', passportNo: '', passportExpiry: '', ...userDoc
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const iSt = {
    width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '0.8rem',
    background: '#F3F4F6', border: '1px solid #E5E7EB',
    color: '#111827', outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif',
  }
  const foc = e => { e.target.style.borderColor = '#C9A84C' }
  const blr = e => { e.target.style.borderColor = '#E5E7EB' }

  const save = async () => {
    setSaving(true)
    await updateUserDoc(user.uid, form).catch(() => {})
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePassport = async e => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    const url = await uploadPassport(user.uid, file).catch(() => null)
    if (url) set('passportUrl', url)
    setUploading(false)
  }

  const F = (label, field, props = {}) => (
    <div>
      <label className="block text-[12px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#6B7280' }}>{label}</label>
      <input value={form[field] || ''} onChange={e => set(field, e.target.value)} style={iSt} onFocus={foc} onBlur={blr} {...props}/>
    </div>
  )

  return (
    <div className="p-6 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(10,22,40,0.05)' }}>
      <h2 className="font-display font-bold text-primary text-xl mb-5 flex items-center gap-2">
        <Edit3 size={18} style={{ color: '#C9A84C' }} /> My Profile
      </h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {F('Full Name', 'displayName', { placeholder: 'Your full name' })}
        {F('Phone / WhatsApp', 'phone', { placeholder: '+234 800 000 0000' })}
        {F('Nationality', 'nationality', { placeholder: 'Nigerian' })}
        {F('Date of Birth', 'dob', { type: 'date' })}
        {F('Passport Number', 'passportNo', { placeholder: 'A12345678' })}
        {F('Passport Expiry', 'passportExpiry', { type: 'date' })}
      </div>
      {F('Home Address', 'address', { placeholder: 'Home or billing address' })}

      <div className="mt-4 p-4 rounded-xl" style={{ background: '#F3F4F6', border: '1px dashed #E5E7EB' }}>
        <p className="text-sm font-bold text-primary mb-2">Passport Scan</p>
        <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handlePassport}/>
        {form.passportUrl ? (
          <div className="flex items-center gap-2">
            <CheckCircle size={14} style={{ color: '#22c55e' }}/>
            <span className="text-sm text-green-400">Passport on file</span>
            <a href={form.passportUrl} target="_blank" rel="noreferrer" className="text-sm underline ml-1" style={{ color: '#C9A84C' }}>View</a>
            <button onClick={() => fileRef.current?.click()} className="text-sm underline ml-auto" style={{ color: '#4B5563' }}>Replace</button>
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-lg"
            style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' }}>
            {uploading ? <><span className="animate-spin inline-block">↻</span> Uploading…</> : <><Upload size={12}/> Upload Passport</>}
          </button>
        )}
      </div>

      <button onClick={save} disabled={saving}
        className="w-full btn-gold py-3 font-bold text-base mt-4 flex items-center justify-center gap-2">
        {saving ? 'Saving…' : saved ? <><CheckCircle size={15}/> Saved</> : 'Save Changes'}
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const { user, userDoc, loading, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [tab, setTab] = useState('bookings')

  useEffect(() => {
    if (!user) return
    return subscribeUserBookings(user.uid, setBookings)
  }, [user])

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin text-4xl" style={{ color: '#C9A84C' }}>↻</div></div>
  if (!user) return <Navigate to="/auth/login" state={{ from: '/dashboard' }} replace/>

  const active    = bookings.filter(b => !['cancelled', 'refunded'].includes(b.status))
  const completed = bookings.filter(b => ['confirmed', 'tickets_issued'].includes(b.status))

  return (
    <>
      <SEO title="My Account"/>
      <div className="min-h-screen pt-16" style={{ background: '#F8F6F2' }}>

        {/* Header */}
        <div className="py-8" style={{ background: '#F8F6F2', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
          <div className="container-pad">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-2xl"
                  style={{ background: 'linear-gradient(135deg,#C9A84C,#F5C842)', color: '#0A1628' }}>
                  {(userDoc?.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="font-display font-bold text-primary text-xl">{userDoc?.displayName || 'Traveller'}</h1>
                  <p className="text-base" style={{ color: '#4B5563' }}>{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold"
                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                    <Shield size={12}/> Admin Panel
                  </Link>
                )}
                <button onClick={logout} className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl"
                  style={{ background: '#F3F4F6', color: '#374151' }}>
                  <LogOut size={13}/> Sign Out
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              {[['Total', bookings.length], ['Active', active.length], ['Completed', completed.length]].map(([l, v]) => (
                <div key={l} className="text-center px-4 py-2.5 rounded-xl" style={{ background: '#F3F4F6' }}>
                  <p className="font-display font-bold text-lg" style={{ color: '#C9A84C' }}>{v}</p>
                  <p className="text-[12px]" style={{ color: '#4B5563' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="sticky z-20 py-2" style={{ top: '64px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(24px)', borderBottom: '1px solid #F3F4F6' }}>
          <div className="container-pad flex gap-1">
            {[['bookings', 'My Bookings'], ['profile', 'My Profile']].map(([val, label]) => (
              <button key={val} onClick={() => setTab(val)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: tab === val ? 'linear-gradient(135deg,#C9A84C,#F5C842)' : 'transparent',
                  color: tab === val ? '#0A1628' : '#374151',
                }}>{label}</button>
            ))}
            <button onClick={() => navigate('/booking')}
              className="ml-auto flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}>
              <Plus size={13}/> New Booking
            </button>
          </div>
        </div>

        <div className="container-pad py-8 max-w-4xl">
          {tab === 'bookings' && (
            bookings.length === 0 ? (
              <div className="text-center py-20">
                <Plane size={48} className="mx-auto mb-4 opacity-20 text-primary"/>
                <h3 className="font-display font-bold text-primary text-xl mb-2">No bookings yet</h3>
                <p className="text-base mb-6" style={{ color: '#4B5563' }}>Start planning your next trip.</p>
                <Link to="/booking" className="btn-gold">Book a Trip</Link>
              </div>
            ) : (
              <div className="space-y-4">{bookings.map(b => <BookingCard key={b.id} booking={b}/>)}</div>
            )
          )}
          {tab === 'profile' && <ProfileTab userDoc={userDoc} user={user}/>}
        </div>
      </div>
    </>
  )
}
