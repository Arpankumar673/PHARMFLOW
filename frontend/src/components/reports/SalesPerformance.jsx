import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, ShoppingCart, DollarSign, Wallet } from '../../constants/icons';

const SalesPerformance = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await api.get('/reports/sales');
                setData(res.data.data);
            } catch (err) {
                console.error("Sales data error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    if (loading) return <div className="h-[400px] md:h-[500px] bg-slate-50 animate-pulse rounded-2xl" />;

    const stats = [
        { label: "Revenue Today", value: `₹${data?.todayRevenue || 0}`, icon: <DollarSign size={16} className="text-emerald-600" />, bg: "bg-emerald-50" },
        { label: "Revenue MoM", value: `₹${data?.monthlyRevenue || 0}`, icon: <Wallet size={16} className="text-blue-600" />, bg: "bg-blue-50" },
        { label: "Orders Today", value: data?.ordersToday || 0, icon: <ShoppingCart size={16} className="text-orange-600" />, bg: "bg-orange-50" },
        { label: "Avg. Ticket", value: `₹${Math.round(data?.avgOrderValue || 0)}`, icon: <TrendingUp size={16} className="text-purple-600" />, bg: "bg-purple-50" }
    ];

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6 lg:col-span-2">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600">
                    <TrendingUp size={22} />
                </div>
                <div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter text-slate-800">Sales Performance</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Revenue and order velocity tracking</p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {stats.map((s, i) => (
                    <div key={i} className={`${s.bg} p-4 md:p-5 rounded-xl border border-white/50 flex flex-col gap-1.5 shadow-sm`}>
                        <div className="w-8 h-8 md:w-9 md:h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            {s.icon}
                        </div>
                        <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 opacity-60 mt-0.5">{s.label}</p>
                        <p className="text-base md:text-lg font-black text-slate-800 tracking-tighter">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="h-[260px] md:h-[320px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.salesTrend || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.1)', padding: '12px' }}
                            itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                            labelStyle={{ fontWeight: 900, marginBottom: '6px', color: '#64748b', fontSize: '10px' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#10b981" 
                            strokeWidth={3} 
                            dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesPerformance;
