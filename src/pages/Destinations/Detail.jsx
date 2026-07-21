import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, CheckCircle, Phone, ArrowRight } from 'lucide-react'
import SEO from '../../components/SEO'
import { DESTINATIONS, PACKAGES, BRAND, formatNGN } from '../../data'
import { Breadcrumb } from '../../components/ui'
import useReveal from '../../hooks/useReveal'

const REQUIREMENTS = {
  1:['Valid international passport (6+ months validity)','UAE Tourist Visa','Return flight ticket','Hotel reservation','Proof of sufficient funds','Travel insurance (recommended)'],
  2:['Valid passport','Canadian Visitor Visa or eTA','Proof of funds','Return ticket','Invitation letter (if applicable)','Travel insurance'],
  3:['Valid passport','UK Visitor Visa','Proof of accommodation','Financial evidence','Return flight ticket'],
  4:['Valid passport','Schengen Visa','Proof of accommodation','Travel insurance','Return ticket','Financial evidence'],
  5:['Valid passport','Turkish e-Visa (available online)','Return ticket','Hotel confirmation'],
  6:['Valid passport','Maldives Visa on arrival (free for most)','Return ticket','Hotel booking'],
  7:['Valid passport','Kenya e-Visa','Yellow fever certificate','Return ticket','Travel insurance'],
  8:['Valid passport','South Africa Visa (where required)','Return ticket','Proof of funds'],
  9:['Valid passport','Rwanda e-Visa (online)','Yellow fever certificate','Return ticket'],
  10:['Valid passport','Singapore Visa (where required)','Return ticket','Hotel confirmation','Proof of funds'],
}

export default function DestinationDetailPage() {
  useReveal()
  const { id } = useParams()
  const dest = DESTINATIONS.find(d=>d.id===Number(id))
  if (!dest) return <Navigate to="/destinations" replace/>
  const related = PACKAGES.filter(p=>p.dest.toLowerCase().includes(dest.name.toLowerCase().split(' ')[0])).slice(0,3)
  const reqs = REQUIREMENTS[dest.id] || REQUIREMENTS[1]

  return (
    <>
      <SEO title={`${dest.name}, ${dest.country}`} description={`Explore ${dest.name} with Apex Getaways — visa assistance, flights, hotels and packages.`} image={dest.img}/>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{height:'65vh',minHeight:'420px'}}>
        <img src={dest.img} alt={dest.name} className="w-full h-full object-cover"/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(5,13,26,0.92) 0%,rgba(5,13,26,0.3) 50%,transparent 100%)'}}/>
        <div className="absolute top-24 left-6 right-6">
          <Breadcrumb items={[{to:'/',label:'Home'},{to:'/destinations',label:'Destinations'},{label:dest.name}]}/>
        </div>
        <div className="absolute bottom-8 left-6 right-6">
          <div className="container-pad px-0">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{dest.flag}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{background:'rgba(201,168,76,0.9)',color:'#0A1628'}}>{dest.tag}</span>
                </div>
                <h1 className="font-display font-bold text-white mb-1" style={{fontSize:'clamp(2.2rem,5vw,3.5rem)'}}>{dest.name}</h1>
                <div className="flex items-center gap-3 text-sm" style={{color:'rgba(255,255,255,0.6)'}}>
                  <span className="flex items-center gap-1"><MapPin size={13}/>{dest.country}</span>
                  <span className="flex items-center gap-1"><Star size={13} fill="#C9A84C" style={{color:'#C9A84C'}}/>{dest.rating}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>Packages from</p>
                <p className="font-display font-bold text-2xl" style={{color:'#C9A84C'}}>{dest.from}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{background:'#070D1A'}}>
        <div className="container-pad grid lg:grid-cols-3 gap-12">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* Attractions */}
            <div className="reveal p-6 rounded-2xl" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
              <h2 className="font-display font-bold text-white text-xl mb-4">Top Attractions</h2>
              <div className="grid grid-cols-2 gap-3">
                {dest.attractions.map(a=>(
                  <div key={a} className="flex items-center gap-2 p-3 rounded-xl" style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.12)'}}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:'#C9A84C'}}/>
                    <span className="text-sm font-medium text-white">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel requirements */}
            <div className="reveal p-6 rounded-2xl" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
              <h2 className="font-display font-bold text-white text-xl mb-4">Travel Requirements</h2>
              <ul className="space-y-3">
                {reqs.map(r=>(
                  <li key={r} className="flex items-start gap-3">
                    <CheckCircle size={15} className="shrink-0 mt-0.5" style={{color:'#C9A84C'}}/>
                    <span className="text-sm" style={{color:'rgba(255,255,255,0.6)'}}>{r}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-4 rounded-xl" style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.15)'}}>
                <p className="text-xs font-bold text-white mb-1"> Need Visa Assistance?</p>
                <p className="text-xs mb-2" style={{color:'rgba(255,255,255,0.45)'}}>Apex Getaways provides full visa documentation support and guidance for all destinations.</p>
                <Link to="/services/visa" className="text-xs font-bold" style={{color:'#C9A84C'}}>Learn about our Visa Service →</Link>
              </div>
            </div>

            {/* Related packages */}
            {related.length > 0 && (
              <div className="reveal">
                <h2 className="font-display font-bold text-white text-xl mb-4">Packages to {dest.name}</h2>
                <div className="space-y-3">
                  {related.map(pkg=>(
                    <Link key={pkg.id} to={`/packages/${pkg.id}`}
                      className="group flex items-center gap-4 p-4 rounded-xl transition-all hover:border-gold/40"
                      style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
                      <img src={pkg.img} alt={pkg.title} className="w-16 h-16 rounded-xl object-cover shrink-0"/>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-white truncate group-hover:text-gold transition-colors">{pkg.title}</p>
                        <p className="text-xs mt-0.5" style={{color:'rgba(255,255,255,0.4)'}}>{pkg.nights} nights</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-display font-bold text-sm" style={{color:'#C9A84C'}}>{formatNGN(pkg.price)}</p>
                        <ArrowRight size={14} className="ml-auto mt-1" style={{color:'#C9A84C'}}/>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="reveal">
            <div className="sticky space-y-4" style={{top:'88px'}}>
              <div className="p-6 rounded-2xl" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,168,76,0.2)'}}>
                <p className="font-display font-bold text-white text-xl mb-1">Plan Your Trip</p>
                <p className="text-xs mb-5" style={{color:'rgba(255,255,255,0.4)'}}>Get a custom quote for {dest.name}</p>
                <Link to={`/contact?dest=${encodeURIComponent(dest.name)}`} className="block w-full text-center btn-gold mb-3">
                  Get Free Quote
                </Link>
                <Link to="/packages" className="block w-full text-center py-3 rounded-xl text-sm font-bold border-2 transition-all"
                  style={{borderColor:'rgba(201,168,76,0.3)',color:'#C9A84C'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.1)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
                  Browse All Packages
                </Link>
              </div>
              <a href={`https://wa.me/${BRAND.whatsapp.replace('+','')}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90"
                style={{background:'#25D366'}}>
                <Phone size={16}/> Chat on WhatsApp — 24/7
              </a>
              <div className="p-4 rounded-xl text-xs" style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.15)',color:'rgba(255,255,255,0.45)'}}>
                <p className="font-bold text-white mb-1"> All Inclusive</p>
                <p>Visa · Flights · Hotels · Transfers · Tours · Insurance</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
