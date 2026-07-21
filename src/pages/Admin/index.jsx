import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Users, Settings, LogOut,
  Plane, Hotel, Car, TrendingUp, Clock, CheckCircle, XCircle,
  AlertCircle, ChevronRight, Menu, X, Bell, Search, Eye,
  Edit, Save, Trash2, Phone, Mail, User, Shield, RefreshCcw,
  Download, BarChart2, Filter, ChevronDown
} from 'lucide-react'
import SEO from '../../components/SEO'
import { useAuth } from '../../store/AuthContext'
import {
  subscribeBookings, getAllUsers, updateBooking,
  getUsersByRole, setUserRole, BOOKING_STATUSES
} from '../../lib/firebase'
import { formatNGN, BRAND } from '../../data'

//  Shared helpers 
const STATUS_CONFIG = {
  pending_payment:  { label:'Pending Payment',  color:'#f59e0b', bg:'rgba(245,158,11,0.12)' },
  payment_received: { label:'Payment Received', color:'#60a5fa', bg:'rgba(96,165,250,0.12)' },
  processing:       { label:'Processing',       color:'#a78bfa', bg:'rgba(167,139,250,0.12)' },
  tickets_issued:   { label:'Ticket Issued',    color:'#34d399', bg:'rgba(52,211,153,0.12)' },
  confirmed:        { label:'Confirmed',        color:'#34d399', bg:'rgba(52,211,153,0.12)' },
  cancelled:        { label:'Cancelled',        color:'#f87171', bg:'rgba(248,113,113,0.12)' },
  refunded:         { label:'Refunded',         color:'#9ca3af', bg:'rgba(156,163,175,0.12)' },
}
function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.pending_payment
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ background: s.bg, color: s.color }}>{s.label}</span>
  )
}

const PANEL_BG  = '#070D1A'
const CARD_BG   = 'rgba(255,255,255,0.04)'
const BORDER    = 'rgba(255,255,255,0.08)'
const GOLD      = '#C9A84C'

//  Sidebar 
const NAV_ITEMS = [
  { to:'/admin',           label:'Dashboard',    icon:LayoutDashboard, exact:true },
  { to:'/admin/bookings',  label:'Bookings',     icon:BookOpen },
  { to:'/admin/customers', label:'Customers',    icon:Users },
  { to:'/admin/workers',   label:'Workers',      icon:Shield },
  { to:'/admin/reports',   label:'Reports',      icon:BarChart2 },
  { to:'/admin/settings',  label:'Settings',     icon:Settings },
]

