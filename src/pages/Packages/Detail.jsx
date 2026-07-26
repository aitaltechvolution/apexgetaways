import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, Phone, Mail, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import SEO from '../../components/SEO'
import { PACKAGES, formatNGN, BRAND } from '../../data'
import { Breadcrumb } from '../../components/ui'
import useReveal from '../../hooks/useReveal'

export default function PackageDetailPage() {
  useReveal()
  const { id } = useParams()
  const pkg = PACKAGES.find(p=>p.id===Number(id))
  if (!pkg) return <Navigate to="/packages" replace/>
  const save = Math.round(((pkg.oldPrice-pkg.price)/pkg.oldPrice)*100)
  const [activeImg, setActiveImg] = useState(0)

  return (
    <>
      <SEO title={pkg.title} description={pkg.description} image={pkg.img}/>

      {/* Image hero */}
      <section className="relative overflow-hidden" style={{height:'60vh',minHeight:'380px'}}>
        <img src={pkg.imgs[activeImg]} alt={pkg.title} className="w-full h-full object-cover transition-opacity duration-500"/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(5,13,26,0.85) 0%,rgba(5,13,26,0.3) 50%,transparent 100%)'}}/>
        {/* Thumb strip */}
        {pkg.imgs.length>1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
            {pkg.imgs.map((_,i)=>(
              <button key={i} onClick={()=>setActiveImg(i)}
                className="rounded-lg overflow-hidden transition-all border-2"
                style={{width:'56px',height:'40px',borderColor:activeImg===i?'#C9A84C':'transparent',opacity:activeImg===i?1:0.5}}>
                <img src={pkg.imgs[i]} alt="" className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-24 left-6 flex gap-2">
          <span className="px-3 py-1 rounded-full text-sm font-bold" style={{background:'rgba(201,168,76,0.9)',color:'#0A1628'}}>{pkg.tag}</span>
          <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-primary">Save {save}%</span>
        </div>
        <div className="absolute bottom-6 left-6">
          <Breadcrumb items={[{to:'/',label:'Home'},{to:'/packages',label:'Packages'},{label:pkg.title}]}/>
          <h1 className="font-display font-bold text-primary mt-2" style={{fontSize:'clamp(1.8rem,4vw,3rem)'}}>{pkg.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-primary/60 text-base">
            <span className="text-xl">{pkg.flag}</span>
            <span>{pkg.dest}</span>
            <span>·</span>
            <Clock size={13}/><span>{pkg.nights} nights</span>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{background:'#F8F6F2'}}>
        <div className="container-pad grid lg:grid-cols-3 gap-12">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="reveal p-6 rounded-2xl" style={{background:'#FFFFFF',border:'1px solid #E5E7EB',boxShadow:'0 1px 3px rgba(10,22,40,0.05)'}}>
              <h2 className="font-display font-bold text-primary text-xl mb-4">About This Package</h2>
              <p className="text-base leading-relaxed" style={{color:'#374151'}}>{pkg.description}</p>
            </div>
            <div className="reveal p-6 rounded-2xl" style={{background:'#FFFFFF',border:'1px solid #E5E7EB',boxShadow:'0 1px 3px rgba(10,22,40,0.05)'}}>
              <h2 className="font-display font-bold text-primary text-xl mb-4">What's Included</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {pkg.includes.map(inc=>(
                  <div key={inc} className="flex items-center gap-3 p-3 rounded-xl" style={{background:'#F3F4F6'}}>
                    <CheckCircle size={15} className="shrink-0" style={{color:'#C9A84C'}}/>
                    <span className="text-base" style={{color:'#1F2937'}}>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal p-6 rounded-2xl" style={{background:'#FFFFFF',border:'1px solid #E5E7EB',boxShadow:'0 1px 3px rgba(10,22,40,0.05)'}}>
              <h2 className="font-display font-bold text-primary text-xl mb-4">Top Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {pkg.highlights.map(h=>(
                  <span key={h} className="px-3 py-1.5 rounded-full text-sm font-semibold"
                    style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.25)',color:'#C9A84C'}}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <div className="reveal p-5 rounded-2xl" style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.15)'}}>
              <p className="text-base font-bold text-primary mb-1"> Need a Custom Version?</p>
              <p className="text-sm mb-3" style={{color:'#4B5563'}}>We can adjust dates, hotel class, add extra nights, or include additional cities.</p>
              <a href={`tel:${BRAND.phone}`} className="inline-flex items-center gap-2 text-sm font-bold" style={{color:'#C9A84C'}}>
                <Phone size={12}/> Call {BRAND.phone}
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <div className="reveal">
            <div className="sticky rounded-2xl p-6 space-y-5" style={{top:'88px',background:'#F3F4F6',border:'1px solid rgba(201,168,76,0.2)'}}>
              <div style={{borderBottom:'1px solid #F3F4F6',paddingBottom:'16px'}}>
                <p className="text-sm text-primary/40 mb-1">Starting from</p>
                <p className="text-sm line-through mb-1" style={{color:'#9CA3AF'}}>{formatNGN(pkg.oldPrice)}</p>
                <p className="font-display font-bold" style={{fontSize:'2rem',color:'#C9A84C'}}>{formatNGN(pkg.price)}</p>
                <p className="text-sm" style={{color:'#6B7280'}}>per person · save {save}%</p>
              </div>
              <div className="space-y-2 text-sm" style={{color:'#4B5563'}}>
                <p> Flexible payment available</p>
                <p> Visa assistance included</p>
                <p> Free cancellation (48hrs)</p>
                <p> 24/7 support during travel</p>
              </div>
              <Link to={`/contact?package=${encodeURIComponent(pkg.title)}`}
                className="block w-full text-center btn-gold py-4">
                Book This Package
              </Link>
              <a href={`https://wa.me/${BRAND.whatsapp.replace('+','')}`} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-base text-primary transition-all hover:opacity-90"
                style={{background:'#25D366'}}>
                <Phone size={15}/> WhatsApp Us
              </a>
              <a href={`mailto:${BRAND.email}?subject=${encodeURIComponent('Enquiry: '+pkg.title)}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-base transition-all border-2"
                style={{borderColor:'rgba(201,168,76,0.3)',color:'#C9A84C'}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.1)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
                <Mail size={15}/> Email Enquiry
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
