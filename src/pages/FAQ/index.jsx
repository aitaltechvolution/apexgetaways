import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, MessageCircle } from 'lucide-react'
import SEO from '../../components/SEO'
import { BRAND } from '../../data'
import useReveal from '../../hooks/useReveal'

const FAQS = [
  { cat:'Bookings', q:'How do I book a service with Apex Getaways?', a:'Simply contact us via phone, WhatsApp (+2348062841276), email (apexgetaways.travel@gmail.com), or fill our online contact form. A travel consultant will respond within a few hours to discuss your requirements and provide options tailored to your needs and budget.' },
  { cat:'Visa', q:'Do you assist with visa applications for all countries?', a:'Yes. We provide visa application support for most major destinations including UK, USA, Canada, Schengen (Europe), UAE, Australia, and many more. Our experienced documentation team ensures your application is correctly prepared, increasing your chances of approval.' },
  { cat:'Visa', q:'What documents are typically needed for a visa application?', a:'Requirements vary by country but generally include: valid passport (6+ months validity), passport photographs, completed application form, bank statements (3-6 months), employment letter or proof of business, hotel reservations, return flight ticket, and travel insurance. We provide a tailored checklist for each destination.' },
  { cat:'Packages', q:'Can I customise a tour package to match my preferences?', a:'Absolutely. All our tour packages are fully customisable — we can adjust departure dates, hotel category, number of nights, add extra cities, include specific tours, or design a completely bespoke itinerary. Just tell us your preferences and budget and we\'ll create the perfect trip.' },
  { cat:'Packages', q:'What is typically included in your holiday packages?', a:'Our standard packages include return international flights, hotel accommodation, airport transfers, daily breakfast (where specified), and guided tours. Visa assistance, travel insurance, and additional tours can be added. Each package listing clearly states what\'s included.' },
  { cat:'Payments', q:'What payment options are available?', a:'We accept full payment, deposit payment (usually 30-50% upfront with the balance due before travel), and flexible instalment payment plans for qualifying packages. Payment methods include bank transfer, card payment, and mobile transfer. Contact us to discuss the best plan for your budget.' },
  { cat:'Study Abroad', q:'Do you help with school applications for study abroad?', a:'Yes. Our Study Abroad service covers international school and university admissions, programme selection, application assistance, study permit (student visa) guidance, and pre-departure orientation. We work with institutions in the UK, Canada, USA, and other study destinations.' },
  { cat:'Study Abroad', q:'What is IELTS and do I need it for international travel or study?', a:'IELTS (International English Language Testing System) is a widely recognised English proficiency test required for study, work, and immigration in many English-speaking countries. We provide guidance on IELTS registration, test preparation resources, and advice on the score requirements for your specific destination or institution.' },
  { cat:'Cancellations', q:'What happens if I need to cancel or change my booking?', a:'Cancellation and change policies vary by airline, hotel, and package provider. We advise all clients on specific terms at the time of booking. We strongly recommend adding travel insurance to your package, which covers many cancellation scenarios. Submit cancellation requests in writing to our team.' },
  { cat:'General', q:'Is Apex Getaways a registered travel agency?', a:'Yes. Apex Getaways & Travel LTD is a registered travel and immigration services company operating from Abuja, Nigeria. We are dedicated to providing professional, transparent, and reliable services. You can verify our legitimacy by visiting our office or contacting us directly.' },
  { cat:'General', q:'What destinations do you cover?', a:'We cover over 50 countries across all continents — including UAE, UK, France, Canada, USA, Turkey, Maldives, Kenya, Rwanda, South Africa, Singapore, Malaysia, Germany, Italy, Netherlands, and many more. If your desired destination isn\'t listed, contact us — we can almost certainly assist.' },
  { cat:'General', q:'Do you assist Nigerians in the diaspora?', a:'Yes. We work with Nigerian clients based in the UK, USA, Canada, Europe, and elsewhere who wish to visit family, invest in Nigeria, or travel internationally. We can manage bookings remotely and provide full documentation support via email and WhatsApp.' },
]

const CATS = ['All', ...Array.from(new Set(FAQS.map(f=>f.cat)))]

export default function FAQPage() {
  useReveal()
  const [open, setOpen] = useState(null)
  const [cat, setCat] = useState('All')
  const filtered = cat==='All' ? FAQS : FAQS.filter(f=>f.cat===cat)

  return (
    <>
      <SEO title="FAQ" description="Frequently asked questions about Apex Getaways — visa, flights, packages, payments, study abroad and more."/>

      {/* Hero */}
      <section className="pt-36 pb-20" style={{background:'#0A1628'}}>
        <div className="container-pad text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-4">Got Questions?</span>
            <h1 className="font-display font-bold text-white mb-4" style={{fontSize:'clamp(2.5rem,6vw,4rem)'}}>Frequently Asked Questions</h1>
            <p className="text-lg max-w-xl mx-auto" style={{color:'rgba(255,255,255,0.5)'}}>
              Everything you need to know about travelling with Apex Getaways. Can't find your answer? Contact us directly.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad" style={{background:'#070D1A'}}>
        <div className="container-pad max-w-3xl mx-auto">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center reveal">
            {CATS.map(c=>(
              <button key={c} onClick={()=>{setCat(c);setOpen(null)}}
                className="px-4 py-2 rounded-full text-xs font-bold transition-all"
                style={{
                  background:cat===c?'linear-gradient(135deg,#C9A84C,#F5C842)':'rgba(255,255,255,0.05)',
                  color:cat===c?'#0A1628':'rgba(255,255,255,0.5)',
                  border:cat===c?'none':'1px solid rgba(255,255,255,0.1)',
                }}>{c}</button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((faq,i)=>(
              <div key={i} className="reveal rounded-2xl overflow-hidden transition-all duration-200"
                style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${open===i?'rgba(201,168,76,0.4)':'rgba(255,255,255,0.07)'}`}}>
                <button onClick={()=>setOpen(open===i?null:i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                      style={{background:'rgba(201,168,76,0.1)',color:'#C9A84C'}}>{faq.cat}</span>
                    <span className="font-semibold text-sm text-white leading-snug">{faq.q}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
                    style={{background:open===i?'#C9A84C':'rgba(255,255,255,0.07)'}}>
                    <ChevronDown size={15} style={{color:open===i?'#0A1628':'rgba(255,255,255,0.5)',transform:open===i?'rotate(180deg)':'none',transition:'transform 0.3s'}}/>
                  </div>
                </button>
                <AnimatePresence>
                  {open===i && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                      transition={{duration:0.3}} className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed" style={{color:'rgba(255,255,255,0.5)'}}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 p-8 rounded-2xl text-center reveal"
            style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.2)'}}>
            <MessageCircle size={36} className="mx-auto mb-4" style={{color:'#C9A84C'}}/>
            <h3 className="font-display font-bold text-white text-xl mb-2">Still Have Questions?</h3>
            <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.45)'}}>Our team is available 24/7 to help with anything not covered above.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="btn-gold">Contact Us</Link>
              <a href={`https://wa.me/${BRAND.whatsapp.replace('+','')}`} target="_blank" rel="noreferrer"
                className="btn-outline-gold">WhatsApp: {BRAND.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
