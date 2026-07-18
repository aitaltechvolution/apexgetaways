import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />}
          {item.to
            ? <Link to={item.to} className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>{item.label}</Link>
            : <span className="text-xs font-semibold text-white">{item.label}</span>
          }
        </span>
      ))}
    </nav>
  )
}
