-- ============================================================================
-- Apex Getaways — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================================

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- ────────────────────────────────────────────────────────────────────────────
-- PROFILES  (mirrors Firebase's "users" collection)
-- One row per auth.users row. id === auth.users.id
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  email             text,
  display_name      text default '',
  photo_url         text default '',
  role              text not null default 'client', -- 'client' | 'worker' | 'admin'
  phone             text default '',
  nationality       text default '',
  passport_no       text default '',
  passport_expiry   text default '',
  dob               text default '',
  address           text default '',
  passport_url      text default '',
  profile_complete  boolean default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Everyone can read their own profile; admins can read all.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (
    auth.uid() = id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Users can update their own profile; admins can update any (e.g. change role).
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (
    auth.uid() = id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Profiles are created automatically by the trigger below (not by client inserts).
drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up
-- (covers both email/password and Google sign-in).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, photo_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ────────────────────────────────────────────────────────────────────────────
-- BOOKINGS  (mirrors Firebase's "bookings" collection)
-- Flat columns for the fields the admin dashboard filters/updates by;
-- everything else (contact, selected flights, baggage, addons, passengers...)
-- lives in the `data` jsonb blob, same shape as the old Firestore document.
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  user_id          text not null,                 -- auth uid, or 'guest'
  order_ref        text not null,
  status           text not null default 'pending_payment',
  pnr              text,
  ticket_url       text,
  admin_notes      text default '',
  worker_assigned  text,
  payment_ref      text,
  data             jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists bookings_created_at_idx on public.bookings(created_at desc);

alter table public.bookings enable row level security;

drop policy if exists "bookings_select_own_or_staff" on public.bookings;
create policy "bookings_select_own_or_staff"
  on public.bookings for select
  using (
    user_id = auth.uid()::text
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','worker'))
  );

drop policy if exists "bookings_insert_own_or_guest" on public.bookings;
create policy "bookings_insert_own_or_guest"
  on public.bookings for insert
  with check (true); -- guests (no session) can also create a pending booking before paying

drop policy if exists "bookings_update_staff" on public.bookings;
create policy "bookings_update_staff"
  on public.bookings for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','worker'))
  );

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute procedure public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Enable realtime (used for the live admin bookings feed & "My Bookings")
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bookings'
  ) then
    alter publication supabase_realtime add table public.bookings;
  end if;
end $$;

-- ────────────────────────────────────────────────────────────────────────────
-- STORAGE  (mirrors Firebase Storage "passports/{uid}/..." uploads)
-- ────────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('passports', 'passports', true)
on conflict (id) do nothing;

drop policy if exists "passport_upload_own_folder" on storage.objects;
create policy "passport_upload_own_folder"
  on storage.objects for insert
  with check (
    bucket_id = 'passports'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

drop policy if exists "passport_read_own_or_staff" on storage.objects;
create policy "passport_read_own_or_staff"
  on storage.objects for select
  using (
    bucket_id = 'passports'
    and (
      (auth.uid())::text = (storage.foldername(name))[1]
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','worker'))
    )
  );

-- Tickets / travel documents (e-tickets, hotel vouchers, itineraries) —
-- admin uploads, public read via the direct link shown on the client's
-- Dashboard (booking IDs are unguessable UUIDs, so this is low-risk; switch
-- to signed URLs later if you want stricter access control).
insert into storage.buckets (id, name, public)
values ('tickets', 'tickets', true)
on conflict (id) do nothing;

drop policy if exists "tickets_upload_admin" on storage.objects;
create policy "tickets_upload_admin"
  on storage.objects for insert
  with check (
    bucket_id = 'tickets'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','worker'))
  );

drop policy if exists "tickets_read_all" on storage.objects;
create policy "tickets_read_all"
  on storage.objects for select
  using (bucket_id = 'tickets');

-- ────────────────────────────────────────────────────────────────────────────
-- PRICING SETTINGS  (admin-configurable flat "gain" amount, in NGN, added on
-- top of whatever the flight/hotel source returns — single row, id always 1)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.pricing_settings (
  id                    int primary key default 1,
  flight_markup_amount  numeric not null default 0,
  hotel_markup_amount   numeric not null default 0,
  updated_at            timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- If you already ran an earlier version of this schema with percentage
-- columns, migrate them across automatically:
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='pricing_settings' and column_name='flight_markup_percent') then
    alter table public.pricing_settings add column if not exists flight_markup_amount numeric not null default 0;
    alter table public.pricing_settings add column if not exists hotel_markup_amount numeric not null default 0;
    alter table public.pricing_settings drop column if exists flight_markup_percent;
    alter table public.pricing_settings drop column if exists hotel_markup_percent;
    alter table public.pricing_settings drop column if exists pickup_markup_percent;
  end if;
end $$;

insert into public.pricing_settings (id) values (1) on conflict (id) do nothing;

alter table public.pricing_settings enable row level security;

drop policy if exists "pricing_settings_select_all" on public.pricing_settings;
create policy "pricing_settings_select_all"
  on public.pricing_settings for select
  using (true); -- prices need to be readable by every visitor to price search results

drop policy if exists "pricing_settings_update_admin" on public.pricing_settings;
create policy "pricing_settings_update_admin"
  on public.pricing_settings for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop trigger if exists pricing_settings_set_updated_at on public.pricing_settings;
create trigger pricing_settings_set_updated_at
  before update on public.pricing_settings
  for each row execute procedure public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- LOCATION PRICING  (hotel-pickup prices, set by admin per country, per
-- Nigerian state, or for Nigeria as a whole — e.g. Nigeria: ₦50,000)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.location_pricing (
  id          uuid primary key default gen_random_uuid(),
  scope       text not null check (scope in ('country','state')),
  code        text not null,          -- ISO country code (e.g. 'NG','GB') or a state slug (e.g. 'lagos')
  name        text not null,          -- display name, e.g. "Nigeria", "Lagos", "United Kingdom"
  currency    text not null default 'NGN', -- that location's local currency — reference only
  price       numeric not null,       -- the actual charge, always in NGN
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (scope, code)
);

alter table public.location_pricing enable row level security;

drop policy if exists "location_pricing_select_all" on public.location_pricing;
create policy "location_pricing_select_all"
  on public.location_pricing for select
  using (true); -- needed to price the Pickup page for every visitor

drop policy if exists "location_pricing_write_admin" on public.location_pricing;
create policy "location_pricing_write_admin"
  on public.location_pricing for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop trigger if exists location_pricing_set_updated_at on public.location_pricing;
create trigger location_pricing_set_updated_at
  before update on public.location_pricing
  for each row execute procedure public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- LEADS  (Contact form + Newsletter signups — public inserts, admin-only reads)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  source      text not null default 'contact', -- 'contact' | 'newsletter'
  name        text,
  email       text not null,
  phone       text,
  service     text,
  interest    text,
  message     text,
  created_at  timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Anyone (including anonymous visitors) can submit the public contact/newsletter forms.
drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public"
  on public.leads for insert
  with check (true);

-- Only admins can read submitted leads.
drop policy if exists "leads_select_admin" on public.leads;
create policy "leads_select_admin"
  on public.leads for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ────────────────────────────────────────────────────────────────────────────
-- Make yourself an admin after you sign up once through the site:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- ────────────────────────────────────────────────────────────────────────────