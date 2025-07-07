
-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('customer', 'pharmacy', 'admin');

-- Create user status enum  
CREATE TYPE public.user_status AS ENUM ('pending', 'verified', 'suspended', 'rejected');

-- Create payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create language enum for Sri Lankan localization
CREATE TYPE public.language_code AS ENUM ('en', 'si', 'ta');

-- User profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  status user_status NOT NULL DEFAULT 'pending',
  preferred_language language_code DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy details table
CREATE TABLE public.pharmacy_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  pharmacist_certificate_url TEXT,
  business_registration_url TEXT,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  operating_hours JSONB,
  contact_phone TEXT,
  contact_email TEXT,
  verification_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commission tracking table
CREATE TABLE public.commission_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id UUID REFERENCES public.pharmacy_details(id) ON DELETE CASCADE,
  prescription_id UUID, -- Will link to prescription processing
  amount_lkr DECIMAL(10, 2) NOT NULL DEFAULT 100.00,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  status payment_status DEFAULT 'completed'
);

-- Payout requests table
CREATE TABLE public.payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id UUID REFERENCES public.pharmacy_details(id) ON DELETE CASCADE,
  requested_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL, -- 'lankaqr', 'bank_transfer', etc.
  payment_details JSONB, -- Store payment gateway specific details
  status payment_status DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES public.profiles(id),
  notes TEXT
);

-- Reviews and ratings table
CREATE TABLE public.pharmacy_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id UUID REFERENCES public.pharmacy_details(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pharmacy_id, customer_id)
);

-- Audit logs table for PDPA compliance
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site configuration table (admin only)
CREATE TABLE public.site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value TEXT,
  description TEXT,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site configurations
INSERT INTO public.site_config (config_key, config_value, description) VALUES
('elevenlabs_api_key', '', 'ElevenLabs API key for voice features'),
('lankaqr_api_key', '', 'LankaQR payment gateway API key'),
('sms_api_key', '', 'SMS service API key'),
('commission_rate_lkr', '100.00', 'Commission per prescription in LKR'),
('site_language_default', 'en', 'Default site language'),
('pdpa_consent_required', 'true', 'Require PDPA consent for data processing');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Pharmacy details policies
CREATE POLICY "Pharmacies can manage own details" ON public.pharmacy_details
  FOR ALL USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Customers can view verified pharmacies" ON public.pharmacy_details
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND status = 'verified')
  );

-- Commission transactions policies
CREATE POLICY "Pharmacies can view own transactions" ON public.commission_transactions
  FOR SELECT USING (
    pharmacy_id IN (SELECT id FROM public.pharmacy_details WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can view all transactions" ON public.commission_transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Payout requests policies
CREATE POLICY "Pharmacies can manage own payouts" ON public.payout_requests
  FOR ALL USING (
    pharmacy_id IN (SELECT id FROM public.pharmacy_details WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Reviews policies
CREATE POLICY "Users can manage own reviews" ON public.pharmacy_reviews
  FOR ALL USING (customer_id = auth.uid());

CREATE POLICY "Pharmacies can view own reviews" ON public.pharmacy_reviews
  FOR SELECT USING (
    pharmacy_id IN (SELECT id FROM public.pharmacy_details WHERE user_id = auth.uid())
  );

-- Audit logs policies (admin only)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Site config policies (admin only)
CREATE POLICY "Admins can manage site config" ON public.site_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function for audit logging
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id, 
    old_values, new_values, ip_address, user_agent
  )
  VALUES (
    auth.uid(), p_action, p_resource_type, p_resource_id,
    p_old_values, p_new_values, 
    inet_client_addr(), current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage bucket for pharmacy certificates
INSERT INTO storage.buckets (id, name, public) VALUES ('pharmacy-documents', 'pharmacy-documents', false);

-- Storage policies for pharmacy documents
CREATE POLICY "Pharmacy owners can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'pharmacy-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Pharmacy owners can view own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'pharmacy-documents' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR
     EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  );

-- Create indexes for performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_pharmacy_details_location ON public.pharmacy_details(latitude, longitude);
CREATE INDEX idx_commission_transactions_pharmacy ON public.commission_transactions(pharmacy_id);
CREATE INDEX idx_commission_transactions_date ON public.commission_transactions(transaction_date);
CREATE INDEX idx_audit_logs_user_action ON public.audit_logs(user_id, action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
