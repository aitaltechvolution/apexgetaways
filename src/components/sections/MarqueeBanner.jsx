const ITEMS = ['✈️ Flight Bookings','🛂 Visa Assistance','🎓 Study Abroad','🏨 Hotel Reservations','🚗 Airport Transfers','🧳 Holiday Packages','🚢 Cruise Bookings','🛡️ Travel Insurance','👔 Corporate Travel','💱 Forex Guidance','🌍 Immigration Consultation','📝 IELTS Support']

export default function MarqueeBanner() {
  const doubled = [...ITEMS, ...ITEMS]
  return (
    <div className="py-4 overflow-hidden" style={{ background:'linear-gradient(90deg,#C9A84C,#F5C842)', borderTop:'1px solid rgba(0,0,0,0.1)', borderBottom:'1px solid rgba(0,0,0,0.1)' }}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-2 mx-6 text-sm font-bold whitespace-nowrap" style={{ color:'#0A1628' }}>
            {item}
            <span className="w-1 h-1 rounded-full" style={{ background:'rgba(10,22,40,0.3)' }} />
          </span>
        ))}
      </div>
    </div>
  )
}
