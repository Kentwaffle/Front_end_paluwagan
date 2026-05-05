import axios from "axios";
import { API_ENDPOINTS } from "./ApiEndpoint";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === API_ENDPOINTS.AUTH.REFRESH) {
      console.error("Refresh token failed, stopping loop.");
      // window.location.href = "/auth";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post(API_ENDPOINTS.AUTH.REFRESH);
        return api(originalRequest);
      } catch (refreshError) {
        // window.location.href = "/auth";
        console.error("Refresh token failed, 401");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export const paymentApi = axios.create({
  baseURL: import.meta.env.VITE_PAYMENT_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});

paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
