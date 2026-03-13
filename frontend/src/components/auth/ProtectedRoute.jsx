import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import { Loader2 } from '../../constants/icons';

const ProtectedRoute = ({ children, roles, plans }) => {
    const { user, loading, hasPlan } = useAuth();
    const { hasPermission } = useRole();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-600" size={48} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role check
    if (roles && !hasPermission(roles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Plan check for premium features
    if (plans && plans.length > 0 && !hasPlan(plans[0])) {
        // If it's a premium feature requiring a specific plan, redirect to subscription
        return <Navigate to="/subscription" replace />;
    }

    return children;
};

export default ProtectedRoute;
