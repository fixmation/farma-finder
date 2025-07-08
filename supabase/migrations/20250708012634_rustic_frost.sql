/*
  # Fix infinite recursion in RLS policies

  1. Policy Updates
    - Fix "Admins can manage all profiles" policy to use correct table reference
    - Update other policies that reference non-existent 'users' table
    - Ensure policies don't create circular dependencies

  2. Security
    - Maintain proper access control
    - Fix admin access patterns
    - Ensure user data protection
*/

-- Drop problematic policies that reference non-existent 'users' table
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all pharmacy details" ON pharmacy_details;
DROP POLICY IF EXISTS "Admins can manage site config" ON site_config;
DROP POLICY IF EXISTS "Admins can manage all transactions" ON commission_transactions;
DROP POLICY IF EXISTS "Admins can manage all laboratory details" ON laboratory_details;

-- Create corrected admin policies using proper admin email checks
CREATE POLICY "Admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@fixmation.com',
      'developer@fixmation.com', 
      'hanyu@fixmation.com'
    )
  );

CREATE POLICY "Admins can manage all pharmacy details"
  ON pharmacy_details
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@fixmation.com',
      'developer@fixmation.com',
      'hanyu@fixmation.com'
    )
  );

CREATE POLICY "Admins can manage site config"
  ON site_config
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@fixmation.com',
      'developer@fixmation.com',
      'hanyu@fixmation.com'
    )
  );

CREATE POLICY "Admins can manage all transactions"
  ON commission_transactions
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@fixmation.com',
      'developer@fixmation.com',
      'hanyu@fixmation.com'
    )
  );

CREATE POLICY "Admins can manage all laboratory details"
  ON laboratory_details
  FOR ALL
  TO authenticated
  USING (
    auth.email() IN (
      'admin@fixmation.com',
      'developer@fixmation.com',
      'hanyu@fixmation.com'
    )
  );

-- Create a helper function to check if current user is admin (optional, for better performance)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT auth.email() IN (
    'admin@fixmation.com',
    'developer@fixmation.com',
    'hanyu@fixmation.com'
  );
$$;