import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import useReveal from '../../hooks/useReveal'

export default function NewsletterSection() {
  useReveal()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const submit = (e) => { e.preventDefault(); if(email) { setDone(true) } }
  return (
    <section className="py-16" style={{ background:'#0F1826', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
      <div className="container-pad max-w-2xl mx-auto text-center reveal">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background:'rgba(201,168,76,0.12)' }}>
          <Mail size={22} style={{ color:'#C9A84C' }} />
        </div>
        <h3 className="font-display font-bold text-white text-2xl mb-2">Get Exclusive Travel Deals</h3>
        <p className="text-sm mb-7" style={{ color:'rgba(255,255,255,0.45)' }}>
          Subscribe for the latest packages, visa tips, and special promotions from Apex Getaways.
        </p>
        {done ? (
          <div className="flex items-center justify-center gap-2 text-green-400 font-semibold">
            <CheckCircle size={20} /> Subscribed! Watch out for our next deal.
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Your email address"
              className="flex-1 px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none"
              style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}
              onFocus={e=>{e.target.style.borderColor='#C9A84C'}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.1)'}} />
            <button type="submit" className="btn-gold px-6 py-3.5 whitespace-nowrap">Subscribe</button>
          </form>
        )}
        <p className="text-xs mt-4" style={{ color:'rgba(255,255,255,0.25)' }}>No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
