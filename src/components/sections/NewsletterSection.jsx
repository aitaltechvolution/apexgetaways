import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import useReveal from '../../hooks/useReveal'
import { saveLead } from '../../lib/supabase'

export default function NewsletterSection() {
  useReveal()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async e => {
    e.preventDefault()
    if (!email) return
    setLoading(true); setError('')
    try {
      await saveLead({ source: 'newsletter', email })
      setDone(true)
    } catch {
      setError('Could not subscribe right now. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <section className="py-16" style={{ background: '#FFFFFF', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
      <div className="container-pad max-w-xl mx-auto text-center reveal">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
          <Mail size={20} style={{ color: '#C9A84C' }}/>
        </div>
        <h3 className="font-display font-bold text-2xl mb-2" style={{ color: '#0A1628' }}>
          Get Exclusive Travel Deals
        </h3>
        <p className="text-base mb-6" style={{ color: '#666' }}>
          Subscribe for the latest packages, visa tips, and special promotions.
        </p>
        {done ? (
          <div className="flex items-center justify-center gap-2 font-semibold text-base" style={{ color: '#C9A84C' }}>
            <CheckCircle size={18}/> Subscribed! Watch out for our next deal.
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="Your email address"
              className="flex-1 px-4 py-3.5 rounded-xl text-base outline-none"
              style={{
                border: '1.5px solid rgba(201,168,76,0.3)',
                color: '#1a1a1a',
                background: '#fff',
              }}
              onFocus={e => { e.target.style.borderColor = '#C9A84C' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(201,168,76,0.3)' }}/>
            <button type="submit" disabled={loading} className="btn-gold px-6 py-3.5 whitespace-nowrap disabled:opacity-60">
              {loading ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}
        {error && (
          <p className="flex items-center justify-center gap-1.5 text-sm font-semibold mt-3" style={{ color: '#dc2626' }}>
            <AlertCircle size={14}/> {error}
          </p>
        )}
        <p className="text-sm mt-4" style={{ color: '#bbb' }}>No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}