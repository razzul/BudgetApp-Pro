
import React from 'react';
import { BudgetCategory } from '../types';

interface BudgetCategoryCardProps extends BudgetCategory {
  currencySymbol: string;
  isSelected?: boolean;
  onClick?: () => void;
  onEdit?: (e: React.MouseEvent) => void;
}

const BudgetCategoryCard: React.FC<BudgetCategoryCardProps> = ({ 
  name, 
  parentCategory, 
  spent, 
  limit, 
  icon, 
  status, 
  currencySymbol,
  isSelected,
  onClick,
  onEdit,
  isInvestment
}) => {
  const percentage = Math.min((spent / limit) * 100, 100);
  
  const statusColors: Record<string, string> = {
    'On Track': 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Near Limit': 'text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
    'Over Budget': 'text-rose-700 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400',
    'Active': 'text-primary bg-primary/10'
  };

  const progressColors: Record<string, string> = {
    'On Track': 'from-emerald-400 to-emerald-600',
    'Near Limit': 'from-amber-400 to-amber-600',
    'Over Budget': 'from-rose-400 to-rose-600',
    'Active': 'from-primary to-indigo-600'
  };

  return (
    <div 
      onClick={onClick}
      className={`card-elevated p-6 cursor-pointer group relative ${isSelected ? 'ring-2 ring-primary border-primary' : ''}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight">{name}</h3>
              {isInvestment && (
                <span className="material-symbols-outlined text-primary text-xs fill-1" title="Investment Type">account_balance</span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{parentCategory}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(e); }}
              className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100"
              title="Edit Segment"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
            </button>
          )}
          <div className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${statusColors[status] || statusColors['Active']}`}>
            {status}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase block mb-0.5">Spent</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {currencySymbol}{spent.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] font-bold uppercase block mb-0.5">Limit</span>
            <span className="text-sm font-bold text-slate-500">{currencySymbol}{limit.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full bg-gradient-to-r ${progressColors[status] || progressColors['Active']} transition-all duration-1000 ease-out shadow-sm`} style={{ width: `${percentage}%` }}></div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
          <span className="text-slate-400">{percentage.toFixed(0)}% Utilized</span>
          {isInvestment ? (
            <span className="text-primary font-black flex items-center gap-1">
               <span className="material-symbols-outlined text-[10px]">moving</span>
               Investment Flow
            </span>
          ) : (
            <span className={spent > limit ? 'text-rose-500' : 'text-emerald-500'}>
              {spent > limit ? `Over by ${currencySymbol}${(spent - limit).toLocaleString()}` : `${currencySymbol}${(limit - spent).toLocaleString()} Available`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetCategoryCard;
