// ── AviationStack (free, 100 req/mo, no CORS on free — we use a proxy or fallback) ──
// Free key: register at aviationstack.com — store in .env as VITE_AVIATION_KEY
// Unsplash API for hotel images — free, 50 req/hr
// CountriesNow API — completely free, no key needed

const AVIATION_KEY = import.meta.env.VITE_AVIATION_KEY || ''
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY || ''

// ─── Autocomplete airports from free API ─────────────────────────────────────
// Uses countrylayer + our local AIRPORTS as fallback
export async function searchAirports(query) {
  if (query.length < 2) return []
  try {
    // AviationStack autocomplete (key required but free tier available)
    if (AVIATION_KEY) {
      const res = await fetch(
        `https://api.aviationstack.com/v1/airports?access_key=${AVIATION_KEY}&search=${query}&limit=8`
      )
      const data = await res.json()
      if (data?.data?.length) {
        return data.data.map(a => ({
          code: a.iata_code,
          name: a.airport_name,
          city: a.city_name || a.city,
          country: a.country_name,
        })).filter(a => a.code)
      }
    }
  } catch {}
  return null // null = use local fallback
}

// ─── Hotel images from Unsplash (free, real photos) ──────────────────────────
export async function fetchHotelImages(city, count = 8) {
  const cache = {}
  const cacheKey = `hotel_imgs_${city}`
  if (cache[cacheKey]) return cache[cacheKey]

  try {
    const query = encodeURIComponent(`${city} luxury hotel interior`)
    const url = UNSPLASH_KEY
      ? `https://api.unsplash.com/photos/random?query=${query}&count=${count}&client_id=${UNSPLASH_KEY}&orientation=landscape`
      : `https://api.unsplash.com/photos/random?query=${query}&count=${count}&client_id=demo&orientation=landscape`

    const res = await fetch(url)
    if (!res.ok) throw new Error('Unsplash error')
    const data = await res.json()
    const imgs = data.map(p => p.urls.regular)
    cache[cacheKey] = imgs
    return imgs
  } catch {
    // Fallback: curated Unsplash hotel images (no key needed, source URL)
    return [
      `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80`,
      `https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&q=80`,
      `https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&q=80`,
      `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&q=80`,
      `https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=700&q=80`,
      `https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700&q=80`,
      `https://images.unsplash.com/photo-1582719508461-905c673771fd?w=700&q=80`,
      `https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&q=80`,
      `https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=700&q=80`,
      `https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=700&q=80`,
    ].slice(0, count)
  }
}

// ─── Country & city data (free, no key) ──────────────────────────────────────
export async function fetchCitiesByCountry(country) {
  try {
    const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country })
    })
    const data = await res.json()
    return data?.data?.slice(0, 20) || []
  } catch { return [] }
}

// ─── Exchange rates (free, no key) ───────────────────────────────────────────
export async function getExchangeRate(from = 'USD', to = 'NGN') {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`)
    const data = await res.json()
    return data?.rates?.[to] || 1600 // fallback NGN rate
  } catch { return 1600 }
}

// ─── Country flags & info (free REST Countries) ───────────────────────────────
export async function getCountryInfo(name) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fields=name,flags,capital,currencies`)
    const data = await res.json()
    return data?.[0] || null
  } catch { return null }
}
