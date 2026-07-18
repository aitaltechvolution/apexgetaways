export default function ApexLogo({ size = 40, showText = true, light = false }) {
  return (
    <div className="flex items-center gap-3">
      {/* SVG Icon — matches real Apex logo: A shape + arch + road + plane */}
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer A triangle */}
        <polygon points="50,5 95,90 5,90" fill="url(#goldGrad)" />
        {/* Inner arch/door cutout */}
        <rect x="33" y="48" width="34" height="40" rx="17" fill={light ? '#0A1628' : '#0A1628'} />
        {/* Road curve inside arch */}
        <path d="M50 88 Q42 72 46 58" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
        <path d="M50 88 Q58 72 54 58" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
        {/* Plane */}
        <g transform="translate(56,43) rotate(-35)">
          <polygon points="0,-4 8,0 0,4 1,0" fill="#F5C842" />
        </g>
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C9A84C"/>
            <stop offset="50%" stopColor="#F5C842"/>
            <stop offset="100%" stopColor="#A07830"/>
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <div className="leading-tight">
          <p className={`font-bold tracking-tight text-base ${light ? 'text-white' : 'text-navy'}`} style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}>
            APEX
          </p>
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#C9A84C' }}>
            Getaways & Travel
          </p>
        </div>
      )}
    </div>
  )
}
