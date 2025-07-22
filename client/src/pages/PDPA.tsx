import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, CheckCircle, AlertTriangle, Book } from 'lucide-react';
import { Link } from 'react-router-dom';

const PDPA: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-slate via-medical-mint to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-medical-blue" />
              <div>
                <h1 className="text-2xl font-bold text-medical-blue">
                  Sri Lanka's PDPA Compliance
                </h1>
                <p className="text-sm text-muted-foreground">Personal Data Protection Act</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-[#00bfff] to-green-500 bg-clip-text text-transparent">
                <Book className="h-6 w-6 text-medical-blue" />
                About Sri Lanka's Personal Data Protection Act (PDPA)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Personal Data Protection Act No. 9 of 2022 is Sri Lanka's comprehensive data protection law 
                that regulates the processing of personal data and protects the privacy rights of individuals.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">What is Personal Data?</h4>
                <p className="text-blue-800 text-sm">
                  Personal data includes any information relating to an identified or identifiable natural person, 
                  including names, addresses, phone numbers, email addresses, medical information, and online identifiers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* DigiFarmacy Compliance */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-[#00bfff] to-green-500 bg-clip-text text-transparent">
                <CheckCircle className="h-6 w-6 text-green-600" />
                How DigiFarmacy Ensures PDPA Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-medical-blue">Data Collection</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Clear consent obtained before data collection
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Minimal data collection - only what's necessary
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Transparent privacy notices provided
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Purpose limitation - data used only for stated purposes
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-medical-blue">Data Security</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      End-to-end encryption for all data transmission
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Secure cloud storage with access controls
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Regular security audits and updates
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Staff training on data protection protocols
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-[#00bfff] to-green-500 bg-clip-text text-transparent">
                <Shield className="h-6 w-6 text-medical-green" />
                Your Rights Under PDPA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-medical-blue">
                    <h5 className="font-medium">Right to Access</h5>
                    <p className="text-sm text-muted-foreground">
                      Request information about what personal data we hold about you
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-medical-green">
                    <h5 className="font-medium">Right to Rectification</h5>
                    <p className="text-sm text-muted-foreground">
                      Request correction of inaccurate or incomplete data
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-medical-teal">
                    <h5 className="font-medium">Right to Erasure</h5>
                    <p className="text-sm text-muted-foreground">
                      Request deletion of your personal data under certain conditions
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-purple-500">
                    <h5 className="font-medium">Right to Portability</h5>
                    <p className="text-sm text-muted-foreground">
                      Request transfer of your data to another service provider
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-orange-500">
                    <h5 className="font-medium">Right to Object</h5>
                    <p className="text-sm text-muted-foreground">
                      Object to processing of your data for specific purposes
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-red-500">
                    <h5 className="font-medium">Right to Withdraw Consent</h5>
                    <p className="text-sm text-muted-foreground">
                      Withdraw your consent for data processing at any time
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Processing Activities */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-[#00bfff] to-green-500 bg-clip-text text-transparent">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                How We Process Your Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Health Data Processing</h4>
                <p className="text-orange-800 text-sm mb-3">
                  As a healthcare-related platform, we process sensitive health information with extra care:
                </p>
                <ul className="space-y-1 text-sm text-orange-800">
                  <li>• Prescription image analysis for medication identification</li>
                  <li>• Health condition matching for pharmacy recommendations</li>
                  <li>• Anonymous aggregated data for improving AI models</li>
                  <li>• Communication with healthcare providers when authorized</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-medical-blue/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-medical-blue" />
                  </div>
                  <h5 className="font-medium mb-1">Lawful Basis</h5>
                  <p className="text-xs text-muted-foreground">Consent & Legitimate Interest</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-medical-green/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-medical-green" />
                  </div>
                  <h5 className="font-medium mb-1">Data Retention</h5>
                  <p className="text-xs text-muted-foreground">Only as long as necessary</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-medical-teal/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Book className="h-6 w-6 text-medical-teal" />
                  </div>
                  <h5 className="font-medium mb-1">Audit Trail</h5>
                  <p className="text-xs text-muted-foreground">Complete processing logs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-[#00bfff] to-green-500 bg-clip-text text-transparent">Data Protection Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="font-medium">For any data protection concerns or to exercise your rights:</p>
                <p className="text-sm text-muted-foreground">Email: info@dpa.gov.lk</p>
                <p className="text-sm text-muted-foreground">Phone: +94 11 269 7241, +94 11 269 7237</p>
                <p className="text-sm text-muted-foreground">Address: Data Protection Officer, First Floor; Block 5, Data Protection Authority, BMICH, Colombo 07, Sri Lanka</p>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You also have the right to lodge a complaint with the 
                  Personal Data Protection Authority of Sri Lanka if you believe your data 
                  protection rights have been violated.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back to Registration */}
          <div className="text-center py-6">
            <Link to="/">
              <Button className="bg-gradient-to-r from-[#00bfff] to-green-500 text-white">
                Back to DigiFarmacy
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PDPA;