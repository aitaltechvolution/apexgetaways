import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)
export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved  // 'light' | 'dark' | 'system'
    return 'system'
  })

  const isDark = () => {
    if (mode === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches
    return mode === 'dark'
  }

  const [dark, setDark] = useState(isDark)

  useEffect(() => {
    const apply = () => {
      const shouldBeDark = isDark()
      setDark(shouldBeDark)
      document.documentElement.classList.toggle('dark', shouldBeDark)
    }
    apply()
    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [mode])

  const setTheme = (val) => {
    localStorage.setItem('theme', val)
    setMode(val)
  }

  const toggle = () => setTheme(dark ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ dark, mode, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
