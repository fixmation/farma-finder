/*
  # Disable RLS on profiles table and recreate safe policies

  This migration completely disables RLS on the profiles table and recreates
  only the essential policies without any recursive dependencies.
*/

-- Disable RLS on profiles table completely
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_verified_providers" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "Users can manage own profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Public can view verified providers" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "profiles_own_access" ON profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin access using direct email check (no subqueries)
CREATE POLICY "profiles_admin_access" ON profiles
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

-- Public read access for verified providers (simple condition)
CREATE POLICY "profiles_public_verified" ON profiles
  FOR SELECT
  TO public
  USING (status = 'verified' AND role IN ('pharmacy', 'laboratory'));