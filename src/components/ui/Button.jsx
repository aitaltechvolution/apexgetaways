export function Button({ children, variant='primary', size='md', className='', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-primary-gradient text-white shadow-glow hover:shadow-none',
    secondary: 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:border-primary',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    accent: 'bg-accent-gradient text-primary shadow-glow-accent',
    ghost: 'text-gray-600 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5',
  }
  const sizes = { sm:'px-4 py-2 text-base', md:'px-6 py-3 text-base', lg:'px-8 py-4 text-base' }
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>
}
