import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toJpeg } from 'html-to-image';
import { generateLatex } from '../utils/latexGenerator';
import AtsTemplateLibrary from './templates/AtsTemplateLibrary';
import SignatureTemplate from './templates/SignatureTemplate';
import { Check, FileCode } from 'lucide-react';

const atsTemplates = [
  { id: 'template1', name: 'Classic Professional' },
  { id: 'template2', name: 'Modern Minimalist' },
  { id: 'template3', name: 'Tech Executive' },
  { id: 'template4', name: 'Creative Portfolio' },
  { id: 'template5', name: 'Startup Hustler' },
  { id: 'template6', name: 'Data Scientist' },
  { id: 'template7', name: 'Academic Scholar' },
  { id: 'template8', name: 'Entry Level/Grad' },
  { id: 'template9', name: 'Project Manager' },
  { id: 'template10', name: 'The Innovator' },
  { id: 'template11', name: 'The Signature' }
];

const TemplateVision = ({ parsedData }) => {
  const parsed_data = parsedData;
  const [selectedAtsId, setSelectedAtsId] = useState('template1');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [scale, setScale] = useState(0.75);
  const [contentHeight, setContentHeight] = useState(1122);
  const containerRef = useRef(null);
  const resumeRef = useRef(null);

  // Dynamic Auto-Scaler & Height Measurer
  useEffect(() => {
    const updateLayout = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const calculatedScale = Math.min(1, Math.max(0.3, (containerWidth - 32) / 794));
        setScale(calculatedScale);
      }
      if (resumeRef.current) {
        setContentHeight(resumeRef.current.scrollHeight || 1122);
      }
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    if (containerRef.current) observer.observe(containerRef.current);
    if (resumeRef.current) observer.observe(resumeRef.current);

    return () => observer.disconnect();
  }, [parsedData, selectedAtsId]);

  // 1. ATS-Friendly PDF Export (Vector-based, selectable text)
  const handleDownloadPDF = useReactToPrint({
    contentRef: resumeRef,
    content: () => resumeRef.current,
    documentTitle: `${parsed_data?.personal_info?.full_name || 'Resume'}`,
    pageStyle: `
      @page { size: A4; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; } }
    `,
  });

  // 2. High-Fidelity JPEG Export using html-to-image toJpeg (No OKLCH crash, white background, quality 1.0)
  const handleDownloadJpeg = async () => {
    if (!resumeRef.current) return;
    try {
      const dataUrl = await toJpeg(resumeRef.current, { quality: 1.0, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `${parsed_data?.personal_info?.full_name || 'Resume'}.jpeg`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export JPEG:', err);
      alert('Failed to export JPEG file.');
    }
  };

  // 3. MS Word (.doc) Export
  const handleDownloadDOCX = () => {
    if (!resumeRef.current) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Resume</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + resumeRef.current.innerHTML + footer;
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${parsed_data?.personal_info?.full_name || 'Resume'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 4. LaTeX Clipboard Copy
  const handleCopyLatex = async () => {
    try {
      const latexString = generateLatex(parsed_data, selectedAtsId);
      await navigator.clipboard.writeText(latexString);
      setCopiedLatex(true);
      setTimeout(() => setCopiedLatex(false), 2000);
    } catch (err) {
      console.error('Failed to copy LaTeX:', err);
    }
  };

  return (
    <div className="space-y-3">
      {/* Secondary Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-gray-200 rounded p-2.5">
        <div className="flex items-center gap-2.5">
          <label className="text-[13px] font-medium text-gray-500 tracking-tight">Style:</label>
          <select 
            value={selectedAtsId}
            onChange={(e) => setSelectedAtsId(e.target.value)}
            className="bg-white text-gray-900 text-[13px] rounded border border-gray-200 focus:border-blue-700 py-1 px-2.5 cursor-pointer outline-none"
          >
            {atsTemplates?.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        
        {/* EXPORT MENU UI */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="bg-gray-900 hover:bg-gray-800 text-white border border-gray-900 px-3.5 py-1.5 rounded text-[13px] font-medium flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Export</span>
            <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${isExportMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          {isExportMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-gray-200 rounded shadow-md z-50 overflow-hidden">
              <div className="p-1 flex flex-col gap-0.5">
                <button 
                  type="button"
                  onClick={() => {
                    handleDownloadPDF();
                    setIsExportMenuOpen(false);
                  }} 
                  className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  <span className="font-medium">Download PDF</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    handleDownloadDOCX();
                    setIsExportMenuOpen(false);
                  }} 
                  className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span className="font-medium">Download DOCX</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    handleDownloadJpeg();
                    setIsExportMenuOpen(false);
                  }} 
                  className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span className="font-medium">Download JPEG</span>
                </button>
                
                <div className="h-px w-full bg-gray-200 my-0.5"></div>
                
                <button 
                  type="button"
                  onClick={() => {
                    handleCopyLatex();
                    setTimeout(() => setIsExportMenuOpen(false), 1500);
                  }} 
                  className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {copiedLatex ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <FileCode className="w-4 h-4 text-gray-500" />
                  )}
                  <span className={`font-medium ${copiedLatex ? 'text-emerald-700 font-semibold' : ''}`}>
                    {copiedLatex ? 'Copied!' : 'Copy LaTeX'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RESPONSIVE PREVIEW PANE */}
      <div 
        ref={containerRef}
        className="w-full h-[calc(100vh-140px)] bg-gray-100 rounded border border-gray-200 overflow-y-auto overflow-x-hidden p-4 flex flex-col items-center justify-start"
      >
        <div 
          className="flex justify-center items-start shrink-0"
          style={{
            width: '210mm',
            height: `${contentHeight * scale + 32}px`,
          }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
            className="shrink-0"
          >
            <div 
              ref={resumeRef} 
              className="w-[210mm] min-h-[297mm] bg-white shadow-sm border border-gray-200 shrink-0 break-words text-black overflow-hidden"
            >
              {selectedAtsId === 'template11' ? (
                <SignatureTemplate data={parsed_data} />
              ) : (
                <AtsTemplateLibrary data={parsed_data} templateId={selectedAtsId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateVision;
