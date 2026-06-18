-- ============================================
-- KrishiMitra+ Database Schema
-- Run this in the Supabase SQL Editor to set up
-- all tables, columns, and security policies.
-- ============================================

-- ---------- FARMERS ----------
create table if not exists farmers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  name text not null,
  phone text not null,
  village text,
  district text,
  state text,
  farm_size numeric,
  land_size numeric,
  crop_types text[],
  crops text,
  profile_photo_url text,
  registered_at timestamp,
  created_at timestamp default now()
);

-- ---------- WORKERS ----------
create table if not exists workers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  name text not null,
  age int,
  phone text not null,
  village text,
  district text,
  state text,
  skills text[],
  crop_types text[],
  available_from date,
  available_until date,
  daily_wage numeric,
  willing_to_travel boolean default false,
  travel_distance_km int,
  rating numeric default 0,
  jobs_completed int default 0,
  profile_photo_url text,
  registered_at timestamp,
  created_at timestamp default now()
);

-- ---------- JOB POSTINGS ----------
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references farmers(id),
  farmer_name text,
  title text,
  description text,
  location text,
  district text,
  state text,
  wage numeric,
  duration text,
  workers_needed int,
  skill_required text,
  status text default 'open',
  created_at timestamp default now()
);

-- ---------- JOB APPLICATIONS ----------
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid references workers(id),
  job_id uuid references jobs(id),
  status text default 'pending',
  created_at timestamp default now()
);

-- ---------- CROP DISEASE SCANS ----------
create table if not exists crop_scans (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references farmers(id),
  crop_name text,
  disease text,
  severity text,
  recommendation text,
  created_at timestamp default now()
);

-- ---------- RATINGS ----------
create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  rated_by text,
  rating_for_id uuid,
  stars int,
  comment text,
  created_at timestamp default now()
);

-- ============================================
-- Row Level Security
-- Public read access (needed for farmer/worker
-- matching), owner-only write access.
-- ============================================

alter table farmers enable row level security;
alter table workers enable row level security;
alter table jobs enable row level security;
alter table applications enable row level security;
alter table crop_scans enable row level security;
alter table ratings enable row level security;

-- Farmers
create policy "Public read - farmers" on farmers for select using (true);
create policy "Owner insert - farmers" on farmers for insert with check (auth.uid() = user_id);
create policy "Owner update - farmers" on farmers for update using (auth.uid() = user_id);

-- Workers
create policy "Public read - workers" on workers for select using (true);
create policy "Owner insert - workers" on workers for insert with check (auth.uid() = user_id);
create policy "Owner update - workers" on workers for update using (auth.uid() = user_id);

-- Jobs, applications, crop scans, ratings (open policies for demo/prototype)
create policy "Allow all - jobs" on jobs for all using (true) with check (true);
create policy "Allow all - applications" on applications for all using (true) with check (true);
create policy "Allow all - crop_scans" on crop_scans for all using (true) with check (true);
create policy "Allow all - ratings" on ratings for all using (true) with check (true);
