import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Car, MapPin, Calendar, Clock, Users, CheckCircle,
  ArrowRight, ArrowLeftRight, Plus, Snowflake, Luggage, Plane, Building2, Bus
} from 'lucide-react'
import SEO from '../../../components/SEO'
import { PICKUP_VEHICLES, PICKUP_LOCATIONS, formatNGN } from '../../../data'
import { useBooking } from '../../../store/BookingContext'

function VehicleCard({ vehicle, selected, onSelect }) {
  const isSelected = selected?.id === vehicle.id
  return (
    <motion.div whileHover={{ y: -3 }} onClick={() => onSelect(vehicle)}
      className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-glow'
          : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-card-dark shadow-card hover:border-primary/50'
      }`}>
      <div className="flex items-start justify-between mb-3">
        <img src={vehicle.img} alt="" />
        {isSelected && <CheckCircle size={20} className="text-primary shrink-0" />}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{vehicle.name}</h3>
      <p className="text-xs text-gray-400 mb-3">{vehicle.desc}</p>
      <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
        <span className="flex items-center gap-1"><Users size={11} /> {vehicle.seats} seats</span>
        <span className='flex items-center gap-1'><Luggage size={20}/> {vehicle.luggage} bags</span>
        {vehicle.ac && <span className='flex items-center gap-1'><Snowflake size={20}/></span>}
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
        <p className="text-[11px] text-gray-400">Base fare</p>
        <p className="font-extrabold text-primary text-lg">{formatNGN(vehicle.basePrice)}</p>
        <p className="text-[11px] text-gray-400">+ {formatNGN(vehicle.pricePerKm)}/km</p>
      </div>
    </motion.div>
  )
}

export default function PickupPage() {
  const { update } = useBooking()
  const navigate = useNavigate()

  const [pickupFrom, setPickupFrom] = useState('')
  const [pickupFromCustom, setPickupFromCustom] = useState('')
  const [pickupTo, setPickupTo] = useState('')
  const [pickupToCustom, setPickupToCustom] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [pax, setPax] = useState(1)
  const [vehicle, setVehicle] = useState(null)
  const [returnTrip, setReturnTrip] = useState(false)
  const [returnDate, setReturnDate] = useState('')
  const [returnTime, setReturnTime] = useState('')
  const [notes, setNotes] = useState('')
  const [serviceType, setServiceType] = useState('airport') // airport | intercity | charter

  const today = new Date().toISOString().split('T')[0]

  const totalFare = vehicle
    ? vehicle.basePrice * (returnTrip ? 2 : 1)
    : 0

  const canProceed = pickupFrom && pickupTo && date && time && vehicle

  const proceed = () => {
    update({
      bookingType: 'pickup',
      pickupFrom: pickupFrom === 'Custom Location (specify in notes)' ? pickupFromCustom : pickupFrom,
      pickupTo: pickupTo === 'Custom Location (specify in notes)' ? pickupToCustom : pickupTo,
      pickupDate: date,
      pickupTime: time,
      pickupPassengers: pax,
      pickupVehicle: vehicle,
      pickupReturnNeeded: returnTrip,
      pickupReturnDate: returnDate,
      pickupReturnTime: returnTime,
      pickupNotes: notes,
    })
    navigate('/booking/passengers')
  }

  return (
    <>
      <SEO title="Airport Pickup & Car Hire" description="Book comfortable airport pickups, intercity transfers, and charter vehicles." />

      {/* Hero */}
      <section className="relative bg-navy dark:bg-black pt-24 pb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1400&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 to-navy" />
        </div>
        <div className="relative container-pad text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-4">
            <Car size={12} /> Professional Drivers · On-Time Guarantee
          </div>
          <h1 className="font-extrabold text-4xl md:text-5xl text-white mb-2">Airport Pickup & Car Hire</h1>
          <p className="text-blue-200 text-base">Comfortable transfers across Nigeria — airports, intercity, charter</p>
        </div>
      </section>

      <section className="section-pad bg-surface-light dark:bg-surface-dark">
        <div className="container-pad max-w-4xl mx-auto">

          {/* Service type tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {[
              ['airport', <Plane size={18}/>, 'Airport Transfer'],
              ['intercity', <Building2 size={18}/>, 'Intercity Transfer'],
              ['charter', <Bus size={18}/>, 'Charter / Group Hire'],
            ].map(([val, icon, lbl]) => (
              <button key={val} onClick={() => setServiceType(val)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex gap-1 ${
                  serviceType === val
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary'
                }`}>{icon}{lbl}</button>
            ))}
          </div>

          {/* Form card */}
          <div className="bg-white dark:bg-card-dark rounded-3xl shadow-card p-6 md:p-8 border border-gray-100 dark:border-gray-800 mb-8">
            <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Trip Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {/* Pickup from */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 z-10" />
                  <select value={pickupFrom} onChange={e => setPickupFrom(e.target.value)}
                    className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                    <option value="">Select pickup location</option>
                    {PICKUP_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                {pickupFrom === 'Custom Location (specify in notes)' && (
                  <input value={pickupFromCustom} onChange={e => setPickupFromCustom(e.target.value)}
                    placeholder="Enter full pickup address"
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all" />
                )}
              </div>

              {/* Drop-off */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Drop-off Location
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 z-10" />
                  <select value={pickupTo} onChange={e => setPickupTo(e.target.value)}
                    className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                    <option value="">Select drop-off location</option>
                    {PICKUP_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                {pickupTo === 'Custom Location (specify in notes)' && (
                  <input value={pickupToCustom} onChange={e => setPickupToCustom(e.target.value)}
                    placeholder="Enter full drop-off address"
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all" />
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Pickup Date</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                  <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)}
                    className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Pickup Time</label>
                <div className="relative">
                  <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                  <input type="time" value={time} onChange={e => setTime(e.target.value)}
                    className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>

              {/* Passengers */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Number of Passengers</label>
                <div className="relative">
                  <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                  <input type="number" min={1} max={50} value={pax} onChange={e => setPax(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>

              {/* Return trip toggle */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Return Trip?</label>
                <div className="flex gap-3">
                  {[['no', 'One Way'], ['yes', 'Return Trip']].map(([val, lbl]) => (
                    <button key={val} onClick={() => setReturnTrip(val === 'yes')}
                      className={`flex-1 py-3.5 rounded-xl text-sm font-bold border-2 transition-all ${
                        (returnTrip && val === 'yes') || (!returnTrip && val === 'no')
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>{lbl}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Return details */}
            {returnTrip && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-2 gap-5 mb-5 overflow-hidden">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Return Date</label>
                  <input type="date" min={date || today} value={returnDate} onChange={e => setReturnDate(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Return Pickup Time</label>
                  <input type="time" value={returnTime} onChange={e => setReturnTime(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all" />
                </div>
              </motion.div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Special Instructions / Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                placeholder="Flight number for airport pickup, specific address details, luggage quantity, child seat needed, etc."
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
            </div>
          </div>

          {/* Vehicle selection */}
          <div className="mb-8">
            <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Choose Your Vehicle</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {pax > 1 ? `For ${pax} passengers, we recommend vehicles with at least ${pax} seats.` : 'Select the vehicle that best suits your needs.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PICKUP_VEHICLES.filter(v => v.seats >= pax || v.id === 'coaster').map(v => (
                <VehicleCard key={v.id} vehicle={v} selected={vehicle} onSelect={setVehicle} />
              ))}
            </div>
          </div>

          {/* Summary & CTA */}
          {vehicle && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-card-dark rounded-2xl border border-primary/20 shadow-card p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Vehicle</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{vehicle.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Route</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-right max-w-[60%]">
                    {pickupFrom || '—'} → {pickupTo || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date & Time</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{date || '—'} at {time || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Passengers</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{pax}</span>
                </div>
                {returnTrip && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Return</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{returnDate || '—'} at {returnTime || '—'}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-gray-800 font-bold">
                  <span className="text-gray-900 dark:text-white">Estimated Fare</span>
                  <span className="text-primary text-lg">{formatNGN(totalFare)}</span>
                </div>
                <p className="text-[11px] text-gray-400">* Final price confirmed after trip distance calculation. Extra charges may apply for tolls.</p>
              </div>
              <button onClick={proceed} disabled={!canProceed}
                className="w-full py-4 rounded-xl font-bold text-sm text-white bg-primary-gradient shadow-glow hover:shadow-none transition-all hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
                Continue to Passenger Details <ArrowRight size={15} />
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
