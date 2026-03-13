import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Truck, CheckCircle2, XCircle, MoreVertical, ShoppingBag } from '../../constants/icons';
import clsx from 'clsx';

const SupplierAudit = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAudit = async () => {
            try {
                const res = await api.get('/reports/supplier-audit');
                setData(res.data.data);
            } catch (err) {
                console.error("Supplier audit data error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAudit();
    }, []);

    if (loading) return <div className="h-[400px] md:h-[500px] bg-slate-50 animate-pulse rounded-2xl lg:col-span-2" />;

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col gap-6 md:gap-8">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                    <Truck size={22} />
                </div>
                <div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter text-slate-800">Supplier Audit</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Procurement reliability</p>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
                {data?.length > 0 ? data.map((sup, i) => (
                    <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-white space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center font-black text-indigo-600 shadow-sm uppercase">{sup.supplier?.[0]}</div>
                            <span className="font-black text-slate-900 uppercase text-xs">{sup.supplier}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-xl border border-slate-100">
                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
                                <p className="font-black text-slate-900 text-xs">{sup.orders}</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100">
                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Integrity</p>
                                <p className="font-black text-indigo-600 text-xs">{sup.performance.toFixed(1)}%</p>
                            </div>
                        </div>
                        <div className="flex gap-4 px-1">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-emerald-500 opacity-60" />
                                <span className="text-[9px] font-black text-emerald-600 uppercase italic">Delivered {sup.delivered}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <XCircle size={12} className="text-rose-500 opacity-60" />
                                <span className="text-[9px] font-black text-rose-600 uppercase italic">Cancelled {sup.cancelled}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-12 text-center opacity-20 flex flex-col items-center">
                        <ShoppingBag size={48} className="mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Zero Procurement Trails</p>
                    </div>
                )}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto min-h-[200px] relative">
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4 rounded-l-xl">Node Provider</th>
                            <th className="px-6 py-4">Inbound Traces</th>
                            <th className="px-6 py-4">Verification Delta</th>
                            <th className="px-6 py-4">Integrity Score</th>
                            <th className="px-6 py-4 text-right rounded-r-xl"><MoreVertical size={16} /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data?.map((sup, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-all cursor-pointer group/row">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-white rounded-xl border border-slate-100 flex items-center justify-center font-black text-indigo-600 shadow-sm uppercase">{sup.supplier?.[0]}</div>
                                        <span className="font-black text-slate-900 uppercase group-hover/row:text-indigo-600 text-sm">{sup.supplier}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase italic">{sup.orders} Total Orders</p>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={12} className="text-emerald-500 opacity-60" />
                                            <span className="text-[9px] font-black text-emerald-600 italic">{sup.delivered}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <XCircle size={12} className="text-rose-500 opacity-60" />
                                            <span className="text-[9px] font-black text-rose-600 italic">{sup.cancelled}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-indigo-500 rounded-full" 
                                                style={{ width: `${sup.performance}%` }}
                                            />
                                        </div>
                                        <span className="text-[8px] font-black text-indigo-600 tracking-widest">{sup.performance.toFixed(1)}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data?.length === 0 && (
                    <div className="py-20 text-center opacity-10 flex flex-col items-center">
                        <Truck size={100} strokeWidth={1} className="mb-6" />
                        <p className="text-lg font-black uppercase tracking-[0.4em]">Zero Procurement Trails</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupplierAudit;
