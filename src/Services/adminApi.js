import axios from "axios";

const adminApi = axios.create({
  // baseURL: "http://localhost:5000/api/admin",
    baseURL:'https://my-travel-app-backend-6.onrender.com/admin',

  withCredentials: true,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// Separate client for the payment endpoints, which use the *customer* token
// (a customer, not a staff member, pays for their own booking).
export const paymentApi = axios.create({
  baseURL: "http://localhost:5000/api/payments",
  withCredentials: true,
});
paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default adminApi;
