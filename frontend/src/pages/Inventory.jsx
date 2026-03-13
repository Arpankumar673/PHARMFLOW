import { useState, useEffect, lazy, Suspense } from 'react';
import api from '../services/api';
import clsx from 'clsx';
import { Pill, Plus, Search, Filter, Edit2, Trash2, Camera, Truck } from '../constants/icons';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import useDebounce from '../hooks/useDebounce';
import AddMedicineModal from '../components/inventory/AddMedicineModal';

const BarcodeScanner = lazy(() => import('../components/BarcodeScanner'));

const Inventory = () => {
    const [medicines, setMedicines] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [showModal, setShowModal] = useState(false);
    const [editingMed, setEditingMed] = useState(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const { isPharmacist, isOwner } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [medRes, supRes] = await Promise.all([
                api.get('/inventory'),
                api.get('/suppliers')
            ]);
            setMedicines(medRes.data.data);
            setSuppliers(supRes.data.data);
        } catch (err) {
            console.error('Error fetching inventory', err);
            toast.error('Failed to sync inventory nodes');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMedicines = medicines.filter(med =>
        med.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        med.batchNumber?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        med.barcode?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const handleBarcodeScan = (scannedBarcode) => {
        setSearchTerm(scannedBarcode);
        setIsScannerOpen(false);
        toast.info(`Node Detected: ${scannedBarcode}`);
    };

    const openAddModal = () => {
        setEditingMed(null);
        setShowModal(true);
    };

    const openEditModal = (med) => {
        setEditingMed(med);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this medicine from primary storage?')) {
            try {
                await api.delete(`/inventory/${id}`);
                toast.warning('Node decommissioned');
                fetchData();
            } catch (err) {
                toast.error('Deletion protocol failed');
            }
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Inventory <span className="text-blue-600">Vault</span></h1>
                    <p className="text-sm font-bold text-slate-400 italic">Centralized medicine management & stock audit.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                    >
                        <Camera size={20} />
                    </button>
                    {isPharmacist && (
                        <button
                            onClick={openAddModal}
                            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-3"
                        >
                            <Plus size={18} />
                            Add Medicine
                        </button>
                    )}
                </div>
            </header>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search medicines, batches, barcodes..."
                        className="w-full bg-slate-50 border-none rounded-2xl pl-12 py-4 font-bold text-slate-900 focus:ring-2 ring-blue-500 transition-all placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                        <button className="px-6 py-2.5 bg-white shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600">All Nodes</button>
                        <button className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Low Stock</button>
                        <button className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Expiring</button>
                    </div>
                </div>
            </div>

            {/* Inventory Table Container */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-8 py-6">Medicine Details</th>
                                <th className="px-8 py-6 text-center">Current Stock</th>
                                <th className="px-8 py-6 text-center">Unit Price</th>
                                <th className="px-8 py-6 text-center">Profit Node</th>
                                <th className="px-8 py-6">Expiry Cluster</th>
                                <th className="px-8 py-6 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-10"><div className="h-4 bg-slate-100 rounded-full w-2/3"></div></td>
                                    </tr>
                                ))
                            ) : filteredMedicines.map((med) => (
                                <tr key={med._id} className="hover:bg-blue-50/30 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <Pill size={22} />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 tracking-tight uppercase leading-none mb-1">{med.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{med.category}</span>
                                                    <span className="text-[9px] font-bold text-slate-300">•</span>
                                                    <span className="text-[9px] font-bold text-blue-500 tracking-widest">{med.barcode}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={clsx(
                                                "font-black text-xl tracking-tighter",
                                                med.quantity <= med.lowStockThreshold ? "text-red-500" : "text-slate-900"
                                            )}>
                                                {med.quantity}
                                            </span>
                                            {med.quantity <= med.lowStockThreshold && (
                                                <span className="text-[8px] font-black uppercase text-red-400 tracking-widest mt-0.5">Refill Map Only</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 tracking-tighter">₹{med.sellingPrice}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Quote</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-emerald-600 tracking-tighter">₹{med.sellingPrice - med.purchasePrice}</span>
                                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Yield</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={clsx(
                                            "text-[9px] font-black uppercase tracking-[0.15em] px-4 py-2 rounded-xl border inline-block",
                                            new Date(med.expiryDate) < new Date()
                                                ? "bg-rose-50 text-rose-600 border-rose-100"
                                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        )}>
                                            {format(new Date(med.expiryDate), 'MMM yyyy')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {med.quantity <= med.lowStockThreshold && (
                                                <button 
                                                    onClick={() => window.location.href = '/purchase-orders'} 
                                                    className="p-3 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    title="Order From Supplier"
                                                >
                                                    <Truck size={18} />
                                                </button>
                                            )}
                                            {isPharmacist && (
                                                <button 
                                                    onClick={() => openEditModal(med)} 
                                                    className="p-3 text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            )}
                                            {isOwner && (
                                                <button 
                                                    onClick={() => handleDelete(med._id)} 
                                                    className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddMedicineModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={fetchData}
                editingMed={editingMed}
                suppliers={suppliers}
            />

            <Suspense fallback={null}>
                {isScannerOpen && (
                    <BarcodeScanner
                        onScan={handleBarcodeScan}
                        onClose={() => setIsScannerOpen(false)}
                    />
                )}
            </Suspense>
        </div>
    );
};

export default Inventory;
