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
            {/* Responsive Sidebar Drawer */}
            <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            {/* Mobile Header / Navbar for Small Screens */}
            <header className="lg:hidden bg-white border-b border-pharmacy-100 px-6 py-4 flex items-center justify-between sticky top-0 z-[45] safe-area-top shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-100">P</div>
                    <span className="text-xl font-black font-['Outfit'] tracking-tight">PharmFlow</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 bg-primary-50 rounded-xl text-primary-600 active:scale-90 transition-transform"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen overflow-y-auto bg-pharmacy-50 relative">
                <div className="p-4 lg:p-10 pb-32 lg:pb-10 max-w-[1600px] mx-auto animate-fade-in mb-10 lg:mb-0">
                    <ErrorBoundary>
                        <Outlet />
                    </ErrorBoundary>
                </div>
            </main>

            {/* Mobile Quick Navigation Bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-pharmacy-50 flex items-center justify-around px-4 py-3 z-[60] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] safe-area-bottom">
                {mobileNavItems.filter(item => item.show).map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center gap-1 transition-all duration-300 px-4 py-2 rounded-2xl",
                            isActive ? "text-primary-600 bg-primary-50 scale-105" : "text-pharmacy-400"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <style>{`
                .safe-area-bottom {
                    padding-bottom: env(safe-area-inset-bottom, 16px);
                }
                .safe-area-top {
                    padding-top: env(safe-area-inset-top, 12px);
                }
            `}</style>
        </div>
    );
};

export default Layout;
