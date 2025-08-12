-- Create profiles table for user management
create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role in ('owner','family')) default 'family'
);

-- Create listings table for properties
create table listings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  max_guests int default 10,
  min_nights int default 2,
  timezone text default 'America/Chicago'
);

-- Create bookings table for reservations
create table bookings (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  start_date date not null,
  end_date date not null,      -- exclusive
  status text check (status in ('pending','approved','denied','cancelled')) default 'pending',
  guests int default 1,
  notes text,
  created_at timestamptz default now()
);

-- Create blackout dates table
create table blackout_dates (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text
);

-- Lightweight CMS tables
create table site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null
);

create table content_blocks (
  id uuid primary key default gen_random_uuid(),
  slug text not null,   -- 'home'
  type text not null,   -- 'hero'|'feature'|'gallery'|'faq'|'cta'
  data jsonb not null,  -- content payload
  position int default 0
);
