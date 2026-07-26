import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram } from 'lucide-react'
import { BRAND } from '../../data'

const QUICK = [
  ['/', 'Home'], ['/destinations', 'Destinations'], ['/packages', 'Packages'],
  ['/services', 'Services'], ['/about', 'About Us'], ['/contact', 'Contact'], ['/faq', 'FAQ'],
]
const SERVICES_LINKS = [
  ['/services/flights', 'Flight Bookings'], ['/services/visa', 'Visa Assistance'],
  ['/services/hotels', 'Hotel Booking'], ['/services/study-abroad', 'Study Abroad'],
  ['/services/airport', 'Airport Transfers'], ['/services/holiday', 'Holiday Packages'],
  ['/services/corporate', 'Corporate Travel'], ['/services/immigration', 'Immigration'],
]

function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.15a8.26 8.26 0 004.83 1.55V7.27a4.85 4.85 0 01-1.06-.58z"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: '#0A1628' }}>
      {/* CTA strip */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div className="container-pad py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-white text-xl">{BRAND.tagline}</p>
            <p className="text-base mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
              24/7 support · Free consultation · Trusted by thousands
            </p>
          </div>
          <Link to="/contact" className="btn-gold shrink-0">Get Free Quote</Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="container-pad py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <img src="/logo.png" alt="Apex Getaways" style={{ height: 38, width: 'auto', objectFit: 'contain' }}/>
            <div className="leading-tight">
              <p className="font-bold text-white text-base">APEX</p>
              <p className="text-[13px] font-semibold tracking-widest uppercase" style={{ color: '#C9A84C' }}>Getaways & Travel</p>
            </div>
          </div>
          <p className="text-base leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Your trusted partner for flights, visa, study abroad, hotel bookings, and immigration services. Based in Abuja, Nigeria.
          </p>
          <div className="flex gap-2">
            {[
              { href: BRAND.instagram, Icon: Instagram, label: 'Instagram' },
              { href: BRAND.tiktok,    Icon: TikTokIcon, label: 'TikTok' },
            ].map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#0A1628' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.color = '#C9A84C' }}>
                <Icon size={15}/>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-base text-white mb-5 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5">
            {QUICK.map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-base transition-colors"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-bold text-base text-white mb-5 uppercase tracking-wider">Our Services</h4>
          <ul className="space-y-2.5">
            {SERVICES_LINKS.map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-base transition-colors"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-base text-white mb-5 uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: '#C9A84C' }}/>{BRAND.address}
            </li>
            <li>
              <a href={`tel:${BRAND.phone}`} className="flex items-center gap-3 text-base transition-colors"
                style={{ color: 'rgba(255,255,255,0.7)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                <Phone size={14} style={{ color: '#C9A84C' }}/>{BRAND.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 text-base transition-colors break-all"
                style={{ color: 'rgba(255,255,255,0.7)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                <Mail size={14} style={{ color: '#C9A84C' }}/>{BRAND.email}
              </a>
            </li>
          </ul>
          <div className="mt-5 p-4 rounded-xl" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <p className="font-bold text-sm text-white mb-0.5">Office Hours</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>24/7 — Always Available</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-pad py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
          © {new Date().getFullYear()} Apex Getaways & Travel LTD. All rights reserved.
        </p>
        <div className="flex gap-4">
          {[['/privacy', 'Privacy'], ['/terms', 'Terms']].map(([to, l]) => (
            <Link key={to} to={to} className="text-sm transition-colors"
              style={{ color: 'rgba(255,255,255,0.55)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}>
              {l}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}