import React from 'react';
import {
    BarChart3,
    TrendingUp,
    FileText,
    PieChart,
    Download,
    Calendar,
    ArrowUpRight,
    Zap,
    Target,
    Activity
} from '../constants/icons';

const Reports = () => {
    const reportCategories = [
        {
            name: 'Sales Performance',
            icon: TrendingUp,
            desc: 'Daily, weekly and monthly revenue clusters.',
            status: 'Operational',
            color: 'bg-emerald-500'
        },
        {
            name: 'Inventory Health',
            icon: PieChart,
            desc: 'Stock depletion and expiration matrices.',
            status: 'Syncing',
            color: 'bg-amber-500'
        },
        {
            name: 'Supplier Audit',
            icon: FileText,
            desc: 'Vendor fulfillment and payment history.',
            status: 'Operational',
            color: 'bg-blue-500'
        }
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20 max-w-[1600px] mx-auto">
            <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Enterprise Analytics</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
                            <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Live Feed</span>
                        </div>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-pharmacy-900 tracking-tighter uppercase leading-none">Intelligent Reports</h1>
                    <p className="text-pharmacy-500 font-medium italic mt-3 opacity-60">Deep neural insights for operational excellence & pharmacy growth.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-white px-8 py-4 rounded-[24px] shadow-sm border border-pharmacy-100 text-[10px] font-black uppercase tracking-widest text-pharmacy-600 flex items-center justify-center gap-3 hover:bg-pharmacy-50 transition-all group">
                        <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
                        Temporal Range
                    </button>
                    <button className="bg-pharmacy-900 text-white px-10 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-pharmacy-200 hover:bg-black active:scale-95 transition-all">
                        <Download size={18} />
                        Export Data Protocol
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {reportCategories.map((cat, idx) => (
                    <div key={idx} className="bg-white p-10 rounded-[48px] border border-pharmacy-50 shadow-sm hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.12)] transition-all group cursor-pointer relative overflow-hidden active:scale-[0.98]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity -mr-12 -mt-12"></div>

                        <div className="flex items-start justify-between mb-8">
                            <div className="w-16 h-16 bg-pharmacy-50 text-pharmacy-900 rounded-[28px] flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all shadow-inner">
                                <cat.icon size={28} strokeWidth={2.5} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 ${cat.color} rounded-full`}></span>
                                <span className="text-[10px] font-black text-pharmacy-400 uppercase tracking-widest">{cat.status}</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-pharmacy-900 mb-2 uppercase tracking-tighter leading-tight">{cat.name}</h3>
                        <p className="text-sm text-pharmacy-400 font-medium italic mb-10 leading-relaxed">{cat.desc}</p>

                        <div className="flex items-center justify-between pt-8 border-t border-pharmacy-50 mt-auto">
                            <div className="flex items-center gap-3 text-primary-600 text-[10px] font-black uppercase tracking-widest group-hover:gap-5 transition-all">
                                Open Terminal
                                <ArrowUpRight size={18} />
                            </div>
                            <div className="flex -space-x-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                <div className="w-8 h-8 rounded-full bg-primary-100 border-2 border-white"></div>
                                <div className="w-8 h-8 rounded-full bg-primary-200 border-2 border-white"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative">
                <div className="absolute inset-0 bg-primary-900 rounded-[64px] shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                </div>

                <div className="relative p-12 lg:p-24 flex flex-col items-center justify-center text-center text-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full max-w-6xl mx-auto">
                        <div className="text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-white/5">
                                <Zap size={14} className="text-amber-400 fill-amber-400" />
                                Optimization in Progress
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[1.1] mb-8">Analytics Engine is<br /><span className="text-primary-400 underline decoration-primary-400/30 underline-offset-8">Recalibrating</span></h2>
                            <p className="text-lg text-primary-100/60 font-medium italic max-w-lg mb-12">We are currently sharding global inventory datasets to improve real-time neural throughput. Your detailed analytics dashboard will be back online shortly.</p>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 flex-1">
                                    <Activity className="text-primary-400" />
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Load Factor</p>
                                        <p className="text-xl font-black">94.2%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 flex-1">
                                    <Target className="text-emerald-400" />
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">ETA Status</p>
                                        <p className="text-xl font-black">~12m</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center justify-center">
                            <div className="relative">
                                <div className="w-80 h-80 rounded-[80px] border-4 border-primary-500/20 animate-spin-slow p-8">
                                    <div className="w-full h-full rounded-[60px] border-4 border-primary-400/40 border-dashed animate-spin-reverse flex items-center justify-center">
                                        <div className="w-40 h-40 bg-white/10 rounded-[40px] backdrop-blur-3xl flex items-center justify-center p-4">
                                            <div className="w-full h-full bg-primary-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-primary-500/50">
                                                <BarChart3 size={64} className="text-white animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-spin-reverse {
                    animation: spin-reverse 10s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Reports;
