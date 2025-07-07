/*
  # Advanced Platform Features

  1. New Tables
    - `drug_interaction_warnings` - Drug interaction database
    - `prescription_templates` - Common prescription templates
    - `pharmacy_specializations` - Pharmacy specialty services
    - `emergency_contacts` - Emergency contact system
    - `feedback_system` - User feedback and ratings

  2. Enhanced Features
    - Drug interaction checking
    - Prescription templates for common conditions
    - Pharmacy specialization tracking
    - Emergency contact management
    - Comprehensive feedback system

  3. Security
    - Enable RLS on all new tables
    - Appropriate access policies
    - Data privacy compliance
*/

-- Drug interaction warnings database
CREATE TABLE IF NOT EXISTS drug_interaction_warnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_a_name text NOT NULL,
  drug_b_name text NOT NULL,
  interaction_severity text NOT NULL CHECK (interaction_severity IN ('minor', 'moderate', 'major', 'contraindicated')),
  interaction_type text CHECK (interaction_type IN ('pharmacokinetic', 'pharmacodynamic', 'synergistic', 'antagonistic')),
  description text NOT NULL,
  clinical_significance text,
  management_recommendations text,
  evidence_level text CHECK (evidence_level IN ('theoretical', 'case_report', 'study', 'established')),
  source_references text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Prescription templates for common conditions
CREATE TABLE IF NOT EXISTS prescription_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  condition_name text NOT NULL,
  age_group text CHECK (age_group IN ('pediatric', 'adult', 'geriatric', 'all')),
  template_medications jsonb NOT NULL, -- Array of medication objects
  duration_days integer,
  special_instructions text,
  contraindications text[],
  created_by uuid REFERENCES profiles(id),
  is_approved boolean DEFAULT false,
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pharmacy specializations and services
CREATE TABLE IF NOT EXISTS pharmacy_specializations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacy_details(id) ON DELETE CASCADE,
  specialization_type text NOT NULL CHECK (specialization_type IN (
    'pediatric', 'geriatric', 'oncology', 'diabetes', 'cardiology', 
    'mental_health', 'dermatology', 'respiratory', 'pain_management',
    'compounding', 'veterinary', 'ayurvedic', 'homeopathic'
  )),
  certification_number text,
  certification_authority text,
  certification_expiry date,
  is_verified boolean DEFAULT false,
  verified_by uuid REFERENCES profiles(id),
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Emergency contacts for users
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  contact_name text NOT NULL,
  relationship text NOT NULL,
  phone_number text NOT NULL,
  email text,
  address text,
  is_primary boolean DEFAULT false,
  medical_conditions text[],
  allergies text[],
  current_medications text[],
  blood_type text,
  insurance_info jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Comprehensive feedback system
CREATE TABLE IF NOT EXISTS feedback_system (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN (
    'pharmacy_review', 'lab_review', 'app_feedback', 'feature_request', 
    'bug_report', 'service_complaint', 'suggestion'
  )),
  target_id uuid, -- ID of pharmacy, lab, or other entity being reviewed
  target_type text CHECK (target_type IN ('pharmacy', 'laboratory', 'prescription', 'app_feature')),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  title text,
  description text NOT NULL,
  attachments text[], -- URLs to uploaded files
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to uuid REFERENCES profiles(id),
  resolution_notes text,
  resolved_at timestamptz,
  is_anonymous boolean DEFAULT false,
  is_public boolean DEFAULT true,
  helpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Medication adherence tracking
CREATE TABLE IF NOT EXISTS medication_adherence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE CASCADE,
  medication_name text NOT NULL,
  prescribed_frequency text NOT NULL,
  actual_doses_taken integer DEFAULT 0,
  expected_doses integer NOT NULL,
  adherence_percentage numeric(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN expected_doses > 0 THEN (actual_doses_taken::numeric / expected_doses::numeric) * 100
      ELSE 0
    END
  ) STORED,
  tracking_start_date date NOT NULL,
  tracking_end_date date,
  missed_doses_reasons text[],
  side_effects_reported text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pharmacy inventory alerts
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacy_details(id) ON DELETE CASCADE,
  medication_id uuid REFERENCES medication_database(id),
  alert_type text NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'expiry_warning', 'recall_notice')),
  current_stock integer,
  threshold_level integer,
  expiry_date date,
  alert_message text NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_acknowledged boolean DEFAULT false,
  acknowledged_by uuid REFERENCES profiles(id),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_drug_interactions_drugs ON drug_interaction_warnings(drug_a_name, drug_b_name);
CREATE INDEX IF NOT EXISTS idx_drug_interactions_severity ON drug_interaction_warnings(interaction_severity);

