export function Badge({ children, color='primary' }) {
  const colors = {
    primary:'bg-primary/10 text-primary dark:bg-primary/20',
    accent:'bg-accent/10 text-accent-dark dark:bg-accent/20',
    green:'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    red:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    gray:'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${colors[color]}`}>{children}</span>
}
