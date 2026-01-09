
import React, { useState, useMemo } from 'react';
import { BUDGET_CATEGORIES as INITIAL_CATEGORIES, RECENT_TRANSACTIONS as INITIAL_TRANSACTIONS } from '../constants';
import BudgetCategoryCard from '../components/BudgetCategoryCard';
import { BudgetCategory, Transaction } from '../types';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

const COMMON_ICONS = [
  'restaurant', 'fastfood', 'local_cafe', 'shopping_cart', 'local_bar',
  'directions_car', 'directions_bus', 'flight', 'local_gas_station', 'commute',
  'home', 'electric_bolt', 'water_drop', 'wifi', 'construction',
  'movie', 'fitness_center', 'shopping_bag', 'spa', 'theater_comedy',
  'payments', 'account_balance', 'savings', 'credit_card', 'receipt_long',
  'medical_services', 'pill', 'school', 'book', 'stethscope',
  'work', 'computer', 'star', 'pets', 'child_care'
];

const Budgets: React.FC = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState(5200);
  const [currency, setCurrency] = useState(currencies[0]);
  const [tempBudget, setTempBudget] = useState(totalMonthlyBudget.toString());
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({
    name: '',
    parentCategory: '',
    limit: '',
    icon: 'star',
    type: 'expense' as 'expense' | 'income'
  });

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({
    merchant: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'General',
    type: 'expense' as 'expense' | 'income'
  });

  const totalSpent = categories.filter(c => c.type === 'expense').reduce((acc, cat) => acc + cat.spent, 0);
  const remaining = totalMonthlyBudget - totalSpent;

  const handleSaveBudget = () => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val >= 0) {
      setTotalMonthlyBudget(val);
    }
  };

  const handleOpenModal = (type: 'expense' | 'income' = 'expense') => {
    setNewCat({
      name: '',
      parentCategory: type === 'income' ? 'Income' : '',
      limit: '',
      icon: type === 'income' ? 'payments' : 'star',
      type: type
    });
    setIsModalOpen(true);
  };

  const handleOpenTxModal = (type: 'expense' | 'income' = 'expense') => {
    setNewTx({
      merchant: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: type === 'income' ? 'Salary' : 'General',
      type: type
    });
    setIsTxModalOpen(true);
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
      colorClass: newCat.type === 'income' ? 'green' : 'primary',
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

  const filteredCategories = categories.filter(cat => 
    filterType === 'all' || cat.type === filterType
  );

  const selectedCategory = useMemo(() => 
    categories.find(c => c.id === selectedCategoryId)
  , [selectedCategoryId, categories]);

  const relevantTransactions = useMemo(() => {
    if (!selectedCategory) return transactions.slice(0, 10);
    return transactions.filter(tx => 
      tx.category.toLowerCase() === selectedCategory.name.toLowerCase() ||
      tx.category.toLowerCase() === selectedCategory.parentCategory.toLowerCase()
    );
  }, [selectedCategory, transactions]);

  const availableCategories = useMemo(() => 
    categories.filter(c => c.type === newTx.type)
  , [categories, newTx.type]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Enhanced Precision Header with Budget & Currency Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-elevated border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-3xl">tune</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Budget Parameters</h2>
            <p className="text-slate-500 font-medium">Define your global spending thresholds and base currency</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Currency Switcher */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => setCurrency(curr)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${currency.code === curr.code ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {curr.code}
                </button>
              ))}
            </div>

            {/* Global Budget Input */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-sm overflow-hidden">
               <div className="flex items-center px-3 text-primary font-black text-sm">{currency.symbol}</div>
               <input 
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  className="w-28 bg-transparent border-none focus:ring-0 text-sm font-black text-slate-900 dark:text-white"
                  placeholder="Set Limit"
                />
                <button 
                  onClick={handleSaveBudget}
                  className="size-8 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all active:scale-95"
                  title="Apply Limit"
                >
                  <span className="material-symbols-outlined text-lg">done_all</span>
                </button>
            </div>
          </div>
          
          <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

          <button 
            onClick={() => handleOpenTxModal('expense')}
            className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add_card</span>
            Log Activity
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-elevated p-6 border-b-4 border-b-primary/40">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Global Limit ({currency.code})</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{currency.symbol}{totalMonthlyBudget.toLocaleString()}</p>
        </div>
        <div className="card-elevated p-6 border-b-4 border-b-emerald-500/40">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Allocated</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{currency.symbol}{totalSpent.toLocaleString()}</p>
        </div>
        <div className={`card-elevated p-6 border-b-4 ${remaining >= 0 ? 'border-b-primary/40' : 'border-b-rose-500/40'}`}>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{remaining >= 0 ? 'Surplus Capacity' : 'Budget Deficit'}</p>
          <p className={`text-2xl font-black ${remaining >= 0 ? 'text-primary' : 'text-rose-600'}`}>
            {currency.symbol}{Math.abs(remaining).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Active Segments</h3>
          
          {/* Dropdown Filter for Category Types */}
          <div className="relative inline-block w-48">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">filter_alt</span>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-primary focus:border-primary appearance-none cursor-pointer shadow-sm hover:border-primary transition-colors"
            >
              <option value="all">View All Flows</option>
              <option value="expense">Expense Streams</option>
              <option value="income">Income Streams</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">expand_more</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-[1400px]:grid-cols-4 gap-6">
          {filteredCategories.map(category => (
            <BudgetCategoryCard 
              key={category.id} 
              {...category} 
              currencySymbol={currency.symbol} 
              isSelected={selectedCategoryId === category.id}
              onClick={() => setSelectedCategoryId(category.id === selectedCategoryId ? null : category.id)}
            />
          ))}

          <button 
            onClick={() => handleOpenModal('expense')}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all group min-h-[220px]"
          >
            <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all">add_circle</span>
            <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary">New Category Segment</p>
          </button>
        </div>
      </div>

      {/* Detailed Transaction Table (The Log) */}
      <div className="card-elevated p-0 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
          <h3 className="text-slate-900 dark:text-white font-bold text-sm">
            {selectedCategory ? `Audit Log: ${selectedCategory.name}` : 'Recent Activity Log'}
          </h3>
          <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Export Full Log</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/10">
                <th className="py-5 px-8">Merchant / Source</th>
                <th className="py-5 px-8">Date</th>
                <th className="py-5 px-8">Segment</th>
                <th className="py-5 px-8 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {relevantTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-5 px-8 font-bold text-slate-900 dark:text-white">{tx.merchant}</td>
                  <td className="py-5 px-8 text-slate-400 text-xs font-semibold">{tx.date}</td>
                  <td className="py-5 px-8">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-bold uppercase tracking-widest text-slate-500">
                      {tx.category}
                    </span>
                  </td>
                  <td className={`py-5 px-8 text-right font-black ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                    {tx.type === 'income' ? '+' : '-'}{currency.symbol}{tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {relevantTransactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No activity records found for this selection</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-10 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create Segment</h3>
              <button onClick={() => setIsModalOpen(false)} className="size-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label</label>
                  <input required type="text" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} className="w-full input-precision px-4 py-3 text-sm font-bold" placeholder="e.g. Travel" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Direction</label>
                  <select value={newCat.type} onChange={e => setNewCat({...newCat, type: e.target.value as 'expense' | 'income'})} className="w-full input-precision px-4 py-3 text-sm font-bold appearance-none">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Threshold ({currency.symbol})</label>
                <input required type="number" value={newCat.limit} onChange={e => setNewCat({...newCat, limit: e.target.value})} className="w-full input-precision px-4 py-3 text-sm font-bold" placeholder="0.00" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Visual Identifier</label>
                <div className="grid grid-cols-6 gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 max-h-40 overflow-y-auto custom-scrollbar">
                  {COMMON_ICONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setNewCat({...newCat, icon: iconName})}
                      className={`size-10 flex items-center justify-center rounded-lg transition-all ${newCat.icon === iconName ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      <span className="material-symbols-outlined text-lg">{iconName}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all">
                Finalize Segment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Transaction Modal */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-10 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Record Activity</h3>
              <button onClick={() => setIsTxModalOpen(false)} className="size-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddTransaction} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                  <select value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as 'expense' | 'income'})} className="w-full input-precision px-4 py-3 text-sm font-bold appearance-none">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Value ({currency.symbol})</label>
                  <input required type="number" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} className="w-full input-precision px-4 py-3 text-sm font-bold" placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Merchant / Source</label>
                <input required type="text" value={newTx.merchant} onChange={e => setNewTx({...newTx, merchant: e.target.value})} className="w-full input-precision px-4 py-3 text-sm font-bold" placeholder="e.g. Amazon, Payroll" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                  <input required type="date" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} className="w-full input-precision px-4 py-3 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})} className="w-full input-precision px-4 py-3 text-sm font-bold appearance-none">
                    {availableCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={`w-full py-4 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all ${newTx.type === 'income' ? 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600' : 'bg-rose-500 shadow-rose-500/20 hover:bg-rose-600'}`}>
                Audit & Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
