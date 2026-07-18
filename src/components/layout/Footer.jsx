import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram } from 'lucide-react'
import ApexLogo from '../ui/Logo'
import { BRAND } from '../../data'

const QUICK = [
  ['/','Home'],['/destinations','Destinations'],['/packages','Packages'],
  ['/services','Services'],['/about','About Us'],['/contact','Contact'],['/faq','FAQ'],
]
const SERVICES_LINKS = [
  ['/services/flights','Flight Bookings'],['/services/visa','Visa Assistance'],
  ['/services/hotels','Hotel Booking'],['/services/study-abroad','Study Abroad'],
  ['/services/airport','Airport Transfers'],['/services/holiday','Holiday Packages'],
  ['/services/corporate','Corporate Travel'],['/services/immigration','Immigration'],
]

function TikTokIcon({ size=16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.15a8.26 8.26 0 004.83 1.55V7.27a4.85 4.85 0 01-1.06-.58z"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={{ background:'#050D1A', borderTop:'1px solid rgba(201,168,76,0.12)' }}>
      {/* CTA strip */}
      <div style={{ background:'linear-gradient(135deg,#0A1628,#162040)', borderBottom:'1px solid rgba(201,168,76,0.15)' }}>
        <div className="container-pad py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-white text-xl">Opening Doors to New Destinations.</p>
            <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,0.45)' }}>24/7 support · Free consultation · Trusted by thousands</p>
          </div>
          <Link to="/contact" className="btn-gold shrink-0">Get Free Quote</Link>
        </div>
      </div>

      {/* Main */}
      <div className="container-pad py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="mb-5"><ApexLogo size={36} showText light /></div>
          <p className="text-sm leading-relaxed mb-6" style={{ color:'rgba(255,255,255,0.38)' }}>
            Apex Getaways & Travel LTD — your trusted partner for flights, visa, study abroad, hotel bookings, and immigration services. Based in Abuja, Nigeria, serving the world.
          </p>
          {/* Social */}
          <div className="flex gap-3">
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', color:'#C9A84C' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#C9A84C';e.currentTarget.style.color='#0A1628'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(201,168,76,0.1)';e.currentTarget.style.color='#C9A84C'}}>
              <Instagram size={16} />
            </a>
            <a href={BRAND.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', color:'#C9A84C' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#C9A84C';e.currentTarget.style.color='#0A1628'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(201,168,76,0.1)';e.currentTarget.style.color='#C9A84C'}}>
              <TikTokIcon size={16} />
            </a>
            <a href={`https://wa.me/${BRAND.whatsapp.replace('+','')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', color:'#C9A84C' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#C9A84C';e.currentTarget.style.color='#0A1628'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(201,168,76,0.1)';e.currentTarget.style.color='#C9A84C'}}>
              <Phone size={14} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5">
            {QUICK.map(([to,label]) => (
              <li key={to}>
                <Link to={to} className="text-sm transition-colors"
                  style={{ color:'rgba(255,255,255,0.38)' }}
                  onMouseEnter={e=>e.currentTarget.style.color='#C9A84C'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.38)'}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">Our Services</h4>
          <ul className="space-y-2.5">
            {SERVICES_LINKS.map(([to,label]) => (
              <li key={to}>
                <Link to={to} className="text-sm transition-colors"
                  style={{ color:'rgba(255,255,255,0.38)' }}
                  onMouseEnter={e=>e.currentTarget.style.color='#C9A84C'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.38)'}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm" style={{ color:'rgba(255,255,255,0.38)' }}>
              <MapPin size={14} className="shrink-0 mt-0.5" style={{ color:'#C9A84C' }} />{BRAND.address}
            </li>
            <li>
              <a href={`tel:${BRAND.phone}`} className="flex items-center gap-3 text-sm transition-colors"
                style={{ color:'rgba(255,255,255,0.38)' }}
                onMouseEnter={e=>e.currentTarget.style.color='#C9A84C'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.38)'}>
                <Phone size={14} style={{ color:'#C9A84C' }} />{BRAND.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 text-sm transition-colors break-all"
                style={{ color:'rgba(255,255,255,0.38)' }}
                onMouseEnter={e=>e.currentTarget.style.color='#C9A84C'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.38)'}>
                <Mail size={14} style={{ color:'#C9A84C' }} />{BRAND.email}
              </a>
            </li>
          </ul>
          <div className="mt-5 p-4 rounded-xl" style={{ background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)' }}>
            <p className="font-bold text-xs text-white mb-0.5">Office Hours</p>
            <p className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>24/7 — Always Available</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-pad py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs" style={{ color:'rgba(255,255,255,0.25)' }}>
          © {new Date().getFullYear()} Apex Getaways & Travel LTD. All rights reserved.
        </p>
        <div className="flex gap-4">
          {[['/privacy','Privacy'],['/terms','Terms'],['/policy','Policy']].map(([to,l]) => (
            <Link key={to} to={to} className="text-xs transition-colors"
              style={{ color:'rgba(255,255,255,0.25)' }}
              onMouseEnter={e=>e.currentTarget.style.color='#C9A84C'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.25)'}>
              {l}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
