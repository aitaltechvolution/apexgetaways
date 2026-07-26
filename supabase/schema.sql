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
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (
    auth.uid() = id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Users can update their own profile; admins can update any (e.g. change role).
create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (
    auth.uid() = id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Profiles are created automatically by the trigger below (not by client inserts).
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

create policy "bookings_select_own_or_staff"
  on public.bookings for select
  using (
    user_id = auth.uid()::text
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','worker'))
  );

create policy "bookings_insert_own_or_guest"
  on public.bookings for insert
  with check (true); -- guests (no session) can also create a pending booking before paying

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
alter publication supabase_realtime add table public.bookings;

-- ────────────────────────────────────────────────────────────────────────────
-- STORAGE  (mirrors Firebase Storage "passports/{uid}/..." uploads)
-- ────────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('passports', 'passports', true)
on conflict (id) do nothing;

create policy "passport_upload_own_folder"
  on storage.objects for insert
  with check (
    bucket_id = 'passports'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "passport_read_own_or_staff"
  on storage.objects for select
  using (
    bucket_id = 'passports'
    and (
      (auth.uid())::text = (storage.foldername(name))[1]
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','worker'))
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- Make yourself an admin after you sign up once through the site:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- ────────────────────────────────────────────────────────────────────────────
