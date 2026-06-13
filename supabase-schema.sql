-- KrishiMitra+ Supabase Schema
-- Run this in your Supabase SQL Editor

-- Farmers table
CREATE TABLE IF NOT EXISTS farmers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  village TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  farm_size NUMERIC DEFAULT 0,
  land_size NUMERIC DEFAULT 0,
  crop_types TEXT[] DEFAULT '{}',
  crops TEXT,
  profile_photo_url TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profile photo storage bucket (create in Supabase Dashboard > Storage)
-- Bucket name: profile-photos (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public upload profile photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Allow public read profile photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

-- Workers table
CREATE TABLE IF NOT EXISTS workers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 60),
  phone TEXT NOT NULL,
  village TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  crop_types TEXT[] DEFAULT '{}',
  available_from DATE NOT NULL,
  available_until DATE NOT NULL,
  daily_wage NUMERIC DEFAULT 0,
  willing_to_travel BOOLEAN DEFAULT false,
  travel_distance_km INTEGER DEFAULT 0,
  profile_photo_url TEXT,
  experience_years INTEGER DEFAULT 0,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES farmers(id),
  farmer_name TEXT,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  wage NUMERIC DEFAULT 0,
  duration TEXT,
  workers_needed INTEGER DEFAULT 1,
  skill_required TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crop scans table
CREATE TABLE IF NOT EXISTS crop_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES farmers(id),
  crop_name TEXT,
  disease TEXT,
  severity TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID,
  from_user_type TEXT,
  to_user_id UUID,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional — adjust policies for production)
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo (tighten in production)
CREATE POLICY "Allow all on farmers" ON farmers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on workers" ON workers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on jobs" ON jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on crop_scans" ON crop_scans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on ratings" ON ratings FOR ALL USING (true) WITH CHECK (true);
