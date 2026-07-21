import { Plane, Shield, GraduationCap, Hotel, Car, Package, Ship, Globe, Briefcase, DollarSign, FileText, Headphones } from 'lucide-react'

const ITEMS = [
  { icon: Plane,       label: 'Flight Bookings' },
  { icon: Shield,      label: 'Visa Assistance' },
  { icon: GraduationCap, label: 'Study Abroad' },
  { icon: Hotel,       label: 'Hotel Reservations' },
  { icon: Car,         label: 'Airport Transfers' },
  { icon: Package,     label: 'Holiday Packages' },
  { icon: Ship,        label: 'Cruise Bookings' },
  { icon: FileText,    label: 'Travel Insurance' },
  { icon: Briefcase,   label: 'Corporate Travel' },
  { icon: DollarSign,  label: 'Forex Guidance' },
  { icon: Globe,       label: 'Immigration Consultation' },
  { icon: Headphones,  label: 'IELTS Support' },
]

export default function MarqueeBanner() {
  const doubled = [...ITEMS, ...ITEMS]
  return (
    <div className="py-4 overflow-hidden" style={{ background: 'linear-gradient(90deg,#C9A84C,#F5C842)', borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="marquee-track">
        {doubled.map(({ icon: Icon, label }, i) => (
          <span key={i} className="flex items-center gap-2 mx-8 text-sm font-bold whitespace-nowrap" style={{ color: '#0A1628' }}>
            <Icon size={14} style={{ color: '#0A1628', opacity: 0.7 }}/>{label}
            <span className="w-1 h-1 rounded-full ml-4" style={{ background: 'rgba(10,22,40,0.25)' }}/>
          </span>
        ))}
      </div>
    </div>
  )
}
