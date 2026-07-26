import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} className="text-gray-600" />}
          {item.to
            ? <Link to={item.to} className="text-base transition-colors text-gray-700 hover:text-gold">{item.label}</Link>
            : <span className="text-base font-semibold text-primary">{item.label}</span>
          }
        </span>
      ))}
    </nav>
  )
}
