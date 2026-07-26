import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Luggage, Shield, Utensils, Accessibility, ArrowRight, ArrowLeft, Plane, Check } from 'lucide-react'
import SEO from '../../components/SEO'
import { useBooking } from '../../store/BookingContext'
import { formatNGN } from '../../data'

const BAGGAGE_OPTIONS = [
  { id:'none',   label:'No extra bag',  sub:'Cabin bag only (7kg)',   pieces:0, weight:'Cabin only', price:0 },
  { id:'20kg',   label:'1 × 20kg',     sub:'One checked bag',        pieces:1, weight:'20kg',       price:12000 },
  { id:'23kg',   label:'1 × 23kg',     sub:'Standard checked bag',   pieces:1, weight:'23kg',       price:15000 },
  { id:'32kg',   label:'1 × 32kg',     sub:'Heavy checked bag',      pieces:1, weight:'32kg',       price:22000 },
  { id:'2x23kg', label:'2 × 23kg',     sub:'Two checked bags',       pieces:2, weight:'23kg×2',     price:28000 },
]

const MEAL_PREFS = [
  { id:'standard',   label:'Standard' },
  { id:'vegetarian', label:'Vegetarian' },
  { id:'vegan',      label:'Vegan' },
  { id:'halal',      label:'Halal' },
  { id:'kosher',     label:'Kosher' },
  { id:'child',      label:'Child' },
  { id:'none',       label:'No Meal' },
]

function BaggageCard({ option, selected, onSelect }) {
  const isSelected = selected === option.id
  return (
    <button type="button" onClick={() => onSelect(option)}
      className="flex flex-col items-start p-4 rounded-xl w-full transition-all text-left"
      style={{
        background: isSelected ? 'rgba(201,168,76,0.12)' : '#F3F4F6',
        border: `2px solid ${isSelected ? '#C9A84C' : '#F3F4F6'}`,
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
      }}>
      <div className="flex items-center justify-between w-full mb-2">
        <Luggage size={18} style={{ color: isSelected ? '#C9A84C' : '#4B5563' }} />
        {isSelected && <Check size={15} style={{ color: '#C9A84C' }} />}
      </div>
      <p className="font-bold text-base text-primary">{option.label}</p>
      <p className="text-sm mt-0.5" style={{ color: '#4B5563' }}>{option.sub}</p>
      <p className="font-bold text-base mt-2" style={{ color: option.price === 0 ? '#22c55e' : '#C9A84C' }}>
        {option.price === 0 ? 'Included' : `+ ${formatNGN(option.price)}`}
      </p>
    </button>
  )
}

