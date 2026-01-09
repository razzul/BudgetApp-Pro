
import React, { useState, useMemo } from 'react';
import { RECENT_TRANSACTIONS } from '../constants';

const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Last 30 Days');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(RECENT_TRANSACTIONS.map(tx => tx.category)));
    return ['All', ...cats];
  }, []);

  const filteredTransactions = useMemo(() => {
    return RECENT_TRANSACTIONS.filter((tx) => {
      const matchesSearch = tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All' || 
                         (typeFilter === 'Income' && tx.type === 'income') || 
                         (typeFilter === 'Expense' && tx.type === 'expense');
      const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [searchTerm, typeFilter, categoryFilter]);

  const stats = useMemo(() => {
    const total = filteredTransactions.reduce((acc, tx) => acc + tx.amount, 0);
    const count = filteredTransactions.length;
    const avg = count > 0 ? total / count : 0;
    return { total, count, avg };
  }, [filteredTransactions]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-elevated border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Audit Trail</h2>
          <p className="text-slate-500 font-medium">Granular history of all verified flow activity</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              className="w-full pl-11 pr-6 py-3 input-precision text-sm font-bold placeholder:text-slate-400" 
              placeholder="Filter by merchant or segment..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95">
            <span className="material-symbols-outlined text-lg">sync_alt</span>
            <span>Cloud Sync</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Advanced Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="card-elevated p-6 space-y-6">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-4">Flow Filters</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direction</label>
                <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                  {['All', 'Income', 'Expense'].map(type => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`flex-1 py-2 text-[10px] font-black uppercase rounded-md transition-all ${typeFilter === type ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white' : 'text-slate-400'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Window</label>
                <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full input-precision py-2.5 px-3 text-xs font-bold">
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>Year to Date</option>
                  <option>All Time</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Segment</label>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full input-precision py-2.5 px-3 text-xs font-bold">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                <span>Filtered Total</span>
                <span className="text-slate-900 dark:text-white">${stats.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                <span>Entry Count</span>
                <span className="text-slate-900 dark:text-white">{stats.count} items</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-primary rounded-xl text-white shadow-lg shadow-primary/20 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">analytics</span>
              <p className="text-[10px] font-black uppercase tracking-widest">Smart Summary</p>
            </div>
            <p className="text-xs font-medium leading-relaxed opacity-90">Based on your filtered view, your average flow value per entry is <span className="font-bold">${stats.avg.toFixed(2)}</span>.</p>
          </div>
        </aside>

        {/* Main Table Content */}
        <div className="lg:col-span-3">
          <div className="card-elevated p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <th className="py-5 px-8">Verified Merchant</th>
                    <th className="py-5 px-8">Timeline</th>
                    <th className="py-5 px-8">Segment</th>
                    <th className="py-5 px-8 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-6 px-8 font-extrabold text-slate-900 dark:text-white">{tx.merchant}</td>
                      <td className="py-6 px-8 text-slate-400 font-bold">{tx.date}</td>
                      <td className="py-6 px-8">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-black uppercase tracking-widest text-slate-500">
                          {tx.category}
                        </span>
                      </td>
                      <td className={`py-6 px-8 text-right font-black text-base ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-300 dark:text-slate-700">
                          <span className="material-symbols-outlined text-5xl">search_off</span>
                          <p className="text-[10px] font-black uppercase tracking-widest">Null return on filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-8 py-6 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/10 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditing page 01 of 01</p>
              <div className="flex gap-2">
                <button className="size-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 pointer-events-none transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="size-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
