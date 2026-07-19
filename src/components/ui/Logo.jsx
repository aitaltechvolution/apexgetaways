export default function ApexLogo({ size = 40, showText = true, light = false }) {
  return (
    <div className="flex items-center gap-1">
      <img src={"/logo.png"} alt="" width={size}/>
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
