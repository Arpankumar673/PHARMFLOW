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
        <div className="space-y-8 animate-fade-in pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-pharmacy-900 tracking-tight uppercase">Pharmacy Management</h1>
                    <p className="text-pharmacy-500 font-medium italic">SuperAdmin Console: Manage global pharmacy nodes and tenant status.</p>
                </div>
                <button className="btn btn-primary flex items-center justify-center gap-2 py-4 px-8 shadow-xl shadow-primary-200 font-black uppercase tracking-widest text-[10px]">
                    <Plus size={18} />
                    Onboard New Branch
                </button>
            </header>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-pharmacy-50 flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:w-96">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-pharmacy-400">
                        <Search size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by license key or phone..."
                        className="w-full bg-pharmacy-50/50 border-none rounded-2xl pl-12 py-4 font-bold text-pharmacy-900 outline-none focus:ring-2 ring-primary-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-primary-600" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPharmacies.length > 0 ? filteredPharmacies.map((pharmacy) => (
                        <div key={pharmacy._id} className="bg-white p-8 rounded-[40px] border border-pharmacy-100 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center">
                                    <Building2 size={24} />
                                </div>
                                <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl uppercase ${pharmacy.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                    }`}>
                                    {pharmacy.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-pharmacy-900 uppercase tracking-tighter mb-1">{pharmacy.name}</h3>
                            <p className="text-xs text-pharmacy-400 font-bold italic mb-4">{pharmacy.email}</p>
                            <p className="text-[10px] text-pharmacy-400 font-black uppercase tracking-widest mb-8">Onboarded: {format(new Date(pharmacy.createdAt), 'MMM dd, yyyy')}</p>

                            <div className="pt-6 border-t border-pharmacy-50 flex justify-between">
                                <button className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:underline">Manage Tenant</button>
                                <button className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:underline">Suspend Access</button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center opacity-50 grayscale">
                            <Building2 size={64} className="mx-auto mb-4" />
                            <p className="text-lg font-black uppercase tracking-widest mb-8">No Pharmacies Detected</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PharmacyManagement;
