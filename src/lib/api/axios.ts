import axios from 'axios';

const BASE_URL = 'https://server.pgso.bpc-bsis4d.com/public/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decrypt token
            const decryptedToken = atob(token);
            config.headers.Authorization = `Bearer ${decryptedToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('sessionCode');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            
            // Dispatch auth change event
            window.dispatchEvent(new Event('authChange'));
            
            // Redirect to login
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
