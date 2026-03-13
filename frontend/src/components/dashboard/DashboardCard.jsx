import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from '../../constants/icons';

const DashboardCard = ({ title, value, icon: Icon, trend, trendUp, colorClass }) => {
    return (
        <div className="bg-white p-8 rounded-[36px] border border-pharmacy-50 shadow-xl shadow-pharmacy-900/[0.02] transition-all duration-500 hover:shadow-2xl hover:shadow-pharmacy-900/5 hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pharmacy-50 to-transparent -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-start justify-between mb-8">
                <div className={clsx(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500",
                    colorClass
                )}>
                    <Icon size={28} strokeWidth={2.5} />
                </div>
                {trend && (
                    <div className={clsx(
                        "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border shadow-sm",
                        trendUp === true ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            trendUp === false ? "bg-rose-50 text-rose-600 border-rose-100" :
                                "bg-pharmacy-50 text-pharmacy-400 border-pharmacy-100"
                    )}>
                        {trendUp === true && <TrendingUp size={12} strokeWidth={3} />}
                        {trendUp === false && <TrendingDown size={12} strokeWidth={3} />}
                        {trend}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-[11px] font-black text-pharmacy-300 uppercase tracking-[0.2em] mb-2 italic">{title}</p>
                <h3 className="text-4xl font-black text-pharmacy-900 tracking-tighter leading-none">{value}</h3>
            </div>
        </div>
    );
};

export default DashboardCard;
