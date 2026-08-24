import React, { useState, useRef } from 'react';
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
  const resumeRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState('');
  const [showLatexModal, setShowLatexModal] = useState(false);
  const [latexCode, setLatexCode] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const data = resumeData;
  const personal = data?.personal_info || data?.basics || {};
  const baseFileName = personal.full_name || 'Resume';

  // Native Vector PDF Export
  const handleDownloadPDF = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${baseFileName}_Resume`,
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
      const code = generateLatex(data);
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
      <div className="flex items-center justify-between gap-2.5 bg-slate-900 border border-slate-800 p-2.5 rounded-xl z-20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Active Style:</span>
          <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            {activeTemplateObj.name}
          </span>
        </div>

        {/* Dropdown Export Action Button */}
        <div className="relative shrink-0">
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

      {/* DYNAMIC TEMPLATE RENDER CONTAINER */}
      <div className="w-full max-w-full max-h-[60vh] lg:max-h-[calc(100vh-140px)] overflow-y-auto overflow-x-auto p-1 sm:p-2 bg-slate-900/40 rounded-xl border border-slate-800 flex justify-center min-h-0 min-w-0">
        <div ref={resumeRef} className="w-full max-w-[794px]">
          {renderTemplateComponent()}
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
