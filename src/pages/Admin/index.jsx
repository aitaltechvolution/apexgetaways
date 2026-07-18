import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Users, Settings, LogOut,
  Plane, Hotel, Car, TrendingUp, Clock, CheckCircle,
  XCircle, AlertCircle, ChevronRight, Menu, X
} from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { getAllBookings, getAllUsers, updateBookingStatus } from '../../lib/firebase'
import { formatNGN } from '../../data'

const NAV = [
  { to:'/admin', label:'Dashboard', icon:LayoutDashboard, exact:true },
  { to:'/admin/bookings', label:'All Bookings', icon:BookOpen },
  { to:'/admin/customers', label:'Customers', icon:Users },
  { to:'/admin/settings', label:'Settings', icon:Settings },
]

function AdminNav({ open, setOpen }) {
  const location = useLocation()
  const { logout, user } = useAuth()
  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy dark:bg-black border-r border-white/10 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center font-extrabold text-white text-lg">A</div>
            <div>
              <p className="font-bold text-white text-sm">Apex Getaways</p>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon:Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to) && to !== '/admin'
            return (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-primary text-white shadow-glow' : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}>
                <Icon size={16} />{label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/40 mb-2 truncate">{user?.email}</p>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <LogOut size={15} />Sign Out
          </button>
        </div>
      </div>
      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  )
}

