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
| `VITE_SUPABASE_URL` | [supabase.com/dashboard](https://supabase.com/dashboard) → Project Settings → API | ✅ For auth & bookings |
| `VITE_SUPABASE_ANON_KEY` | Supabase project settings → API | ✅ |
| `VITE_PAYSTACK_PUBLIC_KEY` | [dashboard.paystack.com](https://dashboard.paystack.com/#/settings/developers) | ✅ For payments |
| `VITE_UNSPLASH_KEY` | [unsplash.com/developers](https://unsplash.com/developers) | Optional (hotel photos) |
| `VITE_AVIATION_KEY` | [aviationstack.com](https://aviationstack.com) | Optional (live airport search) |

---

## 🟢 Supabase Setup

See **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** for full step-by-step instructions
(create project → run `supabase/schema.sql` → set env vars → make yourself admin).

Quick version:
1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. SQL Editor → paste & run `supabase/schema.sql` (creates `profiles`, `bookings`, storage bucket, RLS policies)
3. Copy your Project URL + anon key into `.env`
4. Sign up once on the site, then run:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
   → visit `/admin`

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
- Email/password registration with password strength meter
- Google OAuth scaffold (ready to wire up — see SUPABASE_SETUP.md)
- Forgot password email reset
- Protected routes

### Admin Panel (`/admin`)
- Dashboard with booking stats
- Bookings manager — filter by status, update to Processing/Confirmed/Cancelled with admin notes
- Customer list
- Access-controlled (role: 'admin' in the `profiles` table)

### UX
- Light-mode-first design, legible type scale throughout
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
│   ├── supabase.js  Auth + Postgres (profiles/bookings) + Storage helpers
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
    ├── AuthContext    Supabase session/auth state
    ├── BookingContext sessionStorage-persisted booking state
    └── ThemeContext   Light-mode-by-default theme

supabase/
└── schema.sql       Run once in Supabase SQL Editor — tables, RLS, triggers, storage bucket
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
# Deploy dist/ to Vercel, Netlify, or any static host
```

For Vercel: push to GitHub → import project → add `.env` variables in dashboard.
