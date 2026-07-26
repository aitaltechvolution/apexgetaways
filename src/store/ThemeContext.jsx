import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)
export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved  // 'light' | 'dark'
    return 'light' // site is designed as a light-mode experience by default
  })

  const isDark = () => mode === 'dark'

  const [dark, setDark] = useState(isDark)

  useEffect(() => {
    const shouldBeDark = isDark()
    setDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
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
