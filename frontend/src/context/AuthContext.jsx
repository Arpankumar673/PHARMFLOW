import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkLoggedIn = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await api.get('/auth/profile');
            setUser(res.data.data);
        } catch (err) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLoggedIn();
    }, []);

    const refreshUser = async () => {
        try {
            const res = await api.get('/auth/profile');
            setUser(res.data.data);
        } catch (err) {
            console.error('Failed to refresh user', err);
        }
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const setToken = (token) => {
        localStorage.setItem('token', token);
        checkLoggedIn();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isSuperAdmin = user?.role === 'SuperAdmin';
    const isOwner = user?.role === 'PharmacyOwner' || user?.role === 'SuperAdmin';
    const isPharmacist = user?.role === 'Pharmacist' || isOwner;
    const isStaff = user?.role === 'Staff' || isPharmacist;

    const hasPlan = (required) => {
        if (isSuperAdmin) return true;
        
        // Check active status and expiration
        const isExpired = user?.subscriptionExpires && new Date(user.subscriptionExpires) < new Date();
        if (!user?.subscriptionActive || isExpired) return false;

        const levels = {
            BASIC: 1,
            PRO: 2,
            ENTERPRISE: 3
        };

        const userLevel = levels[user?.plan?.toUpperCase()] || 0;
        const requiredLevel = levels[required?.toUpperCase()] || 0;

        return userLevel >= requiredLevel;
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            setToken,
            logout,
            refreshUser,
            isSuperAdmin,
            isOwner,
            isPharmacist,
            isStaff,
            hasPlan
        }}>
            {children}
        </AuthContext.Provider>
    );
};
