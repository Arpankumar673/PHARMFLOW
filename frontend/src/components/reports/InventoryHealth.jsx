import { useState, useEffect } from 'react';
import api from '../../services/api';
import { PackageCheck, AlertTriangle, Timer, Activity } from '../../constants/icons';

const InventoryHealth = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const res = await api.get('/reports/inventory-health');
                setData(res.data.data);
            } catch (err) {
                console.error("Inventory data error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHealth();
    }, []);

    if (loading) return <div className="h-[400px] md:h-[500px] bg-slate-50 animate-pulse rounded-2xl" />;

    const statCards = [
        { label: "Inventory Value", value: `₹${(data?.inventoryValue || 0).toLocaleString()}`, icon: <PackageCheck size={20} className="text-blue-500" /> },
        { label: "Low Stock Items", value: data?.lowStockCount || 0, icon: <AlertTriangle size={20} className="text-orange-500" /> },
        { label: "Expiring Soon", value: data?.expiringSoonCount || 0, icon: <Timer size={20} className="text-rose-500" /> }
    ];

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600">
                    <Activity size={22} />
                </div>
                <div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter text-slate-800">Inventory Health</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Critical stock monitoring</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
                {statCards.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl border border-white group hover:bg-white hover:shadow-xl transition-all">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60 mb-1">{s.label}</p>
                            <p className="text-lg md:text-xl font-black text-slate-800 tracking-tighter">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto">
                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-orange-600 mb-4 flex items-center gap-2">
                    <AlertTriangle size={14} /> Priority Critical Items
                </h4>
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                    {data?.lowStock.length > 0 ? data.lowStock.map((med, i) => (
                        <div key={i} className="flex items-center justify-between p-3.5 bg-orange-50/50 rounded-xl border border-orange-100">
                            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-tight text-slate-700 truncate max-w-[150px]">{med.name}</span>
                            <span className="text-[9px] md:text-[10px] font-black text-rose-600 uppercase tracking-widest italic font-mono">{med.quantity} Units</span>
                        </div>
                    )) : (
                        <div className="py-8 flex flex-col items-center justify-center opacity-20 grayscale">
                            <PackageCheck size={40} strokeWidth={1} />
                            <p className="text-[9px] font-black uppercase tracking-widest mt-3">Protocol Optimal</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryHealth;
