import axios from 'axios';
import { API_ADDRESS } from 'variables/apiSettings';

const api = axios.create({
  baseURL: API_ADDRESS,
});

// Attach Authorization header from localStorage on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      (config.headers as any) = config.headers || {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
