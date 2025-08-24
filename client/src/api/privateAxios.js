//for api request for proctected routes
import axios from "axios";

const privateAxios = axios.create({
  baseURL: "/api",
  withCredentials: true, // send HttpOnly cookies automatically
});

let isRefreshing = false;

// Response interceptor → handle 401 errors (expired access token)
privateAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // avoid infinite loop of sending refresh requests

      //to avoid multiple requests if for example user visits the site initially on /orders tab this causes 2 /users/me and /ordrs both will cause this interceptor to send 2 api requsts for /refresh if access token is expired
      if (!isRefreshing) {
        isRefreshing = true;
        //refresh token process
        try {
          // Call refresh endpoint (cookies handle auth)
          await axios.post("/api/users/refresh", {} , { withCredentials: true });  //using POST for semantic reasons(server state change)

          // Retry the original request
          return privateAxios(originalRequest);
        } catch (refreshError) {
          console.warn("Refresh token failed. Redirecting to login.");
          console.log(refreshError);
          window.location.replace("/login");
        }
      }
    }

    return Promise.reject(error); //after the interceptor intercepts the axios response we need to pass or return something either return response or return promise.rejection so the response is complete and the axios request is not hanging forever, even if the user is redirected
  }
);

export default privateAxios;
