export function SectionTitle({ label, title, subtitle, center=true, light=false }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {label && <span className={`text-sm font-bold uppercase tracking-widest ${light ? 'text-accent' : 'text-primary'}`}>{label}</span>}
      <h2 className={`mt-2 font-bold leading-tight text-balance ${light ? 'text-white' : 'text-gray-900 dark:text-white'}`} style={{fontSize:'clamp(1.8rem,3.5vw,2.6rem)'}}>{title}</h2>
      {subtitle && <p className={`mt-4 text-base max-w-2xl leading-relaxed ${center ? 'mx-auto' : ''} ${light ? 'text-blue-100' : 'text-gray-600 dark:text-gray-600'}`}>{subtitle}</p>}
    </div>
  )
}
