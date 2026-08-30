import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL      || 'https://demo.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY  || 'demo-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── shape helpers ─────────────────────────────────────────────────────────
// Keep the exact same camelCase object shape the app was already built around
// (it used to come from Firestore), so components don't need to change.
export function normalizeUser(u) {
  if (!u) return null
  return { ...u, uid: u.id } // alias .uid -> .id for Firebase-shaped consumers
}
function profileFromRow(row) {
  if (!row) return null
  return {
    id: row.id, uid: row.id,
    email: row.email,
    displayName: row.display_name,
    photoURL: row.photo_url,
    role: row.role,
    phone: row.phone,
    nationality: row.nationality,
    passportNo: row.passport_no,
    passportExpiry: row.passport_expiry,
    dob: row.dob,
    address: row.address,
    passportUrl: row.passport_url,
    profileComplete: row.profile_complete,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
function profileToRow(data) {
  const map = {
    displayName: 'display_name', photoURL: 'photo_url',
    passportNo: 'passport_no', passportExpiry: 'passport_expiry',
    passportUrl: 'passport_url', profileComplete: 'profile_complete',
  }
  // Only real, user-editable columns — ignore system fields like id/uid/email/
  // role/createdAt that callers sometimes spread in wholesale (harmless with
  // Firestore's schemaless docs, but Postgres rejects unknown columns).
  const allowed = new Set([
    'displayName', 'photoURL', 'phone', 'nationality', 'passportNo',
    'passportExpiry', 'dob', 'address', 'passportUrl', 'profileComplete',
  ])
  const row = {}
  for (const [k, v] of Object.entries(data)) {
    if (allowed.has(k)) row[map[k] || k] = v
  }
  return row
}
function bookingFromRow(row) {
  if (!row) return null
  const { id, user_id, order_ref, status, pnr, ticket_url, admin_notes,
    worker_assigned, payment_ref, data, created_at, updated_at } = row
  return {
    id, userId: user_id, orderRef: order_ref, status, pnr,
    ticketUrl: ticket_url, adminNotes: admin_notes, workerAssigned: worker_assigned,
    paymentRef: payment_ref, createdAt: created_at, updatedAt: updated_at,
    ...(data || {}),
  }
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
  if (error) throw error
  // Supabase OAuth is redirect-based — the session becomes available
  // after the browser returns, via onAuthStateChange in AuthContext.
  return null
}
export async function registerWithEmail(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { display_name: displayName } },
  })
  if (error) throw error
  return normalizeUser(data.user)
}
export async function loginWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return normalizeUser(data.user)
}
export async function logout() {
  await supabase.auth.signOut()
}
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  if (error) throw error
}
export async function changePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

export async function getUserDoc(uid) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
  if (error) throw error
  return profileFromRow(data)
}
export async function updateUserDoc(uid, data) {
  const { error } = await supabase.from('profiles').update(profileToRow(data)).eq('id', uid)
  if (error) throw error
}
export async function getAllUsers() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(profileFromRow)
}
export async function getUsersByRole(role) {
  const { data, error } = await supabase.from('profiles').select('*').eq('role', role)
  if (error) throw error
  return (data || []).map(profileFromRow)
}
export async function setUserRole(uid, role) {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', uid)
  if (error) throw error
}

