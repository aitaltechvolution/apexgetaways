export function Card({ children, className='', hover=true, ...props }) {
  return (
    <div className={`bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card ${hover ? 'hover:shadow-card-hover hover:-translate-y-1' : ''} transition-all duration-300 ${className}`} {...props}>
      {children}
    </div>
  )
}
