import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import api, { getAuthHeaders } from '../api';
import ResumePreview from '../components/ResumePreview';
import ResumeLivePreview, { templateOptions } from '../components/ResumeLivePreview';
import {
  Upload,
  FileText,
  Loader2,
  Save,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Code2,
  Award,
  Trophy,
  Users,
  Info,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Eye,
} from 'lucide-react';

const defaultParsedData = {
  personal_info: {
    full_name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    github_url: '',
    linkedin_url: '',
    website_url: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  leadership: [],
  additional_info: [],
};

const Dashboard = () => {
  const { getToken } = useAuth();
  const [profileData, setProfileData] = useState(defaultParsedData);
  const [resumeTitle, setResumeTitle] = useState("Software Engineer Resume 2026");
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewMode, setPreviewMode] = useState('default'); // 'default' | 'vision'
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeIdParam = searchParams.get('id');

  // Fetch current user profile or specific resume on mount
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders(getToken);

      if (resumeIdParam) {
        try {
          const res = await api.get(`/resumes/${resumeIdParam}`, headers);
          if (res.data) {
            setCurrentResumeId(res.data.id);
            setResumeTitle(res.data.title || "Untitled Resume");
            if (res.data.content) {
              setProfileData({
                personal_info: res.data.content.personal_info || defaultParsedData.personal_info,
                experiences: res.data.content.experiences || res.data.content.experience || [],
                education: res.data.content.education || [],
                skills: res.data.content.skills || [],
                projects: res.data.content.projects || [],
                certifications: res.data.content.certifications || [],
                achievements: res.data.content.achievements || [],
                leadership: res.data.content.leadership || [],
                additional_info: res.data.content.additional_info || res.data.content.additionalInfo || [],
              });
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn("Could not load resume by ID, falling back to profile:", e);
        }
      }

      const response = await api.get('/profile', headers);
      if (response.data && response.data.parsed_data) {
        setProfileData({
          personal_info: response.data.parsed_data.personal_info || defaultParsedData.personal_info,
          experiences: response.data.parsed_data.experiences || response.data.parsed_data.experience || [],
          education: response.data.parsed_data.education || [],
          skills: response.data.parsed_data.skills || [],
          projects: response.data.parsed_data.projects || [],
          certifications: response.data.parsed_data.certifications || [],
          achievements: response.data.parsed_data.achievements || [],
          leadership: response.data.parsed_data.leadership || [],
          additional_info: response.data.parsed_data.additional_info || response.data.parsed_data.additionalInfo || [],
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to load profile data.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [resumeIdParam, getToken]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Handle Resume Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file to upload.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const authHeaders = await getAuthHeaders(getToken);
      const response = await api.post('/profile/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(authHeaders.headers || {}),
        },
      });

      if (response.data && response.data.parsed_data) {
        setProfileData({
          personal_info: response.data.parsed_data.personal_info || defaultParsedData.personal_info,
          experiences: response.data.parsed_data.experiences || response.data.parsed_data.experience || [],
          education: response.data.parsed_data.education || [],
          skills: response.data.parsed_data.skills || [],
          projects: response.data.parsed_data.projects || [],
          certifications: response.data.parsed_data.certifications || [],
          achievements: response.data.parsed_data.achievements || [],
          leadership: response.data.parsed_data.leadership || [],
          additional_info: response.data.parsed_data.additional_info || response.data.parsed_data.additionalInfo || [],
        });
        setMessage({
          type: 'success',
          text: 'Resume processed & parsed successfully by AI!',
        });
        setSelectedFile(null);
      }
    } catch (err) {
      console.error('Error uploading resume:', err);
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map(e => e.msg || JSON.stringify(e)).join(', ') : 'Failed to parse resume. Please ensure file is valid.');
      setMessage({
        type: 'error',
        text: errorMsg,
      });
    } finally {
      setUploading(false);
    }
  };

  const cleanNullPayload = (obj) => {
    if (obj === undefined) return null;
    if (obj === null) return null;
    if (Array.isArray(obj)) return obj.map(cleanNullPayload);
    if (typeof obj === 'object') {
      const cleaned = {};
      for (const key of Object.keys(obj)) {
        cleaned[key] = cleanNullPayload(obj[key]);
      }
      return cleaned;
    }
    return obj;
  };

  // Handle Save Resume
  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payloadData = cleanNullPayload(profileData);
      const headers = await getAuthHeaders(getToken);
      
      // 1. Sync to central user profile
      await api.put('/profile', {
        parsed_data: payloadData,
      }, headers).catch(() => null);

      // 2. Save/Update record in /resumes DB
      const resumeRes = await api.post('/resumes', {
        id: currentResumeId || undefined,
        title: resumeTitle || "Untitled Resume",
        content: payloadData,
      }, headers);

      if (resumeRes.data && resumeRes.data.id) {
        setCurrentResumeId(resumeRes.data.id);
      }

      setMessage({
        type: 'success',
        text: `Resume "${resumeTitle || 'Untitled Resume'}" saved successfully!`,
      });
    } catch (err) {
      console.error('Error saving resume:', err);
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map(e => e.msg || JSON.stringify(e)).join(', ') : 'Failed to save resume document.');
      setMessage({
        type: 'error',
        text: errorMsg,
      });
    } finally {
      setSaving(false);
    }
  };

  // State Mutators for Personal Info
  const updatePersonalInfo = (field, value) => {
    setProfileData((prev) => {
      const personal = { ...(prev.personal_info || {}), [field]: value };
      if (field === 'summary') {
        personal.bio = value;
      }
      return {
        ...prev,
        personal_info: personal,
      };
    });
  };

  // Array Card Helpers
  const addItem = (section, template) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), template],
    }));
  };

  const updateItem = (section, index, field, value) => {
    setProfileData((prev) => {
      const list = [...(prev[section] || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [section]: list };
    });
  };

  const removeItem = (section, index) => {
    setProfileData((prev) => {
      const list = [...(prev[section] || [])];
      list.splice(index, 1);
      return { ...prev, [section]: list };
    });
  };

  /* OBJECTIVE 2 & 3: Immutable Experience & Project Bullet Points CRUD Handlers */
  const addExperienceBullet = (expIndex) => {
    setProfileData((prev) => {
      const list = [...(prev.experiences || [])];
      const exp = { ...list[expIndex] };
      const rawBullets = Array.isArray(exp.highlights) && exp.highlights.length > 0
        ? exp.highlights
        : (Array.isArray(exp.description) ? exp.description : (exp.description ? exp.description.split('\n') : []));
      const bullets = [...rawBullets, ''];
      exp.highlights = bullets;
      exp.description = bullets;
      list[expIndex] = exp;
      return { ...prev, experiences: list };
    });
  };

  const updateExperienceBullet = (expIndex, bulletIndex, value) => {
    setProfileData((prev) => {
      const list = [...(prev.experiences || [])];
      const exp = { ...list[expIndex] };
      const rawBullets = Array.isArray(exp.highlights) && exp.highlights.length > 0
        ? exp.highlights
        : (Array.isArray(exp.description) ? exp.description : (exp.description ? exp.description.split('\n') : []));
      const bullets = rawBullets.map((item, idx) => (idx === bulletIndex ? value : item));
      exp.highlights = bullets;
      exp.description = bullets;
      list[expIndex] = exp;
      return { ...prev, experiences: list };
    });
  };

  const removeExperienceBullet = (expIndex, bulletIndex) => {
    setProfileData((prev) => {
      const list = [...(prev.experiences || [])];
      const exp = { ...list[expIndex] };
      const rawBullets = Array.isArray(exp.highlights) && exp.highlights.length > 0
        ? exp.highlights
        : (Array.isArray(exp.description) ? exp.description : (exp.description ? exp.description.split('\n') : []));
      const bullets = rawBullets.filter((_, idx) => idx !== bulletIndex);
      exp.highlights = bullets;
      exp.description = bullets;
      list[expIndex] = exp;
      return { ...prev, experiences: list };
    });
  };

  const addProjectBullet = (projIndex) => {
    setProfileData((prev) => {
      const list = [...(prev.projects || [])];
      const proj = { ...list[projIndex] };
      const rawBullets = Array.isArray(proj.highlights) && proj.highlights.length > 0
        ? proj.highlights
        : (Array.isArray(proj.bullet_points) && proj.bullet_points.length > 0
            ? proj.bullet_points
            : (proj.description ? (Array.isArray(proj.description) ? proj.description : proj.description.split('\n')) : []));
      const bullets = [...rawBullets, ''];
      proj.highlights = bullets;
      proj.bullet_points = bullets;
      list[projIndex] = proj;
      return { ...prev, projects: list };
    });
  };

  const updateProjectBullet = (projIndex, bulletIndex, value) => {
    setProfileData((prev) => {
      const list = [...(prev.projects || [])];
      const proj = { ...list[projIndex] };
      const rawBullets = Array.isArray(proj.highlights) && proj.highlights.length > 0
        ? proj.highlights
        : (Array.isArray(proj.bullet_points) && proj.bullet_points.length > 0
            ? proj.bullet_points
            : (proj.description ? (Array.isArray(proj.description) ? proj.description : proj.description.split('\n')) : []));
      const bullets = rawBullets.map((item, idx) => (idx === bulletIndex ? value : item));
      proj.highlights = bullets;
      proj.bullet_points = bullets;
      list[projIndex] = proj;
      return { ...prev, projects: list };
    });
  };

  const removeProjectBullet = (projIndex, bulletIndex) => {
    setProfileData((prev) => {
      const list = [...(prev.projects || [])];
      const proj = { ...list[projIndex] };
      const rawBullets = Array.isArray(proj.highlights) && proj.highlights.length > 0
        ? proj.highlights
        : (Array.isArray(proj.bullet_points) && proj.bullet_points.length > 0
            ? proj.bullet_points
            : (proj.description ? (Array.isArray(proj.description) ? proj.description : proj.description.split('\n')) : []));
      const bullets = rawBullets.filter((_, idx) => idx !== bulletIndex);
      proj.highlights = bullets;
      proj.bullet_points = bullets;
      list[projIndex] = proj;
      return { ...prev, projects: list };
    });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
          <p className="text-gray-500 text-xs font-medium">Loading AI Resume Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Action Header & Global Notification */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div>
          <h1 className="text-lg font-bold text-gray-900">AI Resume Builder</h1>
          <p className="text-xs text-gray-500">Edit your parsed resume profile or upload a new file.</p>
        </div>

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Global Notification Banner */}
      {message.text && (
        <div
          className={`p-3 rounded border flex items-center justify-between text-xs ${
            message.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {message.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage({ type: '', text: '' })}
            className="text-[11px] opacity-70 hover:opacity-100 underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2-Column Split Screen Layout (Live Preview above Editor on Mobile) */}
      <div className="flex flex-col lg:flex-row gap-6 relative items-start">
        {/* LEFT COLUMN: Upload Area & Modular Editor (Order 2 on mobile, Order 1 on LG) */}
        <div className="w-full lg:w-1/2 flex-1 space-y-5 order-2 lg:order-1">
          {/* Resume Upload Area */}
          <section className="bg-white rounded p-4 border border-gray-200 shadow-sm relative">
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-blue-700 text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Resume Ingestion
                </div>
                <h2 className="text-sm font-bold text-gray-900">Upload Resume File</h2>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Upload your resume (PDF/JPEG/PNG/TXT) to extract data directly into the editor and live preview.
                </p>
              </div>

              <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept=".pdf,.jpeg,.jpg,.png,.txt"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    id="resume-file-input"
                  />
                  <label
                    htmlFor="resume-file-input"
                    className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 hover:border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 cursor-pointer transition-colors"
                  >
                    <span className="truncate max-w-[200px]">
                      {selectedFile ? selectedFile.name : 'Choose PDF, JPEG, PNG, or TXT file...'}
                    </span>
                    <span className="bg-white border border-gray-200 rounded px-2 py-0.5 text-[10px] font-medium text-gray-600 shrink-0">
                      Browse
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs shrink-0"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      Parse
                    </>
                  )}
                </button>
              </form>
            </div>

            {uploading && (
              <div className="mt-3 p-2 rounded bg-blue-50 border border-blue-200 flex items-center gap-2 animate-pulse">
                <Loader2 className="w-4 h-4 text-blue-700 animate-spin shrink-0" />
                <p className="text-[11px] font-medium text-blue-800">
                  <span className="hidden sm:inline">Gemini AI is parsing your resume...</span>
                  <span className="sm:hidden">Parsing document...</span>
                </p>
              </div>
            )}
          </section>

          {/* Modular Profile Editor Cards */}
          <div className="space-y-4">
            {/* Resume Document Naming Banner */}
            <div className="bg-white rounded p-3.5 border border-gray-200 shadow-sm space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Resume Document Name
              </label>
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder="e.g. Full Stack Resume - PDF, Software Engineer 2026"
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-3 py-1.5 text-xs font-semibold text-gray-900 outline-none transition-colors"
              />
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h2 className="text-sm font-bold text-gray-900">Modular Profile Editor</h2>
              <span className="text-[11px] text-gray-500 font-medium">Real-time updates</span>
            </div>

            {/* Personal Info Card */}
            <div className="bg-white border border-gray-200 rounded p-4 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs border-b border-gray-200 pb-2">
                <User className="w-4 h-4" />
                <span>Personal Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.personal_info?.full_name || ''}
                    onChange={(e) => updatePersonalInfo('full_name', e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={profileData.personal_info?.title || ''}
                    onChange={(e) => updatePersonalInfo('title', e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileData.personal_info?.email || ''}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Phone</label>
                  <input
                    type="text"
                    value={profileData.personal_info?.phone || ''}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={profileData.personal_info?.location || ''}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    placeholder="San Francisco, CA"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={profileData.personal_info?.github_url || ''}
                    onChange={(e) => updatePersonalInfo('github_url', e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={profileData.personal_info?.linkedin_url || ''}
                    onChange={(e) => updatePersonalInfo('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Website / Portfolio</label>
                  <input
                    type="text"
                    value={profileData.personal_info?.website_url || ''}
                    onChange={(e) => updatePersonalInfo('website_url', e.target.value)}
                    placeholder="https://alexmorgan.dev"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Professional Summary</label>
                <textarea
                  rows={4}
                  value={profileData.personal_info?.summary || ''}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  placeholder="Craft a concise professional summary highlighting key technical competencies and career achievements..."
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded p-2.5 text-xs text-gray-900 outline-none resize-y font-sans"
                />
              </div>
            </div>

            {/* Technical Skills Editor Card */}
            <div className="bg-white border border-gray-200 rounded p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs">
                  <Wrench className="w-4 h-4" />
                  <span>Technical Skills ({profileData.skills?.length || 0} Categories)</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem('skills', {
                      category: 'Languages & Frameworks',
                      items: [],
                    })
                  }
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-700" /> Add Skill Category
                </button>
              </div>

              {profileData.skills?.map((sk, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Skill Category (e.g., Languages, Frameworks, Cloud)"
                      value={sk.category || ''}
                      onChange={(e) => updateItem('skills', idx, 'category', e.target.value)}
                      className="bg-white border border-gray-200 focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 font-semibold outline-none flex-1 mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem('skills', idx)}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Enter skills separated by commas or newlines (e.g. Python, React, FastAPI)..."
                    value={Array.isArray(sk.items) ? sk.items.join(', ') : (sk.items || '')}
                    onChange={(e) => {
                      const rawInput = e.target.value;
                      const parsedSkills = rawInput
                        .split(/[\n,]/)
                        .map(s => s.trim())
                        .filter(s => s.length > 0);
                      updateItem('skills', idx, 'items', parsedSkills);
                    }}
                    className="w-full bg-white border border-gray-200 focus:border-blue-700 rounded p-2 text-xs text-gray-900 outline-none resize-none font-sans"
                  />
                </div>
              ))}
            </div>

            {/* OBJECTIVE 1: Work Experience with Explicit Dynamic Bullet Point CRUD UI */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs">
                  <Briefcase className="w-4 h-4" />
                  <span>Work Experience ({profileData.experiences?.length || 0})</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem('experiences', {
                      company: 'Company Name',
                      role: 'Software Engineer',
                      start_date: '2022',
                      end_date: 'Present',
                      description: ['Spearheaded microservice development', 'Optimized database queries'],
                      highlights: [],
                    })
                  }
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-700" /> Add Experience
                </button>
              </div>

              {profileData.experiences?.map((exp, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded p-3.5 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-xs font-bold text-blue-700">Experience #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeItem('experiences', idx)}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company || ''}
                      onChange={(e) => updateItem('experiences', idx, 'company', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Role Title"
                      value={exp.role || ''}
                      onChange={(e) => updateItem('experiences', idx, 'role', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Start Date"
                      value={exp.start_date || ''}
                      onChange={(e) => updateItem('experiences', idx, 'start_date', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="End Date"
                      value={exp.end_date || ''}
                      onChange={(e) => updateItem('experiences', idx, 'end_date', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                  </div>

                  {/* Objective 1: Explicit Bullet Points List with Add/Remove/Update Handlers */}
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-gray-700">
                        Bullet Points / Key Responsibilities
                      </label>
                      <button
                        type="button"
                        onClick={() => addExperienceBullet(idx)}
                        className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet Point
                      </button>
                    </div>

                    {(() => {
                      const bullets = Array.isArray(exp.description)
                        ? exp.description
                        : (exp.description ? exp.description.split('\n') : []);

                      if (bullets.length === 0) {
                        return (
                          <p className="text-[11px] text-gray-400 italic">No bullet points added yet. Click "+ Add Bullet Point" to add lines.</p>
                        );
                      }

                      return (
                        <div className="space-y-1.5">
                          {bullets.map((bulletStr, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-1.5">
                              <span className="text-blue-600 font-bold text-xs shrink-0">•</span>
                              <input
                                type="text"
                                placeholder={`Bullet point #${bIdx + 1}...`}
                                value={bulletStr}
                                onChange={(e) => updateExperienceBullet(idx, bIdx, e.target.value)}
                                className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none flex-1 font-sans"
                              />
                              <button
                                type="button"
                                onClick={() => removeExperienceBullet(idx, bIdx)}
                                className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer shrink-0"
                                title="Remove bullet point"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education ({profileData.education?.length || 0})</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem('education', {
                      institution: 'University',
                      degree: 'Bachelor of Science',
                      field_of_study: 'Computer Science',
                      start_date: '2019',
                      end_date: '2023',
                      gpa: '',
                    })
                  }
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-700" /> Add Item
                </button>
              </div>

              {profileData.education?.map((edu, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded p-3.5 space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-700">Education #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeItem('education', idx)}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution || ''}
                      onChange={(e) => updateItem('education', idx, 'institution', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree || ''}
                      onChange={(e) => updateItem('education', idx, 'degree', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={edu.field_of_study || ''}
                      onChange={(e) => updateItem('education', idx, 'field_of_study', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="GPA"
                      value={edu.gpa || ''}
                      onChange={(e) => updateItem('education', idx, 'gpa', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Key Projects */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs">
                  <Code2 className="w-4 h-4" />
                  <span>Projects ({profileData.projects?.length || 0})</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem('projects', {
                      title: 'Project Title',
                      description: 'Project description',
                      technologies: [],
                      repo_url: '',
                      live_url: '',
                    })
                  }
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-700" /> Add Project
                </button>
              </div>

              {profileData.projects?.map((proj, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded p-3.5 space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-700">Project #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeItem('projects', idx)}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title || proj.name || ''}
                      onChange={(e) => updateItem('projects', idx, 'title', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Technologies (comma separated)"
                      value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || '')}
                      onChange={(e) => updateItem('projects', idx, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                  </div>

                  {/* GitHub & Live Demo URL Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input 
                      type="url" 
                      placeholder="GitHub URL (optional)" 
                      value={proj.githubUrl || proj.repo_url || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateItem('projects', idx, 'githubUrl', val);
                        updateItem('projects', idx, 'repo_url', val);
                      }}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <input 
                      type="url" 
                      placeholder="Live Demo URL (optional)" 
                      value={proj.liveUrl || proj.live_url || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateItem('projects', idx, 'liveUrl', val);
                        updateItem('projects', idx, 'live_url', val);
                      }}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                  </div>

                  {/* Objective 3: Explicit Project Bullet Points List with Add/Remove/Update Handlers */}
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-gray-700">
                        Project Highlights / Bullet Points
                      </label>
                      <button
                        type="button"
                        onClick={() => addProjectBullet(idx)}
                        className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet Point
                      </button>
                    </div>

                    {(() => {
                      const bullets = Array.isArray(proj.highlights) && proj.highlights.length > 0
                        ? proj.highlights
                        : (Array.isArray(proj.bullet_points) && proj.bullet_points.length > 0
                            ? proj.bullet_points
                            : (proj.description
                                ? (Array.isArray(proj.description) ? proj.description : proj.description.split('\n'))
                                : []));

                      if (bullets.length === 0) {
                        return (
                          <p className="text-[11px] text-gray-400 italic">No bullet points added yet. Click "+ Add Bullet Point" to add lines.</p>
                        );
                      }

                      return (
                        <div className="space-y-1.5">
                          {bullets.map((bulletStr, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-1.5">
                              <span className="text-blue-600 font-bold text-xs shrink-0">•</span>
                              <input
                                type="text"
                                placeholder={`Project highlight #${bIdx + 1}...`}
                                value={bulletStr}
                                onChange={(e) => updateProjectBullet(idx, bIdx, e.target.value)}
                                className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none flex-1 font-sans"
                              />
                              <button
                                type="button"
                                onClick={() => removeProjectBullet(idx, bIdx)}
                                className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer shrink-0"
                                title="Remove bullet point"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs">
                  <Award className="w-4 h-4" />
                  <span>Certifications ({profileData.certifications?.length || 0})</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem('certifications', {
                      name: 'AWS Certified Solutions Architect',
                      issuer: 'Amazon Web Services',
                      issue_date: '2024',
                      expiration_date: '2027',
                      credential_url: '',
                    })
                  }
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-700" /> Add Certification
                </button>
              </div>

              {profileData.certifications?.map((cert, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded p-3.5 space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-700">Certification #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeItem('certifications', idx)}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Certification Name (e.g. AWS Certified)"
                      value={cert.name || ''}
                      onChange={(e) => updateItem('certifications', idx, 'name', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Issuer (e.g. Amazon)"
                      value={cert.issuer || ''}
                      onChange={(e) => updateItem('certifications', idx, 'issuer', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Issue Date (issue_date)"
                      value={cert.issue_date || cert.date || ''}
                      onChange={(e) => updateItem('certifications', idx, 'issue_date', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Expiration Date (expiration_date)"
                      value={cert.expiration_date || ''}
                      onChange={(e) => updateItem('certifications', idx, 'expiration_date', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Credential URL (for verification)"
                    value={cert.credential_url || ''}
                    onChange={(e) => updateItem('certifications', idx, 'credential_url', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Achievements & Awards Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Achievements & Honors ({profileData.achievements?.length || 0})</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem('achievements', {
                      title: '',
                      description: '',
                    })
                  }
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-700" /> Add Achievement
                </button>
              </div>

              {profileData.achievements?.map((ach, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded p-3.5 space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-700">Achievement #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeItem('achievements', idx)}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Achievement Title (e.g. First Place - AI Hackathon)"
                      value={typeof ach === 'string' ? ach : (ach.title || '')}
                      onChange={(e) => updateItem('achievements', idx, 'title', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <textarea
                      rows={2}
                      placeholder="Brief description..."
                      value={typeof ach === 'object' ? (ach.description || '') : ''}
                      onChange={(e) => updateItem('achievements', idx, 'description', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded p-2 text-xs text-gray-900 outline-none resize-none font-sans"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Leadership & Activities */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs">
                  <Users className="w-4 h-4" />
                  <span>Leadership & Activities ({profileData.leadership?.length || 0})</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem('leadership', {
                      role: 'Lead Lead Developer / VP Student Body',
                      organization: 'Tech Community / Club',
                      description: 'Led technical workshops and managed student developer teams.',
                    })
                  }
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-700" /> Add Leadership
                </button>
              </div>

              {profileData.leadership?.map((lead, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded p-3.5 space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-700">Leadership #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeItem('leadership', idx)}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Role (e.g. President / Founder)"
                      value={lead.role || ''}
                      onChange={(e) => updateItem('leadership', idx, 'role', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Organization (e.g. ACM Student Chapter)"
                      value={lead.organization || ''}
                      onChange={(e) => updateItem('leadership', idx, 'organization', e.target.value)}
                      className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Brief description of leadership activity..."
                    value={lead.description || ''}
                    onChange={(e) => updateItem('leadership', idx, 'description', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded p-2 text-xs text-gray-900 outline-none resize-none font-sans"
                  />
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs">
                  <Info className="w-4 h-4" />
                  <span>Additional Information ({Array.isArray(profileData.additional_info) ? profileData.additional_info.length : 1})</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem('additional_info', {
                      category: 'Languages & Interests',
                      details: 'English (Native), Telugu (Native), Competitive Programming, Open Source Contributing',
                    })
                  }
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-700" /> Add Info Block
                </button>
              </div>

              {Array.isArray(profileData.additional_info) ? (
                profileData.additional_info.map((infoItem, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded p-3.5 space-y-2.5 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-700">Additional Info #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeItem('additional_info', idx)}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Category / Heading (e.g. Languages / Clearance)"
                        value={typeof infoItem === 'string' ? 'Details' : (infoItem.category || '')}
                        onChange={(e) => updateItem('additional_info', idx, 'category', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded px-2.5 py-1 text-xs text-gray-900 outline-none"
                      />
                      <textarea
                        rows={2}
                        placeholder="Details (e.g. English, German, Security Clearance, US Citizen)..."
                        value={typeof infoItem === 'string' ? infoItem : (infoItem.details || infoItem.description || '')}
                        onChange={(e) => updateItem('additional_info', idx, 'details', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-700 rounded p-2 text-xs text-gray-900 outline-none resize-none font-sans"
                      />
                    </div>
                  </div>
                ))
              ) : null}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Live Resume Preview (Order 1 on Mobile, Order 2 on LG) */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] overflow-y-auto space-y-2.5 order-1 lg:order-2">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-700" />
              <h2 className="text-sm font-bold text-gray-900 tracking-tight">Live Resume Preview</h2>
            </div>

            {/* Template Selector Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-gray-500 hidden sm:inline">Template:</span>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="bg-white border border-gray-200 text-xs font-semibold text-gray-800 rounded px-2 py-1 outline-none focus:border-blue-700 cursor-pointer shadow-2xs"
              >
                {templateOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Template Container View */}
          <div className="rounded p-1 bg-gray-50 border border-gray-200 shadow-sm min-w-0 min-h-0 w-full overflow-hidden">
            <ResumeLivePreview
              resumeData={profileData}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
