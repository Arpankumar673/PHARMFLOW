import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    ArrowUpRight
} from '../constants/icons';
import { useRole } from '../context/RoleContext';

const PriceIntelligence = () => {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false);
    const { hasPermission } = useRole();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/analytics/price-intelligence');
                setAnalytics(res.data.data);
            } catch (err) {
                if (err.response?.status === 403) {
                    setIsLocked(true);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center p-8 md:p-20 text-center bg-gray-50 border border-dashed border-gray-200 rounded-[56px] max-w-4xl mx-auto">
                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mb-10 shadow-xl shadow-gray-200/50">
                    <TrendingUp size={48} className="text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4 leading-tight">Margin Engine Locked</h2>
                <p className="text-gray-500 max-w-md italic mb-12 text-lg">Market price benchmarking and profit vector analysis requires Pro Level clearance. Upgrade to scale your pharmacy margins.</p>
                <button
                    onClick={() => window.location.href = '/subscription'}
                    className="w-full sm:w-auto bg-emerald-600 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-95"
                >
                    Upgrade Data Feed
                </button>
            </div>
        );
    }

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
        <div className="space-y-12 animate-fade-in pb-24 max-w-[1400px] mx-auto px-4 md:px-0">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Market Intelligence Node</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-pharmacy-900 tracking-tighter uppercase leading-none">Price Intelligence</h1>
                    <p className="text-pharmacy-500 font-medium italic mt-3 opacity-60">Real-time market price benchmarks and high-fidelity margin analysis.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {analytics.length > 0 ? analytics.map((item, i) => (
                    <div key={i} className="bg-white p-10 rounded-[56px] border border-pharmacy-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col">
                        <div className="flex justify-between items-start mb-10">
                            <h3 className="font-black text-2xl text-pharmacy-900 uppercase tracking-tighter leading-none group-hover:text-emerald-600 transition-colors">{item.medicineName}</h3>
                            <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-100 italic">
                                {item.margin}% Yield
                            </span>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="group/field bg-pharmacy-50/50 p-6 rounded-[32px] border border-transparent hover:border-pharmacy-100 transition-all flex flex-col gap-1">
                                <p className="text-[9px] font-black uppercase text-pharmacy-400 tracking-[0.2em] leading-none mb-1">Global Market Median</p>
                                <p className="text-3xl font-black text-pharmacy-950 tracking-tighter">₹{item.averageMarketPrice}</p>
                            </div>

                            <div className="group/field bg-emerald-50/20 p-6 rounded-[32px] border-2 border-emerald-500/10 hover:border-emerald-500/30 transition-all flex flex-col gap-1">
                                <p className="text-[9px] font-black uppercase text-emerald-600 tracking-[0.2em] leading-none mb-1">Node Selling Price</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-black text-emerald-700 tracking-tighter">₹{item.sellingPrice}</p>
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
                                        <ArrowUpRight size={20} className={item.sellingPrice < item.averageMarketPrice ? "rotate-90" : ""} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-pharmacy-50 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${item.sellingPrice < item.averageMarketPrice ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                                }`}>
                                {item.sellingPrice < item.averageMarketPrice ? (
                                    <TrendingDown size={24} />
                                ) : (
                                    <TrendingUp size={24} />
                                )}
                            </div>
                            <p className="text-[11px] font-black text-pharmacy-500 uppercase tracking-tight italic flex-1 leading-relaxed">
                                {item.sellingPrice < item.averageMarketPrice
                                    ? "Competitive advantage detected. Node priced below sector median."
                                    : "Premium calibration. Node priced above sector median."}
                            </p>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-32 text-center opacity-10 group-hover:opacity-20 transition-opacity flex flex-col items-center">
                        <div className="relative group/grid">
                            <BarChart3 size={120} strokeWidth={0.5} className="group-hover/grid:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-emerald-400 blur-[80px] rounded-full opacity-10 group-hover/grid:opacity-30 transition-opacity"></div>
                        </div>
                        <p className="text-lg font-black uppercase tracking-[0.5em] mt-16 italic">Calibration Pattern Unknown</p>
                        <p className="text-[10px] font-bold text-pharmacy-300 mt-4 uppercase tracking-[0.3em]">No pricing data linked to current nodes.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export default PriceIntelligence;
