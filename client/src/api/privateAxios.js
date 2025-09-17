//for api request for proctected routes
import axios from "axios";

const privateAxios = axios.create({
  baseURL: "/api",
  withCredentials: true, // send HttpOnly cookies automatically
});

let refreshPromise = null; // queue system, in which multiple req made with privateAxios while the access token is expired, will only wait for one req to get the new access token not all of them and retry all of them after the refrs is successful

// Response interceptor → handle 401 errors (expired access token)
privateAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // avoid infinite loop of sending refresh requests (interceptor stopper)

      // when multiple private Axios req gets 401 and tries this logic below, like 3 req at at time,
      // 1st req has refersh promise as null so it will be able to access the logic of refersh token
      // and 1st time refrshPromise will get populated so other 2 req wont access this logic of if below
      // instaed will wait for there for refershPromise to be completed below at await refreshPromise
      // effectively calling refresh only one time and all privateAxiso reqs retries at same time

      if (!refreshPromise) {
        refreshPromise = axios
          .post("/api/users/refresh", {}, { withCredentials: true })
          .finally(() => {
            refreshPromise = null; // reset to null so user can retry 2nd or more times for refresh access token( if he stays on the site for more then access token life againn and again)
          });
      }

      try {
        await refreshPromise; // if this fails catch block will run the refersh fail logic and redirect to login
        return privateAxios(originalRequest);
      } catch (refreshError) {
        console.warn("Refresh token failed. Redirecting to login.");
        window.location.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); //after the interceptor intercepts the axios response we need to pass or return something either return response or return promise.rejection so the response is complete and the axios request is not hanging forever, even if the user is redirected
  }
);

export default privateAxios;
