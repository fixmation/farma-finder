import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, FileCheck, Upload, CheckCircle, XCircle } from 'lucide-react';
import { validatePrescription, type PrescriptionValidation } from '@/utils/prescriptionValidator';
import { toast } from 'sonner';

interface PrescriptionValidatorProps {
  onValidPrescription: (file: File, validation: PrescriptionValidation) => void;
  title?: string;
  description?: string;
}

const PrescriptionValidator: React.FC<PrescriptionValidatorProps> = ({ 
  onValidPrescription, 
  title = "Upload Prescription",
  description = "Please ensure prescription meets all requirements"
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [doctorName, setDoctorName] = useState('');
  const [doctorQualification, setDoctorQualification] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [hasRubberStamp, setHasRubberStamp] = useState(false);
  const [validation, setValidation] = useState<PrescriptionValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValidation(null);
    }
  };

  const validateAndSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a prescription file');
      return;
    }

    setIsValidating(true);

    try {
      const validationResult = validatePrescription(
        selectedFile,
        doctorName,
        doctorQualification,
        hasRubberStamp,
        registrationNumber
      );

      setValidation(validationResult);

      if (validationResult.isValid) {
        toast.success('Prescription validation successful');
        onValidPrescription(selectedFile, validationResult);
      } else {
        toast.error('Prescription validation failed');
      }
    } catch (error) {
      toast.error('Error validating prescription');
    } finally {
      setIsValidating(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDoctorName('');
    setDoctorQualification('');
    setRegistrationNumber('');
    setHasRubberStamp(false);
    setValidation(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Requirements Notice */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Prescription Requirements:</strong>
            <ul className="list-disc list-inside mt-2 text-sm space-y-1">
              <li>Must contain doctor's full name and MBBS/MD qualification</li>
              <li>Doctor's rubber stamp/seal clearly visible</li>
              <li>Valid SLMC registration number</li>
              <li>Clear prescription details and patient information</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="prescription-file">Prescription Document</Label>
          <Input
            id="prescription-file"
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          {selectedFile && (
            <div className="text-sm text-gray-600">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        {/* Doctor Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="doctor-name">Doctor's Full Name</Label>
            <Input
              id="doctor-name"
              placeholder="Dr. John Doe"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-qualification">Medical Qualification</Label>
            <Input
              id="doctor-qualification"
              placeholder="MBBS, MD, MS, etc."
              value={doctorQualification}
              onChange={(e) => setDoctorQualification(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="registration-number">SLMC Registration Number</Label>
          <Input
            id="registration-number"
            placeholder="e.g., SLMC 12345"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            required
          />
        </div>

        {/* Rubber Stamp Confirmation */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rubber-stamp"
            checked={hasRubberStamp}
            onCheckedChange={(checked) => setHasRubberStamp(checked as boolean)}
          />
          <Label htmlFor="rubber-stamp" className="text-sm font-medium">
            Prescription contains doctor's rubber stamp/official seal
          </Label>
        </div>

        {/* Validation Results */}
        {validation && (
          <div className="space-y-3">
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              validation.isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {validation.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">
                {validation.isValid ? 'Prescription Valid' : 'Validation Failed'}
              </span>
            </div>

            {validation.errors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Errors:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {validation.errors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {validation.warnings.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warnings:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={validateAndSubmit}
            disabled={!selectedFile || isValidating}
            className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            {isValidating ? (
              <>
                <FileCheck className="h-4 w-4 mr-2 animate-pulse" />
                Validating...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Validate & Submit
              </>
            )}
          </Button>
          
          <Button
            onClick={resetForm}
            variant="outline"
            disabled={isValidating}
          >
            Reset
          </Button>
        </div>

        {/* Upload Guidelines */}
        <div className="text-xs text-gray-500 border-t pt-4">
          <p><strong>File Requirements:</strong> JPEG, PNG, WEBP, or PDF files up to 10MB</p>
          <p><strong>Quality:</strong> Ensure clear, readable text and visible rubber stamp</p>
          <p><strong>Privacy:</strong> Personal information is processed securely and not stored</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrescriptionValidator;