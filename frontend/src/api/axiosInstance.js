import axios from 'axios';

// Single-server setup ke liye baseURL ko khali (''') chhod do, 
// taki requests automatically current live domain par jayein.
const api = axios.create({
  baseURL: '', 
});

// Har request ke sath JWT token attach karne ke liye interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;