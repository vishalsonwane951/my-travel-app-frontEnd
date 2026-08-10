import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../Context/AdminAuthContext.jsx";
import "./Admin.css";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", roles: [] },
  { to: "/admin/enquiries", label: "Enquiries & Bookings", roles: ["operations", "sales"] },
  { to: "/admin/finance", label: "Finance & Accounting", roles: ["finance"] },
  { to: "/admin/packages", label: "Packages / Destinations", roles: ["content", "operations"] },
  { to: "/admin/domestic-content", label: "Domestic / State Content", roles: ["content", "operations"] },
  { to: "/admin/hotels", label: "Hotel Inventory", roles: ["operations"] },
  { to: "/admin/irctc", label: "Train / IRCTC Oversight", roles: ["operations", "support"] },
  { to: "/admin/moderation", label: "Reviews & Q&A", roles: ["content", "support"] },
  { to: "/admin/customers", label: "Customers", roles: ["operations", "sales", "support"] },
  { to: "/admin/marketing", label: "Marketing", roles: ["sales", "content"] },
  { to: "/admin/reports", label: "Reports & BI", roles: ["operations", "finance", "sales"] },
  { to: "/admin/blog", label: "Content / Blog / SEO", roles: ["content"] },
  { to: "/admin/notifications", label: "Notification Center", roles: ["sales", "support"] },
  { to: "/admin/support", label: "Support / Helpdesk", roles: ["support", "operations"] },
  { to: "/admin/ai-trips", label: "AI Trip Planner Console", roles: ["operations", "content"] },
  { to: "/admin/team", label: "Roles & Team", roles: ["superadmin"] },
  { to: "/admin/audit-log", label: "Audit Log", roles: ["superadmin"] },
  { to: "/admin/settings", label: "Settings", roles: ["superadmin"] },
];

const AdminLayout = () => {
  const { adminUser, logout, hasRole } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">Desivdesi Admin</div>
        <nav>
          {NAV.filter((item) => item.roles.length === 0 || hasRole(...item.roles)).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => "admin-nav-link" + (isActive ? " active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div />
          <div className="admin-topbar-user">
            <span>{adminUser?.name}</span>
            <span className="admin-role-badge">{adminUser?.role}</span>
            <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