export default function ExtrasPage() {
  const { booking, update, getFareBreakdown } = useBooking()
  const navigate = useNavigate()

  const hasReturn = booking.flightType === 'roundTrip' && booking.selectedReturnFlight
  const [outBag, setOutBag]   = useState(booking.baggage?.outbound?.id || '23kg')
  const [retBag, setRetBag]   = useState(booking.baggage?.return?.id   || '23kg')
  const [insurance, setInsurance] = useState(booking.addons?.insurance || false)
  const [mealPref, setMealPref]   = useState(booking.addons?.mealPref  || 'standard')
  const [assistance, setAssistance] = useState(booking.addons?.specialAssistance || false)

  const outBagOption = BAGGAGE_OPTIONS.find(b => b.id === outBag)
  const retBagOption = BAGGAGE_OPTIONS.find(b => b.id === retBag)

  const extras = (outBagOption?.price || 0) + (hasReturn ? (retBagOption?.price || 0) : 0) + (insurance ? 15000 : 0)
  const fd = getFareBreakdown()

  const proceed = () => {
    update({
      baggage: {
        outbound: { ...outBagOption, id: outBag },
        return:   hasReturn ? { ...retBagOption, id: retBag } : null,
      },
      addons: { insurance, insurancePrice: 15000, mealPref, specialAssistance: assistance },
    })
    navigate('/booking/passengers')
  }

  return (
    <>
      <SEO title="Add Extras — Baggage & Services" />
      {/* Step bar */}
      <StepBar step={2} />

      <section className="py-10" style={{ background: '#F8F6F2', minHeight: '80vh' }}>
        <div className="container-pad max-w-4xl mx-auto">
          <h1 className="font-display font-bold text-primary text-2xl mb-2">Add Extras</h1>
          <p className="text-base mb-8" style={{ color: '#4B5563' }}>
            Select your baggage allowance, meal preference, and optional add-ons.
          </p>

          <div className="space-y-8">
            {/* Outbound baggage */}
            <Section title=" Outbound Baggage" sub={`${booking.selectedFlight?.from} → ${booking.selectedFlight?.to}`}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {BAGGAGE_OPTIONS.map(o => <BaggageCard key={o.id} option={o} selected={outBag} onSelect={o => setOutBag(o.id)} />)}
              </div>
            </Section>

            {/* Return baggage */}
            {hasReturn && (
              <Section title=" Return Baggage" sub={`${booking.selectedReturnFlight?.from} → ${booking.selectedReturnFlight?.to}`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {BAGGAGE_OPTIONS.map(o => <BaggageCard key={o.id} option={o} selected={retBag} onSelect={o => setRetBag(o.id)} />)}
                </div>
              </Section>
            )}

            {/* Meal preference */}
            <Section title=" Meal Preference" sub="Select your preferred in-flight meal for each leg">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {MEAL_PREFS.map(m => (
                  <button key={m.id} type="button" onClick={() => setMealPref(m.id)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
                    style={{
                      background: mealPref === m.id ? 'rgba(201,168,76,0.12)' : '#F3F4F6',
                      border: `2px solid ${mealPref === m.id ? '#C9A84C' : '#F3F4F6'}`,
                    }}>
                    <Utensils size={14} style={{ color: mealPref === m.id ? '#C9A84C' : '#6B7280' }}/>
                    <span className="text-[12px] font-semibold text-center" style={{ color: mealPref === m.id ? '#C9A84C' : '#374151' }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </Section>

            {/* Insurance */}
            <Section title=" Travel Insurance" sub="Comprehensive coverage for cancellations, medical, and baggage loss">
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { val: true,  label:'Add Travel Insurance', sub:'Covers cancellation, medical emergency & lost baggage', price:15000, icon:'' },
                  { val: false, label:'No Insurance',         sub:'I understand the risks and decline coverage', price:0, icon:'' },
                ].map(opt => (
                  <button key={String(opt.val)} type="button" onClick={() => setInsurance(opt.val)}
                    className="flex items-start gap-3 p-4 rounded-xl text-left transition-all"
                    style={{
                      background: insurance === opt.val ? 'rgba(201,168,76,0.08)' : '#F3F4F6',
                      border: `2px solid ${insurance === opt.val ? '#C9A84C' : '#F3F4F6'}`,
                    }}>
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <p className="font-bold text-base text-primary">{opt.label}</p>
                      <p className="text-sm mt-0.5" style={{ color: '#4B5563' }}>{opt.sub}</p>
                      <p className="font-bold text-base mt-1" style={{ color: opt.price > 0 ? '#C9A84C' : '#4B5563' }}>
                        {opt.price > 0 ? `+ ${formatNGN(opt.price)}` : 'Free'}
                      </p>
                    </div>
                    {insurance === opt.val && <Check size={16} className="ml-auto shrink-0" style={{ color: '#C9A84C' }} />}
                  </button>
                ))}
              </div>
            </Section>

            {/* Special assistance */}
            <Section title=" Special Assistance" sub="Wheelchair, visual/hearing impairment, unaccompanied minor">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" checked={assistance} onChange={e => setAssistance(e.target.checked)} className="sr-only" />
                  <div className="w-12 h-6 rounded-full transition-colors" style={{ background: assistance ? '#C9A84C' : '#E5E7EB' }} />
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: assistance ? 'translateX(24px)' : 'translateX(0)' }} />
                </div>
                <span className="text-base font-medium text-primary">I require special assistance</span>
              </label>
              {assistance && (
                <p className="mt-3 text-sm p-3 rounded-xl" style={{ background: 'rgba(201,168,76,0.08)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}>
                  Our team will contact you before your flight to arrange appropriate assistance. Please provide details in the next step.
                </p>
              )}
            </Section>
          </div>

          {/* Price summary + navigation */}
          <div className="mt-8 p-5 rounded-2xl" style={{ background: '#F3F4F6', border: '1px solid rgba(201,168,76,0.2)' }}>
            {fd && (
              <div className="space-y-2 mb-4 text-base">
                <div className="flex justify-between" style={{ color: '#374151' }}>
                  <span>Base fare ({fd.pax.adults + fd.pax.children} pax)</span>
                  <span>{formatNGN(fd.subtotal)}</span>
                </div>
                <div className="flex justify-between" style={{ color: '#374151' }}>
                  <span>Taxes & fees</span><span>{formatNGN(fd.taxes)}</span>
                </div>
                {outBagOption?.price > 0 && (
                  <div className="flex justify-between" style={{ color: '#374151' }}>
                    <span>Baggage</span><span>{formatNGN(extras)}</span>
                  </div>
                )}
                {insurance && (
                  <div className="flex justify-between" style={{ color: '#374151' }}>
                    <span>Travel insurance</span><span>{formatNGN(15000)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2" style={{ borderTop: '1px solid #E5E7EB' }}>
                  <span className="text-primary">Total</span>
                  <span style={{ color: '#C9A84C', fontSize: '1.1rem' }}>{formatNGN((fd.total || 0) + extras)}</span>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-base font-bold border-2 transition-all" style={{ borderColor: '#E5E7EB', color: '#1F2937' }}>
                <ArrowLeft size={14} /> Back
              </button>
              <button onClick={proceed} className="flex-1 btn-gold py-3.5 flex items-center justify-center gap-2 font-bold text-base">
                Continue — Passenger Details <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Section({ title, sub, children }) {
  return (
    <div className="p-6 rounded-2xl" style={{ background:'#FFFFFF', border:'1px solid rgba(201,168,76,0.2)', boxShadow:'0 4px 20px rgba(10,22,40,0.06)' }}>
      <h2 className="font-bold text-primary text-base mb-1">{title}</h2>
      {sub && <p className="text-sm mb-4" style={{ color: '#4B5563' }}>{sub}</p>}
      {children}
    </div>
  )
}

export function StepBar({ step }) {
  const steps = ['Search','Extras','Passengers','Review','Payment','Done']
  return (
    <div className="sticky top-0 z-30 py-3" style={{ background: 'rgba(255,255,255,0.97)', borderBottom: '1px solid #F3F4F6', backdropFilter: 'blur(24px)' }}>
      <div className="container-pad flex items-center gap-0 overflow-x-auto no-scrollbar">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center shrink-0">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: i < step ? '#22c55e' : i === step ? 'linear-gradient(135deg,#C9A84C,#F5C842)' : '#F3F4F6',
                  color: i < step ? 'white' : i === step ? '#0A1628' : '#6B7280',
                }}>
                {i < step ? '' : i + 1}
              </div>
              <span className="text-[12px] mt-1 font-medium hidden sm:block"
                style={{ color: i === step ? '#C9A84C' : i < step ? '#22c55e' : '#6B7280' }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="w-8 sm:w-16 h-px mx-1" style={{ background: i < step ? '#22c55e' : '#E5E7EB' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}
