import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { supabase } from '../../lib/supabase'
import SEO from '../../components/SEO'

// Reached via the "reset password" link Supabase emails out (resetPassword() in
// lib/supabase.js sets redirectTo to /auth/reset-password). Supabase's client
// auto-detects the recovery token in the URL and creates a temporary session,
// so this page just needs to collect a new password and call updateUser().
export default function ResetPasswordPage() {
  const { changePassword } = useAuth()
  const navigate = useNavigate()

  const [ready, setReady] = useState(false)   // recovery session confirmed present
  const [invalid, setInvalid] = useState(false)
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      if (session) setReady(true)
      else setInvalid(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true)
    })
    return () => { mounted = false; subscription.unsubscribe() }
  }, [])

  const iSt = {
    width: '100%', padding: '13px 16px 13px 40px', borderRadius: '12px', fontSize: '0.875rem',
    background: '#F8F6F2', border: '1px solid rgba(201,168,76,0.25)',
    color: '#0A1628', outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif',
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (pw.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (pw !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await changePassword(pw)
      setDone(true)
      setTimeout(() => navigate('/auth/login', { replace: true }), 2500)
    } catch (err) {
      setError(err.message || 'Could not update your password. Please request a new reset link.')
    } finally { setLoading(false) }
  }

  return (
    <>
      <SEO title="Reset Password" />
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
            <h1 className="font-display font-bold text-primary text-2xl mb-1">Reset your password</h1>
            <p className="text-base" style={{ color: '#4B5563' }}>Choose a new password for your account</p>
          </div>

          <div className="p-8 rounded-3xl" style={{ background: '#FFFFFF', border: '1px solid rgba(201,168,76,0.2)', boxShadow: '0 8px 32px rgba(10,22,40,0.08)' }}>
            {invalid ? (
              <div className="text-center space-y-4">
                <AlertCircle size={32} className="mx-auto" style={{ color: '#ef4444' }}/>
                <p className="text-base" style={{ color: '#374151' }}>
                  This reset link is invalid or has expired. Please request a new one.
                </p>
                <Link to="/auth/forgot-password" className="btn-gold inline-block">Request new link</Link>
              </div>
            ) : done ? (
              <div className="text-center space-y-4">
                <CheckCircle size={32} className="mx-auto" style={{ color: '#16a34a' }}/>
                <p className="text-base" style={{ color: '#374151' }}>Password updated. Redirecting you to sign in…</p>
              </div>
            ) : !ready ? (
              <p className="text-center text-base py-6" style={{ color: '#6B7280' }}>Verifying your reset link…</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3.5 rounded-xl text-base"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626' }}>
                    <AlertCircle size={15} className="shrink-0"/>{error}
                  </motion.div>
                )}
                <div>
                  <label className="block text-[13px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4B5563' }}>New Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }}/>
                    <input type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} required
                      placeholder="At least 6 characters" style={{ ...iSt, paddingRight: '44px' }}
                      onFocus={e => e.target.style.borderColor = '#C9A84C'}
                      onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.25)'}/>
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#6B7280' }}>
                      {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4B5563' }}>Confirm Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }}/>
                    <input type={showPw ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required
                      placeholder="Re-enter password" style={iSt}
                      onFocus={e => e.target.style.borderColor = '#C9A84C'}
                      onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.25)'}/>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-base text-navy flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:scale-[1.02]"
                  style={{ background: loading ? 'rgba(201,168,76,0.5)' : 'linear-gradient(135deg,#C9A84C,#F5C842)' }}>
                  {loading ? <><span className="animate-spin inline-block">↻</span> Updating…</> : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}
