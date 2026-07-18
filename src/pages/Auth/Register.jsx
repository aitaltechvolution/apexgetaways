import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import SEO from '../../components/SEO'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.09 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

const STRENGTH_LEVELS = [
  { label: 'Weak', color: 'bg-red-400', min: 1 },
  { label: 'Fair', color: 'bg-orange-400', min: 2 },
  { label: 'Good', color: 'bg-yellow-400', min: 3 },
  { label: 'Strong', color: 'bg-green-500', min: 4 },
]

function passwordStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

export default function RegisterPage() {
  const { emailRegister, googleLogin } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const strength = passwordStrength(password)
  const strengthInfo = STRENGTH_LEVELS[Math.max(0, strength - 1)]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (strength < 2) { setError('Please choose a stronger password.'); return }
    if (!agreed) { setError('Please accept the terms to continue.'); return }
    setError(''); setLoading(true)
    try {
      await emailRegister(email, password, name)
      navigate('/dashboard')
    } catch (err) {
      setError(friendlyError(err.code))
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    setError(''); setGoogleLoading(true)
    try {
      await googleLogin()
      navigate('/dashboard')
    } catch (err) {
      setError(friendlyError(err.code))
    } finally { setGoogleLoading(false) }
  }

  return (
    <>
      <SEO title="Create Account" />
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex items-center justify-center px-4 py-24">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-extrabold text-xl shadow-glow">A</div>
              <span className="font-bold text-gray-900 dark:text-white">Apex Getaways</span>
            </Link>
            <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-1">Create your account</h1>
            <p className="text-sm text-gray-500">Start planning your next adventure</p>
          </div>

          <div className="bg-white dark:bg-card-dark rounded-3xl shadow-card border border-gray-100 dark:border-gray-800 p-8">
            <button onClick={handleGoogle} disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-300 hover:border-primary hover:bg-primary/5 transition-all mb-5 disabled:opacity-60">
              {googleLoading ? <span className="animate-spin text-lg">⟳</span> : <GoogleIcon />}
              Sign up with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
              <span className="text-xs text-gray-400">or create with email</span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
            </div>

            {error && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm mb-5">
                <AlertCircle size={15} className="shrink-0" /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name"
                    className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 8 characters"
                    className="w-full pl-9 pr-10 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${strength >= i ? strengthInfo.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400">Strength: <span className="font-semibold">{strengthInfo?.label}</span></p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPw ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repeat password"
                    className={`w-full pl-9 pr-10 py-3.5 rounded-xl border bg-white dark:bg-card-dark text-sm focus:outline-none focus:ring-2 transition-all ${
                      confirm && password !== confirm ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary/20'
                    }`} />
                  {confirm && password === confirm && (
                    <CheckCircle size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                  )}
                </div>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 rounded border-gray-300 text-primary" />
                <span className="text-xs text-gray-500">
                  I agree to the <Link to="/terms" className="text-primary font-semibold">Terms of Service</Link> and <Link to="/privacy" className="text-primary font-semibold">Privacy Policy</Link>
                </span>
              </label>
              <button type="submit" disabled={loading || !agreed}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-primary-gradient shadow-glow hover:shadow-none transition-all hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><span className="animate-spin">⟳</span> Creating account…</> : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary font-semibold hover:underline">Sign in</Link>
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
    'auth/popup-closed-by-user': 'Google sign-up was cancelled.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}
