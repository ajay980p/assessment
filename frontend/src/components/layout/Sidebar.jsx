import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Building2,
} from 'lucide-react';
import { PATHS, MAIN_NAV, APP_NAME, APP_TAGLINE } from '../../config';

const NAV_ICONS = {
  [PATHS.HOME]: LayoutDashboard,
  [PATHS.EMPLOYEES]: Users,
  [PATHS.ATTENDANCE]: Calendar,
};

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  }`;

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white shadow-sm">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{APP_NAME}</h1>
            <p className="text-xs text-gray-500">{APP_TAGLINE}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {MAIN_NAV.map(({ to, label }) => {
            const Icon = NAV_ICONS[to];
            return (
              <NavLink key={to} to={to} end={to === PATHS.HOME} className={navLinkClass}>
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-gray-100 px-3 py-4">
          <NavLink to={PATHS.SETTINGS} className={navLinkClass}>
            <Settings className="h-5 w-5 shrink-0" />
            Settings
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
