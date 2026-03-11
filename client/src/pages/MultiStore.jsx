import React from 'react';
import { MapPin, Lock, Rocket, Building2 } from '../constants/icons';
import { useAuth } from '../context/AuthContext';

const MultiStore = () => {
    const { hasPlan } = useAuth();
    const isLocked = !hasPlan('Enterprise');

    if (isLocked) {
        return (
            <div className="h-[80vh] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[40px] p-12 text-center shadow-2xl border border-pharmacy-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>

                    <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-primary-50">
                        <Lock size={48} />
                    </div>

                    <h2 className="text-2xl font-black text-pharmacy-900 mb-4 uppercase tracking-tighter">Enterprise Feature</h2>
                    <p className="text-pharmacy-500 font-medium italic mb-10 leading-relaxed">
                        Multi-store management and cross-branch inventory synchronization are reserved for our Enterprise partners.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => window.location.href = '/subscription'}
                            className="w-full bg-primary-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary-200 hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <Rocket size={18} />
                            Upgrade to Enterprise
                        </button>
                        <p className="text-[10px] text-pharmacy-300 font-bold uppercase tracking-widest">Starting at ₹799/month</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-black text-pharmacy-900 tracking-tight uppercase">Multi-Store Management</h1>
                <p className="text-pharmacy-500 font-medium italic">Synchronize stock and sales across all your pharmacy branches.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[40px] border-2 border-primary-600 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                            <Building2 size={24} />
                        </div>
                        <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Active Store</span>
                    </div>
                    <h3 className="text-xl font-black text-pharmacy-900 uppercase tracking-tighter mb-1">Main Branch</h3>
                    <p className="text-xs text-pharmacy-400 font-bold italic mb-6">Downtown Medical Complex, Sector 4</p>
                    <div className="pt-6 border-t border-pharmacy-50 flex justify-between">
                        <div>
                            <p className="text-[10px] text-pharmacy-300 font-black uppercase tracking-widest leading-none mb-1">Inventory</p>
                            <p className="text-lg font-black text-pharmacy-900 tracking-tighter">1,240 Items</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-pharmacy-300 font-black uppercase tracking-widest leading-none mb-1">Today's Sales</p>
                            <p className="text-lg font-black text-primary-600 tracking-tighter">₹42,500</p>
                        </div>
                    </div>
                </div>

                <button className="bg-pharmacy-50 border-2 border-dashed border-pharmacy-200 rounded-[40px] p-8 flex flex-col items-center justify-center group hover:bg-white hover:border-primary-600 transition-all">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-pharmacy-300 mb-4 group-hover:text-primary-600 group-hover:scale-110 transition-all shadow-sm">
                        <MapPin size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 group-hover:text-primary-600 transition-colors">Connect New Branch</span>
                </button>
            </div>
        </div>
    );
};

export default MultiStore;
