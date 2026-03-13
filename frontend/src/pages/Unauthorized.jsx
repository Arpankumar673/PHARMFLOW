import React from 'react';
import { ShieldAlert, ArrowLeft } from '../constants/icons';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl p-10 text-center shadow-2xl border border-slate-100 animate-scale-in">
                <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-8 border border-rose-100">
                    <ShieldAlert size={40} />
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Access <span className="text-rose-600">Denied</span></h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-10">Security Protocol Violation</p>
                
                <p className="text-xs text-slate-500 font-medium italic mb-10 leading-relaxed">
                    Your credentials do not have permission to access this secure zone. Please contact your system administrator.
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Return Back
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
