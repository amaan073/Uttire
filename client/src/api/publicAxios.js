//for api request that dont need credentials(cookies)
import axios from "axios";

const publicAxios = axios.create({
  baseURL: "/api",
  withCredentials: false, // no cookies needed for public endpoints
});

// Request interceptor → check online status before making requests
publicAxios.interceptors.request.use(
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

// Response interceptor → handle network errors
publicAxios.interceptors.response.use(
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

export default publicAxios;