// ─── LEADS (Contact form + Newsletter) ─────────────────────────────────────
export async function saveLead({ source = 'contact', name, email, phone, service, interest, message }) {
  const { error } = await supabase.from('leads').insert({ source, name, email, phone, service, interest, message })
  if (error) throw error
}
export async function getLeads() {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ─── FILE UPLOAD ──────────────────────────────────────────────────────────────
export async function uploadPassport(uid, file) {
  try {
    const path = `${uid}/${Date.now()}_${file.name}`
    const { error: upErr } = await supabase.storage.from('passports').upload(path, file, { upsert: true })
    if (upErr) throw upErr
    const { data } = supabase.storage.from('passports').getPublicUrl(path)
    const url = data.publicUrl
    await supabase.from('profiles').update({ passport_url: url }).eq('id', uid)
    return url
  } catch (e) {
    // Demo mode — return placeholder
    return `https://placehold.co/400x300?text=Passport+Uploaded`
  }
}

// ─── PRICING / MARKUP SETTINGS ────────────────────────────────────────────────
// Admin-configurable flat "gain" (in NGN) added on top of whatever the
// flight/hotel source returns, before it's shown to the client.
const DEFAULT_MARKUP = { flightMarkupAmount: 0, hotelMarkupAmount: 0 }

export async function getPricingSettings() {
  try {
    const { data, error } = await supabase.from('pricing_settings').select('*').eq('id', 1).maybeSingle()
    if (error || !data) return DEFAULT_MARKUP
    return {
      flightMarkupAmount: Number(data.flight_markup_amount) || 0,
      hotelMarkupAmount:  Number(data.hotel_markup_amount)  || 0,
    }
  } catch { return DEFAULT_MARKUP }
}
export async function updatePricingSettings({ flightMarkupAmount, hotelMarkupAmount }) {
  const { error } = await supabase.from('pricing_settings').update({
    flight_markup_amount: flightMarkupAmount,
    hotel_markup_amount:  hotelMarkupAmount,
  }).eq('id', 1)
  if (error) throw error
}
// Adds a flat NGN amount to a price.
export function applyMarkup(amount, flatAmount) {
  return Math.round(Number(amount || 0) + Number(flatAmount || 0))
}

// ─── LOCATION PRICING (hotel pickups) ─────────────────────────────────────────
// Admin sets an exact NGN price per country, per Nigerian state, or for
// Nigeria as a whole (scope='country', code='NG').
function locationFromRow(row) {
  if (!row) return null
  return {
    id: row.id, scope: row.scope, code: row.code, name: row.name,
    currency: row.currency, price: Number(row.price), updatedAt: row.updated_at,
  }
}
export async function getLocationPricing() {
  const { data, error } = await supabase.from('location_pricing').select('*').order('name')
  if (error) throw error
  return (data || []).map(locationFromRow)
}
export async function addLocationPricing({ scope, code, name, currency, price }) {
  const { error } = await supabase.from('location_pricing')
    .upsert({ scope, code, name, currency, price }, { onConflict: 'scope,code' })
  if (error) throw error
}
export async function updateLocationPricing(id, price) {
  const { error } = await supabase.from('location_pricing').update({ price }).eq('id', id)
  if (error) throw error
}
export async function deleteLocationPricing(id) {
  const { error } = await supabase.from('location_pricing').delete().eq('id', id)
  if (error) throw error
}
// Looks up a price for a state, falling back to its country ('NG' for
// Nigerian states), then to a sensible default if nothing is configured yet.
export function resolveLocationPrice(list, { scope, code }) {
  const exact = list.find(l => l.scope === scope && l.code === code)
  if (exact) return exact.price
  if (scope === 'state') {
    const wholeCountry = list.find(l => l.scope === 'country' && l.code === 'NG')
    if (wholeCountry) return wholeCountry.price
  }
  return null // caller decides the fallback (e.g. the static rate card)
}

export async function uploadBookingDocument(bookingId, file) {
  const path = `${bookingId}/${Date.now()}_${file.name}`
  const { error: upErr } = await supabase.storage.from('tickets').upload(path, file, { upsert: true })
  if (upErr) throw upErr
  const { data } = supabase.storage.from('tickets').getPublicUrl(path)
  return data.publicUrl
}

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
export const BOOKING_STATUSES = {
  PENDING_PAYMENT:   'pending_payment',
  PAYMENT_RECEIVED:  'payment_received',
  PROCESSING:        'processing',
  TICKETS_ISSUED:    'tickets_issued',
  CONFIRMED:         'confirmed',
  CANCELLED:         'cancelled',
  REFUNDED:          'refunded',
}

export async function saveBooking(userId, bookingData) {
  const orderRef = `APX-${Date.now().toString(36).toUpperCase().slice(-6)}`
  const row = {
    user_id: userId,
    order_ref: orderRef,
    status: BOOKING_STATUSES.PENDING_PAYMENT,
    pnr: null, ticket_url: null, admin_notes: '',
    worker_assigned: null, payment_ref: null,
    data: bookingData,
  }
  const { data, error } = await supabase.from('bookings').insert(row).select('id').single()
  if (error) throw error
  return { id: data.id, orderRef }
}
export async function getUserBookings(userId) {
  const { data, error } = await supabase.from('bookings').select('*')
    .eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(bookingFromRow)
}
export async function getAllBookings() {
  const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(bookingFromRow)
}
export async function getBookingById(id) {
  const { data, error } = await supabase.from('bookings').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return bookingFromRow(data)
}
export async function updateBooking(id, data) {
  const map = {
    ticketUrl: 'ticket_url', adminNotes: 'admin_notes',
    workerAssigned: 'worker_assigned', paymentRef: 'payment_ref', orderRef: 'order_ref',
  }
  const row = {}
  for (const [k, v] of Object.entries(data)) row[map[k] || k] = v
  const { error } = await supabase.from('bookings').update(row).eq('id', id)
  if (error) throw error
}
export function subscribeBookings(callback) {
  let cancelled = false
  getAllBookings().then(rows => !cancelled && callback(rows)).catch(() => {})
  const channel = supabase.channel('bookings-all')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' },
      () => getAllBookings().then(rows => !cancelled && callback(rows)).catch(() => {}))
    .subscribe()
  return () => { cancelled = true; supabase.removeChannel(channel) }
}
export function subscribeUserBookings(userId, callback) {
  let cancelled = false
  getUserBookings(userId).then(rows => !cancelled && callback(rows)).catch(() => {})
  const channel = supabase.channel(`bookings-user-${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `user_id=eq.${userId}` },
      () => getUserBookings(userId).then(rows => !cancelled && callback(rows)).catch(() => {}))
    .subscribe()
  return () => { cancelled = true; supabase.removeChannel(channel) }
}

// ─── PAYSTACK (Popup) ────────────────────────────────────────────────────────
export function initPaystack({ email, amount, ref, metadata, onSuccess, onClose }) {
  const pubKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_demo_key_replace_me'
  if (window.PaystackPop) {
    const handler = window.PaystackPop.setup({
      key: pubKey, email, amount: Math.round(amount * 100), // kobo
      currency: 'NGN', ref,
      metadata: { ...metadata, custom_fields: [] },
      callback: (res) => onSuccess(res),
      onClose: () => onClose && onClose(),
    })
    handler.openIframe()
  } else {
    // Paystack not loaded — simulate for demo
    setTimeout(() => onSuccess({ reference: `demo_${Date.now()}`, status: 'success' }), 1500)
  }
}
