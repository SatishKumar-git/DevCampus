import axios from 'axios';

// Automatically detect karo ki local chal raha hai ya production (Render)
const baseURL = import.meta.env.PROD ? '' : 'http://localhost:5000';

const api = axios.create({
  baseURL: baseURL,
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