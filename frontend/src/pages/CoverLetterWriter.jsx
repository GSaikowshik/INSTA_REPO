import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api, { getAuthHeaders } from '../api';
import { Sparkles, Copy, Download, Check, Loader2, FileText } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

const CoverLetterWriter = () => {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer');
  const [jobDescription, setJobDescription] = useState(
    'Seeking an experienced Full Stack Engineer with expertise in React, Node.js, and Python FastAPI. Responsible for building scalable SaaS features, high-performance REST APIs, and responsive user interfaces.'
  );
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState('');

  const documentRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const headers = await getAuthHeaders(getToken);
        const response = await api.get('/profile', headers);
        if (response.data && response.data.parsed_data) {
          setProfile(response.data.parsed_data);
          generateLetterText(response.data.parsed_data, companyName, jobTitle, jobDescription);
        } else {
          generateLetterText(null, companyName, jobTitle, jobDescription);
        }
      } catch (err) {
        console.error('Error loading profile for cover letter:', err);
        generateLetterText(null, companyName, jobTitle, jobDescription);
      }
    };
    fetchProfile();
  }, [getToken]);

  const generateLetterText = (profData, company, title, desc) => {
    const personal = profData?.personal_info || {};
    const name = personal.full_name || 'Alex Morgan';
    const email = personal.email || 'alex.morgan@example.com';
    const phone = personal.phone || '+1 (555) 019-2834';
    const location = personal.location || 'San Francisco, CA';
    const experiences = profData?.experiences || [];
    const skillsList = profData?.skills?.flatMap((s) => (Array.isArray(s.items) ? s.items : [])) || [];
    const topSkills = skillsList.slice(0, 5).join(', ') || 'React, Node.js, Python, TypeScript, REST APIs';

    const recentRole = experiences[0]
      ? `${experiences[0].role} at ${experiences[0].company}`
      : 'Senior Software Engineer';

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const letter = `${name}
${email} | ${phone} | ${location}

${today}

Hiring Manager
${company || 'Target Company'}

Dear Hiring Manager,

I am writing to express my strong interest in the ${title || 'Target Role'} position at ${company || 'your company'}. With a proven track record as a ${recentRole} and deep technical expertise in ${topSkills}, I am confident in my ability to immediately contribute to your engineering organization.

Throughout my career, I have specialized in architecting production-grade applications, building high-throughput APIs, and delivering responsive user interfaces. In my recent roles, I have spearheaded core software initiatives that improved system reliability and user engagement while maintaining high standards of code quality and automated testing.

${company || 'Your company'}'s focus on engineering excellence aligns perfectly with my professional background. Given the requirements outlined in your job description: "${desc.slice(0, 140)}...", I am particularly excited about the opportunity to leverage my skill set to solve complex engineering challenges and drive product innovation with your team.

Thank you for your time and consideration. I welcome the opportunity to discuss how my background and technical skills align with your hiring goals.

Sincerely,

${name}`;

    setCoverLetterText(letter);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await api.post('/profile/generate-cover-letter', {
        companyName: companyName,
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        resumeData: profile || {},
      });

      if (response.data && response.data.coverLetterText) {
        setCoverLetterText(response.data.coverLetterText);
      } else {
        generateLetterText(profile, companyName, jobTitle, jobDescription);
      }
    } catch (err) {
      console.error('Error generating AI cover letter, using fallback:', err);
      generateLetterText(profile, companyName, jobTitle, jobDescription);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy cover letter:', err);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: documentRef,
    documentTitle: `Cover_Letter_${companyName.replace(/\s+/g, '_')}`,
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full p-6 bg-slate-50 min-h-[calc(100vh-80px)]">
      {/* Left Column (Input - 40% width) */}
      <div className="lg:w-[40%] bg-white border border-gray-200 shadow-sm rounded-md p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
          <FileText className="w-4 h-4 text-blue-700" />
          <h2 className="text-slate-900 font-semibold text-sm">Target Role Details</h2>
        </div>

        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-3 py-1.5 text-xs text-slate-900 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-3 py-1.5 text-xs text-slate-900 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Paste Job Description</label>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste key responsibilities and requirements from the job posting..."
              className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded p-3 text-xs text-slate-900 outline-none resize-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="bg-slate-900 text-white hover:bg-slate-800 rounded px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 shadow-sm mt-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Cover Letter
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right Column (Preview - 60% width) */}
      <div className="lg:w-[60%] bg-white border border-gray-200 shadow-sm rounded-md p-6 sm:p-8 flex flex-col gap-4 overflow-y-auto">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h3 className="text-slate-900 font-semibold text-sm">Cover Letter Document</h3>
            <p className="text-xs text-slate-500">Real-time preview formatted for export</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-600 hover:bg-slate-100 border border-gray-200 rounded px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="text-slate-600 hover:bg-slate-100 border border-gray-200 rounded px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Paper Document Preview Area */}
        <div className="bg-slate-50 border border-gray-200 rounded p-4 sm:p-6 flex justify-center overflow-y-auto">
          <div
            ref={documentRef}
            className="w-full max-w-[210mm] min-h-[297mm] bg-white border border-gray-200 shadow-sm p-8 sm:p-12 text-[12px] text-slate-800 leading-relaxed font-sans whitespace-pre-wrap"
          >
            {coverLetterText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterWriter;
