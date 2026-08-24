import React from 'react';
import ResumeLivePreview from './ResumeLivePreview';

const ResumePreview = ({ data, resumeData, selectedTemplate = 'minimal', onSelectTemplate }) => {
  const effectiveData = resumeData || data || {};
  return (
    <ResumeLivePreview
      resumeData={effectiveData}
      selectedTemplate={selectedTemplate}
      onSelectTemplate={onSelectTemplate}
    />
  );
};

export default ResumePreview;
