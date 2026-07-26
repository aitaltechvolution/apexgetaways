import { Link } from 'react-router-dom'
import { Phone, MessageCircle, Mail } from 'lucide-react'
import { BRAND } from '../../data'
import useParallax from '../../hooks/useParallax'
import useReveal from '../../hooks/useReveal'

export default function CTASection() {
  useReveal()
  const parallaxRef = useParallax(0.2)

  return (
    <section className="relative py-24 overflow-hidden parallax-section">
      <div ref={parallaxRef} className="parallax-bg scale-110">
        <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80"
          alt="" className="w-full h-full object-cover"/>
      </div>
      {/* Deep navy overlay — keeps text white */}
      <div className="absolute inset-0" style={{ background: 'rgba(10,22,40,0.88)' }}/>
      {/* Gold radial accent */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.12) 0%, transparent 70%)' }}/>

      <div className="relative container-pad text-center">
        <div className="reveal">
          <span className="section-label" style={{ color: '#F5C842' }}>Ready to Travel?</span>
          <h2 className="font-display font-bold text-white mb-5 leading-tight"
            style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)' }}>
            Start Your Journey Today.
            <br/>
            <span style={{ color: '#C9A84C' }}>We Handle Everything.</span>
          </h2>
          <p className="max-w-lg mx-auto mb-8 text-base" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Free consultation · No obligation · 24/7 support
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <Link to="/booking" className="btn-gold">Book Now</Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base text-white border-2 transition-all hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
              Free Consultation
            </Link>
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { icon: Phone,          label: 'Call / WhatsApp', val: BRAND.phone,    href: `tel:${BRAND.phone}` },
              { icon: MessageCircle,  label: 'WhatsApp Chat',   val: 'Chat Now',     href: `https://wa.me/${BRAND.whatsapp.replace('+', '')}` },
              { icon: Mail,           label: 'Email',           val: BRAND.email,    href: `mailto:${BRAND.email}` },
            ].map(({ icon: Icon, label, val, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-xl transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Icon size={15} style={{ color: '#C9A84C' }}/>
                <div className="text-left">
                  <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</p>
                  <p className="text-base font-semibold text-white">{val}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}