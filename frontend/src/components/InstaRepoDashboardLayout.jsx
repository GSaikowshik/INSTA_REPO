import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Menu, X, LayoutDashboard, FileText, Code2, Mail, CheckCircle2, User, Settings, HelpCircle } from 'lucide-react';
import api from '../api';

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const sidebarItems = [
  { name: 'Overview', path: '/dashboard', end: true, icon: LayoutDashboard },
  { name: 'AI Resume Builder', path: '/dashboard/resume', icon: FileText },
  { name: 'Portfolio Generator', path: '/dashboard/portfolio', icon: Code2 },
  { name: 'Cover Letter Writer', path: '/dashboard/cover-letter', icon: Mail },
  { name: 'ATS Score Evaluator', path: '/dashboard/ats', icon: CheckCircle2 },
];

const InstaRepoDashboardLayout = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [meRes, profileRes] = await Promise.all([
          api.get('/auth/me').catch(() => null),
          api.get('/profile').catch(() => null)
        ]);

        if (meRes?.data) {
          setDbUser(meRes.data);
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

  const displayName = user?.fullName || personalInfo?.full_name || dbUser?.name || dbUser?.email?.split('@')[0] || "User";
  const userInitials = getInitials(displayName);
  const userEmail = user?.primaryEmailAddress?.emailAddress || dbUser?.email || personalInfo?.email || 'No Email';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md md:hidden transition-colors cursor-pointer"
            aria-label="Toggle Workspace Menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              IR
            </div>
            <span className="font-bold text-sm text-slate-900 tracking-tight">InstaRepo</span>
          </Link>
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
      <div className="flex-1 flex relative">
        
        {/* Desktop Sidebar */}
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
                    `flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors ${
                      isActive
                        ? 'text-slate-900 bg-white border border-slate-200 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                    }`
                  }
                >
                  <item.icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Footer / User Actions */}
          <div className="pt-3 border-t border-slate-200 space-y-1 mt-auto">
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'text-slate-900 bg-white border border-slate-200 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`
              }
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </NavLink>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'text-slate-900 bg-white border border-slate-200 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`
              }
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </NavLink>
            <NavLink
              to="/dashboard/support"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'text-slate-900 bg-white border border-slate-200 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`
              }
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Support</span>
            </NavLink>
            <div className="px-3 pt-2 pb-1 text-xs font-medium text-slate-500 truncate w-full block font-mono" title={userEmail}>
              {userEmail}
            </div>
          </div>
        </aside>

        {/* Mobile Slide-Over Sidebar Drawer Sheet */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            {/* Sidebar Sheet Panel */}
            <aside className="relative w-64 max-w-[80vw] bg-white border-r border-slate-200 p-4 flex flex-col justify-between h-full shadow-xl z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      IR
                    </div>
                    <span className="font-bold text-sm text-slate-900">Workspace Menu</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                  Navigation
                </div>

                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2.5 text-xs rounded-md transition-colors ${
                          isActive
                            ? 'text-slate-900 bg-slate-100 font-bold border border-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 text-slate-500" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="pt-4 border-t border-slate-100 space-y-1.5">
                <NavLink
                  to="/dashboard/profile"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Profile</span>
                </NavLink>
                <NavLink
                  to="/dashboard/settings"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Settings</span>
                </NavLink>
                <NavLink
                  to="/dashboard/support"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Support</span>
                </NavLink>
                <div className="px-3 pt-2 text-[11px] font-mono text-slate-400 truncate">
                  {userEmail}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Nested Route Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 bg-slate-50 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstaRepoDashboardLayout;
