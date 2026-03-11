import { useNavigate, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Pill,
    Users,
    ShoppingCart,
    BarChart3,
    Settings,
    BrainCircuit,
    Truck,
    Network,
    TrendingUp,
    LogOut,
    Zap,
    MapPin,
    Activity
} from '../../constants/icons';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout, isOwner, isPharmacist, isSuperAdmin, isStaff } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/', show: isSuperAdmin || isOwner || isPharmacist },
        { name: 'Inventory', icon: Pill, path: '/inventory', show: isOwner || isPharmacist },
        { name: 'Billing', icon: ShoppingCart, path: '/billing', show: isOwner || isPharmacist || isStaff },
        { name: 'Suppliers', icon: Users, path: '/suppliers', show: isOwner },
        { name: 'Reports', icon: BarChart3, path: '/reports', show: isOwner || isPharmacist },
        { name: 'Multi-store', icon: MapPin, path: '/multi-store', show: isOwner },
        { name: 'Subscription', icon: Zap, path: '/subscription', show: isOwner },
        { name: 'Pharmacy Management', icon: Users, path: '/pharmacy-management', show: isSuperAdmin },
        { name: 'Platform Admin', icon: Activity, path: '/superadmin-analytics', show: isSuperAdmin },
        { name: 'Settings', icon: Settings, path: '/settings', show: isOwner },
        { name: 'Prescription Scan', icon: BrainCircuit, path: '/prescription-scanner', show: isOwner || isPharmacist },
        { name: 'Purchase Orders', icon: Truck, path: '/purchase-orders', show: isOwner },
        { name: 'Pharmacy Network', icon: Network, path: '/pharmacy-network', show: isOwner },
        { name: 'Price Intelligence', icon: TrendingUp, path: '/price-intelligence', show: isOwner },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-primary-950/40 backdrop-blur-sm z-40 transition-opacity lg:hidden",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                )}
                onClick={onClose}
            />

            <aside className={clsx(
                "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-pharmacy-50 flex flex-col transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary-200">P</div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black font-['Outfit'] tracking-tighter leading-none">PharmFlow</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 mt-1">SaaS Ecosystem</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
                    {menuItems.filter(item => item.show).map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-6 py-4 rounded-[20px] transition-all duration-300 group",
                                isActive
                                    ? "bg-primary-50 text-primary-600 shadow-sm"
                                    : "text-pharmacy-400 hover:bg-pharmacy-50 hover:text-pharmacy-900"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        size={20}
                                        className={clsx(
                                            "transition-transform group-hover:scale-110 shrink-0",
                                            isActive ? "text-primary-600" : "text-pharmacy-400"
                                        )}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-pharmacy-50">
                    <div className="bg-pharmacy-50 rounded-[24px] p-4 flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary-600 font-black text-xl shrink-0">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-black text-pharmacy-900 truncate uppercase tracking-tighter">{user?.name}</p>
                            <p className="text-[9px] text-pharmacy-400 font-bold uppercase tracking-widest leading-tight">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-6 py-4 rounded-[20px] text-red-500 hover:bg-red-50 transition-all active:scale-95 group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform shrink-0" />
                        <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
