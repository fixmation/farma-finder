/*
  # Enhanced Commission and Analytics System

  1. New Tables
    - `commission_rates` - Configurable commission rates by service type
    - `monthly_commission_summaries` - Pre-calculated monthly summaries
    - `referral_system` - User referral tracking and rewards
    - `platform_analytics` - System-wide analytics and metrics

  2. Enhanced Features
    - Flexible commission rate management
    - Automated monthly summaries
    - Referral reward system
    - Advanced analytics tracking
    - Performance metrics

  3. Security
    - Enable RLS on all new tables
    - Admin-only access for rate management
    - User access for own referral data
*/

-- Configurable commission rates
CREATE TABLE IF NOT EXISTS commission_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL CHECK (service_type IN ('prescription_upload', 'lab_booking', 'pharmacy_registration', 'referral_bonus')),
  provider_type text CHECK (provider_type IN ('pharmacy', 'laboratory', 'platform')),
  rate_type text DEFAULT 'fixed' CHECK (rate_type IN ('fixed', 'percentage')),
  rate_value numeric(10,2) NOT NULL,
  minimum_amount_lkr numeric(10,2) DEFAULT 0.00,
  maximum_amount_lkr numeric(10,2),
  effective_from timestamptz DEFAULT now(),
  effective_until timestamptz,
  is_active boolean DEFAULT true,
  description text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Monthly commission summaries for faster reporting
CREATE TABLE IF NOT EXISTS monthly_commission_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL,
  provider_type text NOT NULL CHECK (provider_type IN ('pharmacy', 'laboratory')),
  summary_month date NOT NULL, -- First day of the month
  total_transactions integer DEFAULT 0,
  total_gross_amount_lkr numeric(12,2) DEFAULT 0.00,
  total_commission_lkr numeric(12,2) DEFAULT 0.00,
  prescription_count integer DEFAULT 0,
  prescription_commission_lkr numeric(12,2) DEFAULT 0.00,
  lab_booking_count integer DEFAULT 0,
  lab_booking_commission_lkr numeric(12,2) DEFAULT 0.00,
  referral_count integer DEFAULT 0,
  referral_commission_lkr numeric(12,2) DEFAULT 0.00,
  payout_status text DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'completed')),
  payout_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Referral system for user acquisition
CREATE TABLE IF NOT EXISTS referral_system (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  referee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code text UNIQUE NOT NULL,
  referral_type text DEFAULT 'user_signup' CHECK (referral_type IN ('user_signup', 'pharmacy_signup', 'lab_signup')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
  reward_amount_lkr numeric(10,2) DEFAULT 0.00,
  reward_paid boolean DEFAULT false,
  reward_paid_at timestamptz,
  expires_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Platform-wide analytics and metrics
CREATE TABLE IF NOT EXISTS platform_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_category text NOT NULL CHECK (metric_category IN ('user_activity', 'financial', 'system_performance', 'business_intelligence')),
  metric_value numeric(15,2) NOT NULL,
  metric_unit text, -- e.g., 'count', 'lkr', 'percentage', 'seconds'
  time_period text CHECK (time_period IN ('daily', 'weekly', 'monthly', 'yearly')),
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  metadata jsonb, -- Additional context data
  created_at timestamptz DEFAULT now()
);

-- User engagement tracking
CREATE TABLE IF NOT EXISTS user_engagement_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_id text,
  activity_type text NOT NULL CHECK (activity_type IN ('login', 'prescription_upload', 'pharmacy_search', 'voice_query', 'chat_interaction', 'drug_lookup')),
  activity_details jsonb,
  duration_seconds integer,
  device_type text,
  user_agent text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Enhanced commission transaction tracking
ALTER TABLE commission_transactions 
ADD COLUMN IF NOT EXISTS commission_rate_id uuid REFERENCES commission_rates(id),
ADD COLUMN IF NOT EXISTS referral_id uuid REFERENCES referral_system(id),
ADD COLUMN IF NOT EXISTS processed_by_system boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS metadata jsonb;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_commission_rates_service_type ON commission_rates(service_type);
CREATE INDEX IF NOT EXISTS idx_commission_rates_active ON commission_rates(is_active);
CREATE INDEX IF NOT EXISTS idx_commission_rates_effective ON commission_rates(effective_from, effective_until);

CREATE INDEX IF NOT EXISTS idx_monthly_summaries_provider ON monthly_commission_summaries(provider_id, provider_type);
CREATE INDEX IF NOT EXISTS idx_monthly_summaries_month ON monthly_commission_summaries(summary_month);
CREATE INDEX IF NOT EXISTS idx_monthly_summaries_payout_status ON monthly_commission_summaries(payout_status);

CREATE INDEX IF NOT EXISTS idx_referral_system_referrer ON referral_system(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_system_referee ON referral_system(referee_id);
CREATE INDEX IF NOT EXISTS idx_referral_system_code ON referral_system(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_system_status ON referral_system(status);

CREATE INDEX IF NOT EXISTS idx_platform_analytics_metric ON platform_analytics(metric_name, metric_category);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_period ON platform_analytics(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_user_engagement_user ON user_engagement_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_activity ON user_engagement_metrics(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_engagement_created_at ON user_engagement_metrics(created_at);

-- Enable Row Level Security
ALTER TABLE commission_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_commission_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_system ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_engagement_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for commission_rates
CREATE POLICY "Admins can manage commission rates"
  ON commission_rates
  FOR ALL
  TO authenticated
  USING (get_current_user_role() = 'admin');

CREATE POLICY "Users can view active commission rates"
  ON commission_rates
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for monthly_commission_summaries
CREATE POLICY "Providers can view own summaries"
  ON monthly_commission_summaries
  FOR SELECT
  TO authenticated
  USING (
    (provider_type = 'pharmacy' AND provider_id IN (
      SELECT id FROM pharmacy_details WHERE user_id = auth.uid()
    )) OR
    (provider_type = 'laboratory' AND provider_id IN (
      SELECT id FROM laboratory_details WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Admins can view all summaries"
  ON monthly_commission_summaries
  FOR ALL
  TO authenticated
  USING (get_current_user_role() = 'admin');

-- RLS Policies for referral_system
CREATE POLICY "Users can view own referrals"
  ON referral_system
  FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referee_id = auth.uid());

CREATE POLICY "Users can create referrals"
  ON referral_system
  FOR INSERT
  TO authenticated
  WITH CHECK (referrer_id = auth.uid());

-- RLS Policies for platform_analytics
CREATE POLICY "Admins can manage platform analytics"
  ON platform_analytics
  FOR ALL
  TO authenticated
  USING (get_current_user_role() = 'admin');

-- RLS Policies for user_engagement_metrics
CREATE POLICY "Users can view own engagement metrics"
  ON user_engagement_metrics
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert engagement metrics"
  ON user_engagement_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all engagement metrics"
  ON user_engagement_metrics
  FOR ALL
  TO authenticated
  USING (get_current_user_role() = 'admin');

-- Insert default commission rates
INSERT INTO commission_rates (service_type, provider_type, rate_type, rate_value, description, created_by) VALUES
('prescription_upload', 'pharmacy', 'fixed', 100.00, 'Standard commission for prescription uploads', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)),
('lab_booking', 'laboratory', 'fixed', 100.00, 'Standard commission for lab bookings', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)),
('pharmacy_registration', 'platform', 'fixed', 500.00, 'One-time registration bonus for pharmacies', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)),
('referral_bonus', 'platform', 'fixed', 250.00, 'Referral bonus for successful user acquisition', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1))
ON CONFLICT DO NOTHING;