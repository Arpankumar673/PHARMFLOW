import { useState, useEffect } from 'react';
import api, { handleApiError } from '../../services/api';
import {
    Pill,
    TrendingUp,
    AlertTriangle,
    Calendar,
    BrainCircuit,
    Lock,
    History,
    CheckCircle2
} from '../../constants/icons';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import DashboardCard from './DashboardCard';
import DashboardCharts from './DashboardCharts';
import ExpiryRiskWidget from './ExpiryRiskWidget';

const PharmacyDashboard = () => {
    const [stats, setStats] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [topSelling, setTopSelling] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPredictionsLocked, setIsPredictionsLocked] = useState(false);
    const [isTopSellingLocked, setIsTopSellingLocked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsRes, predRes, topRes] = await Promise.all([
                    api.get('/reports/dashboard').catch(err => ({ data: { data: {} } })),
                    api.get('/reports/demand-prediction').catch(handleApiError),
                    api.get('/reports/top-medicines').catch(handleApiError)
                ]);

                setStats(statsRes.data?.data || null);

                if (predRes.isLocked) {
                    setIsPredictionsLocked(true);
                } else {
                    setPredictions(predRes.data?.data || predRes.data || []);
                }

                if (topRes.isLocked) {
                    setIsTopSellingLocked(true);
                } else {
                    setTopSelling(topRes.data?.data || topRes.data || []);
                }
            } catch (err) {
                console.error('Critical Dashboard Failure', err);
                toast.error('Failed to load dashboard data nodes');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="animate-pulse space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="h-10 w-64 bg-pharmacy-100 rounded-2xl"></div>
                        <div className="h-6 w-48 bg-pharmacy-50 rounded-xl"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-pharmacy-50 rounded-3xl"></div>)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="h-[500px] lg:col-span-2 bg-pharmacy-50 rounded-3xl"></div>
                    <div className="h-[500px] bg-pharmacy-50 rounded-3xl"></div>
                </div>
            </div>
        );
    }

    const analyticsCards = [
        {
            title: 'Global Inventory',
            value: stats?.totalMedicines?.toLocaleString() || 0,
            icon: Pill,
            colorClass: 'bg-primary-600',
            trend: '+12%',
            trendUp: true
        },
        {
            title: "Operating Revenue",
            value: `₹${stats?.revenueToday?.toLocaleString() || 0}`,
            icon: TrendingUp,
            colorClass: 'bg-emerald-600',
            trend: '+5.4%',
            trendUp: true
        },
        {
            title: 'Critical Stock',
            value: stats?.lowStockCount || 0,
            icon: AlertTriangle,
            colorClass: 'bg-amber-600',
            trend: '-2 Nodes',
            trendUp: false
        },
        {
            title: 'Expiry Matrix',
            value: stats?.expiringSoonCount || 0,
            icon: Calendar,
            colorClass: 'bg-rose-600',
            trend: 'Next 30D',
            trendUp: null
        },
    ];

    return (
        <div className="space-y-8 md:space-y-12 pb-24 animate-fade-in max-w-[1600px] mx-auto px-4 md:px-8 pt-4">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-white p-8 rounded-[40px] shadow-sm border border-pharmacy-50">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-primary-600 mb-2">
                        <CheckCircle2 size={18} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Status: Operational</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-pharmacy-900 tracking-tighter leading-none uppercase">Pharmacy <span className="text-primary-600">Core</span></h1>
                    <p className="text-base text-pharmacy-500 font-medium italic opacity-70">Real-time analytical interface for inventory & revenue dynamics.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <button className="flex-1 sm:flex-none justify-center bg-pharmacy-50 px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest text-pharmacy-600 hover:bg-pharmacy-100 transition-all flex items-center gap-3 active:scale-95">
                        <History size={18} />
                        Sync Logs
                    </button>
                    <button className="flex-1 sm:flex-none justify-center bg-pharmacy-900 text-white px-10 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-pharmacy-800 shadow-xl shadow-pharmacy-900/10 active:scale-95 transition-all">
                        Export Data
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {analyticsCards.map((card, idx) => (
                    <DashboardCard key={idx} {...card} />
                ))}
            </div>

            <div className="bg-white p-4 md:p-8 rounded-[40px] shadow-sm border border-pharmacy-50">
                <DashboardCharts
                    topSelling={topSelling}
                    isTopSellingLocked={isTopSellingLocked}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {/* Column 1: AI Insights */}
                <div className="space-y-8 md:space-y-12 flex flex-col">
                    <div className="bg-white border border-pharmacy-100 shadow-xl shadow-pharmacy-900/[0.02] rounded-[48px] overflow-hidden flex flex-col min-h-[600px]">
                        <div className="p-8 md:p-10 border-b border-pharmacy-50 flex items-center justify-between bg-pharmacy-50/30">
                            <h3 className="text-xl font-black text-pharmacy-900 flex items-center gap-4 uppercase tracking-tighter">
                                <div className="w-10 h-10 bg-primary-100/50 rounded-2xl flex items-center justify-center text-primary-600">
                                    <BrainCircuit size={22} />
                                </div>
                                AI Predictive Flux
                            </h3>
                            {isPredictionsLocked && (
                                <div className="bg-pharmacy-900 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-2">
                                    <Lock size={12} strokeWidth={3} />
                                    Layer Locked
                                </div>
                            )}
                        </div>

                        {isPredictionsLocked ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center m-6 rounded-[36px] bg-gradient-to-br from-pharmacy-50/50 to-white border border-pharmacy-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 blur-3xl -z-10 transition-transform group-hover:scale-150 duration-700"></div>
                                <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center mb-8 shadow-2xl shadow-primary-200/50 rotate-3 group-hover:rotate-0 transition-transform">
                                    <BrainCircuit size={32} className="text-primary-600" />
                                </div>
                                <h4 className="text-lg font-black text-pharmacy-900 mb-3 uppercase tracking-tighter">Neural Demand Engine</h4>
                                <p className="text-sm text-pharmacy-400 max-w-[280px] mb-10 font-bold italic leading-relaxed opacity-70">Unlock deep neural patterns to predict medication surges before they occur.</p>
                                <button
                                    onClick={() => window.location.href = '/subscription'}
                                    className="bg-primary-600 text-white px-12 py-5 rounded-[24px] font-black text-[11px] shadow-2xl shadow-primary-200 hover:bg-primary-700 active:scale-95 transition-all uppercase tracking-[3px]"
                                >
                                    Activate Intelligence
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto scrollbar-hide max-h-[700px]">
                                {predictions.length > 0 ? predictions.map((pred, i) => (
                                    <div key={i} className="p-8 bg-pharmacy-50/30 border border-pharmacy-100/50 rounded-[32px] hover:bg-white hover:shadow-2xl hover:shadow-pharmacy-900/5 hover:-translate-y-1 transition-all duration-500 group">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                            <p className="text-lg font-black text-pharmacy-900 group-hover:text-primary-600 transition-colors uppercase tracking-tighter leading-none">{pred.name}</p>
                                            <span className="text-[10px] bg-primary-600 text-white px-4 py-2 rounded-full uppercase font-black tracking-widest border border-primary-500 shadow-lg shadow-primary-200">
                                                {pred.recommendation}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] text-pharmacy-300 uppercase font-black tracking-[0.2em] mb-3 italic">Wave Prediction</p>
                                                <p className="text-4xl font-black text-pharmacy-900 tracking-tighter leading-none">+{pred.predictedQuantityNextWeek} <span className="text-[11px] font-bold text-pharmacy-300 uppercase tracking-widest italic ml-1 opacity-50">Volume Units</span></p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] text-primary-600 font-extrabold uppercase tracking-widest mb-1">{Math.round(pred.confidenceScore * 100)}% Match</div>
                                                <div className="w-24 h-1.5 bg-pharmacy-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary-600 rounded-full"
                                                        style={{ width: `${pred.confidenceScore * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-12 opacity-50">
                                        <History size={48} className="text-pharmacy-200 mb-6" />
                                        <p className="text-sm font-bold uppercase tracking-widest text-pharmacy-400 italic">No prediction data converged yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-2 rounded-[48px] shadow-sm border border-pharmacy-50">
                        <ExpiryRiskWidget />
                    </div>
                </div>

                {/* Column 2: Inventory Alerts */}
                <div className="space-y-8 md:space-y-12">
                    <div className="bg-white border border-pharmacy-100 shadow-xl shadow-pharmacy-900/[0.02] rounded-[48px] overflow-hidden">
                        <div className="p-8 md:p-10 border-b border-pharmacy-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-pharmacy-50/30">
                            <h3 className="text-xl font-black text-pharmacy-900 flex items-center gap-4 uppercase tracking-tighter">
                                <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                                    <AlertTriangle size={22} />
                                </div>
                                Critical Depletion
                            </h3>
                            <button onClick={() => window.location.href = '/inventory'} className="text-[10px] font-black uppercase text-primary-600 bg-white border border-primary-100 px-6 py-3 rounded-full hover:bg-primary-600 hover:text-white transition-all tracking-widest shadow-sm active:scale-95">Access Terminal</button>
                        </div>

                        {/* Mobile List View */}
                        <div className="md:hidden p-6 space-y-4 max-h-[500px] overflow-y-auto">
                            {stats?.lowStockMedicines?.length > 0 ? stats.lowStockMedicines.slice(0, 10).map((med) => (
                                <div key={med._id} className="p-6 bg-amber-50/30 border border-amber-100/50 rounded-3xl flex items-center justify-between group">
                                    <div>
                                        <p className="text-sm font-black text-pharmacy-900 uppercase tracking-tight mb-1">{med.name}</p>
                                        <p className="text-[10px] text-pharmacy-400 font-bold italic tracking-wider">Remaining: <span className="text-amber-600">{med.quantity}</span></p>
                                    </div>
                                    <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-50">
                                        <AlertTriangle size={16} />
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-[10px] font-black uppercase text-pharmacy-300 py-12">No critical stock detected.</p>
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto h-[450px] scrollbar-hide">
                            <table className="w-full text-left">
                                <thead className="bg-pharmacy-50/20 text-pharmacy-300 text-[10px] font-black uppercase tracking-[0.2em] sticky top-0 backdrop-blur-md border-b border-pharmacy-50">
                                    <tr>
                                        <th className="px-10 py-6">Identity</th>
                                        <th className="px-10 py-6 text-center">Remaining</th>
                                        <th className="px-10 py-6">Threshold</th>
                                        <th className="px-10 py-6 text-right">Protocol</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pharmacy-50/50">
                                    {stats?.lowStockMedicines?.slice(0, 15).map((med) => (
                                        <tr key={med._id} className="hover:bg-amber-50/20 transition-all group">
                                            <td className="px-10 py-8">
                                                <p className="font-black text-pharmacy-900 group-hover:text-amber-700 transition-colors uppercase tracking-tight text-lg">{med.name}</p>
                                                <p className="text-[10px] text-pharmacy-400 font-bold italic uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Request Restock</p>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <span className="text-amber-600 font-black text-4xl tracking-tighter">{med.quantity}</span>
                                            </td>
                                            <td className="px-10 py-8 font-black text-pharmacy-300 text-sm italic uppercase opacity-50">{med.lowStockThreshold} Units</td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="bg-amber-100 text-amber-700 text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-widest border border-amber-200 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-500 transition-all active:scale-95 shadow-lg shadow-amber-900/5">Initialize Refill</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white border border-pharmacy-100 shadow-xl shadow-pharmacy-900/[0.02] rounded-[48px] overflow-hidden">
                        <div className="p-8 md:p-10 border-b border-pharmacy-50 flex items-center justify-between bg-pharmacy-50/30">
                            <h3 className="text-xl font-black text-pharmacy-900 flex items-center gap-4 uppercase tracking-tighter">
                                <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                                    <History size={22} />
                                </div>
                                Expiry Breach Matrix
                            </h3>
                        </div>

                        {/* Mobile List View */}
                        <div className="md:hidden p-6 space-y-4 max-h-[400px] overflow-y-auto">
                            {stats?.expiringSoonMedicines?.length > 0 ? stats.expiringSoonMedicines.slice(0, 5).map((med) => (
                                <div key={med._id} className="p-6 bg-rose-50/30 border border-rose-100/50 rounded-3xl group">
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-sm font-black text-pharmacy-900 uppercase tracking-tight">{med.name}</p>
                                        <span className="text-[9px] font-black text-rose-600 bg-white px-3 py-1 rounded-lg border border-rose-100">
                                            {med.expiryDate ? format(new Date(med.expiryDate), 'MMM dd') : 'N/A'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-pharmacy-400 font-bold italic tracking-widest">Batch: <span className="text-pharmacy-600">{med.batchNumber}</span></p>
                                </div>
                            )) : (
                                <p className="text-center text-[10px] font-black uppercase text-pharmacy-300 py-12">No imminent breaches.</p>
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-rose-50/10 text-rose-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-rose-50">
                                    <tr>
                                        <th className="px-10 py-6">Identity</th>
                                        <th className="px-10 py-6 text-center">Batch Code</th>
                                        <th className="px-10 py-6 text-right">Violation Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pharmacy-50/50">
                                    {stats?.expiringSoonMedicines?.slice(0, 10).map((med) => (
                                        <tr key={med._id} className="hover:bg-rose-50/20 transition-all group">
                                            <td className="px-10 py-8 font-black text-pharmacy-900 group-hover:text-rose-600 transition-colors uppercase tracking-tight text-lg">{med.name}</td>
                                            <td className="px-10 py-8 text-center font-black text-pharmacy-300 italic text-base uppercase opacity-50 tracking-widest">{med.batchNumber}</td>
                                            <td className="px-10 py-8 text-right">
                                                <span className="text-xs font-black text-rose-600 bg-rose-50 px-5 py-2.5 rounded-full border border-rose-100 shadow-sm">
                                                    {med.expiryDate ? format(new Date(med.expiryDate), 'MMM dd, yyyy') : 'No Date Linked'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDashboard;
