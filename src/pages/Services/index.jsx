import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight } from 'lucide-react'
import SEO from '../../components/SEO'
import { SERVICES, BRAND } from '../../data'
import useReveal from '../../hooks/useReveal'

export default function ServicesPage() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.05 })

  return (
    <>
      <SEO title="Our Services" description="Apex Getaways offers flights, visa assistance, study abroad, hotels, airport transfers, holiday packages, immigration consultation and more."/>

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{background:'#0A1628'}}>
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80" alt="" className="w-full h-full object-cover"/>
          <div className="absolute inset-0" style={{background:'rgba(10,22,40,0.85)'}}/>
        </div>
        <div className="relative container-pad text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-4">Everything You Need</span>
            <h1 className="font-display font-bold text-white mb-4" style={{fontSize:'clamp(2.5rem,6vw,4rem)'}}>Our Services</h1>
            <p className="text-lg max-w-2xl mx-auto" style={{color:'rgba(255,255,255,0.5)'}}>
              From your first flight booking to full immigration consultation — Apex Getaways & Travel LTD is your single trusted partner for every travel need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <section className="section-pad" style={{background:'#070D1A'}} ref={ref}>
        <div className="container-pad">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s,i)=>(
              <motion.div key={s.id}
                initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}}
                transition={{delay:i*0.07,duration:0.6,ease:[0.22,1,0.36,1]}}>
                <Link to={`/services/${s.id}`}
                  className="group flex flex-col p-7 rounded-2xl h-full transition-all duration-300"
                  style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.06)';e.currentTarget.style.borderColor='rgba(201,168,76,0.25)';e.currentTarget.style.transform='translateY(-5px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';e.currentTarget.style.transform='translateY(0)'}}>
                  <span className="text-4xl mb-5 block">{s.icon}</span>
                  <h3 className="font-display font-bold text-white text-lg mb-3 leading-snug">{s.title}</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{color:'rgba(255,255,255,0.45)'}}>{s.desc}</p>
                  <div className="flex items-center gap-1.5 mt-5 text-xs font-bold group-hover:gap-2.5 transition-all" style={{color:'#C9A84C'}}>
                    Learn More <ArrowRight size={12}/>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 p-10 rounded-3xl text-center reveal"
            style={{background:'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03))',border:'1px solid rgba(201,168,76,0.2)'}}>
            <p className="text-3xl mb-4">🌍</p>
            <h3 className="font-display font-bold text-white text-2xl mb-3">Not Sure Which Service You Need?</h3>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{color:'rgba(255,255,255,0.5)'}}>
              Our travel consultants offer free, no-obligation consultations. Tell us your goal — we'll recommend the right solution.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="btn-gold">Free Consultation</Link>
              <a href={`tel:${BRAND.phone}`} className="btn-outline-gold">Call {BRAND.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
