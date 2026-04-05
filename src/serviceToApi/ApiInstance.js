import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.code === "ERR_NETWORK" || !error.response) {
//       window.dispatchEvent(new CustomEvent("SERVER_DOWN_ERROR"));
//     }

//     return Promise.reject(error);
//   },
// );

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
