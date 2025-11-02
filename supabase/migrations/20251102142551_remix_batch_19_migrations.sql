
-- Migration: 20251023054934
-- Create app_role enum
create type public.app_role as enum ('admin', 'moderator', 'user');

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Create couples table
create table public.couples (
  id uuid default gen_random_uuid() primary key,
  partner_1_id uuid references public.profiles(id) on delete cascade not null,
  partner_2_id uuid references public.profiles(id) on delete cascade,
  pairing_code text unique,
  code_expires_at timestamp with time zone,
  paired_at timestamp with time zone,
  status text check (status in ('pending', 'paired', 'unpaired')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.couples enable row level security;

create policy "Users can view their own couple"
  on public.couples for select
  using (
    auth.uid() = partner_1_id or 
    auth.uid() = partner_2_id
  );

create policy "Users can create couple pairing"
  on public.couples for insert
  with check (auth.uid() = partner_1_id);

create policy "Users can update their couple"
  on public.couples for update
  using (
    auth.uid() = partner_1_id or 
    auth.uid() = partner_2_id
  );

-- Create shared_data table
create table public.shared_data (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references public.couples(id) on delete cascade not null,
  data_type text check (data_type in ('plan', 'favorite', 'memory', 'note')) not null,
  data jsonb not null,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.shared_data enable row level security;

create policy "Couple members can view shared data"
  on public.shared_data for select
  using (
    exists (
      select 1 from public.couples
      where id = couple_id
      and (partner_1_id = auth.uid() or partner_2_id = auth.uid())
    )
  );

create policy "Couple members can insert shared data"
  on public.shared_data for insert
  with check (
    exists (
      select 1 from public.couples
      where id = couple_id
      and (partner_1_id = auth.uid() or partner_2_id = auth.uid())
    )
  );

create policy "Couple members can update shared data"
  on public.shared_data for update
  using (
    exists (
      select 1 from public.couples
      where id = couple_id
      and (partner_1_id = auth.uid() or partner_2_id = auth.uid())
    )
  );

-- Create updates table (for Coming Up features)
create table public.app_updates (
  id uuid default gen_random_uuid() primary key,
  version text not null,
  release_date date,
  update_type text check (update_type in ('feature', 'bugfix', 'security', 'launch')) not null,
  title text not null,
  description text,
  changes jsonb not null,
  status text check (status in ('implemented', 'coming_up', 'archived')) default 'coming_up',
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.app_updates enable row level security;

create policy "Everyone can view updates"
  on public.app_updates for select
  using (true);

create policy "Moderators can insert updates"
  on public.app_updates for insert
  with check (public.has_role(auth.uid(), 'moderator') or public.has_role(auth.uid(), 'admin'));

create policy "Moderators can update updates"
  on public.app_updates for update
  using (public.has_role(auth.uid(), 'moderator') or public.has_role(auth.uid(), 'admin'));

create policy "Moderators can delete updates"
  on public.app_updates for delete
  using (public.has_role(auth.uid(), 'moderator') or public.has_role(auth.uid(), 'admin'));

-- Create themes table (for Felicia's custom themes)
create table public.custom_themes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  colors jsonb not null,
  is_active boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.custom_themes enable row level security;

create policy "Everyone can view themes"
  on public.custom_themes for select
  using (true);

create policy "Moderators can manage themes"
  on public.custom_themes for all
  using (public.has_role(auth.uid(), 'moderator') or public.has_role(auth.uid(), 'admin'));

-- Auto-update timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger couples_updated_at before update on public.couples
  for each row execute procedure public.handle_updated_at();

create trigger shared_data_updated_at before update on public.shared_data
  for each row execute procedure public.handle_updated_at();

create trigger app_updates_updated_at before update on public.app_updates
  for each row execute procedure public.handle_updated_at();

create trigger custom_themes_updated_at before update on public.custom_themes
  for each row execute procedure public.handle_updated_at();

-- Profile creation trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  
  -- Auto-assign user role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Migration: 20251023055001
-- Fix search_path for has_role function
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Migration: 20251023055014
-- Fix search_path for all functions
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

-- Migration: 20251023062901
-- AI Learning & Recommendation Tables

-- User preferences learned by AI
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  preference_type text NOT NULL, -- 'place_type', 'price_range', 'time_of_day', 'neighborhood'
  preference_value text NOT NULL,
  confidence_score decimal DEFAULT 0.5, -- AI confidence in this preference (0-1)
  learned_from text, -- 'interaction', 'explicit', 'pattern'
  interaction_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI-generated recommendations
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type text NOT NULL, -- 'place', 'event', 'itinerary', 'date_idea'
  recommendation_data jsonb NOT NULL, -- flexible data structure
  confidence_score decimal DEFAULT 0.5,
  reason text, -- why AI recommended this
  shown_at timestamptz,
  interacted_at timestamptz,
  interaction_type text, -- 'viewed', 'saved', 'dismissed', 'completed'
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days')
);

-- User activity log for AI learning
CREATE TABLE IF NOT EXISTS public.user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL, -- 'place_view', 'place_save', 'search', 'filter_change', 'plan_create'
  activity_data jsonb NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- OKC events cache (scraped/discovered by AI)
CREATE TABLE IF NOT EXISTS public.okc_events_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_type text, -- 'concert', 'festival', 'sports', 'art', 'food'
  venue_name text,
  venue_address text,
  event_date date NOT NULL,
  event_time time,
  description text,
  price_range text,
  url text,
  discovered_by text DEFAULT 'ai_agent',
  relevance_score decimal DEFAULT 0.5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_user_preferences_user ON public.user_preferences(user_id);
CREATE INDEX idx_user_preferences_type ON public.user_preferences(preference_type);
CREATE INDEX idx_ai_recommendations_user ON public.ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_expires ON public.ai_recommendations(expires_at);
CREATE INDEX idx_user_activity_user ON public.user_activity_log(user_id);
CREATE INDEX idx_user_activity_timestamp ON public.user_activity_log(timestamp);
CREATE INDEX idx_okc_events_date ON public.okc_events_cache(event_date);

-- RLS Policies
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okc_events_cache ENABLE ROW LEVEL SECURITY;

-- Users can view/manage their own data
CREATE POLICY "Users manage their preferences"
  ON public.user_preferences
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage their recommendations"
  ON public.ai_recommendations
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage their activity"
  ON public.user_activity_log
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Everyone can view events
CREATE POLICY "Everyone can view events"
  ON public.okc_events_cache
  FOR SELECT
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_okc_events_updated_at
  BEFORE UPDATE ON public.okc_events_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Migration: 20251023094031
-- Create the update timestamp function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create table for AI-discovered date spots
CREATE TABLE IF NOT EXISTS public.discovered_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  lat NUMERIC,
  lng NUMERIC,
  category TEXT,
  description TEXT,
  source_url TEXT,
  facebook_verified BOOLEAN DEFAULT false,
  discovery_context TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discovered_places ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Places are viewable by everyone"
  ON public.discovered_places
  FOR SELECT
  USING (true);

-- Create index for location-based queries
CREATE INDEX idx_discovered_places_location ON public.discovered_places (lat, lng);
CREATE INDEX idx_discovered_places_city ON public.discovered_places (city);

-- Create trigger for updated_at
CREATE TRIGGER update_discovered_places_updated_at
  BEFORE UPDATE ON public.discovered_places
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migration: 20251023094049
-- Fix search_path for the function
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Recreate trigger for discovered_places
CREATE TRIGGER update_discovered_places_updated_at
  BEFORE UPDATE ON public.discovered_places
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migration: 20251023115238
-- Create table for app settings controlled by admins
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings
CREATE POLICY "Anyone can read app settings"
ON public.app_settings
FOR SELECT
TO authenticated, anon
USING (true);

-- Only admins can update settings
CREATE POLICY "Only admins can update settings"
ON public.app_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default Cupid visibility setting
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES ('cupid_visible', '{"enabled": true}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger to update timestamp
CREATE OR REPLACE FUNCTION public.update_app_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_app_settings_timestamp
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_app_settings_timestamp();

-- Migration: 20251023115256
-- Fix search_path for the app_settings trigger function
CREATE OR REPLACE FUNCTION public.update_app_settings_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$;

-- Migration: 20251023201625
-- Enhanced user tracking tables

-- Add session tracking table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  device_info JSONB DEFAULT '{}'::jsonb,
  location_info JSONB DEFAULT '{}'::jsonb,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  total_duration INTEGER, -- in seconds
  pages_visited INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  fingerprint TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Add IP address history table
CREATE TABLE IF NOT EXISTS public.ip_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  visit_count INTEGER DEFAULT 1,
  location_data JSONB DEFAULT '{}'::jsonb,
  risk_score NUMERIC DEFAULT 0,
  notes TEXT
);

-- Add user analytics summary table
CREATE TABLE IF NOT EXISTS public.user_analytics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_sessions INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  average_session_duration INTEGER DEFAULT 0,
  total_page_views INTEGER DEFAULT 0,
  unique_ips_count INTEGER DEFAULT 0,
  last_ip_address TEXT,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  account_created TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_segment TEXT DEFAULT 'new',
  engagement_score NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions"
  ON public.user_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions"
  ON public.user_sessions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert sessions"
  ON public.user_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update sessions"
  ON public.user_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for ip_history
CREATE POLICY "Users can view their own IP history"
  ON public.ip_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all IP history"
  ON public.ip_history FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can manage IP history"
  ON public.ip_history FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for user_analytics
CREATE POLICY "Users can view their own analytics"
  ON public.user_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all analytics"
  ON public.user_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can manage analytics"
  ON public.user_analytics FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_ip ON public.user_sessions(ip_address);
CREATE INDEX idx_user_sessions_active ON public.user_sessions(is_active);
CREATE INDEX idx_ip_history_user_id ON public.ip_history(user_id);
CREATE INDEX idx_ip_history_ip ON public.ip_history(ip_address);
CREATE INDEX idx_user_analytics_segment ON public.user_analytics(user_segment);

-- Function to update session end time
CREATE OR REPLACE FUNCTION public.end_user_session(session_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE user_sessions
  SET 
    session_end = now(),
    is_active = false,
    total_duration = EXTRACT(EPOCH FROM (now() - session_start))::INTEGER
  WHERE id = session_id;
END;
$$;

-- Function to update user analytics
CREATE OR REPLACE FUNCTION public.update_user_analytics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_analytics (user_id, total_sessions, last_ip_address, last_seen)
  VALUES (NEW.user_id, 1, NEW.ip_address, now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_sessions = user_analytics.total_sessions + 1,
    last_ip_address = NEW.ip_address,
    last_seen = now(),
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Trigger to update analytics on new session
CREATE TRIGGER update_analytics_on_session
  AFTER INSERT ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_analytics();

-- Migration: 20251024001749
-- Create SMS usage tracking table
CREATE TABLE IF NOT EXISTS public.sms_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL,
  message_type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'sent',
  is_free_message BOOLEAN DEFAULT false
);

-- Enable RLS on sms_usage
ALTER TABLE public.sms_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own SMS usage" ON public.sms_usage;
DROP POLICY IF EXISTS "Admins can view all SMS usage" ON public.sms_usage;
DROP POLICY IF EXISTS "System can insert SMS records" ON public.sms_usage;

-- Create SMS usage policies
CREATE POLICY "Users can view their own SMS usage"
ON public.sms_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all SMS usage"
ON public.sms_usage
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert SMS records"
ON public.sms_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update RLS policies for analytics tables to be admin-only
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.user_analytics;
DROP POLICY IF EXISTS "Only admins can view all analytics" ON public.user_analytics;
CREATE POLICY "Only admins can view all analytics"
ON public.user_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Only admins can view all sessions" ON public.user_sessions;
CREATE POLICY "Only admins can view all sessions"
ON public.user_sessions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view their own IP history" ON public.ip_history;
DROP POLICY IF EXISTS "Only admins can view all IP history" ON public.ip_history;
CREATE POLICY "Only admins can view all IP history"
ON public.ip_history
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Migration: 20251024003940
-- Create table for tracking phone number rate limiting
CREATE TABLE IF NOT EXISTS public.phone_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  last_send_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  send_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_phone_rate_limits_phone ON public.phone_rate_limits(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_rate_limits_last_send ON public.phone_rate_limits(last_send_at);

-- Enable RLS
ALTER TABLE public.phone_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limits (no user access needed)
CREATE POLICY "System can manage phone rate limits"
ON public.phone_rate_limits
FOR ALL
USING (false);

-- Migration: 20251024011610
-- Fix handle_new_user to whitelist roles and prevent privilege escalation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'display_name');
  
  -- Whitelist only 'user' and 'tester' roles from signup
  -- Never allow 'admin' or 'moderator' from client signup
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id,
    CASE 
      WHEN new.raw_user_meta_data->>'role' = 'tester' THEN 'tester'::app_role
      ELSE 'user'::app_role
    END
  );
  
  RETURN new;
END;
$$;

-- Migration: 20251028171532
-- Create tester_feedback table for collecting user feedback
CREATE TABLE IF NOT EXISTS public.tester_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  feature_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tester_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for tester_feedback
-- Allow anyone to insert feedback (even anonymous testers)
CREATE POLICY "Anyone can submit feedback"
  ON public.tester_feedback
  FOR INSERT
  WITH CHECK (true);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
  ON public.tester_feedback
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_tester_feedback_created_at ON public.tester_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tester_feedback_feature ON public.tester_feedback(feature_name);

-- Migration: 20251028220600
-- Create app_role enum if not exists
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'tester', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to auto-assign user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user'::app_role);
  
  RETURN new;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Migration: 20251029002224
-- Create app_role enum (skip if exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END $$;

-- Create user_roles table (skip if exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Enable RLS on discovered_places and add policies
ALTER TABLE public.discovered_places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read places" ON public.discovered_places;
DROP POLICY IF EXISTS "Admins can insert places" ON public.discovered_places;
DROP POLICY IF EXISTS "Admins can update places" ON public.discovered_places;
DROP POLICY IF EXISTS "Admins can delete places" ON public.discovered_places;

CREATE POLICY "Public can read places"
  ON public.discovered_places FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert places"
  ON public.discovered_places FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update places"
  ON public.discovered_places FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete places"
  ON public.discovered_places FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(key)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON public.rate_limits;

CREATE POLICY "Service role only"
  ON public.rate_limits FOR ALL
  USING (false);

-- Rate limit check function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _key TEXT,
  _max_requests INTEGER,
  _window_minutes INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _count INTEGER;
  _window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT count, window_start INTO _count, _window_start
  FROM public.rate_limits
  WHERE key = _key;
  
  IF _count IS NULL OR now() > _window_start + (_window_minutes || ' minutes')::INTERVAL THEN
    INSERT INTO public.rate_limits (key, count, window_start)
    VALUES (_key, 1, now())
    ON CONFLICT (key) DO UPDATE
    SET count = 1, window_start = now();
    RETURN true;
  END IF;
  
  IF _count < _max_requests THEN
    UPDATE public.rate_limits
    SET count = count + 1
    WHERE key = _key;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Migration: 20251029002254
-- Fix search_path for rate limit function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _key TEXT,
  _max_requests INTEGER,
  _window_minutes INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _count INTEGER;
  _window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT count, window_start INTO _count, _window_start
  FROM public.rate_limits
  WHERE key = _key;
  
  IF _count IS NULL OR now() > _window_start + (_window_minutes || ' minutes')::INTERVAL THEN
    INSERT INTO public.rate_limits (key, count, window_start)
    VALUES (_key, 1, now())
    ON CONFLICT (key) DO UPDATE
    SET count = 1, window_start = now();
    RETURN true;
  END IF;
  
  IF _count < _max_requests THEN
    UPDATE public.rate_limits
    SET count = count + 1
    WHERE key = _key;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Migration: 20251029214510
-- Fix foreign key constraint to allow user deletion
ALTER TABLE public.app_settings
DROP CONSTRAINT IF EXISTS app_settings_updated_by_fkey;

-- Re-add with CASCADE to handle deletions properly
ALTER TABLE public.app_settings
ADD CONSTRAINT app_settings_updated_by_fkey
FOREIGN KEY (updated_by)
REFERENCES auth.users(id)
ON DELETE SET NULL;

-- Migration: 20251029215121
-- Update the trigger function to only update analytics for authenticated users
-- This prevents the error when trying to insert null user_id
CREATE OR REPLACE FUNCTION public.update_user_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only update analytics if user_id is present (authenticated session)
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO user_analytics (user_id, total_sessions, last_ip_address, last_seen)
    VALUES (NEW.user_id, 1, NEW.ip_address, now())
    ON CONFLICT (user_id) DO UPDATE SET
      total_sessions = user_analytics.total_sessions + 1,
      last_ip_address = NEW.ip_address,
      last_seen = now(),
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Migration: 20251029233945
-- Ensure user_roles table exists with proper enum
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'alpha', 'beta', 'delta', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Grant admin role to inspirelawton@gmail.com
-- This will be inserted when the user signs up
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'inspirelawton@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
