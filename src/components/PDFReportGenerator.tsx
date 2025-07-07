
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, AlertTriangle, TrendingUp, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  confidence: number;
  isStandardDose: boolean;
  warnings: string[];
}

interface ReportData {
  medications: Medication[];
  analysisDate: Date;
  patientInfo?: {
    name?: string;
    age?: number;
    conditions?: string[];
  };
}

interface PDFReportGeneratorProps {
  reportData: ReportData;
  onClose: () => void;
}

const PDFReportGenerator = ({ reportData, onClose }: PDFReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const { toast } = useToast();

  const generateWarningsChart = () => {
    const totalMeds = reportData.medications.length;
    const warningMeds = reportData.medications.filter(med => med.warnings.length > 0).length;
    const standardDoseMeds = reportData.medications.filter(med => med.isStandardDose).length;
    
    return {
      totalMedications: totalMeds,
      medicationsWithWarnings: warningMeds,
      standardDoseMedications: standardDoseMeds,
      warningPercentage: totalMeds > 0 ? Math.round((warningMeds / totalMeds) * 100) : 0,
      standardDosePercentage: totalMeds > 0 ? Math.round((standardDoseMeds / totalMeds) * 100) : 0
    };
  };

  const generatePDFReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would use jsPDF and html2canvas
      const reportContent = generateReportContent();
      
      // Mock PDF download
      const blob = new Blob([reportContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setReportGenerated(true);
      toast({
        title: "Report generated successfully",
        description: "Your prescription analysis report has been downloaded."
      });
      
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReportContent = () => {
    const stats = generateWarningsChart();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription Analysis Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .medication { border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px; }
          .warning { background-color: #fff3cd; border-color: #ffeaa7; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat-item { text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Prescription Analysis Report</h1>
          <p>Generated on: ${reportData.analysisDate.toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <h2>Summary Statistics</h2>
          <div class="stats">
            <div class="stat-item">
              <h3>${stats.totalMedications}</h3>
              <p>Total Medications</p>
            </div>
            <div class="stat-item">
              <h3>${stats.medicationsWithWarnings}</h3>
              <p>With Warnings</p>
            </div>
            <div class="stat-item">
              <h3>${stats.standardDosePercentage}%</h3>
              <p>Standard Dosage</p>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Medications Detected</h2>
          ${reportData.medications.map(med => `
            <div class="medication ${med.warnings.length > 0 ? 'warning' : ''}">
              <h3>${med.name}</h3>
              <p><strong>Dosage:</strong> ${med.dosage}</p>
              <p><strong>Frequency:</strong> ${med.frequency}</p>
              <p><strong>Confidence:</strong> ${Math.round(med.confidence * 100)}%</p>
              ${med.warnings.length > 0 ? `
                <div style="margin-top: 10px;">
                  <strong>Warnings:</strong>
                  <ul>
                    ${med.warnings.map(warning => `<li>${warning}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>Recommendations</h2>
          <ul>
            <li>Verify all medications with your healthcare provider</li>
            <li>Review dosage warnings before taking any medication</li>
            <li>Keep this report for your medical records</li>
            <li>Contact your pharmacist for any clarifications</li>
          </ul>
        </div>
      </body>
      </html>
    `;
  };

  const stats = generateWarningsChart();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-medical-blue" />
            Interactive PDF Report
          </CardTitle>
          <CardDescription>
            Generate a comprehensive analysis report with charts and warnings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-4">Report Preview</h3>
            
            {/* Statistics Chart */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-medical-blue">{stats.totalMedications}</div>
                  <p className="text-sm text-muted-foreground">Total Medications</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-yellow-600">{stats.medicationsWithWarnings}</div>
                  <p className="text-sm text-muted-foreground">With Warnings</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-medical-green">{stats.standardDosePercentage}%</div>
                  <p className="text-sm text-muted-foreground">Standard Dosage</p>
                </CardContent>
              </Card>
            </div>

            {/* Warning Chart Visualization */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Analysis Overview
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Standard Dosage Compliance</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-medical-green"
                        style={{ width: `${stats.standardDosePercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{stats.standardDosePercentage}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Warning Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500"
                        style={{ width: `${stats.warningPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{stats.warningPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Warnings Summary */}
            {stats.medicationsWithWarnings > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Key Warnings to Review
                </h4>
                <div className="space-y-2">
                  {reportData.medications
                    .filter(med => med.warnings.length > 0)
                    .map((med, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{med.name}:</span>
                        <span className="ml-2 text-yellow-700">{med.warnings[0]}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={generatePDFReport}
              disabled={isGenerating}
              className="medical-gradient text-white flex-1"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate PDF Report
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
          </div>

          {reportGenerated && (
            <div className="flex items-center gap-2 p-3 bg-medical-green/10 border border-medical-green/20 rounded-lg">
              <Shield className="h-5 w-5 text-medical-green" />
              <div className="text-sm">
                <p className="font-medium text-medical-green">Report Generated Successfully</p>
                <p className="text-medical-green/80">
                  Your prescription analysis report has been downloaded. Keep it for your medical records.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFReportGenerator;
