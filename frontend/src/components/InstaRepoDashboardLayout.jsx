import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const sidebarItems = [
  { name: 'Overview', path: '/dashboard', end: true },
  { name: 'AI Resume Builder', path: '/dashboard/resume' },
  { name: 'Portfolio Generator', path: '/dashboard/portfolio' },
  { name: 'Cover Letter Writer', path: '/dashboard/cover-letter' },
  { name: 'ATS Score Evaluator', path: '/dashboard/ats' },
];

const InstaRepoDashboardLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [meRes, profileRes] = await Promise.all([
          api.get('/auth/me').catch(() => null),
          api.get('/profile').catch(() => null)
        ]);

        if (meRes?.data) {
          setUser(meRes.data);
        }
        if (profileRes?.data?.parsed_data) {
          setPersonalInfo(profileRes.data.parsed_data.personal_info || {});
        }
      } catch (err) {
        console.error('Error fetching dashboard user session:', err);
      }
    };
    fetchUserData();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const displayName = personalInfo?.full_name || user?.name || user?.email?.split('@')[0] || "User";
  const userInitials = getInitials(displayName);
  const userEmail = user?.email || personalInfo?.email || 'user@example.com';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            IR
          </div>
          <span className="font-bold text-sm text-slate-900 tracking-tight">InstaRepo</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            title="Manage Profile"
          >
            {displayName && (
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                {displayName}
              </span>
            )}
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {userInitials}
            </div>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Minimalist Sidebar */}
        <aside className="w-60 bg-slate-50 border-r border-slate-200 p-3 shrink-0 hidden md:flex md:flex-col justify-between sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2">
              Workspace
            </div>
            <nav className="space-y-0.5">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-xs rounded-md transition-colors ${
                      isActive
                        ? 'text-slate-900 bg-white border border-slate-200 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Footer / User Actions */}
          <div className="pt-3 border-t border-slate-200 space-y-1 mt-auto">
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'text-slate-900 bg-white border border-slate-200 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`
              }
            >
              Profile
            </NavLink>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `flex items-center px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'text-slate-900 bg-white border border-slate-200 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`
              }
            >
              Settings
            </NavLink>
            <NavLink
              to="/dashboard/support"
              className={({ isActive }) =>
                `flex items-center px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'text-slate-900 bg-white border border-slate-200 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`
              }
            >
              Support
            </NavLink>
            <div className="px-3 pt-2 pb-1 text-xs font-medium text-slate-500 truncate w-full block font-mono" title={userEmail}>
              {userEmail}
            </div>
          </div>
        </aside>

        {/* Nested Route Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstaRepoDashboardLayout;
