import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, Shield, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DrugAnalysisProps {
  drugName: string;
  drugDetails: any;
}

interface DrugAnalysis {
  drugName: string;
  riskLevel: 'low' | 'medium' | 'high';
  interactions: string[];
  contraindications: string[];
  sideEffects: string[];
  warnings: string[];
  summary: string;
}

const DrugAnalysisCard: React.FC<DrugAnalysisProps> = ({ drugName, drugDetails }) => {
  const [analysis, setAnalysis] = useState<DrugAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<string>('');

  const analyzeWithGemini = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/drugs/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drugName,
          drugDetails
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze drug');
      }

      const analysisData = await response.json();
      setAnalysis(analysisData);
      toast.success('AI analysis completed successfully');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze drug information');
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/drugs/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drugName,
          patientInfo: null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const reportData = await response.json();
      setReport(reportData.report);
      setShowReport(true);
      toast.success('Comprehensive report generated');
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI-Powered Drug Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={analyzeWithGemini} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze with AI
              </>
            )}
          </Button>
          <Button 
            onClick={generateReport} 
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>

        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getRiskBadgeColor(analysis.riskLevel)}>
                {analysis.riskLevel.toUpperCase()} RISK
              </Badge>
              <span className="text-sm text-gray-600">
                AI Risk Assessment
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Drug Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    {analysis.interactions.map((interaction, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        {interaction}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    Contraindications
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    {analysis.contraindications.map((contraindication, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        {contraindication}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">AI Clinical Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {analysis.summary}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {showReport && report && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Comprehensive Drug Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap text-gray-700">
                  {report}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default DrugAnalysisCard;