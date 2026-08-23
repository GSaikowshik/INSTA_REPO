import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_BASE_URL = BASE_URL.endsWith('/api/v1') ? BASE_URL : `${BASE_URL.replace(/\/+$/, '')}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Helper to construct request options including Clerk JWT Authorization header.
 * @param {Function} getToken - Clerk's getToken function from useAuth()
 * @returns {Promise<Object>} config object containing headers
 */
export const getAuthHeaders = async (getToken) => {
  try {
    if (typeof getToken === 'function') {
      const token = await getToken();
      if (token) {
        return {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      }
    }
  } catch (err) {
    console.warn('Error retrieving Clerk auth token:', err);
  }
  
  const localToken = localStorage.getItem('token');
  if (localToken) {
    return {
      headers: {
        Authorization: `Bearer ${localToken}`,
      },
    };
  }
  return {};
};

// Request interceptor: Fallback to localStorage token if Authorization header isn't explicitly set
api.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle global 401 Unauthorized errors without forcing redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
