import React from 'react';
import { Mail, ShieldCheck, ArrowRight, Github, Award } from 'lucide-react';

const FounderCard = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col items-center text-center group hover:border-blue-100 transition-all duration-500">
            {/* Avatar Section */}
            <div className="relative mb-4 md:mb-6">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-[28px] md:rounded-[32px] flex items-center justify-center text-blue-600 font-black text-3xl md:text-4xl shadow-inner group-hover:rotate-12 transition-transform duration-500 border border-blue-100">
                    A
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 md:w-8 md:h-8 bg-emerald-500 rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                    <ShieldCheck className="md:w-3.5 md:h-3.5" size={12} strokeWidth={3} />
                </div>
            </div>

            {/* Title Section */}
            <div>
                <div className="flex items-center justify-center gap-2 mb-1.5 md:mb-2">
                    <Award size={12} className="text-amber-500 md:w-3.5 md:h-3.5" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Founder / Architect</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase mb-1">Arpan Kumar</h3>
                <p className="text-xs md:text-sm font-bold text-slate-400 italic mb-4 md:mb-6">PharmFlow Core Engine Lead</p>
            </div>

            {/* Email Contact */}
            <div className="w-full bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Direct Connection</p>
                <a 
                    href="mailto:arpan112233@gmail.com" 
                    className="text-sm font-black text-slate-600 hover:text-blue-600 transition-colors"
                >
                    arpan112233@gmail.com
                </a>
            </div>

            {/* CTA Button */}
            <a
                href="mailto:arpan112233@gmail.com"
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all active:scale-95 group/btn"
            >
                <Mail size={18} className="group-hover/btn:-rotate-12 transition-transform" />
                Contact Founder
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </a>
        </div>
    );
};

export default FounderCard;
