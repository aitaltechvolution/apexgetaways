import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, Clock, Star, Users, Globe, Zap } from 'lucide-react'
import useReveal from '../../hooks/useReveal'
import useParallax from '../../hooks/useParallax'

const WHY = [
  { icon:Shield, title:'100% Trusted & Verified', desc:'Licensed agency operating with full transparency. Your documents, payments, and data are always secure.' },
  { icon:Clock,  title:'24/7 Expert Support',     desc:'Round-the-clock assistance via phone, WhatsApp, and email — we\'re always here for you.' },
  { icon:Star,   title:'Personalised Service',    desc:'Every itinerary is tailored to your specific needs, timeline, and budget — no one-size-fits-all.' },
  { icon:Users,  title:'Families & Students',     desc:'Specialised packages for families, students studying abroad, pilgrims, and corporate travellers.' },
  { icon:Globe,  title:'50+ Countries Covered',   desc:'From Abuja to Dubai, London, Canada, and beyond — we\'ve built trusted networks worldwide.' },
  { icon:Zap,    title:'Fast Processing',         desc:'Quick visa guidance, swift bookings, and efficient documentation — no unnecessary delays.' },
]

export default function WhyChooseUs() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.05 })
  const parallaxRef = useParallax(0.25)

  return (
    <section className="section-pad parallax-section overflow-hidden" ref={ref}
      style={{ background:'#0A1628' }}>
      {/* Parallax BG */}
      <div ref={parallaxRef} className="parallax-bg opacity-20">
        <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80" alt=""
          className="w-full h-full object-cover scale-125" />
      </div>
      <div className="absolute inset-0" style={{ background:'rgba(10,22,40,0.9)' }} />

      <div className="container-pad relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <div>
            <div className="reveal">
              <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-3">Why Apex Getaways?</span>
              <h2 className="font-display font-bold text-white leading-tight mb-6" style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>
                Travel Better.<br />
                <span style={{ color:'#C9A84C' }}>Travel Smarter.</span>
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color:'rgba(255,255,255,0.5)' }}>
                Since our founding, Apex Getaways & Travel LTD has been dedicated to one mission — making international travel simple, seamless, and stress-free for every Nigerian.
              </p>
              <blockquote className="border-l-2 border-gold pl-5 italic text-sm" style={{ color:'rgba(255,255,255,0.6)' }}>
                "Empowering individuals and families to explore the world through trusted travel, visa, and immigration services delivered with excellence."
              </blockquote>
              <p className="mt-3 text-xs font-bold text-gold">— Joy Abuh Ojochenemi, Founder & CEO</p>
            </div>
          </div>

          {/* Right grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY.map(({ icon:Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity:0, y:24 }} animate={inView ? { opacity:1, y:0 } : {}}
                transition={{ delay: 0.1 + i*0.08, duration:0.6, ease:[0.22,1,0.36,1] }}
                className="p-5 rounded-2xl"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background:'rgba(201,168,76,0.12)' }}>
                  <Icon size={18} style={{ color:'#C9A84C' }} />
                </div>
                <h3 className="font-bold text-sm text-white mb-1.5">{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color:'rgba(255,255,255,0.4)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
