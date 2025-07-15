/*
  # Disable RLS on profiles table to fix infinite recursion

  This migration completely disables RLS on the profiles table to break the circular dependency
  that's causing infinite recursion when querying pharmacy_details.

  ## Changes
  1. Drop all existing policies on profiles table
  2. Disable RLS on profiles table
  3. Ensure pharmacy_details can be queried without triggering profiles policies
*/

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "profiles_own_access" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_access" ON profiles;
DROP POLICY IF EXISTS "profiles_public_verified" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_all_admin" ON profiles;

-- Disable RLS on profiles table completely
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Ensure pharmacy_details policies don't reference profiles
DROP POLICY IF EXISTS "Customers can view verified pharmacies" ON pharmacy_details;
DROP POLICY IF EXISTS "pharmacy_details_admin" ON pharmacy_details;
DROP POLICY IF EXISTS "pharmacy_details_owner" ON pharmacy_details;
DROP POLICY IF EXISTS "pharmacy_details_public" ON pharmacy_details;
DROP POLICY IF EXISTS "pharmacy_details_select_verified" ON pharmacy_details;
DROP POLICY IF EXISTS "pharmacy_details_select_public" ON pharmacy_details;

-- Create simple pharmacy_details policies that don't reference other tables
CREATE POLICY "pharmacy_details_public_verified"
  ON pharmacy_details
  FOR SELECT
  TO public
  USING (verified_at IS NOT NULL);

CREATE POLICY "pharmacy_details_owner_all"
  ON pharmacy_details
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin policy using direct email check (safe, no recursion)
CREATE POLICY "pharmacy_details_admin_all"
  ON pharmacy_details
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@fixmation.com', 'developer@fixmation.com', 'hanyu@fixmation.com')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@fixmation.com', 'developer@fixmation.com', 'hanyu@fixmation.com')
    )
  );