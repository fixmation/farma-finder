
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera, FileText, AlertTriangle, CheckCircle, MapPin, Shield } from 'lucide-react';
import { toast } from 'sonner';
import PrescriptionValidator from './PrescriptionValidator';
import { type PrescriptionValidation } from '@/utils/prescriptionValidator';

interface Pharmacy {
  id: string;
  business_name: string;
  address: string;
  contact_phone?: string;
}

export const EnhancedPrescriptionUpload: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>('');
  const [validatedPrescription, setValidatedPrescription] = useState<{ file: File; validation: PrescriptionValidation } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showCommissionNotice, setShowCommissionNotice] = useState(false);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const response = await fetch('/api/pharmacies');
      if (!response.ok) {
        throw new Error('Failed to fetch pharmacies');
      }
      const data = await response.json();
      setPharmacies(data);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      toast.error('Failed to load pharmacies');
    }
  };

  const handleValidPrescription = (file: File, validation: PrescriptionValidation) => {
    setValidatedPrescription({ file, validation });
    setShowCommissionNotice(true);
  };

  const uploadPrescription = async () => {
    if (!validatedPrescription || !selectedPharmacy) {
      toast.error('Please validate prescription and select pharmacy');
      return;
    }

    setUploading(true);
    
    try {
      // Create FormData for file upload with validation data
      const formData = new FormData();
      formData.append('file', validatedPrescription.file);
      formData.append('pharmacy_id', selectedPharmacy);
      formData.append('validation_data', JSON.stringify(validatedPrescription.validation));

      // Upload to server
      const response = await fetch('/api/prescriptions/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload prescription');
      }

      const result = await response.json();
      
      setUploadSuccess(true);
      toast.success('Prescription uploaded successfully! Commission processed automatically.');
      
      // Reset form
      setSelectedFile(null);
      setSelectedPharmacy('');
      setShowCommissionNotice(false);
      const fileInput = document.getElementById('prescription-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error uploading prescription:', error);
      toast.error('Failed to upload prescription. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const takePhoto = () => {
    const fileInput = document.getElementById('prescription-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.setAttribute('capture', 'camera');
      fileInput.click();
    }
  };

  const selectedPharmacyData = pharmacies.find(p => p.id === selectedPharmacy);

  return (
    <div className="p-4 md:p-6 max-w-none space-y-6">
      <Card className="glass-card shadow-blue-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Enhanced Prescription Upload
          </CardTitle>
          <CardDescription>
            Upload your prescription to a verified pharmacy for AI analysis and medicine orders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Fee Notice */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Service Fee Notice:</strong> By uploading your prescription to a pharmacy, 
              you may be charged LKR 100 or more for collection or delivery services.
            </AlertDescription>
          </Alert>

          {uploadSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Prescription uploaded successfully! The pharmacy will contact you within 24 hours.
                Commission has been processed automatically.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pharmacy Selection */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="pharmacy-select">Select Pharmacy</Label>
                <Select value={selectedPharmacy} onValueChange={setSelectedPharmacy}>
                  <SelectTrigger id="pharmacy-select">
                    <SelectValue placeholder="Choose a verified pharmacy" />
                  </SelectTrigger>
                  <SelectContent>
                    {pharmacies.length === 0 ? (
                      <SelectItem value="no-pharmacy" disabled>
                        No Pharmacy Found
                      </SelectItem>
                    ) : (
                      pharmacies.map((pharmacy) => (
                        <SelectItem key={pharmacy.id} value={pharmacy.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{pharmacy.business_name}</span>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {pharmacy.address.substring(0, 50)}...
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {selectedPharmacyData && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">{selectedPharmacyData.business_name}</p>
                    <p className="text-sm text-blue-700">{selectedPharmacyData.address}</p>
                    {selectedPharmacyData.contact_phone && (
                      <p className="text-sm text-blue-600">📞 {selectedPharmacyData.contact_phone}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Prescription Validation */}
            <div className="space-y-4">
              <PrescriptionValidator
                onValidPrescription={handleValidPrescription}
                title="Prescription Upload with Validation"
                description="Upload prescription with doctor verification"
              />
              
              {validatedPrescription && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-900">Validated Prescription</p>
                  </div>
                  <p className="text-sm text-green-700">{validatedPrescription.file.name}</p>
                  <p className="text-xs text-green-600">
                    Size: {(validatedPrescription.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Commission Notice */}
          {showCommissionNotice && selectedPharmacy && (
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Commission Information:</strong> A service commission of LKR 100 will be automatically 
                processed to support platform operations (70% to Hanyu Pharmacy, 30% to Developer). 
                This enables us to maintain quality service and support.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={uploadPrescription}
              disabled={!validatedPrescription || !selectedPharmacy || uploading}
              className="flex-1 bg-gradient-to-r from-[#00bfff] to-green-500 hover:from-[#0099cc] hover:to-green-600 text-white border-none shadow-lg"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Prescription'}
            </Button>
            
            <Button
              onClick={takePhoto}
              variant="outline"
              className="flex-1 bg-gradient-to-r from-green-500/20 to-[#00bfff]/20 hover:from-green-500/40 hover:to-[#00bfff]/40 border border-green-300"
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
          </div>

          {/* Guidelines */}
          <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
            <h4 className="font-semibold text-sm">Upload Guidelines:</h4>
            <p>• Ensure prescription is clearly visible and readable</p>
            <p>• Include doctor's signature and date</p>
            <p>• Make sure all medication names are legible</p>
            <p>• Check that the prescription is not expired</p>
            <p>• Commission of LKR 100 will be processed automatically</p>
            <p>• The pharmacy will contact you within 24 hours</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Add default export
export default EnhancedPrescriptionUpload;
