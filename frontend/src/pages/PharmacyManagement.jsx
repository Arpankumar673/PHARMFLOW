import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Loader2 } from '../constants/icons';
import api from '../services/api';
import { format } from 'date-fns';

const PharmacyManagement = () => {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPharmacies = async () => {
            try {
                const res = await api.get('/platform/pharmacies');
                setPharmacies(res.data.data);
            } catch (err) {
                console.error('Error fetching pharmacies', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPharmacies();
    }, []);

    const filteredPharmacies = pharmacies.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 md:space-y-10 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
                <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Global <span className="text-primary-600">Grid</span></h1>
                    <p className="text-xs md:text-sm text-slate-500 font-medium italic mt-2 opacity-70">SuperAdmin Console: Manage global pharmacy nodes and tenant status.</p>
                </div>
                <button className="w-full md:w-auto bg-primary-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Plus size={18} />
                    Establish New Node
                </button>
            </header>

            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                        <Search size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="SEARCH NODES..."
                        className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-12 py-3.5 font-black text-slate-900 outline-none focus:border-primary-500 focus:bg-white transition-all text-xs tracking-widest uppercase"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select className="flex-1 md:w-48 bg-slate-50 border-2 border-transparent rounded-xl px-4 py-3.5 font-black text-slate-900 outline-none focus:border-primary-500 focus:bg-white transition-all text-[10px] tracking-widest uppercase">
                        <option>Status: All</option>
                        <option>Active</option>
                        <option>Suspended</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 italic">Accessing database...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPharmacies.length > 0 ? filteredPharmacies.map((pharmacy) => (
                        <div key={pharmacy._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-colors">
                                    <Building2 size={24} />
                                </div>
                                <span className={`text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${pharmacy.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                    }`}>
                                    {pharmacy.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-1 leading-none truncate">{pharmacy.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate mb-6">{pharmacy.email}</p>
                            
                            <div className="mt-auto pt-6 border-t border-slate-50 space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                    <span>Deployment Date</span>
                                    <span className="text-slate-900 not-italic">{format(new Date(pharmacy.createdAt), 'MMM dd, yyyy')}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="bg-slate-50 hover:bg-slate-100 text-slate-900 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Manage</button>
                                    <button className="bg-rose-50 hover:bg-rose-100 text-rose-600 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Suspend</button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
                            <Building2 size={64} className="mx-auto mb-4 text-slate-200" />
                            <p className="text-lg font-black uppercase tracking-widest text-slate-400 italic">No Node Activity Detected</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PharmacyManagement;
