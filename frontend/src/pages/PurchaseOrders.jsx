import { useState, useEffect } from 'react';
import api from '../services/api';
import { Truck, Plus } from '../constants/icons';
import { toast } from 'react-toastify';

// Components
import ManualOrderForm from '../components/purchaseOrders/ManualOrderForm';
import OrdersTable from '../components/purchaseOrders/OrdersTable';
import LowStockPanel from '../components/purchaseOrders/LowStockPanel';
import AutoRefillPanel from '../components/purchaseOrders/AutoRefillPanel';

const PurchaseOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get('/purchase-orders');
            setOrders(res.data.data);
        } catch (err) {
            console.error("Failed to load purchase orders", err);
            toast.error('System Failure: Could not sync procurement trail');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (loading && orders.length === 0) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin"></div>
                <Truck size={24} className="absolute inset-0 m-auto text-primary-600 animate-pulse" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 italic">Syncing Procurement Data...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Supply Chain Core</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-pharmacy-900 tracking-tighter uppercase leading-none">Purchase <span className="text-blue-600">Matrix</span></h1>
                    <p className="text-xs md:text-sm text-pharmacy-500 font-medium italic mt-2 opacity-60">Manage manual procurement trails and smart refill protocols.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-10">
                {/* Left Column: Manual Order & Low Stock */}
                <div className="xl:col-span-4 space-y-6 lg:space-y-10">
                    <ManualOrderForm onOrderCreated={handleRefresh} />
                    <LowStockPanel onOrderCreated={handleRefresh} />
                </div>

                {/* Right Column: Tracking & Auto Refill */}
                <div className="xl:col-span-8 space-y-6 lg:space-y-10">
                    <AutoRefillPanel onOrderCreated={handleRefresh} />
                    <OrdersTable orders={orders} onUpdated={handleRefresh} />
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrders;
