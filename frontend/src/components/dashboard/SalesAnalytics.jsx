import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', sales: 4200 },
  { name: 'Tue', sales: 5800 },
  { name: 'Wed', sales: 4900 },
  { name: 'Thu', sales: 6200 },
  { name: 'Fri', sales: 5500 },
  { name: 'Sat', sales: 7800 },
  { name: 'Sun', sales: 6400 },
];

const SalesChart = ({ salesHistory }) => {
  // Use salesHistory if provided, otherwise use fallback data
  const chartData = salesHistory || data;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Sales Analytics</h3>
          <p className="text-xs md:text-sm font-medium text-slate-400">Revenue trend for the last 7 days</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest">
          +12.5% Growth
        </div>
      </div>
      
      <div className="w-full h-[220px] md:h-[280px] lg:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }}
              itemStyle={{ fontWeight: 800, color: '#1e293b' }}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#2563eb" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSales)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
