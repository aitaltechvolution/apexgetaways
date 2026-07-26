import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Plane, Hotel, Car, Package, Phone } from 'lucide-react'
import { useTheme } from '../../store/ThemeContext'
import { BRAND } from '../../data'

const BOOK_MENU = [
  { to: '/booking/flights', icon: Plane,   label: 'Flights',         sub: 'One-way · Return · Multi-city' },
  { to: '/booking/hotels',  icon: Hotel,   label: 'Hotels',          sub: 'Budget to 5-star luxury' },
  { to: '/booking/pickup',  icon: Car,     label: 'Airport Pickup',  sub: 'Transfers & car hire' },
  { to: '/packages',        icon: Package, label: 'Tour Packages',   sub: 'All-inclusive deals' },
]

const NAV = [
  { to: '/',            label: 'Home' },
  { to: '/destinations',label: 'Destinations' },
  { to: '/packages',    label: 'Packages' },
  { to: '/services',    label: 'Services' },
  { to: '/about',       label: 'About' },
  { to: '/contact',     label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false); setBookOpen(false) }, [location])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])

  // On home: transparent → white on scroll. On other pages: always white.
  const solid = scrolled || !isHome

  const navBg    = solid ? 'rgba(255,255,255,0.97)' : 'transparent'
  const navBdr   = solid ? '1px solid rgba(201,168,76,0.2)' : 'none'
  const navShadow = solid ? '0 2px 20px rgba(0,0,0,0.06)' : 'none'
  const linkColor = solid ? '#1a1a1a' : 'rgba(255,255,255,0.85)'
  const linkActive = '#C9A84C'

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-400"
        style={{ background: navBg, borderBottom: navBdr, boxShadow: navShadow, backdropFilter: solid ? 'blur(20px)' : 'none' }}>
        <div className="container-pad flex items-center h-16 lg:h-20 gap-3">

          {/* Logo */}
          <Link to="/" className="shrink-0 mr-4 flex items-center gap-2.5">
            <img src="/logo.png" alt="Apex Getaways" style={{ height: 34, width: 'auto', objectFit: 'contain' }}/>
            <div className="hidden sm:block leading-tight">
              <p className="font-bold text-base tracking-tight" style={{ color: solid ? '#0A1628' : '#fff' }}>APEX</p>
              <p className="text-[13px] font-semibold tracking-widest uppercase" style={{ color: '#C9A84C' }}>Getaways & Travel</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {NAV.slice(0, 2).map(l => (
              <Link key={l.to} to={l.to}
                className="px-3.5 py-2 rounded-lg text-base font-medium transition-colors"
                style={{ color: location.pathname === l.to ? linkActive : linkColor }}>
                {l.label}
              </Link>
            ))}

            {/* Book dropdown */}
            <div className="relative" onMouseEnter={() => setBookOpen(true)} onMouseLeave={() => setBookOpen(false)}>
              <button className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-base font-medium transition-colors"
                style={{ color: linkColor }}>
                Book <ChevronDown size={13} className={`transition-transform ${bookOpen ? 'rotate-180' : ''}`}/>
              </button>
              {bookOpen && (
                <div className="absolute top-full left-0 pt-2 w-72 z-50">
                  <div className="rounded-2xl overflow-hidden shadow-xl bg-white"
                    style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
                    {BOOK_MENU.map(({ to, icon: Icon, label, sub }) => (
                      <Link key={to} to={to}
                        className="flex items-center gap-3 px-4 py-3.5 hover:bg-amber-50 transition-colors border-b last:border-0 group"
                        style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(201,168,76,0.1)' }}>
                          <Icon size={16} style={{ color: '#C9A84C' }}/>
                        </div>
                        <div>
                          <p className="font-semibold text-base" style={{ color: '#0A1628' }}>{label}</p>
                          <p className="text-sm" style={{ color: '#999' }}>{sub}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {NAV.slice(2).map(l => (
              <Link key={l.to} to={l.to}
                className="px-3.5 py-2 rounded-lg text-base font-medium transition-colors"
                style={{ color: location.pathname === l.to ? linkActive : linkColor }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 ml-auto">
            <a href={`tel:${BRAND.phone}`}
              className="hidden md:flex items-center gap-1.5 text-base font-semibold transition-colors"
              style={{ color: solid ? '#C9A84C' : '#F5C842' }}>
              <Phone size={13}/>{BRAND.phone}
            </a>
            <Link to="/booking"
              className="hidden md:inline-flex btn-gold text-sm px-5 py-2.5">
              Book Now
            </Link>
            <button onClick={() => setOpen(!open)}
              className="lg:hidden p-2.5 rounded-xl transition-all"
              style={{ color: solid ? '#0A1628' : 'white', background: solid ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.1)' }}
              aria-label="Menu">
              {open ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)}/>
        <div className={`absolute top-0 right-0 h-full w-80 transition-transform duration-300 bg-white ${open ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
          style={{ borderLeft: '1px solid rgba(201,168,76,0.2)', boxShadow: '-8px 0 40px rgba(0,0,0,0.1)' }}>
          <div className="p-6 flex flex-col gap-1" style={{ paddingTop: '88px' }}>
            {/* Book section */}
            <div className="mb-4 pb-4" style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
              <p className="text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: '#C9A84C' }}>Book Travel</p>
              {BOOK_MENU.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold transition-all hover:bg-amber-50"
                  style={{ color: '#1a1a1a' }}>
                  <Icon size={15} style={{ color: '#C9A84C' }}/>{label}
                </Link>
              ))}
            </div>
            {NAV.map(l => (
              <Link key={l.to} to={l.to}
                className="px-3 py-3 rounded-xl text-base font-semibold transition-all hover:bg-amber-50"
                style={{ color: location.pathname === l.to ? '#C9A84C' : '#1a1a1a' }}>
                {l.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 space-y-3" style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}>
              <Link to="/booking" className="block w-full text-center btn-gold">Book Now</Link>
              <a href={`tel:${BRAND.phone}`}
                className="block w-full text-center py-3 rounded-xl text-base font-bold border-2"
                style={{ borderColor: 'rgba(201,168,76,0.4)', color: '#C9A84C' }}>
                {BRAND.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}