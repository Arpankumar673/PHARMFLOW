import { Outlet, Navigate, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import ErrorBoundary from '../common/ErrorBoundary';
import {
    LayoutDashboard,
    Pill,
    ShoppingCart,
    BarChart3,
    Zap,
    Menu
} from '../../constants/icons';
import { useState } from 'react';
import clsx from 'clsx';

const Layout = () => {
    const { user, loading, isOwner, isPharmacist, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pharmacy-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const mobileNavItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/', show: true },
        { name: 'Inventory', icon: Pill, path: '/inventory', show: true },
        { name: 'Billing', icon: ShoppingCart, path: '/billing', show: true },
        { name: 'Reports', icon: BarChart3, path: '/reports', show: isPharmacist || isOwner },
        { name: 'Subscription', icon: Zap, path: '/subscription', show: isOwner },
    ];

    return (
        <div className="min-h-screen bg-pharmacy-50 flex flex-col lg:flex-row overflow-hidden relative">
            {/* Sidebar Component */}
            <Sidebar 
                isOpen={mobileMenuOpen} 
                onClose={() => setMobileMenuOpen(false)} 
                isCollapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            {/* Mobile Header */}
            <header className="lg:hidden bg-white border-b border-pharmacy-100 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-[45] safe-area-top shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-600 rounded-lg md:rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-primary-100">P</div>
                    <span className="text-lg md:text-xl font-black font-['Outfit'] tracking-tight">PharmFlow</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 md:p-3 bg-primary-50 rounded-xl text-primary-600 active:scale-90 transition-transform"
                    >
                        <Menu size={20} className="md:w-6 md:h-6" />
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <main className={clsx(
                "flex-1 min-h-screen overflow-y-auto bg-pharmacy-50 relative transition-all duration-300",
                sidebarCollapsed ? "lg:ml-20" : "lg:ml-[260px]"
            )}>
                {/* Responsive Content Wrapper */}
                <div className="px-4 lg:px-6 py-6 pb-24 md:pb-32 lg:pb-10 max-w-[1600px] mx-auto animate-fade-in w-full overflow-x-hidden">
                    <div className="relative">
                        <ErrorBoundary>
                            <Outlet />
                        </ErrorBoundary>
                    </div>
                </div>
            </main>

            {/* Mobile Quick Navigation Bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-100 flex items-center justify-around px-2 py-3 z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] safe-area-bottom">
                {mobileNavItems.filter(item => item.show).map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center gap-1 transition-all duration-300 py-2 rounded-2xl flex-1 max-w-[80px]",
                            isActive ? "text-primary-600 bg-primary-50/50" : "text-slate-400"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter md:tracking-widest truncate w-full text-center px-1">
                                    {item.name}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <style>{`
                .safe-area-bottom {
                    padding-bottom: calc(env(safe-area-inset-bottom, 16px) + 8px);
                }
                .safe-area-top {
                    padding-top: env(safe-area-inset-top, 12px);
                }
            `}</style>
        </div>
    );
};

export default Layout;
