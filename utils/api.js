import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, 
});

// Add Authorization token to all requests
API.interceptors.request.use(
  (config) => {
    // Get token from cookies (where it's stored after login)
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
