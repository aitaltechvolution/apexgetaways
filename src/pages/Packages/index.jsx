import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Clock, Check, ArrowRight, Phone } from 'lucide-react'
import SEO from '../../components/SEO'
import { PACKAGES, formatNGN, BRAND } from '../../data'
import useReveal from '../../hooks/useReveal'

const FILTERS = ['All','Best Seller','Romantic','Popular','Cultural','Adventure','Luxury']

export default function PackagesPage() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.05 })
  const [active, setActive] = useState('All')
  const filtered = active==='All' ? PACKAGES : PACKAGES.filter(p=>p.tag===active)

  return (
    <>
      <SEO title="Tour Packages" description="Explore Apex Getaways holiday packages — Dubai, Canada, Paris, UK, Turkey, Maldives and more." />

      {/* Hero */}
      <section className="relative pt-36 pb-20" style={{background:'linear-gradient(135deg,#050D1A,#0A1628)'}}>
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&q=80" alt="" className="w-full h-full object-cover"/>
          <div className="absolute inset-0" style={{background:'rgba(5,13,26,0.85)'}}/>
        </div>
        <div className="relative container-pad text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-4">Curated Getaways</span>
            <h1 className="font-display font-bold text-white mb-5" style={{fontSize:'clamp(2.5rem,6vw,4rem)'}}>Tour Packages</h1>
            <p className="text-lg max-w-2xl mx-auto mb-2" style={{color:'rgba(255,255,255,0.5)'}}>
              All-inclusive experiences combining flights, hotels, transfers and guided tours — fully handled by Apex Getaways.
            </p>
            <p className="text-sm font-semibold" style={{color:'#C9A84C'}}>
              Flexible payments · Visa assistance included · 24/7 support
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky z-30 py-4" style={{top:'68px',background:'rgba(7,13,26,0.97)',backdropFilter:'blur(24px)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div className="container-pad flex flex-wrap gap-2 justify-center">
          {FILTERS.map(f=>(
            <button key={f} onClick={()=>setActive(f)}
              className="px-5 py-2 rounded-full text-xs font-bold transition-all"
              style={{
                background:active===f?'linear-gradient(135deg,#C9A84C,#F5C842)':'rgba(255,255,255,0.05)',
                color:active===f?'#0A1628':'rgba(255,255,255,0.5)',
                border:active===f?'none':'1px solid rgba(255,255,255,0.1)',
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="section-pad" style={{background:'#070D1A'}} ref={ref}>
        <div className="container-pad">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pkg,i)=>{
              const save=Math.round(((pkg.oldPrice-pkg.price)/pkg.oldPrice)*100)
              return (
                <motion.div key={pkg.id}
                  initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}}
                  transition={{delay:i*0.08,duration:0.6,ease:[0.22,1,0.36,1]}}>
                  <Link to={`/packages/${pkg.id}`}
                    className="group block rounded-2xl overflow-hidden h-full"
                    style={{background:'#0F1826',border:'1px solid rgba(255,255,255,0.06)',transition:'all 0.35s ease'}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(201,168,76,0.35)';e.currentTarget.style.transform='translateY(-6px)'}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.06)';e.currentTarget.style.transform='translateY(0)'}}>
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{height:'240px'}}>
                      <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                      <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(5,13,26,0.75) 0%,transparent 60%)'}}/>
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{background:'rgba(201,168,76,0.9)',color:'#0A1628'}}>{pkg.tag}</span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white">Save {save}%</span>
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="text-2xl">{pkg.flag}</span>
                        <span className="flex items-center gap-1 text-xs text-white/70"><Clock size={11}/>{pkg.nights} nights</span>
                      </div>
                    </div>
                    {/* Body */}
                    <div className="p-6">
                      <p className="text-xs mb-1" style={{color:'rgba(255,255,255,0.35)'}}>{pkg.dest}</p>
                      <h3 className="font-display font-bold text-white text-lg mb-4 leading-snug">{pkg.title}</h3>
                      <ul className="space-y-2 mb-5">
                        {pkg.includes.slice(0,5).map(inc=>(
                          <li key={inc} className="flex items-center gap-2 text-xs" style={{color:'rgba(255,255,255,0.45)'}}>
                            <Check size={11} style={{color:'#C9A84C'}} className="shrink-0"/>{inc}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-end justify-between pt-4" style={{borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                        <div>
                          <p className="text-xs line-through" style={{color:'rgba(255,255,255,0.2)'}}>{formatNGN(pkg.oldPrice)}</p>
                          <p className="font-display font-bold text-xl" style={{color:'#C9A84C'}}>{formatNGN(pkg.price)}</p>
                          <p className="text-[11px]" style={{color:'rgba(255,255,255,0.3)'}}>per person</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold" style={{color:'#C9A84C'}}>
                          View Details <ArrowRight size={12}/>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Custom package CTA */}
          <div className="mt-16 p-8 md:p-12 rounded-3xl text-center reveal"
            style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.2)'}}>
            <span className="text-3xl block mb-4">✈️</span>
            <h3 className="font-display font-bold text-white text-2xl mb-3">Can't Find the Right Package?</h3>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{color:'rgba(255,255,255,0.5)'}}>
              We create fully custom itineraries for families, honeymoons, groups, pilgrims, students, and corporate travellers. Just tell us your dream trip.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="btn-gold">Request Custom Package</Link>
              <a href={`tel:${BRAND.phone}`} className="btn-outline-gold flex items-center gap-2">
                <Phone size={14}/>{BRAND.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
