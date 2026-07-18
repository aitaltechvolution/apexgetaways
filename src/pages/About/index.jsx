import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { Instagram, Phone } from 'lucide-react'
import SEO from '../../components/SEO'
import { BRAND, CORE_VALUES } from '../../data'
import useReveal from '../../hooks/useReveal'
import useParallax from '../../hooks/useParallax'

export default function AboutPage() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.1 })
  const parallaxRef = useParallax(0.25)

  return (
    <>
      <SEO title="About Us" description={`Learn about ${BRAND.name} — our story, mission, vision and the team behind your trusted travel partner.`} />

      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden parallax-section" style={{ background:'#0A1628' }}>
        <div ref={parallaxRef} className="parallax-bg opacity-20 scale-110">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80" alt="" className="w-full h-full object-cover"/>
        </div>
        <div className="absolute inset-0" style={{ background:'rgba(10,22,40,0.88)' }}/>
        <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse at 30% 50%,rgba(201,168,76,0.08) 0%,transparent 60%)' }}/>
        <div className="relative container-pad text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-4">Who We Are</span>
            <h1 className="font-display font-bold text-white leading-tight mb-5" style={{fontSize:'clamp(2.5rem,6vw,4.5rem)'}}>
              About Apex Getaways
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{color:'rgba(255,255,255,0.55)'}}>
              {BRAND.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-pad" style={{background:'#070D1A'}}>
        <div className="container-pad grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-3">Our Story</span>
            <h2 className="font-display font-bold text-white mb-5" style={{fontSize:'clamp(1.8rem,3vw,2.5rem)'}}>
              A Trusted Partner<br/>for Every Journey
            </h2>
            <div className="h-0.5 w-12 mb-6" style={{background:'linear-gradient(90deg,#C9A84C,#F5C842)'}}/>
            <p className="text-sm leading-relaxed mb-4" style={{color:'rgba(255,255,255,0.55)'}}>
              Apex Getaways & Travel LTD is a trusted travel and immigration services company dedicated to making international travel simple, seamless, and stress-free. We provide personalised travel solutions for individuals, families, students, and businesses.
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{color:'rgba(255,255,255,0.55)'}}>
              Based in Abuja, Nigeria, we serve clients across the country and the diaspora, connecting them to opportunities in over 50 countries worldwide. From your first flight to full immigration support — we handle it all.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[['2026','Year Founded'],['50+','Countries'],['24/7','Support'],['100%','Satisfaction']].map(([v,l])=>(
                <div key={l} className="p-4 rounded-xl" style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.15)'}}>
                  <p className="font-display font-bold text-2xl" style={{color:'#C9A84C'}}>{v}</p>
                  <p className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{l}</p>
                </div>
              ))}
            </div>
            <Link to="/contact" className="btn-gold">Get In Touch</Link>
          </div>
          <div className="reveal right relative">
            <div className="rounded-2xl overflow-hidden" style={{height:'480px'}}>
              <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=80"
                alt="Travel" className="w-full h-full object-cover"/>
            </div>
            {/* Gold quote overlay */}
            <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl max-w-xs"
              style={{background:'linear-gradient(135deg,#C9A84C,#A07830)'}}>
              <p className="text-xs font-bold" style={{color:'rgba(10,22,40,0.7)'}}>Our Brand Promise</p>
              <p className="text-sm font-bold mt-1" style={{color:'#0A1628'}}>
                "Dependable, transparent, and personalised travel services."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-pad" style={{background:'#0A1628'}}>
        <div className="container-pad">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-3">Our Purpose</span>
            <h2 className="font-display font-bold text-white" style={{fontSize:'clamp(1.8rem,3vw,2.5rem)'}}>Mission & Vision</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {label:'Mission',icon:'🎯',text:BRAND.mission},
              {label:'Vision', icon:'🌍',text:BRAND.vision},
            ].map(({label,icon,text},i)=>(
              <motion.div key={label} ref={ref}
                initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}}
                transition={{delay:i*0.15}}
                className="p-8 rounded-2xl"
                style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(201,168,76,0.15)'}}>
                <span className="text-4xl mb-4 block">{icon}</span>
                <h3 className="font-display font-bold text-white text-xl mb-3">{label}</h3>
                <p className="text-sm leading-relaxed" style={{color:'rgba(255,255,255,0.5)'}}>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values — APEX acronym */}
      <section className="section-pad" style={{background:'#070D1A'}}>
        <div className="container-pad">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-3">What Drives Us</span>
            <h2 className="font-display font-bold text-white" style={{fontSize:'clamp(1.8rem,3vw,2.5rem)'}}>Our Core Values</h2>
            <div className="h-0.5 w-12 mx-auto mt-4" style={{background:'linear-gradient(90deg,#C9A84C,#F5C842)'}}/>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {CORE_VALUES.map(({letter,word,desc},i)=>(
              <motion.div key={letter}
                initial={{opacity:0,scale:0.88}} animate={inView?{opacity:1,scale:1}:{}}
                transition={{delay:i*0.1,type:'spring',bounce:0.3}}
                className="text-center p-6 rounded-2xl"
                style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
                <div className="font-display font-bold mb-3" style={{fontSize:'4rem',lineHeight:1,background:'linear-gradient(135deg,#C9A84C,#F5C842)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  {letter}
                </div>
                <h3 className="font-bold text-white mb-2">{word}</h3>
                <p className="text-xs leading-relaxed" style={{color:'rgba(255,255,255,0.4)'}}>{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Additional values list */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto reveal">
            {['Integrity','Excellence','Customer-Centric Service','Professionalism','Reliability','Innovation','Teamwork','Global Excellence','Respect','Commitment'].map(v=>(
              <div key={v} className="flex items-center gap-3 text-sm" style={{color:'rgba(255,255,255,0.6)'}}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:'#C9A84C'}}/>
                {v}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Profile */}
      <section className="section-pad" style={{background:'#0A1628'}}>
        <div className="container-pad max-w-4xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-3">Leadership</span>
            <h2 className="font-display font-bold text-white" style={{fontSize:'clamp(1.8rem,3vw,2.5rem)'}}>Meet the Founder</h2>
          </div>
          <div className="reveal">
            <div className="p-8 md:p-10 rounded-3xl flex flex-col md:flex-row gap-8 items-center"
              style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(201,168,76,0.2)'}}>
              {/* Avatar */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl flex items-center justify-center shrink-0 font-display font-bold text-6xl"
                style={{background:'linear-gradient(135deg,#C9A84C,#F5C842)',color:'#0A1628'}}>
                J
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-2xl mb-1">{BRAND.ceo.name}</h3>
                <p className="font-semibold mb-4 text-sm" style={{color:'#C9A84C'}}>{BRAND.ceo.title}</p>
                <p className="text-sm leading-relaxed mb-5" style={{color:'rgba(255,255,255,0.55)'}}>{BRAND.ceo.bio}</p>
                <div className="flex gap-3">
                  <a href={BRAND.instagram} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                    style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.25)',color:'#C9A84C'}}>
                    <Instagram size={13}/> Instagram
                  </a>
                  <a href={`tel:${BRAND.phone}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                    style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.25)',color:'#C9A84C'}}>
                    <Phone size={13}/> Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
