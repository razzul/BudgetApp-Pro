import React from 'react';
import { SavingsGoal } from '../types';

const SavingsGoalItem: React.FC<SavingsGoal> = ({ title, target, saved, icon, color }) => {
  const percentage = Math.min(Math.round((saved / target) * 100), 100);

  return (
    <div className="space-y-4 group">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="size-11 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:border-primary transition-all duration-300" style={{ color }}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{title}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Target: ${target.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-black tracking-tight" style={{ color }}>{percentage}%</p>
        </div>
      </div>
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
      <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest px-0.5">
        <span>Accumulated: ${saved.toLocaleString()}</span>
        <span>${(target - saved).toLocaleString()} Remaining</span>
      </div>
    </div>
  );
};

export default SavingsGoalItem;