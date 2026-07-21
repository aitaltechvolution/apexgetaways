import * as LucideIcons from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight } from 'lucide-react'
import { SERVICES } from '../../data'
import useReveal from '../../hooks/useReveal'

function ServiceIcon({ name, size = 18 }) {
  const Icon = LucideIcons[name] || LucideIcons.Star
  return <Icon size={size} style={{ color: '#C9A84C' }}/>
}

export default function ServicesSection() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section className="section-pad" style={{ background: '#070D1A' }} ref={ref}>
      <div className="container-pad">
        <div className="text-center mb-14 reveal">
          <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-3">What We Offer</span>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>Our Services</h2>
          <div className="h-0.5 w-12 mx-auto mt-4" style={{ background: 'linear-gradient(90deg,#C9A84C,#F5C842)' }}/>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SERVICES.map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <Link to={`/services/${s.id}`}
                className="group flex flex-col p-5 rounded-2xl h-full transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(201,168,76,0.1)' }}>
                  <ServiceIcon name={s.iconName} size={18}/>
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5 leading-snug">{s.title}</h3>
                <p className="text-[11px] leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-[11px] font-bold group-hover:gap-2 transition-all" style={{ color: '#C9A84C' }}>
                  Learn more <ArrowRight size={11}/>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
