import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const InventoryAlerts = ({ lowStock, expiring }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Inventory Watch</h3>
        <button 
          onClick={() => navigate('/inventory')}
          className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
        >
          View Full Stock
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Low Stock Warnings</p>
          <div className="space-y-3">
            {lowStock?.length > 0 ? lowStock.slice(0, 3).map((med, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-amber-600" size={18} />
                  <span className="text-sm font-bold text-slate-700">{med.name}</span>
                </div>
                <span className="text-sm font-black text-amber-600">{med.quantity} Left</span>
              </div>
            )) : (
              <p className="text-xs font-medium text-slate-400 italic">No low stock items detected.</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Expiry Risk Panel</p>
          <div className="space-y-3">
            {expiring?.length > 0 ? expiring.slice(0, 3).map((med, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <div className="flex items-center gap-3">
                  <Clock className="text-rose-600" size={18} />
                  <span className="text-sm font-bold text-slate-700">{med.name}</span>
                </div>
                <span className="text-xs font-black text-rose-600 uppercase">
                  {med.expiryDate ? format(new Date(med.expiryDate), 'MMM dd') : 'N/A'}
                </span>
              </div>
            )) : (
              <p className="text-xs font-medium text-slate-400 italic">No items expiring soon.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAlerts;
