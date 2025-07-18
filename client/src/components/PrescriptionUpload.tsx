
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrescriptionUploadProps {
  onDrugExtracted: (drugName: string) => void;
}

interface ExtractedMedication {
  name: string;
  dosage: string;
  frequency: string;
  confidence: number;
}

const PrescriptionUpload = ({ onDrugExtracted }: PrescriptionUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedMeds, setExtractedMeds] = useState<ExtractedMedication[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock OCR extraction - in real app, this would call Google Vision API or similar
  const mockOCRExtraction = (): ExtractedMedication[] => {
    const sampleMeds = [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", confidence: 0.95 },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", confidence: 0.88 },
      { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", confidence: 0.92 }
    ];
    
    // Return 1-3 random medications
    const count = Math.floor(Math.random() * 3) + 1;
    return sampleMeds.slice(0, count);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const extracted = mockOCRExtraction();
      setExtractedMeds(extracted);
      
      toast({
        title: "Prescription processed!",
        description: `Extracted ${extracted.length} medication(s) from your prescription.`,
      });
      
      // Auto-select first medication for drug info
      if (extracted.length > 0) {
        onDrugExtracted(extracted[0].name);
      }
      
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to extract information from the prescription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    toast({
      title: "Camera feature",
      description: "Camera capture would be available in the mobile app version.",
    });
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setExtractedMeds([]);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-medical-blue" />
            Upload Prescription
          </CardTitle>
          <CardDescription>
            Take a photo or upload an image of your prescription for automatic medication extraction
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-medical-blue/30 rounded-lg p-8 text-center hover:border-medical-blue/50 transition-colors">
                <div className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="medical-gradient text-white"
                      size="lg"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Image
                    </Button>
                    
                    <Button
                      onClick={handleCameraCapture}
                      variant="outline"
                      size="lg"
                      className="border-medical-teal text-medical-teal hover:bg-medical-teal/10"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JPG, PNG, PDF • Max size: 10MB
                  </p>
                </div>
              </div>
              
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Prescription preview"
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <Button
                    onClick={clearUpload}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    ✕
                  </Button>
                </div>
              )}
              
              {/* Processing Status */}
              {isUploading && (
                <div className="text-center py-4">
                  <div className="animate-pulse-glow inline-flex items-center gap-2 px-4 py-2 bg-medical-blue/10 rounded-full">
                    <div className="w-2 h-2 bg-medical-blue rounded-full animate-pulse"></div>
                    <span className="text-medical-blue font-medium">Processing prescription...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extracted Medications */}
      {extractedMeds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-medical-green" />
              Extracted Medications
            </CardTitle>
            <CardDescription>
              Review the medications detected in your prescription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {extractedMeds.map((med, index) => (
                <Card key={index} className="border-l-4 border-l-medical-green">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg">{med.name}</h4>
                          <Badge 
                            variant="secondary" 
                            className={`${
                              med.confidence > 0.9 
                                ? 'bg-medical-green/10 text-medical-green' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {Math.round(med.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">Dosage:</span>
                            <p className="font-medium">{med.dosage}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Frequency:</span>
                            <p className="font-medium">{med.frequency}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => onDrugExtracted(med.name)}
                        size="sm"
                        className="bg-medical-teal/10 text-medical-teal hover:bg-medical-teal/20"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {extractedMeds.some(med => med.confidence < 0.9) && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Please verify extracted information</p>
                    <p className="text-yellow-700">
                      Some medications were extracted with lower confidence. Please double-check the details.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrescriptionUpload;
