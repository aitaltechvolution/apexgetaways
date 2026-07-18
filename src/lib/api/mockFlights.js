/**
 * Realistic mock flight data — used as fallback when Amadeus keys aren't configured,
 * or for demo/dev mode. Mirrors the Amadeus v2 flight-offers response shape exactly.
 */
import { formatNGN } from '../utils'

const AIRLINES = {
  QR: { name: 'Qatar Airways',    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Qatar_Airways_Logo.png/200px-Qatar_Airways_Logo.png' },
  EK: { name: 'Emirates',         logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/200px-Emirates_logo.svg.png' },
  ET: { name: 'Ethiopian Airlines',logo: 'https://logo.clearbit.com/ethiopianairlines.com' },
  LH: { name: 'Lufthansa',        logo: 'https://logo.clearbit.com/lufthansa.com' },
  BA: { name: 'British Airways',  logo: 'https://logo.clearbit.com/britishairways.com' },
  TK: { name: 'Turkish Airlines', logo: 'https://logo.clearbit.com/turkishairlines.com' },
  AF: { name: 'Air France',       logo: 'https://logo.clearbit.com/airfrance.com' },
  KL: { name: 'KLM',              logo: 'https://logo.clearbit.com/klm.com' },
  W3: { name: 'Arik Air',         logo: 'https://logo.clearbit.com/arikair.com' },
  P4: { name: 'Air Peace',        logo: 'https://logo.clearbit.com/flyairpeace.com' },
}

function pad(n) { return String(n).padStart(2,'0') }
function addMinutes(dateStr, mins) {
  const d = new Date(dateStr)
  d.setMinutes(d.getMinutes() + mins)
  return d.toISOString().slice(0,16)
}

function makeFlight({ id, origin, dest, dep, carrierCode, flightNo, durationMins, price, stops = 0, cabin = 'ECONOMY', seats = 9, refundable = true, layover = null }) {
  const arr = addMinutes(dep, durationMins)
  const segs = stops === 0 ? [{
    departure: { iataCode: origin, at: dep },
    arrival:   { iataCode: dest,   at: arr },
    carrierCode, number: flightNo,
    aircraft: { code: '77W' },
    duration: `PT${Math.floor(durationMins/60)}H${durationMins%60}M`,
    numberOfStops: 0,
    id: `${id}-s1`,
  }] : [
    { departure: { iataCode: origin, at: dep }, arrival: { iataCode: layover.code, at: addMinutes(dep, layover.legMins) }, carrierCode, number: flightNo, aircraft: { code: '73H' }, duration: `PT${Math.floor(layover.legMins/60)}H${layover.legMins%60}M`, numberOfStops: 0, id: `${id}-s1` },
    { departure: { iataCode: layover.code, at: addMinutes(dep, layover.legMins + layover.stopMins) }, arrival: { iataCode: dest, at: arr }, carrierCode, number: String(Number(flightNo)+1), aircraft: { code: '77W' }, duration: `PT${Math.floor(layover.leg2Mins/60)}H${layover.leg2Mins%60}M`, numberOfStops: 0, id: `${id}-s2` },
  ]

  return {
    id,
    type: 'flight-offer',
    source: 'GDS',
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: new Date(Date.now() + 86400000*7).toISOString().slice(0,10),
    numberOfBookableSeats: seats,
    itineraries: [{ duration: `PT${Math.floor(durationMins/60)}H${durationMins%60}M`, segments: segs }],
    price: { currency: 'NGN', total: String(price), base: String(Math.round(price*0.82)), fees: [{ amount: String(Math.round(price*0.18)), type: 'SUPPLIER' }], grandTotal: String(price) },
    pricingOptions: { fareType: ['PUBLISHED'], includedCheckedBagsOnly: true },
    validatingAirlineCodes: [carrierCode],
    travelerPricings: [{
      travelerId: '1', fareOption: 'STANDARD', travelerType: 'ADULT',
      price: { currency: 'NGN', total: String(price), base: String(Math.round(price*0.82)) },
      fareDetailsBySegment: segs.map(s => ({ segmentId: s.id, cabin, fareBasis: cabin === 'ECONOMY' ? 'Y' : 'C', brandedFare: cabin, class: cabin === 'ECONOMY' ? 'Y' : 'C', includedCheckedBags: { quantity: cabin === 'ECONOMY' ? 1 : 2 } })),
    }],
    _meta: { airline: AIRLINES[carrierCode] || { name: carrierCode, logo: '' }, refundable, seatsLeft: seats },
  }
}

// Generate mock results based on any search query
export function generateMockFlights({ origin = 'LOS', destination = 'LHR', departureDate, adults = 1 }) {
  const base = departureDate || new Date().toISOString().slice(0,10)
  const priceBase = { LHR: 1250000, CDG: 1100000, JFK: 1650000, DXB: 780000, IST: 720000, ADD: 380000, MLE: 1800000 }[destination] || 900000
  const mult = adults

  return [
    makeFlight({ id:'1', origin, dest: destination, dep:`${base}T07:30:00`, carrierCode:'QR', flightNo:'412', durationMins:720, price: Math.round(priceBase*mult*0.92), cabin:'ECONOMY', seats:9, refundable:true, stops:1, layover:{ code:'DOH', legMins:300, stopMins:120, leg2Mins:300 } }),
    makeFlight({ id:'2', origin, dest: destination, dep:`${base}T10:15:00`, carrierCode:'EK', flightNo:'783', durationMins:690, price: Math.round(priceBase*mult*0.98), cabin:'ECONOMY', seats:4, refundable:true, stops:1, layover:{ code:'DXB', legMins:360, stopMins:90, leg2Mins:240 } }),
    makeFlight({ id:'3', origin, dest: destination, dep:`${base}T14:45:00`, carrierCode:'ET', flightNo:'911', durationMins:780, price: Math.round(priceBase*mult*0.85), cabin:'ECONOMY', seats:12, refundable:false, stops:1, layover:{ code:'ADD', legMins:240, stopMins:180, leg2Mins:360 } }),
    makeFlight({ id:'4', origin, dest: destination, dep:`${base}T23:55:00`, carrierCode:'TK', flightNo:'623', durationMins:660, price: Math.round(priceBase*mult*0.95), cabin:'ECONOMY', seats:6, refundable:true, stops:1, layover:{ code:'IST', legMins:300, stopMins:120, leg2Mins:240 } }),
    makeFlight({ id:'5', origin, dest: destination, dep:`${base}T08:00:00`, carrierCode:'LH', flightNo:'566', durationMins:900, price: Math.round(priceBase*mult*1.12), cabin:'ECONOMY', seats:3, refundable:true, stops:1, layover:{ code:'FRA', legMins:360, stopMins:150, leg2Mins:390 } }),
    // Business class options
    makeFlight({ id:'6', origin, dest: destination, dep:`${base}T07:30:00`, carrierCode:'QR', flightNo:'412', durationMins:720, price: Math.round(priceBase*mult*2.8), cabin:'BUSINESS', seats:4, refundable:true, stops:1, layover:{ code:'DOH', legMins:300, stopMins:120, leg2Mins:300 } }),
    makeFlight({ id:'7', origin, dest: destination, dep:`${base}T10:15:00`, carrierCode:'EK', flightNo:'783', durationMins:690, price: Math.round(priceBase*mult*3.1), cabin:'BUSINESS', seats:2, refundable:true, stops:1, layover:{ code:'DXB', legMins:360, stopMins:90, leg2Mins:240 } }),
    // First class
    makeFlight({ id:'8', origin, dest: destination, dep:`${base}T07:30:00`, carrierCode:'QR', flightNo:'412', durationMins:720, price: Math.round(priceBase*mult*5.5), cabin:'FIRST', seats:2, refundable:true, stops:1, layover:{ code:'DOH', legMins:300, stopMins:120, leg2Mins:300 } }),
  ]
}

export { AIRLINES }
