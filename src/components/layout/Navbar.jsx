import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Plane, Hotel, Car, Package, Phone } from 'lucide-react'
import ApexLogo from '../ui/Logo'
import { useTheme } from '../../store/ThemeContext'
import { BRAND } from '../../data'

const BOOK_MENU = [
  { to:'/booking/flights', icon:Plane,   label:'Flights',          sub:'One-way · Round trip · Multi-city' },
  { to:'/booking/hotels',  icon:Hotel,   label:'Hotels',           sub:'Budget to 5-star luxury' },
  { to:'/booking/pickup',  icon:Car,     label:'Airport Pickup',   sub:'Transfers & car hire' },
  { to:'/packages',        icon:Package, label:'Tour Packages',    sub:'All-inclusive deals' },
]

const NAV = [
  { to:'/', label:'Home' },
  { to:'/destinations', label:'Destinations' },
  { to:'/packages', label:'Packages' },
  { to:'/services', label:'Services' },
  { to:'/about', label:'About' },
  { to:'/contact', label:'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false); setBookOpen(false) }, [location])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])

  const solid = scrolled || !isHome

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{
          background: solid ? 'rgba(10,22,40,0.97)' : 'transparent',
          backdropFilter: solid ? 'blur(24px)' : 'none',
          borderBottom: solid ? '1px solid rgba(201,168,76,0.15)' : 'none',
        }}>
        <div className="container-pad flex items-center h-16 lg:h-20 gap-3">
          <Link to="/" className="shrink-0 mr-4"><ApexLogo size={36} showText light /></Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {NAV.slice(0,2).map(l => (
              <Link key={l.to} to={l.to} className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname===l.to ? 'text-gold' : 'text-white/70 hover:text-white'}`}>{l.label}</Link>
            ))}
            {/* Book dropdown */}
            <div className="relative" onMouseEnter={() => setBookOpen(true)} onMouseLeave={() => setBookOpen(false)}>
              <button className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors text-white/70 hover:text-white`}>
                Book <ChevronDown size={13} className={`transition-transform ${bookOpen ? 'rotate-180' : ''}`} />
              </button>
              {bookOpen && (
                <div className="absolute top-full left-0 pt-2 w-72 z-50">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(24px)' }}>
                    {BOOK_MENU.map(({ to, icon:Icon, label, sub }) => (
                      <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-gold/20" style={{ background: 'rgba(201,168,76,0.1)' }}>
                          <Icon size={16} style={{ color: '#C9A84C' }} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-white">{label}</p>
                          <p className="text-xs text-white/40">{sub}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {NAV.slice(2).map(l => (
              <Link key={l.to} to={l.to} className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname===l.to ? 'text-gold' : 'text-white/70 hover:text-white'}`}>{l.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <a href={`tel:${BRAND.phone}`} className="hidden md:flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light transition-colors">
              <Phone size={14} />{BRAND.phone}
            </a>
            <Link to="/booking" className="hidden md:inline-flex btn-gold text-xs px-5 py-2.5">Book Now</Link>
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all" aria-label="Menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-80 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
          style={{ background: '#0A1628', borderLeft: '1px solid rgba(201,168,76,0.15)' }}>
          <div className="p-6 flex flex-col gap-1" style={{ paddingTop: '88px' }}>
            <div className="mb-5 pb-5" style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Book Travel</p>
              {BOOK_MENU.map(({ to, icon:Icon, label }) => (
                <Link key={to} to={to} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all">
                  <Icon size={15} style={{ color: '#C9A84C' }} />{label}
                </Link>
              ))}
            </div>
            {NAV.map(l => (
              <Link key={l.to} to={l.to} className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all ${location.pathname===l.to ? 'text-gold bg-gold/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>{l.label}</Link>
            ))}
            <div className="mt-5 pt-5 space-y-3" style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}>
              <Link to="/booking" className="block w-full text-center btn-gold">Book Now</Link>
              <a href={`tel:${BRAND.phone}`} className="block w-full text-center py-3 rounded-xl text-sm font-bold text-gold border border-gold/30">{BRAND.phone}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
