// Vercel serverless function — runs server-side only.
// Same reasoning as api/flights.js: Duffel needs a secret bearer token that
// must never reach the browser (DUFFEL_ACCESS_TOKEN, set in Vercel env vars,
// never prefixed with VITE_). This wraps Duffel's Stays API (real hotel
// inventory) and returns data already shaped for HotelCard.

function nightsBetween(checkIn, checkOut) {
  return Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
}

// Duffel Stays search takes lat/lng, not a city name — geocode with a free,
// keyless API first.
async function geocodeCity(city) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
  const json = await res.json()
  const hit = json?.results?.[0]
  if (!hit) throw new Error(`Could not find coordinates for "${city}"`)
  return { latitude: hit.latitude, longitude: hit.longitude }
}

function formatAddress(location, fallbackCity) {
  const a = location?.address || {}
  return [a.line_one, a.city_name, a.region].filter(Boolean).join(', ') || fallbackCity
}

// The search endpoint's room/rate data isn't guaranteed complete (Duffel's
// own docs say so) — use it when present, otherwise fall back to a single
// room built from cheapest_rate_total_amount, which Duffel guarantees is
// always accurate.
function mapRoomTypes(accommodation, ngnRate, fallbackPerNight, nights) {
  const rooms = accommodation?.rooms || []
  const mapped = rooms
    .filter(r => r.rates?.length)
    .map(r => {
      const rate = r.rates[0]
      const totalNgn = Math.round(Number(rate.total_amount) * ngnRate)
      const beds = (r.beds || []).map(b => `${b.count} ${b.type}`).join(' + ') || undefined
      return { type: r.name || 'Room', price: Math.round(totalNgn / nights), beds }
    })
  return mapped.length ? mapped : [{ type: 'Standard Room', price: fallbackPerNight, beds: undefined }]
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&q=80',
]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.DUFFEL_ACCESS_TOKEN
  if (!token) return res.status(501).json({ error: 'DUFFEL_ACCESS_TOKEN not configured on the server' })

  const { city, checkIn, checkOut, adults = 2, children = 0, rooms = 1 } = req.body || {}
  if (!city || !checkIn || !checkOut) return res.status(400).json({ error: 'city, checkIn and checkOut are required' })

  const nights = nightsBetween(checkIn, checkOut)

  let coords
  try {
    coords = await geocodeCity(city)
  } catch (err) {
    return res.status(400).json({ error: String(err.message || err) })
  }

  const guests = []
  for (let i = 0; i < adults; i++) guests.push({ type: 'adult' })
  for (let i = 0; i < children; i++) guests.push({ type: 'child', age: 10 }) // exact ages aren't collected at search time

  try {
    const duffelRes = await fetch('https://api.duffel.com/stays/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Duffel-Version': 'v2',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          location: { radius: 25, geographic_coordinates: { latitude: coords.latitude, longitude: coords.longitude } },
          check_in_date: checkIn,
          check_out_date: checkOut,
          rooms,
          guests,
        },
      }),
    })

    const rawText = await duffelRes.text()
    let json
    try { json = JSON.parse(rawText) }
    catch { return res.status(502).json({ error: 'Duffel returned a non-JSON response', detail: rawText.slice(0, 300) }) }

    if (!duffelRes.ok) {
      return res.status(duffelRes.status).json({ error: json?.errors?.[0]?.message || 'Duffel Stays request failed' })
    }

    const results = json.data?.results || []
    if (!results.length) return res.status(200).json({ hotels: [] })

    // The site always displays NGN — batch-convert whatever currency each
    // result is priced in (varies by accommodation), one FX call per
    // currency rather than per result.
    const currencies = [...new Set(results.map(r => r.cheapest_rate_currency).filter(Boolean))]
    const rateMap = {}
    await Promise.all(currencies.map(async (cur) => {
      if (cur === 'NGN') { rateMap[cur] = 1; return }
      try {
        const fx = await fetch(`https://open.er-api.com/v6/latest/${cur}`)
        const fxJson = await fx.json()
        rateMap[cur] = fxJson?.rates?.NGN || 1600
      } catch { rateMap[cur] = 1600 }
    }))

    const hotels = results.map((r, i) => {
      const acc = r.accommodation || {}
      const cur = r.cheapest_rate_currency || 'USD'
      const ngnRate = rateMap[cur] || 1600
      const totalNgn = Math.round(Number(r.cheapest_rate_total_amount) * ngnRate)
      const perNight = Math.round(totalNgn / nights)
      const firstRoomRate = acc.rooms?.[0]?.rates?.[0]

      return {
        id: acc.id || r.id,
        source: 'duffel',
        name: acc.name || 'Hotel',
        chain: acc.chain?.name || acc.brand?.name || '',
        city: acc.location?.address?.city_name || city,
        stars: acc.rating || 3,
        rating: acc.review_score != null ? Number(acc.review_score).toFixed(1) : 0,
        reviews: acc.review_count || 0,
        img: acc.photos?.[0]?.url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
        address: formatAddress(acc.location, city),
        perNight,
        nights,
        total: perNight * nights,
        amenities: (acc.amenities || []).map(a => a.description).filter(Boolean).slice(0, 8),
        roomTypes: mapRoomTypes(acc, ngnRate, perNight, nights),
        freeCancellation: !!firstRoomRate?.cancellation_timeline?.length,
        breakfastIncluded: !!(firstRoomRate?.benefits || []).some(b => b.type === 'breakfast_included'),
      }
    }).sort((a, b) => a.perNight - b.perNight).slice(0, 20)

    res.status(200).json({ hotels })
  } catch (err) {
    res.status(502).json({ error: 'Could not reach Duffel', detail: String(err) })
  }
}