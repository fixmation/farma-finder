/*
  # Fix RLS Policy Infinite Recursion

  1. Problem Analysis
    - Multiple overlapping policies on profiles table causing infinite recursion
    - Policies referencing get_current_user_role() function which may not exist or causes recursion
    - Circular dependencies between profiles and related tables

  2. Solution
    - Remove duplicate and conflicting policies
    - Simplify policy logic to avoid recursion
    - Use direct uid() comparisons instead of complex functions
    - Ensure clean separation of concerns

  3. Changes
    - Drop all existing policies on profiles table
    - Create simplified, non-recursive policies
    - Fix related table policies that reference profiles
*/

-- First, drop all existing policies on profiles table to start clean
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable admin access to all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create simplified, non-recursive policies for profiles table
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create admin policy that doesn't cause recursion
CREATE POLICY "Admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        'admin@fixmation.com',
        'developer@fixmation.com',
        'hanyu@fixmation.com'
      )
    )
  );

-- Fix site_config policies to avoid recursion
DROP POLICY IF EXISTS "Admins can manage site config" ON site_config;

CREATE POLICY "Admins can manage site config"
  ON site_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        'admin@fixmation.com',
        'developer@fixmation.com',
        'hanyu@fixmation.com'
      )
    )
  );

-- Allow public read access to site_config for essential configs like mapbox_token
CREATE POLICY "Public can read essential site config"
  ON site_config
  FOR SELECT
  TO public
  USING (config_key IN ('mapbox_token', 'app_version', 'maintenance_mode'));

-- Fix pharmacy_details policies to avoid recursion
DROP POLICY IF EXISTS "Anyone can view verified pharmacies" ON pharmacy_details;
DROP POLICY IF EXISTS "Customers can view verified pharmacies" ON pharmacy_details;
DROP POLICY IF EXISTS "Pharmacy owners and admins can manage pharmacy details" ON pharmacy_details;

-- Simplified pharmacy policies
CREATE POLICY "Public can view verified pharmacies"
  ON pharmacy_details
  FOR SELECT
  TO public
  USING (
    user_id IN (
      SELECT id FROM profiles 
      WHERE status = 'verified' AND role = 'pharmacy'
    )
  );

CREATE POLICY "Pharmacy owners can manage own details"
  ON pharmacy_details
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all pharmacy details"
  ON pharmacy_details
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        'admin@fixmation.com',
        'developer@fixmation.com',
        'hanyu@fixmation.com'
      )
    )
  );

-- Fix laboratory_details policies similarly
DROP POLICY IF EXISTS "Anyone can view verified laboratories" ON laboratory_details;
DROP POLICY IF EXISTS "Laboratory owners and admins can manage laboratory details" ON laboratory_details;

CREATE POLICY "Public can view verified laboratories"
  ON laboratory_details
  FOR SELECT
  TO public
  USING (
    user_id IN (
      SELECT id FROM profiles 
      WHERE status = 'verified' AND role = 'laboratory'
    )
  );

CREATE POLICY "Laboratory owners can manage own details"
  ON laboratory_details
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all laboratory details"
  ON laboratory_details
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        'admin@fixmation.com',
        'developer@fixmation.com',
        'hanyu@fixmation.com'
      )
    )
  );

-- Fix commission_transactions policies
DROP POLICY IF EXISTS "Admins can view all transactions" ON commission_transactions;
DROP POLICY IF EXISTS "Pharmacies and laboratories can view own transactions" ON commission_transactions;

CREATE POLICY "Providers can view own transactions"
  ON commission_transactions
  FOR SELECT
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacy_details 
      WHERE user_id = auth.uid()
    ) OR
    laboratory_id IN (
      SELECT id FROM laboratory_details 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all transactions"
  ON commission_transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        'admin@fixmation.com',
        'developer@fixmation.com',
        'hanyu@fixmation.com'
      )
    )
  );

-- Create or replace the get_current_user_role function to avoid recursion
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
  user_email TEXT;
BEGIN
  -- Get user email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid();
  
  -- Check if admin by email
  IF user_email IN ('admin@fixmation.com', 'developer@fixmation.com', 'hanyu@fixmation.com') THEN
    RETURN 'admin';
  END IF;
  
  -- Get role from profiles table
  SELECT role INTO user_role
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role, 'customer');
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_role() TO anon;