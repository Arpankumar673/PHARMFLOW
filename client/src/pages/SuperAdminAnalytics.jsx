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
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-600" size={48} />
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
            color: 'bg-blue-500',
            subtitle: 'Onboarded worldwide'
        },
        {
            title: 'Active Subscriptions',
            value: data?.activeSubscriptions || 0,
            icon: CreditCard,
            color: 'bg-emerald-500',
            subtitle: 'Premium nodes active'
        },
        {
            title: 'Monthly Revenue',
            value: `₹${data?.monthlyRevenue?.toLocaleString() || 0}`,
            icon: TrendingUp,
            color: 'bg-indigo-500',
            subtitle: 'Real-time billing'
        },
        {
            title: 'System Health',
            value: '99.9%',
            icon: Activity,
            color: 'bg-rose-500',
            subtitle: 'All clusters operational'
        }
    ];

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-3xl font-black text-pharmacy-900 tracking-tight">SaaS Command Center</h1>
                <p className="text-pharmacy-500 font-medium mt-1">Global platform overview and subscription performance.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="card p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 border-none ring-1 ring-pharmacy-100 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${card.color} p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <card.icon size={24} />
                            </div>
                            <div className="bg-green-100 text-green-700 p-1 rounded-lg">
                                <ArrowUpRight size={14} />
                            </div>
                        </div>
                        <div>
                            <p className="text-pharmacy-400 text-xs font-black uppercase tracking-widest">{card.title}</p>
                            <h3 className="text-3xl font-black mt-1 tracking-tighter text-pharmacy-900">{card.value}</h3>
                            <p className="text-[10px] text-pharmacy-400 mt-2 font-bold">{card.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 card p-8 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-pharmacy-900 mb-8 flex items-center gap-2">
                        <PieChart size={20} className="text-primary-600" />
                        Plan Distribution
                    </h3>
                    <div className="w-full aspect-square">
                        <Doughnut data={doughnutData} options={{ cutout: '70%', plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>

                <div className="lg:col-span-2 card p-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/30 blur-[100px] rounded-full"></div>
                    <h3 className="text-lg font-bold text-pharmacy-900 mb-6 flex items-center gap-2 relative z-10">
                        <Users size={20} className="text-primary-600" />
                        Platform Performance Insights
                    </h3>
                    <div className="space-y-6 relative z-10">
                        <div className="p-4 bg-pharmacy-50 rounded-2xl border border-pharmacy-100">
                            <p className="text-sm font-bold text-pharmacy-900 mb-1">Revenue Growth</p>
                            <div className="w-full bg-pharmacy-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-primary-600 h-full w-[75%]"></div>
                            </div>
                            <p className="text-[10px] text-pharmacy-400 mt-2 font-black uppercase tracking-widest">+15% from last month</p>
                        </div>
                        <div className="p-4 bg-pharmacy-50 rounded-2xl border border-pharmacy-100">
                            <p className="text-sm font-bold text-pharmacy-900 mb-1">Conversion Rate</p>
                            <div className="w-full bg-pharmacy-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[42%]"></div>
                            </div>
                            <p className="text-[10px] text-pharmacy-400 mt-2 font-black uppercase tracking-widest">Free to Premium</p>
                        </div>
                        <div className="p-4 bg-pharmacy-50 rounded-2xl border border-pharmacy-100">
                            <p className="text-sm font-bold text-pharmacy-900 mb-1">Churn Rate</p>
                            <div className="w-full bg-pharmacy-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-rose-500 h-full w-[8%]"></div>
                            </div>
                            <p className="text-[10px] text-pharmacy-400 mt-2 font-black uppercase tracking-widest">Industry low: 0.8%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminAnalytics;
