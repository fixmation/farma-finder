import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Upload, Bell, Pill, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const WorkflowSummary: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const workflowSteps = [
    {
      id: 1,
      title: t('workflow.step1'),
      icon: <MapPin className="h-5 w-5 text-blue-600" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: 2,
      title: t('workflow.step2'),
      icon: <Upload className="h-5 w-5 text-green-600" />,
      color: "bg-green-50 border-green-200"
    },
    {
      id: 3,
      title: t('workflow.step3'),
      icon: <Bell className="h-5 w-5 text-orange-600" />,
      color: "bg-orange-50 border-orange-200"
    },
    {
      id: 4,
      title: t('workflow.step4'),
      icon: <Pill className="h-5 w-5 text-purple-600" />,
      color: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {t('workflow.title')}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Simple steps to connect with verified pharmacies and get your medicines safely
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            <Card className={`w-full ${step.color} border-2 hover:shadow-lg transition-shadow`}>
              <CardContent className="p-2 md:p-4 text-center">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md mx-auto mb-1 md:mb-3">
                  <div className="scale-75 md:scale-100">
                    {step.icon}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                  <span className="w-4 h-4 md:w-6 md:h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
                    {step.id}
                  </span>
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-900 leading-tight">
                  {step.title}
                </h3>
              </CardContent>
            </Card>
            {index < workflowSteps.length - 1 && (
              <div className="hidden md:block absolute right-[-20px] top-1/2 transform -translate-y-1/2">
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={() => navigate('/workflow')}
          className="bg-gradient-to-r from-[#00bfff] to-green-500 hover:from-[#0099cc] hover:to-green-600 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {t('workflow.viewFull')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default WorkflowSummary;