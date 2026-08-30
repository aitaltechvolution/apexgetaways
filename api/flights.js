// Vercel serverless function — runs server-side only.
// Duffel's API must never be called directly from the browser: it requires a
// secret bearer token, and Duffel's own docs say their client library "won't
// work in frontend applications that run in your users' browsers." This
// function holds the token (DUFFEL_ACCESS_TOKEN, set in Vercel env vars —
// never prefixed with VITE_, so it's never bundled into client JS) and
// returns simplified, already-shaped flight data to the browser.

function parseISODuration(iso) {
  // "PT7H30M" -> { mins: 450, label: "7h 30m" }
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?/.exec(iso || '')
  const h = Number(m?.[1] || 0), min = Number(m?.[2] || 0)
  return { mins: h * 60 + min, label: `${h}h ${min}m` }
}
function hhmm(iso) {
  const d = new Date(iso)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

function mapOffer(offer, sliceIndex, from, to, date, cabinClass, ngnRate, paxCount) {
  const slice = offer.slices[sliceIndex]
  if (!slice) return null
  const segments = slice.segments
  const first = segments[0]
  const last = segments[segments.length - 1]
  const { mins, label } = parseISODuration(slice.duration)
  // offer.total_amount is the TOTAL for every passenger in the request, but
  // the rest of the app (FlightCard, sorting, totalFare) treats this price
  // as PER-PASSENGER and multiplies by passenger count itself — so divide
  // here to match that contract, or every fare would be charged twice over.
  const perPax = Number(offer.total_amount) / Math.max(1, paxCount)
  const amount = Math.round(perPax * ngnRate) // Duffel amount -> NGN
  const price = { economy: amount, premium_economy: amount, business: amount, first: amount, [cabinClass]: amount }

  return {
    id: `${offer.id}-${sliceIndex}`,
    offerId: offer.id,
    source: 'duffel',
    airline: first.marketing_carrier?.name || offer.owner?.name || 'Unknown',
    airlineCode: first.marketing_carrier?.iata_code || offer.owner?.iata_code || '',
    flightNo: `${first.marketing_carrier?.iata_code || ''}${first.marketing_carrier_flight_number || ''}`,
    from, to, date,
    dep: hhmm(first.departing_at),
    arr: hhmm(last.arriving_at),
    duration: label, durationMins: mins,
    stops: segments.length - 1,
    stopCity: segments.length > 1 ? segments[0].destination?.iata_code : null,
    seatsLeft: null, // Duffel doesn't expose an exact remaining-seats count
    baggage: segments[0]?.passengers?.[0]?.baggages?.length ? 'Checked bag included' : 'See fare rules',
    refundable: !!offer.conditions?.refund_before_departure?.allowed,
    ...price,
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.DUFFEL_ACCESS_TOKEN
  if (!token) return res.status(501).json({ error: 'DUFFEL_ACCESS_TOKEN not configured on the server' })

  const { from, to, date, returnDate, passengers = [{ type: 'adult' }], cabinClass = 'economy' } = req.body || {}
  if (!from || !to || !date) return res.status(400).json({ error: 'from, to and date are required' })

  const slices = [{ origin: from, destination: to, departure_date: date }]
  if (returnDate) slices.push({ origin: to, destination: from, departure_date: returnDate })

  try {
    const duffelRes = await fetch('https://api.duffel.com/air/offer_requests?return_offers=true&supplier_timeout=15000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Duffel-Version': 'v2',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ data: { slices, passengers, cabin_class: cabinClass } }),
    })

    const rawText = await duffelRes.text()
    let json
    try { json = JSON.parse(rawText) }
    catch { return res.status(502).json({ error: 'Duffel returned a non-JSON response', detail: rawText.slice(0, 300) }) }

    if (!duffelRes.ok) {
      return res.status(duffelRes.status).json({ error: json?.errors?.[0]?.message || 'Duffel request failed' })
    }

    const offers = json.data?.offers || []

    // The site always displays NGN — convert whatever currency Duffel priced
    // the offer in (varies by airline/route) to NGN before returning.
    const currency = offers[0]?.total_currency || 'USD'
    let ngnRate = 1
    if (currency !== 'NGN') {
      try {
        const fx = await fetch(`https://open.er-api.com/v6/latest/${currency}`)
        const fxJson = await fx.json()
        ngnRate = fxJson?.rates?.NGN || 1600
      } catch { ngnRate = 1600 }
    }

    const outbound = offers.map(o => mapOffer(o, 0, from, to, date, cabinClass, ngnRate, passengers.length)).filter(Boolean)
    const inbound = returnDate
      ? offers.map(o => mapOffer(o, 1, to, from, returnDate, cabinClass, ngnRate, passengers.length)).filter(Boolean)
      : []

    // De-dupe by airline+flightNo+dep, keep cheapest, cap the list
    const dedupe = (list) => {
      const seen = new Map()
      for (const f of list) {
        const key = `${f.airlineCode}-${f.flightNo}-${f.dep}`
        if (!seen.has(key) || seen.get(key).economy > f.economy) seen.set(key, f)
      }
      return [...seen.values()].sort((a, b) => a.economy - b.economy).slice(0, 20)
    }

    res.status(200).json({ outbound: dedupe(outbound), inbound: dedupe(inbound) })
  } catch (err) {
    res.status(502).json({ error: 'Could not reach Duffel', detail: String(err) })
  }
}
