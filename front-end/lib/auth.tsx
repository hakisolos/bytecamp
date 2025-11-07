
const API_BASE_URL = 'http://localhost:8080/api/auth';

// Store JWT token in localStorage
export const setAuthToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt_token', token);
    }
};

// Get JWT token from localStorage
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('jwt_token');
    }
    return null;
};

// Remove JWT token from localStorage
export const removeAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token');
    }
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
    const token = getAuthToken();
    if (!token) return false;

    try {
        // Decode JWT to check expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
            removeAuthToken();
            return false;
        }

        return true;
    } catch (error) {
        console.error('Invalid token:', error);
        removeAuthToken();
        return false;
    }
};

// Get user info from token
export const getUserFromToken = () => {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.id,
            username: payload.username,
            email: payload.email
        };
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

// Login API call
export const loginUser = async (email: string, password: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store the JWT token
        if (data.jwt_token) {
            setAuthToken(data.jwt_token);
        }

        return { success: true, data };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'An error occurred during login'
        };
    }
};

// Logout function
export const logoutUser = () => {
    removeAuthToken();
    // Redirect to login page
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};

// Fetch user data with authentication
export const fetchUserData = async () => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/getuser`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                removeAuthToken();
                throw new Error('Session expired. Please login again.');
            }
            throw new Error('Failed to fetch user data');
        }

        return await response.json();
    } catch (error: any) {
        throw error;
    }
};