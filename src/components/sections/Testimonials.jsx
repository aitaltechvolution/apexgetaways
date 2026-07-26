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

  const next = () => { setDir(1); setActive(a => (a+1)%TESTIMONIALS.length) }
  const prev = () => { setDir(-1); setActive(a => (a-1+TESTIMONIALS.length)%TESTIMONIALS.length) }

  useEffect(() => {
    timer.current = setInterval(next, 5000)
    return () => clearInterval(timer.current)
  }, [])

  const t = TESTIMONIALS[active]

  return (
    <section className="section-pad bg-white">
      <div className="container-pad">
        <div className="text-center mb-14 reveal">
          <span className="text-base font-bold uppercase tracking-widest text-gold block mb-3">Client Stories</span>
          <h2 className="font-display font-bold text-primary" style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>What Our Travellers Say</h2>
          <div className="h-0.5 w-12 mx-auto mt-4" style={{ background:'linear-gradient(90deg,#C9A84C,#F5C842)' }} />
        </div>

        {/* Main feature testimonial */}
        <div className="max-w-3xl mx-auto mb-12 reveal">
          <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden bg-white"
            style={{ border:'1px solid rgba(201,168,76,0.3)', boxShadow:'0 12px 40px rgba(10,22,40,0.08)' }}>
            {/* Large quote mark */}
            <Quote size={80} className="absolute top-6 right-8 opacity-10" style={{ color:'#C9A84C' }} />

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={active}
                custom={dir}
                initial={{ opacity:0, x: dir * 40 }}
                animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x: dir * -40 }}
                transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}>
                <div className="flex gap-0.5 mb-6">
                  {Array.from({length:t.stars}).map((_,i) => (
                    <Star key={i} size={16} fill="#C9A84C" style={{ color:'#C9A84C' }} />
                  ))}
                </div>
                <p className="text-lg md:text-xl leading-relaxed italic mb-8 text-gray-800">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg"
                    style={{ background:'linear-gradient(135deg,#C9A84C,#F5C842)', color:'#0A1628' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-primary">{t.name}</p>
                    <p className="text-base text-gray-600">{t.role} · Travelled to {t.dest}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-8">
              <button onClick={prev} className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C' }}>
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-2 flex-1">
                {TESTIMONIALS.map((_,i) => (
                  <button key={i} onClick={() => { setDir(i>active?1:-1); setActive(i); clearInterval(timer.current) }}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{ flex: active===i?3:1, background: active===i?'#C9A84C':'rgba(10,22,40,0.12)' }} />
                ))}
              </div>
              <button onClick={next} className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* All testimonial mini cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t2, i) => (
            <motion.button key={i} onClick={() => { setDir(i>active?1:-1); setActive(i) }}
              whileHover={{ y:-4 }}
              className="text-left p-4 rounded-2xl transition-all duration-300 cursor-pointer"
              style={{
                background: active===i ? 'rgba(201,168,76,0.08)' : '#F8F6F2',
                border: active===i ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(10,22,40,0.08)',
              }}>
              <div className="flex gap-0.5 mb-2">
                {Array.from({length:t2.stars}).map((_,j) => <Star key={j} size={10} fill="#C9A84C" style={{ color:'#C9A84C' }} />)}
              </div>
              <p className="text-base leading-relaxed mb-3 line-clamp-2 text-gray-700">"{t2.text}"</p>
              <div>
                <p className="text-base font-bold text-primary">{t2.name}</p>
                <p className="text-[13px] text-gray-600">{t2.role}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
