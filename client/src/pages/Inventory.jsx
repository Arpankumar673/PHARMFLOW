import { useState, useEffect, lazy, Suspense } from 'react';
import api from '../services/api';
import clsx from 'clsx';
import { Pill, Plus, Search, Filter, Edit2, Trash2, QrCode, X, Camera, Truck } from '../constants/icons';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Modal from '../components/common/Modal';
import useDebounce from '../hooks/useDebounce';

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

    const [formData, setFormData] = useState({
        name: '',
        batchNumber: '',
        barcode: '',
        expiryDate: '',
        quantity: 0,
        purchasePrice: 0,
        sellingPrice: 0,
        supplier: '',
        category: 'General',
        lowStockThreshold: 10
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [medRes, supRes] = await Promise.all([
                api.get('/inventory'),
                api.get('/suppliers')
            ]);
            setMedicines(medRes.data.data);
            setSuppliers(supRes.data.data);
        } catch (err) {
            console.error('Error fetching inventory', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMedicines = medicines.filter(med =>
        med.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        med.batchNumber.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        med.barcode?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const handleBarcodeScan = (scannedBarcode) => {
        setSearchTerm(scannedBarcode);
        setIsScannerOpen(false);
        toast.info(`Looking up node: ${scannedBarcode}`);
    };

    const openAddModal = () => {
        setEditingMed(null);
        setFormData({
            name: '',
            batchNumber: '',
            barcode: '',
            expiryDate: '',
            quantity: 0,
            purchasePrice: 0,
            sellingPrice: 0,
            supplier: suppliers[0]?._id || '',
            category: 'General',
            lowStockThreshold: 10
        });
        setShowModal(true);
    };

    const openEditModal = (med) => {
        setEditingMed(med);
        setFormData({
            name: med.name,
            batchNumber: med.batchNumber,
            barcode: med.barcode || '',
            expiryDate: med.expiryDate ? med.expiryDate.split('T')[0] : '',
            quantity: med.quantity,
            purchasePrice: med.purchasePrice,
            sellingPrice: med.sellingPrice,
            supplier: med.supplier?._id || '',
            category: med.category,
            lowStockThreshold: med.lowStockThreshold || 10
        });
        setShowModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMed) {
                await api.put(`/inventory/${editingMed._id}`, formData);
                toast.success('Medicine updated successfully');
            } else {
                await api.post('/inventory', formData);
                toast.success('Medicine added successfully');
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error saving medicine');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            try {
                await api.delete(`/inventory/${id}`);
                toast.warning('Medicine removed from inventory');
                fetchData();
            } catch (err) {
                toast.error('Error deleting medicine');
            }
        }
    };

    return (
        <div className="space-y-6 lg:space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-black text-pharmacy-900 tracking-tight uppercase">Medicine Stock</h1>
                    <p className="text-pharmacy-500 text-sm font-medium italic">Real-time inventory management.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="sm:hidden btn bg-primary-50 text-primary-600 p-4 rounded-2xl shadow-sm active:scale-95"
                    >
                        <Camera size={20} />
                    </button>
                    {isPharmacist && (
                        <button
                            onClick={openAddModal}
                            className="flex-1 sm:flex-none btn btn-primary flex items-center justify-center gap-2 py-4 px-8 shadow-xl shadow-primary-200 font-black uppercase tracking-widest text-[10px]"
                        >
                            <Plus size={18} />
                            Add Medicine
                        </button>
                    )}
                </div>
            </header>

            <div className="bg-white p-4 lg:p-6 rounded-3xl shadow-sm border border-pharmacy-50 flex flex-col lg:flex-row gap-4 lg:items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-full blur-3xl opacity-50 -mr-12 -mt-12"></div>
                <div className="relative w-full lg:w-96">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-pharmacy-400">
                        <Search size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search IDs, batch or barcode..."
                        className="w-full bg-pharmacy-50/50 border-none rounded-2xl pl-12 py-4 font-bold text-pharmacy-900 outline-none focus:ring-2 ring-primary-100 placeholder:text-pharmacy-200"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="flex gap-2 lg:gap-4 scrollbar-hide overflow-x-auto pb-1 lg:pb-0">
                    <div className="bg-primary-50 rounded-2xl px-5 py-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-700 whitespace-nowrap">
                        <Filter size={14} />
                        Filter Cluster
                    </div>
                    <button className="bg-pharmacy-900 text-white rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all whitespace-nowrap">Node Export</button>
                </div>
            </div>

            {/* Mobile Card View (Hidden on Tablet/Desktop) */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse"></div>)
                ) : filteredMedicines.map((med) => (
                    <div key={med._id} className="bg-white p-6 rounded-[32px] border border-pharmacy-50 shadow-sm relative overflow-hidden active:scale-[0.98] transition-transform">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                    <Pill size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-pharmacy-900 leading-tight uppercase tracking-tight">{med.name}</h3>
                                    <p className="text-[10px] font-black text-pharmacy-400 uppercase tracking-widest italic">{med.category}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => openEditModal(med)} className="p-3 text-primary-600 bg-primary-50 rounded-xl"><Edit2 size={18} /></button>
                                <button onClick={() => handleDelete(med._id)} className="p-3 text-red-600 bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-pharmacy-50/50 p-4 rounded-2xl">
                                <p className="text-[9px] font-black text-pharmacy-400 uppercase tracking-widest mb-1">Quantity</p>
                                <p className={clsx("text-lg font-black tracking-tighter", med.quantity <= med.lowStockThreshold ? "text-red-600" : "text-pharmacy-900")}>
                                    {med.quantity}
                                </p>
                            </div>
                            <div className="bg-pharmacy-50/50 p-4 rounded-2xl">
                                <p className="text-[9px] font-black text-pharmacy-400 uppercase tracking-widest mb-1">Pricing</p>
                                <p className="text-lg font-black text-pharmacy-900 tracking-tighter">₹{med.sellingPrice}</p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={clsx(
                                    "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border",
                                    new Date(med.expiryDate) < new Date() ? "bg-red-50 text-red-700 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                )}>
                                    Exp {format(new Date(med.expiryDate), 'MMM yyyy')}
                                </span>
                            </div>
                            {med.quantity <= med.lowStockThreshold && (
                                <button onClick={() => window.location.href = '/purchase-orders'} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">
                                    <Truck size={14} />
                                    Order
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden lg:block card shadow-xl shadow-pharmacy-200 border-none ring-1 ring-pharmacy-100 overflow-hidden rounded-[32px]">
                <div className="overflow-x-auto min-h-[500px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white text-pharmacy-400 text-[10px] uppercase tracking-widest font-black sticky top-0 z-10 border-b border-pharmacy-50">
                            <tr>
                                <th className="px-8 py-6">Medicine Protocol</th>
                                <th className="px-8 py-6">Batch Node</th>
                                <th className="px-8 py-6 text-center">Volume</th>
                                <th className="px-8 py-6">Node Price</th>
                                <th className="px-8 py-6">Expiry</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pharmacy-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-8"><div className="h-4 bg-pharmacy-50 rounded-full w-2/3"></div></td>
                                    </tr>
                                ))
                            ) : filteredMedicines.map((med) => (
                                <tr key={med._id} className="hover:bg-primary-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-pharmacy-50 text-primary-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <Pill size={22} />
                                            </div>
                                            <div>
                                                <p className="font-black text-pharmacy-900 tracking-tighter uppercase">{med.name}</p>
                                                <p className="text-[9px] text-pharmacy-400 mt-1 uppercase font-black tracking-widest italic">{med.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-[10px] font-black text-pharmacy-900 uppercase tracking-widest">{med.batchNumber}</p>
                                        {med.barcode && (
                                            <div className="flex items-center gap-1.5 mt-1 text-primary-500 font-bold">
                                                <QrCode size={12} />
                                                <span className="text-[9px] tracking-widest">{med.barcode}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={clsx(
                                                "font-black text-xl tracking-tighter",
                                                med.quantity <= med.lowStockThreshold ? "text-red-600" : "text-pharmacy-900"
                                            )}>
                                                {med.quantity}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-black text-pharmacy-900 tracking-tighter text-lg">₹{med.sellingPrice}</td>
                                    <td className="px-8 py-5">
                                        <span className={clsx(
                                            "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border inline-block",
                                            new Date(med.expiryDate) < new Date()
                                                ? "bg-red-50 text-red-700 border-red-100"
                                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        )}>
                                            {format(new Date(med.expiryDate), 'MMM yyyy')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {med.quantity <= med.lowStockThreshold && (
                                                <button onClick={() => window.location.href = '/purchase-orders'} className="p-3 text-blue-600 bg-blue-50 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                                                    <Truck size={18} />
                                                </button>
                                            )}
                                            {isPharmacist && (
                                                <button onClick={() => openEditModal(med)} className="p-3 text-primary-600 bg-primary-50 rounded-2xl hover:bg-primary-600 hover:text-white transition-all">
                                                    <Edit2 size={18} />
                                                </button>
                                            )}
                                            {isOwner && (
                                                <button onClick={() => handleDelete(med._id)} className="p-3 text-red-600 bg-red-50 rounded-2xl hover:bg-red-600 hover:text-white transition-all">
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

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingMed ? 'Edit Medicine Node' : 'Initialize New Medicine'}
                maxWidth="max-w-4xl"
            >
                <form onSubmit={handleFormSubmit} className="space-y-8 pb-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Information Cluster */}
                        <div className="space-y-6">
                            <div className="bg-pharmacy-50/50 p-6 rounded-[32px] border border-pharmacy-50">
                                <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 mb-2 block">Protocol Identification</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border-none rounded-2xl p-4 font-black text-pharmacy-900 ring-1 ring-pharmacy-100 focus:ring-2 ring-primary-500 transition-all uppercase"
                                    placeholder="Medicine Name..."
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 mb-2 block">Batch Serial</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-pharmacy-50 border-none rounded-2xl p-4 font-bold text-pharmacy-900 ring-1 ring-pharmacy-100 uppercase"
                                        value={formData.batchNumber}
                                        placeholder="B-90"
                                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 mb-2 block">Neural Barcode</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full bg-pharmacy-50 border-none rounded-2xl p-4 pl-4 pr-10 font-mono text-xs tracking-widest"
                                            value={formData.barcode}
                                            placeholder="SCAN..."
                                            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsScannerOpen(true)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 p-1 bg-white rounded-lg shadow-sm"
                                        >
                                            <QrCode size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 mb-2 block">Classification</label>
                                    <select
                                        className="w-full bg-pharmacy-50 border-none rounded-2xl p-4 font-bold text-pharmacy-900 ring-1 ring-pharmacy-100"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {['General', 'Tablet', 'Capsule', 'Syrup', 'Injection'].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 mb-2 block">Supplier Link</label>
                                    <select
                                        required
                                        className="w-full bg-pharmacy-50 border-none rounded-2xl p-4 font-bold text-pharmacy-900 ring-1 ring-pharmacy-100"
                                        value={formData.supplier}
                                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                    >
                                        <option value="" disabled>Select Provider</option>
                                        {suppliers.map(sup => (
                                            <option key={sup._id} value={sup._id}>{sup.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Dynamics Cluster */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 mb-2 block">Expiry Limit</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-pharmacy-50 border-none rounded-2xl p-4 font-bold text-pharmacy-900 ring-1 ring-pharmacy-100"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400 mb-2 block">Alert Trigger</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-pharmacy-50 border-none rounded-2xl p-4 font-bold text-pharmacy-900 ring-1 ring-pharmacy-100"
                                        value={formData.lowStockThreshold}
                                        onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="bg-primary-900 p-8 rounded-[32px] shadow-2xl shadow-primary-200">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary-200 mb-2 block">Current Volume</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-transparent border-none text-white text-6xl font-black tracking-tighter p-0 focus:ring-0 text-center"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-pharmacy-50 p-4 rounded-2xl border border-pharmacy-100">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-pharmacy-400 mb-1 block">Purchase Cost</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-pharmacy-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            required
                                            className="w-full bg-transparent border-none p-0 font-black text-pharmacy-900 text-lg focus:ring-0"
                                            value={formData.purchasePrice}
                                            onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1 block">Selling Quote</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            required
                                            className="w-full bg-transparent border-none p-0 font-black text-emerald-900 text-lg focus:ring-0"
                                            value={formData.sellingPrice}
                                            onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-pharmacy-50">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-pharmacy-400 hover:bg-pharmacy-50 transition-colors"
                        >
                            Abort Process
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-primary-600 text-white shadow-xl shadow-primary-100 active:scale-95 transition-all"
                        >
                            {editingMed ? 'Commit Node Updates' : 'Authorize New Node'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Suspense fallback={null}>
                {isScannerOpen && (
                    <BarcodeScanner
                        onScan={handleBarcodeScan}
                        onClose={() => setIsScannerOpen(false)}
                    />
                )}
            </Suspense>

            <style>{`
                .label-modern {
                    display: block;
                    font-size: 9px;
                    font-weight: 900;
                    text-transform: uppercase;
                    color: #94a3b8;
                    margin-bottom: 8px;
                    letter-spacing: 0.15em;
                }
                .input-modern {
                    width: 100%;
                    padding: 16px 20px;
                    border-radius: 20px;
                    border: 1px solid #f1f5f9;
                    background: #f8fafc;
                    font-size: 15px;
                    font-weight: 700;
                    transition: all 0.3s;
                    color: #0f172a;
                    outline: none;
                }
                .input-modern:focus {
                    background: white;
                    border-color: #0ea5e9;
                    box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.15);
                }
                @keyframes slide-up {
                    0% { transform: translateY(100%); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default Inventory;