function Sidebar({ open, setOpen }) {
  const { logout, user } = useAuth()
  const loc = useLocation()
  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 flex flex-col transition-transform duration-300 ${open?'translate-x-0':'-translate-x-full xl:translate-x-0'}`}
        style={{ background:'#0A1628', borderRight:`1px solid rgba(201,168,76,0.12)` }}>
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom:'1px solid rgba(201,168,76,0.12)' }}>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Apex Getaways" style={{height:32,width:'auto',objectFit:'contain'}}/>
            <div>
              <p className="font-bold text-white text-sm leading-tight">Apex Getaways</p>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color:'#ef4444' }}>Admin Panel</p>
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon:Icon, exact }) => {
            const active = exact ? loc.pathname === to : loc.pathname.startsWith(to) && to !== '/admin'
            return (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? 'linear-gradient(135deg,rgba(201,168,76,0.18),rgba(201,168,76,0.06))' : 'transparent',
                  color: active ? GOLD : 'rgba(255,255,255,0.5)',
                  borderLeft: active ? `2px solid ${GOLD}` : '2px solid transparent',
                }}>
                <Icon size={16} />{label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[11px] mb-2 truncate" style={{ color:'rgba(255,255,255,0.35)' }}>{user?.email}</p>
          <button onClick={logout} className="flex items-center gap-2 text-sm transition-colors w-full"
            style={{ color:'rgba(255,255,255,0.45)' }}
            onMouseEnter={e=>e.currentTarget.style.color='#ef4444'}
            onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>
            <LogOut size={14}/> Sign Out
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/60 xl:hidden" onClick={()=>setOpen(false)}/>}
    </>
  )
}

//  Topbar 
function Topbar({ onMenu, pendingCount }) {
  return (
    <header className="flex items-center justify-between px-5 py-3 sticky top-0 z-20"
      style={{ background:'rgba(10,22,40,0.97)', borderBottom:'1px solid rgba(255,255,255,0.06)', backdropFilter:'blur(24px)' }}>
      <button onClick={onMenu} className="xl:hidden p-2 rounded-xl text-white hover:bg-white/10"><Menu size={18}/></button>
      <div className="flex items-center gap-3 ml-auto">
        {pendingCount > 0 && (
          <div className="relative">
            <Bell size={18} style={{ color:'rgba(255,255,255,0.5)' }}/>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white bg-red-500">{pendingCount}</span>
          </div>
        )}
        <span className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444' }}> Admin</span>
      </div>
    </header>
  )
}

//  Dashboard Home 
function DashboardHome({ bookings, users }) {
  const pending    = bookings.filter(b => b.status === 'pending_payment').length
  const processing = bookings.filter(b => b.status === 'processing' || b.status === 'payment_received').length
  const confirmed  = bookings.filter(b => b.status === 'confirmed' || b.status === 'tickets_issued').length
  const revenue    = bookings.filter(b => !['pending_payment','cancelled','refunded'].includes(b.status))
                             .reduce((s,b) => s + (b.total||0), 0)
  const recent = bookings.slice(0, 6)

  const STATS = [
    { label:'Total Bookings',  val:bookings.length, icon:BookOpen,     color:'#60a5fa' },
    { label:'Pending',         val:pending,          icon:Clock,        color:'#f59e0b' },
    { label:'Processing',      val:processing,       icon:AlertCircle,  color:'#a78bfa' },
    { label:'Confirmed',       val:confirmed,        icon:CheckCircle,  color:'#34d399' },
    { label:'Total Customers', val:users.length,     icon:Users,        color:'#f472b6' },
    { label:'Revenue',         val:formatNGN(revenue), icon:TrendingUp, color:'#C9A84C', big:true },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-white text-2xl">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,0.4)' }}>Welcome back — here's what's happening</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map(({ label, val, icon:Icon, color, big }) => (
          <motion.div key={label} initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }}
            className="p-5 rounded-2xl" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color:'rgba(255,255,255,0.4)' }}>{label}</p>
              <Icon size={16} style={{ color }}/>
            </div>
            <p className="font-display font-bold" style={{ fontSize: big ? '1.3rem' : '2rem', color }}>{val}</p>
          </motion.div>
        ))}
      </div>
      {/* Recent bookings */}
      <div className="rounded-2xl overflow-hidden" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:`1px solid ${BORDER}` }}>
          <h2 className="font-bold text-white">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-xs font-semibold" style={{ color:GOLD }}>View all →</Link>
        </div>
        {recent.length === 0
          ? <p className="p-8 text-center text-sm" style={{ color:'rgba(255,255,255,0.35)' }}>No bookings yet</p>
          : recent.map(b => (
            <div key={b.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/5"
              style={{ borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: b.bookingType==='flight' ? 'rgba(96,165,250,0.15)' : b.bookingType==='hotel' ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.15)' }}>
                {b.bookingType==='flight' ? <Plane size={14} style={{ color:'#60a5fa' }}/> : b.bookingType==='hotel' ? <Hotel size={14} style={{ color:'#fbbf24' }}/> : <Car size={14} style={{ color:'#34d399' }}/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white truncate">{b.contact?.name || b.contact?.email || 'Unknown'}</p>
                <p className="text-xs truncate capitalize" style={{ color:'rgba(255,255,255,0.35)' }}>{b.bookingType} · {b.orderRef || b.id?.slice(0,10)}</p>
              </div>
              <StatusBadge status={b.status}/>
              {b.total > 0 && <span className="text-xs font-bold shrink-0" style={{ color:GOLD }}>{formatNGN(b.total)}</span>}
            </div>
          ))
        }
      </div>
    </div>
  )
}

//  Bookings Manager 
function BookingsManager({ bookings, onRefresh }) {
  const [search, setSearch]           = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType]   = useState('all')
  const [expanded, setExpanded]       = useState(null)
  const [editing, setEditing]         = useState({})
  const [saving, setSaving]           = useState(null)
  const [notes, setNotes]             = useState('')
  const [pnr, setPnr]                 = useState('')

  const filtered = bookings.filter(b => {
    const matchS = filterStatus === 'all' || b.status === filterStatus
    const matchT = filterType   === 'all' || b.bookingType === filterType
    const matchQ = !search.trim() || [b.contact?.name, b.contact?.email, b.orderRef, b.id].join(' ').toLowerCase().includes(search.toLowerCase())
    return matchS && matchT && matchQ
  })

  const updateStatus = async (id, status) => {
    setSaving(id)
    await updateBooking(id, { status, adminNotes: notes || undefined, pnr: pnr || undefined }).catch(()=>{})
    setSaving(null); setExpanded(null); setNotes(''); setPnr('')
    onRefresh()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display font-bold text-white text-2xl">Bookings <span className="text-base font-normal ml-1" style={{ color:'rgba(255,255,255,0.4)' }}>({filtered.length})</span></h1>
        <button onClick={onRefresh} className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105"
          style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.6)' }}>
          <RefreshCcw size={13}/> Refresh
        </button>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 p-4 rounded-2xl" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 flex-1 min-w-40 px-3 rounded-xl" style={{ background:'rgba(255,255,255,0.06)', border:`1px solid rgba(255,255,255,0.1)` }}>
          <Search size={13} style={{ color:'rgba(255,255,255,0.35)' }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, ref, email…"
            className="flex-1 bg-transparent text-sm text-white py-2.5 outline-none placeholder-white/25"/>
        </div>
        {[
          [filterStatus, setFilterStatus, [['all','All Status'],['pending_payment','Pending'],['payment_received','Paid'],['processing','Processing'],['tickets_issued','Ticketed'],['confirmed','Confirmed'],['cancelled','Cancelled']]],
          [filterType,   setFilterType,   [['all','All Types'],['flight','Flights'],['hotel','Hotels'],['pickup','Transfers']]],
        ].map(([val, setter, opts], i) => (
          <select key={i} value={val} onChange={e=>setter(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-xs font-bold focus:outline-none"
            style={{ background:'rgba(255,255,255,0.06)', border:`1px solid rgba(255,255,255,0.1)`, color:'white', appearance:'none' }}>
            {opts.map(([v,l]) => <option key={v} value={v} style={{ background:'#0F1826' }}>{l}</option>)}
          </select>
        ))}
      </div>

      {/* Booking rows */}
      <div className="space-y-3">
        {filtered.map(b => (
          <div key={b.id} className="rounded-2xl overflow-hidden" style={{ background:CARD_BG, border:`1px solid ${expanded===b.id ? 'rgba(201,168,76,0.35)' : BORDER}` }}>
            <div className="flex items-center gap-3 px-5 py-4 flex-wrap">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: b.bookingType==='flight'?'rgba(96,165,250,0.15)':b.bookingType==='hotel'?'rgba(251,191,36,0.15)':'rgba(52,211,153,0.15)' }}>
                {b.bookingType==='flight'?<Plane size={15} style={{ color:'#60a5fa' }}/>:b.bookingType==='hotel'?<Hotel size={15} style={{ color:'#fbbf24' }}/>:<Car size={15} style={{ color:'#34d399' }}/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm text-white truncate">{b.contact?.name || b.contact?.email || 'Unknown'}</p>
                  <StatusBadge status={b.status}/>
                </div>
                <div className="flex flex-wrap gap-3 mt-0.5 text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>
                  <span>{b.orderRef || b.id?.slice(0,10)}</span>
                  {b.contact?.phone && <span> {b.contact.phone}</span>}
                  {b.contact?.email && <span> {b.contact.email}</span>}
                  {b.total > 0 && <span style={{ color:GOLD }}> {formatNGN(b.total)}</span>}
                  {b.pnr && <span className="text-green-400 font-bold">PNR: {b.pnr}</span>}
                </div>
                {b.selectedFlight && <p className="text-xs mt-0.5" style={{ color:'rgba(255,255,255,0.4)' }}>{b.selectedFlight.from}→{b.selectedFlight.to} · {b.selectedFlight.date} · {(b.cabinClass||'economy').toUpperCase()}</p>}
              </div>
              <button onClick={() => setExpanded(expanded===b.id ? null : b.id)}
                className="p-2 rounded-xl transition-colors hover:bg-white/10"
                style={{ color:'rgba(255,255,255,0.4)' }}>
                {expanded===b.id ? <X size={15}/> : <ChevronRight size={15}/>}
              </button>
            </div>

            <AnimatePresence>
              {expanded===b.id && (
                <motion.div initial={{ height:0,opacity:0 }} animate={{ height:'auto',opacity:1 }} exit={{ height:0,opacity:0 }}
                  className="overflow-hidden">
                  <div className="px-5 pb-5 space-y-4" style={{ borderTop:`1px solid rgba(255,255,255,0.07)` }}>
                    {/* Passenger details */}
                    {b.passengers_info?.length > 0 && (
                      <div className="pt-4">
                        <p className="text-xs font-bold text-white mb-2">Passengers</p>
                        {b.passengers_info.map((p,i) => (
                          <div key={i} className="text-xs mb-1" style={{ color:'rgba(255,255,255,0.55)' }}>
                            {p.title} {p.firstName} {p.middleName||''} {p.lastName} · DOB: {p.dob} · Passport: {p.passportNo} (exp {p.passportExpiry}) · {p.nationality}
                            {p.passportUrl && <a href={p.passportUrl} target="_blank" rel="noreferrer" className="ml-2 underline" style={{ color:GOLD }}> View Scan</a>}
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Flight details */}
                    {b.selectedFlight && (
                      <div className="text-xs space-y-1" style={{ color:'rgba(255,255,255,0.55)' }}>
                        <p> {b.selectedFlight.airline} {b.selectedFlight.flightNo} · {b.selectedFlight.dep}–{b.selectedFlight.arr} · {b.selectedFlight.stops===0?'Direct':`${b.selectedFlight.stops} stop(s)`}</p>
                        {b.selectedReturnFlight && <p> {b.selectedReturnFlight.airline} {b.selectedReturnFlight.flightNo} · {b.selectedReturnFlight.from}→{b.selectedReturnFlight.to}</p>}
                        {b.selectedSeats?.length>0 && <p> Seats: {[...(b.selectedSeats||[]),...(b.selectedReturnSeats||[])].join(', ')}</p>}
                        {b.baggage?.outbound && <p> Baggage: {b.baggage.outbound.label}</p>}
                        {b.addons?.insurance && <p> Travel insurance: Included</p>}
                        {b.addons?.mealPref && <p> Meal: {b.addons.mealPref}</p>}
                        {b.paymentRef && <p> Payment ref: {b.paymentRef}</p>}
                      </div>
                    )}
                    {/* Admin actions */}
                    <div className="pt-3 space-y-3" style={{ borderTop:`1px solid rgba(255,255,255,0.07)` }}>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color:'rgba(255,255,255,0.35)' }}>PNR / Ticket Number</label>
                          <input value={pnr} onChange={e=>setPnr(e.target.value)} placeholder="e.g. XY7Z2A"
                            className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                            style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}
                            onFocus={e=>e.target.style.borderColor=GOLD} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color:'rgba(255,255,255,0.35)' }}>Admin Note</label>
                          <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Internal note for this booking"
                            className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                            style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}
                            onFocus={e=>e.target.style.borderColor=GOLD} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
                        </div>
                      </div>
                      {b.adminNotes && <p className="text-xs p-2 rounded-lg" style={{ background:'rgba(201,168,76,0.06)', color:'rgba(255,255,255,0.5)' }}>Previous note: {b.adminNotes}</p>}
                      <div className="flex flex-wrap gap-2">
                        {[
                          { s:'payment_received', l:'Mark Paid',        bg:'rgba(96,165,250,0.15)', c:'#60a5fa' },
                          { s:'processing',       l:'Processing',       bg:'rgba(167,139,250,0.15)', c:'#a78bfa' },
                          { s:'tickets_issued',   l:'Issue Ticket',     bg:'rgba(52,211,153,0.15)',  c:'#34d399' },
                          { s:'confirmed',        l:'Confirm',          bg:'rgba(52,211,153,0.15)',  c:'#34d399' },
                          { s:'cancelled',        l:'Cancel',            bg:'rgba(248,113,113,0.15)', c:'#f87171' },
                        ].map(({ s, l, bg, c }) => (
                          <button key={s} onClick={() => updateStatus(b.id, s)} disabled={saving===b.id}
                            className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-60"
                            style={{ background:bg, color:c }}>
                            {saving===b.id ? '' : l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center py-16 text-sm" style={{ color:'rgba(255,255,255,0.35)' }}>No bookings match your filters</p>}
      </div>
    </div>
  )
}

//  Customers 
function CustomersPage({ users, bookings }) {
  const [search, setSearch] = useState('')
  const filtered = users.filter(u => !search.trim() || [u.displayName, u.email, u.phone].join(' ').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-white text-2xl">Customers ({users.length})</h1>
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
        <Search size={13} style={{ color:'rgba(255,255,255,0.35)' }}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customers…"
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder-white/25 py-1"/>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom:`1px solid ${BORDER}`, background:'rgba(255,255,255,0.02)' }}>
                {['Customer','Contact','Passport','Role','Bookings','Joined'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color:'rgba(255,255,255,0.35)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const userBookings = bookings.filter(b => b.userId === u.uid || b.userId === u.id)
                return (
                  <tr key={u.id} className="transition-colors hover:bg-white/5" style={{ borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-navy"
                          style={{ background:'linear-gradient(135deg,#C9A84C,#F5C842)', shrink:0 }}>
                          {(u.displayName||u.email||'?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{u.displayName||'No name'}</p>
                          {u.nationality && <p className="text-[11px]" style={{ color:'rgba(255,255,255,0.35)' }}>{u.nationality}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs" style={{ color:'rgba(255,255,255,0.6)' }}>{u.email}</p>
                      {u.phone && <p className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>{u.phone}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs" style={{ color:'rgba(255,255,255,0.6)' }}>{u.passportNo||'—'}</p>
                      {u.passportUrl && <a href={u.passportUrl} target="_blank" rel="noreferrer" className="text-[11px] underline" style={{ color:GOLD }}>View scan</a>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={{ background:u.role==='admin'?'rgba(239,68,68,0.15)':u.role==='worker'?'rgba(167,139,250,0.15)':'rgba(255,255,255,0.06)', color:u.role==='admin'?'#f87171':u.role==='worker'?'#a78bfa':'rgba(255,255,255,0.5)' }}>
                        {u.role||'client'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold" style={{ color:GOLD }}>{userBookings.length}</span>
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>
                      {u.createdAt?.seconds ? new Date(u.createdAt.seconds*1000).toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'numeric'}) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

//  Workers Manager 
function WorkersPage({ users, bookings, onRefresh }) {
  const workers   = users.filter(u => u.role === 'worker')
  const clients   = users.filter(u => !u.role || u.role === 'client')
  const [search, setSearch]   = useState('')
  const [promote, setPromote] = useState(null)
  const [saving, setSaving]   = useState(null)

  const doPromote = async (uid, role) => {
    setSaving(uid)
    await setUserRole(uid, role).catch(()=>{})
    setSaving(null); setPromote(null); onRefresh()
  }

  const filteredClients = clients.filter(u => !search.trim() || [u.displayName,u.email].join(' ').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-7">
      <h1 className="font-display font-bold text-white text-2xl">Workers & Access Control</h1>

      {/* Current workers */}
      <div>
        <h2 className="font-bold text-white mb-3 flex items-center gap-2"><Shield size={15} style={{ color:GOLD }}/> Active Workers ({workers.length})</h2>
        {workers.length === 0
          ? <p className="text-sm p-5 rounded-xl text-center" style={{ background:CARD_BG, color:'rgba(255,255,255,0.35)' }}>No workers added yet. Promote a client below.</p>
          : (
            <div className="space-y-3">
              {workers.map(w => (
                <div key={w.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background:CARD_BG, border:`1px solid rgba(167,139,250,0.2)` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-navy" style={{ background:'linear-gradient(135deg,#a78bfa,#7c3aed)' }}>{(w.displayName||w.email||'W')[0].toUpperCase()}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{w.displayName||'Worker'}</p>
                    <p className="text-xs" style={{ color:'rgba(255,255,255,0.45)' }}>{w.email}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background:'rgba(167,139,250,0.15)', color:'#a78bfa' }}>Worker</span>
                  <button onClick={() => doPromote(w.id,'client')} disabled={saving===w.id}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                    style={{ background:'rgba(248,113,113,0.12)', color:'#f87171' }}>
                    {saving===w.id?'':'Revoke'}
                  </button>
                </div>
              ))}
            </div>
          )
        }
      </div>

      {/* Promote a client */}
      <div>
        <h2 className="font-bold text-white mb-3 flex items-center gap-2"><Users size={15} style={{ color:GOLD }}/> Promote Client to Worker</h2>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-3" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
          <Search size={13} style={{ color:'rgba(255,255,255,0.35)' }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients…" className="flex-1 bg-transparent text-sm text-white outline-none placeholder-white/25 py-1"/>
        </div>
        <div className="space-y-2">
          {filteredClients.slice(0,10).map(u => (
            <div key={u.id} className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-navy" style={{ background:'linear-gradient(135deg,#C9A84C,#F5C842)' }}>{(u.displayName||u.email||'C')[0].toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white truncate">{u.displayName||'Client'}</p>
                <p className="text-xs truncate" style={{ color:'rgba(255,255,255,0.4)' }}>{u.email}</p>
              </div>
              <button onClick={() => doPromote(u.id,'worker')} disabled={saving===u.id}
                className="text-xs font-bold px-3 py-2 rounded-lg transition-all hover:scale-105 shrink-0"
                style={{ background:'rgba(167,139,250,0.15)', color:'#a78bfa' }}>
                {saving===u.id?'':'Make Worker'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Worker permissions info */}
      <div className="p-5 rounded-2xl" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
        <h3 className="font-bold text-white mb-3 text-sm">Worker Permissions</h3>
        <div className="grid sm:grid-cols-2 gap-2 text-xs" style={{ color:'rgba(255,255,255,0.55)' }}>
          {[' View all bookings',' Update booking status',' Add PNR / ticket numbers',' Add admin notes',' View customer details',' Delete bookings',' Manage workers or admins',' Access financial reports'].map(p => <p key={p}>{p}</p>)}
        </div>
      </div>
    </div>
  )
}

//  Reports 
function ReportsPage({ bookings }) {
  const total    = bookings.reduce((s,b) => s+(b.total||0), 0)
  const paid     = bookings.filter(b=>!['pending_payment','cancelled','refunded'].includes(b.status)).reduce((s,b)=>s+(b.total||0),0)
  const types    = ['flight','hotel','pickup'].map(t => ({ type:t, count:bookings.filter(b=>b.bookingType===t).length }))
  const statuses = Object.keys(STATUS_CONFIG).map(s => ({ status:s, count:bookings.filter(b=>b.status===s).length }))

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-white text-2xl">Reports</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label:'Total Booking Value', val:formatNGN(total), sub:'All time' },
          { label:'Revenue Received',    val:formatNGN(paid),  sub:'Paid bookings only' },
          { label:'Total Bookings',      val:bookings.length,  sub:'All time' },
          { label:'Avg. Booking Value',  val:bookings.length>0?formatNGN(Math.round(total/bookings.length)):'—', sub:'Per booking' },
        ].map(({ label, val, sub }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'rgba(255,255,255,0.4)' }}>{label}</p>
            <p className="font-display font-bold text-2xl" style={{ color:GOLD }}>{val}</p>
            <p className="text-xs mt-1" style={{ color:'rgba(255,255,255,0.3)' }}>{sub}</p>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
          <h3 className="font-bold text-white mb-4">By Booking Type</h3>
          {types.map(({ type, count }) => (
            <div key={type} className="flex items-center gap-3 mb-3">
              <span className="capitalize text-sm font-medium text-white w-16">{type}</span>
              <div className="flex-1 h-2 rounded-full" style={{ background:'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full transition-all" style={{ width:`${bookings.length>0?(count/bookings.length*100):0}%`, background:'linear-gradient(90deg,#C9A84C,#F5C842)' }}/>
              </div>
              <span className="text-sm font-bold w-8 text-right" style={{ color:GOLD }}>{count}</span>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-2xl" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
          <h3 className="font-bold text-white mb-4">By Status</h3>
          {statuses.filter(s=>s.count>0).map(({ status, count }) => {
            const cfg = STATUS_CONFIG[status]
            return (
              <div key={status} className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color:'rgba(255,255,255,0.55)' }}>{cfg.label}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background:cfg.bg, color:cfg.color }}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

//  Settings 
function AdminSettings() {
  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-white text-2xl">Settings</h1>
      <div className="p-6 rounded-2xl" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
        <h2 className="font-bold text-white mb-4">Agency Information</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm" style={{ color:'rgba(255,255,255,0.6)' }}>
          {[
            ['Business Name', BRAND.name],
            ['Phone', BRAND.phone],
            ['Email', BRAND.email],
            ['Address', BRAND.address],
            ['WhatsApp', BRAND.whatsapp],
            ['Hours', BRAND.hours],
          ].map(([k,v]) => (
            <div key={k}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color:'rgba(255,255,255,0.35)' }}>{k}</p>
              <p className="text-white">{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="p-5 rounded-2xl" style={{ background:CARD_BG, border:`1px solid ${BORDER}` }}>
        <h2 className="font-bold text-white mb-3">Payment Settings</h2>
        <p className="text-sm mb-3" style={{ color:'rgba(255,255,255,0.55)' }}>Configure your Paystack API keys in your .env file:</p>
        <div className="p-3 rounded-xl text-xs font-mono" style={{ background:'rgba(0,0,0,0.3)', color:'#C9A84C' }}>
          VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxx
        </div>
        <p className="text-xs mt-3" style={{ color:'rgba(255,255,255,0.35)' }}>Get your keys from <a href="https://dashboard.paystack.com/#/settings/developers" target="_blank" rel="noreferrer" className="underline" style={{ color:GOLD }}>dashboard.paystack.com</a></p>
      </div>
    </div>
  )
}

//  Admin Layout / Guard 
export default function AdminLayout() {
  const { user, userDoc, loading, isAdmin } = useAuth()
  const [navOpen, setNavOpen] = useState(false)
  const [bookings, setBookings] = useState([])
  const [users,    setUsers]    = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!user || !isAdmin) return
    const unsub = subscribeBookings(setBookings)
    getAllUsers().then(setUsers).catch(()=>{})
    return unsub
  }, [user, isAdmin, refreshKey])

  const refresh = () => setRefreshKey(k => k+1)
  const pending = bookings.filter(b => b.status === 'pending_payment' || b.status === 'payment_received').length

  if (loading) return <div className="flex items-center justify-center min-h-screen" style={{ background:'#070D1A' }}><div className="animate-spin text-4xl" style={{ color:GOLD }}></div></div>
  if (!user) return <Navigate to="/auth/login" state={{ from:'/admin' }} replace/>
  if (!isAdmin && userDoc?.role !== 'worker') return (
    <div className="flex items-center justify-center min-h-screen text-center px-6" style={{ background:'#070D1A' }}>
      <div>
        <div className="text-5xl mb-4"></div>
        <h1 className="font-display font-bold text-white text-2xl mb-2">Access Denied</h1>
        <p className="mb-6" style={{ color:'rgba(255,255,255,0.5)' }}>You don't have admin or worker privileges.</p>
        <Link to="/" className="btn-gold">Go Home</Link>
      </div>
    </div>
  )

  const isWorker = !isAdmin && userDoc?.role === 'worker'

  return (
    <div className="min-h-screen" style={{ background:PANEL_BG }}>
      <Sidebar open={navOpen} setOpen={setNavOpen}/>
      <div className="xl:pl-60">
        <Topbar onMenu={() => setNavOpen(true)} pendingCount={pending}/>
        <main className="p-5 lg:p-7 max-w-6xl mx-auto">
          <Routes>
            <Route index element={<DashboardHome bookings={bookings} users={users}/>}/>
            <Route path="bookings" element={<BookingsManager bookings={bookings} onRefresh={refresh}/>}/>
            <Route path="customers" element={<CustomersPage users={users} bookings={bookings}/>}/>
            {!isWorker && <Route path="workers" element={<WorkersPage users={users} bookings={bookings} onRefresh={refresh}/>}/>}
            {!isWorker && <Route path="reports" element={<ReportsPage bookings={bookings}/>}/>}
            <Route path="settings" element={<AdminSettings/>}/>
          </Routes>
        </main>
      </div>
    </div>
  )
}
