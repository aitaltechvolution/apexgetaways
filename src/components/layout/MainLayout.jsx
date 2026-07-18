import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import ScrollToTop from './ScrollToTop'

function RevealWatcher() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Small delay so DOM is painted before we query
    const t = setTimeout(() => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
        })
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
      return () => obs.disconnect()
    }, 80)
    return () => clearTimeout(t)
  }, [pathname])
  return null
}

export default function MainLayout({ children }) {
  return (
    <>
      <ScrollToTop />
      <RevealWatcher />
      <Navbar />
      <main style={{ minHeight: '60vh' }}>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
