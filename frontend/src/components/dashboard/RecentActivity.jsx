import React from 'react';
import { format } from 'date-fns';
import { ShoppingCart, Clock, User, IndianRupee } from 'lucide-react';

const RecentActivity = ({ transactions }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
            <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">Recent Activity</h2>
                    <p className="text-xs md:text-sm font-bold text-slate-400 italic mt-1">Live transaction stream</p>
                </div>
                <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-slate-100">
                    Last 5 Transactions
                </span>
            </div>

            <div className="p-0 sm:p-2">
                {/* Headers - Hidden on mobile, grid on desktop */}
                <div className="hidden lg:grid grid-cols-4 gap-6 px-8 py-4 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><ShoppingCart size={12} /> Invoice</div>
                    <div className="flex items-center gap-2"><User size={12} /> Customer</div>
                    <div className="flex items-center gap-2"><IndianRupee size={12} /> Amount</div>
                    <div className="flex items-center gap-2 justify-end text-right"><Clock size={12} /> Time</div>
                </div>

                <div className="divide-y divide-slate-50">
                    {transactions?.length > 0 ? (
                        transactions.map((tx, i) => (
                            <div 
                                key={tx._id || i} 
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 px-6 md:px-8 py-6 lg:py-4 hover:bg-blue-50/30 transition-all group/row cursor-default items-center"
                            >
                                {/* Medicines & Amount */}
                                <div className="flex flex-col lg:col-span-2">
                                    <span className="lg:hidden text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Items & Settlement</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover/row:scale-150 transition-transform"></div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <span className="font-black text-slate-900 tracking-tighter text-base uppercase">
                                                {tx.medicines?.join(", ") || 'General Items'}
                                            </span>
                                            <span className="hidden sm:inline text-slate-300">—</span>
                                            <span className="font-black text-blue-600 text-base tracking-tighter">
                                                ₹{tx.amount?.toLocaleString() || '0'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                                        ID: #{tx.invoice?.slice(-6) || 'N/A'}
                                    </span>
                                </div>

                                {/* Customer */}
                                <div className="flex flex-col">
                                    <span className="lg:hidden text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Customer</span>
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-slate-400" />
                                        <span className="font-bold text-slate-500 text-sm truncate uppercase tracking-tight">
                                            {tx.customer || 'Walking Customer'}
                                        </span>
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="flex flex-col lg:items-end text-left lg:text-right">
                                    <span className="lg:hidden text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Timestamp</span>
                                    <span className="text-xs font-bold text-slate-400 italic">
                                        {tx.time ? format(new Date(tx.time), 'MMM dd, hh:mm a') : 'Processed Today'}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-6 flex flex-col items-center justify-center grayscale opacity-30">
                            <ShoppingCart size={40} strokeWidth={1} className="mb-4 text-slate-300" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Terminal Idle: No Transactions</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-slate-50/30 text-center border-t border-slate-50">
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:tracking-[0.2em] transition-all">
                    View Complete Audit Log →
                </button>
            </div>
        </div>
    );
};

export default RecentActivity;
