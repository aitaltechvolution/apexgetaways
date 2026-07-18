import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, collection,
  addDoc, getDocs, updateDoc, query, orderBy, where, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'demo-key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'demo.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'demo-project',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:0:web:000',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

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
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || '',
      photoURL: user.photoURL || '',
      role: 'user',
      createdAt: serverTimestamp(),
    })
  }
}

export async function saveBooking(userId, bookingData) {
  const ref = await addDoc(collection(db, 'bookings'), {
    ...bookingData, userId, status:'pending',
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getUserBookings(userId) {
  const q = query(collection(db,'bookings'), where('userId','==',userId), orderBy('createdAt','desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({id:d.id,...d.data()}))
}

export async function getAllBookings() {
  const q = query(collection(db,'bookings'), orderBy('createdAt','desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({id:d.id,...d.data()}))
}

export async function updateBookingStatus(bookingId, status, notes='') {
  await updateDoc(doc(db,'bookings',bookingId), {
    status, adminNotes:notes, updatedAt:serverTimestamp()
  })
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db,'users'))
  return snap.docs.map(d => ({id:d.id,...d.data()}))
}

export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db,'users',uid))
  return snap.exists() ? {id:snap.id,...snap.data()} : null
}
