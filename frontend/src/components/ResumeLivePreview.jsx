import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { generateLatex } from '../utils/latexGenerator';
import { exportToDocx } from '../utils/docxGenerator';
import LatexModal from './LatexModal';
import TemplateMinimal from './templates/TemplateMinimal';
import TemplateModern from './templates/TemplateModern';
import TemplateExecutive from './templates/TemplateExecutive';
import SignatureTemplate from './templates/SignatureTemplate';
import AtsTemplateLibrary from './templates/AtsTemplateLibrary';

import {
  Download,
  Printer,
  FileImage,
  FileText,
  FileCode,
  Loader2,
  ChevronDown,
} from 'lucide-react';

export const templateOptions = [
  { id: 'template1', name: 'Classic Professional' },
  { id: 'template2', name: 'Modern Minimalist' },
  { id: 'template3', name: 'Tech Executive' },
  { id: 'template4', name: 'Creative Portfolio' },
  { id: 'template5', name: 'Startup Hustler' },
  { id: 'template6', name: 'Data Scientist' },
  { id: 'template7', name: 'Academic Scholar' },
  { id: 'template8', name: 'Entry Level / Grad' },
  { id: 'template9', name: 'Project Manager' },
  { id: 'template10', name: 'The Innovator' },
  { id: 'template11', name: 'The Signature' },
  { id: 'minimal', name: 'Minimalist Classic' },
  { id: 'modern-split', name: 'Modern Split-Column' },
  { id: 'executive', name: 'Executive Serif' },
];

