import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Tag, ArrowRight } from 'lucide-react'
import { PACKAGES } from '../../data'
import { formatNGN } from '../../lib/utils'
import { SectionTitle, Badge } from '../ui'

export default function SpecialOffers() {
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.1 })
  const featured = PACKAGES.slice(0,3)
  return (
    <section className="section-pad bg-surface-light dark:bg-surface-dark" ref={ref}>
      <div className="container-pad">
        <div className="flex items-end justify-between mb-12">
          <SectionTitle label="Limited Time Deals" title="Special Offers" subtitle="Exclusive packages with significant savings — available for a limited time only." center={false} />
          <Link to="/packages" className="hidden sm:flex items-center gap-1.5 text-base font-bold text-primary hover:gap-2.5 transition-all">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((pkg,i) => {
            const save = Math.round(((pkg.oldPrice-pkg.price)/pkg.oldPrice)*100)
            return (
              <motion.div key={pkg.id} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:i*0.1}}>
                <Link to={`/packages/${pkg.id}`} className="group block bg-white dark:bg-card-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                  <div className="relative overflow-hidden h-48">
                    <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-lg">Save {save}%</span>
                    <span className="absolute top-3 right-3 bg-accent text-navy text-sm font-bold px-2.5 py-1 rounded-lg">{pkg.tag}</span>
                    <p className="absolute bottom-3 left-3 text-white font-bold">{pkg.nights} Nights · {pkg.dest}</p>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">{pkg.title}</h3>
                    <ul className="space-y-1 mb-4">
                      {pkg.includes.map(inc => (
                        <li key={inc} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-600">
                          <span className="w-1 h-1 rounded-full bg-accent shrink-0" />{inc}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-end justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="text-sm text-gray-600 line-through">{formatNGN(pkg.oldPrice)}</p>
                        <p className="font-bold text-primary text-lg">{formatNGN(pkg.price)}</p>
                      </div>
                      <span className="text-sm font-bold text-primary flex items-center gap-1">Book Now <ArrowRight size={12} /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
