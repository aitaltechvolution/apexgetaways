import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
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
      navigate('/dashboard')
    } catch (err) {
      setError(friendlyError(err.code))
    } finally { setLoading(false) }
  }

  const iSt = {
    width: '100%', padding: '13px 16px 13px 40px', borderRadius: '12px', fontSize: '0.875rem',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif',
  }

  return (
    <>
      <SEO title="Create Account" />
      <div className="min-h-screen flex items-center justify-center px-4 py-24" style={{ background: '#070D1A' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Apex Getaways" style={{ height: 48, width: 'auto' }}/>
              <div className="text-left">
                <p className="font-bold text-white text-base leading-tight">APEX</p>
                <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#C9A84C' }}>Getaways & Travel</p>
              </div>
            </Link>
            <h1 className="font-display font-bold text-white text-2xl mb-1">Create your account</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Start planning your next adventure</p>
          </div>

          <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3.5 rounded-xl text-sm mb-5"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                <AlertCircle size={15} className="shrink-0"/>{error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}/>
                  <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name" style={iSt}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}/>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={iSt}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}/>
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Min. 8 characters"
                    style={{ ...iSt, paddingRight: '44px' }}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all"
                          style={{ background: pw_strength >= i ? info.color : 'rgba(255,255,255,0.1)' }}/>
                      ))}
                    </div>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Strength: <span className="font-semibold" style={{ color: info.color }}>{info.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Confirm Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}/>
                  <input type={showPw ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required
                    placeholder="Repeat password"
                    style={{
                      ...iSt, paddingRight: '44px',
                      borderColor: confirm && password !== confirm ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)',
                    }}
                    onFocus={e => { if (password === confirm || !confirm) e.target.style.borderColor = '#C9A84C' }}
                    onBlur={e => { e.target.style.borderColor = confirm && password !== confirm ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)' }}/>
                  {confirm && password === confirm && (
                    <CheckCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#22c55e' }}/>
                  )}
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 rounded"/>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  I agree to the{' '}
                  <Link to="/terms" className="underline" style={{ color: '#C9A84C' }}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="underline" style={{ color: '#C9A84C' }}>Privacy Policy</Link>
                </span>
              </label>

              <button type="submit" disabled={loading || !agreed}
                className="w-full py-4 rounded-xl font-bold text-sm text-navy flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg,#C9A84C,#F5C842)' }}>
                {loading ? <><span className="animate-spin inline-block">↻</span> Creating account…</> : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm mt-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Already have an account?{' '}
              <Link to="/auth/login" className="font-semibold" style={{ color: '#C9A84C' }}>Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}
