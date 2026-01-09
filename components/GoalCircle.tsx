
import React from 'react';

interface GoalCircleProps {
  title: string;
  saved: number;
  target: number;
}

const GoalCircle: React.FC<GoalCircleProps> = ({ title, saved, target }) => {
  const percentage = Math.round((saved / target) * 100);
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="soft-card p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 group">
      <div className="relative size-40 mb-8 flex items-center justify-center">
        <div className="absolute inset-4 rounded-full soft-inner-field border-[8px] border-white dark:border-[#1e242b] shadow-soft-inner dark:shadow-soft-inner-dark"></div>
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
      <h4 className="text-slate-900 dark:text-white font-extrabold text-lg tracking-tight mb-1">{title}</h4>
      <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
        ${saved.toLocaleString()} / ${target.toLocaleString()}
      </p>
    </div>
  );
};

export default GoalCircle;
