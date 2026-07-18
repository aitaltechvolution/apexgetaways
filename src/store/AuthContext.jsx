import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, getUserDoc, signInWithGoogle, registerWithEmail,
  loginWithEmail, logout as fbLogout, resetPassword } from '../lib/firebase'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userDoc, setUserDoc] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        const doc = await getUserDoc(firebaseUser.uid).catch(() => null)
        setUserDoc(doc)
      } else {
        setUser(null)
        setUserDoc(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const googleLogin = async () => {
    const u = await signInWithGoogle()
    const doc = await getUserDoc(u.uid).catch(() => null)
    setUserDoc(doc)
    return u
  }

  const emailRegister = async (email, password, name) => {
    const u = await registerWithEmail(email, password, name)
    const doc = await getUserDoc(u.uid).catch(() => null)
    setUserDoc(doc)
    return u
  }

  const emailLogin = async (email, password) => {
    const u = await loginWithEmail(email, password)
    const doc = await getUserDoc(u.uid).catch(() => null)
    setUserDoc(doc)
    return u
  }

  const logout = async () => {
    await fbLogout()
    setUser(null)
    setUserDoc(null)
  }

  const isAdmin = userDoc?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      user, userDoc, loading, isAdmin,
      googleLogin, emailRegister, emailLogin, logout, resetPassword
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
