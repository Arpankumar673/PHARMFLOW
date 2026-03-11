import { useRole } from '../context/RoleContext';
import PharmacyDashboard from '../components/dashboard/PharmacyDashboard';
import PlatformDashboard from '../components/dashboard/PlatformDashboard';

const Dashboard = () => {
    const { isSuperAdmin } = useRole();

    return (
        <div className="w-full">
            {isSuperAdmin() ? (
                <PlatformDashboard />
            ) : (
                <PharmacyDashboard />
            )}
        </div>
    );
};

export default Dashboard;
