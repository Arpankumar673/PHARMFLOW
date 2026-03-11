import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    User,
    Building2,
    Lock,
    Save,
    ShieldCheck
} from '../constants/icons';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import clsx from 'clsx';

const Settings = () => {
    const { user, isOwner, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [profileData, setProfileData] = useState({
        name: '',
        email: ''
    });

    const [pharmacyData, setPharmacyData] = useState({
        name: '',
        address: '',
        phone: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || ''
            });
            if (user.pharmacy) {
                setPharmacyData({
                    name: user.pharmacy.name || '',
                    address: user.pharmacy.address || '',
                    phone: user.pharmacy.phone || ''
                });
            }
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put('/auth/profile', profileData);
            await refreshUser();
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePharmacyUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put('/auth/pharmacy', pharmacyData);
            await refreshUser();
            toast.success('Pharmacy details updated');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update pharmacy');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setSubmitting(true);
        try {
            await api.put('/auth/updatepassword', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update password');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-12 animate-fade-in pb-24 max-w-[1280px] mx-auto px-4 md:px-0">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-black text-pharmacy-900 tracking-tighter uppercase leading-none">System Control</h1>
                    <p className="text-pharmacy-500 font-medium italic mt-3 opacity-60">Architectural parameters and neural identity configuration.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-pharmacy-50 rounded-2xl border border-pharmacy-100">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase text-pharmacy-600 tracking-widest">Protocol Sync: Nominal</span>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Main Settings Column */}
                <div className="xl:col-span-8 space-y-10">
                    {/* Profile Section */}
                    <section className="bg-white rounded-[48px] p-8 md:p-12 border border-pharmacy-50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[100px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000 -mr-32 -mt-32"></div>

                        <div className="flex items-center gap-6 mb-12 relative z-10">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-[24px] flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                                <User size={32} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-pharmacy-900 uppercase tracking-tighter leading-none">Neural Identity</h2>
                                <p className="text-[10px] text-pharmacy-400 font-black uppercase tracking-[0.2em] mt-2 italic">Authentication Metadata</p>
                            </div>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 ml-4 block">Formal Alias</label>
                                    <input
                                        type="text"
                                        className="w-full bg-pharmacy-50 border-2 border-transparent rounded-[24px] px-6 py-5 font-bold text-pharmacy-900 focus:ring-0 focus:border-primary-500 focus:bg-white outline-none transition-all shadow-inner"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 ml-4 block">Electronic Mail-link</label>
                                    <input
                                        type="email"
                                        className="w-full bg-pharmacy-50 border-2 border-transparent rounded-[24px] px-6 py-5 font-bold text-pharmacy-900 focus:ring-0 focus:border-primary-500 focus:bg-white outline-none transition-all shadow-inner"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-pharmacy-900 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-pharmacy-200"
                            >
                                <Save size={18} />
                                {submitting ? 'Updating Core...' : 'Commit Identity Shift'}
                            </button>
                        </form>
                    </section>

                    {/* Pharmacy Section (Only for Owner) */}
                    {isOwner && (
                        <section className="bg-white rounded-[48px] p-8 md:p-12 border border-emerald-50 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[100px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000 -mr-32 -mt-32"></div>

                            <div className="flex items-center gap-6 mb-12 relative z-10">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-[24px] flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                                    <Building2 size={32} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-pharmacy-900 uppercase tracking-tighter leading-none">Pharmacy Architecture</h2>
                                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-2 italic">Global Operational Node</p>
                                </div>
                            </div>

                            <form onSubmit={handlePharmacyUpdate} className="space-y-8 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 ml-4 block">Station Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-pharmacy-50 border-2 border-transparent rounded-[24px] px-6 py-5 font-black text-pharmacy-900 focus:ring-0 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner uppercase"
                                        value={pharmacyData.name}
                                        onChange={(e) => setPharmacyData({ ...pharmacyData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 ml-4 block">Communication Frequency</label>
                                        <input
                                            type="text"
                                            className="w-full bg-pharmacy-50 border-2 border-transparent rounded-[24px] px-6 py-5 font-bold text-pharmacy-900 focus:ring-0 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                            value={pharmacyData.phone}
                                            onChange={(e) => setPharmacyData({ ...pharmacyData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 ml-4 block">Geospatial Sector</label>
                                        <input
                                            type="text"
                                            className="w-full bg-pharmacy-50 border-2 border-transparent rounded-[24px] px-6 py-5 font-bold text-pharmacy-900 focus:ring-0 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                            value={pharmacyData.address}
                                            onChange={(e) => setPharmacyData({ ...pharmacyData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-emerald-600 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-emerald-100"
                                >
                                    <Save size={18} />
                                    {submitting ? 'Syncing Base...' : 'Commit Architecture Pulse'}
                                </button>
                            </form>
                        </section>
                    )}
                </div>

                {/* Sidebar Settings Column */}
                <div className="xl:col-span-4 space-y-10">
                    {/* Cipher Section */}
                    <section className="bg-white rounded-[48px] p-10 border border-rose-50 shadow-sm relative group overflow-hidden">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-[20px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                <Lock size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-xl font-black text-pharmacy-900 uppercase tracking-tighter">Cipher Shift</h2>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-pharmacy-400 ml-3 block">Current Cipher</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-pharmacy-50 border-none rounded-[20px] px-5 py-4 font-bold text-pharmacy-900 focus:ring-2 ring-rose-200 outline-none transition-all shadow-inner"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-pharmacy-400 ml-3 block">New Cipher</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-pharmacy-50 border-none rounded-[20px] px-5 py-4 font-bold text-pharmacy-900 focus:ring-2 ring-primary-200 outline-none transition-all shadow-inner"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-pharmacy-400 ml-3 block">Verify Protocol</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-pharmacy-50 border-none rounded-[20px] px-5 py-4 font-bold text-pharmacy-900 focus:ring-2 ring-primary-200 outline-none transition-all shadow-inner"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-rose-500 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-50 mt-6 shadow-xl shadow-rose-100"
                            >
                                Re-key Access Grid
                            </button>
                        </form>
                    </section>

                    {/* Security Badge */}
                    <section className="bg-pharmacy-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[300px] group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-[20px] flex items-center justify-center border border-white/5">
                                    <ShieldCheck size={28} className="text-primary-400 animate-pulse" />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tighter">Auth Authority</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <p className="text-[10px] text-primary-400 font-extrabold uppercase tracking-widest mb-1 italic">Active Clearance</p>
                                    <p className="text-3xl font-black uppercase tracking-tighter">{user?.role}</p>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full w-fit">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Secure Link</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto relative z-10 pt-10 flex items-center justify-between border-t border-white/5">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">SaaS Build</span>
                                <span className="text-xs font-black text-white/60">v2.4.0-STABLE</span>
                            </div>
                            <div className="w-12 h-1 bg-white/10 rounded-full"></div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};


export default Settings;
