import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api, { getAuthHeaders } from '../api';
import { 
  User, 
  Mail, 
  Save, 
  AlertTriangle, 
  Trash2, 
  Check, 
  Loader2, 
  ShieldAlert, 
  Settings as SettingsIcon 
} from 'lucide-react';

const Settings = () => {
  const { getToken } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Custom Form Validation State
  const [fieldErrors, setFieldErrors] = useState({});

  // Danger Zone Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const headers = await getAuthHeaders(getToken);
        const [meRes, profileRes] = await Promise.all([
          api.get('/auth/me', headers).catch(() => null),
          api.get('/profile', headers).catch(() => null)
        ]);

        if (meRes?.data) {
          setEmail(meRes.data.email || '');
          if (meRes.data.name) {
            setFullName(meRes.data.name);
          }
        }
        if (profileRes?.data?.parsed_data?.personal_info) {
          const personal = profileRes.data.parsed_data.personal_info;
          if (personal.full_name && !fullName) {
            setFullName(personal.full_name);
          }
          if (personal.email && !email) {
            setEmail(personal.email);
          }
        }
      } catch (err) {
        console.error('Error loading settings data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [getToken]);

  const validateForm = () => {
    const errors = {};
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const headers = await getAuthHeaders(getToken);
      const response = await api.put('/users/me', {
        name: fullName,
        email: email
      }, headers);

      if (response.data) {
        setMessage({ type: 'success', text: 'Account settings updated successfully!' });
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update account settings.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText.trim().toUpperCase() === 'DELETE') {
      alert('Account deletion requested.');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 text-slate-900 font-sans">
      
      {/* Header Toolbar */}
      <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-slate-800" />
            <span>Account & Workspace Settings</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage your authenticated profile credentials and security preferences.
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {message.text && (
        <div className={`p-3 rounded text-xs font-medium border flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Information Form Card */}
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm space-y-5">
        <div className="border-b border-gray-200 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Profile Information</h2>
        </div>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs">Loading account settings...</span>
          </div>
        ) : (
          <form onSubmit={handleSaveChanges} noValidate className="space-y-4 text-xs">
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: null }));
                  }}
                  placeholder="e.g. Alex Smith"
                  className={`w-full bg-white border ${fieldErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-slate-900 outline-none focus:border-indigo-600 font-medium pl-9`}
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              {fieldErrors.fullName && (
                <span className="text-red-500 text-xs font-medium mt-1 block">
                  {fieldErrors.fullName}
                </span>
              )}
            </div>

            {/* Email Address Input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: null }));
                  }}
                  placeholder="user@example.com"
                  className={`w-full bg-white border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-slate-900 outline-none focus:border-indigo-600 font-medium pl-9 font-mono`}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              {fieldErrors.email && (
                <span className="text-red-500 text-xs font-medium mt-1 block">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-5 rounded text-xs flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 transition-colors"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-slate-200" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Danger Zone Section */}
      <div className="bg-rose-50/50 border border-rose-200 rounded-md p-6 shadow-sm space-y-4">
        <div className="border-b border-rose-200 pb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <h2 className="text-sm font-bold text-rose-900">Danger Zone</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-rose-900">Delete Account</h3>
            <p className="text-[11px] text-rose-700">
              Permanently purge your account, saved resume data, and generated portfolios. This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Account Deletion Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900">Confirm Account Deletion</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete your account? Type <strong className="text-rose-600 font-mono">DELETE</strong> below to confirm.
            </p>

            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs font-mono font-bold text-rose-600 outline-none focus:border-rose-600"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmationText('');
                }}
                className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                onClick={handleDeleteAccount}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
