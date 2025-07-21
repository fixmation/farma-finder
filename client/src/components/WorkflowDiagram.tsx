import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Upload, Bell, Pill, Search, FileCheck, ArrowRight, ArrowDown, CheckCircle } from 'lucide-react';

const WorkflowDiagram: React.FC = () => {
  const workflowSteps = [
    {
      id: 1,
      title: "Find Nearest Pharmacy",
      description: "Use location picker to find registered pharmacies",
      icon: <MapPin className="h-6 w-6 text-blue-600" />,
      action: "Search by location or browse map",
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: 2,
      title: "Select Preferred Pharmacy",
      description: "Choose from map view or list with ratings",
      icon: <Search className="h-6 w-6 text-green-600" />,
      action: "View details, contact info, and reviews",
      color: "bg-green-50 border-green-200"
    },
    {
      id: 3,
      title: "Prescription Upload & Validation",
      description: "Upload with doctor verification requirements",
      icon: <FileCheck className="h-6 w-6 text-purple-600" />,
      action: "Verify MBBS, rubber stamp, SLMC registration",
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: 4,
      title: "AI Prescription Analysis",
      description: "Extract medications using Gemini AI",
      icon: <Pill className="h-6 w-6 text-orange-600" />,
      action: "Automatic medicine identification and analysis",
      color: "bg-orange-50 border-orange-200"
    },
    {
      id: 5,
      title: "Pharmacy Notification",
      description: "Get notified for collection or delivery",
      icon: <Bell className="h-6 w-6 text-red-600" />,
      action: "SMS/call within 24 hours with price quote",
      color: "bg-red-50 border-red-200"
    },
    {
      id: 6,
      title: "Medicine Collection/Delivery",
      description: "Pick up or receive home delivery",
      icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
      action: "Pay and receive medicines with receipt",
      color: "bg-emerald-50 border-emerald-200"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            DigiFarmacy Workflow
          </CardTitle>
          <CardDescription className="text-lg">
            Complete patient journey from pharmacy discovery to medicine delivery
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            {/* Workflow Step Card */}
            <Card className={`w-full ${step.color} border-2`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.id}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 mb-2">{step.description}</p>
                    <p className="text-sm text-gray-600 italic">
                      Action: {step.action}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Arrow connector */}
            {index < workflowSteps.length - 1 && (
              <div className="flex flex-col items-center py-3">
                <ArrowDown className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Alternative Flow Paths */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Laboratory Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-3">
              Alternative workflow for laboratory bookings and home visits
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-blue-600" />
                <span>Search laboratory locations</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-blue-600" />
                <span>Book home visit or walk-in</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-blue-600" />
                <span>Receive test results</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="h-5 w-5 text-purple-600" />
              Drug Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-3">
              Direct drug lookup from NMRA database without prescription
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-purple-600" />
                <span>Search 4,921+ NMRA medicines</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-purple-600" />
                <span>View detailed drug information</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-purple-600" />
                <span>Check availability at pharmacies</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Benefits */}
      <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg text-center">
            Why Choose DigiFarmacy?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold">Verified Pharmacies</h4>
              <p className="text-gray-600">Only NMRA registered pharmacies and medicines</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold">AI-Powered Analysis</h4>
              <p className="text-gray-600">Google Gemini AI for accurate prescription reading</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold">Secure & PDPA Compliant</h4>
              <p className="text-gray-600">Doctor verification and data protection standards</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowDiagram;