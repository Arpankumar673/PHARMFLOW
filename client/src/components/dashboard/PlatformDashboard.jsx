import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Building2,
    Zap,
    IndianRupee,
    Pill,
    BarChart3,
    TrendingUp,
    Users,
    Activity
} from '../../constants/icons';
import DashboardCard from './DashboardCard';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const PlatformDashboard = () => {
    const [stats, setStats] = useState(null);
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlatformData = async () => {
            try {
                const [analyticsRes, pharmaciesRes] = await Promise.all([
                    api.get('/platform/analytics'),
                    api.get('/platform/pharmacies')
                ]);
                setStats(analyticsRes.data.data);
                setPharmacies(pharmaciesRes.data.data);
            } catch (err) {
                console.error('Failed to fetch platform analytics', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlatformData();
    }, []);

    if (loading) return (
        <div className="min-h-[600px] flex flex-col items-center justify-center p-8 text-center animate-pulse">
            <div className="w-16 h-16 bg-primary-100 rounded-[24px] flex items-center justify-center text-primary-600 mb-6">
                <Activity size={32} />
            </div>
            <h2 className="text-xl font-black text-pharmacy-900 uppercase tracking-tighter mb-2">Syncing Global Hub</h2>
            <p className="text-sm font-bold text-pharmacy-400 italic uppercase tracking-widest opacity-50">Authorizing Platform Data Nodes...</p>
        </div>
    );

    const cards = [
        {
            title: 'Global Pharmacies',
            value: stats?.totalPharmacies || 0,
            icon: Building2,
            colorClass: 'bg-primary-600',
            trend: 'Active Nodes',
            trendUp: true
        },
        {
            title: 'Active Tiers',
            value: stats?.activeSubscriptions || 0,
            icon: Zap,
            colorClass: 'bg-amber-500',
            trend: 'Paid Deployments',
            trendUp: true
        },
        {
            title: 'Monthly Yield',
            value: `₹${stats?.monthlyRevenue?.toLocaleString() || 0}`,
            icon: IndianRupee,
            colorClass: 'bg-emerald-600',
            trend: 'SaaS Revenue',
            trendUp: true
        },
        {
            title: 'Global Inventory',
            value: stats?.totalMedicines?.toLocaleString() || 0,
            icon: Pill,
            colorClass: 'bg-blue-600',
            trend: 'Master Stock',
            trendUp: true
        }
    ];

    const growthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Pharmacy Growth',
            data: [2, 5, 8, 12, 19, stats?.totalPharmacies || 25],
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.05)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#0ea5e9',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

    const planData = {
        labels: stats?.planDistribution?.map(p => p._id) || ['Basic', 'Pro', 'Enterprise'],
        datasets: [{
            data: stats?.planDistribution?.map(p => p.count) || [12, 5, 3],
            backgroundColor: ['#94a3b8', '#0ea5e9', '#10b981'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    return (
        <div className="space-y-8 md:space-y-12 animate-fade-in pb-24 max-w-[1600px] mx-auto px-4 md:px-8 pt-4">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-pharmacy-900 p-8 md:p-12 rounded-[40px] shadow-2xl shadow-pharmacy-900/10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-3xl rounded-full -z-10 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-primary-400 mb-2">
                        <Activity size={18} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Access Level: SuperAdmin</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase">Platform <span className="text-primary-500">Nexus</span></h1>
                    <p className="text-base text-pharmacy-200 font-medium italic opacity-60">Global supervision of multi-tenant pharmacy clusters.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <button className="flex-1 sm:flex-none justify-center bg-white/10 backdrop-blur-md border border-white/10 px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/20 transition-all flex items-center gap-3 active:scale-95">
                        <Users size={18} />
                        Tenant Registry
                    </button>
                    <button className="flex-1 sm:flex-none justify-center bg-primary-600 text-white px-10 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-900/20 active:scale-95 transition-all">
                        Global Audit
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {cards.map((card, i) => (
                    <DashboardCard key={i} {...card} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                <div className="bg-white p-8 md:p-10 rounded-[48px] border border-pharmacy-100 shadow-xl shadow-pharmacy-900/[0.02] flex flex-col h-full">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="font-black text-pharmacy-900 uppercase tracking-tighter text-xl flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary-100/50 rounded-2xl flex items-center justify-center text-primary-600">
                                <TrendingUp size={22} />
                            </div>
                            Expansion Dynamics
                        </h3>
                    </div>
                    <div className="flex-1 min-h-[300px]">
                        <Line
                            data={growthData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { display: false }, border: { display: false }, ticks: { font: { weight: 'bold' } } },
                                    x: { grid: { display: false }, border: { display: false }, ticks: { font: { weight: 'bold' } } }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[48px] border border-pharmacy-100 shadow-xl shadow-pharmacy-900/[0.02] flex flex-col h-full">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="font-black text-pharmacy-900 uppercase tracking-tighter text-xl flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-100/50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <BarChart3 size={22} />
                            </div>
                            Tier Distribution
                        </h3>
                    </div>
                    <div className="flex-1 min-h-[300px] flex items-center justify-center">
                        <Doughnut
                            data={planData}
                            options={{
                                maintainAspectRatio: false,
                                cutout: '75%',
                                plugins: { legend: { position: 'bottom', labels: { font: { weight: 'bold', size: 10 }, usePointStyle: true, padding: 25 } } }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-pharmacy-100 shadow-xl shadow-pharmacy-900/[0.02] rounded-[48px] overflow-hidden">
                <div className="p-8 md:p-10 border-b border-pharmacy-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-pharmacy-50/30">
                    <h3 className="text-xl font-black text-pharmacy-900 flex items-center gap-4 uppercase tracking-tighter">
                        <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                            <Activity size={22} />
                        </div>
                        Active Pharmacy Nodes
                    </h3>
                    <button className="text-[10px] font-black uppercase text-primary-600 bg-white border border-primary-100 px-6 py-3 rounded-full hover:bg-primary-600 hover:text-white transition-all tracking-widest shadow-sm active:scale-95">Access Registry</button>
                </div>

                {/* Mobile View */}
                <div className="md:hidden p-6 space-y-4 max-h-[500px] overflow-y-auto">
                    {pharmacies.slice(0, 10).map((pharmacy) => (
                        <div key={pharmacy._id} className="p-6 bg-pharmacy-50/30 border border-pharmacy-100/50 rounded-3xl flex items-center justify-between group">
                            <div>
                                <p className="text-sm font-black text-pharmacy-900 uppercase tracking-tight mb-1">{pharmacy.name}</p>
                                <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest">{pharmacy.subscriptionPlan} Tier</p>
                            </div>
                            <div className={clsx(
                                "w-2 h-2 rounded-full animate-pulse",
                                pharmacy.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                            )}></div>
                        </div>
                    ))}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-pharmacy-50/20 text-pharmacy-300 text-[10px] font-black uppercase tracking-[0.2em] border-b border-pharmacy-50">
                            <tr>
                                <th className="px-10 py-6">Branch Architecture</th>
                                <th className="px-10 py-6">Operator</th>
                                <th className="px-10 py-6">Deployment Tier</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-right">Yield</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pharmacy-50/50 font-medium">
                            {pharmacies.slice(0, 10).map((pharmacy, i) => (
                                <tr key={pharmacy._id} className="hover:bg-pharmacy-50/20 transition-all group">
                                    <td className="px-10 py-8">
                                        <p className="font-black text-pharmacy-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight text-lg leading-none mb-2">{pharmacy.name}</p>
                                        <p className="text-[10px] text-pharmacy-400 font-bold italic tracking-widest opacity-60">Uptime: 99.9% • Hub ID: {pharmacy._id.slice(-8).toUpperCase()}</p>
                                    </td>
                                    <td className="px-10 py-8 text-pharmacy-500 font-bold">{pharmacy.ownerName}</td>
                                    <td className="px-10 py-8">
                                        <span className="text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest bg-primary-50 text-primary-600 border border-primary-100 shadow-sm">{pharmacy.subscriptionPlan}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className={clsx(
                                                "w-2 h-2 rounded-full animate-pulse",
                                                pharmacy.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                                            )}></div>
                                            <span className={clsx(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                pharmacy.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'
                                            )}>{pharmacy.status || 'Verified'}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right font-black text-pharmacy-900 text-lg tracking-tighter">₹{pharmacy.subscriptionPlan === 'Enterprise' ? '799' : (pharmacy.subscriptionPlan === 'Pro' ? '399' : '199')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlatformDashboard;
