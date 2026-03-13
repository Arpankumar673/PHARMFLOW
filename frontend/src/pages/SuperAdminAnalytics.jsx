import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Users,
    CreditCard,
    TrendingUp,
    PieChart,
    Activity,
    ArrowUpRight,
    Building2,
    Loader2
} from '../constants/icons';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend as ChartLegend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const SuperAdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/subscription/admin/analytics');
                setData(res.data.data);
            } catch (err) {
                console.error('Error fetching admin analytics', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 italic">Syncing command center...</p>
            </div>
        );
    }

    const doughnutData = {
        labels: data?.planDistribution.map(p => p._id) || [],
        datasets: [
            {
                label: 'Active Plans',
                data: data?.planDistribution.map(p => p.count) || [],
                backgroundColor: [
                    'rgba(14, 165, 233, 0.6)',
                    'rgba(16, 185, 129, 0.6)',
                    'rgba(139, 92, 246, 0.6)',
                ],
                borderColor: [
                    '#0ea5e9',
                    '#10b981',
                    '#8b5cf6',
                ],
                borderWidth: 2,
            },
        ],
    };

    const cards = [
        {
            title: 'Total Pharmacies',
            value: data?.totalPharmacies || 0,
            icon: Building2,
            color: 'bg-blue-600',
            subtitle: 'Onboarded worldwide'
        },
        {
            title: 'Active Subscriptions',
            value: data?.activeSubscriptions || 0,
            icon: CreditCard,
            color: 'bg-emerald-600',
            subtitle: 'Premium nodes active'
        },
        {
            title: 'Monthly Revenue',
            value: `₹${data?.monthlyRevenue?.toLocaleString() || 0}`,
            icon: TrendingUp,
            color: 'bg-indigo-600',
            subtitle: 'Real-time billing'
        },
        {
            title: 'System Health',
            value: '99.9%',
            icon: Activity,
            color: 'bg-rose-600',
            subtitle: 'All clusters operational'
        }
    ];

    return (
        <div className="space-y-6 md:space-y-10 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
                <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Command <span className="text-primary-600">Center</span></h1>
                    <p className="text-xs md:text-sm text-slate-500 font-medium italic mt-2 opacity-70">Global platform overview and subscription performance.</p>
                </div>
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Cluster: Primary</span>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`${card.color} w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <card.icon size={20} />
                            </div>
                            <div className="bg-emerald-50 text-emerald-600 p-1 rounded-lg">
                                <ArrowUpRight size={14} />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest italic">{card.title}</p>
                            <h3 className="text-2xl md:text-3xl font-black mt-1 tracking-tighter text-slate-900 leading-none">{card.value}</h3>
                            <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tight opacity-60">{card.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-1 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-lg font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-2">
                        <PieChart size={18} className="text-primary-600" />
                        Plan Distribution
                    </h3>
                    <div className="w-full max-w-[240px] aspect-square">
                        <Doughnut data={doughnutData} options={{ cutout: '75%', plugins: { legend: { position: 'bottom', labels: { font: { weight: 'bold', size: 10 } } } } }} />
                    </div>
                </div>

                <div className="lg:col-span-2 bg-slate-900 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-white opacity-[0.03]"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                    
                    <h3 className="text-lg font-black text-white mb-8 uppercase tracking-tighter flex items-center gap-2 relative z-10">
                        <Users size={18} className="text-primary-400" />
                        Platform Growth
                    </h3>
                    
                    <div className="space-y-6 relative z-10">
                        <div className="p-5 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/10 transition-all">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 leading-none">Revenue Growth</p>
                                <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase italic">+15% Phase</span>
                            </div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div className="bg-primary-500 h-full w-[75%] shadow-[0_0_10px_#0ea5e9]"></div>
                            </div>
                        </div>

                        <div className="p-5 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/10 transition-all">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 leading-none">Conversion Vector</p>
                                <span className="text-[10px] font-black text-white tracking-widest uppercase italic">Node Optimization</span>
                            </div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[42%] shadow-[0_0_10px_#10b981]"></div>
                            </div>
                        </div>

                        <div className="p-5 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/10 transition-all">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 leading-none">Churn Damping</p>
                                <span className="text-[10px] font-black text-white/40 tracking-widest uppercase italic">Nominal Matrix</span>
                            </div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div className="bg-rose-500 h-full w-[8%] shadow-[0_0_10px_#f43f5e]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminAnalytics;
