import React, { useState } from 'react';
import { Camera, Upload, Scan, AlertCircle, Shield, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageLayout from '@/components/PageLayout';
import PrescriptionValidator from '@/components/PrescriptionValidator';
import { type PrescriptionValidation } from '@/utils/prescriptionValidator';

const PrescriptionScanner = () => {
  const [validatedPrescription, setValidatedPrescription] = useState<{ file: File; validation: PrescriptionValidation } | null>(null);

  const handleValidPrescription = (file: File, validation: PrescriptionValidation) => {
    setValidatedPrescription({ file, validation });
  };
  return (
    <PageLayout title="AI Prescription Scanner">
      <div className="min-h-screen bg-gradient-to-br from-white to-[#7aebcf]/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#7aebcf] to-blue-500 rounded-full mb-4">
            <Scan className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Prescription Scanner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your prescription and get instant medication analysis with pharmacy availability
          </p>
          </div>

          {/* Prescription Validation Section */}
          <div className="max-w-4xl mx-auto mb-8">
            <PrescriptionValidator
              onValidPrescription={handleValidPrescription}
              title="AI Prescription Scanner with Validation"
              description="Upload prescription with doctor verification for AI analysis"
            />
          </div>

          {validatedPrescription && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-green-600" />
                  Validated Prescription - Ready for Analysis
                </CardTitle>
                <CardDescription>
                  Prescription has been validated and is ready for AI scanning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-green-800 font-medium">✓ Prescription meets all requirements</p>
                  <p className="text-green-600 text-sm">File: {validatedPrescription.file.name}</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500">
                  <Scan className="h-4 w-4 mr-2" />
                  Analyze with AI Scanner
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scan className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-600">
                  Advanced OCR technology extracts medication details accurately
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Safety Checks</h3>
                <p className="text-sm text-gray-600">
                  Automatic drug interaction and dosage verification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Instant Results</h3>
                <p className="text-sm text-gray-600">
                  Get medication list and pharmacy recommendations in seconds
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#7aebcf] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Prepare Your Prescription</h4>
                    <p className="text-sm text-gray-600">Ensure the prescription is clearly visible with good lighting</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#7aebcf] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Upload or Capture</h4>
                    <p className="text-sm text-gray-600">Take a photo or upload an existing image of your prescription</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#7aebcf] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Review Results</h4>
                    <p className="text-sm text-gray-600">Check the extracted medications and find nearby pharmacies</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrescriptionScanner;