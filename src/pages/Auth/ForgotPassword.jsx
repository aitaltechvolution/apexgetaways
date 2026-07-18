import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import SEO from '../../components/SEO'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await resetPassword(email); setDone(true) }
    catch (err) { setError('Could not send reset email. Check the address and try again.') }
    finally { setLoading(false) }
  }

  return (
    <>
      <SEO title="Reset Password" />
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex items-center justify-center px-4 py-24">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="w-full max-w-md">
          <div className="bg-white dark:bg-card-dark rounded-3xl shadow-card border border-gray-100 dark:border-gray-800 p-8">
            {done ? (
              <div className="text-center py-6">
                <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Check your inbox</h2>
                <p className="text-sm text-gray-500 mb-6">We've sent a password reset link to <strong>{email}</strong></p>
                <Link to="/auth/login" className="text-primary font-semibold text-sm hover:underline flex items-center justify-center gap-1"><ArrowLeft size={13}/>Back to Sign In</Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-1">Forgot password?</h1>
                  <p className="text-sm text-gray-500">We'll send a reset link to your email.</p>
                </div>
                {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Your email address"
                      className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-primary-gradient shadow-glow hover:shadow-none transition-all disabled:opacity-60">
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </form>
                <Link to="/auth/login" className="flex items-center justify-center gap-1 mt-4 text-sm text-gray-500 hover:text-primary"><ArrowLeft size={13}/>Back to Sign In</Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}
