import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { token, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  connectWallet: (walletAddress) => api.post('/auth/wallet', { walletAddress }),
  disconnectWallet: () => api.delete('/auth/wallet')
};

// KYC API
export const kycAPI = {
  createSession: (data) => api.post('/kyc/session', data),
  getSession: (sessionId) => api.get(`/kyc/session/${sessionId}`),
  uploadDocument: (sessionId, formData) => api.post(`/kyc/session/${sessionId}/document`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  completeLiveness: (sessionId, data) => api.post(`/kyc/session/${sessionId}/liveness`, data),
  completeSession: (sessionId) => api.post(`/kyc/session/${sessionId}/complete`),
  getStatus: () => api.get('/kyc/status')
};

// Proofs API
export const proofsAPI = {
  list: (params) => api.get('/proofs', { params }),
  getTypes: () => api.get('/proofs/types'),
  getById: (id) => api.get(`/proofs/${id}`),
  generate: (data) => api.post('/proofs/generate', data),
  verify: (data) => api.post('/proofs/verify', data),
  update: (id, data) => api.put(`/proofs/${id}`, data),
  delete: (id) => api.delete(`/proofs/${id}`),
  recordUsage: (id, data) => api.post(`/proofs/${id}/use`, data),
  export: (id) => api.get(`/proofs/${id}/export`)
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  getStats: () => api.get('/users/stats'),
  updateSettings: (data) => api.put('/users/settings', data),
  deleteAccount: (data) => api.delete('/users/account', { data })
};

export default api;
