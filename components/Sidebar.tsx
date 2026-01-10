
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/' },
  { label: 'Transactions', icon: 'payments', path: '/transactions' },
  { label: 'Budgets', icon: 'pie_chart', path: '/budgets' },
  { label: 'Goals', icon: 'track_changes', path: '/goals' },
  { label: 'Analytics', icon: 'insights', path: '/analytics' },
  { label: 'Mapping', icon: 'database', path: '/mapping' },
];

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside 
      className={`hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 py-6 px-4 shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col gap-10 h-full">
        {/* Logo and Toggle Section */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl font-semibold">account_balance_wallet</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                <h1 className="text-slate-900 dark:text-white text-lg font-extrabold leading-none tracking-tight">Precision</h1>
                <p className="text-primary text-[10px] uppercase tracking-widest font-black mt-1">Budget v2.0</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <span className={`material-symbols-outlined transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
              chevron_left
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              title={isCollapsed ? item.label : ""}
              className={({ isActive }) => 
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-md font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <span className={`material-symbols-outlined shrink-0 text-xl ${location.pathname === item.path ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <p className="text-sm tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.label}
                </p>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile with Logout Popover */}
        <div className="mt-auto px-2 border-t border-slate-100 dark:border-slate-800 pt-6 relative" ref={menuRef}>
          {isMenuOpen && (
            <div className="absolute bottom-full left-2 mb-4 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-2 animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 mb-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Signed in as</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">alex.rivera@pro.com</p>
              </div>
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-xs font-black uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Logout Session
              </button>
            </div>
          )}
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-3 w-full p-2 rounded-xl transition-all ${isMenuOpen ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
              AR
            </div>
            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex flex-col text-left overflow-hidden">
                  <p className="text-slate-900 dark:text-white text-sm font-bold leading-none truncate">Alex Rivera</p>
                  <p className="text-slate-400 text-[10px] mt-1 font-medium">Pro Account</p>
                </div>
                <span className={`material-symbols-outlined text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}>unfold_more</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
