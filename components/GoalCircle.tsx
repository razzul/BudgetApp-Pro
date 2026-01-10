import React from 'react';

interface GoalCircleProps {
  id: string;
  title: string;
  saved: number;
  target: number;
  linkedCategories?: string[];
  onEdit?: () => void;
}

const GoalCircle: React.FC<GoalCircleProps> = ({ title, saved, target, linkedCategories, onEdit }) => {
  const percentage = Math.round((saved / target) * 100);
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-elevated p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-elevated-hover group relative">
      {onEdit && (
        <div className="absolute top-6 right-6 flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="size-9 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all shadow-sm border border-slate-100 dark:border-slate-700"
            title="Edit Milestone"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
      )}

      <div className="relative size-40 mb-6 flex items-center justify-center">
        <div className="absolute inset-4 rounded-full border-[8px] border-slate-50 dark:border-slate-800 shadow-sm"></div>
        <svg className="size-full -rotate-90">
          <circle 
            className="text-slate-100 dark:text-slate-800" 
            cx="80" cy="80" r={radius} 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth="10"
          />
          <circle 
            className="text-primary transition-all duration-1000 ease-out" 
            cx="80" cy="80" r={radius} 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white group-hover:scale-110 transition-transform">{percentage}%</span>
        </div>
      </div>
      
      <div className="space-y-1 mb-4">
        <h4 className="text-slate-900 dark:text-white font-extrabold text-lg tracking-tight">{title}</h4>
        <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
          ${saved.toLocaleString()} / ${target.toLocaleString()}
        </p>
      </div>

      <div className="w-full flex flex-col gap-3">
        {linkedCategories && linkedCategories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {linkedCategories.map((cat, i) => (
              <span key={i} className="px-2 py-0.5 bg-primary/5 dark:bg-primary/20 border border-primary/10 rounded text-[8px] font-black uppercase text-primary tracking-tighter">
                {cat}
              </span>
            ))}
          </div>
        )}
        
        {onEdit && (
          <button 
            onClick={onEdit}
            className="mt-2 py-2 px-4 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95 border border-slate-100 dark:border-slate-700"
          >
            Manage Goal
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalCircle;