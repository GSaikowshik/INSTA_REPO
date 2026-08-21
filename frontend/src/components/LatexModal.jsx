import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode } from 'lucide-react';
import { saveAs } from 'file-saver';

const LatexModal = ({ isOpen, onClose, latexCode, fileName = 'Resume.tex' }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (!latexCode) throw new Error('No LaTeX code generated.');
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy LaTeX Error:', err);
      alert('Failed to copy LaTeX code: ' + err.message);
    }
  };

  const handleDownloadTex = () => {
    try {
      if (!latexCode) throw new Error('No LaTeX code generated.');
      const blob = new Blob([latexCode], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, fileName || 'resume.tex');
    } catch (err) {
      console.error('Download LaTeX Error:', err);
      alert('Failed to download .tex file: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">LaTeX Source Code</h3>
              <p className="text-xs text-slate-400">Clean, compilable LaTeX markup ready for Overleaf or pdflatex</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code Content Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/80 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre-wrap break-all leading-relaxed select-all">
            <code>{latexCode}</code>
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500 hidden sm:inline">
            {latexCode ? `${latexCode.length} characters` : ''}
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Code'}
            </button>

            <button
              onClick={handleDownloadTex}
              className="flex-1 sm:flex-initial px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download .tex
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatexModal;
