
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { SpendingPoint } from '../types';

interface Props {
  data: SpendingPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 min-w-[180px]">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">{label} Audit</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-slate-500">Income</span>
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white">${payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-primary"></div>
              <span className="text-xs font-bold text-slate-500">Expense</span>
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white">${payload[1].value.toLocaleString()}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Net Flow</span>
            <span className={`text-xs font-black ${(payload[0].value - payload[1].value) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              ${(payload[0].value - payload[1].value).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const SpendingChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-[380px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="4 4" 
            vertical={false} 
            stroke="#e2e8f0" 
            opacity={0.2} 
          />
          
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800, letterSpacing: '0.1em' }}
            dy={20}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
            tickFormatter={(value) => `$${value}`}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area 
            name="Income"
            type="monotone" 
            dataKey="income" 
            stroke="#10b981" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorIncome)" 
            dot={false}
            activeDot={{ 
              r: 6, 
              strokeWidth: 3, 
              fill: '#10b981', 
              stroke: '#fff',
              className: "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            }}
          />
          
          <Area 
            name="Expense"
            type="monotone" 
            dataKey="expenses" 
            stroke="#4f46e5" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorExpense)" 
            dot={false}
            activeDot={{ 
              r: 6, 
              strokeWidth: 3, 
              fill: '#4f46e5', 
              stroke: '#fff',
              className: "drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]"
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;
