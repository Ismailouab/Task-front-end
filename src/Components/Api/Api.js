import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', 
  timeout: 30000, // 30 seconds instead of 10
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'Authorization': 'Bearer your-token' 
  }
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - redirect to login');
    }
    return Promise.reject(error);
  }
);

export default api;