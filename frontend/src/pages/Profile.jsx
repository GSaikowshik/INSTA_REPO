import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import api, { getAuthHeaders } from '../api';
import { 
  User as UserIcon, 
  Mail, 
  Globe, 
  Code2, 
  Camera, 
  Save, 
  Loader2, 
  Check, 
  AlertTriangle,
  Briefcase,
  FileText
} from 'lucide-react';

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const Profile = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [imgError, setImgError] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const headers = await getAuthHeaders(getToken);
        const [meRes, profileRes] = await Promise.all([
          api.get('/auth/me', headers).catch(() => null),
          api.get('/profile', headers).catch(() => null)
        ]);

        let dbName = '';
        let dbEmail = '';
        let dbPhoto = '';

        if (meRes?.data) {
          if (meRes.data.email) dbEmail = meRes.data.email;
          if (meRes.data.name) dbName = meRes.data.name;
        }

        if (profileRes?.data?.parsed_data?.personal_info) {
          const personal = profileRes.data.parsed_data.personal_info;
          if (personal.full_name) dbName = personal.full_name;
          if (personal.email) dbEmail = personal.email;
          if (personal.title) setTitle(personal.title);
          if (personal.summary) setBio(personal.summary);
          if (personal.github_url) setGithubUrl(personal.github_url);
          if (personal.linkedin_url) setLinkedinUrl(personal.linkedin_url);
          if (personal.website_url) setWebsiteUrl(personal.website_url);
          if (personal.photo_url) dbPhoto = personal.photo_url;
        }

        // Set default values using Clerk data if the database profile doesn't exist yet
        const defaultName = dbName || user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '');
        const defaultEmail = dbEmail || user?.primaryEmailAddress?.emailAddress || '';
        const defaultPhoto = dbPhoto || user?.imageUrl || '';

        setFullName(defaultName);
        setEmail(defaultEmail);
        setPhotoUrl(defaultPhoto);
      } catch (err) {
        console.error('Error fetching profile management data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [getToken, user]);

  const validateForm = () => {
    const errors = {};
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgError(false);
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const headers = await getAuthHeaders(getToken);

      // 1. Send PUT to /users/me
      await api.put('/users/me', {
        name: fullName,
        email: email,
        title: title,
        bio: bio,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        website_url: websiteUrl,
        photo_url: photoUrl
      }, headers);

      // 2. Also fetch existing profile structure & sync to /profile
      const profileRes = await api.get('/profile', headers).catch(() => null);
      if (profileRes?.data?.parsed_data) {
        const existingData = profileRes.data.parsed_data;
        const updatedParsedData = {
          ...existingData,
          personal_info: {
            ...existingData.personal_info,
            full_name: fullName,
            email: email,
            title: title,
            summary: bio,
            github_url: githubUrl,
            linkedin_url: linkedinUrl,
            website_url: websiteUrl,
            photo_url: photoUrl
          }
        };

        await api.put('/profile', { parsed_data: updatedParsedData }, headers);
      }

      setMessage({ type: 'success', text: 'Profile database updated successfully!' });
    } catch (err) {
      console.error('Error saving profile:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to save profile changes.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const initials = getInitials(fullName || email);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 text-zinc-900 font-sans">
      
      {/* Header Toolbar */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-zinc-800" />
            <span>Profile Management Hub</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-0.5 font-normal">
            Configure your developer identity, bio, avatar, and social portfolio URLs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={isSaving || isLoading}
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-2 px-4 rounded-md text-xs flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50 transition-colors shrink-0"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </div>

      {/* Notification Toast */}
      {message.text && (
        <div className={`p-3 rounded-md text-xs font-medium border flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white border border-zinc-200 rounded-lg py-12 flex flex-col items-center justify-center text-zinc-400 gap-2 shadow-sm">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
          <span className="text-xs font-medium">Loading profile management hub...</span>
        </div>
      ) : (
        <form onSubmit={handleSaveProfile} noValidate className="space-y-6 text-xs">
          
          {/* Avatar Section */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group shrink-0">
              {(photoUrl || user?.imageUrl) && !imgError ? (
                <img 
                  src={photoUrl || user?.imageUrl} 
                  alt={fullName || user?.fullName || 'Avatar'} 
                  onError={() => setImgError(true)}
                  className="w-20 h-20 rounded-full object-cover border-2 border-zinc-200 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-zinc-900 text-white font-bold text-xl flex items-center justify-center border-2 border-zinc-200 shadow-sm">
                  {initials}
                </div>
              )}
              
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-1.5 bg-white border border-zinc-300 hover:bg-zinc-100 rounded-full text-zinc-700 cursor-pointer shadow-xs transition-colors"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-sm font-semibold text-zinc-900">Developer Avatar Photo</h2>
              <p className="text-zinc-500 text-[11px] font-normal leading-relaxed">
                Upload a professional headshot or photo (PNG, JPG max 2MB). If no custom photo is provided, dynamic initials (<strong>{initials}</strong>) will be rendered.
              </p>
              <div className="pt-1 flex justify-center sm:justify-start gap-2">
                <label 
                  htmlFor="avatar-upload"
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 font-medium rounded text-xs cursor-pointer border border-zinc-200 transition-colors"
                >
                  Upload Photo
                </label>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="px-3 py-1.5 bg-white border border-zinc-200 hover:bg-rose-50 text-rose-600 font-medium rounded text-xs cursor-pointer transition-colors"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information Form Card */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-4">
            <div className="border-b border-zinc-100 pb-3 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-zinc-700" />
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 block">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: null }));
                  }}
                  placeholder="e.g. Alex Smith"
                  className={`w-full bg-white border ${fieldErrors.fullName ? 'border-red-500' : 'border-zinc-300'} rounded-md px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 font-medium text-xs`}
                />
                {fieldErrors.fullName && (
                  <span className="text-red-500 text-xs font-medium mt-1 block">
                    {fieldErrors.fullName}
                  </span>
                )}
              </div>

              {/* Professional Title */}
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 block">
                  Professional Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AI & Full-Stack Developer"
                    className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 font-medium text-xs pl-8"
                  />
                  <Briefcase className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            {/* Short Bio / Summary */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="font-medium text-zinc-700 block">
                  Short Bio / Professional Summary
                </label>
                <span className={`text-[11px] font-mono ${bio.length > 300 ? 'text-rose-500 font-bold' : 'text-zinc-400'}`}>
                  {bio.length}/300
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={300}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Passionate engineer building distributed systems, LLM pipelines, and modern web applications..."
                className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 font-medium text-xs resize-y"
              />
            </div>
          </div>

          {/* Social & Links Form Card */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-4">
            <div className="border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-zinc-700" />
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Social & Portfolio Links</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* GitHub URL */}
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 block">
                  GitHub Profile
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 font-medium text-xs pl-8 font-mono"
                  />
                  <Code2 className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 block">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 font-medium text-xs pl-8 font-mono"
                  />
                  <Globe className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Personal Website URL */}
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 block">
                  Personal Website / Portfolio
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                    className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 font-medium text-xs pl-8 font-mono"
                  />
                  <Globe className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar / Save Button */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm flex items-center justify-between sticky bottom-4 z-10">
            <p className="text-zinc-500 text-[11px] font-normal">
              Click <strong>Save Profile</strong> to persist your updated identity to PostgreSQL.
            </p>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-2 px-5 rounded-md text-xs flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 transition-colors shrink-0"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};

export default Profile;
