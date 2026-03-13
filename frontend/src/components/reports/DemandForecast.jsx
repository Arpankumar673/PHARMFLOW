import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Crown, Zap, ShieldCheck, BarChart3 } from '../../constants/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const DemandForecast = () => {
    const { user, hasPlan } = useAuth();
    const navigate = useNavigate();
    
    // Debug subscription plan
    console.log("User plan identity:", user?.plan);
    
    const isPro = hasPlan('PRO');
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isPro) {
            fetchForecast();
        }
    }, [isPro]);

    const fetchForecast = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reports/demand-forecast');
            setData(res.data.data);
        } catch (err) {
            console.error("Forecast data error", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isPro) {
        return (
            <div className="bg-gradient-to-br from-pharmacy-900 via-slate-800 to-pharmacy-950 p-8 md:p-12 lg:p-16 rounded-2xl text-white relative overflow-hidden shadow-2xl group flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-grid-white bg-[size:30px_30px] opacity-[0.03]"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-primary-400/30 transition-all duration-1000"></div>
                
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl flex items-center justify-center text-primary-400 mb-6 md:mb-8 shadow-inner border border-white/10 group-hover:rotate-12 transition-transform">
                    <Sparkles size={32} className="md:w-10 md:h-10 animate-pulse" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 leading-tight">AI Demand Forecast</h3>
                <p className="text-slate-400 font-medium italic mb-8 md:mb-10 max-w-xs text-xs md:text-sm">Artificial intelligence driven medicine demand prediction locked to Quantum Hub.</p>
                
                <button 
                    onClick={() => navigate('/subscription')}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-2xl shadow-primary-500/30 hover:bg-primary-500 active:scale-95 transition-all"
                >
                    <Crown size={16} fill="white" />
                    Unlock Pro Protocol
                </button>
            </div>
        );
    }

    if (loading) return <div className="h-[400px] md:h-[500px] bg-slate-50 animate-pulse rounded-2xl" />;

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full gap-6">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-50 rounded-xl md:rounded-2xl flex items-center justify-center text-primary-600 shadow-inner">
                    <Zap size={22} />
                </div>
                <div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter text-slate-800">AI Forecasting</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Predictive demand analysis</p>
                </div>
            </div>

            <div className="h-[240px] md:h-[300px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 15px 30px -10px rgb(0 0 0 / 0.1)', padding: '10px' }}
                            itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '9px' }}
                        />
                        <Bar 
                            dataKey="predictedDemand" 
                            fill="#3b82f6" 
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4">
                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary-600 mb-3 flex items-center gap-2 italic">
                    <ShieldCheck size={14} /> Confidence Verification
                </h4>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {data.slice(0, 2).map((med, i) => (
                        <div key={i} className="p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl border border-white">
                            <p className="text-xl md:text-2xl font-black text-slate-950 tracking-tighter uppercase">{med.confidence}%</p>
                            <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Accuracy Score</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DemandForecast;
