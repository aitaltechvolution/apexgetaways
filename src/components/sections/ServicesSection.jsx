import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight } from 'lucide-react'
import { SERVICES } from '../../data'
import useReveal from '../../hooks/useReveal'

export default function ServicesSection() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.05 })

  return (
    <section className="section-pad" style={{ background:'#070D1A' }} ref={ref}>
      <div className="container-pad">
        <div className="text-center mb-14 reveal">
          <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-3">Everything You Need</span>
          <h2 className="font-display font-bold text-white" style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>Our Services</h2>
          <div className="h-0.5 w-12 mx-auto mt-4" style={{ background:'linear-gradient(90deg,#C9A84C,#F5C842)' }} />
          <p className="mt-5 max-w-xl mx-auto text-sm leading-relaxed" style={{ color:'rgba(255,255,255,0.45)' }}>
            From your first flight booking to full immigration consultation — Apex Getaways is your single trusted partner for all travel needs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
  {SERVICES.map((s, i) => {
    const Icon = s.icon; // Extract component reference

    return (
      <motion.div
        key={s.id}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          to={`/services/${s.id}`}
          className="group flex flex-col p-5 rounded-2xl h-full transition-all duration-300"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201,168,76,0.06)';
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Replaced <span> with Lucide Icon Component */}
          <div className="mb-4">
            <Icon size={28} style={{ color: '#C9A84C' }} />
          </div>

          <h3 className="font-bold text-white text-sm leading-snug mb-2">{s.title}</h3>
          <p className="text-[11px] leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.38)' }}>
            {s.desc}
          </p>
          <div
            className="flex items-center gap-1 mt-4 text-[11px] font-bold transition-all duration-300 group-hover:gap-2"
            style={{ color: '#C9A84C' }}
          >
            Learn more <ArrowRight size={11} />
          </div>
        </Link>
      </motion.div>
    );
  })}
</div>
      </div>
    </section>
  )
}
