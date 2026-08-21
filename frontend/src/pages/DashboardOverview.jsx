import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { FileText, Code2, Mail, Award, CheckCircle2, ArrowRight, User } from 'lucide-react';

const DashboardOverview = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        if (response.data && response.data.parsed_data) {
          setProfile(response.data.parsed_data);
        }
      } catch (err) {
        console.error('Error fetching profile overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const personal = profile?.personal_info || {};
  const expCount = profile?.experiences?.length || 0;
  const projCount = profile?.projects?.length || 0;
  const skillCount = profile?.skills?.length || 0;
  const certCount = profile?.certifications?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Welcome back{personal.full_name ? `, ${personal.full_name}` : ''}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your career assets, AI resume profile, and developer tools from your central dashboard.
          </p>
        </div>

        <Link
          to="/dashboard/resume"
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded flex items-center gap-2 transition-colors shrink-0"
        >
          <span>Open Resume Builder</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Work Experiences</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : expCount}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Key Projects</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : projCount}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Skill Categories</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : skillCount}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Certifications</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : certCount}</div>
        </div>
      </div>

      {/* Suite Modules Grid */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 mb-3">Workspace Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Link
            to="/dashboard/resume"
            className="bg-white border border-gray-200 hover:border-gray-300 rounded p-4 shadow-sm flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-blue-700 mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                AI Resume Builder
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Parse PDF/Image resumes with AI, edit sections in real-time, and export vector ATS PDFs or Images.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-700">
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/dashboard/portfolio"
            className="bg-white border border-gray-200 hover:border-gray-300 rounded p-4 shadow-sm flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                Portfolio Generator
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Generate interactive, responsive developer portfolio repositories from parsed profile data.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-700">
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/dashboard/cover-letter"
            className="bg-white border border-gray-200 hover:border-gray-300 rounded p-4 shadow-sm flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                Cover Letter Writer
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Tailor targeted cover letters tailored to specific job descriptions with AI alignment.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-700">
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/dashboard/ats"
            className="bg-white border border-gray-200 hover:border-gray-300 rounded p-4 shadow-sm flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                ATS Score Evaluator
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Analyze your resume against ATS scanner rules and keyword optimization metrics.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-700">
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/dashboard/github"
            className="bg-white border border-gray-200 hover:border-gray-300 rounded p-4 shadow-sm flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                GitHub README Generator
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Create polished, professional GitHub profile README markdown with stats and badges.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-700">
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/dashboard/linkedin"
            className="bg-white border border-gray-200 hover:border-gray-300 rounded p-4 shadow-sm flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                LinkedIn Optimizer
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Optimize your LinkedIn headlines, summary, and experience descriptions for recruiter search.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-700">
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
