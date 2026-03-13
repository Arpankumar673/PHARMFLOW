import { useState, useEffect } from 'react';
import api from '../../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Banknote, TrendingUp } from '../../constants/icons';

const ProfitAnalysis = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfit = async () => {
            try {
                const res = await api.get('/reports/profit');
                setData(res.data.data);
            } catch (err) {
                console.error("Profit data error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfit();
    }, []);

    if (loading) return <div className="h-[400px] md:h-[500px] bg-slate-50 animate-pulse rounded-2xl" />;

    const pieData = [
        { name: 'Revenue', value: data?.revenue || 0 },
        { name: 'Cost', value: data?.cost || 0 },
        { name: 'Net Profit', value: data?.profit || 0 }
    ];

    const COLORS = ['#3b82f6', '#f43f5e', '#10b981'];

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <Banknote size={22} />
                </div>
                <div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter text-slate-800">Profit Analysis</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Net margin optimization</p>
                </div>
            </div>

            <div className="h-[240px] md:h-[300px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 15px 30px -10px rgb(0 0 0 / 0.1)', padding: '10px' }}
                            itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '9px' }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            align="center"
                            iconType="circle"
                            formatter={(value) => <span className="text-[9px] font-black uppercase text-slate-400 ml-1.5">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-xl md:rounded-2xl border border-emerald-100/50">
                    <div>
                        <p className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1 italic">Net Protocol Profit</p>
                        <p className="text-xl md:text-2xl font-black text-emerald-950 tracking-tighter uppercase">₹{(data?.profit || 0).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <TrendingUp size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfitAnalysis;
