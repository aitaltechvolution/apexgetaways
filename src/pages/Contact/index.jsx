import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Send, CheckCircle, Instagram } from 'lucide-react'
import SEO from '../../components/SEO'
import { BRAND, PACKAGES, DESTINATIONS, SERVICES } from '../../data'
import useReveal from '../../hooks/useReveal'

function TikTokIcon({ size=16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.15a8.26 8.26 0 004.83 1.55V7.27a4.85 4.85 0 01-1.06-.58z"/>
    </svg>
  )
}

const iStyle = (focused) => ({
  width:'100%', padding:'13px 16px', borderRadius:'12px', fontSize:'0.875rem',
  fontFamily:'Plus Jakarta Sans,sans-serif', outline:'none', transition:'all 0.2s',
  background:'rgba(255,255,255,0.04)', color:'#fff',
  border: focused ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.1)',
  boxShadow: focused ? '0 0 0 3px rgba(201,168,76,0.12)' : 'none',
})

function ApexInput({ label, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display:'block', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.4)', marginBottom:'8px' }}>{label}</label>
      <input {...props} style={iStyle(focused)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} />
    </div>
  )
}

function ApexSelect({ label, children, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display:'block', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.4)', marginBottom:'8px' }}>{label}</label>
      <select {...props} style={{ ...iStyle(focused), appearance:'none', cursor:'pointer' }}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}>
        {children}
      </select>
    </div>
  )
}

function ApexTextarea({ label, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display:'block', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.4)', marginBottom:'8px' }}>{label}</label>
      <textarea {...props} style={{ ...iStyle(focused), resize:'none' }}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} />
    </div>
  )
}

