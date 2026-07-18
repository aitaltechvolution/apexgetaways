import { Link } from 'react-router-dom'
import { Phone, MessageCircle, Mail } from 'lucide-react'
import { BRAND } from '../../data'
import useParallax from '../../hooks/useParallax'
import useReveal from '../../hooks/useReveal'

export default function CTASection() {
  useReveal()
  const parallaxRef = useParallax(0.2)

  return (
    <section className="relative py-28 overflow-hidden">
      {/* Parallax bg */}
      <div ref={parallaxRef} className="parallax-bg scale-110">
        <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0" style={{ background:'linear-gradient(135deg,rgba(10,22,40,0.93) 0%,rgba(10,22,40,0.85) 100%)' }} />
      {/* Gold glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse at 50% 50%,rgba(201,168,76,0.08) 0%,transparent 70%)' }} />

      <div className="relative container-pad text-center">
        <div className="reveal">
          <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-4">Ready to Travel?</span>
          <h2 className="font-display font-bold text-white mb-6 leading-tight" style={{ fontSize:'clamp(2.2rem,5vw,4rem)' }}>
            Start Your Journey Today.<br />
            <span style={{ color:'#C9A84C' }}>We Handle Everything.</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-10" style={{ color:'rgba(255,255,255,0.55)' }}>
            Free consultation · No obligation · 24/7 support · Trusted by thousands of Nigerian travellers
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link to="/booking" className="btn-gold text-base px-9 py-4">Book Now</Link>
            <Link to="/contact" className="btn-outline-gold text-base px-9 py-4">Free Consultation</Link>
          </div>

          {/* Contact options */}
          <div className="flex flex-wrap gap-6 justify-center">
            {[
              { icon:Phone, label:'Call / WhatsApp', val:BRAND.phone, href:`tel:${BRAND.phone}` },
              { icon:MessageCircle, label:'WhatsApp Chat', val:'Chat Now', href:`https://wa.me/${BRAND.whatsapp.replace('+','')}` },
              { icon:Mail, label:'Email Us', val:BRAND.email, href:`mailto:${BRAND.email}` },
            ].map(({ icon:Icon, label, val, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-xl transition-all hover:scale-105"
                style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)' }}>
                <Icon size={16} style={{ color:'#C9A84C' }} />
                <div className="text-left">
                  <p className="text-[10px]" style={{ color:'rgba(255,255,255,0.4)' }}>{label}</p>
                  <p className="text-sm font-semibold text-white">{val}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
