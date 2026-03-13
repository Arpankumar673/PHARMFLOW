import { useState, useEffect } from 'react';
import api, { handleApiError } from '../../services/api';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { startOfDay, isWithinInterval, subDays, endOfDay, format } from 'date-fns';

import DashboardCards from './DashboardCards';
import SalesAnalytics from './SalesAnalytics';
import InventoryAlerts from './InventoryAlerts';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import SubscriptionBanner from './SubscriptionBanner';
import FounderCard from './FounderCard';

const PharmacyDashboard = () => {
    const [stats, setStats] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [salesHistory, setSalesHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsRes, historyRes, activityRes] = await Promise.all([
                    api.get('/reports/dashboard').catch(err => ({ data: { data: {} } })),
                    api.get('/billing/history').catch(err => ({ data: { data: [] } })),
                    api.get('/dashboard/recent-activity').catch(err => ({ data: [] }))
                ]);

                const dashboardData = statsRes.data?.data || {};
                const salesData = historyRes.data?.data || [];
                const activityData = activityRes.data || [];

                // Calculate Orders Today
                const today = startOfDay(new Date());
                const ordersToday = salesData.filter(sale => 
                    new Date(sale.createdAt) >= today
                ).length;

                // Enrich stats with ordersToday
                setStats({ ...dashboardData, ordersToday });
                setTransactions(activityData);

                // Process last 7 days sales for the chart
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const date = subDays(new Date(), 6 - i);
                    const dayName = format(date, 'eee');
                    const dayStart = startOfDay(date);
                    const dayEnd = endOfDay(date);
                    
                    const dailyTotal = salesData
                        .filter(sale => isWithinInterval(new Date(sale.createdAt), { start: dayStart, end: dayEnd }))
                        .reduce((sum, sale) => sum + sale.grandTotal, 0);
                    
                    return { name: dayName, sales: dailyTotal };
                });

                setSalesHistory(last7Days);

            } catch (err) {
                console.error('Dashboard Error', err);
                toast.error('Failed to sync dashboard nodes');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[120px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initializing Terminal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6 max-w-[1600px] mx-auto pt-6 px-4 md:px-6 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase">Pharmacy <span className="text-blue-600">Overview</span></h1>
                    <p className="text-xs md:text-sm font-bold text-slate-400 italic">Analytical dashboard for your pharmacy operations.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Live System Status</span>
                </div>
            </header>

            {/* Metrics Cards */}
            <DashboardCards stats={stats} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column - Analytics & Transactions */}
                <div className="lg:col-span-2 space-y-6">
                    <SalesAnalytics salesHistory={salesHistory} />
                    <RecentActivity transactions={transactions} />
                </div>

                {/* Right Column - Actions, Alerts & Founder */}
                <div className="space-y-6">
                    <QuickActions />
                    <InventoryAlerts 
                        lowStock={stats?.lowStockMedicines} 
                        expiring={stats?.expiringSoonMedicines} 
                    />
                    <FounderCard />
                </div>
            </div>

            {/* Subscription Upgrade Section */}
            <SubscriptionBanner />
        </div>
    );
};

export default PharmacyDashboard;
