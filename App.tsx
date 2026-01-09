
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import SpendingChart from './components/SpendingChart';
import CategoryChart from './components/CategoryChart';
import SavingsGoalItem from './components/SavingsGoalItem';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import DataMapping from './pages/DataMapping';
import Transactions from './pages/Transactions';
import { 
  STATS, 
  SPENDING_CHART_DATA, 
  CATEGORY_DATA, 
  SAVINGS_GOALS 
} from './constants';
import { getFinancialInsight } from './services/geminiService';

const Header: React.FC = () => {
  const location = useLocation();
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/budgets': return 'Budgets';
      case '/goals': return 'Financial Goals';
      case '/mapping': return 'Sheet Mapping';
      case '/transactions': return 'Activity Log';
      case '/analytics': return 'Insights & Analytics';
      default: return 'Overview';
    }
  };
  
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-slate-900 dark:text-white text-xl font-extrabold tracking-tight">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input 
            className="input-precision pl-10 pr-4 py-2 text-sm w-64" 
            placeholder="Search flow records..." 
            type="text"
          />
        </div>
        <button className="flex items-center justify-center size-10 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
        <button className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">AR</div>
        </button>
      </div>
    </header>
  );
};

const Dashboard: React.FC = () => {
  const [insight, setInsight] = useState<string>("Scanning financial records...");

  useEffect(() => {
    const fetchInsight = async () => {
      const summary = `Income: $5,240, Expenses: $3,120, Goal Progress: 75% on Emergency fund.`;
      const res = await getFinancialInsight(summary);
      setInsight(res || "Solid month so far. You're $420 under budget in dining, which has helped boost your emergency fund contribution by 12%.");
    };
    fetchInsight();
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Welcome back, Alex</h1>
          <p className="text-slate-500 font-medium">Your monthly snapshot is ready for review.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Export PDF</button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">New Entry</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-elevated p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">Monthly Spending Curve</h3>
              <p className="text-slate-500 text-sm">Comparison of actual vs. predicted</p>
            </div>
            <select className="input-precision py-1 px-3 text-xs font-bold">
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          <SpendingChart data={SPENDING_CHART_DATA} />
        </div>

        <div className="card-elevated p-8 flex flex-col">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold">Expenditure Mix</h3>
          <p className="text-slate-500 text-sm mb-8">Segmented spending data</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        <div className="card-elevated p-8 border-l-4 border-l-primary">
           <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">AI Flow Intelligence</h3>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              "{insight}"
            </p>
          </div>
        </div>

        <div className="card-elevated p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Active Goals</h3>
            <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Full Report</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
  return (
    <HashRouter>
      <div className="flex h-screen overflow-hidden bg-bg-light dark:bg-bg-dark font-display transition-colors">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/mapping" element={<DataMapping />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
          <footer className="h-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Cloud Sync Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Precision Budgeting Engine v2.0</p>
          </footer>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
