import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from '../constants/icons';
import api from '../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgotpassword', { email });
            setIsSent(true);
            toast.success('Reset link dispatched to your inbox');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to initiate reset sequence');
        } finally {
            setLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center animate-scale-in">
                    <div className="w-20 h-20 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mx-auto mb-8 border border-emerald-100">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-4">Transmission <span className="text-emerald-500">Successful</span></h1>
                    <p className="text-xs font-bold text-slate-400 leading-relaxed mb-10 italic">
                        An authorized reset node has been transmitted to <span className="text-slate-900 not-italic font-black underline decoration-emerald-200 decoration-2 underline-offset-4">{email}</span>.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/login'}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95"
                    >
                        Return to Login Terminal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 animate-scale-in">
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mx-auto mb-6">
                        <Mail size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">Forgot <span className="text-primary-600">Password?</span></h1>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Personnel Identity Recovery Node</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block italic">Email Authority</label>
                        <div className="relative group">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-5 py-4 pl-12 font-black text-slate-900 outline-none focus:border-primary-500 focus:bg-white transition-all placeholder:text-slate-300"
                                placeholder="name@pharmacy.com"
                            />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                Dispatch Link
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <button 
                        onClick={() => window.location.href = '/login'}
                        className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors"
                    >
                        ← Back to Terminal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
