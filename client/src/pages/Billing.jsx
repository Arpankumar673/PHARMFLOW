import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import api from '../services/api';
import clsx from 'clsx';
import {
    Search,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    Printer,
    Download,
    CreditCard,
    Banknote,
    Smartphone,
    X,
    CheckCircle2,
    QrCode,
    Maximize2,
    Loader2,
    Camera,
    ChevronRight,
    Pill,
    Activity
} from '../constants/icons';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import useDebounce from '../hooks/useDebounce';

// Lazy load BarcodeScanner
const BarcodeScanner = lazy(() => import('../components/BarcodeScanner'));

const Billing = () => {
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [barcode, setBarcode] = useState('');
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('Walking Customer');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastSale, setLastSale] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [showCartMobile, setShowCartMobile] = useState(false);

    const barcodeInputRef = useRef(null);

    useEffect(() => {
        fetchMedicines();
        if (barcodeInputRef.current && !isScannerOpen) {
            barcodeInputRef.current.focus();
        }
    }, [isScannerOpen]);

    const fetchMedicines = async () => {
        try {
            const res = await api.get('/inventory');
            setMedicines(res.data.data);
        } catch (err) {
            console.error('Error fetching medicines', err);
        }
    };

    useEffect(() => {
        if (debouncedSearchTerm.length > 1) {
            const results = medicines.filter(m =>
                (m.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                    m.batchNumber.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                    m.barcode?.includes(debouncedSearchTerm))
                && m.quantity > 0
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm, medicines]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleBarcodeScan = async (scannedBarcode) => {
        const code = typeof scannedBarcode === 'string' ? scannedBarcode : barcode;
        if (!code) return;

        try {
            const res = await api.get(`/inventory?barcode=${code}`);
            const med = res.data.data[0];

            if (med) {
                addToCart(med);
                setBarcode('');
                setIsScannerOpen(false);
            } else {
                toast.error('Medicine not found for this barcode');
                setBarcode('');
            }
        } catch (err) {
            toast.error('Error scanning barcode');
        }
    };

    const addToCart = (med) => {
        const existing = cart.find(item => item.id === med._id);
        if (existing) {
            if (existing.quantity < med.quantity) {
                updateQuantity(med._id, 1);
            } else {
                toast.warning('No more stock available!');
            }
        } else {
            setCart([...cart, {
                id: med._id,
                name: med.name,
                price: med.sellingPrice,
                quantity: 1,
                maxStock: med.quantity,
                batch: med.batchNumber
            }]);
            toast.success(`${med.name} added to cart`);
        }
        setSearchTerm('');
        setSearchResults([]);
    };

    const updateQuantity = (id, change) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + change;
                if (newQty > 0 && newQty <= item.maxStock) {
                    return { ...item, quantity: newQty };
                }
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const res = await api.post('/billing/create', {
                items: cart,
                customerName,
                paymentMethod
            });
            setLastSale(res.data.data);
            setShowSuccess(true);
            setCart([]);
            setCustomerName('Walking Customer');
            fetchMedicines(); // Refresh stock
        } catch (err) {
            toast.error(err.response?.data?.error || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 lg:gap-8 min-h-[calc(100vh-120px)] relative">
            {/* Header - Mobile Optimized */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-4xl font-black text-pharmacy-900 tracking-tighter uppercase">Terminal POS</h1>
                    <p className="text-pharmacy-500 font-medium text-xs lg:text-sm italic uppercase tracking-widest opacity-60">Session Node: {format(new Date(), 'HH:mm:ss')}</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="flex-1 md:flex-none btn bg-pharmacy-900 text-white py-4 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform"
                    >
                        <Camera size={20} />
                        Optical Scan
                    </button>
                    <button
                        onClick={() => setShowCartMobile(!showCartMobile)}
                        className="lg:hidden p-4 bg-primary-100 text-primary-700 rounded-2xl relative active:scale-90 transition-transform"
                    >
                        <ShoppingCart size={24} />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white animate-bounce">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10">
                {/* Product Selection Area */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Search & Barcode Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-pharmacy-400 group-focus-within:text-primary-600 transition-colors">
                                <Search size={22} />
                            </span>
                            <input
                                type="text"
                                className="w-full bg-white border-2 border-transparent ring-1 ring-pharmacy-100 rounded-[28px] pl-14 pr-6 py-5 font-bold text-pharmacy-900 focus:ring-4 ring-primary-50 focus:border-primary-500 outline-none transition-all placeholder:text-pharmacy-200 placeholder:font-medium shadow-sm hover:shadow-md"
                                placeholder="Search Name/Batch..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />

                            {searchResults.length > 0 && (
                                <div className="absolute z-[100] w-full mt-3 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-pharmacy-50 overflow-hidden animate-slide-up max-h-[400px] overflow-y-auto scrollbar-hide">
                                    <div className="p-4 bg-pharmacy-50/50 border-b border-pharmacy-50">
                                        <p className="text-[10px] font-black text-pharmacy-400 uppercase tracking-widest">Matched Nodes</p>
                                    </div>
                                    <ul className="divide-y divide-pharmacy-50">
                                        {searchResults.map(m => (
                                            <li
                                                key={m._id}
                                                className="p-5 hover:bg-primary-50 cursor-pointer flex justify-between items-center transition-all group"
                                                onClick={() => addToCart(m)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 border border-pharmacy-50 shadow-sm group-hover:scale-110 transition-transform">
                                                        <Pill size={22} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-pharmacy-900 uppercase tracking-tight">{m.name}</p>
                                                        <p className="text-[10px] text-pharmacy-400 font-bold uppercase tracking-widest italic">{m.batchNumber}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-pharmacy-900 text-lg tracking-tighter">₹{m.sellingPrice}</p>
                                                    <span className={clsx(
                                                        "text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest",
                                                        m.quantity > 10 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                                                    )}>Qty: {m.quantity}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleBarcodeScan(); }} className="relative hidden md:block group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-500">
                                <QrCode size={22} />
                            </span>
                            <input
                                ref={barcodeInputRef}
                                type="text"
                                className="w-full bg-primary-50/50 border-2 border-transparent ring-1 ring-primary-100 rounded-[28px] pl-14 pr-6 py-5 font-black text-pharmacy-900 focus:ring-4 ring-primary-100 focus:border-primary-500 focus:bg-white outline-none transition-all font-mono tracking-widest"
                                placeholder="Laser Scan Active..."
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Cart Section */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-pharmacy-50 flex flex-col min-h-[500px] lg:min-h-[600px] overflow-hidden">
                        <div className="p-8 border-b border-pharmacy-50 flex items-center justify-between bg-pharmacy-50/30">
                            <div className="flex items-center gap-4">
                                <div className="bg-white p-3 rounded-2xl shadow-sm ring-1 ring-pharmacy-50">
                                    <ShoppingCart size={24} className="text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-black text-pharmacy-900 uppercase tracking-tighter text-xl leading-none">Terminal Cart</h3>
                                    <p className="text-[10px] text-pharmacy-400 font-bold uppercase tracking-widest mt-1.5">{cart.length} active items</p>
                                </div>
                            </div>
                            {cart.length > 0 && (
                                <button onClick={() => setCart([])} className="bg-red-50 text-red-500 p-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90">
                                    <Trash2 size={22} />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-pharmacy-200 py-32 grayscale opacity-40">
                                    <div className="w-24 h-24 bg-pharmacy-50 rounded-[40px] flex items-center justify-center mb-6 animate-pulse">
                                        <Maximize2 size={40} className="text-pharmacy-200" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Scanner Waiting for Input</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-pharmacy-50">
                                    {cart.map(item => (
                                        <div key={item.id} className="p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-primary-50/30 transition-all group relative">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <p className="font-black text-pharmacy-900 tracking-tighter text-2xl uppercase leading-none">{item.name}</p>
                                                    <span className="bg-pharmacy-900 text-white text-[9px] px-2 py-0.5 rounded-md font-black italic tracking-widest">{item.batch}</span>
                                                </div>
                                                <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest flex items-center gap-2">
                                                    <CreditCard size={12} /> Unit Cost: ₹{item.price}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end gap-10">
                                                <div className="flex items-center gap-4 bg-white ring-2 ring-pharmacy-50 rounded-[28px] p-2 shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-red-50 text-red-400 active:scale-75 transition-all"
                                                    >
                                                        <Minus size={22} />
                                                    </button>
                                                    <span className="font-black text-pharmacy-900 w-12 text-center text-2xl tracking-tighter">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-emerald-50 text-emerald-600 active:scale-75 transition-all"
                                                    >
                                                        <Plus size={22} />
                                                    </button>
                                                </div>
                                                <div className="text-right min-w-[120px]">
                                                    <p className="text-[10px] text-pharmacy-400 font-black uppercase tracking-widest mb-1 italic">Subtotal</p>
                                                    <p className="font-black text-pharmacy-900 text-2xl tracking-tighter leading-none">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="md:hidden absolute top-6 right-6 text-red-500 p-2 bg-red-50 rounded-xl">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Checkout Summary Area - Sticky on Desktop */}
                <div className={clsx(
                    "lg:col-span-4 transition-all duration-500",
                    "fixed inset-0 z-[150] lg:relative lg:z-0 lg:block lg:translate-y-0",
                    showCartMobile ? "translate-y-0" : "translate-y-full lg:translate-y-0"
                )}>
                    {/* Mobile Close Handle */}
                    <div
                        className="absolute inset-0 bg-primary-950/40 backdrop-blur-md lg:hidden"
                        onClick={() => setShowCartMobile(false)}
                    ></div>

                    <div className="bg-white h-full lg:h-auto lg:sticky lg:top-24 rounded-t-[40px] lg:rounded-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.2)] lg:shadow-xl border border-pharmacy-50 flex flex-col relative z-[160] overflow-hidden max-h-[90vh] lg:max-h-none">
                        <div className="p-8 bg-pharmacy-900 text-white shrink-0">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-black text-xl uppercase tracking-[0.2em] italic">Checkout</h3>
                                <button className="lg:hidden p-2 text-white/50" onClick={() => setShowCartMobile(false)}><X size={24} /></button>
                            </div>
                            <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest leading-tight">Secure Transaction Gateway</p>
                        </div>

                        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400">Customer Identity</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-pharmacy-50/50 border-none rounded-2xl p-4 font-bold text-pharmacy-900 outline-none ring-1 ring-pharmacy-100 focus:ring-2 ring-primary-500"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Enter Customer Name..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-pharmacy-400">Payment Protocol</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'Cash', icon: Banknote },
                                        { id: 'Card', icon: CreditCard },
                                        { id: 'UPI', icon: Smartphone },
                                        { id: 'Other', icon: Activity }
                                    ].map(method => (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={clsx(
                                                "p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2",
                                                paymentMethod === method.id
                                                    ? "bg-primary-50 border-primary-600 text-primary-700 shadow-sm"
                                                    : "bg-white border-pharmacy-50 text-pharmacy-400 hover:border-pharmacy-200"
                                            )}
                                        >
                                            <method.icon size={20} strokeWidth={paymentMethod === method.id ? 2.5 : 2} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{method.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-pharmacy-50/50 rounded-[32px] p-8 space-y-4 border border-pharmacy-100">
                                <div className="flex justify-between text-pharmacy-500 font-bold uppercase tracking-widest text-[10px]">
                                    <span>Base Amount</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-pharmacy-500 font-bold uppercase tracking-widest text-[10px]">
                                    <span>System Tax (5%)</span>
                                    <span>₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-pharmacy-100 flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase text-pharmacy-900 tracking-[0.2em] italic">Total Due</span>
                                    <span className="text-4xl font-black text-pharmacy-900 tracking-tighter">₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-pharmacy-50 border-t border-pharmacy-100 shrink-0">
                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || loading}
                                className="w-full bg-primary-600 hover:bg-emerald-600 disabled:bg-pharmacy-200 text-white p-6 rounded-[28px] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary-200 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                            >
                                {loading ? <Loader2 size={24} className="animate-spin" /> : (
                                    <>
                                        Authorize Terminal
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-primary-950/80 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white rounded-[48px] p-10 max-w-sm w-full text-center shadow-2xl animate-scale-up relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                        <div className="w-24 h-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <CheckCircle2 size={50} className="text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-black text-pharmacy-900 mb-2 uppercase tracking-tighter">Sale Authorized</h2>
                        <p className="text-pharmacy-500 font-medium italic mb-10 text-sm">Transaction {lastSale?._id.slice(-8).toUpperCase()} logged successfully.</p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <button className="flex flex-col items-center gap-2 p-5 bg-pharmacy-50 rounded-[28px] hover:bg-primary-50 transition-colors group">
                                <div className="bg-white p-3 rounded-2xl shadow-sm text-primary-600 group-hover:scale-110 transition-transform"><Printer size={20} /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Receipt</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-5 bg-pharmacy-50 rounded-[28px] hover:bg-primary-50 transition-colors group">
                                <div className="bg-white p-3 rounded-2xl shadow-sm text-primary-600 group-hover:scale-110 transition-transform"><Download size={20} /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Digital</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowSuccess(false)}
                            className="w-full bg-pharmacy-900 text-white p-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl active:scale-95 transition-all"
                        >
                            Next Customer
                        </button>
                    </div>
                </div>
            )}

            <Suspense fallback={null}>
                {isScannerOpen && (
                    <BarcodeScanner
                        onScan={handleBarcodeScan}
                        onClose={() => setIsScannerOpen(false)}
                    />
                )}
            </Suspense>

            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                }
                @keyframes scale-up {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-up {
                    animation: scale-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                    .card { border: none !important; box-shadow: none !important; }
                }
            `}</style>
        </div>
    );
};

export default Billing;
