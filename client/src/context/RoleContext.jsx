import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const { user } = useAuth();

    const role = user?.role;

    const isSuperAdmin = () => role === 'SuperAdmin';
    const isOwner = () => role === 'PharmacyOwner';
    const isPharmacist = () => role === 'Pharmacist';
    const isStaff = () => role === 'Staff';

    const hasPermission = (allowedRoles) => {
        if (!role) return false;
        if (role === 'SuperAdmin') return true;
        return allowedRoles.includes(role);
    };

    return (
        <RoleContext.Provider value={{
            role,
            isSuperAdmin,
            isOwner,
            isPharmacist,
            isStaff,
            hasPermission
        }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
};
