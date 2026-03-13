import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Truck } from 'lucide-react';

const ActionButton = ({ onClick, icon: Icon, label, colorClass }) => (
  <button 
    onClick={onClick}
    className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center justify-center gap-2 border border-transparent hover:border-slate-200 transition-all active:scale-95 group"
  >
    <div className={`p-3 rounded-xl ${colorClass} text-white group-hover:scale-110 transition-transform`}>
      <Icon size={20} />
    </div>
    <span className="text-[10px] font-black uppercase tracking-tight text-slate-800 text-center break-words">{label}</span>
  </button>
);

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-4">
      <ActionButton 
        onClick={() => navigate('/billing')} 
        icon={ShoppingCart} 
        label="Billing" 
        colorClass="bg-blue-600"
      />
      <ActionButton 
        onClick={() => navigate('/inventory')} 
        icon={Plus} 
        label="Medicine" 
        colorClass="bg-emerald-600"
      />
      <ActionButton 
        onClick={() => navigate('/purchase-orders')} 
        icon={Truck} 
        label="Orders" 
        colorClass="bg-violet-600"
      />
    </div>
  );
};

export default QuickActions;
