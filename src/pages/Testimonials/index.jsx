import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import SEO from '../../components/SEO'
import { PageHero } from '../../components/ui/PageHero'
import { TESTIMONIALS } from '../../data'

const ALL = [
  ...TESTIMONIALS,
  { name:'Taiwo Olawale', role:'Ibadan', text:'I was nervous about flying for the first time, but the Apex team walked me through everything step by step. They even called to check on me during my layover. Truly remarkable service.', stars:5 },
  { name:'Dr. Chibuzor Nwachukwu', role:'Enugu', text:'My wife and I celebrated our 10th anniversary in Maldives arranged by Apex Getaways. The water villa was breathtaking. We have already booked our next trip with them.', stars:5 },
  { name:'Halima Abubakar', role:'Kano', text:'Got my UK visa in 2 weeks with their help after failing twice on my own. The documentation guidance is thorough and professional. I would not try any visa without Apex again.', stars:5 },
]

export default function TestimonialsPage() {
  return (
    <>
      <SEO title="Client Testimonials" description="Read what our happy travellers say about Apex Getaways." />
      <PageHero label="Client Stories" title="What Our Travellers Say" subtitle="Over 10,000 satisfied clients — hear their stories." />
      <section className="section-pad bg-surface-light dark:bg-surface-dark">
        <div className="container-pad grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL.map((t, i) => (
            <motion.div key={t.name} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}} className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <Quote size={28} className="text-primary/20 mb-4" />
              <p className="text-base text-gray-600 dark:text-gray-600 leading-relaxed flex-1 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center text-white font-bold">{t.name[0]}</div>
                <div><p className="font-bold text-base text-gray-900 dark:text-white">{t.name}</p><p className="text-sm text-gray-600">{t.role}</p></div>
                <div className="ml-auto flex gap-0.5">{Array.from({length:t.stars}).map((_,j)=><Star key={j} size={12} fill="#F5A623" className="text-accent"/>)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
