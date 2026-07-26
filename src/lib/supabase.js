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
