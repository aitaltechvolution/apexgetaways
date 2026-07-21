import { initializeApp } from 'firebase/app'
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile
} from 'firebase/auth'
import {
  getFirestore, doc, setDoc, getDoc, collection,
  addDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp, onSnapshot
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'demo-key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'demo.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'apex-demo',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'apex-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:0:web:000',
}

const app = initializeApp(firebaseConfig)
export const auth    = getAuth(app)
export const db      = getFirestore(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()

// ─── AUTH ────────────────────────────────────────────────────────────────────
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  await ensureUserDoc(result.user)
  return result.user
}
export async function registerWithEmail(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName })
  await ensureUserDoc(cred.user, displayName)
  return cred.user
}
export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}
export async function logout() { await signOut(auth) }
export async function resetPassword(email) { await sendPasswordResetEmail(auth, email) }

async function ensureUserDoc(user, displayName) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid, email: user.email,
      displayName: displayName || user.displayName || '',
      photoURL: user.photoURL || '',
      role: 'client',   // 'client' | 'worker' | 'admin'
      phone: '', nationality: '', passportNo: '', passportExpiry: '',
      dob: '', address: '', passportUrl: '', profileComplete: false,
      createdAt: serverTimestamp(),
    })
  }
}
export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
export async function updateUserDoc(uid, data) {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() })
}
export async function getAllUsers() {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export async function getUsersByRole(role) {
  const snap = await getDocs(query(collection(db, 'users'), where('role', '==', role)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export async function setUserRole(uid, role) {
  await updateDoc(doc(db, 'users', uid), { role })
}

// ─── FILE UPLOAD ──────────────────────────────────────────────────────────────
export async function uploadPassport(uid, file) {
  try {
    const storageRef = ref(storage, `passports/${uid}/${Date.now()}_${file.name}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    await updateDoc(doc(db, 'users', uid), { passportUrl: url })
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
  const ref = await addDoc(collection(db, 'bookings'), {
    ...bookingData,
    userId, orderRef,
    status: BOOKING_STATUSES.PENDING_PAYMENT,
    pnr: null, ticketUrl: null, adminNotes: '',
    workerAssigned: null, paymentRef: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { id: ref.id, orderRef }
}
export async function getUserBookings(userId) {
  const q = query(collection(db, 'bookings'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export async function getAllBookings() {
  const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export async function getBookingById(id) {
  const snap = await getDoc(doc(db, 'bookings', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
export async function updateBooking(id, data) {
  await updateDoc(doc(db, 'bookings', id), { ...data, updatedAt: serverTimestamp() })
}
export function subscribeBookings(callback) {
  const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
}
export function subscribeUserBookings(userId, callback) {
  const q = query(collection(db, 'bookings'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
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
