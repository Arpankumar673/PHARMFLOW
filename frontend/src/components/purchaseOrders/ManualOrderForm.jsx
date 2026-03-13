import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, ShoppingBag, Truck, Search } from '../../constants/icons';
import { toast } from 'react-toastify';

const ManualOrderForm = ({ onOrderCreated }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppliersRes, medicinesRes] = await Promise.all([
                    api.get('/suppliers'),
                    api.get('/inventory')
                ]);
                setSuppliers(suppliersRes.data.data);
                setMedicines(medicinesRes.data.data);
            } catch (err) {
                console.error("Failed to load form data", err);
            }
        };
        fetchData();
    }, []);

    const addItem = (medicine) => {
        const exists = items.find(i => i.medicineId === medicine._id || (i.name === medicine.name && !i.medicineId));
        if (exists) {
            setItems(items.map(i => (i.medicineId === medicine._id || (i.name === medicine.name && !i.medicineId)) ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setItems([...items, { 
                medicineId: medicine._id,
                name: medicine.name, 
                quantity: 1, 
                price: medicine.purchasePrice || 0 
            }]);
        }
        setSearchQuery('');
    };

    const removeItem = (idOrName) => {
        setItems(items.filter(i => (i.medicineId || i.name) !== idOrName));
    };

    const updateItem = (idOrName, field, value) => {
        setItems(items.map(i => (i.medicineId || i.name) === idOrName ? { ...i, [field]: parseFloat(value) || 0 } : i));
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    };

    const handleCreateOrder = async () => {
        if (!selectedSupplier || items.length === 0) {
            toast.error('Protocol Error: Supplier and Items required');
            return;
        }

        try {
            await api.post('/purchase-orders', {
                supplier: selectedSupplier,
                medicines: items,
                totalAmount: calculateTotal(),
                totalItems: items.length
            });
            toast.success('Matrix Sync: Purchase Order Created');
            setItems([]);
            setSelectedSupplier('');
            if (onOrderCreated) onOrderCreated();
        } catch (err) {
            toast.error('System Failure: Could not create order');
        }
    };

    const filteredMedicines = searchQuery ? medicines.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5) : [];

    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm group">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Plus size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800">Manual Procurement</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Initialize manual supply bypass</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Truck size={14} /> Distributor Link
                    </label>
                    <select 
                        value={selectedSupplier}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 font-black text-xs text-slate-900 outline-none ring-1 ring-slate-100 focus:ring-4 ring-blue-50 transition-all uppercase"
                    >
                        <option value="">Select Protocol Node...</option>
                        {suppliers.map(s => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-3 relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Search size={14} /> Inventory Source
                    </label>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search medicines..."
                        className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 font-black text-xs text-slate-900 placeholder:text-slate-300 outline-none ring-1 ring-slate-100 focus:ring-4 ring-blue-50 transition-all uppercase tracking-[0.1em]"
                    />
                    
                    {filteredMedicines.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-50 p-2 animate-down">
                            {filteredMedicines.map(m => (
                                <button 
                                    key={m._id}
                                    onClick={() => addItem(m)}
                                    className="w-full text-left p-4 hover:bg-slate-50 rounded-2xl flex justify-between items-center group/item transition-all"
                                >
                                    <span className="font-black text-[10px] text-slate-700 uppercase">{m.name}</span>
                                    <span className="text-[9px] font-black text-slate-400 opacity-0 group-hover/item:opacity-100">+ Add to Hub</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-4 space-y-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-2xl p-4 md:p-6 flex flex-col gap-4 border border-white">
                            <div className="flex justify-between items-center">
                                <span className="font-black text-xs text-slate-900 uppercase tracking-tighter">{item.name}</span>
                                <button onClick={() => removeItem(item.medicineId || item.name)} className="text-rose-500 hover:rotate-12 transition-transform">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Qty</p>
                                    <input 
                                        type="number" 
                                        value={item.quantity}
                                        onChange={(e) => updateItem(item.medicineId || item.name, 'quantity', e.target.value)}
                                        className="w-full bg-white border-none rounded-xl px-4 py-2 font-black text-[10px] text-slate-700 outline-none ring-1 ring-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Price (₹)</p>
                                    <input 
                                        type="number" 
                                        value={item.price}
                                        onChange={(e) => updateItem(item.medicineId || item.name, 'price', e.target.value)}
                                        className="w-full bg-white border-none rounded-xl px-4 py-2 font-black text-[10px] text-slate-700 outline-none ring-1 ring-slate-200"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {items.length === 0 && (
                        <div className="py-8 md:py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center opacity-30">
                            <ShoppingBag size={40} className="mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest italic">Hub Empty</p>
                        </div>
                    )}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aggregate Value</span>
                        <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <button 
                        onClick={handleCreateOrder}
                        disabled={items.length === 0}
                        className="w-full bg-blue-600 text-white py-5 md:py-6 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:bg-slate-200 disabled:shadow-none"
                    >
                        Initialize Procurement
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManualOrderForm;
