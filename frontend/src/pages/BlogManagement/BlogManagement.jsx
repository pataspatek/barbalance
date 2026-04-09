import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar';
import './BlogManagement.scss';

function BlogManagement() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Check if user is superuser and redirect if not
    useEffect(() => {
        if (user !== undefined && !user?.is_superuser) {
            navigate('/');
        }
    }, [user, navigate]);

    // Show nothing while checking permissions
    if (!user?.is_superuser) {
        return null;
    }

    return (
        <div className="dashboard-layout">
            <DashboardSidebar />
            <div className="dashboard-content">
                <div className="dashboard-inner">
                    <div className="dashboard-header">
                        <h1>Blog Management</h1>
                    </div>

                    <div className="coming-soon">
                        <h2>Coming Soon</h2>
                        <p>Recipe management functionality is being built...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogManagement;
