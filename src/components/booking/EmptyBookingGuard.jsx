import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

// Guards mid-flow booking pages (extras, passengers, review, payment) against
// being opened directly with no prior search/selection in session storage —
// e.g. a bookmarked or shared URL. Without this, those pages render broken,
// half-populated UI (like a disabled "Pay ₦0" button with no explanation).
export default function EmptyBookingGuard({ show, children }) {
  if (!show) return children

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-24 text-center">
      <div className="max-w-md">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(201,168,76,0.12)' }}>
          <Compass size={26} style={{ color: '#C9A84C' }} />
        </div>
        <h1 className="font-display font-bold text-2xl mb-2" style={{ color: '#0A1628' }}>
          Let's start your search
        </h1>
        <p className="text-base mb-6" style={{ color: '#4B5563' }}>
          We couldn't find an active booking in progress. Start a new search to pick a flight,
          hotel, or transfer before continuing.
        </p>
        <Link to="/booking" className="btn-gold inline-block">Start a Search</Link>
      </div>
    </div>
  )
}
