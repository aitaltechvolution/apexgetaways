import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plane, Hotel, Car, Package } from 'lucide-react'
import SEO from '../../components/SEO'

const BOOKING_TYPES = [
  { to:'/booking/flights',  icon:Plane,   label:'Book a Flight',   sub:'Search across all airlines — one-way, return, multi-city',  color:'rgba(96,165,250,0.15)',  c:'#60a5fa', bg:'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80' },
  { to:'/booking/hotels',   icon:Hotel,   label:'Book a Hotel',    sub:'Budget to 5-star luxury hotels in 190+ countries',          color:'rgba(251,191,36,0.15)',  c:'#fbbf24', bg:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
  { to:'/booking/pickup',   icon:Car,     label:'Airport Transfer', sub:'Reliable pickup and drop-off from any airport',            color:'rgba(52,211,153,0.15)',  c:'#34d399', bg:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80' },
  { to:'/packages',         icon:Package, label:'Holiday Packages', sub:'All-inclusive deals — flights, hotels, transfers & tours', color:'rgba(201,168,76,0.15)', c:'#C9A84C', bg:'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80' },
]

export default function BookingHubPage() {
  return (
    <>
      <SEO title="Book Travel" description="Book flights, hotels, airport transfers and holiday packages with Apex Getaways."/>
      <section className="pt-32 pb-20 min-h-screen" style={{ background:'#F8F6F2' }}>
        <div className="container-pad max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-widest text-gold block mb-3">What would you like to book?</span>
            <h1 className="font-display font-bold text-primary text-4xl">Book Your Travel</h1>
            <p className="text-base mt-3" style={{ color:'#4B5563' }}>Choose a travel service to get started. Our team handles everything from search to ticket delivery.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {BOOKING_TYPES.map(({ to, icon:Icon, label, sub, color, c, bg }, i) => (
              <motion.div key={to} initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }}>
                <Link to={to}
                  className="group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 h-full"
                  style={{ background:'#FFFFFF', border:'1px solid rgba(201,168,76,0.2)', boxShadow:'0 4px 20px rgba(10,22,40,0.06)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  <div className="relative overflow-hidden" style={{ height:'180px' }}>
                    <img src={bg} alt={label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                    <div className="absolute inset-0" style={{ background:'linear-gradient(to top,rgba(7,13,26,0.8) 0%,transparent 60%)' }}/>
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color }}>
                      <Icon size={20} style={{ color: c }}/>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-display font-bold text-primary text-xl mb-2">{label}</h2>
                    <p className="text-base leading-relaxed" style={{ color:'#374151' }}>{sub}</p>
                    <div className="flex items-center gap-1.5 mt-4 text-sm font-bold group-hover:gap-2.5 transition-all" style={{ color: c }}>
                      Get Started →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 p-6 rounded-2xl text-center" style={{ background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.2)' }}>
            <p className="text-primary font-semibold mb-1">Need help choosing?</p>
            <p className="text-base mb-4" style={{ color:'#374151' }}>Our consultants are available 24/7 to guide you through the best options for your needs and budget.</p>
            <a href="https://wa.me/2348062841276" target="_blank" rel="noreferrer" className="btn-gold inline-flex items-center gap-2"> Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  )
}
