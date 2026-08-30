import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, ArrowRight, Car, CheckCircle, Luggage, Wind, RotateCcw } from 'lucide-react'
import SEO from '../../../components/SEO'
import LocationPicker from '../../../components/LocationPicker'
import { useBooking } from '../../../store/BookingContext'
import { PICKUP_VEHICLES, PICKUP_LOCATIONS, formatNGN } from '../../../data'
import { getLocationPricing, resolveLocationPrice } from '../../../lib/supabase'

const iStyle = {
  width: '100%', padding: '13px 16px', borderRadius: '12px', fontSize: '0.875rem',
  background: '#F3F4F6', border: '1px solid #E5E7EB',
  color: '#111827', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif',
}
const focus = e => { e.target.style.borderColor = '#C9A84C' }
const blur  = e => { e.target.style.borderColor = '#E5E7EB' }

function Label({ children }) {
  return <label className="block text-[13px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4B5563' }}>{children}</label>
}

const FALLBACK_PRICE = Math.min(...PICKUP_VEHICLES.map(v => v.basePrice)) // used only if admin hasn't set any prices yet

export default function PickupPage() {
  const { booking, update } = useBooking()
  const navigate = useNavigate()

  const [pickupFrom, setPickupFrom] = useState(booking.heroPickupFrom || booking.pickupFrom || '')
  const [pickupTo,   setPickupTo]   = useState(booking.heroPickupTo   || booking.pickupTo   || '')
  const [date,   setDate]   = useState(booking.heroPickupDate || booking.pickupDate || '')
  const [time,   setTime]   = useState(booking.pickupTime || '')
  const [pax,    setPax]    = useState(booking.pickupPassengers || 1)
  const [vehicle, setVehicle] = useState(null)
  const [returnNeeded, setReturnNeeded] = useState(false)
  const [returnDate, setReturnDate] = useState('')
  const [returnTime, setReturnTime] = useState('')
  const [notes, setNotes] = useState('')
  const [guestLocation, setGuestLocation] = useState(null) // where the guest is arriving from
  const [priceList, setPriceList] = useState([])
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => { getLocationPricing().then(setPriceList).catch(() => setPriceList([])) }, [])
  useEffect(() => { setVehicle(null) }, [guestLocation]) // price depends on location — re-select after it changes

  // The location's price is the base price; each vehicle tier adds its usual
  // differential on top (so upgrading vehicle still costs a bit more).
  const cheapestBase = Math.min(...PICKUP_VEHICLES.map(v => v.basePrice))
  const locationPrice = guestLocation
    ? (resolveLocationPrice(priceList, guestLocation) ?? FALLBACK_PRICE)
    : FALLBACK_PRICE
  const vehicles = PICKUP_VEHICLES.map(v => ({
    ...v,
    basePrice: locationPrice + (v.basePrice - cheapestBase),
  }))
  const eligibleVehicles = vehicles.filter(v => v.seats >= pax)

  const proceed = () => {
    update({
      bookingType: 'pickup', pickupFrom, pickupTo, pickupDate: date, pickupTime: time,
      pickupPassengers: pax, pickupVehicle: vehicle, guestLocation,
      pickupReturnNeeded: returnNeeded, pickupReturnDate: returnDate, pickupReturnTime: returnTime,
      pickupNotes: notes,
    })
    navigate('/booking/passengers')
  }

  return (
    <>
      <SEO title="Airport Transfer"/>
      <section className="pt-28 pb-6" style={{ background: '#F8F6F2', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="container-pad">
          <h1 className="font-display font-bold text-primary text-3xl mb-1">Airport Transfer</h1>
          <p className="text-base" style={{ color: '#4B5563' }}>
            Professional pickup and drop-off — airport, hotel, or any address
          </p>
        </div>
      </section>

      <section className="py-10" style={{ background: '#F8F6F2' }}>
        <div className="container-pad max-w-3xl mx-auto space-y-5">

          {/* Route & date */}
          <div className="p-6 rounded-2xl space-y-4" style={{ background:'#FFFFFF', border:'1px solid rgba(201,168,76,0.2)', boxShadow:'0 4px 20px rgba(10,22,40,0.06)' }}>
            <h2 className="font-bold text-primary">Transfer Details</h2>
            <div>
              <Label>Pickup Location</Label>
              <select value={pickupFrom} onChange={e => setPickupFrom(e.target.value)} style={{ ...iStyle, appearance: 'none', cursor: 'pointer' }}
                onFocus={focus} onBlur={blur}>
                <option value="" style={{ background: '#FFFFFF' }}>Select pickup location</option>
                {PICKUP_LOCATIONS.map(l => <option key={l} value={l} style={{ background: '#FFFFFF' }}>{l}</option>)}
              </select>
            </div>
            <div>
              <Label>Drop-off Location</Label>
              <input value={pickupTo} onChange={e => setPickupTo(e.target.value)}
                placeholder="Hotel name or full address" style={iStyle} onFocus={focus} onBlur={blur}/>
            </div>
            <div>
              <Label>Guest is arriving from</Label>
              <LocationPicker value={guestLocation} onChange={setGuestLocation}/>
              <p className="text-sm mt-1.5" style={{ color: '#6B7280' }}>Pricing is based on the guest's country or Nigerian state of origin.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Date</Label>
                <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} style={iStyle} onFocus={focus} onBlur={blur}/>
              </div>
              <div>
                <Label>Time</Label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} style={iStyle} onFocus={focus} onBlur={blur}/>
              </div>
              <div>
                <Label>Passengers</Label>
                <input type="number" min={1} max={30} value={pax} onChange={e => setPax(Number(e.target.value))} style={iStyle} onFocus={focus} onBlur={blur}/>
              </div>
            </div>
          </div>

          {/* Vehicle selection */}
          <div className="p-6 rounded-2xl" style={{ background:'#FFFFFF', border:'1px solid rgba(201,168,76,0.2)', boxShadow:'0 4px 20px rgba(10,22,40,0.06)' }}>
            <h2 className="font-bold text-primary mb-5">Select Vehicle</h2>
            {eligibleVehicles.length === 0 ? (
              <div className="text-center py-8">
                <Car size={36} className="mx-auto mb-3" style={{ color: '#9CA3AF' }}/>
                <p className="text-base font-semibold text-primary mb-1">No vehicles for {pax} passengers</p>
                <p className="text-sm" style={{ color: '#4B5563' }}>Please contact us for a custom group quote.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {eligibleVehicles.map(v => {
                  const selected = vehicle?.id === v.id
                  return (
                    <button key={v.id} type="button" onClick={() => setVehicle(v)}
                      className="text-left overflow-hidden rounded-2xl transition-all duration-200"
                      style={{
                        border: `2px solid ${selected ? '#C9A84C' : '#F3F4F6'}`,
                        background: selected ? 'rgba(201,168,76,0.06)' : '#F3F4F6',
                        transform: selected ? 'scale(1.01)' : 'scale(1)',
                      }}>
                      {/* Real vehicle photo */}
                      <div className="relative overflow-hidden" style={{ height: '140px' }}>
                        <img src={v.img} alt={v.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"/>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,13,26,0.7) 0%, transparent 60%)' }}/>
                        {selected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: '#C9A84C' }}>
                            <CheckCircle size={14} style={{ color: '#0A1628' }}/>
                          </div>
                        )}
                        <p className="absolute bottom-2 left-3 font-display font-bold text-primary text-base">{v.name}</p>
                      </div>
                      {/* Details */}
                      <div className="p-4">
                        <p className="text-sm mb-3" style={{ color: '#4B5563' }}>{v.desc}</p>
                        <div className="flex items-center gap-4 text-sm mb-3" style={{ color: '#374151' }}>
                          <span className="flex items-center gap-1"><Users size={12}/>{v.seats} seats</span>
                          <span className="flex items-center gap-1"><Luggage size={12}/>{v.luggage} bags</span>
                          {v.ac && <span className="flex items-center gap-1"><Wind size={12}/>A/C</span>}
                        </div>
                        <p className="font-bold text-base" style={{ color: '#C9A84C' }}>
                          {formatNGN(v.basePrice)}
                          <span className="text-sm font-normal ml-1" style={{ color: '#6B7280' }}>base fare</span>
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Return trip */}
          <div className="p-5 rounded-2xl" style={{ background:'#FFFFFF', border:'1px solid rgba(201,168,76,0.2)', boxShadow:'0 4px 20px rgba(10,22,40,0.06)' }}>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative shrink-0">
                <input type="checkbox" checked={returnNeeded} onChange={e => setReturnNeeded(e.target.checked)} className="sr-only"/>
                <div className="w-11 h-6 rounded-full transition-colors" style={{ background: returnNeeded ? '#C9A84C' : '#E5E7EB' }}/>
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: returnNeeded ? 'translateX(20px)' : 'translateX(0)' }}/>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={15} style={{ color: returnNeeded ? '#C9A84C' : '#4B5563' }}/>
                <span className="text-base font-semibold text-primary">Add Return Transfer</span>
              </div>
            </label>
            {returnNeeded && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <Label>Return Date</Label>
                  <input type="date" min={date || today} value={returnDate} onChange={e => setReturnDate(e.target.value)}
                    style={iStyle} onFocus={focus} onBlur={blur}/>
                </div>
                <div>
                  <Label>Return Time</Label>
                  <input type="time" value={returnTime} onChange={e => setReturnTime(e.target.value)}
                    style={iStyle} onFocus={focus} onBlur={blur}/>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label>Special Instructions (optional)</Label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="Flight number, extra stops, accessibility needs…"
              className="w-full px-4 py-3 rounded-xl text-base text-primary focus:outline-none resize-none"
              style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}
              onFocus={focus} onBlur={blur}/>
          </div>

          {/* Price summary */}
          {vehicle && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <div className="flex justify-between text-base mb-1">
                <span style={{ color: '#374151' }}>{vehicle.name}</span>
                <span className="font-bold" style={{ color: '#C9A84C' }}>{formatNGN(vehicle.basePrice)}</span>
              </div>
              {returnNeeded && (
                <div className="flex justify-between text-base mb-1">
                  <span style={{ color: '#374151' }}>Return transfer</span>
                  <span className="font-bold" style={{ color: '#C9A84C' }}>{formatNGN(vehicle.basePrice)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 mt-1" style={{ borderTop: '1px solid rgba(201,168,76,0.2)' }}>
                <span className="text-primary">Estimated Total</span>
                <span style={{ color: '#C9A84C' }}>{formatNGN(vehicle.basePrice * (returnNeeded ? 2 : 1))}</span>
              </div>
              <p className="text-[13px] mt-1" style={{ color: '#6B7280' }}>
                Final price may vary based on distance and waiting time
              </p>
            </div>
          )}

          <button onClick={proceed} disabled={!pickupFrom || !pickupTo || !date || !time || !vehicle}
            className="w-full btn-gold py-4 font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
            Continue <ArrowRight size={15}/>
          </button>
        </div>
      </section>
    </>
  )
}
