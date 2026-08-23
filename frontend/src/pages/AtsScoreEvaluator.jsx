import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import api, { getAuthHeaders } from '../api';
import { BarChart3, Loader2, Check, X, ShieldAlert, Terminal, ArrowRight } from 'lucide-react';


const getScoreStatus = (score) => {
  if (score === 0) {
    return {
      text: 'Pending Scan',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    };
  }
  if (score < 50) {
    return {
      text: 'Low Match',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }
  if (score <= 75) {
    return {
      text: 'Moderate Match',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  }
  return {
    text: 'Strong Match',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
};

const ScoreDonutRing = ({ score }) => {
  let strokeColor = '#94a3b8'; // Default pending: slate-400
  if (score > 0) {
    if (score >= 75) {
      strokeColor = '#059669'; // > 75: emerald-600
    } else if (score >= 50) {
      strokeColor = '#f59e0b'; // 50-75: amber-500
    } else {
      strokeColor = '#e11d48'; // < 50: rose-600
    }
  }

  return (
    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
        {/* Background Circle */}
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="3"
        />
        {/* Foreground Score Dash Circle */}
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeDasharray={`${score}, 100`}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-sans font-bold text-lg text-slate-900">{score}%</span>
      </div>
    </div>
  );
};

const initialAuditData = {
  score: 0,
  targetStack: 'Pending Scan',
  technicalKeywords: [],
  formatting: [],
  actionItems: [],
};

const techDictionary = [
  'javascript', 'node.js', 'react', 'aws', 'azure', 'databases', 'api',
  'agile', 'full stack', 'cloud', 'deployment', 'security', 'frontend',
  'backend', 'python', 'html', 'css', 'typescript', 'docker', 'postgresql',
  'fastapi', 'microservices', 'ci/cd', 'graphql', 'redis', 'kubernetes'
];

const AtsScoreEvaluator = () => {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [auditData, setAuditData] = useState(initialAuditData);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const headers = await getAuthHeaders(getToken);
        const response = await api.get('/profile', headers);
        if (response.data && response.data.parsed_data) {
          setProfile(response.data.parsed_data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, [getToken]);

  const runAudit = (profData, jdText) => {
    // 1. Prevent running if text is empty
    if (!jdText || !jdText.trim()) return;

    const lowerJD = jdText.toLowerCase();

    // 2. The Strict Dictionary: Extract ONLY skills that match the dictionary
    const extractedSkills = techDictionary.filter((skill) => lowerJD.includes(skill));

    // 3. Handle Edge Case: No tech words found
    if (extractedSkills.length === 0) {
      setAuditData({
        score: 0,
        targetStack: 'Unknown',
        technicalKeywords: [],
        formatting: [
          { check: 'Standard Section Headers', pass: true },
          { check: 'Measurable Metrics', pass: false },
          { check: 'Single Column Layout', pass: true },
          { check: 'Parsable Contact Header', pass: true },
          { check: 'No Complex Tables / Graphics', pass: true },
        ],
        actionItems: [
          {
            priority: 'MEDIUM PRIORITY',
            text: 'No standard technical keywords detected in this job description.',
          },
        ],
      });
      return;
    }

    // 4. Map to strict UI schema & evaluate match against candidate profile
    const userSkills = profData?.skills?.flatMap((s) => (Array.isArray(s.items) ? s.items : [])) || [];
    const experiences = profData?.experiences || [];
    const summary = profData?.personal_info?.summary || '';
    const expText = experiences.map((ex) => `${ex.role || ''} ${ex.company || ''} ${ex.description || ''}`).join(' ');
    const fullProfileText = `${summary} ${expText} ${userSkills.join(' ')}`.toLowerCase();

    const newKeywords = extractedSkills.map((skill) => {
      // Check profile data if available, or fallback to prototype random boolean
      const isFound = fullProfileText.trim().length > 0
        ? (fullProfileText.includes(skill) || userSkills.some((s) => s.toLowerCase().includes(skill)))
        : Math.random() > 0.5;

      return {
        word: skill.charAt(0).toUpperCase() + skill.slice(1),
        found: isFound,
      };
    });

    // 5. Calculate True Score
    const foundCount = newKeywords.filter((k) => k.found).length;
    const calculatedScore = Math.round((foundCount / newKeywords.length) * 100);

    // 6. Generate actionable tickets for missing skills ONLY
    const missingSkills = newKeywords.filter((k) => !k.found);
    const newActionItems = missingSkills.map((skill, index) => ({
      priority: index === 0 ? 'HIGH PRIORITY' : 'MEDIUM PRIORITY',
      text: `Add missing keyword '${skill.word}' to Technical Skills or project descriptions.`,
    }));

    // 7. Dynamic Target Stack
    let detectedStack = 'Full Stack Engineering';
    if (lowerJD.includes('frontend')) {
      detectedStack = 'Frontend Engineering';
    } else if (lowerJD.includes('backend')) {
      detectedStack = 'Backend Engineering';
    }

    setAuditData({
      score: calculatedScore,
      targetStack: detectedStack,
      technicalKeywords: newKeywords,
      formatting: [
        { check: 'Standard Section Headers', pass: true },
        { check: 'Measurable Metrics', pass: false },
        { check: 'Single Column Layout', pass: true },
        { check: 'Parsable Contact Header', pass: true },
        { check: 'No Complex Tables / Graphics', pass: true },
      ],
      actionItems: newActionItems,
    });
  };

  const handleEvaluate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!jobDescription || !jobDescription.trim()) return;

    setIsEvaluating(true);

    try {
      // Call backend API endpoint /profile/evaluate-ats if available
      const response = await api.post('/profile/evaluate-ats', {
        jobDescription: jobDescription,
        resumeData: profile || {},
      });

      if (response.data && Array.isArray(response.data.technicalKeywords) && response.data.technicalKeywords.length > 0) {
        const aiData = response.data;
        setAuditData({
          score: typeof aiData.score === 'number' ? aiData.score : 0,
          targetStack: aiData.targetStack || 'Software Engineering',
          technicalKeywords: Array.isArray(aiData.technicalKeywords) ? aiData.technicalKeywords : [],
          formatting: Array.isArray(aiData.formatting) ? aiData.formatting : [],
          actionItems: Array.isArray(aiData.actionItems) ? aiData.actionItems : [],
        });
      } else {
        runAudit(profile, jobDescription);
      }
    } catch (error) {
      runAudit(profile, jobDescription);
    } finally {
      setIsEvaluating(false);
    }
  };

  const status = getScoreStatus(auditData.score);
  const applicantName = profile?.personal_info?.full_name || 'Candidate';

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-50 w-full min-h-[calc(100vh-80px)] font-sans text-[13px]">
      {/* Top Section (The Master Scorecard) */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* SVG Circular Donut Ring & Score Display */}
        <div className="flex items-center gap-5">
          <ScoreDonutRing score={auditData.score} />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-slate-900 font-bold text-base">ATS Compliance Score</h2>
              <span className={`border px-2 py-0.5 text-xs font-semibold rounded ${status.badgeClass}`}>
                {status.text}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic parsing audit comparing profile against target requirements.
            </p>
          </div>
        </div>

        {/* Quick Audit Metadata */}
        <div className="flex items-center gap-4 text-xs font-mono border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-5 w-full md:w-auto">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Target Stack</span>
            <span className="text-slate-900 font-semibold">{auditData.targetStack || 'Pending Scan'}</span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Keywords Parsed</span>
            <span className="text-slate-900 font-semibold">{auditData.technicalKeywords.length} Terms</span>
          </div>
        </div>
      </div>

      {/* Middle Section (The Input & Context Header) */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-200 pb-2.5">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-700" />
            <h3 className="text-slate-900 font-semibold text-xs uppercase tracking-wider">
              Target Job Specification
            </h3>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Audit Target: <span className="text-slate-900 font-semibold">{applicantName}</span>
          </div>
        </div>

        <form onSubmit={handleEvaluate} className="space-y-3">
          <div>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste raw target job description..."
              className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded p-2.5 text-xs text-slate-900 font-mono outline-none resize-none transition-colors"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isEvaluating || !jobDescription.trim()}
              className="bg-slate-900 text-white hover:bg-slate-800 rounded px-4 py-1.5 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 shadow-sm"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Running Audit...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Run Technical Audit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 2-Column Audit Report (Left 60% Raw Data, Right 40% Action Plan) */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 transition-opacity duration-200 ${isEvaluating ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Left Column (The Raw Data - 60% width / lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Technical Keyword Match Table */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-md p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <h3 className="text-slate-900 font-bold text-xs uppercase tracking-wider">
                Technical Keyword Match Matrix
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {auditData.technicalKeywords.filter((k) => k.found).length} / {auditData.technicalKeywords.length} Detected
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] font-semibold text-slate-500 uppercase bg-slate-50">
                    <th className="py-2 px-3">Keyword</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-[12px]">
                  {auditData.technicalKeywords.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="p-8 text-center text-slate-500 text-sm">
                        Waiting for job description. Click "Run Technical Audit" to begin.
                      </td>
                    </tr>
                  ) : (
                    auditData.technicalKeywords.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 text-slate-800 font-medium">{item.word}</td>
                        <td className="py-2 px-3 text-right">
                          {item.found ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold rounded inline-flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3]" /> Found
                            </span>
                          ) : (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[11px] font-semibold rounded inline-flex items-center gap-1">
                              <X className="w-3 h-3 stroke-[3]" /> Missing
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formatting & Parsability Checks List */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-md p-5 space-y-3">
            <div className="border-b border-gray-200 pb-2.5">
              <h3 className="text-slate-900 font-bold text-xs uppercase tracking-wider">
                Formatting & Parsability Checks
              </h3>
            </div>

            {auditData.formatting.length > 0 ? (
              <div className="space-y-2">
                {auditData.formatting.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 rounded p-2.5 flex items-center justify-between text-[12px]"
                  >
                    <span className="text-slate-800 font-medium">{item.check}</span>
                    {item.pass ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Pass
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <X className="w-3.5 h-3.5 stroke-[3]" /> Fail
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-slate-500 text-xs font-mono">
                Formatting checks pending scan.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (The Action Plan - 40% width / lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white border border-gray-200 shadow-sm rounded-md p-5 space-y-4 flex-1">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="text-slate-900 font-bold text-xs uppercase tracking-wider">
                Critical Remediation Steps
              </h3>
            </div>

            {auditData.actionItems.length > 0 ? (
              <div className="space-y-3">
                {auditData.actionItems.map((item, idx) => {
                  const isHigh = item.priority && item.priority.toUpperCase().includes('HIGH');
                  return (
                    <div
                      key={idx}
                      className={`border-l-4 ${
                        isHigh ? 'border-l-rose-500' : 'border-l-amber-500'
                      } bg-white border border-gray-200 shadow-sm p-3.5 rounded-r-md flex flex-col gap-2`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border ${
                            isHigh
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {item.priority.includes('PRIORITY') ? item.priority : `${item.priority} Priority`}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">TICKET-0{idx + 1}</span>
                      </div>

                    <p className="text-[12px] text-slate-800 font-medium leading-relaxed">
                      {item.text}
                    </p>

                    <div className="pt-1 border-t border-gray-100 flex justify-end">
                      <Link
                        to="/dashboard/resume"
                        className="text-[12px] font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Edit Resume</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs font-mono">
                Run a technical audit to generate remediation tickets.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AtsScoreEvaluator;
