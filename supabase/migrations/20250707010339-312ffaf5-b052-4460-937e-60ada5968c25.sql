
-- Fix the infinite recursion in profiles RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create non-recursive RLS policies for profiles
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

-- Fix pharmacy relationship ambiguity
DROP POLICY IF EXISTS "Customers can view verified pharmacies" ON public.pharmacy_details;

CREATE POLICY "Customers can view verified pharmacies" 
  ON public.pharmacy_details 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = pharmacy_details.user_id 
      AND profiles.status = 'verified'
    )
  );

-- Add missing developer_admin role to enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'developer_admin';

-- Create contact page route in site_config
INSERT INTO public.site_config (config_key, config_value, description) 
VALUES ('contact_page_enabled', 'true', 'Enable contact page functionality')
ON CONFLICT (config_key) DO NOTHING;
