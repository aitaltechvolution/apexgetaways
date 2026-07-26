import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Clock, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { PACKAGES, formatNGN } from '../../data'
import useReveal from '../../hooks/useReveal'

const TAG_COLORS = {
  'Best Seller': { bg:'rgba(201,168,76,0.12)', color:'#A07830' },
  'Popular':     { bg:'rgba(10,22,40,0.08)',   color:'#0A1628' },
  'Romantic':    { bg:'rgba(236,72,153,0.1)',  color:'#be185d' },
  'Cultural':    { bg:'rgba(124,58,237,0.1)',  color:'#6d28d9' },
  'Adventure':   { bg:'rgba(234,88,12,0.1)',   color:'#c2410c' },
  'Luxury':      { bg:'rgba(201,168,76,0.12)', color:'#A07830' },
}

function PackageCard({ pkg, i, inView }) {
  const tag = TAG_COLORS[pkg.tag] || TAG_COLORS['Popular']
  const save = Math.round(((pkg.oldPrice - pkg.price) / pkg.oldPrice) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group flex-shrink-0 w-80 md:w-auto"
    >
      <Link to={`/packages/${pkg.id}`}
        className="block rounded-2xl overflow-hidden h-full bg-white transition-all duration-300"
        style={{ border: '1px solid rgba(201,168,76,0.2)', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#C9A84C'
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(201,168,76,0.18)'
          e.currentTarget.style.transform = 'translateY(-6px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
          e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}>
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: '220px' }}>
          <img src={pkg.img} alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(10,22,40,0.55) 0%,transparent 55%)' }}/>
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-full text-[12px] font-bold" style={{ background: tag.bg, color: tag.color }}>{pkg.tag}</span>
          </div>
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[12px] font-bold bg-red-500 text-white">
            Save {save}%
          </span>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/80 text-sm">
            <Clock size={11}/>{pkg.nights} nights · {pkg.dest.split(',')[0]}
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="font-display font-bold text-base mb-3 leading-snug" style={{ color: '#0A1628' }}>{pkg.title}</h3>
          <ul className="space-y-1.5 mb-4">
            {pkg.includes.slice(0, 4).map(inc => (
              <li key={inc} className="flex items-center gap-2 text-sm" style={{ color: '#666' }}>
                <Check size={11} style={{ color: '#C9A84C' }} className="shrink-0"/>{inc}
              </li>
            ))}
          </ul>
          <div className="flex items-end justify-between pt-4"
            style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}>
            <div>
              <p className="text-sm line-through" style={{ color: '#bbb' }}>{formatNGN(pkg.oldPrice)}</p>
              <p className="font-display font-bold text-xl" style={{ color: '#C9A84C' }}>{formatNGN(pkg.price)}</p>
              <p className="text-[13px]" style={{ color: '#999' }}>per person</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all" style={{ color: '#0A1628' }}>
              Book <ArrowRight size={12}/>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function PackagesSection() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const scrollRef = useRef(null)
  const scroll = dir => scrollRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })

  return (
    <section className="section-pad" style={{ background: '#f8f6f2' }} ref={ref}>
      <div className="container-pad">
        <div className="flex items-end justify-between mb-12">
          <div className="reveal">
            <span className="section-label">Curated Getaways</span>
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: '#0A1628' }}>
              Tour Packages
            </h2>
            <div className="gold-rule"/>
          </div>
          <div className="reveal flex items-center gap-3">
            <button onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ border: '1.5px solid #C9A84C', color: '#C9A84C', background: 'white' }}>
              <ChevronLeft size={18}/>
            </button>
            <button onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ border: '1.5px solid #C9A84C', color: '#C9A84C', background: 'white' }}>
              <ChevronRight size={18}/>
            </button>
            <Link to="/packages" className="btn-outline-gold text-base hidden md:inline-flex">View All</Link>
          </div>
        </div>

        <div ref={scrollRef}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
          {PACKAGES.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} i={i} inView={inView}/>
          ))}
        </div>
      </div>
    </section>
  )
}