
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'JAN', actual: 60, limit: 75 },
  { name: 'FEB', actual: 85, limit: 80 },
  { name: 'MAR', actual: 70, limit: 75 },
  { name: 'APR', actual: 95, limit: 80 },
  { name: 'MAY', actual: 55, limit: 75 },
  { name: 'JUN', actual: 65, limit: 80 },
];

const SpendingBarChart: React.FC = () => {
  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#617c89', fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="actual" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-actual-${index}`} fill="#13a4ec" />
            ))}
          </Bar>
          <Bar dataKey="limit" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-limit-${index}`} fill="currentColor" className="text-gray-100 dark:text-gray-700" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingBarChart;
