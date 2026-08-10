import axios from "axios";
import dotenv from 'dotenv'

const api = axios.create({
  // baseURL:'http://localhost:5000/api',  // https://my-travel-app-backend-6.onrender.com/api
  baseURL:'https://my-travel-app-backend-6.onrender.com/api',
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
