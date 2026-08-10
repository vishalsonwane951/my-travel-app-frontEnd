import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../Context/AdminAuthContext.jsx";

// <ProtectedAdminRoute roles={['superadmin','finance']}> ... </ProtectedAdminRoute>
// Omit `roles` to allow any authenticated staff member through.
const ProtectedAdminRoute = ({ children, roles = [] }) => {
  const { adminUser, loading, hasRole } = useAdminAuth();

  if (loading) return <div className="admin-loading">Loading…</div>;
  if (!adminUser) return <Navigate to="/admin/login" replace />;
  if (roles.length && !hasRole(...roles)) {
    return (
      <div className="admin-access-denied">
        <h2>Access denied</h2>
        <p>Your role ({adminUser.role}) doesn't have access to this module.</p>
      </div>
    );
  }
  return children;
};

export default ProtectedAdminRoute;
