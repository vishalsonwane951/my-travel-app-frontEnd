import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext.jsx";

const ProfileDropdown = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  const displayName = user?.name || user?.email?.split("@")[0] || "Traveller";
  const displayEmail = user?.email || "";

  const menuItems = [
    { icon: "👤", label: "My Profile", path: "/profile" },
    { icon: "🗺️", label: "My Bookings", path: "/bookings" },
    { icon: "❤️", label: "Saved Packages", path: "/saved" },
    { icon: "📋", label: "My Enquiries", path: "/enquiries" },
    { icon: "⚙️", label: "Account Settings", path: "/settings" },
    { icon: "🎁", label: "Refer & Earn", path: "/refer" },
    { icon: "🆘", label: "Support", path: "/support" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');

        .pdd-root {
          position: relative;
          font-family: 'Sora', sans-serif;
        }

        /* ── Avatar trigger ── */
        .pdd-trigger {
        cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer; padding: 4px 6px 4px 4px;
          border-radius: 50px; transition: background 0.2s ease;
        }
        .pdd-trigger:hover { background: rgba(61,82,160,0.08); }

        .pdd-avatar {
        cusror: pointer;
          width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #3D52A0 0%, #6475C7 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.78rem; font-weight: 600; color: white; letter-spacing: 0.04em;
          box-shadow: 0 2px 8px rgba(61,82,160,0.3);
          overflow: hidden; position: relative;
        }
        .pdd-avatar img {
          width: 100%; height: 100%; object-fit: cover;
          position: absolute; inset: 0;
        }

        .pdd-trigger-name {
          font-size: 0.84rem; font-weight: 500; color: inherit;
          max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .pdd-trigger-chevron {
          font-size: 0.6rem; opacity: 0.5; margin-left: 2px;
          transition: transform 0.25s ease;
          display: inline-block; color: inherit;
        }
        .pdd-trigger-chevron.open { transform: rotate(180deg); opacity: 0.9; }

        /* ── Dropdown panel ── */
        .pdd-panel {
          position: absolute; top: calc(100% + 12px); right: 0; width: 270px;
          background: white; border-radius: 16px;
          box-shadow: 0 24px 56px rgba(15,23,42,0.14), 0 4px 16px rgba(15,23,42,0.06);
          border: 1px solid rgba(15,23,42,0.08);
          opacity: 0; visibility: hidden; transform: translateY(8px) scale(0.97);
          transform-origin: top right;
          transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s;
          z-index: 2000; overflow: hidden;
        }
        .pdd-panel.open {
          opacity: 1; visibility: visible; transform: translateY(0) scale(1);
        }

        /* Panel header */
        .pdd-head {
          padding: 16px 18px 14px;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
          display: flex; align-items: center; gap: 12px;
          border-bottom: 1px solid rgba(201,168,76,0.15);
        }
        .pdd-head-avatar {
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #3D52A0, #6475C7);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem; font-weight: 600; color: white;
          border: 2px solid rgba(201,168,76,0.4);
          overflow: hidden; position: relative;
        }
        .pdd-head-avatar img {
          width: 100%; height: 100%; object-fit: cover;
          position: absolute; inset: 0;
        }
        .pdd-head-info { flex: 1; min-width: 0; }
        .pdd-head-name {
          font-size: 0.9rem; font-weight: 600; color: white;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pdd-head-email {
          font-size: 0.72rem; color: rgba(255,255,255,0.5);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;
        }
        .pdd-head-badge {
          display: flex; align-items: center; gap: 4px; margin-top: 4px;
          background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3);
          border-radius: 20px; padding: 2px 8px; width: fit-content;
        }
        .pdd-head-badge span { font-size: 0.64rem; color: #C9A84C; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }

        /* Menu items */
        .pdd-body { padding: 8px; }
        .pdd-item {
          display: flex; align-items: center; gap: 10px; padding: 9px 10px;
          border-radius: 10px; color: #1e293b; text-decoration: none;
          font-size: 0.855rem; font-weight: 500;
          transition: background 0.18s, color 0.18s, transform 0.18s;
          cursor: pointer; background: none; border: none;
          width: 100%; text-align: left; font-family: 'Sora', sans-serif;
        }
        .pdd-item:hover { background: #f1f5ff; color: #3D52A0; transform: translateX(2px); }
        .pdd-item-icon {
          width: 32px; height: 32px; border-radius: 9px; background: #f8fafc;
          display: flex; align-items: center; justify-content: center; font-size: 0.9rem;
          flex-shrink: 0; transition: transform 0.18s;
        }
        .pdd-item:hover .pdd-item-icon { transform: scale(1.1); }
        .pdd-item-label { flex: 1; }
        .pdd-item-arrow { font-size: 0.65rem; opacity: 0; color: #3D52A0; transition: opacity 0.18s; }
        .pdd-item:hover .pdd-item-arrow { opacity: 1; }

        .pdd-divider { height: 1px; background: #f1f5f9; margin: 6px 8px; }

        /* Logout */
        .pdd-logout {
          display: flex; align-items: center; gap: 10px; padding: 9px 10px;
          border-radius: 10px; color: #ef4444;
          font-size: 0.855rem; font-weight: 500;
          transition: background 0.18s;
          cursor: pointer; background: none; border: none;
          width: 100%; text-align: left; font-family: 'Sora', sans-serif;
        }
        .pdd-logout:hover { background: #fff1f1; }
        .pdd-logout-icon {
          width: 32px; height: 32px; border-radius: 9px; background: #fff1f1;
          display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0;
        }

        /* Footer strip */
        .pdd-foot {
          padding: 10px 18px; border-top: 1px solid #f1f5f9;
          background: #fafbff;
          display: flex; align-items: center; justify-content: center; gap: 16px;
        }
        .pdd-foot a { font-size: 0.72rem; color: #94a3b8; text-decoration: none; transition: color 0.18s; }
        .pdd-foot a:hover { color: #3D52A0; }
      `}</style>

      <div className="pdd-root" ref={ref}>
        {/* Trigger button */}
        <button className="pdd-trigger" onClick={() => setOpen(v => !v)}>
          <div className="pdd-avatar">
            {user?.photoURL
              ? <img src={user.photoURL} alt={displayName} />
              : initials
            }
          </div>
          <span className="pdd-trigger-name">{displayName.split(" ")[0]}</span>
          <span className={`pdd-trigger-chevron ${open ? "open" : ""}`}>▼</span>
        </button>

        {/* Dropdown panel */}
        <div className={`pdd-panel ${open ? "open" : ""}`}>

          {/* Header */}
          <div className="pdd-head">
            <div className="pdd-head-avatar">
              {user?.photoURL
                ? <img src={user.photoURL} alt={displayName} />
                : initials
              }
            </div>
            <div className="pdd-head-info">
              <div className="pdd-head-name">{displayName}</div>
              <div className="pdd-head-email">{displayEmail}</div>
              <div className="pdd-head-badge">
                <span>✦</span>
                <span>Explorer Member</span>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="pdd-body">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="pdd-item"
                onClick={() => setOpen(false)}
              >
                <span className="pdd-item-icon">{item.icon}</span>
                <span className="pdd-item-label">{item.label}</span>
                <span className="pdd-item-arrow">›</span>
              </Link>
            ))}

            <div className="pdd-divider" />

            <button className="pdd-logout" onClick={handleLogout}>
              <span className="pdd-logout-icon">🚪</span>
              Sign Out
            </button>
          </div>

          {/* Footer */}
          <div className="pdd-foot">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/help">Help</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;