
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CategorySpend } from '../types';

interface Props {
  data: CategorySpend[];
  total: number;
}

const CategoryChart: React.FC<Props> = ({ data, total }) => {
  return (
    <div className="relative size-64 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full soft-inner-field border-[14px] border-white dark:border-[#1e242b] shadow-soft-inner dark:shadow-soft-inner-dark"></div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={105}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
            strokeLinecap="round"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-widest">Total Spent</p>
        <p className="text-slate-900 dark:text-white text-2xl font-black tracking-tight">${total.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CategoryChart;
