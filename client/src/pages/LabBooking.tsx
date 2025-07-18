The LabBooking component is enhanced with a booking form, logic for selecting laboratories and tests, and email confirmation functionality.
```

```typescript
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, MapPin, Phone, Clock, Home, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Laboratory {
  id: string;
  business_name: string;
  address: string;
  contact_phone?: string;
  services_offered?: string[];
  home_visit_available: boolean;
  home_visit_charges?: number;
  operating_hours?: any;
}

const LabBooking: React.FC = () => {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    customer_name: '',
    contact_phone: '',
    address: '',
    service_type: '',
    preferred_date: '',
    preferred_time: '',
    special_instructions: ''
  });

  useEffect(() => {
    fetchLaboratories();
  }, []);

  const fetchLaboratories = async () => {
    try {
      const { data, error } = await supabase
        .from('laboratory_details')
        .select(`
          id,
          business_name,
          address,
          contact_phone,
          services_offered,
          home_visit_available,
          home_visit_charges,
          operating_hours
        `)
        .not('verified_at', 'is', null)
        .eq('home_visit_available', true);

      if (error) throw error;

      setLaboratories(data || []);
    } catch (error) {
      console.error('Error fetching laboratories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedLab) return;

    try {
      const { error } = await supabase
        .from('lab_bookings')
        .insert({
          laboratory_id: selectedLab.id,
          customer_name: bookingForm.customer_name,
          contact_phone: bookingForm.contact_phone,
          address: bookingForm.address,
          service_type: bookingForm.service_type,
          preferred_date: bookingForm.preferred_date,
          preferred_time: bookingForm.preferred_time,
          special_instructions: bookingForm.special_instructions,
          status: 'pending'
        });

      if (error) throw error;

      // Create commission transaction
      await supabase
        .from('commission_transactions')
        .insert({
          laboratory_id: selectedLab.id,
          amount_lkr: 100, // LKR 100 commission per booking
          description: `Home visit booking commission - ${bookingForm.service_type}`,
          status: 'completed'
        });

      toast.success('Booking submitted successfully!');
      setBookingForm({
        customer_name: '',
        contact_phone: '',
        address: '',
        service_type: '',
        preferred_date: '',
        preferred_time: '',
        special_instructions: ''
      });
      setSelectedLab(null);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to submit booking');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-slate via-medical-mint to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-medical-blue to-medical-green bg-clip-text text-transparent">
            Laboratory Home Visits
          </h1>
          <p className="text-lg text-muted-foreground">
            Book blood tests, urine tests, and more at your home
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Laboratory List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Available Laboratories</h2>
            {loading ? (
              <div className="text-center py-8">Loading laboratories...</div>
            ) : (
              <div className="space-y-4">
                {laboratories.map((lab) => (
                  <Card 
                    key={lab.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedLab?.id === lab.id 
                        ? 'ring-2 ring-medical-blue shadow-lg' 
                        : 'hover:ring-1 hover:ring-medical-blue/50'
                    }`}
                    onClick={() => setSelectedLab(lab)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="h-5 w-5 text-medical-blue" />
                        {lab.business_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {lab.address}
                      </div>

                      {lab.contact_phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          {lab.contact_phone}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <Home className="h-4 w-4 text-medical-green" />
                        Home visit charges: LKR {lab.home_visit_charges || 'Contact for pricing'}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-medical-green/10 text-medical-green">
                          Home Visits Available
                        </Badge>
                      </div>

                      {lab.services_offered && lab.services_offered.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Services:</p>
                          <div className="flex flex-wrap gap-1">
                            {lab.services_offered.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Book Home Visit</h2>
            {selectedLab ? (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Book with {selectedLab.business_name}</CardTitle>
                  <CardDescription>Fill in your details for home visit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customer_name">Full Name</Label>
                      <Input
                        id="customer_name"
                        value={bookingForm.customer_name}
                        onChange={(e) => setBookingForm({...bookingForm, customer_name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone">Contact Phone</Label>
                      <Input
                        id="contact_phone"
                        value={bookingForm.contact_phone}
                        onChange={(e) => setBookingForm({...bookingForm, contact_phone: e.target.value})}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Home Address</Label>
                    <Textarea
                      id="address"
                      value={bookingForm.address}
                      onChange={(e) => setBookingForm({...bookingForm, address: e.target.value})}
                      placeholder="Enter your complete address"
                    />
                  </div>
                  <Label htmlFor="available_lab">Available Laboratories</Label>
              <select
                id="available_lab"
                value={selectedLab ? selectedLab.id : ""}
                onChange={(e) => {
                  const labId = e.target.value;
                  const lab = laboratories.find(lab => lab.id === labId);
                  setSelectedLab(lab || null);
                }}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a laboratory</option>
                {laboratories.map(lab => (
                  <option key={lab.id} value={lab.id}>{lab.business_name}</option>
                ))}
              </select>

              <Label htmlFor="test_list">Select Test</Label>
              <select
                id="test_list"
                value={bookingForm.service_type}
                onChange={(e) => setBookingForm({...bookingForm, service_type: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select test</option>
                <option value="Blood Test">Blood Test</option>
                <option value="Urine Test">Urine Test</option>
                <option value="Complete Health Profile">Complete Health Profile</option>
                <option value="Lipid Profile">Lipid Profile</option>
              </select>

              <Label htmlFor="booking_calendar">Preferred Date & Time</Label>
              <Calendar
                classNames={{ day: 'text-sm px-2 py-1' }}
                min={new Date()}
                selected={new Date(bookingForm.preferred_date)}
                onSelect={(date) => setBookingForm({...bookingForm, preferred_date: date.toISOString().split('T')[0]})}
              />

              <Button 
                onClick={handleBooking}
                className="w-full bg-green-500 text-white hover:bg-green-700"
                disabled={!selectedLab || !bookingForm.customer_name || !bookingForm.contact_phone || !bookingForm.address || !bookingForm.service_type || !bookingForm.preferred_date}
              >
                Book Home Visit
              </Button>

              // Additional logic to handle email here
              async function sendConfirmationEmail() {
                const emailResponse = await fetch('/api/send-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    to: bookingForm.contact_email,
                    subject: 'Booking Confirmation',
                    text: `Dear ${bookingForm.customer_name}, your booking is confirmed with ${selectedLab?.business_name} on ${bookingForm.preferred_date}`
                  })
                });
                if (emailResponse.ok) {
                  toast.success('Confirmation email sent!');
                } else {
                  console.error('Failed to send email.');
                  toast.error('Failed to send confirmation email.');
                }
              }

              handleBooking().then(sendConfirmationEmail);
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <FlaskConical className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a laboratory from the list to book a home visit</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabBooking;
```The LabBooking component is enhanced with a booking form, logic for selecting laboratories and tests, and email confirmation functionality.
```

```typescript
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, MapPin, Phone, Clock, Home, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Laboratory {
  id: string;
  business_name: string;
  address: string;
  contact_phone?: string;
  services_offered?: string[];
  home_visit_available: boolean;
  home_visit_charges?: number;
  operating_hours?: any;
}

const LabBooking: React.FC = () => {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    customer_name: '',
    contact_phone: '',
    address: '',
    service_type: '',
    preferred_date: '',
    preferred_time: '',
    special_instructions: ''
  });

  useEffect(() => {
    fetchLaboratories();
  }, []);

  const fetchLaboratories = async () => {
    try {
      const { data, error } = await supabase
        .from('laboratory_details')
        .select(`
          id,
          business_name,
          address,
          contact_phone,
          services_offered,
          home_visit_available,
          home_visit_charges,
          operating_hours
        `)
        .not('verified_at', 'is', null)
        .eq('home_visit_available', true);

      if (error) throw error;

      setLaboratories(data || []);
    } catch (error) {
      console.error('Error fetching laboratories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedLab) return;

    try {
      const { error } = await supabase
        .from('lab_bookings')
        .insert({
          laboratory_id: selectedLab.id,
          customer_name: bookingForm.customer_name,
          contact_phone: bookingForm.contact_phone,
          address: bookingForm.address,
          service_type: bookingForm.service_type,
          preferred_date: bookingForm.preferred_date,
          preferred_time: bookingForm.preferred_time,
          special_instructions: bookingForm.special_instructions,
          status: 'pending'
        });

      if (error) throw error;

      // Create commission transaction
      await supabase
        .from('commission_transactions')
        .insert({
          laboratory_id: selectedLab.id,
          amount_lkr: 100, // LKR 100 commission per booking
          description: `Home visit booking commission - ${bookingForm.service_type}`,
          status: 'completed'
        });

      toast.success('Booking submitted successfully!');
      setBookingForm({
        customer_name: '',
        contact_phone: '',
        address: '',
        service_type: '',
        preferred_date: '',
        preferred_time: '',
        special_instructions: ''
      });
      setSelectedLab(null);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to submit booking');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-slate via-medical-mint to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-medical-blue to-medical-green bg-clip-text text-transparent">
            Laboratory Home Visits
          </h1>
          <p className="text-lg text-muted-foreground">
            Book blood tests, urine tests, and more at your home
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Laboratory List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Available Laboratories</h2>
            {loading ? (
              <div className="text-center py-8">Loading laboratories...</div>
            ) : (
              <div className="space-y-4">
                {laboratories.map((lab) => (
                  <Card 
                    key={lab.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedLab?.id === lab.id 
                        ? 'ring-2 ring-medical-blue shadow-lg' 
                        : 'hover:ring-1 hover:ring-medical-blue/50'
                    }`}
                    onClick={() => setSelectedLab(lab)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="h-5 w-5 text-medical-blue" />
                        {lab.business_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {lab.address}
                      </div>

                      {lab.contact_phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          {lab.contact_phone}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <Home className="h-4 w-4 text-medical-green" />
                        Home visit charges: LKR {lab.home_visit_charges || 'Contact for pricing'}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-medical-green/10 text-medical-green">
                          Home Visits Available
                        </Badge>
                      </div>

                      {lab.services_offered && lab.services_offered.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Services:</p>
                          <div className="flex flex-wrap gap-1">
                            {lab.services_offered.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Book Home Visit</h2>
            {selectedLab ? (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Book with {selectedLab.business_name}</CardTitle>
                  <CardDescription>Fill in your details for home visit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customer_name">Full Name</Label>
                      <Input
                        id="customer_name"
                        value={bookingForm.customer_name}
                        onChange={(e) => setBookingForm({...bookingForm, customer_name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone">Contact Phone</Label>
                      <Input
                        id="contact_phone"
                        value={bookingForm.contact_phone}
                        onChange={(e) => setBookingForm({...bookingForm, contact_phone: e.target.value})}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Home Address</Label>
                    <Textarea
                      id="address"
                      value={bookingForm.address}
                      onChange={(e) => setBookingForm({...bookingForm, address: e.target.value})}
                      placeholder="Enter your complete address"
                    />
                  </div>
                  <Label htmlFor="available_lab">Available Laboratories</Label>
              <select
                id="available_lab"
                value={selectedLab ? selectedLab.id : ""}
                onChange={(e) => {
                  const labId = e.target.value;
                  const lab = laboratories.find(lab => lab.id === labId);
                  setSelectedLab(lab || null);
                }}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a laboratory</option>
                {laboratories.map(lab => (
                  <option key={lab.id} value={lab.id}>{lab.business_name}</option>
                ))}
              </select>

              <Label htmlFor="test_list">Select Test</Label>
              <select
                id="test_list"
                value={bookingForm.service_type}
                onChange={(e) => setBookingForm({...bookingForm, service_type: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select test</option>
                <option value="Blood Test">Blood Test</option>
                <option value="Urine Test">Urine Test</option>
                <option value="Complete Health Profile">Complete Health Profile</option>
                <option value="Lipid Profile">Lipid Profile</option>
              </select>

              <Label htmlFor="booking_calendar">Preferred Date & Time</Label>
              <Calendar
                classNames={{ day: 'text-sm px-2 py-1' }}
                min={new Date()}
                selected={new Date(bookingForm.preferred_date)}
                onSelect={(date) => setBookingForm({...bookingForm, preferred_date: date.toISOString().split('T')[0]})}
              />

              <Button 
                onClick={handleBooking}
                className="w-full bg-green-500 text-white hover:bg-green-700"
                disabled={!selectedLab || !bookingForm.customer_name || !bookingForm.contact_phone || !bookingForm.address || !bookingForm.service_type || !bookingForm.preferred_date}
              >
                Book Home Visit
              </Button>

              {/* Additional logic to handle email here */}
              {async function sendConfirmationEmail() {
                const emailResponse = await fetch('/api/send-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    to: bookingForm.contact_email,
                    subject: 'Booking Confirmation',
                    text: `Dear ${bookingForm.customer_name}, your booking is confirmed with ${selectedLab?.business_name} on ${bookingForm.preferred_date}`
                  })
                });
                if (emailResponse.ok) {
                  toast.success('Confirmation email sent!');
                } else {
                  console.error('Failed to send email.');
                  toast.error('Failed to send confirmation email.');
                }
              }}

              {handleBooking().then(sendConfirmationEmail)}
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <FlaskConical className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a laboratory from the list to book a home visit</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabBooking;