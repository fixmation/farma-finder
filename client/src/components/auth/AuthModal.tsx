import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from './AuthProvider';
import { UserPlus, LogIn, Building2, User, FlaskConical } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signUp, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pdpaConsent, setPdpaConsent] = useState(false);

  // Sign In Form
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign Up Form
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role: 'customer' as 'customer' | 'pharmacy' | 'laboratory',
    language: 'en' as 'en' | 'si' | 'ta',
    // Pharmacy/Laboratory specific fields
    businessName: '',
    registrationNumber: '',
    addressLine1: '',
    city: '',
    district: '',
    province: ''
  });

  const [districts, setDistricts] = useState([
    { id: 1, name: 'Colombo' },
    { id: 2, name: 'Gampaha' },
    { id: 3, name: 'Kalutara' },
    { id: 4, name: 'Kandy' },
    { id: 5, name: 'Matale' },
    { id: 6, name: 'Nuwara Eliya' },
    { id: 7, name: 'Galle' },
    { id: 8, name: 'Matara' },
    { id: 9, name: 'Hambantota' },
    { id: 10, name: 'Jaffna' },
    { id: 11, name: 'Kilinochchi' },
    { id: 12, name: 'Mannar' },
    { id: 13, name: 'Vavuniya' },
    { id: 14, name: 'Mullaitivu' },
    { id: 15, name: 'Batticaloa' },
    { id: 16, name: 'Ampara' },
    { id: 17, name: 'Trincomalee' },
    { id: 18, name: 'Kurunegala' },
    { id: 19, name: 'Puttalam' },
    { id: 20, name: 'Anuradhapura' },
    { id: 21, name: 'Polonnaruwa' },
    { id: 22, name: 'Badulla' },
    { id: 23, name: 'Monaragala' },
    { id: 24, name: 'Ratnapura' },
    { id: 25, name: 'Kegalle' }
  ]); // Mock data

  const handleDistrictChange = (districtName: string) => {
    setSignUpData({ ...signUpData, district: districtName, province: getProvinceByDistrict(districtName) });
  };

  const getProvinceByDistrict = (district: string) => {
    // Mock function - replace with actual data fetching logic
    switch (district) {
      case 'Colombo':
      case 'Gampaha':
      case 'Kalutara':
        return 'Western Province';
      case 'Kandy':
      case 'Matale':
      case 'Nuwara Eliya':
        return 'Central Province';
      case 'Galle':
      case 'Matara':
      case 'Hambantota':
        return 'Southern Province';
      case 'Jaffna':
      case 'Kilinochchi':
      case 'Mannar':
      case 'Vavuniya':
      case 'Mullaitivu':
        return 'Northern Province';
      case 'Batticaloa':
      case 'Ampara':
      case 'Trincomalee':
        return 'Eastern Province';
      case 'Kurunegala':
      case 'Puttalam':
        return 'North Western Province';
      case 'Anuradhapura':
      case 'Polonnaruwa':
        return 'North Central Province';
      case 'Badulla':
      case 'Monaragala':
        return 'Uva Province';
      case 'Ratnapura':
      case 'Kegalle':
        return 'Sabaragamuwa Province';
      default:
        return '';
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(signInData.email, signInData.password);
      onClose();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdpaConsent) {
      alert('Please accept the PDPA consent to continue.');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        full_name: signUpData.fullName,
        role: signUpData.role,
        phone: signUpData.phone,
        preferred_language: signUpData.language,
        // Include business data if role is pharmacy or laboratory
        ...((signUpData.role === 'pharmacy' || signUpData.role === 'laboratory') && {
          business_name: signUpData.businessName,
          registration_number: signUpData.registrationNumber,
          address_line1: signUpData.addressLine1,
          city: signUpData.city,
          district: signUpData.district,
          province: signUpData.province
        })
      };

      await signUp(signUpData.email, signUpData.password, userData);
      onClose();
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto shadow-blue-xl">
        <DialogHeader>
          <DialogTitle>Welcome to DigiFarmacy</DialogTitle>
          <DialogDescription>
            Sign in or create your account to access all features
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup">
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname">Full Name</Label>
                  <Input
                    id="signup-fullname"
                    value={signUpData.fullName}
                    onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone</Label>
                  <Input
                    id="signup-phone"
                    placeholder="e.g., +94 77 123 4567"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-language">Language</Label>
                  <Select value={signUpData.language} onValueChange={(value: 'en' | 'si' | 'ta') => setSignUpData({ ...signUpData, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="si">සිංහල</SelectItem>
                      <SelectItem value="ta">தமிழ்</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Account Type</Label>
                <Select value={signUpData.role} onValueChange={(value: 'customer' | 'pharmacy' | 'laboratory') => setSignUpData({ ...signUpData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Customer
                      </div>
                    </SelectItem>
                    <SelectItem value="pharmacy">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        Pharmacy
                      </div>
                    </SelectItem>
                    <SelectItem value="laboratory">
                      <div className="flex items-center">
                        <FlaskConical className="h-4 w-4 mr-2" />
                        Laboratory
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(signUpData.role === 'pharmacy' || signUpData.role === 'laboratory') && (
                <div className="space-y-4 p-4 border rounded-lg bg-blue-50 shadow-blue-sm">
                  <h4 className="font-medium text-blue-900">
                    {signUpData.role === 'pharmacy' ? 'Pharmacy Information' : 'Laboratory Information'}
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input
                      id="business-name"
                      placeholder={signUpData.role === 'pharmacy' ? 'e.g., Wellness Pharmacy Pvt Ltd' : 'e.g., MediLab Diagnostics Pvt Ltd'}
                      value={signUpData.businessName}
                      onChange={(e) => setSignUpData({ ...signUpData, businessName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration-number">
                      {signUpData.role === 'pharmacy' ? 'Pharmacy Registration Number' : 'SLMC Registration Number'}
                    </Label>
                    <Input
                      id="registration-number"
                      placeholder={signUpData.role === 'pharmacy' ? 'e.g., PH/WP/2023/001' : 'e.g., SLMC/LAB/2023/001'}
                      value={signUpData.registrationNumber}
                      onChange={(e) => setSignUpData({ ...signUpData, registrationNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">First Line of Address</Label>
                    <Input
                      id="addressLine1"
                      placeholder="e.g., No. 123, Main Street"
                      value={signUpData.addressLine1}
                      onChange={(e) => setSignUpData({ ...signUpData, addressLine1: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Town/City</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Colombo 07"
                      value={signUpData.city}
                      onChange={(e) => setSignUpData({ ...signUpData, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Select value={signUpData.district} onValueChange={(value) => handleDistrictChange(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.name}>{district.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      value={signUpData.province}
                      readOnly
                    />
                  </div>
                  <p className="text-sm text-blue-700">
                    Note: You'll need to upload certificates after registration for verification.
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pdpa-consent"
                  checked={pdpaConsent}
                  onCheckedChange={(checked) => setPdpaConsent(checked as boolean)}
                />
                <Label htmlFor="pdpa-consent" className="text-sm">
                  I agree to the processing of my personal data in accordance with{' '}
                  <a 
                    href="/pdpa" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Sri Lanka's PDPA
                  </a>
                </Label>
              </div>

              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white" disabled={loading || !pdpaConsent}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};