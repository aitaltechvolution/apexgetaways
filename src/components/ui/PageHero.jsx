export function PageHero({ label, title, subtitle }) {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: '#0A1628' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 50%,rgba(201,168,76,0.07) 0%,transparent 60%)' }} />
      <div className="relative container-pad text-center">
        {label && <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-4">{label}</span>}
        <h1 className="font-display font-bold text-white leading-tight mb-4" style={{ fontSize: 'clamp(2.5rem,6vw,4rem)' }}>{title}</h1>
        {subtitle && <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>{subtitle}</p>}
      </div>
    </section>
  )
}
