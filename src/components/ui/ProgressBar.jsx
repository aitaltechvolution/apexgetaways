export function ProgressBar({ value, max=100, color='primary' }) {
  const pct = Math.round((value/max)*100)
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color==='primary' ? 'bg-primary-gradient' : 'bg-accent-gradient'}`} style={{width:`${pct}%`}} />
    </div>
  )
}
