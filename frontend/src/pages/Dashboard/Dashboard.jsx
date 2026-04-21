import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';

function Dashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is superuser
        if (!user?.is_superuser) {
            // Redirect to home if not superuser
            navigate('/');
        } else {
            // Redirect to clients management by default
            navigate('/dashboard/clients');
        }
    }, [user, navigate]);
}

export default Dashboard;
