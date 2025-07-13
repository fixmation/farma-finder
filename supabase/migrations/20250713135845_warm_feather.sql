/*
  # Fix pharmacy_details policies to avoid profile recursion

  1. Problem
    - pharmacy_details policies reference profiles table
    - This triggers profile policies which can cause recursion

  2. Solution
    - Simplify pharmacy_details policies
    - Remove complex profile references
    - Use direct conditions where possible
*/

-- Drop existing problematic policies on pharmacy_details
DROP POLICY IF EXISTS "Admins can manage all pharmacy details" ON pharmacy_details;
DROP POLICY IF EXISTS "Anyone can view verified pharmacies" ON pharmacy_details;
DROP POLICY IF EXISTS "Customers can view verified pharmacies" ON pharmacy_details;
DROP POLICY IF EXISTS "Pharmacy owners and admins can manage pharmacy details" ON pharmacy_details;
DROP POLICY IF EXISTS "Pharmacy owners can manage own details" ON pharmacy_details;
DROP POLICY IF EXISTS "Public can view verified pharmacies" ON pharmacy_details;

-- Create simple policies for pharmacy_details
CREATE POLICY "pharmacy_details_select_verified" ON pharmacy_details
  FOR SELECT TO public
  USING (verified_at IS NOT NULL);

CREATE POLICY "pharmacy_details_owner_all" ON pharmacy_details
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin policy using direct email check
CREATE POLICY "pharmacy_details_admin_all" ON pharmacy_details
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