import axios from 'axios';

// Create axios instance pointing to our local backend
const API = axios.create({ baseURL: '/api' });

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userInfo') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// ─── Portfolios ──────────────────────────────────
export const getPortfolios = () => API.get('/portfolio');
export const getPortfolioById = (id) => API.get(`/portfolio/${id}`);
export const createPortfolio = (data) => API.post('/portfolio', data);
export const updatePortfolio = (id, data) => API.put(`/portfolio/${id}`, data);
export const deletePortfolio = (id) => API.delete(`/portfolio/${id}`);

// ─── Feedback ────────────────────────────────────
export const getFeedback = (portfolioId) => API.get(`/feedback/${portfolioId}`);
export const submitFeedback = (portfolioId, data) => API.post(`/feedback/${portfolioId}`, data);

// ─── Jobs ────────────────────────────────────────
export const getJobs = (params) => API.get('/jobs', { params });

