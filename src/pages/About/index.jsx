import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { Instagram, Phone, Target, Eye, Award } from 'lucide-react'
import SEO from '../../components/SEO'
import { BRAND, CORE_VALUES } from '../../data'
import useReveal from '../../hooks/useReveal'
import useParallax from '../../hooks/useParallax'

export default function AboutPage() {
  useReveal()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const parallaxRef = useParallax(0.25)

  return (
    <>
      <SEO title="About Us" description={`Learn about ${BRAND.name} — our story, mission, vision, and the team behind your trusted travel partner.`} />

      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden parallax-section" style={{ background: '#F8F6F2' }}>
        <div ref={parallaxRef} className="parallax-bg opacity-10 scale-110">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80" alt="" className="w-full h-full object-cover"/>
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 50%,rgba(201,168,76,0.12) 0%,transparent 60%)' }}/>
        <div className="relative container-pad text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="text-sm font-bold uppercase tracking-widest text-gold block mb-4">Who We Are</span>
            <h1 className="font-display font-bold text-primary leading-tight mb-5" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)' }}>
              About Apex Getaways
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#374151' }}>
              {BRAND.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-pad" style={{ background: '#F8F6F2' }}>
        <div className="container-pad grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <span className="text-sm font-bold uppercase tracking-widest text-gold block mb-3">Our Story</span>
            <h2 className="font-display font-bold text-primary mb-5" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
              A Trusted Partner<br/>for Every Journey
            </h2>
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg,#C9A84C,#F5C842)' }}/>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#374151' }}>
              Apex Getaways & Travel LTD is a trusted travel and immigration services company dedicated to making international travel simple, seamless, and stress-free. We serve individuals, families, students, and businesses across Nigeria and the diaspora.
            </p>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#374151' }}>
              Based in Abuja, Nigeria, we connect clients to opportunities in over 50 countries — from their first flight booking to full immigration support.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[['2026', 'Year Founded'], ['50+', 'Countries'], ['24/7', 'Support'], ['100%', 'Satisfaction']].map(([v, l]) => (
                <div key={l} className="p-4 rounded-xl" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <p className="font-display font-bold text-2xl" style={{ color: '#C9A84C' }}>{v}</p>
                  <p className="text-sm" style={{ color: '#4B5563' }}>{l}</p>
                </div>
              ))}
            </div>
            <Link to="/contact" className="btn-gold">Get In Touch</Link>
          </div>
          <div className="reveal right relative">
            <div className="rounded-2xl overflow-hidden" style={{ height: '480px' }}>
              <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=80"
                alt="Travel" className="w-full h-full object-cover"/>
            </div>
            <div className="absolute -bottom-6 -left-6 p-5 rounded-2xl max-w-xs"
              style={{ background: 'linear-gradient(135deg,#C9A84C,#A07830)' }}>
              <p className="text-sm font-bold mb-1" style={{ color: 'rgba(10,22,40,0.7)' }}>Our Brand Promise</p>
              <p className="text-base font-bold" style={{ color: '#0A1628' }}>
                "Dependable, transparent, and personalised travel services."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-pad" style={{ background: '#FFFFFF' }}>
        <div className="container-pad">
          <div className="text-center mb-14 reveal">
            <span className="text-sm font-bold uppercase tracking-widest text-gold block mb-3">Our Purpose</span>
            <h2 className="font-display font-bold text-primary" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>Mission & Vision</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Mission', Icon: Target, text: BRAND.mission },
              { label: 'Vision',  Icon: Eye,    text: BRAND.vision },
            ].map(({ label, Icon, text }, i) => (
              <motion.div key={label} ref={ref}
                initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15 }}
                className="p-8 rounded-2xl"
                style={{ background: '#F3F4F6', border: '1px solid rgba(201,168,76,0.15)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(201,168,76,0.1)' }}>
                  <Icon size={22} style={{ color: '#C9A84C' }}/>
                </div>
                <h3 className="font-display font-bold text-primary text-xl mb-3">{label}</h3>
                <p className="text-base leading-relaxed" style={{ color: '#374151' }}>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values — APEX acronym */}
      <section className="section-pad" style={{ background: '#F8F6F2' }}>
        <div className="container-pad">
          <div className="text-center mb-14 reveal">
            <span className="text-sm font-bold uppercase tracking-widest text-gold block mb-3">What Drives Us</span>
            <h2 className="font-display font-bold text-primary" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>Core Values</h2>
            <div className="h-0.5 w-12 mx-auto mt-4" style={{ background: 'linear-gradient(90deg,#C9A84C,#F5C842)' }}/>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {CORE_VALUES.map(({ letter, word, desc }, i) => (
              <motion.div key={letter}
                initial={{ opacity: 0, scale: 0.88 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, type: 'spring', bounce: 0.3 }}
                className="text-center p-6 rounded-2xl"
                style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(10,22,40,0.05)' }}>
                <div className="font-display font-bold mb-3"
                  style={{ fontSize: '4rem', lineHeight: 1, background: 'linear-gradient(135deg,#C9A84C,#F5C842)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {letter}
                </div>
                <h3 className="font-bold text-primary mb-2">{word}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto reveal">
            {['Integrity', 'Excellence', 'Customer-Centric Service', 'Professionalism', 'Reliability', 'Innovation', 'Teamwork', 'Global Excellence', 'Respect', 'Commitment'].map(v => (
              <div key={v} className="flex items-center gap-3 text-base" style={{ color: '#1F2937' }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#C9A84C' }}/>
                {v}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Profile — REAL PHOTO */}
      <section className="section-pad" style={{ background: '#F8F6F2' }}>
        <div className="container-pad max-w-5xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="text-sm font-bold uppercase tracking-widest text-gold block mb-3">Leadership</span>
            <h2 className="font-display font-bold text-primary" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>Meet the Founder</h2>
          </div>
          <div className="reveal">
            <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden"
              style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
              {/* CEO Photo */}
              <div className="relative overflow-hidden" style={{ minHeight: '480px' }}>
                <img
                  src="/ceo.jpg"
                  alt="Mrs. Joy Nathaniel — Founder & CEO, Apex Getaways & Travel LTD"
                  className="w-full h-full object-cover object-top"
                  style={{ minHeight: '480px' }}
                />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to right, transparent 60%, rgba(243,244,246,0.95) 100%)' }}/>
              </div>

              {/* CEO Info */}
              <div className="flex flex-col justify-center p-8 md:p-10"
                style={{ background: 'linear-gradient(135deg,#F3F4F6,#F3F4F6)' }}>
                <div className="mb-2">
                  <div className="h-0.5 w-10 mb-4" style={{ background: 'linear-gradient(90deg,#C9A84C,#F5C842)' }}/>
                  <h3 className="font-display font-bold text-primary text-3xl mb-1">{BRAND.ceo.name}</h3>
                  <p className="font-semibold mb-5" style={{ color: '#C9A84C' }}>{BRAND.ceo.title}</p>
                  <p className="text-base leading-relaxed mb-6" style={{ color: '#1F2937' }}>{BRAND.ceo.bio}</p>
                </div>

                <blockquote className="border-l-2 border-gold pl-4 mb-6 italic text-base" style={{ color: '#374151' }}>
                  "Our mission is to make every journey smooth, secure, and truly memorable."
                </blockquote>

                <div className="flex gap-3 flex-wrap">
                  <a href={BRAND.instagram} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}>
                    <Instagram size={13}/> Instagram
                  </a>
                  <a href={`tel:${BRAND.phone}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}>
                    <Phone size={13}/> {BRAND.phone}
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
