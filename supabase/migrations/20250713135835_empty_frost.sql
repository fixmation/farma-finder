/*
  # Fix infinite recursion in profiles table policies

  1. Problem
    - Multiple overlapping policies on profiles table causing infinite recursion
    - Policies referencing other tables that reference back to profiles
    - Complex policy conditions creating circular dependencies

  2. Solution
    - Drop ALL existing policies on profiles table
    - Create simple, non-recursive policies
    - Use direct conditions without complex subqueries
    - Ensure pharmacy_details can be queried without triggering profile recursion
*/

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Admin users can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Public can view verified provider profiles" ON profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create simple, non-recursive policies for profiles table
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow public read access for verified providers (needed for pharmacy map)
CREATE POLICY "profiles_select_verified_providers" ON profiles
  FOR SELECT TO public
  USING (
    status = 'verified' 
    AND role IN ('pharmacy', 'laboratory')
  );

-- Admin access using direct email check (no subqueries)
CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL TO authenticated
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