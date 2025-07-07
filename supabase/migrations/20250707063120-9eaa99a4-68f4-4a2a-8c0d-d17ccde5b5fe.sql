
-- Drop all existing problematic policies to start fresh
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;  
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Customers can view verified pharmacies" ON public.pharmacy_details;
DROP POLICY IF EXISTS "Pharmacies can manage own details" ON public.pharmacy_details;
DROP POLICY IF EXISTS "Customers can view verified laboratories" ON public.laboratory_details;
DROP POLICY IF EXISTS "Laboratories can manage own details" ON public.laboratory_details;

-- Create a security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Enable read access for own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Enable update for own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Enable admin access to all profiles"
  ON public.profiles
  FOR ALL
  USING (public.get_current_user_role() = 'admin');

-- Fix pharmacy policies with explicit join specification
CREATE POLICY "Anyone can view verified pharmacies"
  ON public.pharmacy_details
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = pharmacy_details.user_id 
      AND p.status = 'verified'
    )
  );

CREATE POLICY "Pharmacy owners and admins can manage pharmacy details"
  ON public.pharmacy_details
  FOR ALL
  USING (
    auth.uid() = user_id OR 
    public.get_current_user_role() = 'admin'
  );

-- Fix laboratory policies with explicit join specification  
CREATE POLICY "Anyone can view verified laboratories"
  ON public.laboratory_details
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = laboratory_details.user_id 
      AND p.status = 'verified'
    )
  );

CREATE POLICY "Laboratory owners and admins can manage laboratory details"
  ON public.laboratory_details
  FOR ALL
  USING (
    auth.uid() = user_id OR 
    public.get_current_user_role() = 'admin'
  );

-- Update the trigger function to handle all user types properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    phone, 
    preferred_language
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'preferred_language')::language_code, 'en')
  );

  -- Handle pharmacy signup
  IF (NEW.raw_user_meta_data->>'role') = 'pharmacy' THEN
    INSERT INTO public.pharmacy_details (
      user_id,
      business_name,
      registration_number,
      address,
      contact_phone,
      contact_email
    )
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'business_name',
      NEW.raw_user_meta_data->>'registration_number',
      NEW.raw_user_meta_data->>'address',
      NEW.raw_user_meta_data->>'phone',
      NEW.email
    );
  END IF;

  -- Handle laboratory signup
  IF (NEW.raw_user_meta_data->>'role') = 'laboratory' THEN
    INSERT INTO public.laboratory_details (
      user_id,
      business_name,
      registration_number,
      address,
      contact_phone,
      contact_email
    )
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'business_name',
      NEW.raw_user_meta_data->>'registration_number',
      NEW.raw_user_meta_data->>'address',
      NEW.raw_user_meta_data->>'phone',
      NEW.email
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
