import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, normalizeUser, getUserDoc, signInWithGoogle, registerWithEmail,
  loginWithEmail, logout as sbLogout, resetPassword, changePassword } from '../lib/supabase'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userDoc, setUserDoc] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadFromSession = async (sessionUser) => {
      if (!sessionUser) {
        if (mounted) { setUser(null); setUserDoc(null) }
        return
      }
      const u = normalizeUser(sessionUser)
      if (mounted) setUser(u)
      const doc = await getUserDoc(u.id).catch(() => null)
      if (mounted) setUserDoc(doc)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadFromSession(session?.user || null).finally(() => { if (mounted) setLoading(false) })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadFromSession(session?.user || null)
    })

    return () => { mounted = false; subscription.unsubscribe() }
  }, [])

  const emailRegister = async (email, password, name) => {
    const u = await registerWithEmail(email, password, name)
    if (u) {
      const doc = await getUserDoc(u.id).catch(() => null)
      setUserDoc(doc)
    }
    return u
  }

  const emailLogin = async (email, password) => {
    const u = await loginWithEmail(email, password)
    const doc = await getUserDoc(u.id).catch(() => null)
    setUserDoc(doc)
    return u
  }

  const logout = async () => {
    await sbLogout()
    setUser(null)
    setUserDoc(null)
  }

  const isAdmin = userDoc?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      user, userDoc, loading, isAdmin,
      emailRegister, emailLogin, logout, resetPassword, changePassword
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
