import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plane, Hotel, Car, Package, Bus, Shield } from 'lucide-react'
import SEO from '../../components/SEO'

const SERVICES = [
  { to:'/booking/flights', icon:Plane, title:'Flight Booking', desc:'One-way, round trip, or multi-city. Economy to First Class. All airlines.', color:'from-blue-500 to-blue-700', badge:'Most Popular' },
  { to:'/booking/hotels', icon:Hotel, title:'Hotel Reservation', desc:'Budget to 5-star luxury. 190+ countries. Free cancellation options.', color:'from-amber-500 to-orange-600', badge:null },
  { to:'/booking/pickup', icon:Car, title:'Airport Pickup & Car Hire', desc:'Professional drivers. Sedans, SUVs, minivans, luxury & coaches.', color:'from-green-500 to-emerald-700', badge:null },
  { to:'/packages', icon:Package, title:'Holiday Packages', desc:'All-inclusive bundles — flights, hotel, tours & transfers combined.', color:'from-purple-500 to-purple-700', badge:'Best Value' },
  { to:'/contact', icon:Bus, title:'Bus & Coach Charter', desc:'Group travel across Nigeria. Comfortable, air-conditioned vehicles.', color:'from-red-500 to-red-700', badge:null },
  { to:'/contact', icon:Shield, title:'Travel Insurance', desc:'Comprehensive cover for medical, cancellations, baggage & delays.', color:'from-teal-500 to-teal-700', badge:null },
]

export default function BookingHubPage() {
  return (
    <>
      <SEO title="Book Travel" description="Book flights, hotels, airport pickup and packages with Apex Getaways." />

      <section className="relative bg-navy dark:bg-black pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/90 to-navy" />
        </div>
        <div className="relative container-pad text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-5">
              ✈️ Book with Nigeria's #1 Travel Agency
            </div>
            <h1 className="font-extrabold text-5xl md:text-6xl text-white mb-4 leading-tight">What are you<br />booking today?</h1>
            <p className="text-blue-200 text-lg max-w-xl mx-auto">
              Flights · Hotels · Airport Pickup · Packages · Insurance — all in one place
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad bg-surface-light dark:bg-surface-dark -mt-8">
        <div className="container-pad">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {SERVICES.map(({ to, icon:Icon, title, desc, color, badge }, i) => (
              <motion.div key={title} initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}>
                <Link to={to}
                  className="group relative flex flex-col bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 overflow-hidden p-6 h-full">
                  {badge && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent/10 text-accent">{badge}</span>
                  )}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={26} className="text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{desc}</p>
                  <span className="mt-4 text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Book Now →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-3xl mx-auto text-center">
            {[
              ['🔒', 'Secure Payments', 'Bank-grade encryption'],
              ['✅', 'Best Price', 'Price match guarantee'],
              ['📞', '24/7 Support', 'Always available'],
              ['⚡', 'Fast Booking', 'Confirmed in hours'],
            ].map(([icon, title, sub]) => (
              <div key={title} className="p-4 bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <span className="text-2xl block mb-2">{icon}</span>
                <p className="font-bold text-sm text-gray-900 dark:text-white">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
