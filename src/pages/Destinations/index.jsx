import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Search, Star, ArrowRight } from 'lucide-react'
import SEO from '../../components/SEO'
import { DESTINATIONS } from '../../data'
import useReveal from '../../hooks/useReveal'

const REGIONS = ['All','Middle East','Europe','Africa','Asia','Americas','Indian Ocean']
const REGION_MAP = {
  'Middle East':['Dubai','Türkiye'],
  'Europe':['United Kingdom','France'],
  'Africa':['Kenya','South Africa','Rwanda'],
  'Asia':['Singapore'],
  'Americas':['Canada'],
  'Indian Ocean':['Maldives'],
}

export default function DestinationsPage() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.05 })
  const [q, setQ] = useState('')
  const [region, setRegion] = useState('All')

  const filtered = DESTINATIONS.filter(d => {
    const matchQ = !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.country.toLowerCase().includes(q.toLowerCase())
    const matchR = region === 'All' || (REGION_MAP[region]||[]).includes(d.name)
    return matchQ && matchR
  })

  return (
    <>
      <SEO title="Destinations" description="Explore the world with Apex Getaways — Dubai, UK, Canada, Maldives, Kenya, France, Turkey and more." />

      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden parallax-section" style={{background:'#0A1628'}}>
        <div className="absolute inset-0 opacity-25">
          <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&q=80" alt="" className="w-full h-full object-cover"/>
          <div className="absolute inset-0" style={{background:'rgba(10,22,40,0.82)'}}/>
        </div>
        <div className="relative container-pad text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-4">Where Will You Go?</span>
            <h1 className="font-display font-bold text-white mb-5" style={{fontSize:'clamp(2.5rem,6vw,4rem)'}}>
              Explore Destinations
            </h1>
            <p className="text-lg max-w-xl mx-auto mb-8" style={{color:'rgba(255,255,255,0.5)'}}>
              From the luxury of Dubai to the wild beauty of Kenya — Apex Getaways connects you to the world's finest destinations.
            </p>
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{color:'rgba(255,255,255,0.35)'}}/>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search destinations…"
                className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm text-white placeholder-white/30 focus:outline-none"
                style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)'}}
                onFocus={e=>{e.target.style.borderColor='#C9A84C'}}
                onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.15)'}}/>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Region filter */}
      <div className="sticky z-30 py-4" style={{top:'68px',background:'rgba(7,13,26,0.97)',backdropFilter:'blur(24px)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div className="container-pad flex flex-wrap gap-2 justify-center">
          {REGIONS.map(r=>(
            <button key={r} onClick={()=>setRegion(r)}
              className="px-4 py-2 rounded-full text-xs font-bold transition-all"
              style={{
                background:region===r?'linear-gradient(135deg,#C9A84C,#F5C842)':'rgba(255,255,255,0.05)',
                color:region===r?'#0A1628':'rgba(255,255,255,0.5)',
                border:region===r?'none':'1px solid rgba(255,255,255,0.1)',
              }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="section-pad" style={{background:'#070D1A'}} ref={ref}>
        <div className="container-pad">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🌍</p>
              <p className="text-white font-bold mb-1">No destinations found</p>
              <p className="text-sm" style={{color:'rgba(255,255,255,0.4)'}}>Try a different search or region</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((dest,i)=>(
                <motion.div key={dest.id}
                  initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}}
                  transition={{delay:i*0.07,duration:0.6,ease:[0.22,1,0.36,1]}}>
                  <Link to={`/destinations/${dest.id}`}
                    className="group block relative rounded-2xl overflow-hidden"
                    style={{height:'300px'}}>
                    <img src={dest.img} alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                    <div className="absolute inset-0 transition-all duration-300"
                      style={{background:'linear-gradient(to top,rgba(5,13,26,0.92) 0%,rgba(5,13,26,0.2) 50%,transparent 100%)'}}/>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                        style={{background:'rgba(201,168,76,0.9)',color:'#0A1628'}}>{dest.tag}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-lg">{dest.flag}</span>
                        <p className="text-xs" style={{color:'rgba(255,255,255,0.5)'}}>{dest.country}</p>
                      </div>
                      <h3 className="font-display font-bold text-white text-xl leading-tight">{dest.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs font-semibold" style={{color:'#C9A84C'}}>{dest.from}</p>
                        <div className="flex items-center gap-1">
                          <Star size={11} fill="#C9A84C" style={{color:'#C9A84C'}}/>
                          <span className="text-xs font-bold text-white">{dest.rating}</span>
                        </div>
                      </div>
                      <div className="mt-2 overflow-hidden max-h-0 group-hover:max-h-16 transition-all duration-300">
                        <div className="flex flex-wrap gap-1 pt-2">
                          {dest.attractions.slice(0,3).map(a=>(
                            <span key={a} className="text-[10px] px-2 py-0.5 rounded-full"
                              style={{background:'rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.7)'}}>{a}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                      style={{background:'rgba(201,168,76,0.9)'}}>
                      <ArrowRight size={14} style={{color:'#0A1628'}}/>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Countries coverage note */}
          <div className="mt-16 p-8 rounded-2xl text-center reveal"
            style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.2)'}}>
            <h3 className="font-display font-bold text-white text-xl mb-3">Don't See Your Destination?</h3>
            <p className="text-sm mb-2" style={{color:'rgba(255,255,255,0.5)'}}>
              We cover <strong className="text-gold">50+ countries</strong> including USA, Germany, Italy, Spain, Netherlands, Ireland, Switzerland, Qatar, Saudi Arabia, Malaysia, Thailand, Indonesia, Japan, China, Mauritius, Seychelles and many more.
            </p>
            <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.5)'}}>
              Contact us with your destination and we'll create a personalised itinerary.
            </p>
            <Link to="/contact" className="btn-gold">Request Custom Destination</Link>
          </div>
        </div>
      </section>
    </>
  )
}
