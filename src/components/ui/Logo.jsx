export default function ApexLogo({ size = 40, showText = true, light = false }) {
  return (
    <div className="flex items-center gap-3">
      {/* Real Apex logo image */}
      <img
        src="/logo.png"
        alt="Apex Getaways"
        style={{ width: size, height: size * 0.84, objectFit: 'contain' }}
      />
      {showText && (
        <div className="leading-tight">
          <p
            className="font-bold tracking-tight text-base"
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              letterSpacing: '-0.02em',
              color: light ? '#ffffff' : '#0A1628',
            }}
          >
            APEX
          </p>
          <p
            className="text-[10px] font-semibold tracking-widest uppercase"
            style={{ color: '#C9A84C' }}
          >
            Getaways & Travel
          </p>
        </div>
      )}
    </div>
  )
}
