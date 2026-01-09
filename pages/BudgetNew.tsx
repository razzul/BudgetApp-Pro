
import React, { useState, useMemo } from 'react';
import { BUDGET_CATEGORIES as INITIAL_CATEGORIES, RECENT_TRANSACTIONS as INITIAL_TRANSACTIONS } from '../constants';
import BudgetCategoryCard from '../components/BudgetCategoryCard';
import { BudgetCategory, Transaction } from '../types';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

const COMMON_ICONS = [
  'restaurant', 'shopping_cart', 'directions_car', 'home', 'movie', 'payments', 'savings', 'credit_card'
];

const BudgetNew: React.FC = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState(5200);
  const [currency, setCurrency] = useState(currencies[0]);
  const [tempBudget, setTempBudget] = useState(totalMonthlyBudget.toString());
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(INITIAL_CATEGORIES[0].id);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', parentCategory: '', limit: '', icon: 'star', type: 'expense' as 'expense' | 'income' });
  const [newTx, setNewTx] = useState({ merchant: '', date: new Date().toISOString().split('T')[0], amount: '', category: 'General', type: 'expense' as 'expense' | 'income' });

  const totalSpent = categories.filter(c => c.type === 'expense').reduce((acc, cat) => acc + cat.spent, 0);
  const remaining = totalMonthlyBudget - totalSpent;

  const handleSaveBudget = () => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val >= 0) setTotalMonthlyBudget(val);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name || !newCat.limit) return;
    const category: BudgetCategory = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCat.name,
      parentCategory: newCat.parentCategory || (newCat.type === 'income' ? 'Income' : 'Uncategorized'),
      spent: 0,
      limit: parseFloat(newCat.limit),
      icon: newCat.icon,
      status: 'Active',
      colorClass: 'primary',
      type: newCat.type
    };
    setCategories([...categories, category]);
    setIsModalOpen(false);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.merchant || !newTx.amount || !newTx.date) return;
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: newTx.date,
      merchant: newTx.merchant,
      category: newTx.category,
      amount: parseFloat(newTx.amount),
      type: newTx.type
    };
    setTransactions([transaction, ...transactions]);
    setIsTxModalOpen(false);
  };

  const filteredCategories = categories.filter(cat => cat.type === 'expense' || (filterType === 'all' ? true : cat.type === filterType));
  const selectedCategory = useMemo(() => categories.find(c => c.id === selectedCategoryId), [selectedCategoryId, categories]);
  const relevantTransactions = useMemo(() => {
    if (!selectedCategory) return transactions.slice(0, 10);
    return transactions.filter(tx => tx.category.toLowerCase() === selectedCategory.name.toLowerCase());
  }, [selectedCategory, transactions]);

  const availableCategoriesForTx = categories.filter(c => c.type === newTx.type);

  return (
    <div className="h-full flex flex-col xl:flex-row overflow-hidden animate-in fade-in duration-500">
      {/* Sidebar Panel: List of Categories */}
      <div className="w-full xl:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">Segments</h3>
            <div className="flex gap-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-md">
              {['all', 'expense', 'income'].map(t => (
                <button key={t} onClick={() => setFilterType(t as any)} className={`px-2 py-1 rounded text-[9px] font-black uppercase transition-all ${filterType === t ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white' : 'text-slate-400'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
             <div className="flex items-center px-3 text-primary font-bold text-xs">{currency.symbol}</div>
             <input type="number" value={tempBudget} onChange={(e) => setTempBudget(e.target.value)} className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-900 dark:text-white" />
             <button onClick={handleSaveBudget} className="size-7 bg-white dark:bg-slate-700 rounded shadow-sm border border-slate-200 dark:border-slate-600 flex items-center justify-center text-primary transition-all active:scale-95"><span className="material-symbols-outlined text-sm">check</span></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {filteredCategories.map(cat => (
            <div 
              key={cat.id} 
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedCategoryId === cat.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`size-8 rounded-lg flex items-center justify-center ${selectedCategoryId === cat.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    <span className="material-symbols-outlined text-base">{cat.icon}</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-sm font-bold truncate ${selectedCategoryId === cat.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{cat.name}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-black">{cat.parentCategory}</p>
                  </div>
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-white">${cat.spent.toLocaleString()}</p>
              </div>
            </div>
          ))}
          <button onClick={() => setIsModalOpen(true)} className="w-full py-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all active:scale-95">
            + New Segment
          </button>
        </div>
      </div>

      {/* Content Area: Overview Header + Details of Selected Category */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-bg-dark p-8">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Top Summary Section (from Image) */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">October 2023</h1>
                <p className="text-slate-500 text-xs md:text-sm font-medium">Last updated 4 minutes ago</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors">
                  <span className="whitespace-nowrap uppercase tracking-widest text-[10px]">Filter by Tags</span>
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors">
                  <span className="uppercase tracking-widest text-[10px]">{currency.code}</span>
                  <span className="material-symbols-outlined text-sm">currency_exchange</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-elevated p-6 bg-white dark:bg-slate-900 border-b-4 border-b-primary/40">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Monthly Budget</p>
                <div className="flex items-end justify-between">
                  <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{currency.symbol}{totalMonthlyBudget.toLocaleString()}</p>
                  <p className="text-emerald-500 text-xs font-bold">+2.4% vs prev</p>
                </div>
              </div>
              <div className="card-elevated p-6 bg-white dark:bg-slate-900 border-b-4 border-b-emerald-500/40">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Spent</p>
                <div className="flex items-end justify-between">
                  <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{currency.symbol}{totalSpent.toLocaleString()}</p>
                  <p className="text-slate-500 text-xs font-medium">{Math.round((totalSpent / totalMonthlyBudget) * 100)}% of total</p>
                </div>
              </div>
              <div className={`card-elevated p-6 border-b-4 bg-primary/5 dark:bg-primary/10 ${remaining >= 0 ? 'border-b-primary/40' : 'border-b-rose-500/40'}`}>
                <p className={`text-xs font-black uppercase tracking-widest mb-1 ${remaining >= 0 ? 'text-primary' : 'text-rose-500'}`}>Remaining to Spend</p>
                <div className="flex items-end justify-between">
                  <p className={`text-xl md:text-2xl font-black ${remaining >= 0 ? 'text-primary' : 'text-rose-600'}`}>{currency.symbol}{Math.abs(remaining).toLocaleString()}</p>
                  <span className={`material-symbols-outlined ${remaining >= 0 ? 'text-primary' : 'text-rose-500'}`}>savings</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-slate-200 dark:bg-slate-800"></div>

          {/* Details Section */}
          {selectedCategory ? (
            <div className="space-y-8">
              <div className="card-elevated p-8 bg-white dark:bg-slate-900">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-5">
                    <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined text-4xl">{selectedCategory.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selectedCategory.name}</h2>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">{selectedCategory.parentCategory} Audit</p>
                    </div>
                  </div>
                  <button onClick={() => setIsTxModalOpen(true)} className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95">
                    Log Activity
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-100/50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Spent in Segment</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">${selectedCategory.spent.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-100/50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Segment Ceiling</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">${selectedCategory.limit.toLocaleString()}</p>
                  </div>
                  <div className={`p-6 rounded-xl border ${selectedCategory.spent > selectedCategory.limit ? 'bg-rose-100/30 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900' : 'bg-emerald-100/30 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900'}`}>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Status</p>
                    <p className={`text-2xl font-black ${selectedCategory.spent > selectedCategory.limit ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {selectedCategory.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                    <span>Usage Intensity</span>
                    <span>{Math.round((selectedCategory.spent / selectedCategory.limit) * 100)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${(selectedCategory.spent / selectedCategory.limit) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-0 overflow-hidden bg-white dark:bg-slate-900">
                <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Segment Activity Records</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                        <th className="py-4 px-8">Merchant / Source</th>
                        <th className="py-4 px-8">Date</th>
                        <th className="py-4 px-8 text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relevantTransactions.map(tx => (
                        <tr key={tx.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-8 font-bold text-slate-900 dark:text-white text-sm">{tx.merchant}</td>
                          <td className="py-4 px-8 text-slate-400 text-xs font-semibold">{tx.date}</td>
                          <td className={`py-4 px-8 text-right font-black ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                            {tx.type === 'income' ? '+' : '-'}{currency.symbol}{tx.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      {relevantTransactions.length === 0 && (
                        <tr><td colSpan={3} className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No activity logged in this segment</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center card-elevated border-dashed bg-white dark:bg-slate-900">
              <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">analytics</span>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Select a segment audit path to begin</p>
            </div>
          )}
        </div>
      </div>

      {/* Shared Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Create Segment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <input required type="text" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} className="input-precision px-4 py-3 text-sm font-bold" placeholder="Name" />
                <select value={newCat.type} onChange={e => setNewCat({...newCat, type: e.target.value as any})} className="input-precision px-4 py-3 text-sm font-bold"><option value="expense">Expense</option><option value="income">Income</option></select>
              </div>
              <input required type="number" value={newCat.limit} onChange={e => setNewCat({...newCat, limit: e.target.value})} className="w-full input-precision px-4 py-3 text-sm font-bold" placeholder="Limit" />
              <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">Finalize Segment</button>
            </form>
          </div>
        </div>
      )}

      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Record Activity</h3>
              <button onClick={() => setIsTxModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <select value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as any})} className="input-precision px-4 py-3 text-sm font-bold"><option value="expense">Expense</option><option value="income">Income</option></select>
                <input required type="number" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} className="input-precision px-4 py-3 text-sm font-bold" placeholder="Amount" />
              </div>
              <input required type="text" value={newTx.merchant} onChange={e => setNewTx({...newTx, merchant: e.target.value})} className="w-full input-precision px-4 py-3 text-sm font-bold" placeholder="Merchant" />
              <div className="grid grid-cols-2 gap-6">
                <input required type="date" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} className="input-precision px-4 py-3 text-sm font-bold" />
                <select value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})} className="input-precision px-4 py-3 text-sm font-bold">
                  {availableCategoriesForTx.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  <option value="General">General</option>
                </select>
              </div>
              <button type="submit" className={`w-full py-4 text-white rounded-xl font-black text-xs uppercase shadow-lg transition-all ${newTx.type === 'income' ? 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600' : 'bg-rose-500 shadow-rose-500/20 hover:bg-rose-600'}`}>Audit & Record Flow</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetNew;
