
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-slate via-medical-mint to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-medical-blue hover:text-medical-blue/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto shadow-blue-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#00bfff] to-green-500 bg-clip-text text-transparent">
              Contact Support
            </CardTitle>
            <p className="text-muted-foreground">Get in touch with our team for assistance</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-medical-blue">
                    <Mail className="h-5 w-5" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-2">For general inquiries and support:</p>
                  <a 
                    href="mailto:support@farmafinder.lk" 
                    className="text-medical-blue hover:text-medical-blue/80 font-medium"
                  >
                    support@farmafinder.lk
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-medical-blue">
                    <Phone className="h-5 w-5" />
                    Phone Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-2">Call us for immediate assistance:</p>
                  <a 
                    href="tel:+941112345670" 
                    className="text-medical-blue hover:text-medical-blue/80 font-medium"
                  >
                    +94 11 123 4567
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-medical-blue">
                    <MapPin className="h-5 w-5" />
                    Visit Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Hanyu Pharmacy<br />
                    Puttalam 61300<br />
                    Sri Lanka
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-medical-blue">
                    <Clock className="h-5 w-5" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Monday - Friday: 8:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 5:00 PM<br />
                    Sunday: 10:00 AM - 4:00 PM
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Frequently Asked Questions</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-blue-700">How do I upload a prescription?</p>
                  <p className="text-blue-600">Use the Smart Scan feature on the main page to upload and analyze your prescription.</p>
                </div>
                <div>
                  <p className="font-medium text-blue-700">Are there any fees for using FarmaFinder?</p>
                  <p className="text-blue-600">FarmaFinder is free to use. Individual pharmacies may charge collection or delivery fees.</p>
                </div>
                <div>
                  <p className="font-medium text-blue-700">How do I find nearby pharmacies?</p>
                  <p className="text-blue-600">Use the Map feature to locate verified pharmacies in your area across Sri Lanka.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
