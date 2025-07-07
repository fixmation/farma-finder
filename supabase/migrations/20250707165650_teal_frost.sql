/*
  # Enhanced Prescription Management System

  1. New Tables
    - `prescriptions` - Core prescription data with OCR results
    - `prescription_medications` - Individual medications from prescriptions
    - `medication_database` - Comprehensive drug information database
    - `prescription_reviews` - Quality control and verification
    - `notification_preferences` - User notification settings
    - `system_notifications` - Platform-wide notifications

  2. Enhanced Features
    - Prescription OCR result storage
    - Medication interaction checking
    - Review and verification workflow
    - Notification system
    - Enhanced audit capabilities

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for data access
    - Maintain PDPA compliance
*/

-- Prescriptions table for storing uploaded prescriptions and OCR results
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  pharmacy_id uuid REFERENCES pharmacy_details(id) ON DELETE SET NULL,
  image_url text NOT NULL,
  ocr_raw_text text,
  ocr_confidence numeric(3,2) DEFAULT 0.0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  total_amount_lkr numeric(10,2) DEFAULT 0.00,
  service_fee_lkr numeric(10,2) DEFAULT 100.00,
  notes text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Individual medications extracted from prescriptions
CREATE TABLE IF NOT EXISTS prescription_medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE CASCADE,
  medication_name text NOT NULL,
  dosage text,
  frequency text,
  duration text,
  quantity integer,
  unit_price_lkr numeric(10,2),
  total_price_lkr numeric(10,2),
  confidence_score numeric(3,2) DEFAULT 0.0,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Comprehensive medication database
CREATE TABLE IF NOT EXISTS medication_database (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generic_name text NOT NULL,
  brand_names text[],
  category text NOT NULL,
  description text,
  indications text[],
  contraindications text[],
  side_effects text[],
  drug_interactions text[],
  dosage_forms text[],
  strength_options text[],
  storage_conditions text,
  pregnancy_category text,
  controlled_substance boolean DEFAULT false,
  prescription_required boolean DEFAULT true,
  average_price_lkr numeric(10,2),
  availability_status text DEFAULT 'available' CHECK (availability_status IN ('available', 'limited', 'unavailable')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Prescription review and verification system
CREATE TABLE IF NOT EXISTS prescription_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES profiles(id),
  review_type text NOT NULL CHECK (review_type IN ('pharmacist_review', 'ai_validation', 'quality_check')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_clarification')),
  comments text,
  reviewed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- User notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  push_notifications boolean DEFAULT true,
  prescription_updates boolean DEFAULT true,
  commission_updates boolean DEFAULT true,
  system_announcements boolean DEFAULT true,
  marketing_communications boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- System notifications
CREATE TABLE IF NOT EXISTS system_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  category text DEFAULT 'general' CHECK (category IN ('general', 'prescription', 'commission', 'system', 'security')),
  read boolean DEFAULT false,
  action_url text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enhanced pharmacy inventory management
CREATE TABLE IF NOT EXISTS pharmacy_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacy_details(id) ON DELETE CASCADE,
  medication_id uuid REFERENCES medication_database(id),
  stock_quantity integer DEFAULT 0,
  unit_price_lkr numeric(10,2) NOT NULL,
  expiry_date date,
  batch_number text,
  supplier_info jsonb,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Prescription fulfillment tracking
CREATE TABLE IF NOT EXISTS prescription_fulfillments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE CASCADE,
  pharmacy_id uuid REFERENCES pharmacy_details(id) ON DELETE CASCADE,
  fulfillment_status text DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
  estimated_ready_time timestamptz,
  actual_ready_time timestamptz,
  delivery_method text CHECK (delivery_method IN ('pickup', 'delivery', 'courier')),
  delivery_address text,
  delivery_fee_lkr numeric(10,2) DEFAULT 0.00,
  tracking_number text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prescriptions_customer ON prescriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_pharmacy ON prescriptions(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_created_at ON prescriptions(created_at);

CREATE INDEX IF NOT EXISTS idx_prescription_medications_prescription ON prescription_medications(prescription_id);
CREATE INDEX IF NOT EXISTS idx_prescription_medications_name ON prescription_medications(medication_name);

CREATE INDEX IF NOT EXISTS idx_medication_database_generic_name ON medication_database(generic_name);
CREATE INDEX IF NOT EXISTS idx_medication_database_category ON medication_database(category);

CREATE INDEX IF NOT EXISTS idx_prescription_reviews_prescription ON prescription_reviews(prescription_id);
CREATE INDEX IF NOT EXISTS idx_prescription_reviews_reviewer ON prescription_reviews(reviewer_id);

CREATE INDEX IF NOT EXISTS idx_system_notifications_recipient ON system_notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_system_notifications_read ON system_notifications(read);
CREATE INDEX IF NOT EXISTS idx_system_notifications_created_at ON system_notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_pharmacy_inventory_pharmacy ON pharmacy_inventory(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_inventory_medication ON pharmacy_inventory(medication_id);

CREATE INDEX IF NOT EXISTS idx_prescription_fulfillments_prescription ON prescription_fulfillments(prescription_id);
CREATE INDEX IF NOT EXISTS idx_prescription_fulfillments_pharmacy ON prescription_fulfillments(pharmacy_id);

-- Enable Row Level Security
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_fulfillments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prescriptions
CREATE POLICY "Users can view own prescriptions"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Users can create own prescriptions"
  ON prescriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Pharmacies can view assigned prescriptions"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacy_details WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all prescriptions"
  ON prescriptions
  FOR ALL
  TO authenticated
  USING (get_current_user_role() = 'admin');

-- RLS Policies for prescription_medications
CREATE POLICY "Users can view own prescription medications"
  ON prescription_medications
  FOR SELECT
  TO authenticated
  USING (
    prescription_id IN (
      SELECT id FROM prescriptions WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacies can view assigned prescription medications"
  ON prescription_medications
  FOR SELECT
  TO authenticated
  USING (
    prescription_id IN (
      SELECT id FROM prescriptions 
      WHERE pharmacy_id IN (
        SELECT id FROM pharmacy_details WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for medication_database (public read access)
CREATE POLICY "Anyone can read medication database"
  ON medication_database
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage medication database"
  ON medication_database
  FOR ALL
  TO authenticated
  USING (get_current_user_role() = 'admin');

-- RLS Policies for notification_preferences
CREATE POLICY "Users can manage own notification preferences"
  ON notification_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for system_notifications
CREATE POLICY "Users can view own notifications"
  ON system_notifications
  FOR SELECT
  TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON system_notifications
  FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid());

-- RLS Policies for pharmacy_inventory
CREATE POLICY "Pharmacies can manage own inventory"
  ON pharmacy_inventory
  FOR ALL
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacy_details WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view available inventory"
  ON pharmacy_inventory
  FOR SELECT
  TO authenticated
  USING (stock_quantity > 0);

-- RLS Policies for prescription_fulfillments
CREATE POLICY "Users can view own prescription fulfillments"
  ON prescription_fulfillments
  FOR SELECT
  TO authenticated
  USING (
    prescription_id IN (
      SELECT id FROM prescriptions WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacies can manage assigned fulfillments"
  ON prescription_fulfillments
  FOR ALL
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacy_details WHERE user_id = auth.uid()
    )
  );