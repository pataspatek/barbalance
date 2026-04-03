import { ACCESS_TOKEN, REFRESH_TOKEN } from "./Constants";

/**
 * Verify access token and refresh if necessary.
 * @returns {Promise<string|null>} Valid access token or null if none.
 */
async function getValidToken() {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!accessToken) {
        console.warn("[Token] No access token found.");
        return null;
    }

    // Verify the current access token
    const verifiedToken = await verifyToken(accessToken);
    if (verifiedToken) return verifiedToken;

    // If verification fails, try refreshing
    return await refreshToken();
}

/**
 * Verify access token with the server.
 * @param {string} token 
 * @returns {Promise<string|null>} token if valid, else null
 */
async function verifyToken(token) {
    console.log("[Token] Verifying access token...");
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token/verify/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });

        if (response.ok) {
            console.log("[Token] Access token is valid.");
            return token;
        } else {
            console.warn("[Token] Access token invalid.");
            return null;
        }
    } catch (error) {
        console.error("[Token] Token verification failed:", error);
        return null;
    }
}

/**
 * Attempt to refresh access token using the refresh token.
 * @returns {Promise<string|null>} new access token if successful, else null
 */
async function refreshToken() {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    if (!refresh) {
        console.warn("[Token] No refresh token found. Cannot refresh access token.");
        return null;
    }

    console.log("[Token] Refreshing access token...");

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
        });

        if (!response.ok) {
            console.warn("[Token] Refresh token invalid or expired.");
            return null;
        }

        const data = await response.json();

        // Save rotated tokens
        localStorage.setItem(ACCESS_TOKEN, data.access);
        localStorage.setItem(REFRESH_TOKEN, data.refresh);

        console.log("[Token] Token refreshed successfully.");
        return data.access;

    } catch (error) {
        console.error("[Token] Failed to refresh token:", error);
        return null;
    }
}

export default getValidToken;