function StatusBadge({ status }) {
  const map = {
    pending:   { cls:'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon:Clock, label:'Pending' },
    confirmed: { cls:'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon:CheckCircle, label:'Confirmed' },
    cancelled: { cls:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon:XCircle, label:'Cancelled' },
    processing:{ cls:'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon:AlertCircle, label:'Processing' },
  }
  const s = map[status] || map.pending
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${s.cls}`}>
      <Icon size={11} />{s.label}
    </span>
  )
}

// ── Dashboard Home ────────────────────────────────────────────────────────────
function DashboardHome() {
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllBookings().catch(() => []), getAllUsers().catch(() => [])])
      .then(([b, u]) => { setBookings(b); setUsers(u) })
      .finally(() => setLoading(false))
  }, [])

  const pending = bookings.filter(b => b.status === 'pending').length
  const confirmed = bookings.filter(b => b.status === 'confirmed').length
  const revenue = bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + (b.total || 0), 0)

  const STATS = [
    { label:'Total Bookings', value:bookings.length, icon:BookOpen, color:'text-blue-500', bg:'bg-blue-50 dark:bg-blue-900/20' },
    { label:'Pending Review', value:pending, icon:Clock, color:'text-yellow-500', bg:'bg-yellow-50 dark:bg-yellow-900/20' },
    { label:'Confirmed', value:confirmed, icon:CheckCircle, color:'text-green-500', bg:'bg-green-50 dark:bg-green-900/20' },
    { label:'Total Customers', value:users.length, icon:Users, color:'text-purple-500', bg:'bg-purple-50 dark:bg-purple-900/20' },
  ]

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin text-primary text-3xl">⟳</div></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of all bookings and activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon:Icon, color, bg }) => (
          <motion.div key={label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            className="bg-white dark:bg-card-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-card">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="font-extrabold text-2xl text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-xs text-primary font-semibold">View all →</Link>
        </div>
        {bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No bookings yet</div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {bookings.slice(0,6).map(b => (
              <div key={b.id} className="flex items-center gap-4 p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  b.bookingType==='flight' ? 'bg-blue-50 dark:bg-blue-900/20' : b.bookingType==='hotel' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-green-50 dark:bg-green-900/20'
                }`}>
                  {b.bookingType==='flight' ? <Plane size={15} className="text-blue-500" /> : b.bookingType==='hotel' ? <Hotel size={15} className="text-amber-500" /> : <Car size={15} className="text-green-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{b.contact?.name || b.contact?.email || 'Unknown'}</p>
                  <p className="text-xs text-gray-400 truncate capitalize">{b.bookingType} · {b.id.slice(0,8)}</p>
                </div>
                <StatusBadge status={b.status} />
                <Link to="/admin/bookings" className="text-gray-300 hover:text-primary"><ChevronRight size={16}/></Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Bookings Manager ──────────────────────────────────────────────────────────
function BookingsManager() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState(null)
  const [notes, setNotes] = useState('')
  const [expanded, setExpanded] = useState(null)

  const load = () => getAllBookings().then(setBookings).catch(() => []).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    await updateBookingStatus(id, status, notes)
    await load()
    setUpdating(null)
    setNotes('')
    setExpanded(null)
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white">All Bookings</h1>
        <div className="flex gap-2 flex-wrap">
          {['all','pending','processing','confirmed','cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filter===s ? 'bg-primary text-white' : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="animate-spin text-primary text-3xl">⟳</div></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center text-gray-400">No bookings found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <motion.div key={b.id} layout className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
              <div className="flex items-center gap-4 p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${b.bookingType==='flight' ? 'bg-blue-50 dark:bg-blue-900/20' : b.bookingType==='hotel' ? 'bg-amber-50' : 'bg-green-50'}`}>
                  {b.bookingType==='flight' ? <Plane size={17} className="text-blue-500" /> : b.bookingType==='hotel' ? <Hotel size={17} className="text-amber-500" /> : <Car size={17} className="text-green-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{b.contact?.name || b.contact?.email}</p>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    <span className="capitalize">{b.bookingType}</span> · Ref: {b.id.slice(0,10).toUpperCase()} ·{' '}
                    {b.contact?.phone} · {b.contact?.email}
                  </p>
                  {b.selectedFlight && (
                    <p className="text-xs text-gray-500 mt-0.5">{b.selectedFlight.from} → {b.selectedFlight.to} · {b.selectedFlight.dep} · {b.cabinClass}</p>
                  )}
                  {b.selectedHotel && (
                    <p className="text-xs text-gray-500 mt-0.5">{b.selectedHotel.name} · {b.hotelCheckIn} – {b.hotelCheckOut}</p>
                  )}
                </div>
                <button onClick={() => setExpanded(expanded===b.id ? null : b.id)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400">
                  {expanded===b.id ? <X size={16}/> : <ChevronRight size={16}/>}
                </button>
              </div>

              {expanded===b.id && (
                <motion.div initial={{ height:0 }} animate={{ height:'auto' }} className="overflow-hidden">
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Admin Notes</label>
                      <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                        placeholder="Internal notes (visible to admin only)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-primary transition-all resize-none" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { s:'processing', label:'Mark Processing', cls:'bg-blue-500 text-white' },
                        { s:'confirmed', label:'✓ Confirm', cls:'bg-green-500 text-white' },
                        { s:'cancelled', label:'✗ Cancel', cls:'bg-red-500 text-white' },
                        { s:'pending', label:'Reset to Pending', cls:'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
                      ].map(({ s, label, cls }) => (
                        <button key={s} onClick={() => updateStatus(b.id, s)} disabled={updating===b.id}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-60 ${cls}`}>
                          {updating===b.id ? '⟳' : label}
                        </button>
                      ))}
                    </div>
                    {b.adminNotes && (
                      <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                        <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 mb-1">Previous note:</p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-500">{b.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Customers ─────────────────────────────────────────────────────────────────
function CustomersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getAllUsers().then(setUsers).catch(() => []).finally(() => setLoading(false)) }, [])
  return (
    <div>
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-6">Customers ({users.length})</h1>
      {loading ? <div className="flex justify-center py-20"><div className="animate-spin text-primary text-3xl">⟳</div></div> : (
        <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>{['Name','Email','Role','Joined'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(u.displayName||u.email||'?')[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{u.displayName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${u.role==='admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminSettings() {
  return (
    <div>
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-6">Settings</h1>
      <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-8 text-center text-gray-400">
        <Settings size={40} className="mx-auto mb-3 opacity-30" />
        <p>Settings panel — configure site options, payment gateways, and notification templates.</p>
      </div>
    </div>
  )
}

// ── Admin Route Guard ─────────────────────────────────────────────────────────
export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth()
  const [navOpen, setNavOpen] = useState(false)

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin text-primary text-4xl">⟳</div></div>
  if (!user) return <Navigate to="/auth/login" state={{ from: '/admin' }} replace />
  if (!isAdmin) return (
    <div className="flex items-center justify-center min-h-screen bg-surface-light dark:bg-surface-dark text-center px-6">
      <div>
        <div className="text-5xl mb-4">🚫</div>
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">You don't have admin privileges.</p>
        <Link to="/" className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm">Go Home</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <AdminNav open={navOpen} setOpen={setNavOpen} />
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white/90 dark:bg-card-dark/90 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-5 py-3.5 flex items-center gap-3">
          <button onClick={() => setNavOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Menu size={18} />
          </button>
          <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Admin Portal</span>
        </div>
        <main className="p-5 lg:p-8 max-w-6xl mx-auto">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="bookings" element={<BookingsManager />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
