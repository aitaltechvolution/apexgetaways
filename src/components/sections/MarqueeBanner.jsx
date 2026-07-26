import { Plane, Shield, GraduationCap, Hotel, Car, Package, Ship, Globe, Briefcase, DollarSign, FileText, Headphones } from 'lucide-react'

const ITEMS = [
  { icon: Plane,         label: 'Flight Bookings' },
  { icon: Shield,        label: 'Visa Assistance' },
  { icon: GraduationCap, label: 'Study Abroad' },
  { icon: Hotel,         label: 'Hotel Reservations' },
  { icon: Car,           label: 'Airport Transfers' },
  { icon: Package,       label: 'Holiday Packages' },
  { icon: Ship,          label: 'Cruise Bookings' },
  { icon: FileText,      label: 'Travel Insurance' },
  { icon: Briefcase,     label: 'Corporate Travel' },
  { icon: DollarSign,    label: 'Forex Guidance' },
  { icon: Globe,         label: 'Immigration Consultation' },
  { icon: Headphones,    label: 'IELTS Support' },
]

export default function MarqueeBanner() {
  const doubled = [...ITEMS, ...ITEMS]
  return (
    <div className="py-3.5 overflow-hidden"
      style={{ background: '#F8F6F2', borderTop: '2px solid rgba(201,168,76,0.4)', borderBottom: '2px solid rgba(201,168,76,0.4)' }}>
      <div className="marquee-track">
        {doubled.map(({ icon: Icon, label }, i) => (
          <span key={i} className="flex items-center gap-2 mx-8 text-base font-semibold whitespace-nowrap text-primary">
            <Icon size={13} style={{ color: '#C9A84C' }}/>{label}
            <span className="w-1 h-1 rounded-full ml-4" style={{ background: 'rgba(201,168,76,0.5)' }}/>
          </span>
        ))}
      </div>
    </div>
  )
}