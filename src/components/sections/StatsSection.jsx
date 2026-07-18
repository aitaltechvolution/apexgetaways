import useReveal from '../../hooks/useReveal'
import useCounter from '../../hooks/useCounter'

function StatItem({ end, suffix, label, prefix }) {
  const { count, ref } = useCounter(end, 2200)
  return (
    <div ref={ref} className="text-center">
      <p className="font-display font-bold text-4xl md:text-5xl mb-2" style={{ color:'#C9A84C' }}>
        {prefix}{count}{suffix}
      </p>
      <p className="text-sm font-medium" style={{ color:'rgba(255,255,255,0.5)' }}>{label}</p>
    </div>
  )
}

export default function StatsSection() {
  useReveal()
  return (
    <section className="py-16" style={{ background:'linear-gradient(135deg,#0A1628 0%,#162040 100%)', borderTop:'1px solid rgba(201,168,76,0.15)', borderBottom:'1px solid rgba(201,168,76,0.15)' }}>
      <div className="container-pad">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <StatItem end={5000} suffix="+" label="Happy Travellers" />
          <StatItem end={50}   suffix="+" label="Countries Covered" />
          <StatItem end={6}    suffix=""  label="Expert Services" prefix="" />
          <StatItem end={100}  suffix="%" label="Client Satisfaction" />
        </div>
      </div>
    </section>
  )
}
