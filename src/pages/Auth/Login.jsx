import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import SEO from '../../components/SEO'

export default function LoginPage() {
  const { emailLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await emailLogin(email, password)
      navigate(from, { replace: true })
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
      <SEO title="Sign In" />
      <div className="min-h-screen flex items-center justify-center px-4 py-24"
        style={{ background: '#F8F6F2' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Apex Getaways" style={{ height: 48, width: 'auto' }}/>
              <div className="text-left">
                <p className="font-bold text-primary text-base leading-tight">APEX</p>
                <p className="text-[12px] font-semibold tracking-widest uppercase" style={{ color: '#C9A84C' }}>Getaways & Travel</p>
              </div>
            </Link>
            <h1 className="font-display font-bold text-primary text-2xl mb-1">Welcome back</h1>
            <p className="text-base" style={{ color: '#4B5563' }}>Sign in to manage your bookings</p>
          </div>

          <div className="p-8 rounded-3xl" style={{ background: '#FFFFFF', border: '1px solid rgba(201,168,76,0.2)', boxShadow: '0 8px 32px rgba(10,22,40,0.08)' }}>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3.5 rounded-xl text-base mb-5"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                <AlertCircle size={15} className="shrink-0"/>{error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4B5563' }}>Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }}/>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="you@example.com" style={iSt}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.25)'}/>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4B5563' }}>Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }}/>
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Your password"
                    style={{ ...iSt, paddingRight: '44px' }}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.25)'}/>
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#6B7280' }}>
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link to="/auth/forgot-password" className="text-sm font-semibold transition-colors"
                  style={{ color: '#C9A84C' }}>Forgot password?</Link>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-base text-navy flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:scale-[1.02]"
                style={{ background: loading ? 'rgba(201,168,76,0.5)' : 'linear-gradient(135deg,#C9A84C,#F5C842)' }}>
                {loading ? <><span className="animate-spin inline-block">↻</span> Signing in…</> : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-base mt-5" style={{ color: '#4B5563' }}>
              Don't have an account?{' '}
              <Link to="/auth/register" className="font-semibold" style={{ color: '#C9A84C' }}>Create one</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}

function friendlyError(message = '') {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Incorrect email or password.'
  if (m.includes('email not confirmed')) return 'Please confirm your email address before signing in.'
  if (m.includes('too many requests') || m.includes('rate limit')) return 'Too many attempts. Please try again later.'
  if (m.includes('network') || m.includes('failed to fetch')) return 'Network error. Check your connection.'
  return 'Something went wrong. Please try again.'
}
