import React, { createContext, useContext, useState, useEffect } from "react";
import adminApi from "../Services/adminApi";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const storedUser = localStorage.getItem("adminUser");
    if (token && storedUser && storedUser !== "undefined") {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("adminUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await adminApi.post("/auth/login", { email, password });
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminUser", JSON.stringify(data.user));
    setAdminUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdminUser(null);
  };

  // superadmin implicitly has every role's access (mirrors backend authorize())
  const hasRole = (...roles) =>
    !!adminUser && (adminUser.role === "superadmin" || roles.includes(adminUser.role));

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, login, logout, hasRole }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
};

export default AdminAuthContext;
