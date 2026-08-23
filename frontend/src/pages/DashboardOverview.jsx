import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import api, { getAuthHeaders } from '../api';
import { 
  FileText, 
  Code2, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Trash2, 
  ExternalLink, 
  Database, 
  Briefcase, 
  FolderGit2, 
  Wrench, 
  GraduationCap, 
  Award,
  Edit,
  Plus
} from 'lucide-react';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedResumes, setSavedResumes] = useState([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  const [savedPortfolios, setSavedPortfolios] = useState([]);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    setIsLoadingResumes(true);
    setIsLoadingPortfolios(true);
    try {
      const headers = await getAuthHeaders(getToken);
      const [meRes, profileRes, resumesRes, portfoliosRes] = await Promise.all([
        api.get('/auth/me', headers).catch(() => null),
        api.get('/profile', headers).catch(() => null),
        api.get('/resumes', headers).catch(() => null),
        api.get('/portfolios', headers).catch(() => null),
      ]);

      if (meRes?.data) {
        setDbUser(meRes.data);
      }
      if (profileRes?.data?.parsed_data) {
        setProfile(profileRes.data.parsed_data);
      }
      if (resumesRes?.data && Array.isArray(resumesRes.data)) {
        setSavedResumes(resumesRes.data);
      }
      if (portfoliosRes?.data && Array.isArray(portfoliosRes.data)) {
        setSavedPortfolios(portfoliosRes.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard overview:', err);
    } finally {
      setLoading(false);
      setIsLoadingResumes(false);
      setIsLoadingPortfolios(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [getToken]);

  const handleDeleteResume = async (id) => {
    try {
      const headers = await getAuthHeaders(getToken);
      await api.delete(`/resumes/${id}`, headers);
      setSavedResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Error deleting resume:', err);
      setSavedResumes((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleDeletePortfolio = async (id) => {
    try {
      const headers = await getAuthHeaders(getToken);
      await api.delete(`/portfolios/${id}`, headers);
      setSavedPortfolios((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting portfolio:', err);
      setSavedPortfolios((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const personal = profile?.personal_info || {};
  const userName = user?.firstName || dbUser?.name || personal.full_name || 'Developer';

  const expCount = profile?.experiences?.length || 0;
  const projCount = profile?.projects?.length || 0;
  const skillCount = profile?.skills?.length || 0;
  const eduCount = profile?.education?.length || 0;
  const certCount = profile?.certifications?.length || 0;

  const dataHubCategories = [
    { title: 'Work Experience', count: expCount, label: 'Records', icon: Briefcase },
    { title: 'Key Projects', count: projCount, label: 'Projects', icon: FolderGit2 },
    { title: 'Skills & Tech Stack', count: skillCount, label: 'Categories', icon: Wrench },
    { title: 'Education', count: eduCount, label: 'Degrees', icon: GraduationCap },
    { title: 'Certifications', count: certCount, label: 'Verified', icon: Award },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently updated';
    try {
      const d = new Date(dateStr);
      return `Updated ${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } catch (e) {
      return 'Recently updated';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans text-zinc-900">
      
      {/* Objective 1: Welcome Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.firstName || 'Developer'}
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-normal">
            Manage your career assets, AI resume profile, and developer tools from your central command center.
          </p>
        </div>

        <Link
          to="/dashboard/resume"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Resume</span>
        </Link>
      </div>

      {/* Objective 2: Recent Assets Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left Column: Recent Resumes */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-700" />
              <h2 className="text-sm font-semibold text-zinc-900">Recent Resumes</h2>
            </div>
            <span className="text-[11px] font-medium text-zinc-400">
              {savedResumes.length} Saved
            </span>
          </div>

          <div className="space-y-2">
            {isLoadingResumes ? (
              <p className="text-xs text-zinc-400 py-6 text-center">Loading saved resumes...</p>
            ) : savedResumes.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-zinc-500">No resumes saved yet. Create your first resume to see it here.</p>
                <Link
                  to="/dashboard/resume"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Resume</span>
                </Link>
              </div>
            ) : (
              savedResumes.map((res) => (
                <div 
                  key={res.id}
                  className="flex items-center justify-between p-3 rounded-md bg-zinc-50 border border-zinc-200/80 hover:border-zinc-300 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-900 truncate block">
                        {res.title || "Untitled Resume"}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {formatDate(res.updated_at || res.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/resume?id=${res.id}`)}
                      className="px-2.5 py-1 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 text-[11px] font-medium rounded flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Edit className="w-3 h-3 text-zinc-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteResume(res.id)}
                      title="Delete Resume"
                      className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Favorite Portfolios */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-zinc-700" />
              <h2 className="text-sm font-semibold text-zinc-900">Favorite Portfolios</h2>
            </div>
            <span className="text-[11px] font-medium text-zinc-400">
              {savedPortfolios.length} Configured
            </span>
          </div>

          <div className="space-y-2">
            {isLoadingPortfolios ? (
              <p className="text-xs text-zinc-400 py-6 text-center">Loading saved portfolios...</p>
            ) : savedPortfolios.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-zinc-500">No portfolios saved yet. Generate a web portfolio to see it here.</p>
                <Link
                  to="/dashboard/portfolio"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate Portfolio</span>
                </Link>
              </div>
            ) : (
              savedPortfolios.map((port) => {
                const themeName = port.theme_config?.theme?.name || port.theme_config?.themeId || 'Tailwind Preset';
                return (
                  <div 
                    key={port.id}
                    className="flex items-center justify-between p-3 rounded-md bg-zinc-50 border border-zinc-200/80 hover:border-zinc-300 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-900 truncate block">
                          {port.title || "Untitled Portfolio"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        Theme: {themeName}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/portfolio?id=${port.id}`)}
                        className="px-2.5 py-1 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 text-[11px] font-medium rounded flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Edit className="w-3 h-3 text-zinc-600" />
                        <span>Edit / Open</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePortfolio(port.id)}
                        title="Delete Portfolio"
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Objective 3: Profile Data Hub (CRUD Access) */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-zinc-700" />
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Central Profile Data Hub</h2>
              <p className="text-[11px] text-zinc-500 font-normal">
                Directly manage your underlying database records. Changes automatically update across all resumes and portfolios.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {dataHubCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx}
                className="p-3.5 rounded-md bg-zinc-50 border border-zinc-200 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded bg-zinc-200/70 text-zinc-800 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-900 font-mono">
                    {loading ? '...' : cat.count} {cat.label}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-zinc-900">{cat.title}</h3>
                  <Link
                    to="/dashboard/resume"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 hover:text-zinc-900 mt-1 transition-colors"
                  >
                    <span>Edit / Manage</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Objective 4: Workspace Tools Grid (Cleaned & Purged with Accent Colors) */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">Workspace Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Tool 1: AI Resume Builder */}
          <Link
            to="/dashboard/resume"
            className="bg-white border border-zinc-200 hover:border-blue-300 transition-colors duration-200 rounded-lg p-5 shadow-sm flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                AI Resume Builder
              </h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                Parse PDF/Image resumes with Gemini AI, edit structured records, and export vector ATS PDFs.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-blue-600">
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Tool 2: Portfolio Generator */}
          <Link
            to="/dashboard/portfolio"
            className="bg-white border border-zinc-200 hover:border-blue-300 transition-colors duration-200 rounded-lg p-5 shadow-sm flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Code2 className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-semibold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                Portfolio Generator
              </h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                Generate interactive, responsive developer portfolio websites from your parsed database profile.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Tool 3: Cover Letter Writer */}
          <Link
            to="/dashboard/cover-letter"
            className="bg-white border border-zinc-200 hover:border-blue-300 transition-colors duration-200 rounded-lg p-5 shadow-sm flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-semibold text-zinc-900 group-hover:text-purple-600 transition-colors">
                Cover Letter Writer
              </h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                Tailor targeted cover letters to specific job descriptions with automated AI alignment.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-purple-600">
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Tool 4: ATS Score Evaluator */}
          <Link
            to="/dashboard/ats"
            className="bg-white border border-zinc-200 hover:border-blue-300 transition-colors duration-200 rounded-lg p-5 shadow-sm flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-semibold text-zinc-900 group-hover:text-amber-600 transition-colors">
                ATS Score Evaluator
              </h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                Analyze your resume against ATS scanner rules and keyword optimization metrics.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-amber-600">
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
};

export default DashboardOverview;
