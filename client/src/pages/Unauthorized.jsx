import React from 'react';
import { ShieldAlert, ArrowLeft } from '../constants/icons';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-pharmacy-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[40px] p-12 text-center shadow-2xl border border-pharmacy-50">
                <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-rose-50">
                    <ShieldAlert size={48} />
                </div>

                <h2 className="text-2xl font-black text-pharmacy-900 mb-4 uppercase tracking-tighter text-rose-600">Access Denied</h2>
                <p className="text-pharmacy-500 font-medium italic mb-10 leading-relaxed">
                    Your role does not have permission to access this secure zone. Please contact your administrator if you believe this is an error.
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="w-full bg-pharmacy-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-pharmacy-900 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <ArrowLeft size={18} />
                    Return Back
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
