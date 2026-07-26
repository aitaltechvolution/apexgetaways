import * as LucideIcons from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight } from 'lucide-react'
import { SERVICES } from '../../data'
import useReveal from '../../hooks/useReveal'

function ServiceIcon({ name, size = 20 }) {
  const Icon = LucideIcons[name] || LucideIcons.Star
  return <Icon size={size} style={{ color: '#C9A84C' }}/>
}

export default function ServicesSection() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section className="section-pad" style={{ background: '#FFFFFF' }} ref={ref}>
      <div className="container-pad">
        <div className="text-center mb-14 reveal">
          <span className="section-label">Everything You Need</span>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: '#0A1628' }}>
            Our Services
          </h2>
          <div className="gold-rule gold-rule-center"/>
          <p className="mt-5 max-w-xl mx-auto text-base leading-relaxed" style={{ color: '#555' }}>
            From your first flight booking to full immigration consultation — one trusted partner for every travel need.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SERVICES.map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <Link to={`/services/${s.id}`}
                className="group flex flex-col p-5 rounded-2xl h-full transition-all duration-300 bg-white"
                style={{ border: '1px solid rgba(201,168,76,0.18)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#C9A84C'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,168,76,0.15)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <ServiceIcon name={s.iconName} size={20}/>
                </div>
                <h3 className="font-bold text-base mb-1.5 leading-snug" style={{ color: '#0A1628' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: '#777' }}>{s.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-sm font-bold group-hover:gap-2 transition-all" style={{ color: '#C9A84C' }}>
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