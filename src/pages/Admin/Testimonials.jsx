import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { TESTIMONIALS } from '../../data'
import useReveal from '../../hooks/useReveal'

export default function Testimonials() {
  useReveal()
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const timer = useRef(null)

  const next = () => { setDir(1);  setActive(a => (a + 1) % TESTIMONIALS.length) }
  const prev = () => { setDir(-1); setActive(a => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length) }

  useEffect(() => {
    timer.current = setInterval(next, 5000)
    return () => clearInterval(timer.current)
  }, [])

  const t = TESTIMONIALS[active]

  return (
    <section className="section-pad" style={{ background: '#f8f6f2' }}>
      <div className="container-pad">
        <div className="text-center mb-14 reveal">
          <span className="section-label">Client Stories</span>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: '#0A1628' }}>
            What Our Travellers Say
          </h2>
          <div className="gold-rule gold-rule-center"/>
        </div>

        {/* Featured */}
        <div className="max-w-3xl mx-auto mb-12 reveal">
          <div className="relative p-8 md:p-12 rounded-3xl bg-white overflow-hidden"
            style={{ border: '1px solid rgba(201,168,76,0.25)', boxShadow: '0 8px 40px rgba(201,168,76,0.1)' }}>
            <Quote size={72} className="absolute top-6 right-8 opacity-5" style={{ color: '#C9A84C' }}/>

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={active}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} fill="#C9A84C" style={{ color: '#C9A84C' }}/>
                  ))}
                </div>
                <p className="text-lg md:text-xl leading-relaxed italic mb-7" style={{ color: '#333' }}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-base"
                    style={{ background: 'linear-gradient(135deg,#C9A84C,#F5C842)', color: '#0A1628' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-base" style={{ color: '#0A1628' }}>{t.name}</p>
                    <p className="text-sm" style={{ color: '#999' }}>{t.role} · Travelled to {t.dest}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3 mt-8">
              <button onClick={prev}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ border: '1.5px solid #C9A84C', color: '#C9A84C', background: 'white' }}>
                <ChevronLeft size={16}/>
              </button>
              <div className="flex gap-2 flex-1">
                {TESTIMONIALS.map((_, i) => (
                  <button key={i}
                    onClick={() => { setDir(i > active ? 1 : -1); setActive(i); clearInterval(timer.current) }}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{ flex: active === i ? 3 : 1, background: active === i ? '#C9A84C' : '#ddd' }}/>
                ))}
              </div>
              <button onClick={next}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ border: '1.5px solid #C9A84C', color: '#C9A84C', background: 'white' }}>
                <ChevronRight size={16}/>
              </button>
            </div>
          </div>
        </div>

        {/* Mini cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t2, i) => (
            <motion.button key={i}
              onClick={() => { setDir(i > active ? 1 : -1); setActive(i) }}
              whileHover={{ y: -3 }}
              className="text-left p-4 rounded-2xl bg-white transition-all duration-200"
              style={{
                border: `1.5px solid ${active === i ? '#C9A84C' : 'rgba(201,168,76,0.15)'}`,
                boxShadow: active === i ? '0 4px 20px rgba(201,168,76,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
              }}>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: t2.stars }).map((_, j) => (
                  <Star key={j} size={10} fill="#C9A84C" style={{ color: '#C9A84C' }}/>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-2 line-clamp-2" style={{ color: '#555' }}>"{t2.text}"</p>
              <p className="text-sm font-bold" style={{ color: '#0A1628' }}>{t2.name}</p>
              <p className="text-[12px]" style={{ color: '#aaa' }}>{t2.role}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}