
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/' },
  { label: 'Transactions', icon: 'payments', path: '/transactions' },
  { label: 'Budgets', icon: 'pie_chart', path: '/budgets' },
  { label: 'Goals', icon: 'track_changes', path: '/goals' },
  { label: 'Analytics', icon: 'insights', path: '/analytics' },
  { label: 'Mapping', icon: 'database', path: '/mapping' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

        {/* User Profile */}
        <div className="mt-auto px-2 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
              AR
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                <p className="text-slate-900 dark:text-white text-sm font-bold leading-none truncate">Alex Rivera</p>
                <p className="text-slate-400 text-[10px] mt-1 font-medium">Pro Account</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
