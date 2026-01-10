
import React, { useState, useMemo, useEffect } from 'react';
import { RECENT_TRANSACTIONS, BUDGET_CATEGORIES } from '../constants';
import { Transaction } from '../types';

interface CategorizedTransaction extends Transaction {
  isConfirmed?: boolean;
  suggestedCategory?: string;
  confidence?: number;
}

const CATEGORY_MAP: Record<string, string> = {
  'apple': 'Electronics',
  'whole foods': 'Groceries',
  'starbucks': 'Dining',
  'uber': 'Transport',
  'tech corp': 'Salary',
  'amazon': 'Shopping',
  'netflix': 'Entertainment',
  'walmart': 'Groceries',
  'target': 'Shopping',
  'shell': 'Transport',
  'chevron': 'Transport'
};

interface TransactionsProps {
  selectedMonth: string;
}

const Transactions: React.FC<TransactionsProps> = ({ selectedMonth }) => {
  const [txList, setTxList] = useState<CategorizedTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAutoCategorizing, setIsAutoCategorizing] = useState(false);

  useEffect(() => {
    const initialized = RECENT_TRANSACTIONS.map(tx => {
      const merchantLower = tx.merchant.toLowerCase();
      let suggestion = '';
      let confidence = 0;

      for (const key in CATEGORY_MAP) {
        if (merchantLower.includes(key)) {
          suggestion = CATEGORY_MAP[key];
          confidence = 0.95;
          break;
        }
      }

      const isConfirmed = tx.category !== 'Uncategorized' && tx.category !== '';

      return {
        ...tx,
        isConfirmed,
        suggestedCategory: suggestion || 'General',
        confidence: suggestion ? confidence : 0.5
      };
    });
    setTxList(initialized);
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(BUDGET_CATEGORIES.map(cat => cat.name)));
    return ['All', ...cats];
  }, []);

  const handleConfirm = (id: string) => {
    setTxList(prev => prev.map(tx => {
      if (tx.id === id) {
        return { ...tx, category: tx.suggestedCategory || tx.category, isConfirmed: true };
      }
      return tx;
    }));
  };

  const handleChangeCategory = (id: string, newCat: string) => {
    setTxList(prev => prev.map(tx => {
      if (tx.id === id) {
        return { ...tx, category: newCat, suggestedCategory: newCat, isConfirmed: true };
      }
      return tx;
    }));
  };

  const filteredTransactions = useMemo(() => {
    return txList.filter((tx) => {
      // Primary Global Month Filter
      const matchesMonth = tx.date.startsWith(selectedMonth);
      if (!matchesMonth) return false;

      const matchesSearch = tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All' || 
                         (typeFilter === 'Income' && tx.type === 'income') || 
                         (typeFilter === 'Expense' && tx.type === 'expense');
      const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [txList, searchTerm, typeFilter, categoryFilter, selectedMonth]);

  const stats = useMemo(() => {
    const total = filteredTransactions.reduce((acc, tx) => acc + tx.amount, 0);
    const count = filteredTransactions.length;
    const pending = filteredTransactions.filter(tx => !tx.isConfirmed).length;
    const avg = count > 0 ? total / count : 0;
    return { total, count, pending, avg };
  }, [filteredTransactions]);

  const runBulkAutoCategorize = () => {
    setIsAutoCategorizing(true);
    setTimeout(() => {
      setTxList(prev => prev.map(tx => ({
        ...tx,
        category: tx.suggestedCategory || tx.category,
        isConfirmed: true
      })));
      setIsAutoCategorizing(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-elevated border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-3xl">history_edu</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Audit Trail</h2>
            <p className="text-slate-500 font-medium">History for <span className="text-primary font-bold">{selectedMonth}</span></p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              className="w-full pl-11 pr-6 py-3 input-precision text-sm font-bold placeholder:text-slate-400" 
              placeholder="Search month records..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={runBulkAutoCategorize}
            disabled={isAutoCategorizing || stats.pending === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isAutoCategorizing ? 'bg-slate-100 text-slate-400' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}
          >
            <span className={`material-symbols-outlined text-lg ${isAutoCategorizing ? 'animate-spin' : ''}`}>
              {isAutoCategorizing ? 'sync' : 'magic_button'}
            </span>
            <span>{isAutoCategorizing ? 'Processing...' : 'Auto-Categorize All'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Segment</label>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full input-precision py-2.5 px-3 text-xs font-bold appearance-none bg-white dark:bg-slate-800">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                <span>Month Total</span>
                <span className="text-slate-900 dark:text-white">${stats.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                <span>Entry Count</span>
                <span className="text-slate-900 dark:text-white">{stats.count} items</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="card-elevated p-0 overflow-hidden bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <th className="py-5 px-8">Verified Merchant</th>
                    <th className="py-5 px-8">Timeline</th>
                    <th className="py-5 px-8">Segment & Suggestions</th>
                    <th className="py-5 px-8 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300">
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-3">
                          <div className={`size-8 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                            <span className="material-symbols-outlined text-lg">
                              {tx.type === 'income' ? 'account_balance' : 'storefront'}
                            </span>
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-white">{tx.merchant}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8 text-slate-400 font-bold whitespace-nowrap">{tx.date}</td>
                      <td className="py-6 px-8">
                        {tx.isConfirmed ? (
                          <div className="flex items-center gap-2 group/cat">
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-black uppercase tracking-widest text-slate-500">
                              {tx.category}
                            </span>
                            <button 
                              onClick={() => setTxList(prev => prev.map(t => t.id === tx.id ? { ...t, isConfirmed: false } : t))}
                              className="size-6 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-300 opacity-0 group-hover/cat:opacity-100 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-500">
                            <select 
                              value={tx.suggestedCategory}
                              onChange={(e) => handleChangeCategory(tx.id, e.target.value)}
                              className="pl-3 pr-8 py-1.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg text-[10px] font-black uppercase tracking-widest text-amber-600 focus:ring-amber-500 appearance-none cursor-pointer"
                            >
                              {categories.filter(c => c !== 'All').map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                            <button 
                              onClick={() => handleConfirm(tx.id)}
                              className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm hover:bg-emerald-600 transition-colors flex items-center gap-1"
                            >
                              Confirm
                            </button>
                          </div>
                        )}
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
                          <p className="text-[10px] font-black uppercase tracking-widest">No records found for this month</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
