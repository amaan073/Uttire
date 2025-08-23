// publicAxios.js
import axios from "axios";

const publicAxios = axios.create({
  baseURL: "/api",
  withCredentials: false, // no cookies needed for public endpoints
});

export default publicAxios;

//for api request that dont need cookies (access token) but it will be used with credentials true when we need to recieve cookie (like in login.jsx)