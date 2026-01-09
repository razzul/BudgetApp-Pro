import React from 'react';
import { StatData } from '../types';

const StatCard: React.FC<StatData> = ({ label, value, change, isPositive }) => {
  const iconMap: Record<string, string> = {
    'Total Balance': 'account_balance',
    'Monthly Income': 'payments',
    'Monthly Spending': 'shopping_cart',
    'Total Savings': 'savings'
  };

  const colorMap: Record<string, string> = {
    'Total Balance': 'bg-primary text-white',
    'Monthly Income': 'bg-emerald-500 text-white',
    'Monthly Spending': 'bg-rose-500 text-white',
    'Total Savings': 'bg-amber-500 text-white'
  };

  return (
    <div className="card-elevated p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`size-10 rounded-lg ${colorMap[label] || 'bg-primary text-white'} flex items-center justify-center shadow-md`}>
          <span className="material-symbols-outlined text-xl">{iconMap[label] || 'wallet'}</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${isPositive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
          <span className="material-symbols-outlined text-[14px]">
            {isPositive ? 'arrow_upward' : 'arrow_downward'}
          </span>
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</p>
        <p className="text-slate-900 dark:text-white text-2xl font-extrabold tracking-tight mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;