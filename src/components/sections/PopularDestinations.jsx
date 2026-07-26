import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Star } from 'lucide-react'
import { DESTINATIONS } from '../../data'
import useReveal from '../../hooks/useReveal'

const FILTERS = ['All', 'Luxury', 'Culture', 'Romance', 'Adventure', 'Safari', 'Education']

export default function PopularDestinations() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? DESTINATIONS : DESTINATIONS.filter(d => d.tag === active)

  return (
    <section className="section-pad" style={{ background: '#f8f6f2' }} ref={ref}>
      <div className="container-pad">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="reveal">
            <span className="section-label">Where Will You Go?</span>
            <h2 className="font-display font-bold leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: '#0A1628' }}>
              Popular Destinations
            </h2>
            <div className="gold-rule"/>
          </div>
          <Link to="/destinations" className="reveal btn-outline-gold shrink-0 self-start md:self-auto">
            All Destinations <ArrowRight size={15}/>
          </Link>
        </div>

        {/* Filter pills */}
        <div className="reveal flex flex-wrap gap-2 mb-10">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className="px-4 py-2 rounded-full text-base font-bold transition-all duration-200"
              style={{
                background: active === f ? '#0A1628' : '#fff',
                color: active === f ? '#fff' : '#555',
                border: `1.5px solid ${active === f ? '#0A1628' : 'rgba(201,168,76,0.3)'}`,
              }}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((dest, i) => (
            <motion.div key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <Link to={`/destinations/${dest.id}`}
                className="group block relative rounded-2xl overflow-hidden"
                style={{ height: '300px' }}>
                <img src={dest.img} alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                {/* Gradient */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(10,22,40,0.88) 0%, rgba(10,22,40,0.2) 55%, transparent 100%)' }}/>
                {/* Tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[12px] font-bold"
                    style={{ background: 'rgba(201,168,76,0.9)', color: '#0A1628' }}>
                    {dest.tag}
                  </span>
                </div>
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display font-bold text-white text-xl leading-tight">{dest.name}</h3>
                  <p className="text-base mt-0.5 mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>{dest.country}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold" style={{ color: '#F5C842' }}>{dest.from}</p>
                    <div className="flex items-center gap-1">
                      <Star size={11} fill="#C9A84C" style={{ color: '#C9A84C' }}/>
                      <span className="text-base font-bold text-white">{dest.rating}</span>
                    </div>
                  </div>
                  {/* Hover attractions */}
                  <div className="overflow-hidden max-h-0 group-hover:max-h-16 transition-all duration-300 mt-2">
                    <div className="flex flex-wrap gap-1">
                      {dest.attractions.slice(0, 3).map(a => (
                        <span key={a} className="text-[12px] px-2 py-0.5 rounded-full text-white"
                          style={{ background: 'rgba(255,255,255,0.12)' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Arrow on hover */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                  style={{ background: 'rgba(201,168,76,0.9)' }}>
                  <ArrowRight size={14} style={{ color: '#0A1628' }}/>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}