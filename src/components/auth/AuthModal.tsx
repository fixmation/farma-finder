
import React, { useState } from 'react';
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
    address: ''
  });

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
          address: signUpData.address
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
          <DialogTitle>Welcome to FarmaFinder</DialogTitle>
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
              <Button type="submit" className="w-full" disabled={loading}>
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
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="e.g., No. 123, Main Street, Colombo 07"
                      value={signUpData.address}
                      onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                      required
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

              <Button type="submit" className="w-full" disabled={loading || !pdpaConsent}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
