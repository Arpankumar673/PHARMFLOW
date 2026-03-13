import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BrainCircuit, TrendingUp, Network, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Feature = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-white">
    <Icon size={14} />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

const SubscriptionBanner = () => {
  const navigate = useNavigate();
  const { hasPlan } = useAuth();

  if (hasPlan('PRO')) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-10 rounded-[40px] shadow-xl shadow-blue-900/10">
      {/* Decorative dots background */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-amber-400/20">
            <Sparkles size={14} /> 
            Premium Access
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none mb-4 uppercase">
            Unlock Advanced <span className="text-blue-200">Intelligence</span>
          </h2>
          <p className="text-blue-100 font-medium italic mb-8 max-w-lg opacity-80">
            Take your pharmacy operations to the next dimension with predictive modeling and network intelligence.
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <Feature icon={BrainCircuit} label="AI Scanner" />
            <Feature icon={TrendingUp} label="Price Intelligence" />
            <Feature icon={Network} label="Pharmacy Network" />
            <Feature icon={Zap} label="Advanced Analytics" />
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/subscription')}
          className="bg-white text-blue-900 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-50 transition-all hover:scale-105 shadow-2xl shadow-blue-950/20 active:scale-95 shrink-0"
        >
          Upgrade Subscription
        </button>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
