import { useState } from 'react';
import api from '../services/api';
import {
    Search,
    MapPin,
    Phone,
    PackageSearch,
    Loader2,
    Building2,
    Lock
} from '../constants/icons';
import { useRole } from '../context/RoleContext';

const NetworkSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const { hasPermission } = useRole();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.get(`/network/search-medicine?medicineName=${query}`);
            setResults(res.data.data);
        } catch (err) {
            if (err.response?.status === 403) {
                setIsLocked(true);
            }
        } finally {
            setLoading(false);
        }
    };

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center p-8 md:p-20 text-center bg-gray-50 border border-dashed border-gray-200 rounded-[56px] max-w-4xl mx-auto">
                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mb-10 shadow-xl shadow-gray-200/50">
                    <Lock size={48} className="text-amber-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4 leading-tight">Orbital Network Offline</h2>
                <p className="text-gray-500 max-w-md italic mb-12 text-lg text-pretty">Global pharmacy collaboration and stock-sync requires Enterprise Grid authorization. Synced multi-node search is locked.</p>
                <button
                    onClick={() => window.location.href = '/subscription'}
                    className="w-full sm:w-auto bg-primary-600 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary-200 transition-all hover:bg-primary-700 active:scale-95"
                >
                    Authorize Neural Link
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in pb-24 max-w-[1400px] mx-auto px-4 md:px-0">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Collaborative Mesh</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-pharmacy-900 tracking-tighter uppercase leading-none">Global Stock Grid</h1>
                    <p className="text-pharmacy-500 font-medium italic mt-3 opacity-60">Architectural medicine detection system across verified partner nodes.</p>
                </div>
            </header>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-5">
                <div className="relative flex-1 group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-pharmacy-400 group-focus-within:text-primary-600 transition-colors" size={24} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Scan for unavailable medicine in global mesh..."
                        className="w-full bg-white border-2 border-pharmacy-50 rounded-[32px] py-6 pl-20 pr-10 text-lg font-black tracking-tight shadow-sm placeholder:text-pharmacy-300 focus:border-primary-500 focus:bg-white transition-all outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-pharmacy-900 text-white px-12 py-6 rounded-[32px] font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl shadow-pharmacy-200 active:scale-95"
                >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <PackageSearch size={24} />}
                    Sync Grid
                </button>
            </form>

            <div className="space-y-10 min-h-[500px]">
                {loading ? (
                    <div className="py-32 flex flex-col items-center">
                        <div className="relative mb-8">
                            <div className="w-20 h-20 rounded-full border-4 border-primary-50 border-t-primary-600 animate-spin"></div>
                            <Building2 size={24} className="absolute inset-0 m-auto text-primary-600 animate-pulse" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pharmacy-400 italic">Consulting Mesh Nodes...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {results.map((res, i) => (
                            <div key={i} className="bg-white p-10 rounded-[48px] border border-pharmacy-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-[28px] flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                                        <Building2 size={32} />
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-2 rounded-full uppercase border border-emerald-100 tracking-widest">
                                        {res.availableQuantity} Linked Units
                                    </span>
                                </div>
                                <h4 className="font-black text-2xl text-pharmacy-900 uppercase tracking-tighter mb-3 group-hover:text-primary-600 transition-colors uppercase leading-none">{res.pharmacyName}</h4>
                                <div className="flex items-start gap-3 mt-auto">
                                    <MapPin size={16} className="shrink-0 mt-1 text-primary-400" strokeWidth={3} />
                                    <p className="text-[11px] text-pharmacy-400 font-extrabold uppercase italic tracking-tight leading-relaxed line-clamp-2">
                                        {res.address}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 pt-10 border-t border-pharmacy-50 mt-10">
                                    <button className="flex-1 bg-pharmacy-50 text-pharmacy-900 py-6 rounded-[24px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-primary-600 hover:text-white transition-all active:scale-95">
                                        <Phone size={18} />
                                        Initialize Link
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : query && !loading ? (
                    <div className="py-32 text-center">
                        <div className="w-24 h-24 bg-pharmacy-50 rounded-full flex items-center justify-center mx-auto mb-10 opacity-30 grayscale">
                            <PackageSearch size={48} />
                        </div>
                        <p className="text-xl font-black text-pharmacy-400 uppercase tracking-[0.2em] italic">Mesh Search Exhausted: "{query}"</p>
                        <p className="text-sm text-pharmacy-300 font-bold mt-4 uppercase tracking-widest">No availability linked within partner network.</p>
                    </div>
                ) : (
                    <div className="py-32 text-center opacity-10 group-hover:opacity-20 transition-opacity flex flex-col items-center">
                        <div className="relative group/grid">
                            <Building2 size={120} strokeWidth={0.5} className="group-hover/grid:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-primary-400 blur-[80px] rounded-full opacity-10 group-hover/grid:opacity-30 transition-opacity"></div>
                        </div>
                        <p className="text-lg font-black uppercase tracking-[0.5em] mt-16 italic">System Mesh Ready for Identification</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export default NetworkSearch;