CREATE INDEX IF NOT EXISTS idx_prescription_templates_condition ON prescription_templates(condition_name);
CREATE INDEX IF NOT EXISTS idx_prescription_templates_approved ON prescription_templates(is_approved);

CREATE INDEX IF NOT EXISTS idx_pharmacy_specializations_pharmacy ON pharmacy_specializations(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_specializations_type ON pharmacy_specializations(specialization_type);

CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_primary ON emergency_contacts(is_primary);

CREATE INDEX IF NOT EXISTS idx_feedback_system_user ON feedback_system(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_system_target ON feedback_system(target_id, target_type);
CREATE INDEX IF NOT EXISTS idx_feedback_system_status ON feedback_system(status);
CREATE INDEX IF NOT EXISTS idx_feedback_system_type ON feedback_system(feedback_type);

CREATE INDEX IF NOT EXISTS idx_medication_adherence_user ON medication_adherence(user_id);
CREATE INDEX IF NOT EXISTS idx_medication_adherence_prescription ON medication_adherence(prescription_id);

CREATE INDEX IF NOT EXISTS idx_inventory_alerts_pharmacy ON inventory_alerts(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_type ON inventory_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_severity ON inventory_alerts(severity);

-- Enable Row Level Security
ALTER TABLE drug_interaction_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_system ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_adherence ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for drug_interaction_warnings (public read access)
CREATE POLICY "Anyone can read drug interactions"
  ON drug_interaction_warnings
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage drug interactions"
  ON drug_interaction_warnings
  FOR ALL
  TO authenticated
  USING (get_current_user_role() = 'admin');

-- RLS Policies for prescription_templates
CREATE POLICY "Healthcare providers can view approved templates"
  ON prescription_templates
  FOR SELECT
  TO authenticated
  USING (
    is_approved = true OR 
    created_by = auth.uid() OR 
    get_current_user_role() = 'admin'
  );

CREATE POLICY "Healthcare providers can create templates"
  ON prescription_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    get_current_user_role() IN ('admin', 'pharmacy', 'laboratory')
  );

-- RLS Policies for pharmacy_specializations
CREATE POLICY "Anyone can view verified specializations"
  ON pharmacy_specializations
  FOR SELECT
  TO authenticated
  USING (is_verified = true);

CREATE POLICY "Pharmacies can manage own specializations"
  ON pharmacy_specializations
  FOR ALL
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacy_details WHERE user_id = auth.uid()
    ) OR get_current_user_role() = 'admin'
  );

-- RLS Policies for emergency_contacts
CREATE POLICY "Users can manage own emergency contacts"
  ON emergency_contacts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for feedback_system
CREATE POLICY "Users can view public feedback"
  ON feedback_system
  FOR SELECT
  TO authenticated
  USING (is_public = true OR user_id = auth.uid() OR get_current_user_role() = 'admin');

CREATE POLICY "Users can create feedback"
  ON feedback_system
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own feedback"
  ON feedback_system
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR get_current_user_role() = 'admin');

-- RLS Policies for medication_adherence
CREATE POLICY "Users can manage own adherence data"
  ON medication_adherence
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Healthcare providers can view patient adherence"
  ON medication_adherence
  FOR SELECT
  TO authenticated
  USING (
    prescription_id IN (
      SELECT id FROM prescriptions 
      WHERE pharmacy_id IN (
        SELECT id FROM pharmacy_details WHERE user_id = auth.uid()
      )
    ) OR get_current_user_role() = 'admin'
  );

-- RLS Policies for inventory_alerts
CREATE POLICY "Pharmacies can manage own inventory alerts"
  ON inventory_alerts
  FOR ALL
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacy_details WHERE user_id = auth.uid()
    ) OR get_current_user_role() = 'admin'
  );

-- Insert some sample drug interactions
INSERT INTO drug_interaction_warnings (drug_a_name, drug_b_name, interaction_severity, interaction_type, description, clinical_significance, management_recommendations, evidence_level) VALUES
('Warfarin', 'Aspirin', 'major', 'synergistic', 'Increased risk of bleeding when used together', 'Significantly increased bleeding risk', 'Monitor INR closely, consider alternative antiplatelet therapy', 'established'),
('Metformin', 'Alcohol', 'moderate', 'pharmacokinetic', 'Alcohol may increase risk of lactic acidosis', 'Moderate risk of serious metabolic complications', 'Limit alcohol consumption, monitor for symptoms', 'established'),
('Paracetamol', 'Alcohol', 'moderate', 'pharmacokinetic', 'Chronic alcohol use increases hepatotoxicity risk', 'Increased liver damage risk with chronic use', 'Limit alcohol consumption, monitor liver function', 'established')
ON CONFLICT DO NOTHING;