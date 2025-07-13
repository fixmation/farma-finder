/*
  # Fix pharmacy_details policies to avoid recursion

  This migration ensures pharmacy_details policies don't trigger
  infinite recursion with profiles table.
*/

-- Drop all existing policies on pharmacy_details
DROP POLICY IF EXISTS "pharmacy_details_admin_all" ON pharmacy_details;
DROP POLICY IF EXISTS "pharmacy_details_owner_all" ON pharmacy_details;
DROP POLICY IF EXISTS "pharmacy_details_select_verified" ON pharmacy_details;
DROP POLICY IF EXISTS "Pharmacies can manage own details" ON pharmacy_details;
DROP POLICY IF EXISTS "Public can view verified pharmacies" ON pharmacy_details;

-- Create simple policies that don't reference profiles table
CREATE POLICY "pharmacy_details_owner" ON pharmacy_details
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin access using direct auth check
CREATE POLICY "pharmacy_details_admin" ON pharmacy_details
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

-- Public read access for verified pharmacies (no profiles reference)
CREATE POLICY "pharmacy_details_public" ON pharmacy_details
  FOR SELECT
  TO public
  USING (verified_at IS NOT NULL);