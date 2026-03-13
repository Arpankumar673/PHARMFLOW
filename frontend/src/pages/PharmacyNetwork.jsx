import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Search,
    Globe,
    Network,
    RefreshCw,
    Package,
    Building2,
    MapPin,
    Phone,
    Plus,
    Lock,
    Zap,
    Crown
} from '../constants/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const PharmacyNetwork = () => {
    const { user, hasPlan } = useAuth();
    const navigate = useNavigate();
    
    const isPro = hasPlan('PRO');
    const isEnterprise = hasPlan('ENTERPRISE');
    const plan = user?.plan?.toUpperCase() || 'BASIC';

    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isPro) {
            loadNodes();
        } else {
            setLoading(false);
        }
    }, [isPro]);

    const loadNodes = async () => {
        try {
            setLoading(true);
            const res = await api.get('/network/pharmacies');
            setNodes(res.data.data || []);
        } catch (err) {
            console.error("Failed to load network nodes", err);
        } finally {
            setLoading(false);
        }
    };

    const syncNetwork = async () => {
        if (!isEnterprise) return;
        try {
            setSyncing(true);
            await api.post("/network/sync");
            await loadNodes();
        } catch (err) {
            console.error("Network sync protocol failure", err);
        } finally {
            setSyncing(false);
        }
    };

    // 1. Subscription Protection
    if (!isPro) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4 md:p-6 animate-fade-in">
                <div className="max-w-2xl w-full bg-white rounded-2xl p-8 md:p-12 lg:p-16 text-center shadow-2xl border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32 transition-all group-hover:bg-primary-100"></div>
                    
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-50 text-primary-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-inner ring-1 ring-primary-100 group-hover:rotate-12 transition-transform duration-500">
                        <Crown size={40} className="md:w-12 md:h-12" />
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest italic border border-slate-100">
                            {plan} NODE
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">Pharmacy Grid Locked</h2>
                    <p className="text-slate-500 font-medium italic mb-10 md:mb-12 leading-relaxed max-w-md mx-auto text-xs md:text-sm lg:text-base">
                        Global medicine identification and partner node synchronization are premium architectural features.
                    </p>

                    <button
                        onClick={() => navigate('/subscription')}
                        className="w-full max-w-xs mx-auto bg-primary-600 text-white py-4 md:py-5 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-2xl shadow-primary-500/30 hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-4"
                    >
                        <Zap size={18} fill="white" />
                        Unlock Quantum Network
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-primary-50 border-t-primary-600 animate-spin"></div>
                    <Globe size={24} className="absolute inset-0 m-auto text-primary-600 animate-pulse" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 italic">Initializing Global Stock Grid...</p>
            </div>
        );
    }

    const filteredNodes = nodes.filter(node => 
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 md:space-y-10 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic font-bold border border-primary-100/50">
                            {plan} NODE
                        </span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Global <span className="text-primary-600">Grid</span></h1>
                    <p className="text-xs md:text-sm text-slate-500 font-medium italic mt-2 opacity-70">Architectural medicine detection across partner nodes.</p>
                </div>

                <button 
                    onClick={syncNetwork}
                    disabled={syncing || !isEnterprise}
                    className={clsx(
                        "w-full md:w-auto px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95",
                        isEnterprise ? "bg-slate-900 text-white shadow-slate-900/10 hover:bg-black" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    )}
                >
                    <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />
                    {syncing ? "Syncing..." : "Sync Grid"}
                </button>
            </header>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-6 md:left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={24} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Scan global stock mesh..."
                    className="w-full bg-white border-2 border-slate-50 rounded-2xl py-5 md:py-6 pl-16 md:pl-20 pr-10 text-lg md:text-xl font-black tracking-tighter shadow-sm placeholder:text-slate-300 focus:border-primary-500 focus:bg-white transition-all outline-none"
                />
            </div>

            {/* Grid / Content */}
            {nodes.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-100 rounded-2xl p-12 md:p-20 flex flex-col items-center text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center mb-6">
                        <Network size={40} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">No partner pharmacies connected</h3>
                    <p className="text-xs md:text-sm text-slate-400 font-medium italic mb-8 max-w-xs">Initialize decentralized pharmacy partnerships to enable global inventory pooling.</p>
                    
                    <button 
                        className="bg-primary-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-2xl shadow-primary-500/30 hover:bg-primary-700 active:scale-95 transition-all flex items-center gap-3"
                    >
                        <Plus size={16} />
                        Connect Pharmacy
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {filteredNodes.map((node) => (
                        <div key={node._id} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:border-primary-200 hover:shadow-xl transition-all relative overflow-hidden group flex flex-col">
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                                    <Building2 size={24} md:size={28} />
                                </div>
                                <div className="text-right">
                                    <span className="bg-emerald-50 text-emerald-600 text-[8px] md:text-[9px] font-black px-3 py-1.5 rounded-full uppercase border border-emerald-100 tracking-widest">
                                        Verified
                                    </span>
                                </div>
                            </div>

                            <h4 className="font-black text-lg md:text-xl text-slate-900 uppercase tracking-tighter mb-2 group-hover:text-primary-600 transition-colors leading-none truncate">
                                {node.name}
                            </h4>

                            <div className="flex items-center gap-2 mb-6">
                                <MapPin size={12} className="text-primary-400" />
                                <p className="text-[10px] text-slate-400 font-extrabold uppercase italic tracking-tight truncate">
                                    {node.location}
                                </p>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-white">
                                    <div className="flex items-center gap-2.5">
                                        <Package size={14} className="text-primary-500" />
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Medicines</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-900 tracking-tighter">{node.availableMedicines || 0}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                                <div className="flex-1">
                                    <p className="text-[8px] text-slate-300 font-black uppercase tracking-widest mb-1">Last Sync</p>
                                    <p className="text-[9px] font-black text-slate-500 uppercase italic">
                                        {node.lastSync ? new Date(node.lastSync).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                                    </p>
                                </div>
                                <button className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors shadow-lg">
                                    <Phone size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PharmacyNetwork;
