import { useState, useEffect } from 'react';
import api from '../../services/api';
import { History, ShoppingBag, CheckCircle2, XCircle, Clock } from '../../constants/icons';
import { toast } from 'react-toastify';
import clsx from 'clsx';

const OrdersTable = ({ orders: initialOrders, onUpdated }) => {
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        setOrders(initialOrders || []);
    }, [initialOrders]);

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/purchase-orders/${id}`, { status });
            toast.success(`Matrix Update: Order set to ${status}`);
            if (onUpdated) onUpdated();
        } catch (err) {
            toast.error('Protocol Failure: Could not update status');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock size={12} />;
            case 'Ordered': return <Clock size={12} className="animate-spin-slow" />;
            case 'Delivered': return <CheckCircle2 size={12} />;
            case 'Cancelled': return <XCircle size={12} />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'Ordered': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden group">
            <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-white relative z-10">
                <h3 className="font-black text-slate-900 flex items-center gap-3 md:gap-4 uppercase tracking-tighter text-lg md:text-xl">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                        <History size={20} />
                    </div>
                    Dispatch History
                </h3>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden p-4 space-y-4">
                {orders.length === 0 ? (
                    <div className="py-12 text-center opacity-20 flex flex-col items-center">
                        <ShoppingBag size={48} className="mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Procurement Trails</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-black text-primary-600 text-[10px] shadow-sm uppercase">
                                        {order.supplier?.name?.[0] || 'S'}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 uppercase text-xs tracking-tight">{order.supplier?.name || 'Unknown'}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">#{order._id.slice(-6)}</p>
                                    </div>
                                </div>
                                <div className={clsx(
                                    "px-2.5 py-1 rounded-full border text-[7px] font-black uppercase tracking-widest flex items-center gap-1",
                                    getStatusColor(order.status)
                                )}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded-xl border border-slate-100">
                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Items</p>
                                    <p className="font-black text-slate-900 text-xs">{order.totalItems || order.medicines.length} Units</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-slate-100">
                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Value</p>
                                    <p className="font-black text-slate-900 text-xs">₹{order.totalAmount?.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {order.status === 'Pending' && (
                                    <button onClick={() => handleUpdateStatus(order._id, 'Ordered')} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1.5">
                                        <Clock size={10} /> Ordered
                                    </button>
                                )}
                                {(order.status === 'Ordered' || order.status === 'Pending') && (
                                    <button onClick={() => handleUpdateStatus(order._id, 'Delivered')} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1.5">
                                        <CheckCircle2 size={10} /> Delivered
                                    </button>
                                )}
                                {order.status !== 'Cancelled' && (
                                    <button onClick={() => handleUpdateStatus(order._id, 'Cancelled')} className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
                                        <XCircle size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block min-h-[200px] relative">
                {orders.length === 0 ? (
                    <div className="py-20 text-center opacity-10 group-hover:opacity-20 transition-opacity grayscale flex flex-col items-center">
                        <ShoppingBag size={100} strokeWidth={1} className="mb-6" />
                        <p className="text-lg font-black uppercase tracking-[0.4em]">Zero Procurement Trails</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Identity</th>
                                    <th className="px-8 py-5">Supply Node</th>
                                    <th className="px-8 py-5">Items Aggregate</th>
                                    <th className="px-8 py-5">Total Value</th>
                                    <th className="px-8 py-5">Link Status</th>
                                    <th className="px-8 py-5 text-right">Protocol Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-50/30 transition-all cursor-pointer group/row">
                                        <td className="px-8 py-6">
                                            <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest">#{order._id.slice(-6)}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-xl border border-slate-50 flex items-center justify-center font-black text-primary-600 shadow-sm uppercase">{order.supplier?.name?.[0] || 'S'}</div>
                                                <span className="font-black text-slate-900 uppercase group-hover/row:text-primary-600 text-sm">{order.supplier?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase italic">{order.totalItems || order.medicines.length} Units</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-black text-xs text-slate-700">₹{order.totalAmount?.toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={clsx(
                                                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest",
                                                getStatusColor(order.status)
                                            )}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                {order.status === 'Pending' && (
                                                    <button onClick={() => handleUpdateStatus(order._id, 'Ordered')} className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-blue-500/5">
                                                        <Clock size={16} />
                                                    </button>
                                                )}
                                                {(order.status === 'Ordered' || order.status === 'Pending') && (
                                                    <button onClick={() => handleUpdateStatus(order._id, 'Delivered')} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-xl shadow-emerald-500/5">
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                )}
                                                {order.status !== 'Cancelled' && (
                                                    <button onClick={() => handleUpdateStatus(order._id, 'Cancelled')} className="p-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-xl shadow-rose-500/5">
                                                        <XCircle size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersTable;
