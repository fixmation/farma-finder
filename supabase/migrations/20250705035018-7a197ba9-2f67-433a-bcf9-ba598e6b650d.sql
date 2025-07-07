
-- Add 'laboratory' to the user_role enum
ALTER TYPE user_role ADD VALUE 'laboratory';

-- Create laboratory_details table
CREATE TABLE public.laboratory_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  registration_number TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  operating_hours JSONB,
  services_offered TEXT[],
  home_visit_available BOOLEAN NOT NULL DEFAULT true,
  home_visit_charges NUMERIC,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.profiles(id),
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lab_bookings table
CREATE TABLE public.lab_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  laboratory_id UUID REFERENCES public.laboratory_details(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  service_type TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  special_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add laboratory_id to commission_transactions for lab commissions
ALTER TABLE public.commission_transactions 
ADD COLUMN laboratory_id UUID REFERENCES public.laboratory_details(id);

-- Enable RLS on new tables
ALTER TABLE public.laboratory_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_bookings ENABLE ROW LEVEL SECURITY;

-- RLS policies for laboratory_details
CREATE POLICY "Laboratories can manage own details" 
  ON public.laboratory_details 
  FOR ALL 
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Customers can view verified laboratories" 
  ON public.laboratory_details 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = laboratory_details.user_id AND status = 'verified'
    )
  );

-- RLS policies for lab_bookings
CREATE POLICY "Laboratories can view own bookings" 
  ON public.lab_bookings 
  FOR SELECT 
  USING (
    laboratory_id IN (
      SELECT id FROM public.laboratory_details 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Laboratories can update own bookings" 
  ON public.lab_bookings 
  FOR UPDATE 
  USING (
    laboratory_id IN (
      SELECT id FROM public.laboratory_details 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create lab bookings" 
  ON public.lab_bookings 
  FOR INSERT 
  WITH CHECK (true);

-- Update commission_transactions policies to include laboratories
DROP POLICY IF EXISTS "Pharmacies can view own transactions" ON public.commission_transactions;

CREATE POLICY "Pharmacies and laboratories can view own transactions" 
  ON public.commission_transactions 
  FOR SELECT 
  USING (
    pharmacy_id IN (
      SELECT id FROM public.pharmacy_details 
      WHERE user_id = auth.uid()
    ) OR 
    laboratory_id IN (
      SELECT id FROM public.laboratory_details 
      WHERE user_id = auth.uid()
    )
  );
