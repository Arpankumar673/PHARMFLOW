import React, { useState, useEffect } from 'react';
import { MapPin, Lock, Rocket, Building2, Globe, ArrowRight, ShieldCheck, Zap, Layers, Activity, Loader2 } from '../constants/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import clsx from 'clsx';

const MultiStore = () => {
    const { user, hasPlan } = useAuth();
    const navigate = useNavigate();
    
    const isEnterprise = hasPlan('ENTERPRISE');
    const plan = user?.plan?.toUpperCase() || 'BASIC';

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isEnterprise) {
            fetchStores();
        } else {
            setLoading(false);
        }
    }, [isEnterprise]);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const res = await api.get('/stores');
            setStores(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch stores", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-primary-50 border-t-primary-600 animate-spin"></div>
                    <Building2 size={24} className="absolute inset-0 m-auto text-primary-600 animate-pulse" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 italic">Synchronizing Store Nodes...</p>
            </div>
        );
    }

    if (!isEnterprise) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4 md:p-6 animate-fade-in">
                <div className="max-w-2xl w-full bg-white rounded-2xl p-8 md:p-12 lg:p-16 text-center shadow-2xl border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32 transition-all group-hover:bg-primary-100"></div>
                    
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-50 text-primary-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-inner ring-1 ring-primary-100 group-hover:rotate-12 transition-transform duration-500">
                        <Lock size={40} className="md:w-12 md:h-12" />
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest italic border border-slate-100">
                            {plan} NODE
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none text-center">Multi-Store Expansion</h2>
                    <p className="text-slate-500 font-medium italic mb-10 md:mb-12 leading-relaxed max-w-md mx-auto text-xs md:text-sm lg:text-base">
                        Global management and cross-branch inventory synchronization are reserved for Enterprise Hub partners.
                    </p>

                    <button
                        onClick={() => navigate('/subscription')}
                        className="w-full max-w-xs mx-auto bg-primary-600 text-white py-4 md:py-5 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-2xl shadow-primary-500/30 hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-4"
                    >
                        <Zap size={18} fill="white" />
                        Unlock Enterprise Node
                    </button>
                    <p className="mt-6 text-[9px] md:text-[10px] text-slate-300 font-black uppercase tracking-widest">Expansion protocol encrypted</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-10 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic font-bold border border-primary-100/50">
                            ENTERPRISE NODE
                        </span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Multi-Store <span className="text-primary-600">Hub</span></h1>
                    <p className="text-xs md:text-sm text-slate-500 font-medium italic mt-2 opacity-70">Orchestrating pharmacy nodes through centralized management.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {stores.length === 0 ? (
                    <div className="col-span-full bg-white border-2 border-dashed border-slate-100 rounded-2xl p-12 md:p-20 flex flex-col items-center text-center shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center mb-6">
                            <Building2 size={40} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">No pharmacy branches created</h3>
                        <p className="text-xs md:text-sm text-slate-400 font-medium italic mb-8 max-w-xs">Initialize your first expansion branch to begin cross-node inventory management.</p>
                        
                        <button 
                            className="bg-primary-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-2xl shadow-primary-500/30 hover:bg-primary-700 active:scale-95 transition-all flex items-center gap-3"
                        >
                            <MapPin size={16} />
                            Create Initial Branch Node
                        </button>
                    </div>
                ) : (
                    <>
                        {stores.map((store) => (
                            <div 
                                key={store._id} 
                                className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:border-primary-200 hover:shadow-xl transition-all relative overflow-hidden group"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shadow-inner">
                                        <Building2 size={24} />
                                    </div>
                                    <span className={clsx(
                                        "text-[8px] md:text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border",
                                        store.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                    )}>
                                        {store.status || 'Active'}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter mb-1.5">{store.name}</h3>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic mb-6 flex items-center gap-2">
                                    <MapPin size={12} strokeWidth={3} className="text-primary-400" />
                                    {store.location || 'Node Pending'}
                                </p>

                                <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1 opacity-60">Inventory</p>
                                        <p className="text-lg font-black text-slate-900 tracking-tighter">{(store.inventory || 0).toLocaleString()} <span className="text-[9px] text-slate-300">Un.</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1 opacity-60">Revenue</p>
                                        <p className="text-lg font-black text-primary-600 tracking-tighter">₹{(store.sales || 0).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-50 border-dashed">
                                    <button className="w-full bg-slate-50 text-slate-600 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                                        Manage Protocol
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button className="bg-primary-50/20 border-2 border-dashed border-primary-100 rounded-2xl p-8 flex flex-col items-center justify-center group hover:bg-white hover:border-primary-600 transition-all shadow-sm hover:shadow-xl min-h-[300px]">
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-primary-50 flex items-center justify-center text-primary-400 mb-6 group-hover:text-primary-600 group-hover:scale-110 transition-all">
                                <MapPin size={28} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-600">Connect Branch Node</span>
                            <p className="text-[8px] text-primary-400 font-bold italic mt-1.5 opacity-60">Initialize expansion</p>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MultiStore;
