import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Truck,
    Plus,
    History,
    PackageCheck,
    AlertCircle,
    ShoppingBag
} from '../constants/icons';
import { toast } from 'react-toastify';

const PurchaseOrders = () => {
    const [orders, setOrders] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, suggRes] = await Promise.all([
                    api.get('/supply-chain/distributors').catch(err => { if (err.response?.status === 403) setIsLocked(true); throw err; }),
                    api.get('/supply-chain/reorder-suggestions').catch(() => ({ data: { data: [] } }))
                ]);
                setOrders(ordersRes.data.data);
                setSuggestions(suggRes.data.data);
            } catch (err) {
                console.error("Distributor system access error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center p-8 md:p-20 text-center bg-gray-50 border border-dashed border-gray-200 rounded-[48px] max-w-4xl mx-auto">
                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mb-10 shadow-xl shadow-gray-200/50">
                    <Truck size={48} className="text-primary-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4 leading-tight">Supply Link Locked</h2>
                <p className="text-gray-500 max-w-md italic mb-12 text-lg">Automated orbital distributor procurement is exclusive to Enterprise Level architecture. Upgrade your clearance to manage supply chains.</p>
                <button
                    onClick={() => window.location.href = '/subscription'}
                    className="w-full sm:w-auto bg-primary-600 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary-200 transition-all hover:bg-primary-700 active:scale-95"
                >
                    Upgrade Authentication
                </button>
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin"></div>
                <Truck size={24} className="absolute inset-0 m-auto text-primary-600 animate-pulse" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 italic">Syncing Procurement Data...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in pb-24 max-w-[1400px] mx-auto px-4 md:px-0">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Global Supply Chain</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-pharmacy-900 tracking-tighter uppercase leading-none">Purchase Matrix</h1>
                    <p className="text-pharmacy-500 font-medium italic mt-3 opacity-60">Architectural procurement and automated stock replenishment system.</p>
                </div>
                <button className="group bg-primary-600 text-white px-10 py-5 rounded-[28px] font-black uppercase tracking-widest text-[11px] hover:bg-primary-700 shadow-2xl shadow-primary-200 flex items-center justify-center gap-4 transition-all active:scale-95">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Initialize Procurement
                </button>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Orders History Column */}
                <div className="xl:col-span-8 space-y-10">
                    <div className="bg-white border border-pharmacy-50 shadow-sm rounded-[56px] overflow-hidden group">
                        <div className="p-10 border-b border-pharmacy-50 flex items-center justify-between bg-white relative z-10">
                            <h3 className="font-black text-pharmacy-900 flex items-center gap-4 uppercase tracking-tighter text-xl">
                                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                                    <History size={20} />
                                </div>
                                Dispatch History
                            </h3>
                        </div>

                        <div className="overflow-x-auto min-h-[400px] relative">
                            {orders.length === 0 ? (
                                <div className="py-24 text-center opacity-10 group-hover:opacity-20 transition-opacity grayscale flex flex-col items-center">
                                    <ShoppingBag size={120} strokeWidth={1} className="mb-10" />
                                    <p className="text-xl font-black uppercase tracking-[0.4em]">Zero Procurement Trails</p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop Table */}
                                    <table className="hidden md:table w-full text-left">
                                        <thead className="bg-pharmacy-50/50 text-pharmacy-400 text-[10px] font-black uppercase tracking-widest">
                                            <tr>
                                                <th className="px-10 py-6">Distributor Node</th>
                                                <th className="px-10 py-6">Inventory Items</th>
                                                <th className="px-10 py-6">Link Status</th>
                                                <th className="px-10 py-6 text-right">Verification Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-pharmacy-50">
                                            {/* Example Row - In production would map over orders */}
                                            <tr className="hover:bg-pharmacy-50/30 transition-all cursor-pointer group/row">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-2xl border border-pharmacy-50 flex items-center justify-center font-black text-primary-600 shadow-sm">M</div>
                                                        <span className="font-black text-pharmacy-900 uppercase group-hover/row:text-primary-600">MediCare Supplies</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <p className="text-[11px] font-bold text-pharmacy-500 max-w-[200px] truncate uppercase italic">Para-500 (50), Amox-200 (20)</p>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-4 py-2 rounded-full border border-emerald-100 uppercase tracking-widest">Verified</span>
                                                </td>
                                                <td className="px-10 py-8 text-right text-[10px] font-black text-pharmacy-400 uppercase tracking-tighter">05 MAR 2026</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* Mobile Cards */}
                                    <div className="md:hidden divide-y divide-pharmacy-50">
                                        {[1].map((_, i) => (
                                            <div key={i} className="p-8 space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center font-black text-primary-600">M</div>
                                                        <div>
                                                            <h4 className="font-black text-pharmacy-900 uppercase tracking-tight">MediCare</h4>
                                                            <p className="text-[9px] font-black text-pharmacy-400 uppercase tracking-widest">05 MAR 2026</p>
                                                        </div>
                                                    </div>
                                                    <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Verified</span>
                                                </div>
                                                <p className="text-[10px] bg-pharmacy-50 p-4 rounded-2xl font-bold text-pharmacy-500 uppercase italic">Para-500 (50), Amox-200 (20)</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="xl:col-span-4 space-y-10">
                    <section className="bg-pharmacy-900 p-10 md:p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-grid-white bg-[size:30px_30px] opacity-[0.03]"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-10 flex items-center gap-3 relative z-10">
                            <AlertCircle size={18} className="animate-pulse" />
                            Reorder Synapse
                        </h3>

                        <div className="space-y-6 relative z-10">
                            {suggestions.length > 0 ? suggestions.map((sug, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-md p-8 rounded-[32px] border border-white/5 hover:border-primary-500/50 transition-all group/item hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="font-black text-xl text-white uppercase tracking-tight group-hover/item:text-primary-400 transition-colors">{sug.medicine}</p>
                                        <span className="bg-rose-500/10 text-rose-500 text-[9px] font-black px-3 py-1 rounded-full border border-rose-500/20 uppercase tracking-widest italic">{sug.currentStock} Units</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-white/40 font-black mb-8 uppercase tracking-widest">
                                        <Truck size={14} className="text-primary-400" />
                                        {sug.suggestedDistributor}
                                    </div>
                                    <button className="w-full py-5 bg-white/5 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all border border-white/10 active:scale-95">
                                        Initialize Replenishment
                                    </button>
                                </div>
                            )) : (
                                <div className="py-20 text-center opacity-30 flex flex-col items-center gap-6 grayscale">
                                    <PackageCheck size={64} strokeWidth={1} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Stock Logic Optimal</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};


export default PurchaseOrders;
