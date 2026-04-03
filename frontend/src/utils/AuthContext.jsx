import { createContext, useEffect, useState } from "react";
import getValidToken from "./TokenValidation";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./Constants";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    // ---------------------------------------------
    // Load user info from the server if there is a valid token
    // ---------------------------------------------
    const loadUser = async () => {
        const token = await getValidToken();

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to load user");
            }

            const data = await response.json();
            setUser(data.user);
        } catch (error) {
            console.error("Failed to load user:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Login function - kept as is
    const login = async (credentials) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Invalid username or password");
        }

        // Save tokens in localStorage
        localStorage.setItem(ACCESS_TOKEN, data.access);
        localStorage.setItem(REFRESH_TOKEN, data.refresh);

        // After login, load fresh user info from /me endpoint
        await loadUser();
    };

    // Logout function - kept as is
    const logout = async () => {
        const refresh = localStorage.getItem(REFRESH_TOKEN);
        setUser(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refresh }),
            });
            console.info("[Logout] Server session terminated.");
        } catch (error) {
            console.warn("[Logout] Server error, clearing session anyway.", error);
        } finally {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
        }
    };

    // Provide state and functions to the rest of the app
    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                loadUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
