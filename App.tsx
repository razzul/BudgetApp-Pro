
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import SpendingChart from './components/SpendingChart';
import CategoryChart from './components/CategoryChart';
import SavingsGoalItem from './components/SavingsGoalItem';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import DataMapping from './pages/DataMapping';
import Transactions from './pages/Transactions';
import Login from './pages/Login';
import { 
  STATS, 
  SPENDING_CHART_DATA, 
  CATEGORY_DATA, 
  SAVINGS_GOALS,
  RECENT_TRANSACTIONS
} from './constants';
import { getFinancialInsight } from './services/geminiService';

// Utility to generate month lists
const getMonthData = (count: number, offset: number = 0) => {
  const options = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (i + offset), 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    options.push({ label, value, year: d.getFullYear(), month: d.toLocaleDateString('en-US', { month: 'short' }) });
  }
  return options;
};

const RECENT_MONTHS = getMonthData(6);
const ALL_HISTORICAL_MONTHS = getMonthData(24);

// Helper for step navigation
const getStepMonth = (currentValue: string, step: number): string | null => {
  const [year, month] = currentValue.split('-').map(Number);
  const date = new Date(year, month - 1 + step, 1);
  const newValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  
  // Check if the new value exists in our allowed historical range
  const exists = ALL_HISTORICAL_MONTHS.some(m => m.value === newValue);
  return exists ? newValue : null;
};

interface HeaderProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  onOpenArchives: () => void;
  onOpenMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedMonth, setSelectedMonth, onOpenArchives, onOpenMobileMenu }) => {
  const location = useLocation();
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/budgets': return 'Budgets';
      case '/goals': return 'Goals';
      case '/mapping': return 'Mapping';
      case '/transactions': return 'Activity';
      case '/analytics': return 'Analytics';
      default: return 'Overview';
    }
  };

  const handlePrev = () => {
    const prev = getStepMonth(selectedMonth, -1);
    if (prev) setSelectedMonth(prev);
  };

  const handleNext = () => {
    const next = getStepMonth(selectedMonth, 1);
    if (next) setSelectedMonth(next);
  };

  const selectedLabel = useMemo(() => {
    const monthObj = ALL_HISTORICAL_MONTHS.find(m => m.value === selectedMonth);
    // On mobile, try to use the short month name
    return monthObj ? `${monthObj.month} '${String(monthObj.year).slice(-2)}` : selectedMonth;
  }, [selectedMonth]);

  const canGoNext = !!getStepMonth(selectedMonth, 1);
  const canGoPrev = !!getStepMonth(selectedMonth, -1);
  
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 md:px-8 py-3 shrink-0 transition-colors">
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <button 
          onClick={onOpenMobileMenu}
          className="lg:hidden size-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <h2 className="text-slate-900 dark:text-white text-base md:text-xl font-extrabold tracking-tight truncate max-w-[100px] sm:max-w-none">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-1.5 md:gap-4 shrink-0">
        {/* Navigation Controls Pod */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 md:p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <button 
            onClick={handlePrev}
            disabled={!canGoPrev}
            className={`size-7 md:size-10 flex items-center justify-center rounded-lg transition-all ${canGoPrev ? 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-primary active:scale-90' : 'text-slate-300 dark:text-slate-600 opacity-50'}`}
            title="Previous Month"
          >
            <span className="material-symbols-outlined text-base md:text-xl">chevron_left</span>
          </button>

          <div className="relative group mx-0.5">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white dark:bg-slate-900 border-none rounded-lg py-1 md:py-2 pl-2 pr-7 md:pr-10 text-[10px] md:text-xs font-black uppercase tracking-widest w-24 md:w-48 appearance-none cursor-pointer focus:ring-0 shadow-sm transition-colors"
            >
              {RECENT_MONTHS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
              {!RECENT_MONTHS.some(m => m.value === selectedMonth) && (
                <option value={selectedMonth}>{ALL_HISTORICAL_MONTHS.find(m => m.value === selectedMonth)?.label || selectedMonth}</option>
              )}
            </select>
            <div className="absolute right-1.5 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm md:text-lg leading-none">expand_more</span>
            </div>
          </div>

          <button 
            onClick={handleNext}
            disabled={!canGoNext}
            className={`size-7 md:size-10 flex items-center justify-center rounded-lg transition-all ${canGoNext ? 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-primary active:scale-90' : 'text-slate-300 dark:text-slate-600 opacity-50'}`}
            title="Next Month"
          >
            <span className="material-symbols-outlined text-base md:text-xl">chevron_right</span>
          </button>
        </div>

        {/* Global Archive Trigger */}
        <button 
          onClick={onOpenArchives}
          className="size-8 md:size-11 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white shadow-sm transition-all active:scale-95 shrink-0"
          title="Open Calendar Archives"
        >
          <span className="material-symbols-outlined text-lg md:text-2xl">calendar_month</span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block transition-colors"></div>

        <div className="items-center gap-3 hidden sm:flex">
          <button className="flex items-center justify-center size-10 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="flex items-center gap-2">
            <div className="size-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/20 ring-2 ring-white dark:ring-slate-900 transition-all">AR</div>
          </button>
        </div>
      </div>
    </header>
  );
};

interface PastDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: string;
  onSelect: (month: string) => void;
}

