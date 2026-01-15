// Axios instance specifically for session-related requests
// - Uses cookies (to set/remove session cookies)
// - No refresh interceptors (to avoid refresh loops)
// - Only network/offline check interceptor
import axios from "axios";

const sessionAxios = axios.create({
  baseURL: "/api",
  withCredentials: true, // send HttpOnly cookies
});

// Request interceptor → check online status before making requests
sessionAxios.interceptors.request.use(
  (config) => {
    // Check if user is offline
    if (!navigator.onLine) {
      return Promise.reject({
        message: "You are offline. Please check your internet connection.",
        code: "OFFLINE_ERROR",
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor → handle network errors only (no refresh logic)
sessionAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (offline, timeout, etc.)
    if (!error?.response && error?.request) {
      // Request was made but no response received (network error)
      if (!navigator.onLine) {
        error.code = "OFFLINE_ERROR";
      } else {
        error.code = "NETWORK_ERROR";
      }
    }
    return Promise.reject(error);
  }
);

export default sessionAxios;
