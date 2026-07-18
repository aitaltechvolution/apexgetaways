import { X } from 'lucide-react'
export function Modal({ open, onClose, children, title }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-card-dark rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>}
          <button onClick={onClose} className="ml-auto p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
