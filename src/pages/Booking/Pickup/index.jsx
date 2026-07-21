import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, ArrowRight, Car, CheckCircle, Luggage, Wind, RotateCcw } from 'lucide-react'
import SEO from '../../../components/SEO'
import { useBooking } from '../../../store/BookingContext'
import { PICKUP_VEHICLES, PICKUP_LOCATIONS, formatNGN } from '../../../data'

const iStyle = {
  width: '100%', padding: '13px 16px', borderRadius: '12px', fontSize: '0.875rem',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif',
}
const focus = e => { e.target.style.borderColor = '#C9A84C' }
const blur  = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }

function Label({ children }) {
  return <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{children}</label>
}

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
  const today = new Date().toISOString().split('T')[0]

  const eligibleVehicles = PICKUP_VEHICLES.filter(v => v.seats >= pax)

  const proceed = () => {
    update({
      bookingType: 'pickup', pickupFrom, pickupTo, pickupDate: date, pickupTime: time,
      pickupPassengers: pax, pickupVehicle: vehicle,
      pickupReturnNeeded: returnNeeded, pickupReturnDate: returnDate, pickupReturnTime: returnTime,
      pickupNotes: notes,
    })
    navigate('/booking/passengers')
  }

  return (
    <>
      <SEO title="Airport Transfer"/>
      <section className="pt-28 pb-6" style={{ background: '#0A1628', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div className="container-pad">
          <h1 className="font-display font-bold text-white text-3xl mb-1">Airport Transfer</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Professional pickup and drop-off — airport, hotel, or any address
          </p>
        </div>
      </section>

      <section className="py-10" style={{ background: '#070D1A' }}>
        <div className="container-pad max-w-3xl mx-auto space-y-5">

          {/* Route & date */}
          <div className="p-6 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="font-bold text-white">Transfer Details</h2>
            <div>
              <Label>Pickup Location</Label>
              <select value={pickupFrom} onChange={e => setPickupFrom(e.target.value)} style={{ ...iStyle, appearance: 'none', cursor: 'pointer' }}
                onFocus={focus} onBlur={blur}>
                <option value="" style={{ background: '#0F1826' }}>Select pickup location</option>
                {PICKUP_LOCATIONS.map(l => <option key={l} value={l} style={{ background: '#0F1826' }}>{l}</option>)}
              </select>
            </div>
            <div>
              <Label>Drop-off Location</Label>
              <input value={pickupTo} onChange={e => setPickupTo(e.target.value)}
                placeholder="Hotel name or full address" style={iStyle} onFocus={focus} onBlur={blur}/>
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
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="font-bold text-white mb-5">Select Vehicle</h2>
            {eligibleVehicles.length === 0 ? (
              <div className="text-center py-8">
                <Car size={36} className="mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}/>
                <p className="text-sm font-semibold text-white mb-1">No vehicles for {pax} passengers</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Please contact us for a custom group quote.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {eligibleVehicles.map(v => {
                  const selected = vehicle?.id === v.id
                  return (
                    <button key={v.id} type="button" onClick={() => setVehicle(v)}
                      className="text-left overflow-hidden rounded-2xl transition-all duration-200"
                      style={{
                        border: `2px solid ${selected ? '#C9A84C' : 'rgba(255,255,255,0.08)'}`,
                        background: selected ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.03)',
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
                        <p className="absolute bottom-2 left-3 font-display font-bold text-white text-base">{v.name}</p>
                      </div>
                      {/* Details */}
                      <div className="p-4">
                        <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{v.desc}</p>
                        <div className="flex items-center gap-4 text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          <span className="flex items-center gap-1"><Users size={12}/>{v.seats} seats</span>
                          <span className="flex items-center gap-1"><Luggage size={12}/>{v.luggage} bags</span>
                          {v.ac && <span className="flex items-center gap-1"><Wind size={12}/>A/C</span>}
                        </div>
                        <p className="font-bold text-base" style={{ color: '#C9A84C' }}>
                          {formatNGN(v.basePrice)}
                          <span className="text-xs font-normal ml-1" style={{ color: 'rgba(255,255,255,0.3)' }}>base fare</span>
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Return trip */}
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative shrink-0">
                <input type="checkbox" checked={returnNeeded} onChange={e => setReturnNeeded(e.target.checked)} className="sr-only"/>
                <div className="w-11 h-6 rounded-full transition-colors" style={{ background: returnNeeded ? '#C9A84C' : 'rgba(255,255,255,0.15)' }}/>
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: returnNeeded ? 'translateX(20px)' : 'translateX(0)' }}/>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={15} style={{ color: returnNeeded ? '#C9A84C' : 'rgba(255,255,255,0.4)' }}/>
                <span className="text-sm font-semibold text-white">Add Return Transfer</span>
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
              className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={focus} onBlur={blur}/>
          </div>

          {/* Price summary */}
          {vehicle && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>{vehicle.name}</span>
                <span className="font-bold" style={{ color: '#C9A84C' }}>{formatNGN(vehicle.basePrice)}</span>
              </div>
              {returnNeeded && (
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>Return transfer</span>
                  <span className="font-bold" style={{ color: '#C9A84C' }}>{formatNGN(vehicle.basePrice)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 mt-1" style={{ borderTop: '1px solid rgba(201,168,76,0.2)' }}>
                <span className="text-white">Estimated Total</span>
                <span style={{ color: '#C9A84C' }}>{formatNGN(vehicle.basePrice * (returnNeeded ? 2 : 1))}</span>
              </div>
              <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Final price may vary based on distance and waiting time
              </p>
            </div>
          )}

          <button onClick={proceed} disabled={!pickupFrom || !pickupTo || !date || !time || !vehicle}
            className="w-full btn-gold py-4 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
            Continue <ArrowRight size={15}/>
          </button>
        </div>
      </section>
    </>
  )
}
