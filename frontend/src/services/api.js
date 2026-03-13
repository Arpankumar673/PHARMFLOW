import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Global error handler utility
export const handleApiError = (error) => {
    // If status is 403, it means a plan restriction
    if (error.response && error.response.status === 403) {
        console.warn('Subscription Plan Restriction:', error.response.data.message);
        return {
            isLocked: true,
            message: error.response.data.message || 'Upgrade plan to access this feature',
            data: []
        };
    }

    // Otherwise, throw original error or return a generic failure
    throw error;
};

export default api;
