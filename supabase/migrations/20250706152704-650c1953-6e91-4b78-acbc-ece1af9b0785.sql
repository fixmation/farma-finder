
-- Add commission configuration table
CREATE TABLE public.commission_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('prescription_upload', 'lab_booking')),
  base_rate_lkr DECIMAL(10, 2) NOT NULL DEFAULT 100.00,
  host_percentage DECIMAL(5, 2) NOT NULL DEFAULT 70.00,
  developer_percentage DECIMAL(5, 2) NOT NULL DEFAULT 30.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced commission transactions with split tracking
ALTER TABLE public.commission_transactions
ADD COLUMN event_type TEXT CHECK (event_type IN ('prescription_upload', 'lab_booking')),
ADD COLUMN user_id UUID REFERENCES public.profiles(id),
ADD COLUMN service_provider_id UUID,
ADD COLUMN host_amount_lkr DECIMAL(10, 2),
ADD COLUMN developer_amount_lkr DECIMAL(10, 2),
ADD COLUMN metadata JSONB,
ADD COLUMN payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'QR_GENERATED', 'PAID', 'VERIFIED'));

-- QR payment requests table
CREATE TABLE public.qr_payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_provider_id UUID NOT NULL,
  service_provider_type TEXT NOT NULL CHECK (service_provider_type IN ('pharmacy', 'laboratory')),
  amount_lkr DECIMAL(10, 2) NOT NULL,
  commission_transactions JSONB NOT NULL,
  qr_code_data TEXT,
  payment_gateway TEXT DEFAULT 'LankaQR',
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'QR_GENERATED', 'PAID', 'VERIFIED')),
  proof_of_payment_url TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.profiles(id),
  notes TEXT
);

-- Prescription uploads tracking table
CREATE TABLE public.prescription_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.profiles(id) NOT NULL,
  pharmacy_id UUID REFERENCES public.pharmacy_details(id) NOT NULL,
  prescription_image_url TEXT NOT NULL,
  upload_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processed', 'fulfilled')),
  commission_transaction_id UUID REFERENCES public.commission_transactions(id),
  notes TEXT
);

-- Commission summary views
CREATE TABLE public.commission_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_prescriptions INTEGER DEFAULT 0,
  total_lab_bookings INTEGER DEFAULT 0,
  total_gross_commission DECIMAL(10, 2) DEFAULT 0,
  total_host_commission DECIMAL(10, 2) DEFAULT 0,
  total_developer_commission DECIMAL(10, 2) DEFAULT 0,
  by_pharmacy JSONB,
  by_laboratory JSONB,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add developer admin role
ALTER TYPE user_role ADD VALUE 'developer_admin';

-- Insert default commission configuration
INSERT INTO public.commission_config (event_type, base_rate_lkr, host_percentage, developer_percentage) 
VALUES 
('prescription_upload', 100.00, 70.00, 30.00),
('lab_booking', 100.00, 70.00, 30.00);

-- Enable RLS on new tables
ALTER TABLE public.commission_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_summaries ENABLE ROW LEVEL SECURITY;

-- RLS policies for commission_config
CREATE POLICY "Admins can manage commission config" ON public.commission_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'developer_admin'))
  );

-- RLS policies for qr_payment_requests
CREATE POLICY "Service providers can view own payment requests" ON public.qr_payment_requests
  FOR SELECT USING (
    service_provider_id IN (
      SELECT id FROM public.pharmacy_details WHERE user_id = auth.uid()
      UNION
      SELECT id FROM public.laboratory_details WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all payment requests" ON public.qr_payment_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'developer_admin'))
  );

-- RLS policies for prescription_uploads
CREATE POLICY "Customers can view own uploads" ON public.prescription_uploads
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Pharmacies can view uploads to them" ON public.prescription_uploads
  FOR SELECT USING (
    pharmacy_id IN (SELECT id FROM public.pharmacy_details WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can view all uploads" ON public.prescription_uploads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'developer_admin'))
  );

-- RLS policies for commission_summaries
CREATE POLICY "Admins can view commission summaries" ON public.commission_summaries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'developer_admin'))
  );

-- Function to calculate and create commission transaction
CREATE OR REPLACE FUNCTION public.create_commission_transaction(
  p_event_type TEXT,
  p_user_id UUID,
  p_service_provider_id UUID,
  p_service_provider_type TEXT
)
RETURNS UUID AS $$
DECLARE
  config_row public.commission_config%ROWTYPE;
  transaction_id UUID;
  host_amount DECIMAL(10, 2);
  dev_amount DECIMAL(10, 2);
BEGIN
  -- Get commission configuration
  SELECT * INTO config_row 
  FROM public.commission_config 
  WHERE event_type = p_event_type AND is_active = true
  LIMIT 1;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No active commission configuration found for event type: %', p_event_type;
  END IF;
  
  -- Calculate split amounts
  host_amount := config_row.base_rate_lkr * (config_row.host_percentage / 100);
  dev_amount := config_row.base_rate_lkr * (config_row.developer_percentage / 100);
  
  -- Insert commission transaction
  INSERT INTO public.commission_transactions (
    event_type,
    user_id,
    service_provider_id,
    amount_lkr,
    host_amount_lkr,
    developer_amount_lkr,
    pharmacy_id,
    laboratory_id,
    description,
    metadata
  ) VALUES (
    p_event_type,
    p_user_id,
    p_service_provider_id,
    config_row.base_rate_lkr,
    host_amount,
    dev_amount,
    CASE WHEN p_service_provider_type = 'pharmacy' THEN p_service_provider_id ELSE NULL END,
    CASE WHEN p_service_provider_type = 'laboratory' THEN p_service_provider_id ELSE NULL END,
    'Commission for ' || p_event_type,
    jsonb_build_object(
      'event_type', p_event_type,
      'service_provider_type', p_service_provider_type,
      'commission_rate', config_row.base_rate_lkr,
      'host_percentage', config_row.host_percentage,
      'developer_percentage', config_row.developer_percentage
    )
  ) RETURNING id INTO transaction_id;
  
  RETURN transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX idx_commission_transactions_event_type ON public.commission_transactions(event_type);
CREATE INDEX idx_commission_transactions_payment_status ON public.commission_transactions(payment_status);
CREATE INDEX idx_qr_payment_requests_status ON public.qr_payment_requests(status);
CREATE INDEX idx_prescription_uploads_pharmacy ON public.prescription_uploads(pharmacy_id);
CREATE INDEX idx_prescription_uploads_customer ON public.prescription_uploads(customer_id);
