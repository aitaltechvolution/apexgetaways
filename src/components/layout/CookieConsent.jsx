import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'
export default function CookieConsent() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!localStorage.getItem('apex_cookie_consent')) setTimeout(() => setShow(true), 2000)
  }, [])
  if (!show) return null
  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 p-4 rounded-2xl shadow-2xl"
      style={{ background: '#FFFFFF', border: '1px solid rgba(201,168,76,0.3)', backdropFilter: 'blur(24px)' }}>
      <div className="flex items-start gap-3 mb-3">
        <Cookie size={18} style={{ color: '#C9A84C', shrink: 0, marginTop: 2 }}/>
        <div>
          <p className="text-base font-semibold text-primary mb-0.5">Cookie Notice</p>
          <p className="text-sm text-gray-600">We use cookies to improve your experience. By continuing you agree to our Privacy Policy.</p>
        </div>
        <button onClick={() => setShow(false)} className="shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-700"><X size={14}/></button>
      </div>
      <button onClick={() => { localStorage.setItem('apex_cookie_consent', '1'); setShow(false) }}
        className="w-full py-2 rounded-xl text-sm font-bold text-navy" style={{ background: 'linear-gradient(135deg,#C9A84C,#F5C842)' }}>
        Accept
      </button>
    </div>
  )
}
