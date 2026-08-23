import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const sidebarItems = [
  { name: 'Overview', path: '/dashboard', end: true },
  { name: 'AI Resume Builder', path: '/dashboard/resume' },
  { name: 'Portfolio Generator', path: '/dashboard/portfolio' },
  { name: 'Cover Letter Writer', path: '/dashboard/cover-letter' },
  { name: 'ATS Score Evaluator', path: '/dashboard/ats' },
];

const Sidebar = () => {
  const { user } = useUser();

  return (
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
        <div className="px-3 pt-2 pb-1 text-xs font-medium text-slate-500 truncate w-full block font-mono" title={user?.primaryEmailAddress?.emailAddress || 'No Email'}>
          {user?.primaryEmailAddress?.emailAddress || 'No Email'}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
