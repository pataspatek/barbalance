import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../utils/Constants';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Call the logout API to blacklist the refresh token
        logoutUser();
    }, []);

    const logoutUser = async () => {
        try {
            const refresh_token = localStorage.getItem(REFRESH_TOKEN);
            
            if (!refresh_token) {
                throw new Error('No refresh token found');
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh: refresh_token,
                }),
            });

        } catch (error) {
            console.warn("[Logout] Server error, clearing session anyway.", error);
        } finally {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            navigate('/login');
        }
    };

    return (
        <div className="logout-container">
            Logout successful. Redirecting to login page...
        </div>
    );
}

export default Logout;



