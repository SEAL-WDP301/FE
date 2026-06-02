import axios, { AxiosHeaders, AxiosError, InternalAxiosRequestConfig } from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Variables for refresh token queue
let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers = AxiosHeaders.from(config.headers);
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Extended type to track retries
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Don't intercept refresh calls to avoid infinite loops
      if (originalRequest.url?.includes('/auth/refresh')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          window.dispatchEvent(new Event('auth-unauthorized'));
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If refreshing is already in progress, put subsequent requests into a queue
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
            originalRequest.headers.set('Authorization', `Bearer ${token}`);
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Because withCredentials is true, the refresh_token HttpOnly cookie is sent automatically
        const res = await axiosClient.post('/auth/refresh');
        const newAccessToken = res.data?.data?.accessToken;

        if (newAccessToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', newAccessToken);
          }
          
          originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
          originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
          
          processQueue(null, newAccessToken);
          
          // Retry the original request
          return axiosClient(originalRequest);
        } else {
          throw new Error('Refresh token response missing access token');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // If refresh fails, log the user out
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          window.dispatchEvent(new Event('auth-unauthorized'));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
