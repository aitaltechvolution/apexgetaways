import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Clock, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { PACKAGES, formatNGN } from '../../data'
import useReveal from '../../hooks/useReveal'

const TAG_COLORS = {
  'Best Seller': { bg:'rgba(201,168,76,0.15)', color:'#F5C842' },
  'Popular':     { bg:'rgba(59,130,246,0.15)', color:'#60A5FA' },
  'Romantic':    { bg:'rgba(236,72,153,0.15)', color:'#F472B6' },
  'Cultural':    { bg:'rgba(139,92,246,0.15)', color:'#A78BFA' },
  'Adventure':   { bg:'rgba(249,115,22,0.15)', color:'#FB923C' },
  'Luxury':      { bg:'rgba(201,168,76,0.15)', color:'#F5C842' },
}

function PackageCard({ pkg, i, inView }) {
  const tag = TAG_COLORS[pkg.tag] || TAG_COLORS['Popular']
  const save = Math.round(((pkg.oldPrice - pkg.price) / pkg.oldPrice) * 100)

  return (
    <motion.div
      initial={{ opacity:0, y:40 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ delay: i * 0.1, duration:0.7, ease:[0.22,1,0.36,1] }}
      className="group flex-shrink-0 w-80 md:w-auto"
    >
      <Link to={`/packages/${pkg.id}`}
        className="block rounded-2xl overflow-hidden h-full"
        style={{ background:'#0F1826', border:'1px solid rgba(255,255,255,0.06)', transition:'all 0.35s ease' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.4)'; e.currentTarget.style.transform='translateY(-6px)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.transform='translateY(0)' }}>

        {/* Image */}
        <div className="relative overflow-hidden" style={{ height:'220px' }}>
          <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0" style={{ background:'linear-gradient(to top,rgba(5,13,26,0.7) 0%,transparent 60%)' }} />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background:tag.bg, color:tag.color }}>{pkg.tag}</span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white">Save {save}%</span>
          </div>
          {/* Flag + nights */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="text-xl">{pkg.flag}</span>
            <div className="flex items-center gap-1 text-white/80 text-xs">
              <Clock size={11} />{pkg.nights} nights
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-xs text-white/40 mb-1">{pkg.dest}</p>
          <h3 className="font-display font-bold text-white text-base mb-3 leading-snug">{pkg.title}</h3>

          {/* Includes */}
          <ul className="space-y-1.5 mb-4">
            {pkg.includes.slice(0,4).map(inc => (
              <li key={inc} className="flex items-center gap-2 text-xs" style={{ color:'rgba(255,255,255,0.45)' }}>
                <Check size={11} style={{ color:'#C9A84C' }} className="shrink-0" />{inc}
              </li>
            ))}
          </ul>

          {/* Price */}
          <div className="flex items-end justify-between pt-4" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <p className="text-xs line-through" style={{ color:'rgba(255,255,255,0.25)' }}>{formatNGN(pkg.oldPrice)}</p>
              <p className="font-display font-bold text-xl" style={{ color:'#C9A84C' }}>{formatNGN(pkg.price)}</p>
              <p className="text-[11px]" style={{ color:'rgba(255,255,255,0.3)' }}>per person</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold transition-all duration-300 group-hover:gap-2" style={{ color:'#C9A84C' }}>
              Book <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function PackagesSection() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.05 })
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 340, behavior:'smooth' })
  }

  return (
    <section className="section-pad parallax-section" style={{ background:'#0A1628' }} ref={ref}>
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage:'linear-gradient(rgba(201,168,76,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.3) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />

      <div className="container-pad relative">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div className="reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-3">Curated Getaways</span>
            <h2 className="font-display font-bold text-white leading-tight" style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>
              Tour Packages
            </h2>
            <div className="h-0.5 w-12 mt-4" style={{ background:'linear-gradient(90deg,#C9A84C,#F5C842)' }} />
          </div>
          <div className="reveal flex items-center gap-3">
            <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C' }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll(1)} className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C' }}>
              <ChevronRight size={18} />
            </button>
            <Link to="/packages" className="btn-outline-gold text-sm hidden md:inline-flex">View All</Link>
          </div>
        </div>

        {/* Scrollable row on mobile, grid on desktop */}
        <div ref={scrollRef}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
          {PACKAGES.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} i={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
