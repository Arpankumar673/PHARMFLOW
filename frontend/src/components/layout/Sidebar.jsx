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
    Activity,
    ChevronLeft,
    ChevronRight
} from '../../constants/icons';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const Sidebar = ({ isOpen, onClose, isCollapsed, setCollapsed }) => {
    const { user, logout, isOwner, isPharmacist, isSuperAdmin, isStaff } = useAuth();
    const navigate = useNavigate();

    const sections = [
        {
            title: 'Main',
            items: [
                { name: 'Dashboard', icon: LayoutDashboard, path: '/', show: isSuperAdmin || isOwner || isPharmacist },
            ]
        },
        {
            title: 'Operations',
            items: [
                { name: 'Inventory', icon: Pill, path: '/inventory', show: isOwner || isPharmacist },
                { name: 'Billing', icon: ShoppingCart, path: '/billing', show: isOwner || isPharmacist || isStaff },
                { name: 'Suppliers', icon: Users, path: '/suppliers', show: isOwner },
                { name: 'Purchase Orders', icon: Truck, path: '/purchase-orders', show: isOwner },
            ]
        },
        {
            title: 'Analytics',
            items: [
                { name: 'Reports', icon: BarChart3, path: '/reports', show: isOwner || isPharmacist },
                { name: 'Price Intelligence', icon: TrendingUp, path: '/price-intelligence', show: isOwner },
            ]
        },
        {
            title: 'Network',
            items: [
                { name: 'Multi-store', icon: MapPin, path: '/multi-store', show: isOwner },
                { name: 'Pharmacy Network', icon: Network, path: '/pharmacy-network', show: isOwner },
            ]
        },
        {
            title: 'AI Tools',
            items: [
                { name: 'Prescription Scan', icon: BrainCircuit, path: '/prescription-scanner', show: isOwner || isPharmacist },
            ]
        },
        {
            title: 'System',
            show: isSuperAdmin,
            items: [
                { name: 'Pharmacy Management', icon: Users, path: '/pharmacy-management', show: isSuperAdmin },
                { name: 'Platform Admin', icon: Activity, path: '/superadmin-analytics', show: isSuperAdmin },
            ]
        },
        {
            title: 'Account',
            items: [
                { name: 'Subscription', icon: Zap, path: '/subscription', show: isOwner },
                { name: 'Settings', icon: Settings, path: '/settings', show: isOwner },
            ]
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarWidth = isCollapsed ? 'w-20' : 'w-[260px]';

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
                "fixed inset-y-0 left-0 z-50 bg-white border-r border-pharmacy-50 flex flex-col transition-all duration-300 lg:translate-x-0",
                sidebarWidth,
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header */}
                <div className={clsx(
                    "p-6 flex items-center mb-2",
                    isCollapsed ? "justify-center" : "justify-between"
                )}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary-200 shrink-0">P</div>
                        {!isCollapsed && (
                            <div className="flex flex-col whitespace-nowrap animate-in fade-in slide-in-from-left-4 duration-300">
                                <span className="text-xl font-black font-['Outfit'] tracking-tighter leading-none text-slate-900">PharmFlow</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 mt-1">SaaS Ecosystem</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Desktop Collapse Toggle */}
                    <button 
                        onClick={() => setCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-pharmacy-100 rounded-full items-center justify-center text-primary-600 hover:bg-primary-50 transition-colors shadow-sm z-[100]"
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-2 space-y-8 overflow-y-auto scrollbar-hide">
                    {sections.map((section, sidx) => {
                        const visibleItems = section.items.filter(item => item.show);
                        if (visibleItems.length === 0 || (section.show === false)) return null;

                        return (
                            <div key={sidx} className="space-y-2">
                                {!isCollapsed && (
                                    <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 animate-in fade-in duration-500 whitespace-nowrap">
                                        {section.title}
                                    </h3>
                                )}
                                <div className="space-y-1">
                                    {visibleItems.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            to={item.path}
                                            onClick={onClose}
                                            title={isCollapsed ? item.name : ''}
                                            className={({ isActive }) => clsx(
                                                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                                                isCollapsed ? "justify-center" : "justify-start",
                                                isActive
                                                    ? "bg-primary-50 text-primary-600 shadow-sm"
                                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <item.icon
                                                        size={22}
                                                        className={clsx(
                                                            "transition-transform group-hover:scale-110 shrink-0",
                                                            isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
                                                        )}
                                                        strokeWidth={isActive ? 2.5 : 2}
                                                    />
                                                    {!isCollapsed && (
                                                        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                                                            {item.name}
                                                        </span>
                                                    )}
                                                    {isActive && (
                                                        <div className="absolute left-0 w-1 h-6 bg-primary-600 rounded-r-full" />
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Footer / User Profile */}
                <div className="p-4 mt-auto border-t border-pharmacy-50 bg-slate-50/50">
                    {!isCollapsed ? (
                        <div className="bg-white rounded-2xl p-3 flex items-center gap-3 mb-4 shadow-sm border border-pharmacy-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-black text-xl shrink-0">
                                {user?.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tighter">{user?.name}</p>
                                    <span className="px-1.5 py-0.5 bg-primary-600 text-white rounded-md text-[7px] font-black uppercase tracking-widest leading-none shrink-0 shadow-sm shadow-primary-200">
                                        {user?.plan || 'BASIC'}
                                    </span>
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-tight">{user?.role}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-black text-xl shrink-0 shadow-sm">
                                {user?.name.charAt(0)}
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={handleLogout}
                        title={isCollapsed ? "Sign Out" : ""}
                        className={clsx(
                            "flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all active:scale-95 group",
                            isCollapsed ? "justify-center" : "justify-start"
                        )}
                    >
                        <LogOut size={22} className="group-hover:-translate-x-1 transition-transform shrink-0" />
                        {!isCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
