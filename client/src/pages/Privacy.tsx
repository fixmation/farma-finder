import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageLayout from '@/components/PageLayout';

const Privacy = () => {
  return (
    <PageLayout title="Privacy Policy">
      <div className="bg-gradient-to-br from-white to-[#7aebcf]/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#7aebcf] to-blue-500 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy and data protection are our highest priorities
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Name, email address, and phone number</li>
                  <li>• Location data for pharmacy recommendations</li>
                  <li>• Prescription images and medical information</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage Information</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• App usage patterns and preferences</li>
                  <li>• Search queries and interaction data</li>
                  <li>• Device information and IP address</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#7aebcf] rounded-full mt-2 flex-shrink-0"></div>
                  Provide personalized pharmacy and laboratory recommendations
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#7aebcf] rounded-full mt-2 flex-shrink-0"></div>
                  Process prescription analysis and medication information
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#7aebcf] rounded-full mt-2 flex-shrink-0"></div>
                  Improve our AI algorithms and service quality
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#7aebcf] rounded-full mt-2 flex-shrink-0"></div>
                  Send important notifications about your bookings and prescriptions
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#7aebcf] rounded-full mt-2 flex-shrink-0"></div>
                  Comply with healthcare regulations and legal requirements
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Encryption & Storage</h4>
                <p className="text-sm text-gray-600">
                  All personal and medical data is encrypted both in transit and at rest using industry-standard encryption protocols. 
                  Your prescription images are stored securely and automatically deleted after 30 days.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Access Controls</h4>
                <p className="text-sm text-gray-600">
                  Only authorized personnel have access to your data, and all access is logged and monitored. 
                  We use multi-factor authentication and regular security audits to protect your information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Your Rights & Choices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Access & Portability</h4>
                  <p className="text-sm text-gray-600">
                    Request a copy of your personal data and download your information at any time.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Correction & Updates</h4>
                  <p className="text-sm text-gray-600">
                    Update or correct your personal information through your account settings.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Deletion</h4>
                  <p className="text-sm text-gray-600">
                    Request deletion of your account and all associated data permanently.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Opt-out Options</h4>
                  <p className="text-sm text-gray-600">
                    Control communication preferences and data processing activities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third Parties */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                We work with trusted partners to provide our services:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Mapbox:</strong> Location services and pharmacy mapping</li>
                <li>• <strong>Cloud Storage:</strong> Secure prescription image storage</li>
                <li>• <strong>AI Services:</strong> Prescription analysis and drug information</li>
                <li>• <strong>Payment Processors:</strong> Secure transaction processing</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                All third-party services are required to maintain the same level of data protection 
                and are bound by strict confidentiality agreements.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or your data:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@farmafinder.lk</p>
                <p><strong>Phone:</strong> +94 11 123 4567</p>
                <p><strong>Address:</strong> Hanyu Pharmacy, Puttalam 61300, Sri Lanka</p>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="text-center text-sm text-gray-500 pt-8 border-t">
            Last updated: January 20, 2025
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Privacy;