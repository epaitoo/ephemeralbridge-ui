import { NavLink } from 'react-router-dom';
import { FileText, FolderOpen, Zap } from 'lucide-react';

const navItems = [
  { to: '/files', icon: FolderOpen, label: 'Files' },
  { to: '/texts', icon: FileText, label: 'Texts' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-brand-900 flex flex-col">
      {/* Logo */}
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-400/20 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-brand-300" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg tracking-tight">
              EphemeralBridge
            </h1>
            <p className="text-brand-400 text-xs">Temporary file sharing</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-800 text-white shadow-lg shadow-brand-950/20'
                      : 'text-brand-300 hover:bg-brand-800/50 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-brand-800">
        <div className="px-4 py-3 rounded-xl bg-brand-800/50">
          <p className="text-brand-400 text-xs">
            Files expire 24h after first download
          </p>
        </div>
      </div>
    </aside>
  );
}
