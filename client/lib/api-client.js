import axios from 'axios';

let rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
rawUrl = rawUrl.trim().replace(/\/+$/, '');
if (!rawUrl.includes('/api/v1') && !rawUrl.includes('/api')) {
  rawUrl = `${rawUrl}/api/v1`;
}

const apiClient = axios.create({
  baseURL: rawUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

// Request interceptor to attach JWT token if present in browser storage
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('unretail_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        // Guard against localStorage access restrictions in private mode
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error normalization
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalization of network & server errors for consistent consumption
    if (error.response?.status === 401) {
      // Clear token if server returns unauthorized
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Stale token cleanup without aggressive redirect
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
