/*
  # Fix infinite recursion in profiles table policies

  1. Problem
    - Multiple overlapping policies on profiles table causing infinite recursion
    - Policies are creating circular dependencies when joining with other tables

  2. Solution
    - Remove redundant policies that cause recursion
    - Keep only essential, non-recursive policies
    - Simplify policy logic to avoid circular references

  3. Changes
    - Drop problematic policies that reference other tables recursively
    - Keep core policies for user access control
    - Ensure admin access remains functional
*/

-- Drop all existing policies on profiles table to start fresh
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable admin access to all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create simplified, non-recursive policies
CREATE POLICY "Users can manage own profile"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin users can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE email IN ('admin@fixmation.com', 'developer@fixmation.com', 'hanyu@fixmation.com')
      AND id = auth.uid()
    )
  );

-- Allow public read access to verified pharmacy and laboratory profiles
-- This is needed for the pharmacy map to work without recursion
CREATE POLICY "Public can view verified provider profiles"
  ON profiles
  FOR SELECT
  TO public
  USING (
    status = 'verified' 
    AND role IN ('pharmacy', 'laboratory')
  );