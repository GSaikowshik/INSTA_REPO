import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { generateLatex } from '../utils/latexGenerator';
import { exportToDocx } from '../utils/docxGenerator';
import LatexModal from './LatexModal';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  GitBranch,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Wrench,
  Code2,
  User,
  Award,
  Trophy,
  Users,
  Info,
  Download,
  FileText,
  FileImage,
  FileCode,
  Loader2,
  ChevronDown,
  Printer,
} from 'lucide-react';

const ResumePreview = ({ data }) => {
  const resumeRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState('');
  const [showLatexModal, setShowLatexModal] = useState(false);
  const [latexCode, setLatexCode] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const personal = data?.personal_info || {};
  const skills = data?.skills || [];
  const experiences = data?.experiences || data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const certifications = data?.certifications || [];
  const achievements = data?.achievements || [];
  const leadership = data?.leadership || [];
  const rawAdditional = data?.additional_info || data?.additionalInfo;

  const additionalInfo = Array.isArray(rawAdditional)
    ? rawAdditional
    : typeof rawAdditional === 'object' && rawAdditional !== null
    ? Object.entries(rawAdditional).map(([k, v]) => `${k}: ${v}`)
    : typeof rawAdditional === 'string' && rawAdditional
    ? [rawAdditional]
    : [];

  const baseFileName = personal.full_name || 'Resume';

  // React-To-Print Native Vector PDF Export
  const handleDownloadPDF = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${baseFileName}_Resume`,
  });

  // JPEG Export using html-to-image toJpeg
  const handleDownloadJPEG = async () => {
    setShowDropdown(false);
    setExporting(true);
    setExportType('JPEG');
    try {
      if (!resumeRef.current) throw new Error('Resume paper element not found.');

      const dataUrl = await toJpeg(resumeRef.current, { quality: 0.95, pixelRatio: 2 });
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

  // LaTeX Modal View
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

  return (
    <div className="space-y-3">
      {/* EXPORT ACTION TOOLBAR */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-2xl relative z-20">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Export Options</span>
        </div>

        {/* Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={exporting}
            className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {exporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting {exportType}...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download / Export</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </>
            )}
          </button>

          {/* Export Menu Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  handleDownloadPDF();
                }}
                disabled={exporting}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-semibold">Vector PDF (Print / ATS)</div>
                  <div className="text-[10px] text-slate-400">Native searchable PDF with links</div>
                </div>
              </button>

              <button
                onClick={handleDownloadJPEG}
                disabled={exporting}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
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
                className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
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
                className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
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

      {/* PAPER RESUME SHEET CONTAINER WITH STRICT 10-POINT ARCHITECTURE */}
      <div className="flex justify-center overflow-x-auto p-1 bg-slate-900/40 rounded-2xl border border-slate-800">
        <div
          ref={resumeRef}
          className="resume-a4-preview resume-a4-container bg-white text-slate-900 shadow-2xl p-6 sm:p-7 text-[11px] font-sans leading-tight border border-slate-200"
        >
          {/* 1. Header Section */}
          <header className="border-b border-gray-300 pb-3 mb-3 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
              {personal.full_name || 'Your Full Name'}
            </h1>
            {personal.title && (
              <p className="text-xs font-bold text-indigo-700 mt-0.5">
                {personal.title}
              </p>
            )}

            {/* Contact Info Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mt-2 text-[10.5px] text-slate-600 font-medium">
              {personal.email && (
                <a href={`mailto:${personal.email}`} className="flex items-center gap-1 text-slate-700 hover:text-indigo-600">
                  <Mail className="w-3 h-3 text-indigo-600" />
                  <span>{personal.email}</span>
                </a>
              )}
              {personal.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-indigo-600" />
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-600" />
                  <span>{personal.location}</span>
                </div>
              )}
              {personal.github_url && (
                <a
                  href={personal.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  <GitBranch className="w-3 h-3" />
                  <span>GitHub</span>
                </a>
              )}
              {personal.linkedin_url && (
                <a
                  href={personal.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>LinkedIn</span>
                </a>
              )}
              {personal.website_url && (
                <a
                  href={personal.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  <Globe className="w-3 h-3" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </header>

          {/* 2. Executive Summary */}
          {personal.summary && (
            <section className="mb-3 border-b border-gray-300 pb-2.5">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 pb-0.5 mb-1 flex items-center gap-1">
                <User className="w-3 h-3" /> Executive Summary
              </h2>
              <p className="text-slate-700 leading-snug text-[10.5px]">{personal.summary}</p>
            </section>
          )}

          {/* 3. Technical Skills */}
          {skills.length > 0 && (
            <section className="mb-3 border-b border-gray-300 pb-2.5">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 pb-0.5 mb-1.5 flex items-center gap-1">
                <Wrench className="w-3 h-3" /> Technical Skills
              </h2>
              <div className="space-y-1">
                {skills.map((sk, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-semibold text-[10.5px] text-slate-900 shrink-0 w-28">
                      {sk.category || 'Skills'}:
                    </span>
                    <span className="text-[10.5px] text-slate-700">
                      {Array.isArray(sk.items) ? sk.items.filter(Boolean).join(', ') : sk.items}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Experience Section */}
          {experiences.length > 0 && (
            <section className="mb-3 border-b border-gray-300 pb-2.5">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 pb-0.5 mb-1.5 flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> Work Experience
              </h2>
              <div className="space-y-2">
                {experiences.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                      <span className="font-bold text-slate-900 text-xs">{exp.role || 'Role'}</span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {exp.start_date || ''} {exp.start_date || exp.end_date ? '–' : ''} {exp.end_date || ''}
                      </span>
                    </div>
                    <div className="text-[10.5px] font-semibold text-indigo-700 mb-0.5">{exp.company || 'Company'}</div>
                    {exp.description && (
                      Array.isArray(exp.description) ? (
                        <ul className="list-disc list-inside text-[10.5px] text-slate-700 leading-snug space-y-0.5 pl-1">
                          {exp.description.filter(Boolean).map((line, dIdx) => (
                            <li key={dIdx}>{line}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[10.5px] text-slate-700 leading-snug">{exp.description}</p>
                      )
                    )}
                    {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                      <ul className="list-disc list-inside text-[10px] text-slate-700 mt-0.5 space-y-0.5 pl-1">
                        {exp.highlights.map((item, hIdx) => (
                          <li key={hIdx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. Key Projects */}
          {projects.length > 0 && (
            <section className="mb-3 border-b border-gray-300 pb-2.5">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 pb-0.5 mb-1.5 flex items-center gap-1">
                <Code2 className="w-3 h-3" /> Key Projects
              </h2>
              <div className="space-y-2">
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{proj.title || 'Project Title'}</span>
                      <div className="flex items-center gap-2 text-[10px]">
                        {proj.repo_url && (
                          <a href={proj.repo_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-0.5">
                            <GitBranch className="w-2.5 h-2.5" /> Code
                          </a>
                        )}
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-0.5">
                            <ExternalLink className="w-2.5 h-2.5" /> Demo
                          </a>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-[10.5px] text-slate-700 leading-snug mt-0.5">{proj.description}</p>
                    )}
                    {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {proj.technologies.map(
                          (tech, tIdx) =>
                            tech && (
                              <span key={tIdx} className="px-1.5 py-0.2 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[9.5px] font-medium">
                                {tech}
                              </span>
                            )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. Education Section */}
          {education.length > 0 && (
            <section className="mb-3 border-b border-gray-300 pb-2.5">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 pb-0.5 mb-1.5 flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> Education
              </h2>
              <div className="space-y-1.5">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degree || 'Degree'}</span>
                      {edu.field_of_study && <span> in {edu.field_of_study}</span>}
                      <div className="text-[10.5px] text-indigo-700 font-medium">{edu.institution}</div>
                      {edu.gpa && <div className="text-[10px] text-slate-500">GPA: {edu.gpa}</div>}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium shrink-0 mt-0.5 sm:mt-0">
                      {edu.start_date || ''} {edu.start_date || edu.end_date ? '–' : ''} {edu.end_date || ''}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7. Certifications (High-Density List) */}
          {certifications.length > 0 && (
            <section className="mb-3 border-b border-gray-300 pb-2.5">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 pb-0.5 mb-1.5 flex items-center gap-1">
                <Award className="w-3 h-3" /> Certifications
              </h2>
              <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-700">
                {certifications.map((cert, idx) => {
                  const issueDate = cert.issue_date || cert.date || '';
                  const name = cert.name || cert.title || 'Certification';
                  const issuer = cert.issuer ? ` (${cert.issuer})` : '';
                  const dateStr = issueDate ? ` — ${issueDate}` : '';

                  return (
                    <li key={idx} className="leading-tight">
                      {cert.credential_url ? (
                        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-900 hover:text-indigo-600 hover:underline">
                          {name}
                        </a>
                      ) : (
                        <span className="font-bold text-slate-900">{name}</span>
                      )}
                      <span className="text-indigo-700 font-medium">{issuer}</span>
                      <span className="text-slate-500 font-mono text-[10px]">{dateStr}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* 8. Achievements (High-Density List) */}
          {achievements.length > 0 && (
            <section className="mb-3 border-b border-gray-300 pb-2.5">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 pb-0.5 mb-1.5 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500" /> Honors & Key Achievements
              </h2>
              <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-700">
                {achievements.map((ach, idx) => {
                  const title = typeof ach === 'string' ? ach : (ach.title || ach.name || '');
                  const desc = typeof ach === 'object' ? ach.description : '';
                  return (
                    <li key={idx} className="leading-tight">
                      <span className="font-bold text-slate-900">{title}</span>
                      {desc && <span className="text-slate-700"> — {desc}</span>}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* 9. Leadership & Activities (High-Density List) */}
          {leadership.length > 0 && (
            <section className="mb-3 border-b border-gray-300 pb-2.5">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 pb-0.5 mb-1.5 flex items-center gap-1">
                <Users className="w-3 h-3 text-indigo-600" /> Leadership & Activities
              </h2>
              <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-700">
                {leadership.map((item, idx) => {
                  const role = typeof item === 'string' ? item : (item.role || item.title || '');
                  const org = typeof item === 'object' && item.organization ? ` at ${item.organization}` : '';
                  const desc = typeof item === 'object' && item.description ? ` — ${Array.isArray(item.description) ? item.description.join(', ') : item.description}` : '';
                  return (
                    <li key={idx} className="leading-tight">
                      <span className="font-bold text-slate-900">{role}</span>
                      <span className="text-indigo-700 font-medium">{org}</span>
                      {desc && <span className="text-slate-700">{desc}</span>}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* 10. Additional Information (High-Density List) */}
          {additionalInfo.length > 0 && (
            <section className="mb-1">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 pb-0.5 mb-1.5 flex items-center gap-1">
                <Info className="w-3 h-3 text-blue-600" /> Additional Information
              </h2>
              <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-700">
                {additionalInfo.map((info, idx) => (
                  <li key={idx} className="leading-tight">
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

        </div>
      </div>

      {/* LATEX CODE MODAL */}
      <LatexModal
        isOpen={showLatexModal}
        onClose={() => setShowLatexModal(false)}
        latexCode={latexCode}
      />
    </div>
  );
};

export default ResumePreview;
