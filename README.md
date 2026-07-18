# Apex Getaways Travels LTD — React Web App

A full-featured travel booking platform built with **React 18 + Vite + Tailwind CSS**.

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env       # add your API keys (see below)
npm run dev                # http://localhost:5173
```

---

## 🔑 Environment Variables (`.env`)

| Variable | Source | Required? |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | [console.firebase.google.com](https://console.firebase.google.com) | ✅ For auth & bookings |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase project settings | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project settings | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase project settings | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase project settings | ✅ |
| `VITE_FIREBASE_APP_ID` | Firebase project settings | ✅ |
| `VITE_UNSPLASH_KEY` | [unsplash.com/developers](https://unsplash.com/developers) | Optional (hotel photos) |
| `VITE_AVIATION_KEY` | [aviationstack.com](https://aviationstack.com) | Optional (live airport search) |

---

## 🔥 Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a project → **Add Web App** → copy config into `.env`
3. **Authentication** → Sign-in methods → Enable **Google** and **Email/Password**
4. **Firestore Database** → Create database → Start in **test mode**
5. Set Firestore rules (Production):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /bookings/{id} {
      allow create: if request.auth != null;
      allow read, write: if request.auth.uid == resource.data.userId
        || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Make yourself Admin
In Firestore Console → `users` collection → find your user document → edit `role` field → set to `"admin"` → then visit `/admin`.

---

## ✈️ Features

### Booking System
- **Flight Search** — One-way, Round Trip, Multi-City with airport autocomplete (arrow key navigation)
- **Seat Selection** — Interactive cabin map showing First/Business/Premium/Economy with real-time availability
- **Hotel Search** — Real Unsplash photos, room type selection, star filter, free cancellation badges
- **Airport Pickup & Car Hire** — Vehicle selector (Sedan/SUV/Minivan/Luxury/Coach), return trip toggle
- **5-Step Booking Flow** — Search → Select → Passengers → Review → Confirmation
- **State Persistence** — Search inputs saved to sessionStorage; navigating Home → Flights restores your search

### Authentication
- Google OAuth sign-in
- Email/password registration with password strength meter
- Forgot password email reset
- Protected routes

### Admin Panel (`/admin`)
- Dashboard with booking stats
- Bookings manager — filter by status, update to Processing/Confirmed/Cancelled with admin notes
- Customer list
- Access-controlled (role: 'admin' in Firestore)

### UX
- System dark/light mode detection + manual toggle
- Keyboard-navigable airport dropdown (↑↓ arrows + Enter + Escape)
- Fully responsive — mobile hamburger nav
- Smooth page transitions with Framer Motion
- Real hotel images via Unsplash API

---

## 📁 Project Structure

```
src/
├── components/
│   ├── booking/     SeatMap
│   ├── layout/      Navbar, Footer, WhatsApp, ScrollToTop
│   ├── search/      AirportInput (keyboard nav)
│   ├── sections/    Hero, Destinations, WhyUs, Testimonials...
│   └── ui/          Button, Card, Badge, Modal, PageHero...
├── data/            Airports, Airlines, Hotels, Packages, mock generators
├── lib/
│   ├── firebase.js  Auth + Firestore helpers
│   ├── api.js       Unsplash, AviationStack, CountriesNow, ExchangeRate
│   └── utils.js     formatNGN, cn, slugify, truncate
├── pages/
│   ├── Admin/       Dashboard, Bookings, Customers (role-gated)
│   ├── Auth/        Login, Register, ForgotPassword
│   ├── Booking/     Hub, Flights, Hotels, Pickup, Passengers, Review, Confirmation
│   ├── Blog/        List + Post
│   ├── Destinations/ List + Detail
│   └── ...          About, Contact, FAQ, Packages, Services, Testimonials, Legal
└── store/
    ├── AuthContext    Firebase auth state
    ├── BookingContext sessionStorage-persisted booking state
    └── ThemeContext   System preference + manual toggle
```

---

## 🌐 Free APIs Used

| API | Purpose | Key needed? |
|---|---|---|
| [Unsplash](https://unsplash.com/developers) | Real hotel images | Optional (50/hr free) |
| [AviationStack](https://aviationstack.com) | Live airport search | Optional (100/mo free) |
| [CountriesNow](https://countriesnow.space) | City lookups | No key needed |
| [Open Exchange Rates](https://open.er-api.com) | NGN conversion | No key needed |
| [REST Countries](https://restcountries.com) | Country flags/info | No key needed |

---

## 🚀 Deployment

```bash
npm run build          # outputs to /dist
# Deploy dist/ to Vercel, Netlify, or Firebase Hosting
```

For Vercel: push to GitHub → import project → add `.env` variables in dashboard.
