# Apex Getaways — Supabase Setup

This project was migrated from Firebase to Supabase. Follow these steps to get
a working backend.

## 1. Create a Supabase project
Go to https://supabase.com/dashboard → New project. Wait for it to finish provisioning.

## 2. Run the schema
Open **SQL Editor** in your Supabase dashboard → New query → paste the entire
contents of `supabase/schema.sql` from this project → **Run**.

This creates:
- `profiles` table (mirrors the old Firestore `users` collection) with an
  auto-create-on-signup trigger and row-level security
- `bookings` table (mirrors the old Firestore `bookings` collection) with
  row-level security and Realtime enabled
- a `passports` storage bucket for passport uploads, with policies

## 3. Set your environment variables
Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_or_live_xxxxxxxxxxxx
```

Find the Supabase URL and anon key under **Project Settings → API**.

## 4. Email confirmation setting (important)
By default, Supabase requires users to click a confirmation link before their
account can log in. The old Firebase version logged users in immediately after
registering.

- **To match the old behavior** (instant login after signup — good for demos):
  Go to **Authentication → Providers → Email** and turn **off** "Confirm email".
- **To keep it on** (recommended for production): leave it on. The Register
  page already handles this — it shows a "check your inbox" screen instead of
  redirecting to the dashboard when no session is created yet.

## 5. Google sign-in (optional)
`signInWithGoogle()` is wired up in `src/lib/supabase.js` but not currently
exposed on the Login/Register pages (it wasn't wired to the UI in the
Firebase version either). To enable it: add a Google provider under
**Authentication → Providers**, then add a "Continue with Google" button that
calls `useAuth()` → you'll need to expose `signInWithGoogle` through
`AuthContext` first.

## 6. Make yourself an admin
Sign up once through the site normally, then in the SQL Editor run:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Log out and back in — `/admin` will now show the dashboard instead of
"access denied". (`role` can be `'client'`, `'worker'`, or `'admin'`.)

## What changed under the hood
- `src/lib/firebase.js` → replaced by `src/lib/supabase.js` (same exported
  function names: `saveBooking`, `getUserDoc`, `subscribeBookings`, etc. —
  no changes needed in most components)
- Firestore documents → Postgres tables (`profiles`, `bookings`). The
  freeform nested booking data — flights, passengers, baggage, etc. — is
  stored in a `data jsonb` column, same as it was a nested object in Firestore
- Firebase Storage → Supabase Storage (`passports` bucket)
- `onSnapshot` realtime listeners → Supabase Realtime (`postgres_changes`)
- Firebase Auth → Supabase Auth (email/password + Google OAuth scaffold)
- The `firebase` npm package has been removed
