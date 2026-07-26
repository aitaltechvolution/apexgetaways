import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { supabase } from '../../lib/supabase'
import SEO from '../../components/SEO'

const STRENGTH = [
  { label: 'Weak',   color: '#ef4444' },
  { label: 'Fair',   color: '#f59e0b' },
  { label: 'Good',   color: '#eab308' },
  { label: 'Strong', color: '#22c55e' },
]

function strength(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function RegisterPage() {
  const { emailRegister } = useAuth()
  const navigate = useNavigate()

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [agreed, setAgreed]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [checkEmail, setCheckEmail] = useState(false)

  const pw_strength = strength(password)
  const info = STRENGTH[Math.max(0, pw_strength - 1)]

  const handleSubmit = async e => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (pw_strength < 2) { setError('Please choose a stronger password.'); return }
    if (!agreed) { setError('Please accept the terms to continue.'); return }
    setError(''); setLoading(true)
    try {
      await emailRegister(email, password, name)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/dashboard')
      } else {
        // Project has "confirm email" enabled in Supabase Auth settings —
        // no session until the user clicks the link in their inbox.
        setCheckEmail(true)
      }
    } catch (err) {
      setError(friendlyError(err.message))
    } finally { setLoading(false) }
  }

  const iSt = {
    width: '100%', padding: '13px 16px 13px 40px', borderRadius: '12px', fontSize: '0.875rem',
    background: '#F8F6F2', border: '1px solid rgba(201,168,76,0.25)',
    color: '#0A1628', outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif',
  }

  return (
    <>
      <SEO title="Create Account" />
      <div className="min-h-screen flex items-center justify-center px-4 py-24" style={{ background: '#F8F6F2' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Apex Getaways" style={{ height: 48, width: 'auto' }}/>
              <div className="text-left">
                <p className="font-bold text-primary text-base leading-tight">APEX</p>
                <p className="text-[12px] font-semibold tracking-widest uppercase" style={{ color: '#C9A84C' }}>Getaways & Travel</p>
              </div>
            </Link>
            <h1 className="font-display font-bold text-primary text-2xl mb-1">Create your account</h1>
            <p className="text-base" style={{ color: '#4B5563' }}>Start planning your next adventure</p>
          </div>

          <div className="p-8 rounded-3xl" style={{ background: '#FFFFFF', border: '1px solid rgba(201,168,76,0.2)', boxShadow: '0 8px 32px rgba(10,22,40,0.08)' }}>
            {checkEmail ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(34,197,94,0.1)' }}>
                  <Mail size={24} style={{ color: '#22c55e' }}/>
                </div>
                <h2 className="font-display font-bold text-primary text-xl mb-2">Check your inbox</h2>
                <p className="text-base mb-6" style={{ color: '#4B5563' }}>
                  We've sent a confirmation link to <span className="font-semibold text-primary">{email}</span>.
                  Click it to activate your account, then sign in.
                </p>
                <Link to="/auth/login" className="btn-gold inline-flex px-8 py-3.5 text-base font-bold">Go to Sign In</Link>
              </div>
            ) : (
            <>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3.5 rounded-xl text-base mb-5"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                <AlertCircle size={15} className="shrink-0"/>{error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[13px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4B5563' }}>Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }}/>
                  <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name" style={iSt}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.25)'}/>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[13px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4B5563' }}>Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }}/>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={iSt}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.25)'}/>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4B5563' }}>Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }}/>
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Min. 8 characters"
                    style={{ ...iSt, paddingRight: '44px' }}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.25)'}/>
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }}>
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all"
                          style={{ background: pw_strength >= i ? info.color : '#E5E7EB' }}/>
                      ))}
                    </div>
                    <p className="text-[13px]" style={{ color: '#4B5563' }}>
                      Strength: <span className="font-semibold" style={{ color: info.color }}>{info.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[13px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4B5563' }}>Confirm Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }}/>
                  <input type={showPw ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required
                    placeholder="Repeat password"
                    style={{
                      ...iSt, paddingRight: '44px',
                      borderColor: confirm && password !== confirm ? 'rgba(239,68,68,0.6)' : '#E5E7EB',
                    }}
                    onFocus={e => { if (password === confirm || !confirm) e.target.style.borderColor = '#C9A84C' }}
                    onBlur={e => { e.target.style.borderColor = confirm && password !== confirm ? 'rgba(239,68,68,0.6)' : '#E5E7EB' }}/>
                  {confirm && password === confirm && (
                    <CheckCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#22c55e' }}/>
                  )}
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 rounded"/>
                <span className="text-sm" style={{ color: '#374151' }}>
                  I agree to the{' '}
                  <Link to="/terms" className="underline" style={{ color: '#C9A84C' }}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="underline" style={{ color: '#C9A84C' }}>Privacy Policy</Link>
                </span>
              </label>

              <button type="submit" disabled={loading || !agreed}
                className="w-full py-4 rounded-xl font-bold text-base text-navy flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg,#C9A84C,#F5C842)' }}>
                {loading ? <><span className="animate-spin inline-block">↻</span> Creating account…</> : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-base mt-5" style={{ color: '#4B5563' }}>
              Already have an account?{' '}
              <Link to="/auth/login" className="font-semibold" style={{ color: '#C9A84C' }}>Sign in</Link>
            </p>
            </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}

function friendlyError(message = '') {
  const m = message.toLowerCase()
  if (m.includes('already registered') || m.includes('already exists')) return 'An account already exists with this email.'
  if (m.includes('password') && (m.includes('least') || m.includes('short') || m.includes('weak'))) return 'Password must be at least 6 characters.'
  if (m.includes('email') && (m.includes('invalid') || m.includes('valid'))) return 'Please enter a valid email address.'
  if (m.includes('network') || m.includes('failed to fetch')) return 'Network error. Check your connection.'
  return 'Something went wrong. Please try again.'
}
