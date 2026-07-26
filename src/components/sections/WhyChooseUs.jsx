import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, Clock, Star, Users, Globe, Zap } from 'lucide-react'
import useReveal from '../../hooks/useReveal'
import { BRAND } from '../../data'
import { Link } from 'react-router-dom'

const WHY = [
  { icon: Shield, title: 'Trusted & Verified',    desc: 'Licensed agency operating with full transparency. Your documents and payments are always secure.' },
  { icon: Clock,  title: '24/7 Support',           desc: 'Round-the-clock assistance via phone, WhatsApp, and email — we\'re always here.' },
  { icon: Star,   title: 'Personalised Service',   desc: 'Every itinerary tailored to your specific needs, timeline, and budget.' },
  { icon: Users,  title: 'All Traveller Types',    desc: 'Families, students, pilgrims, corporate travellers — we handle every need.' },
  { icon: Globe,  title: '50+ Countries',          desc: 'From Abuja to Dubai, London, Canada and beyond — trusted networks worldwide.' },
  { icon: Zap,    title: 'Fast Processing',        desc: 'Quick visa guidance, swift bookings, efficient documentation — no delays.' },
]

export default function WhyChooseUs() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section className="section-pad" style={{ background: '#FFFFFF' }} ref={ref}>
      <div className="container-pad">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="reveal">
            <span className="section-label">Why Apex Getaways?</span>
            <h2 className="font-display font-bold leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: '#0A1628' }}>
              Travel Better.<br/>
              <span style={{ color: '#C9A84C' }}>Travel Smarter.</span>
            </h2>
            <div className="gold-rule mb-6"/>
            <p className="text-base leading-relaxed mb-5" style={{ color: '#555' }}>
              Since our founding, Apex Getaways & Travel LTD has been dedicated to making international travel simple, seamless, and stress-free for every Nigerian.
            </p>
            <blockquote className="border-l-2 pl-4 py-1 mb-5 italic text-base" style={{ borderColor: '#C9A84C', color: '#555' }}>
              "Empowering individuals and families to explore the world through trusted travel, visa, and immigration services delivered with excellence."
            </blockquote>
            <p className="text-sm font-bold mb-6" style={{ color: '#C9A84C' }}>— {BRAND.ceo.name}, Founder & CEO</p>
            <Link to="/contact" className="btn-navy">Get Free Consultation</Link>
          </div>

          {/* Right grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="p-5 rounded-2xl bg-white transition-all duration-300"
                style={{ border: '1px solid rgba(201,168,76,0.18)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,168,76,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <Icon size={18} style={{ color: '#C9A84C' }}/>
                </div>
                <h3 className="font-bold text-base mb-1" style={{ color: '#0A1628' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#777' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}