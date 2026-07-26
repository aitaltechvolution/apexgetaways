import * as LucideIcons from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight } from 'lucide-react'
import SEO from '../../components/SEO'
import { SERVICES, BRAND } from '../../data'
import useReveal from '../../hooks/useReveal'

function ServiceIcon({ name, size = 22, ...props }) {
  const Icon = LucideIcons[name] || LucideIcons.Star
  return <Icon size={size} {...props}/>
}

export default function ServicesPage() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <>
      <SEO title="Our Services" description="Flights, visa, hotels, study abroad, immigration and more — all from one trusted travel partner."/>

      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: '#F8F6F2' }}>
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80" alt="" className="w-full h-full object-cover"/>
        </div>
        <div className="relative container-pad text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm font-bold uppercase tracking-widest text-gold block mb-4">What We Offer</span>
            <h1 className="font-display font-bold text-primary mb-4" style={{ fontSize: 'clamp(2.5rem,6vw,4rem)' }}>Our Services</h1>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#374151' }}>
              Everything you need for international travel — under one roof.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad" style={{ background: '#F8F6F2' }} ref={ref}>
        <div className="container-pad">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <motion.div key={s.id}
                initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <Link to={`/services/${s.id}`}
                  className="group flex flex-col p-6 rounded-2xl h-full transition-all duration-300"
                  style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(10,22,40,0.05)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.transform = 'translateY(-5px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: 'rgba(201,168,76,0.1)' }}>
                    <ServiceIcon name={s.iconName} size={20} style={{ color: '#C9A84C' }}/>
                  </div>
                  <h3 className="font-bold text-primary text-base mb-2 leading-snug">{s.title}</h3>
                  <p className="text-base leading-relaxed flex-1" style={{ color: '#4B5563' }}>{s.desc}</p>
                  <div className="flex items-center gap-1.5 mt-4 text-sm font-bold group-hover:gap-2.5 transition-all" style={{ color: '#C9A84C' }}>
                    Learn more <ArrowRight size={12}/>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 p-8 md:p-12 rounded-3xl text-center reveal"
            style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <h3 className="font-display font-bold text-primary text-2xl mb-3">Not Sure Where to Start?</h3>
            <p className="text-base mb-6 max-w-md mx-auto" style={{ color: '#374151' }}>
              Free consultation — no obligation. Tell us your goal, we'll recommend the right solution.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="btn-gold">Get Free Consultation</Link>
              <a href={`tel:${BRAND.phone}`} className="btn-outline-gold">{BRAND.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