const PastDataModal: React.FC<PastDataModalProps> = ({ isOpen, onClose, selectedMonth, onSelect }) => {
  if (!isOpen) return null;

  // Group by year
  const years = Array.from(new Set(ALL_HISTORICAL_MONTHS.map(m => m.year))).sort((a, b) => b - a);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/60 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-300 transition-colors">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl">history</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Audit Archive</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Access historical financial records</p>
            </div>
          </div>
          <button onClick={onClose} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-10 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
          {years.map(year => (
            <div key={year} className="space-y-4">
              <h4 className="text-slate-900 dark:text-white text-sm font-black tracking-[0.2em] uppercase border-b border-slate-100 dark:border-slate-800 pb-2">{year}</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {ALL_HISTORICAL_MONTHS.filter(m => m.year === year).map(m => (
                  <button
                    key={m.value}
                    onClick={() => {
                      onSelect(m.value);
                      onClose();
                    }}
                    className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      selectedMonth === m.value 
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-primary hover:text-primary hover:bg-white dark:hover:bg-slate-700'
                    }`}
                  >
                    {m.month}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
          >
            Close Archives
          </button>
        </div>
      </div>
    </div>
  );
};

interface DashboardProps {
  selectedMonth: string;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedMonth }) => {
  const [insight, setInsight] = useState<string>("Scanning financial records...");

  const currentMonthLabel = useMemo(() => {
    return ALL_HISTORICAL_MONTHS.find(o => o.value === selectedMonth)?.label || selectedMonth;
  }, [selectedMonth]);

  // Calculate stats based on selected month
  const monthlyStats = useMemo(() => {
    const monthTransactions = RECENT_TRANSACTIONS.filter(tx => tx.date.startsWith(selectedMonth));
    const income = monthTransactions.filter(tx => tx.type === 'income').reduce((acc, tx) => acc + tx.amount, 0);
    const expenses = monthTransactions.filter(tx => tx.type === 'expense').reduce((acc, tx) => acc + tx.amount, 0);
    
    return [
      { label: 'Total Balance', value: '$12,450.00', change: 2.5, isPositive: true },
      { label: 'Monthly Income', value: `$${income.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: 1.2, isPositive: income > 0 },
      { label: 'Monthly Spending', value: `$${expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: 5.4, isPositive: expenses < 3000 },
      { label: 'Total Savings', value: `$${(income - expenses > 0 ? income - expenses : 0).toLocaleString()}`, change: 10.0, isPositive: true },
    ];
  }, [selectedMonth]);

  useEffect(() => {
    let isMounted = true;
    const summary = `Month: ${currentMonthLabel}. Status: Analysing recent flows. Progress on savings is consistent.`;
    
    // Set loading state immediately for new months
    setInsight("Scanning financial records...");

    const fetchInsight = async () => {
      const res = await getFinancialInsight(summary);
      if (isMounted) {
        setInsight(res || `Solid month so far in ${currentMonthLabel}. Your spending is well aligned with historical benchmarks.`);
      }
    };
    
    fetchInsight();
    
    return () => {
      isMounted = false;
    };
  }, [selectedMonth, currentMonthLabel]);

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Welcome back, Alex</h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">Snapshot for <span className="text-primary font-bold">{currentMonthLabel}</span></p>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 md:flex-none px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Export PDF</button>
          <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">New Entry</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {monthlyStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 card-elevated p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">Monthly Cash Flow</h3>
              <p className="text-slate-500 text-sm">Income vs. Expenditures</p>
            </div>
            <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:block transition-colors">
              Historical Window
            </div>
          </div>
          <SpendingChart data={SPENDING_CHART_DATA} />
        </div>

        <div className="card-elevated p-6 md:p-8 flex flex-col">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold">Expenditure Mix</h3>
          <p className="text-slate-500 text-sm mb-8">Segmented spending for {currentMonthLabel}</p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <CategoryChart data={CATEGORY_DATA} total={3120} />
            <div className="mt-8 w-full space-y-4">
              {CATEGORY_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-12">
        <div className="card-elevated p-6 md:p-8 border-l-4 border-l-primary">
           <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">AI Flow Intelligence</h3>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
            <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic md:not-italic">
              "{insight}"
            </p>
          </div>
        </div>

        <div className="card-elevated p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Active Goals</h3>
            <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Full Report</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {SAVINGS_GOALS.map((goal) => (
              <SavingsGoalItem key={goal.id} {...goal} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(RECENT_MONTHS[0].value);
  const [isArchivesOpen, setIsArchivesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Check for session in localStorage on mount
  useEffect(() => {
    const session = localStorage.getItem('precision_session');
    if (session === 'active') setIsLoggedIn(true);
  }, []);

  // Handle Dark Mode Class Sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = () => {
    localStorage.setItem('precision_session', 'active');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('precision_session');
    setIsLoggedIn(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="flex h-screen overflow-hidden bg-bg-light dark:bg-bg-dark font-display transition-colors">
        <Sidebar onLogout={handleLogout} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        {isMobileMenuOpen && (
          <Sidebar 
            onLogout={handleLogout} 
            isMobile={true} 
            onClose={() => setIsMobileMenuOpen(false)} 
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        )}
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header 
            selectedMonth={selectedMonth} 
            setSelectedMonth={setSelectedMonth} 
            onOpenArchives={() => setIsArchivesOpen(true)}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Routes>
              <Route path="/" element={<Dashboard selectedMonth={selectedMonth} />} />
              <Route path="/transactions" element={<Transactions selectedMonth={selectedMonth} />} />
              <Route path="/budgets" element={<Budgets selectedMonth={selectedMonth} />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/mapping" element={<DataMapping />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <footer className="h-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8 flex items-center justify-between shrink-0 transition-colors">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Cloud Sync Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">Precision Budgeting Engine v2.0</p>
          </footer>
        </main>
      </div>
      
      <PastDataModal 
        isOpen={isArchivesOpen} 
        onClose={() => setIsArchivesOpen(false)}
        selectedMonth={selectedMonth}
        onSelect={setSelectedMonth}
      />
    </HashRouter>
  );
};

export default App;
