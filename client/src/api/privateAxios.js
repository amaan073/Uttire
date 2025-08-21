import axios from "axios";

// Create private axios instance
const privateAxios = axios.create({
  baseURL: "/api",
  withCredentials: true, // send HttpOnly cookies automatically
});

// Response interceptor → handle 401 errors (expired access token)
privateAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // avoid infinite loop of sending refresh requests

      //refresh token process
      try {
        // Call refresh endpoint (cookies handle auth)
        await axios.get("/api/users/refresh",{ withCredentials: true });

        // Retry the original request
        return privateAxios(originalRequest);
      } catch (refreshError) {
        console.warn("Refresh token failed. Redirecting to login.");
        console.log(refreshError);
        window.location.replace("/login");
      }
    }

    return Promise.reject(error); //after the interceptor intercepts the axios response we need to pass or return something either return response or return promise.rejection so the response is complete and the axios request is not hanging forever, even if the user is redirected
  }
);

export default privateAxios;
