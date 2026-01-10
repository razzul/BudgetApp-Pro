
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SpendingPoint } from '../types';

interface Props {
  data: SpendingPoint[];
}

const SpendingChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-[350px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800, letterSpacing: '0.1em' }}
            dy={20}
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '1.5rem', 
              border: 'none', 
              boxShadow: '8px 8px 16px rgba(0,0,0,0.05)',
              padding: '1rem'
            }}
            itemStyle={{ color: '#6366f1', fontWeight: 800, fontSize: '12px' }}
            labelStyle={{ color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '10px' }}
          />
          <Area 
            type="monotone" 
            dataKey="expenses" 
            stroke="#6366f1" 
            strokeWidth={5}
            fillOpacity={1} 
            fill="url(#colorFlow)" 
            dot={{ r: 6, strokeWidth: 3, fill: '#fff', stroke: '#6366f1' }}
            activeDot={{ r: 10, strokeWidth: 4, fill: '#6366f1', stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;
