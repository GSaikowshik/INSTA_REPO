import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Cropper from 'react-easy-crop';
import api, { getAuthHeaders } from '../api';

import { themeMatrix } from '../utils/themeMatrix';
import { 
  Sparkles, 
  Upload, 
  RefreshCw, 
  Loader2, 
  User, 
  Check, 
  ExternalLink, 
  Code, 
  Terminal, 
  Layers, 
  FileText,
  Eye,
  EyeOff,
  Download,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  Mail,
  Palette,
  Bookmark,
  Award,
  Trophy,
  Camera
} from 'lucide-react';



/* --- DYNAMIC FRONTEND URL RESOLUTION UTILITY --- */
const getFullImageUrl = (url) => {
  if (!url) return null;
  // Bypass absolute URLs AND Base64 data strings AND frontend public assets
  if (url.startsWith('http') || url.startsWith('data:image')) {
    return url;
  }
  if (url.startsWith('/uploads') || url.startsWith('uploads')) {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${backendUrl}${url.startsWith('/') ? url : '/' + url}`;
  }
  return url;
};

/* --- CANVAS CROPPER EXTRACTION HELPER --- */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!pixelCrop || !pixelCrop.width || !pixelCrop.height) {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  } else {
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.95);
  });
};

const getInitials = (name) => {
  if (!name) return "U"; // Fallback to "U" for Unknown/User
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/* --- UPSCALED AVATAR IMAGE WITH HOVER DROPZONE & ERROR FALLBACK --- */
const AvatarImage = ({ src, name, sizeClass = "w-32 h-32 md:w-40 md:h-40 border-4 border-current/20 shadow-xl", onSelectFile }) => {
  const [hasError, setHasError] = useState(false);

  const initials = getInitials(name);
  const resolvedUrl = getFullImageUrl(src);

  const avatarContent = (!resolvedUrl || hasError) ? (
    <div className={`${sizeClass} rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border-4 border-current/20 shadow-xl text-lg tracking-wider shrink-0`}>
      {initials}
    </div>
  ) : (
    <img 
      src={resolvedUrl} 
      alt={name || "Candidate Avatar"} 
      onError={() => setHasError(true)}
      className={`${sizeClass} rounded-full object-cover border-4 border-current/20 shadow-xl shrink-0`}
    />
  );

  if (onSelectFile) {
    return (
      <label className="relative group cursor-pointer inline-block shrink-0" title="Click to upload & crop profile photo">
        <input 
          type="file" 
          accept="image/*" 
          onChange={onSelectFile} 
          className="hidden" 
        />
        {avatarContent}
        {/* Hover Dropzone Overlay */}
        <div className={`absolute inset-0 rounded-full bg-slate-900/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-xs font-bold tracking-wider text-center p-2 backdrop-blur-[2px]`}>
          <Camera className="w-6 h-6 mb-1" />
          <span>Change Photo</span>
        </div>
      </label>
    );
  }

  return avatarContent;
};

/* --- CERTIFICATIONS SUB-COMPONENT --- */
const CertificationsSection = ({ data }) => {
  const list = Array.isArray(data) ? data : [];
  if (!list.length) return null;

  return (
    <div className="pb-8 border-b border-current/15 space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-1.5">
        <Award className="w-3.5 h-3.5 text-amber-500" />
        <span>Certifications & Industry Credentials</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((cert, idx) => (
          <div key={cert.id || idx} className="space-y-1 py-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-current">{cert.name}</h4>
              <span className="text-[10px] font-mono opacity-60">{cert.issue_date || cert.date}</span>
            </div>
            <p className="text-xs opacity-75 font-medium">{cert.issuer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- ACHIEVEMENTS SUB-COMPONENT --- */
const AchievementsSection = ({ data }) => {
  const list = Array.isArray(data) ? data : [];
  if (!list.length) return null;

  return (
    <div className="pb-8 border-b border-current/15 space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-1.5">
        <Trophy className="w-3.5 h-3.5 text-yellow-500" />
        <span>Key Honors & Notable Achievements</span>
      </h3>
      <div className="space-y-3">
        {list.map((ach, idx) => (
          <div key={ach.id || idx} className="flex items-start gap-2.5 text-xs">
            <span className="text-emerald-500 font-bold mt-0.5">•</span>
            <div className="space-y-0.5">
              <h4 className="font-bold opacity-95">{ach.title || (typeof ach === 'string' ? ach : '')}</h4>
              {ach.description && <p className="opacity-75 leading-relaxed">{ach.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- MASTER MAIN PORTFOLIO GENERATOR --- */
const PortfolioGenerator = () => {
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const portfolioIdParam = searchParams.get('id');

  const [masterPayload, setMasterPayload] = useState({
    theme: {
      layout: 'editorial',
      palette: 'slate',
      fontFamily: 'sans',
      heroStyle: 'split-avatar'
    },
    data: {
      personal_info: {},
      experiences: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      achievements: []
    }
  });
  const [selectedThemeId, setSelectedThemeId] = useState('tokyo-minimal');
  const [portfolioTitle, setPortfolioTitle] = useState("Tokyo Minimalist Suite");
  const [currentPortfolioId, setCurrentPortfolioId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSaved, setIsSaved] = useState(false);

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [savingCrop, setSavingCrop] = useState(false);

  const fileInputRef = useRef(null);
  const currentTheme = themeMatrix.find(t => t.id === selectedThemeId) || themeMatrix[0];

  /* OBJECTIVE 2: Connect Portfolio Generator to Live PostgreSQL Profile Data & Saved Portfolios */
  useEffect(() => {
    const fetchLivePortfolioData = async () => {
      try {
        const headers = await getAuthHeaders(getToken);

        if (portfolioIdParam) {
          try {
            const portRes = await api.get(`/portfolios/${portfolioIdParam}`, headers);
            if (portRes.data) {
              setCurrentPortfolioId(portRes.data.id);
              setPortfolioTitle(portRes.data.title || "Untitled Portfolio");
              if (portRes.data.theme_config) {
                const savedId = portRes.data.theme_config.themeId || portRes.data.theme_config.selectedThemeId || portRes.data.theme_config.theme?.id;
                if (savedId && themeMatrix.some(t => t.id === savedId)) {
                  setSelectedThemeId(savedId);
                }
              }
              if (portRes.data.content && Object.keys(portRes.data.content).length > 0) {
                setMasterPayload(prev => ({
                  ...prev,
                  data: portRes.data.content
                }));
                return;
              }
            }
          } catch (e) {
            console.warn("Could not load portfolio by ID, falling back to profile:", e);
          }
        }

        const response = await api.get('/profile', headers);
        if (response.data && response.data.parsed_data) {
          const parsed = response.data.parsed_data;
          setMasterPayload((prev) => ({
            ...prev,
            data: {
              personal_info: parsed.personal_info || {},
              experiences: parsed.experiences || parsed.experience || [],
              education: parsed.education || [],
              skills: parsed.skills || [],
              projects: parsed.projects || [],
              certifications: parsed.certifications || [],
              achievements: parsed.achievements || [],
            }
          }));
        }
      } catch (err) {
        console.error('Error fetching live portfolio profile data:', err);
      }
    };
    fetchLivePortfolioData();
  }, [portfolioIdParam, getToken]);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSelectFileToCrop = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setIsCropModalOpen(true);
    });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveCroppedAvatar = async () => {
    if (!imageSrc) return;
    setSavingCrop(true);
    setMessage({ type: '', text: '' });

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append('file', croppedBlob, 'avatar_cropped.jpg');

      const authHeaders = await getAuthHeaders(getToken);
      const response = await api.post('/portfolio/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(authHeaders.headers || {}),
        },
      });

      const uploadedUrl = response.data?.photo_url || response.data?.photoUrl;

      if (uploadedUrl) {
        setMasterPayload((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            personal_info: {
              ...(prev.data?.personal_info || {}),
              photo_url: uploadedUrl,
            }
          }
        }));
        setIsCropModalOpen(false);
        setImageSrc(null);
        setMessage({ type: 'success', text: 'Avatar cropped & uploaded to PostgreSQL profile!' });
      }
    } catch (err) {
      console.error('Crop avatar upload error:', err);
      setMessage({ type: 'error', text: 'Failed to save cropped avatar.' });
    } finally {
      setSavingCrop(false);
    }
  };

  const fetchGeneratePortfolio = () => {
    setIsGenerating(true);
    setMessage({ type: '', text: '' });
    try {
      const randomTheme = themeMatrix[Math.floor(Math.random() * themeMatrix.length)];
      setSelectedThemeId(randomTheme.id);
      setMessage({ 
        type: 'success', 
        text: `Switched Vibe to "${randomTheme.name}" theme preset (${themeMatrix.length} Themes Available)` 
      });
    } catch (err) {
      console.error('Error selecting random vibe theme:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTheme = async () => {
    setSavingTheme(true);
    setMessage({ type: '', text: '' });
    try {
      const headers = await getAuthHeaders(getToken);
      // 1. Sync theme to profile
      await api.post('/portfolio/save-theme', {
        theme: currentTheme
      }, headers).catch(() => null);

      // 2. Save/Update record in /portfolios DB
      const response = await api.post('/portfolios', {
        id: currentPortfolioId || undefined,
        title: portfolioTitle || "Untitled Portfolio",
        theme_config: {
          themeId: selectedThemeId,
          theme: currentTheme
        },
        content: masterPayload.data
      }, headers);

      if (response.data && response.data.id) {
        setCurrentPortfolioId(response.data.id);
        setIsSaved(true);
        setMessage({ type: 'success', text: `Portfolio "${portfolioTitle || 'Untitled Portfolio'}" saved successfully!` });
        setTimeout(() => {
          setIsSaved(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error saving portfolio:', err);
      setMessage({ type: 'error', text: 'Failed to save portfolio configuration.' });
    } finally {
      setSavingTheme(false);
    }
  };

  const handleExport = () => {
    const data = masterPayload.data || {};
    const personal = data.personal_info || {};
    const experiences = data.experiences || [];
    const projects = data.projects || [];
    const skills = data.skills || [];
    const certifications = data.certifications || [];
    const achievements = data.achievements || [];

    const rawPhotoUrl = personal.photo_url || personal.photoUrl || '';
    const photoUrl = getFullImageUrl(rawPhotoUrl);
    const name = personal.full_name || 'Developer';
    const initials = name.trim().split(/\s+/).filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'D';

    const avatarHtml = photoUrl ? `
      <img src="${photoUrl}" alt="${name}" class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-current/20 shadow-xl shrink-0" onError="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
      <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border-4 border-current/20 text-lg tracking-wider shrink-0 shadow-xl" style="display: none;">${initials}</div>
    ` : `
      <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border-4 border-current/20 text-lg tracking-wider shrink-0 shadow-xl">${initials}</div>
    `;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Developer Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${currentTheme.appBackground} ${currentTheme.typography} p-6 sm:p-12 min-h-screen">
  <div class="max-w-5xl mx-auto space-y-12">
    
    <!-- Hero Section -->
    <div class="py-12 sm:py-16 border-b border-current/15 flex flex-col sm:flex-row items-start justify-between gap-8">
      <div class="space-y-3 flex-1 order-2 sm:order-1">
        ${name !== 'Developer' ? `<h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">${name}</h1>` : ''}
        ${personal.title ? `<p class="text-sm font-semibold uppercase tracking-widest opacity-80 mt-1">${personal.title}</p>` : ''}
        ${personal.summary ? `<p class="text-xs opacity-85 leading-relaxed pt-3 max-w-2xl">${personal.summary}</p>` : ''}
        <div class="flex items-center gap-4 text-xs opacity-75 pt-2">
          ${personal.email ? `<span>${personal.email}</span>` : ''}
          ${personal.location ? `<span>• ${personal.location}</span>` : ''}
        </div>
      </div>
      <div class="order-1 sm:order-2 self-center sm:self-start mb-6 sm:mb-0">
        ${avatarHtml}
      </div>
    </div>

    <!-- Skills Matrix -->
    ${skills && skills.length > 0 && skills.flatMap(s => (Array.isArray(s.items) ? s.items : (typeof s === 'string' ? [s] : []))).length > 0 ? `
    <div class="pb-8 border-b border-current/15 space-y-4">
      <h3 class="text-xs font-bold uppercase tracking-widest opacity-70">Core Technical Skills</h3>
      <div class="flex gap-2 flex-wrap">
        ${skills.flatMap(s => (Array.isArray(s.items) ? s.items : (typeof s === 'string' ? [s] : []))).map(skill => `<span class="${currentTheme.accentChip}">${skill}</span>`).join('')}
      </div>
    </div>
    ` : ''}

    <!-- Experience Timeline -->
    ${experiences && experiences.length > 0 ? `
    <div class="pb-8 border-b border-current/15 space-y-6">
      <h3 class="text-xs font-bold uppercase tracking-widest opacity-70">Professional Experience</h3>
      <div class="space-y-6">
        ${experiences.map(exp => {
          const descStr = Array.isArray(exp.description) ? exp.description.join(' ') : (exp.description || '');
          return `
          <div class="space-y-1.5 border-l-2 border-current/20 pl-4 ml-1">
            <div class="flex justify-between items-center text-xs font-bold">
              <span>${exp.role} — <span class="opacity-75">${exp.company}</span></span>
              <span class="text-[10px] opacity-60 font-mono">${exp.start_date} - ${exp.end_date || 'Present'}</span>
            </div>
            <p class="text-xs opacity-80 leading-relaxed">${descStr}</p>
          </div>
        `}).join('')}
      </div>
    </div>
    ` : ''}

    <!-- Projects Grid -->
    ${projects && projects.length > 0 ? `
    <div class="space-y-6 pb-8 border-b border-current/15">
      <h3 class="text-xs font-bold uppercase tracking-widest opacity-70">Selected Engineering Case Studies</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${projects.map(proj => `
          <div class="${currentTheme.cardStyle} space-y-3 flex flex-col justify-between">
            <div class="space-y-2">
              <h4 class="font-bold text-sm">${proj.title}</h4>
              <div class="flex gap-1.5 flex-wrap">
                ${(proj.technologies || proj.tech_stack || []).map(t => `<span class="${currentTheme.accentChip}">${t}</span>`).join('')}
              </div>
              <p class="text-xs opacity-85 leading-relaxed">${proj.case_study || proj.description || ''}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- Certifications Section -->
    ${certifications && certifications.length > 0 ? `
    <div class="pb-8 border-b border-current/15 space-y-4">
      <h3 class="text-xs font-bold uppercase tracking-widest opacity-70">Certifications & Industry Credentials</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${certifications.map(cert => `
          <div class="space-y-1 py-1">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold">${cert.name}</h4>
              <span class="text-[10px] font-mono opacity-60">${cert.issue_date || cert.date || ''}</span>
            </div>
            <p class="text-xs opacity-75 font-medium">${cert.issuer || ''}</p>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- Achievements Section -->
    ${achievements && achievements.length > 0 ? `
    <div class="pb-8 border-b border-current/15 space-y-4">
      <h3 class="text-xs font-bold uppercase tracking-widest opacity-70">Key Honors & Notable Achievements</h3>
      <div class="space-y-3">
        ${achievements.map(ach => `
          <div class="flex items-start gap-2.5 text-xs">
            <span class="text-emerald-500 font-bold font-mono mt-0.5">•</span>
            <div class="space-y-0.5">
              <h4 class="font-bold opacity-95">${ach.title || (typeof ach === 'string' ? ach : '')}</h4>
              ${ach.description ? `<p class="opacity-75 leading-relaxed">${ach.description}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

  </div>
</body>
</html>`;

    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = 'My_Portfolio.html';
    document.body.appendChild(htmlLink);
    htmlLink.click();
    document.body.removeChild(htmlLink);
    URL.revokeObjectURL(htmlUrl);

    setMessage({ type: 'success', text: `Exported My_Portfolio.html (${currentTheme.name}) successfully!` });
  };

  const data = masterPayload.data || {};
  const personal = data.personal_info || {};
  const experiences = data.experiences || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const certifications = data.certifications || [];
  const achievements = data.achievements || [];

  return (
    <div className={`space-y-6 bg-slate-50 min-h-[calc(100vh-80px)] ${isPreviewMode ? 'p-0 sm:p-4' : 'p-6'}`}>
      {/* Exit Live Preview Overlay */}
      {isPreviewMode && (
        <button
          type="button"
          onClick={() => setIsPreviewMode(false)}
          className="fixed top-4 right-4 z-50 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xl cursor-pointer"
        >
          <EyeOff className="w-4 h-4 text-rose-400" />
          <span>Exit Live Preview</span>
        </button>
      )}

      {/* Control Panel (2-Row Flexbox Layout) */}
      {!isPreviewMode && (
        <div className="flex flex-col gap-4 p-4 border border-zinc-200 bg-white rounded-lg shadow-sm">
          
          {/* Top Row (Identity & Naming) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full max-w-full overflow-hidden">
            
            {/* Left side: Avatar + Title/Subtitle */}
            <div className="flex items-center gap-3">
              <AvatarImage 
                src={personal.photo_url} 
                name={personal.full_name} 
                sizeClass="w-12 h-12 shrink-0" 
                onSelectFile={handleSelectFileToCrop}
              />
              <div className="min-w-0">
                <h2 className="text-zinc-900 font-bold text-sm sm:text-base flex flex-wrap items-center gap-2">
                  <span>Tailwind Theme Matrix</span>
                  <span className="bg-zinc-100 text-zinc-700 text-xs px-2 py-0.5 rounded border border-zinc-200 font-mono font-medium">
                    {currentTheme.name} ({themeMatrix.length} Themes)
                  </span>
                </h2>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Click avatar or upload custom profile photo
                </p>
              </div>
            </div>

            {/* Right side: Portfolio Title Input + Primary "Save Portfolio" Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
              <input
                type="text"
                value={portfolioTitle}
                onChange={(e) => setPortfolioTitle(e.target.value)}
                placeholder="e.g. Dark Mode Vercel Clone"
                className="bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-900 rounded-md px-3 h-10 text-xs font-semibold text-zinc-900 outline-none transition-colors w-full md:w-64"
              />
              <button
                type="button"
                onClick={handleSaveTheme}
                disabled={savingTheme || isSaved}
                className={`h-10 px-4 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors w-full sm:w-auto shrink-0 ${
                  isSaved 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-900 disabled:opacity-50 shadow-sm'
                }`}
                title="Save portfolio configuration to database"
              >
                {savingTheme ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isSaved ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5 text-zinc-300" />
                )}
                <span>{!isSaved ? "Save Portfolio" : "✓ Saved"}</span>
              </button>
            </div>

          </div>

          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*"
            onChange={handleSelectFileToCrop}
            className="hidden" 
          />

          {/* Bottom Row (Toolbar & Actions in Strict Order) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 p-2.5 bg-zinc-50 rounded-md border border-zinc-200 w-full max-w-full overflow-hidden">
            
            {/* 1. Theme Dropdown (Select) */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Palette className="w-4 h-4 text-zinc-600 shrink-0" />
              <select
                value={selectedThemeId}
                onChange={(e) => setSelectedThemeId(e.target.value)}
                className="bg-white text-zinc-900 text-xs rounded-md border border-zinc-200 h-9 px-2.5 outline-none font-semibold cursor-pointer w-full sm:max-w-[200px]"
              >
                {themeMatrix.map((t) => (
                  <option key={t.id} value={t.id}>🎨 {t.name}</option>
                ))}
              </select>
            </div>

            {/* 2. "Random Vibe" button */}
            <button
              type="button"
              onClick={fetchGeneratePortfolio}
              disabled={isGenerating}
              className="bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 h-9 px-3.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors flex-1 sm:flex-initial"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              <span>Random Vibe</span>
            </button>

            {/* 3. "Avatar" (Upload) button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 h-9 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors flex-1 sm:flex-initial"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-500" />
              <span>Avatar</span>
            </button>

            {/* 4. "Preview" button */}
            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              className="bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 h-9 px-3.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors flex-1 sm:flex-initial"
            >
              <Eye className="w-3.5 h-3.5 text-zinc-600" />
              <span>Preview</span>
            </button>

            {/* 5. "Export HTML" button (Distinct bg-zinc-900) */}
            <button
              type="button"
              onClick={handleExport}
              className="bg-zinc-900 hover:bg-zinc-800 text-white border border-slate-900 h-9 px-3.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer shadow-sm w-full sm:w-auto sm:ml-auto transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export HTML</span>
            </button>

          </div>

        </div>
      )}

      {/* Notification Toast */}
      {!isPreviewMode && message.text && (
        <div className={`p-3 rounded text-xs font-medium border flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : null}
          <span>{message.text}</span>
        </div>
      )}

      {/* CROP MODAL OVERLAY */}
      {isCropModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-2xl max-w-lg w-full p-6 space-y-5 text-slate-900">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-700" />
                <span>Crop Profile Avatar</span>
              </h3>
              <button 
                type="button" 
                onClick={() => {
                  setIsCropModalOpen(false);
                  setImageSrc(null);
                }} 
                className="text-slate-400 hover:text-slate-600 text-xs font-mono font-bold"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full h-72 bg-slate-900 rounded-md overflow-hidden shadow-inner">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex justify-between">
                <span>Zoom Level</span>
                <span className="font-mono text-slate-500">{zoom.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsCropModalOpen(false);
                  setImageSrc(null);
                }}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-gray-300 px-4 py-2 rounded text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveCroppedAvatar}
                disabled={savingCrop}
                className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 px-4 py-2 rounded text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {savingCrop ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 text-emerald-400" />}
                <span>Save Avatar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC TAILWIND MATRIX RENDER SHELL */}
      <div className="w-full max-w-full overflow-hidden border border-slate-200 rounded-lg relative min-h-0 min-w-0 shadow-sm bg-white mt-6">
        <div className="w-full max-h-[60vh] lg:max-h-none overflow-y-auto overflow-x-auto p-1 sm:p-2">
          <div className={`p-4 sm:p-12 transition-all duration-300 rounded-md min-h-[500px] w-full max-w-full ${currentTheme.appBackground} ${currentTheme.typography}`}>
            <div className="max-w-5xl mx-auto space-y-12">
          
          {/* 1. Hero Section */}
          <div className="py-12 sm:py-16 border-b border-current/15 flex flex-col sm:flex-row items-start justify-between gap-8">
            <div className="space-y-3 flex-1 order-2 sm:order-1">
              {personal.full_name && <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">{personal.full_name}</h1>}
              {personal.title && <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mt-1">{personal.title}</p>}
              {personal.summary && <p className="text-xs opacity-85 leading-relaxed pt-3 max-w-2xl">{personal.summary}</p>}
              <div className="flex items-center gap-4 text-xs opacity-75 pt-2">
                {personal.email && <span>{personal.email}</span>}
                {personal.location && <span>• {personal.location}</span>}
              </div>
            </div>
            <div className="order-1 sm:order-2 self-center sm:self-start mb-6 sm:mb-0">
              <AvatarImage 
                src={personal.photo_url} 
                name={personal.full_name} 
                sizeClass="w-32 h-32 md:w-40 md:h-40 border-4 border-current/20 shadow-xl" 
                onSelectFile={handleSelectFileToCrop}
              />
            </div>
          </div>

          {/* 2. Skills Matrix */}
          {skills && skills.length > 0 && skills.flatMap((s) => (Array.isArray(s.items) ? s.items : (typeof s === 'string' ? [s] : []))).length > 0 && (
            <div className="pb-8 border-b border-current/15 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>Core Skills & Technical Competencies</span>
              </h3>
              <div className="flex gap-2 flex-wrap">
                {skills.flatMap((s) => (Array.isArray(s.items) ? s.items : (typeof s === 'string' ? [s] : []))).map((skill, i) => (
                  <span key={i} className={currentTheme.accentChip}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 3. Work Experience */}
          {experiences && experiences.length > 0 && (
            <div className="pb-8 border-b border-current/15 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Professional Experience</span>
              </h3>
              <div className="space-y-6">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="space-y-1.5 border-l-2 border-current/20 pl-4 ml-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>{exp.role} — <span className="opacity-75">{exp.company}</span></span>
                      <span className="text-[10px] opacity-60 font-mono">{exp.start_date} - {exp.end_date || 'Present'}</span>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">
                      {Array.isArray(exp.description) ? exp.description.join(' ') : exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Projects Section */}
          {projects && projects.length > 0 && (
            <div className="pb-8 border-b border-current/15 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                <span>Selected Engineering Case Studies</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj, idx) => (
                  <div key={idx} className={`${currentTheme.cardStyle} space-y-3 flex flex-col justify-between`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm">{proj.title}</h4>
                        <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {(proj.technologies || proj.tech_stack || []).map((t, i) => (
                          <span key={i} className={currentTheme.accentChip}>{t}</span>
                        ))}
                      </div>
                      <p className="text-xs opacity-85 leading-relaxed">{proj.case_study || proj.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Certifications Section */}
          {certifications && certifications.length > 0 && (
            <CertificationsSection data={certifications} />
          )}

          {/* 6. Achievements Section */}
          {achievements && achievements.length > 0 && (
            <AchievementsSection data={achievements} />
          )}

        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default PortfolioGenerator;