export default function ContactPage() {
  useReveal()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ name:'', email:'', phone:'', service:'', interest:'', message:'' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const pkg = params.get('package')
    const dest = params.get('dest')
    if (pkg) setForm(f => ({ ...f, interest:pkg }))
    else if (dest) setForm(f => ({ ...f, interest:`Trip to ${dest}` }))
  }, [params])

  const h = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setLoading(false)
    setForm({ name:'', email:'', phone:'', service:'', interest:'', message:'' })
    setTimeout(() => setSent(false), 10000)
  }

  return (
    <>
      <SEO title="Contact Us" description={`Contact ${BRAND.name} — ${BRAND.phone} · ${BRAND.email}. Free consultation, 24/7 support.`} />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{background:'#0A1628'}}>
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at 30% 50%,rgba(201,168,76,0.07) 0%,transparent 60%)'}}/>
        <div className="relative container-pad text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-4">Get In Touch</span>
            <h1 className="font-display font-bold text-white leading-tight mb-4" style={{fontSize:'clamp(2.5rem,6vw,4rem)'}}>
              Contact Our Team
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{color:'rgba(255,255,255,0.5)'}}>
              We respond to every enquiry within a few hours. Reach us via phone, WhatsApp, email, or the form below — we're available 24/7.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad" style={{background:'#070D1A'}}>
        <div className="container-pad grid lg:grid-cols-5 gap-14">

          {/* Form */}
          <div className="lg:col-span-3 reveal">
            <h2 className="font-display font-bold text-white text-2xl mb-2">Send a Message</h2>
            <p className="text-sm mb-8" style={{color:'rgba(255,255,255,0.4)'}}>
              Our travel experts will respond with tailored recommendations and pricing within a few hours.
            </p>

            {sent ? (
              <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
                className="flex flex-col items-center py-16 text-center rounded-2xl"
                style={{background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.2)'}}>
                <CheckCircle size={56} className="mb-4" style={{color:'#22c55e'}}/>
                <h3 className="font-display font-bold text-xl text-white mb-2">Message Sent!</h3>
                <p className="text-sm max-w-xs" style={{color:'rgba(255,255,255,0.45)'}}>
                  Thank you! {BRAND.ceo.name.split(' ')[0]} and the Apex team will be in touch shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <ApexInput label="Full Name *" name="name" value={form.name} onChange={h} required placeholder="Your full name"/>
                  <ApexInput label="Phone / WhatsApp" name="phone" value={form.phone} onChange={h} placeholder="+234 800 000 0000"/>
                </div>
                <ApexInput label="Email Address *" type="email" name="email" value={form.email} onChange={h} required placeholder="you@example.com"/>

                <ApexSelect label="Service Needed" name="service" value={form.service} onChange={h}>
                  <option value="" style={{background:'#0F1826'}}>— Select a service —</option>
                  {SERVICES.map(s => <option key={s.id} value={s.title} style={{background:'#0F1826'}}>{s.icon} {s.title}</option>)}
                </ApexSelect>

                <div>
                  <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(255,255,255,0.4)',marginBottom:'8px'}}>
                    Specific Package or Destination
                  </label>
                  <select name="interest" value={form.interest} onChange={h}
                    style={{...iStyle(false), appearance:'none', cursor:'pointer'}}>
                    <option value="" style={{background:'#0F1826'}}>— Optional: select a package or destination —</option>
                    <optgroup label="Tour Packages" style={{background:'#0F1826'}}>
                      {PACKAGES.map(p=><option key={p.id} value={p.title} style={{background:'#0F1826'}}>{p.flag} {p.title}</option>)}
                    </optgroup>
                    <optgroup label="Destinations" style={{background:'#0F1826'}}>
                      {DESTINATIONS.map(d=><option key={d.id} value={`Trip to ${d.name}`} style={{background:'#0F1826'}}>{d.flag} Trip to {d.name}</option>)}
                    </optgroup>
                    <option value="Custom Package" style={{background:'#0F1826'}}>🌍 Custom itinerary</option>
                    <option value="Visa Enquiry" style={{background:'#0F1826'}}>🛂 Visa Enquiry</option>
                    <option value="Study Abroad" style={{background:'#0F1826'}}>🎓 Study Abroad</option>
                    <option value="Immigration" style={{background:'#0F1826'}}>📋 Immigration Consultation</option>
                  </select>
                </div>

                <ApexTextarea label="Message *" name="message" value={form.message} onChange={h} required rows={5}
                  placeholder="Tell us your travel plans, budget, travel dates, number of travellers, visa requirements…"/>

                <button type="submit" disabled={loading}
                  className="w-full btn-gold py-4 text-base disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="animate-spin">⟳</span> Sending…</> : <><Send size={16}/> Send Message to Apex Getaways</>}
                </button>
                <p className="text-[11px] text-center" style={{color:'rgba(255,255,255,0.25)'}}>
                  Your information is private and only used to respond to your enquiry.
                </p>
              </form>
            )}
          </div>

          {/* Info panel */}
          <div className="lg:col-span-2 reveal right space-y-5">
            <h2 className="font-display font-bold text-white text-2xl mb-6">Contact Details</h2>

            {[
              {icon:MapPin, label:'Office Address',     val:BRAND.address,  href:null},
              {icon:Phone,  label:'Phone / WhatsApp',  val:BRAND.phone,    href:`tel:${BRAND.phone}`},
              {icon:Mail,   label:'Email Address',     val:BRAND.email,    href:`mailto:${BRAND.email}`},
            ].map(({icon:Icon,label,val,href})=>(
              <div key={label} className="flex items-start gap-4 p-5 rounded-2xl"
                style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{background:'rgba(201,168,76,0.12)'}}>
                  <Icon size={16} style={{color:'#C9A84C'}}/>
                </div>
                <div>
                  <p className="font-bold text-xs text-white mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm transition-colors" style={{color:'rgba(255,255,255,0.5)'}}
                      onMouseEnter={e=>e.currentTarget.style.color='#C9A84C'}
                      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}>{val}</a>
                  ) : (
                    <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>{val}</p>
                  )}
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a href={`https://wa.me/${BRAND.whatsapp.replace('+','')}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 p-5 rounded-2xl transition-all hover:scale-[1.02]"
              style={{background:'linear-gradient(135deg,#25D366,#128C7E)'}}>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Phone size={16} className="text-white"/>
              </div>
              <div>
                <p className="font-bold text-white text-sm">Chat on WhatsApp</p>
                <p className="text-xs text-white/70">Instant response · Available 24/7</p>
              </div>
            </a>

            {/* Hours */}
            <div className="p-5 rounded-2xl" style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.2)'}}>
              <p className="font-bold text-white mb-2 text-sm">Business Hours</p>
              <p className="text-sm font-bold" style={{color:'#C9A84C'}}>{BRAND.hours}</p>
              <p className="text-xs mt-0.5" style={{color:'rgba(255,255,255,0.4)'}}>We're always available for you</p>
            </div>

            {/* Social */}
            <div>
              <p className="font-bold text-white text-sm mb-3">Follow Us</p>
              <div className="flex flex-col gap-2">
                <a href={BRAND.instagram} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl transition-all hover:scale-[1.02]"
                  style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(201,168,76,0.3)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}}>
                  <Instagram size={16} style={{color:'#C9A84C'}}/>
                  <div>
                    <p className="text-xs font-bold text-white">Instagram</p>
                    <p className="text-[10px]" style={{color:'rgba(255,255,255,0.35)'}}>@apex_getaways_travel_ltd</p>
                  </div>
                </a>
                <a href={BRAND.tiktok} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl transition-all hover:scale-[1.02]"
                  style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(201,168,76,0.3)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}}>
                  <TikTokIcon size={16} className="text-gold"/>
                  <div>
                    <p className="text-xs font-bold text-white">TikTok</p>
                    <p className="text-[10px]" style={{color:'rgba(255,255,255,0.35)'}}>@visa_travel_support</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
