// publicAxios.js
import axios from "axios";

const publicAxios = axios.create({
  baseURL: "/api",
  withCredentials: false, // no cookies needed for public endpoints
});

export default publicAxios;
