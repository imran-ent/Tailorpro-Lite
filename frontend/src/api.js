import axios from 'axios';

const api = axios.create({
  baseURL: 'mongodb+srv://TailorPro:admin123@cluster0.opezko1.mongodb.net/?appName=Cluster0',
});

// Interceptor to inject JWT token in Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
