// Axios instance specifically for session-related requests
// - Uses cookies (to set/remove session cookies)
// - No interceptors (to avoid refresh loops)
import axios from "axios";

const sessionAxios = axios.create({
  baseURL: "/api",
  withCredentials: true, // send HttpOnly cookies
});

export default sessionAxios;
