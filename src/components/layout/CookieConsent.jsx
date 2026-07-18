import { useState } from 'react'
export default function CookieConsent() {
  const [dismissed, setDismissed] = useState(() => !!localStorage.getItem('cookieOk'))
  if (dismissed) return null
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 bg-navy dark:bg-card-dark text-white rounded-2xl p-5 shadow-2xl border border-white/10">
      <p className="text-sm leading-relaxed text-gray-300 mb-4">We use cookies to improve your experience. By continuing, you accept our <a href="/privacy" className="text-accent underline">Privacy Policy</a>.</p>
      <div className="flex gap-2">
        <button onClick={() => { localStorage.setItem('cookieOk','1'); setDismissed(true) }} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary text-white">Accept</button>
        <button onClick={() => setDismissed(true)} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-gray-300">Decline</button>
      </div>
    </div>
  )
}
