import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { SectionTitle } from '../ui'

const STEPS = [
  { n:'01', title:'Tell Us Your Dream', desc:'Share your destination, dates, budget and preferences with our travel experts via the booking form, WhatsApp, or phone.' },
  { n:'02', title:'Get a Custom Plan', desc:'We curate a personalised itinerary — flights, hotels, transfers, visa, insurance — all matched to your exact needs.' },
  { n:'03', title:'Confirm & Pay Securely', desc:'Review your package, approve the details, and pay securely online or at our office. Full documentation provided.' },
  { n:'04', title:'Travel & Enjoy', desc:'You travel with full peace of mind — our 24/7 support team is always available if you need anything during your trip.' },
]

export default function HowItWorks() {
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.1 })
  return (
    <section className="section-pad bg-white dark:bg-navy/50" ref={ref}>
      <div className="container-pad">
        <SectionTitle label="Our Process" title="How It Works" subtitle="Getting your dream trip booked is simple — four easy steps and you are on your way." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          {STEPS.map((s,i) => (
            <motion.div key={s.n} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:i*0.12}} className="text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-primary-gradient text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-5 shadow-glow">
                {s.n}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-base text-gray-600 dark:text-gray-600 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
