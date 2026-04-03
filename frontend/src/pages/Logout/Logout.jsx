import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../utils/AuthContext';

function Logout() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        // Call the logout API to blacklist the refresh token
        logout();
        navigate('/login');
    }, [logout, navigate]);

    return (
        <div className="logout-container">
            Logout successful. Redirecting to login page...
        </div>
    );
}

export default Logout;



