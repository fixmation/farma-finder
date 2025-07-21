import React from 'react';
import PageLayout from '@/components/PageLayout';
import WorkflowDiagram from '@/components/WorkflowDiagram';

const Workflow: React.FC = () => {
  return (
    <PageLayout title="DigiFarmacy Workflow" showBackButton={true} backUrl="/">
      <div className="min-h-screen bg-gradient-to-br from-white via-[#7aebcf]/20 to-white py-8">
        <WorkflowDiagram />
      </div>
    </PageLayout>
  );
};

export default Workflow;