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

  const personal = data?.personal_info || data?.basics || {};
  const summaryText = personal.summary || data?.summary || '';
  const skills = data?.skills || [];
  const experiences = data?.experiences || data?.experience || data?.work || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const certifications = data?.certifications || [];
  const achievements = data?.achievements || [];
  const leadership = data?.leadership || [];
  const additionalInfo = data?.additional_info || data?.additionalInfo || [];

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

      {/* PAPER RESUME SHEET CONTAINER WITH STRICT 10-POINT RESUME ARCHITECTURE */}
      <div className="flex justify-center overflow-x-auto p-1 bg-slate-900/40 rounded-2xl border border-slate-800">
        <div
          ref={resumeRef}
          className="resume-a4-preview resume-a4-container bg-white text-slate-900 shadow-2xl p-6 sm:p-7 text-[11px] font-sans leading-tight border border-slate-200"
        >
          {/* SECTION 1: HEADER */}
          <header className="border-b border-slate-900 pb-3 mb-3 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
              {personal.full_name || 'Your Full Name'}
            </h1>
            {personal.title && (
              <p className="text-xs font-bold text-indigo-700 mt-0.5">
                {personal.title}
              </p>
            )}

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

          {/* SECTION 2: EXECUTIVE SUMMARY */}
          {summaryText && (
            <section className="mb-3 pb-2 border-b border-gray-200">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 border-b border-slate-200 pb-0.5 mb-1 flex items-center gap-1">
                <User className="w-3 h-3" /> Executive Summary
              </h2>
              <p className="text-slate-700 leading-snug text-[10.5px]">{summaryText}</p>
            </section>
          )}

          {/* SECTION 3: TECHNICAL SKILLS */}
          {skills.length > 0 && (
            <section className="mb-3 pb-2 border-b border-gray-200">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 border-b border-slate-200 pb-0.5 mb-1.5 flex items-center gap-1">
                <Wrench className="w-3 h-3" /> Technical Skills
              </h2>
              <div className="space-y-1.5">
                {skills.map((sk, idx) => {
                  const categoryName = sk.category || sk.name || 'Skills';
                  const itemsList = Array.isArray(sk.items)
                    ? sk.items.filter(Boolean)
                    : (typeof sk.items === 'string' ? sk.items.split(/[\n,]/).map(s => s.trim()).filter(Boolean) : []);

                  return (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-[10.5px]">
                      <span className="font-bold text-slate-900 shrink-0 sm:w-32">
                        {categoryName}:
                      </span>
                      <div className="flex flex-wrap gap-1 items-center">
                        {itemsList.map((skillToken, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 rounded text-[9.5px] font-medium leading-none"
                          >
                            {skillToken}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* SECTION 4: WORK EXPERIENCE */}
          {experiences.length > 0 && (
            <section className="mb-3 pb-2 border-b border-gray-200">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 border-b border-slate-200 pb-0.5 mb-1.5 flex items-center gap-1">
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

          {/* SECTION 5: KEY PROJECTS */}
          {projects.length > 0 && (
            <section className="mb-3 pb-2 border-b border-gray-200">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 border-b border-slate-200 pb-0.5 mb-1.5 flex items-center gap-1">
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
                    {(() => {
                      const bullets = Array.isArray(proj.highlights) && proj.highlights.length > 0
                        ? proj.highlights
                        : (Array.isArray(proj.bullet_points) && proj.bullet_points.length > 0
                            ? proj.bullet_points
                            : (proj.description ? (Array.isArray(proj.description) ? proj.description : [proj.description]) : []));

                      if (bullets.length === 0) return null;

                      return (
                        <ul className="list-disc list-inside text-[10.5px] text-slate-700 leading-snug space-y-0.5 mt-0.5">
                          {bullets.filter(Boolean).map((line, bIdx) => (
                            <li key={bIdx}>{line}</li>
                          ))}
                        </ul>
                      );
                    })()}
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

          {/* SECTION 6: EDUCATION */}
          {education.length > 0 && (
            <section className="mb-3 pb-2 border-b border-gray-200">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 border-b border-slate-200 pb-0.5 mb-1.5 flex items-center gap-1">
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

          {/* SECTION 7: CERTIFICATIONS */}
          {certifications.length > 0 && (
            <section className="mb-3 pb-2 border-b border-gray-200">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 border-b border-slate-200 pb-0.5 mb-1.5 flex items-center gap-1">
                <Award className="w-3 h-3" /> Certifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {certifications.map((cert, idx) => {
                  const issueDate = cert.issue_date || cert.date || '';
                  const expDate = cert.expiration_date || '';
                  const dateDisplay =
                    issueDate && expDate ? `${issueDate} – ${expDate}` : issueDate || expDate;

                  return (
                    <div key={idx} className="flex items-start justify-between gap-1 leading-tight">
                      <div className="min-w-0 flex-1">
                        {cert.credential_url ? (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-slate-900 hover:text-indigo-600 hover:underline inline-flex items-center gap-0.5 text-[10.5px] truncate"
                          >
                            <span className="truncate">{cert.name || 'Certification Name'}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-indigo-600 shrink-0" />
                          </a>
                        ) : (
                          <div className="font-bold text-slate-900 text-[10.5px] truncate">
                            {cert.name || 'Certification Name'}
                          </div>
                        )}
                        {cert.issuer && (
                          <div className="text-[10px] text-indigo-700 font-medium truncate">
                            {cert.issuer}
                          </div>
                        )}
                      </div>
                      {dateDisplay && (
                        <div className="text-[9.5px] text-slate-500 font-medium shrink-0 pt-0.5">
                          {dateDisplay}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* SECTION 8: ACHIEVEMENTS */}
          {achievements.length > 0 && (
            <section className="mb-3 pb-2 border-b border-gray-200">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 border-b border-slate-200 pb-0.5 mb-1.5 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500" /> Honors & Key Achievements
              </h2>
              <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-700">
                {achievements.map((ach, idx) => {
                  const title = typeof ach === 'string' ? ach : (ach.title || ach.name || '');
                  const desc = typeof ach === 'object' ? ach.description : '';
                  return (
                    <li key={idx}>
                      <span className="font-bold text-slate-900">{title}</span>
                      {desc && <span className="text-slate-700 font-medium"> — {desc}</span>}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* SECTION 9: LEADERSHIP & ACTIVITIES */}
          {leadership.length > 0 && (
            <section className="mb-3 pb-2 border-b border-gray-200">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 border-b border-slate-200 pb-0.5 mb-1.5 flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-600" /> Leadership & Activities
              </h2>
              <div className="space-y-1.5">
                {leadership.map((item, idx) => {
                  const role = item.role || item.title || 'Leader';
                  const org = item.organization || item.company || '';
                  const desc = item.description || '';
                  return (
                    <div key={idx} className="leading-snug">
                      <div className="flex justify-between font-bold text-slate-900 text-[10.5px]">
                        <span>{role} {org ? `— ${org}` : ''}</span>
                      </div>
                      {desc && <p className="text-[10px] text-slate-700">{desc}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* SECTION 10: ADDITIONAL INFORMATION */}
          {((Array.isArray(additionalInfo) && additionalInfo.length > 0) || (typeof additionalInfo === 'object' && Object.keys(additionalInfo).length > 0)) && (
            <section className="mb-2">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-800 border-b border-slate-200 pb-0.5 mb-1.5 flex items-center gap-1">
                <Info className="w-3 h-3 text-emerald-600" /> Additional Information
              </h2>
              {Array.isArray(additionalInfo) ? (
                <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-700">
                  {additionalInfo.map((infoItem, idx) => {
                    const cat = typeof infoItem === 'object' ? infoItem.category : '';
                    const det = typeof infoItem === 'object' ? (infoItem.details || infoItem.description) : infoItem;
                    return (
                      <li key={idx}>
                        {cat && <span className="font-bold text-slate-900">{cat}: </span>}
                        <span>{det}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="space-y-0.5 text-[10.5px] text-slate-700">
                  {Object.entries(additionalInfo).map(([key, val], idx) => (
                    <div key={idx}>
                      <span className="font-bold text-slate-900">{key}: </span>
                      <span>{Array.isArray(val) ? val.join(', ') : val}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

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

export default ResumePreview;
