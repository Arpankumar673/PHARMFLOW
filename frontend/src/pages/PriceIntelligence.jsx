import { useState, useEffect } from 'react';
import api from '../services/api';
import { ArrowUpRight, BarChart3, TrendingDown, TrendingUp, Crown } from '../constants/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PriceIntelligence = () => {
    const { user, hasPlan } = useAuth();
    const navigate = useNavigate();
    
    // Debug subscription plan identity
    console.log("DEBUG: Current User Plan ->", user?.plan);

    const [data, setData] = useState({ medicines: [] });
    const [loading, setLoading] = useState(true);
    
    const isPro = hasPlan('PRO');
    const isEnterprise = hasPlan('ENTERPRISE');
    const isBasic = !isPro && !isEnterprise;
    const plan = user?.plan?.toUpperCase() || 'BASIC';

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/analytics/price-intelligence');
                setData(res.data.data);
            } catch (err) {
                console.error("Price intelligence error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [plan]);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-50 border-t-emerald-600 animate-spin"></div>
                <BarChart3 size={24} className="absolute inset-0 m-auto text-emerald-600 animate-pulse" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 italic">Aggregating Market Intelligence...</p>
        </div>
    );

    return (
        <div className="space-y-6 md:space-y-10 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic font-bold border border-emerald-100/50">
                            {plan} NODE
                        </span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-pharmacy-900 tracking-tighter uppercase leading-none">Price <span className="text-emerald-600">Intelligence</span></h1>
                    <p className="text-xs md:text-sm text-pharmacy-500 font-medium italic mt-2 opacity-60">Real-time market price benchmarks and margin analysis.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* 1. Market Benchmark Table */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tighter">Market Benchmarks</h2>
                        {isBasic && <span className="text-[8px] md:text-[9px] font-black bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full uppercase tracking-widest border border-amber-100">Preview Mode</span>}
                    </div>
                    
                    <div className="space-y-3">
                        {data.medicines.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 md:p-5 bg-slate-50/50 rounded-xl border border-transparent hover:border-emerald-100 hover:bg-white transition-all group/item">
                                <div>
                                    <p className="font-black text-slate-900 uppercase tracking-tight text-xs md:text-sm">{item.name}</p>
                                    <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Market Avg: ₹{item.marketAverage}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-base md:text-lg font-black text-emerald-600 tracking-tighter">₹{item.sellingPrice}</p>
                                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover/item:text-emerald-400 transition-colors">{item.margin}% Margin</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Profit Optimization / Recommend Section */}
                <div className="flex flex-col gap-6 lg:gap-8">
                    {(isPro || isEnterprise) ? (
                        <div className="bg-emerald-900 text-white p-8 md:p-10 rounded-2xl shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-grid-white opacity-[0.05]"></div>
                            <div className="relative z-10">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-6 italic">AI Price Optimization</h3>
                                <div className="mb-8 md:mb-10">
                                    <p className="text-4xl md:text-5xl font-black tracking-tighter mb-2">₹{data.recommendedPrice}</p>
                                    <p className="text-[10px] md:text-xs font-medium text-emerald-300 opacity-60 uppercase tracking-widest">Recommended Node Benchmark</p>
                                </div>
                                <div className="p-5 md:p-6 bg-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center">
                                            <ArrowUpRight size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-300">Global Sector Avg</p>
                                            <p className="text-lg md:text-xl font-black tracking-tighter">₹{data.marketAverage}</p>
                                        </div>
                                    </div>
                                    <div className="sm:text-right">
                                        <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">+12.4% Yield</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 border border-dashed border-slate-200 p-8 md:p-12 rounded-2xl flex flex-col items-center text-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-6 md:mb-8 shadow-xl shadow-slate-200/50">
                                <Crown size={32} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Unlock AI Intelligence</h3>
                            <p className="text-slate-500 max-w-xs italic mb-8 text-xs md:text-sm">Upgrade to Pro to analyze margins, access market benchmarks, and receive AI price alerts.</p>
                            <button 
                                onClick={() => navigate('/subscription')}
                                className="w-full sm:w-auto bg-primary-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95"
                            >
                                Unlock Pro Features
                            </button>
                        </div>
                    )}

                    {/* Stats Tiles */}
                    {(isPro || isEnterprise) && (
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Margin Flow</p>
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-3">
                                    <TrendingUp size={24} />
                                </div>
                                <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase">Optimized</p>
                            </div>
                            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Market Index</p>
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-3">
                                    <BarChart3 size={24} />
                                </div>
                                <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase">Top 5%</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Enterprise Advanced Node */}
            {isEnterprise && (
                <div className="bg-slate-900 p-8 md:p-12 rounded-2xl text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white opacity-[0.03]"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 leading-tight">Auto-Margin Optimizer</h3>
                            <p className="text-slate-400 max-w-sm italic text-xs md:text-sm">Multi-store dynamic pricing sync and automated regional market benchmarking protocol active.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="flex-1 md:flex-none p-6 md:p-8 bg-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/10 text-center">
                                <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest mb-1.5">Regional Sync</p>
                                <p className="text-xl md:text-2xl font-black tracking-tighter">14 Nodes</p>
                            </div>
                            <div className="flex-1 md:flex-none p-6 md:p-8 bg-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/10 text-center">
                                <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest mb-1.5">Efficiency</p>
                                <p className="text-xl md:text-2xl font-black tracking-tighter">99.8%</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PriceIntelligence;
