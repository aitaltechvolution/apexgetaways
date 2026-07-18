import { useParams, Link, Navigate } from 'react-router-dom'
import { CheckCircle, ArrowRight, Phone } from 'lucide-react'
import SEO from '../../components/SEO'
import { SERVICES, BRAND } from '../../data'
import { Breadcrumb } from '../../components/ui'
import useReveal from '../../hooks/useReveal'

const SERVICE_DETAILS = {
  flights:      { steps:['Share your travel dates and destination','Receive competitive fare options','Confirm your booking and pay securely','Receive e-tickets and travel documents'], why:'We search across all major airlines to get you the best available fares for domestic and international routes.' },
  visa:         { steps:['Consultation to identify visa type needed','Document checklist and review','Application preparation and submission','Appointment scheduling and follow-up'], why:'Our experienced visa team has successfully processed thousands of applications. We know what embassies look for.' },
  'study-abroad':{ steps:['Free counselling session on your goals','School and programme selection','Application and admission support','Study permit and pre-departure guidance'], why:'We partner with reputable institutions worldwide to help Nigerian students achieve their international education dreams.' },
  ielts:        { steps:['Registration guidance and resources','Test preparation referrals','Score requirement advice','Re-take guidance if needed'], why:'Language proficiency is essential for study, work, and immigration. We guide you through every step of the IELTS journey.' },
  immigration:  { steps:['Initial consultation on your goals','Assessment of available pathways','Documentation preparation support','Settlement preparation information'], why:'Navigating immigration can be complex. Our consultants provide clear, honest guidance to help you make informed decisions.' },
  hotels:       { steps:['Tell us your destination and dates','Receive curated accommodation options','Confirm your preferred hotel','Receive instant booking confirmation'], why:'We have partnerships with hotels worldwide, allowing us to offer competitive rates and flexible booking terms.' },
  airport:      { steps:['Provide flight details and pickup location','Receive vehicle options and pricing','Confirm your booking','Professional driver meets you on arrival'], why:'Never worry about transportation again. Our professional drivers track your flight and are always on time.' },
  holiday:      { steps:['Consultation on destination and budget','Receive a custom itinerary','Review and approve your package','Sit back and enjoy your holiday'], why:'Our holiday packages bundle flights, accommodation, transfers and tours into one seamless, stress-free experience.' },
  cruise:       { steps:['Choose your preferred cruise line and route','Select cabin category','Confirm booking and pay deposit','Receive all travel documents'], why:'We book across all major cruise lines and can arrange pre and post-cruise accommodation and transfers.' },
  insurance:    { steps:['Identify travel insurance requirements','Compare coverage options','Apply for appropriate coverage','Receive your policy documents'], why:'Travel insurance provides essential protection. We ensure you have the right coverage for your destination and trip type.' },
  corporate:    { steps:['Understand your company travel policy','Dedicated account manager assigned','Manage all bookings centrally','Monthly reporting and reconciliation'], why:'We streamline corporate travel, reduce costs, and ensure your team travels comfortably and efficiently.' },
  forex:        { steps:['Advise on foreign exchange requirements','Guide on best exchange methods','Inform on destination currency tips','Ongoing currency updates'], why:'Proper currency planning helps you avoid unnecessary fees and ensures you have funds available when and where you need them.' },
}

export default function ServiceDetailPage() {
  useReveal()
  const { slug } = useParams()
  const service = SERVICES.find(s=>s.id===slug)
  if (!service) return <Navigate to="/services" replace/>
  const detail = SERVICE_DETAILS[slug] || SERVICE_DETAILS.flights

  return (
    <>
      <SEO title={service.title} description={service.desc}/>

      {/* Hero */}
      <section className="pt-36 pb-20" style={{background:'#0A1628'}}>
        <div className="container-pad">
          <Breadcrumb items={[{to:'/',label:'Home'},{to:'/services',label:'Services'},{label:service.title}]}/>
          <div className="mt-6 flex items-start gap-6">
            <span className="text-6xl">{service.icon}</span>
            <div>
              <h1 className="font-display font-bold text-white mb-3" style={{fontSize:'clamp(1.8rem,4vw,3rem)'}}>{service.title}</h1>
              <p className="text-lg max-w-2xl" style={{color:'rgba(255,255,255,0.55)'}}>{service.desc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{background:'#070D1A'}}>
        <div className="container-pad grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="reveal p-6 rounded-2xl" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
              <h2 className="font-display font-bold text-white text-xl mb-4">Why Choose Apex for {service.title}?</h2>
              <p className="text-sm leading-relaxed" style={{color:'rgba(255,255,255,0.55)'}}>{detail.why}</p>
            </div>
            <div className="reveal p-6 rounded-2xl" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
              <h2 className="font-display font-bold text-white text-xl mb-5">How It Works</h2>
              <div className="space-y-4">
                {detail.steps.map((step,i)=>(
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
                      style={{background:'linear-gradient(135deg,#C9A84C,#F5C842)',color:'#0A1628'}}>
                      {i+1}
                    </div>
                    <div className="pt-1">
                      <p className="text-sm" style={{color:'rgba(255,255,255,0.6)'}}>{step}</p>
                      {i<detail.steps.length-1 && <div className="w-px h-6 ml-0 mt-2" style={{background:'rgba(201,168,76,0.2)',marginLeft:'-24px',transform:'translateX(20px)'}}/>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal p-6 rounded-2xl" style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.2)'}}>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} style={{color:'#C9A84C'}} className="shrink-0 mt-0.5"/>
                <div>
                  <p className="font-bold text-white mb-1">Free Consultation Available</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>
                    Speak with one of our travel experts at no cost. We'll assess your needs and recommend the best approach for your situation.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="reveal">
            <div className="sticky rounded-2xl p-6 space-y-4" style={{top:'88px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,168,76,0.2)'}}>
              <h3 className="font-display font-bold text-white text-lg">Ready to Get Started?</h3>
              <p className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>Contact us for a free consultation — no obligation, just expert advice.</p>
              <Link to={`/contact?service=${encodeURIComponent(service.title)}`} className="block w-full text-center btn-gold">Enquire Now</Link>
              <a href={`https://wa.me/${BRAND.whatsapp.replace('+','')}`} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm text-white"
                style={{background:'#25D366'}}>
                <Phone size={14}/> WhatsApp Us
              </a>
              <div className="pt-4" style={{borderTop:'1px solid rgba(255,255,255,0.07)'}}>
                <p className="text-xs font-bold text-white mb-3">Other Services</p>
                <div className="space-y-1">
                  {SERVICES.filter(s=>s.id!==slug).slice(0,5).map(s=>(
                    <Link key={s.id} to={`/services/${s.id}`}
                      className="flex items-center gap-2 py-2 text-xs transition-colors"
                      style={{color:'rgba(255,255,255,0.45)'}}
                      onMouseEnter={e=>e.currentTarget.style.color='#C9A84C'}
                      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>
                      <span>{s.icon}</span>{s.title} <ArrowRight size={10} className="ml-auto"/>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
