import { useEffect, useState } from 'react';
import { 
    Download, 
    Printer, 
    FileText, 
    BarChart3,
    Calendar,
    ChevronDown,
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    AlertTriangle,
    AlertCircle,
    Crown,
    ArrowUp,
    ArrowDown
} from '../constants/icons';
import { toast } from 'react-toastify';
import api from '../services/api';
import { exportToCSV, exportToExcel } from '../utils/exportReports';
import { generateReportPDF } from '../utils/exportReportPDF';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Components
import SalesPerformance from '../components/reports/SalesPerformance';
import InventoryHealth from '../components/reports/InventoryHealth';
import SupplierAudit from '../components/reports/SupplierAudit';
import ProfitAnalysis from '../components/reports/ProfitAnalysis';
import DemandForecast from '../components/reports/DemandForecast';

const Reports = () => {
    const { user, hasPlan } = useAuth();
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState('Last 7 Days');
    const [showDateRange, setShowDateRange] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [todayStats, setTodayStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    const isPro = hasPlan('PRO');

    useEffect(() => {
        fetchTodayInsights();
        
        // Auto-refresh every 60 seconds
        const interval = setInterval(fetchTodayInsights, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchTodayInsights = async () => {
        try {
            setLoadingStats(true);
            const res = await api.get('/reports/today-insights');
            setTodayStats(res.data);
        } catch (err) {
            console.error("Failed to fetch insights", err);
        } finally {
            setLoadingStats(false);
        }
    };

    const exportReport = async (format) => {
        setExporting(true);
        toast.info(`Querying matrix for ${format} export...`);

        try {
            // Fetch comprehensive data for export
            const [salesRes, inventoryRes, profitRes] = await Promise.all([
                api.get('/reports/sales'),
                api.get('/reports/inventory-health'),
                api.get('/reports/profit')
            ]);

            const exportData = {
                summary: {
                    date: new Date().toLocaleString(),
                    range: dateRange,
                    revenue: salesRes.data.data.todayRevenue,
                    monthlyRevenue: salesRes.data.data.monthlyRevenue,
                    profit: profitRes.data.data.profit
                },
                salesTrend: salesRes.data.data.salesTrend,
                lowStock: inventoryRes.data.data.lowStock.map(m => ({ name: m.name, qty: m.quantity, threshold: m.lowStockThreshold }))
            };

            if (format === 'PDF') {
                generateReportPDF(exportData);
            } else if (format === 'CSV') {
                exportToCSV(exportData.salesTrend, `Sales_Trend_${dateRange}`);
            } else if (format === 'Excel') {
                exportToExcel(exportData.salesTrend, `Sales_Matrix_${dateRange}`);
            }
            
            toast.success('Protocol Sync Complete: File Dispatched');
        } catch (err) {
            console.error(err);
            toast.error('Export Protocol Interrupted');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-6 md:space-y-10 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Analytics Core</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-pharmacy-900 tracking-tighter uppercase leading-none">Intelligent <span className="text-blue-600">Reports</span></h1>
                    <p className="text-xs md:text-sm text-pharmacy-500 font-medium italic mt-2 opacity-60">Deep insights and predictive forecasting for pharmacy expansion.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-48">
                        <button 
                            onClick={() => setShowDateRange(!showDateRange)}
                            className="w-full bg-white border border-slate-100 px-5 py-3.5 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-sm flex items-center justify-between gap-3 hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Calendar size={14} className="text-primary-600" />
                                {dateRange}
                            </div>
                            <ChevronDown size={11} className={`text-slate-400 transition-transform ${showDateRange ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showDateRange && (
                            <div className="absolute top-full flex flex-col mt-2 left-0 w-full bg-white rounded-xl border border-slate-50 shadow-2xl z-50 p-1.5 overflow-hidden animate-down">
                                {['Today', 'Last 7 Days', 'Monthly', 'Annual'].map((range) => (
                                    <button 
                                        key={range}
                                        onClick={() => { setDateRange(range); setShowDateRange(false); }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors"
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="group relative w-full sm:w-auto">
                        <button 
                            disabled={exporting}
                            className="w-full bg-primary-600 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-2xl shadow-primary-200 flex items-center justify-center gap-3 hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Download size={14} />
                            Export Data
                        </button>
                        
                        <div className="absolute top-full mt-2 right-0 w-full sm:w-64 flex flex-col gap-0.5 p-1.5 bg-white rounded-xl border border-slate-50 shadow-2xl z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto translate-y-2 group-hover:translate-y-0 transition-all">
                            {[
                                { name: 'PDF', icon: <FileText size={14} /> },
                                { name: 'CSV', icon: <BarChart3 size={14} /> },
                                { name: 'Excel', icon: <Printer size={14} /> }
                            ].map((fmt) => (
                                <button 
                                    key={fmt.name}
                                    onClick={() => exportReport(fmt.name)}
                                    className="w-full text-left px-5 py-3 hover:bg-slate-50 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-all flex items-center gap-3 whitespace-nowrap"
                                >
                                    {fmt.icon}
                                    Export to {fmt.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* TODAY INSIGHTS PANEL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {[
                    { 
                        label: 'Revenue Today', 
                        value: `₹${todayStats?.revenueToday?.toLocaleString() || '0'}`, 
                        icon: <TrendingUp size={22} md:size={24} />, 
                        color: 'text-emerald-500', 
                        bg: 'bg-emerald-50',
                        trend: todayStats?.revenueTrend,
                        path: '/reports'
                    },
                    { 
                        label: 'Orders Today', 
                        value: todayStats?.ordersToday || '0', 
                        icon: <ShoppingCart size={22} md:size={24} />, 
                        color: 'text-blue-500', 
                        bg: 'bg-blue-50',
                        trend: todayStats?.ordersTrend,
                        path: '/billing'
                    },
                    { 
                        label: 'Low Stock', 
                        value: todayStats?.lowStockCount || '0', 
                        icon: <AlertTriangle size={22} md:size={24} />, 
                        color: 'text-amber-500', 
                        bg: 'bg-amber-50',
                        path: '/inventory?filter=low-stock'
                    },
                    { 
                        label: 'Expiry Risk', 
                        value: todayStats?.expiryRisk || '0', 
                        icon: <AlertCircle size={22} md:size={24} />, 
                        color: 'text-rose-500', 
                        bg: 'bg-rose-50',
                        path: '/inventory?filter=expiry-risk'
                    }
                ].map((stat, i) => (
                    <div 
                        key={i} 
                        onClick={() => navigate(stat.path)}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                    >
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform`}>
                            {stat.icon}
                        </div>
                        {loadingStats ? (
                            <div className="space-y-2 flex-1">
                                <div className="h-2 w-16 bg-slate-100 animate-pulse rounded-full" />
                                <div className="h-6 w-24 bg-slate-50 animate-pulse rounded-full" />
                            </div>
                        ) : (
                            <div className="flex-1">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</h4>
                                <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</p>
                                
                                {stat.trend !== undefined && (
                                    <div className={`flex items-center gap-1 mt-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest ${stat.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {stat.trend >= 0 ? <ArrowUp size={10} strokeWidth={3} /> : <ArrowDown size={10} strokeWidth={3} />}
                                        {Math.abs(Math.round(stat.trend))}%
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="space-y-8 md:space-y-12">
                {/* SECTION 1: OPERATIONAL ANALYTICS */}
                <section>
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <div className="h-px bg-slate-100 flex-1"></div>
                        <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Operational Analytics</h2>
                        <div className="h-px bg-slate-100 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                        <SalesPerformance />
                        <ProfitAnalysis />
                    </div>
                </section>

                {/* SECTION 2: INVENTORY INTELLIGENCE */}
                <section>
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <div className="h-px bg-slate-100 flex-1"></div>
                        <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Inventory Intelligence</h2>
                        <div className="h-px bg-slate-100 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                        <InventoryHealth />
                        <SupplierAudit />
                    </div>
                </section>

                {/* SECTION 3: AI INTELLIGENCE (PRO) */}
                <section>
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <div className="h-px bg-slate-100 flex-1"></div>
                        <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">AI Intelligence Core</h2>
                        <div className="h-px bg-slate-100 flex-1"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                        {isPro ? (
                            <>
                                <DemandForecast />
                                <div className="bg-white p-8 md:p-12 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all">
                                    <BarChart3 size={40} md:size={48} className="text-slate-300 mb-6" />
                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2">Price Intelligence Hub</h3>
                                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[200px]">Market margin benchmarks node is currently initializing calibration.</p>
                                </div>
                            </>
                        ) : (
                            <div className="col-span-full bg-gradient-to-br from-pharmacy-900 to-pharmacy-950 p-10 md:p-16 rounded-2xl text-white relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
                                <div className="absolute inset-0 bg-grid-white opacity-[0.03]"></div>
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-primary-400 mb-8 md:mb-10 shadow-inner">
                                    <Crown size={32} md:size={40} />
                                </div>
                                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 leading-tight">Pro Features Locked</h2>
                                <p className="text-slate-400 font-medium italic mb-10 md:mb-12 max-w-lg text-xs md:text-sm">Upgrade to Pro to unlock AI insights, predictive demand forecasting, and automated inventory refills.</p>
                                <button 
                                    onClick={() => navigate('/subscription')}
                                    className="bg-primary-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary-500/30 hover:bg-primary-500 transition-all active:scale-95 flex items-center gap-4"
                                >
                                    Unlock Pro Now
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <footer className="pt-8 md:pt-12 text-center opacity-30">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">PharmFlow Intelligence System v2.0 - Encrypted Data Protocol</p>
            </footer>
        </div>
    );
};

export default Reports;