const ResumeLivePreview = ({ resumeData = {}, selectedTemplate = 'template1', onSelectTemplate }) => {
  const containerRef = useRef(null);
  const resumeRef = useRef(null);
  const [scale, setScale] = useState(0.75);
  const [contentHeight, setContentHeight] = useState(1122);
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState('');
  const [showLatexModal, setShowLatexModal] = useState(false);
  const [latexCode, setLatexCode] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const data = resumeData;
  const personal = data?.personal_info || data?.basics || {};
  const baseFileName = personal.full_name || 'Resume';

  // Dynamic Auto-Scaler & Height Measurer to fit full template inside viewport pane
  useEffect(() => {
    const updateLayout = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Dynamically compute scale factor so 794px (210mm A4) fits inside container width with padding
        const calculatedScale = Math.min(1, Math.max(0.3, (containerWidth - 28) / 794));
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
  }, [data, selectedTemplate]);

  // Native Vector PDF Export (Strict Single-Page Scaling)
  const handleDownloadPDF = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${baseFileName}_Resume`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }
      @media print {
        html, body {
          width: 210mm !important;
          height: 297mm !important;
          max-height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          background: transparent !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .resume-a4-container, .w-\\[210mm\\] {
          width: 210mm !important;
          height: 297mm !important;
          max-height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          box-shadow: none !important;
          border: none !important;
          transform: scale(0.95);
          transform-origin: top center;
          page-break-after: avoid !important;
          page-break-before: avoid !important;
          break-after: avoid !important;
        }
        section, .mb-4, .mb-3, .mb-3.5, .mb-2, .mb-2.5 {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        ::-webkit-scrollbar, .no-print {
          display: none !important;
        }
      }
    `,
  });

  // High-Resolution JPEG Export
  const handleDownloadJPEG = async () => {
    setShowDropdown(false);
    setExporting(true);
    setExportType('JPEG');
    try {
      if (!resumeRef.current) throw new Error('Resume element not found.');

      const dataUrl = await toJpeg(resumeRef.current, { quality: 0.95, pixelRatio: 2, backgroundColor: '#ffffff' });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      saveAs(blob, `${baseFileName}.jpg`);
    } catch (error) {
      console.error('JPEG Export Error:', error);
      alert('Failed to export JPEG: ' + error.message);
    } finally {
      setExporting(false);
      setExportType('');
    }
  };

  // Word (.docx) Export
  const handleDownloadDOCX = async () => {
    setShowDropdown(false);
    setExporting(true);
    setExportType('Word');
    try {
      await exportToDocx(data);
    } catch (error) {
      console.error('DOCX Export Error:', error);
      alert('Failed to export Word document: ' + error.message);
    } finally {
      setExporting(false);
      setExportType('');
    }
  };

  // LaTeX Source Modal
  const handleOpenLatex = () => {
    setShowDropdown(false);
    try {
      const code = generateLatex(data, selectedTemplate);
      setLatexCode(code);
      setShowLatexModal(true);
    } catch (error) {
      console.error('LaTeX Generation Error:', error);
      alert('Failed to generate LaTeX code: ' + error.message);
    }
  };

  // Render Template Router
  const renderTemplateComponent = () => {
    switch (selectedTemplate) {
      case 'template11':
        return <SignatureTemplate data={data} />;
      case 'minimal':
        return <TemplateMinimal data={data} />;
      case 'modern-split':
      case 'modern':
        return <TemplateModern data={data} />;
      case 'executive':
        return <TemplateExecutive data={data} />;
      default:
        return <AtsTemplateLibrary data={data} templateId={selectedTemplate || 'template1'} />;
    }
  };

  const activeTemplateObj = templateOptions.find(t => t.id === selectedTemplate) || templateOptions[0];

  return (
    <div className="space-y-3">
      {/* EXPORT TOOLBAR (Clean single bar with active template badge and download options) */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 bg-slate-900 border border-slate-800 p-2.5 rounded-xl z-20">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Active Style:</span>
          <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            {activeTemplateObj.name}
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 font-mono">
            {Math.round(scale * 100)}% Auto-fit
          </span>
        </div>

        {/* Dropdown Export Action Button */}
        <div className="relative shrink-0 w-full sm:w-auto mt-2 sm:mt-0 flex justify-center sm:justify-end">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={exporting}
            className="w-full sm:w-auto px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {exporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting {exportType}...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export / Download</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </>
            )}
          </button>

          {/* Export Menu Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 space-y-1 z-50">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  handleDownloadPDF();
                }}
                disabled={exporting}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-semibold">Vector PDF (Print / ATS)</div>
                  <div className="text-[10px] text-slate-400">Native searchable PDF</div>
                </div>
              </button>

              <button
                onClick={handleDownloadJPEG}
                disabled={exporting}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <FileImage className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="font-semibold">Download JPEG</div>
                  <div className="text-[10px] text-slate-400">High-res image file (.jpg)</div>
                </div>
              </button>

              <button
                onClick={handleDownloadDOCX}
                disabled={exporting}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="font-semibold">Download Word (.docx)</div>
                  <div className="text-[10px] text-slate-400">Editable MS Word document</div>
                </div>
              </button>

              <button
                onClick={handleOpenLatex}
                disabled={exporting}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold">View / Copy LaTeX</div>
                  <div className="text-[10px] text-slate-400">Source code & .tex file</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC TEMPLATE AUTO-SCALING RENDER PANE */}
      <div 
        ref={containerRef}
        className="w-full max-h-[65vh] lg:max-h-[calc(100vh-140px)] bg-slate-900/40 rounded-xl border border-slate-800 overflow-y-auto overflow-x-hidden p-3 flex flex-col items-center justify-start min-h-[450px]"
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
              className="resume-a4-container w-[210mm] min-h-[297mm] bg-white shadow-2xl border border-slate-200 shrink-0 break-words text-slate-900 overflow-hidden rounded-xs"
            >
              {renderTemplateComponent()}
            </div>
          </div>
        </div>
      </div>

      {/* LATEX CODE MODAL */}
      <LatexModal
        isOpen={showLatexModal}
        onClose={() => setShowLatexModal(false)}
        latexCode={latexCode}
        resumeName={baseFileName}
      />
    </div>
  );
};

export default ResumeLivePreview;
