import axios from 'axios';


const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        if (!config.headers) config.headers = {} as any;
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: handle 401 unauthorized to trigger logout
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        // Let components handle the redirect or global state update
        window.dispatchEvent(new Event('auth-unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);
