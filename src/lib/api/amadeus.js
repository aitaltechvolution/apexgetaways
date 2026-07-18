/**
 * Amadeus Flight API wrapper
 * Uses Amadeus Test API (free tier — https://developers.amadeus.com)
 * Replace AMADEUS_CLIENT_ID / AMADEUS_CLIENT_SECRET with real keys.
 * Test credentials work for search endpoints with dummy but realistic data.
 */

const BASE = 'https://test.api.amadeus.com'

let _token = null
let _tokenExpiry = 0

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token
  const id     = import.meta.env.VITE_AMADEUS_CLIENT_ID     || 'DEMO_CLIENT_ID'
  const secret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET || 'DEMO_CLIENT_SECRET'

  try {
    const res = await fetch(`${BASE}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${id}&client_secret=${secret}`,
    })
    if (!res.ok) throw new Error('token_failed')
    const data = await res.json()
    _token = data.access_token
    _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
    return _token
  } catch {
    return null
  }
}

async function amadeusGet(path, params = {}) {
  const token = await getToken()
  if (!token) return null
  const url = new URL(`${BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => v !== undefined && v !== '' && url.searchParams.set(k, v))
  try {
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ── Flight Offers Search ──────────────────────────────────────────────────────
export async function searchFlights({ origin, destination, departureDate, returnDate, adults = 1, children = 0, infants = 0, travelClass = 'ECONOMY', nonStop = false, currencyCode = 'NGN', max = 20 }) {
  const data = await amadeusGet('/v2/shopping/flight-offers', {
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate,
    returnDate: returnDate || undefined,
    adults,
    children: children || undefined,
    infants: infants || undefined,
    travelClass,
    nonStop: nonStop || undefined,
    currencyCode,
    max,
  })
  return data?.data || null
}

// ── Multi-city ────────────────────────────────────────────────────────────────
export async function searchMultiCity(segments, { adults = 1, travelClass = 'ECONOMY', currencyCode = 'NGN' } = {}) {
  const token = await getToken()
  if (!token) return null
  try {
    const res = await fetch(`${BASE}/v2/shopping/flight-offers`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currencyCode,
        originDestinations: segments.map((s, i) => ({
          id: String(i + 1),
          originLocationCode: s.origin,
          destinationLocationCode: s.destination,
          departureDateTimeRange: { date: s.date },
        })),
        travelers: [{ id: '1', travelerType: 'ADULT' }].slice(0, adults),
        sources: ['GDS'],
        searchCriteria: { maxFlightOffers: 20, flightFilters: { cabinRestrictions: [{ cabin: travelClass, coverage: 'MOST_SEGMENTS', originDestinationIds: segments.map((_, i) => String(i + 1)) }] } },
      }),
    })
    const data = await res.json()
    return data?.data || null
  } catch { return null }
}

// ── Price confirmation ────────────────────────────────────────────────────────
export async function confirmFlightPrice(offer) {
  const token = await getToken()
  if (!token) return null
  try {
    const res = await fetch(`${BASE}/v1/shopping/flight-offers/pricing`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { type: 'flight-offers-pricing', flightOffers: [offer] } }),
    })
    const data = await res.json()
    return data?.data || null
  } catch { return null }
}

// ── Airport autocomplete ──────────────────────────────────────────────────────
export async function searchAirports(keyword) {
  const data = await amadeusGet('/v1/reference-data/locations', {
    keyword,
    subType: 'AIRPORT,CITY',
    'page[limit]': 8,
  })
  return data?.data || []
}

// ── Airline name lookup ───────────────────────────────────────────────────────
export async function getAirlineName(iataCode) {
  const data = await amadeusGet('/v1/reference-data/airlines', { airlineCodes: iataCode })
  return data?.data?.[0]?.businessName || iataCode
}

// ── Hotel search ──────────────────────────────────────────────────────────────
export async function searchHotels({ cityCode, checkIn, checkOut, adults = 1, roomQuantity = 1, currency = 'NGN', ratings }) {
  // Step 1: get hotel IDs in city
  const hotelList = await amadeusGet('/v1/reference-data/locations/hotels/by-city', {
    cityCode,
    ratings: ratings?.join(','),
  })
  const hotelIds = hotelList?.data?.slice(0, 20).map(h => h.hotelId) || []
  if (!hotelIds.length) return null

  // Step 2: get offers
  const data = await amadeusGet('/v3/shopping/hotel-offers', {
    hotelIds: hotelIds.join(','),
    checkInDate: checkIn,
    checkOutDate: checkOut,
    adults,
    roomQuantity,
    currency,
    bestRateOnly: true,
  })
  return data?.data || null
}
