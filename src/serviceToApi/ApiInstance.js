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
    const isRefreshRequest = originalRequest.url.includes(
      "/api/auth/refresh-token",
    );

    if (error.response?.status === 401) {
      if (isRefreshRequest) {
        console.error("Refresh token failed. Redirecting...");
        sessionStorage.removeItem("user");
        window.location.href = "/auth";
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await axios.post(
            API_ENDPOINTS.AUTH.REFRESH,
            {},
            { withCredentials: true },
          );
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          sessionStorage.removeItem("user");
          return Promise.reject(refreshError);
        }
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
