import { useState, useEffect } from 'react';
import api from '../../services/api';
import { AlertTriangle, PackageCheck, Plus } from '../../constants/icons';
import { toast } from 'react-toastify';

const LowStockPanel = ({ onOrderCreated }) => {
    const [medicines, setMedicines] = useState([]);
    
    useEffect(() => {
        fetchLowStock();
    }, []);

    const fetchLowStock = async () => {
        try {
            const res = await api.get('/purchase-orders/low-stock');
            setMedicines(res.data.data);
        } catch (err) {
            console.error("Failed to fetch low stock", err);
        }
    };

    const handleCreateOrder = async (medicine) => {
        try {
            toast.info(`Initializing bypass for ${medicine.name}...`);
            if (onOrderCreated) onOrderCreated(medicine);
        } catch (err) {
            toast.error('System Failure');
        }
    };

    return (
        <section className="bg-rose-50 border border-rose-100 p-6 md:p-8 rounded-2xl text-rose-950 shadow-sm relative overflow-hidden group">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 mb-6 flex items-center gap-3 relative z-10">
                <AlertTriangle size={18} className="animate-pulse" />
                Critical Low Stock
            </h3>

            <div className="space-y-4 relative z-10">
                {medicines.length > 0 ? medicines.map((med, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-rose-200/50 hover:border-rose-400 transition-all group/item hover:-translate-y-1 flex justify-between items-center shadow-lg shadow-rose-200/20">
                        <div>
                            <p className="font-black text-lg text-rose-950 uppercase tracking-tight group-hover/item:text-rose-600 transition-colors">{med.name}</p>
                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mt-1.5">{med.quantity} Units Remaining <span className="opacity-40 font-medium italic">(Threshold: {med.lowStockThreshold})</span></p>
                        </div>
                        <button 
                            onClick={() => handleCreateOrder(med)}
                            className="p-3 bg-rose-600 text-white rounded-xl flex items-center justify-center hover:bg-rose-700 transition-all active:scale-95 shadow-xl shadow-rose-600/20"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                )) : (
                    <div className="py-12 text-center opacity-30 flex flex-col items-center gap-4 grayscale">
                        <PackageCheck size={48} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Stock Logic Optimal</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LowStockPanel;
