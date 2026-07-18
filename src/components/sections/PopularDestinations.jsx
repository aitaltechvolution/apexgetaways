import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Star, MapPin } from 'lucide-react'
import { DESTINATIONS } from '../../data'
import useReveal from '../../hooks/useReveal'

const FILTERS = ['All','Luxury','Culture','Romance','Adventure','Safari','Education']

export default function PopularDestinations() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.05 })
  const [active, setActive] = useState('All')

  const filtered = active==='All' ? DESTINATIONS : DESTINATIONS.filter(d=>d.tag===active)

  return (
    <section className="section-pad" style={{ background:'#070D1A' }} ref={ref}>
      <div className="container-pad">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-3">Where Will You Go?</span>
            <h2 className="font-display font-bold text-white leading-tight" style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>
              Popular<br />Destinations
            </h2>
            <div className="h-0.5 w-12 mt-4" style={{ background:'linear-gradient(90deg,#C9A84C,#F5C842)' }} />
          </div>
          <Link to="/destinations" className="reveal btn-outline-gold shrink-0 self-start md:self-auto">
            All Destinations <ArrowRight size={15}/>
          </Link>
        </div>

        {/* Filter pills */}
        <div className="reveal flex flex-wrap gap-2 mb-10">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
              style={{
                background: active===f ? 'linear-gradient(135deg,#C9A84C,#F5C842)' : 'rgba(255,255,255,0.05)',
                color: active===f ? '#0A1628' : 'rgba(255,255,255,0.5)',
                border: active===f ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((dest, i) => (
            <motion.div key={dest.id}
              initial={{ opacity:0, y:30 }} animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ delay: i * 0.07, duration:0.6, ease:[0.22,1,0.36,1] }}>
              <Link to={`/destinations/${dest.id}`}
                className="group block relative rounded-2xl overflow-hidden"
                style={{ height:'300px' }}>
                <img src={dest.img} alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {/* Gradient overlay */}
                <div className="absolute inset-0 transition-all duration-300"
                  style={{ background:'linear-gradient(to top,rgba(5,13,26,0.92) 0%,rgba(5,13,26,0.3) 50%,transparent 100%)' }} />
                {/* Tag badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{ background:'rgba(201,168,76,0.9)', color:'#0A1628' }}>{dest.tag}</span>
                </div>
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-lg">{dest.flag}</span>
                        <p className="text-xs text-white/50">{dest.country}</p>
                      </div>
                      <h3 className="font-display font-bold text-white text-xl leading-tight">{dest.name}</h3>
                      <p className="text-xs font-semibold mt-1" style={{ color:'#C9A84C' }}>{dest.from}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 mt-1">
                      <Star size={12} fill="#C9A84C" style={{ color:'#C9A84C' }} />
                      <span className="text-xs font-bold text-white">{dest.rating}</span>
                    </div>
                  </div>
                  {/* Hover: show top attractions */}
                  <div className="mt-3 overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-20">
                    <div className="flex flex-wrap gap-1.5">
                      {dest.attractions.slice(0,3).map(a => (
                        <span key={a} className="text-[10px] px-2 py-0.5 rounded-full text-white/70"
                          style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.1)' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Arrow on hover */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                  style={{ background:'rgba(201,168,76,0.9)' }}>
                  <ArrowRight size={14} style={{ color:'#0A1628' }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
