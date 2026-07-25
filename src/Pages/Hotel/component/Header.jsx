import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "../../../Components/ProfileDropdown/ProfileDropdown";
import { AuthContext } from "../../../Context/AuthContext";
import LoginRegister from "../../LoginRegister";

function HeaderStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

      :root {
        --ink: #10192A;
        --ink-line: rgba(251, 246, 236, 0.14);
        --gold: #C9A227;
        --gold-bright: #E4C158;
        --text-on-ink: #F4EFE2;
        --text-on-ink-muted: #9FAAC0;
        --font-display: 'Fraunces', Georgia, serif;
        --font-body: 'Inter', -apple-system, sans-serif;
      }

      .sf-header {
        position: sticky;
        top: 0;
        z-index: 50;
        margin: 0 -20px 0px;
        width: calc(100% + 40px);
        background: var(--ink);
        border-bottom: 1px solid var(--ink-line);
      }
      .sf-header-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 12px 28px;
        display: flex;
        align-items: center;
        gap: 32px;
      }

      /* ---- Logo badge ------------------------------------------- */
      .sf-logo {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        flex-shrink: 0;
        line-height: 0;
      }
      .sf-logo-badge {
        display: inline-flex;
        align-items: center;
        gap: 1px;
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 17px;
        letter-spacing: -0.01em;
        color: var(--ink);
        background: linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 100%);
        padding: 8px 12px 8px 14px;
        border-radius: 10px;
      }
      .sf-logo-v {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        margin: 0 2px;
        border-radius: 6px;
        background: var(--ink);
        color: var(--gold-bright);
        font-size: 13px;
        font-weight: 700;
      }

      /* ---- Nav ---------------------------------------------------- */
      .sf-nav {
        display: flex;
        align-items: center;
        gap: 4px;
        flex: 1;
      }
      .sf-nav-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-body);
        font-size: 13.5px;
        font-weight: 600;
        color: var(--text-on-ink-muted);
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        padding: 8px 10px 10px;
        cursor: pointer;
        transition: color 0.15s ease;
      }
      .sf-nav-item:hover:not(:disabled) { color: var(--text-on-ink); }
      .sf-nav-item:disabled { cursor: default; opacity: 0.5; }

      .sf-nav-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        border-radius: 8px;
        flex-shrink: 0;
      }
      .sf-nav-icon svg { width: 15px; height: 15px; }

      /* Muted per-item accent chips, inactive state only. */
      .sf-nav-item[data-key="flights"] .sf-nav-icon { background: rgba(122, 168, 231, 0.16); color: #8FB6E8; }
      .sf-nav-item[data-key="stays"] .sf-nav-icon { background: rgba(201, 162, 39, 0.16); color: var(--gold-bright); }
      .sf-nav-item[data-key="trains"] .sf-nav-icon { background: rgba(122, 200, 175, 0.16); color: #7FCBB0; }
      .sf-nav-item[data-key="buses"] .sf-nav-icon { background: rgba(214, 148, 122, 0.16); color: #E0A488; }
      .sf-nav-item[data-key="more"] .sf-nav-icon { background: rgba(159, 170, 192, 0.14); color: var(--text-on-ink-muted); }

      .sf-nav-item.active {
        color: var(--text-on-ink);
        border-bottom-color: var(--gold);
      }
      .sf-nav-item.active .sf-nav-icon {
        background: var(--text-on-ink);
        color: var(--ink);
      }

      .sf-nav-chevron { width: 12px !important; height: 12px !important; margin-left: -2px; }

      /* ---- Right-side actions ------------------------------------ */
      .sf-header-actions {
        display: flex;
        align-items: center;
        gap: 22px;
        flex-shrink: 0;
      }
      .sf-header-link {
        display: flex;
        align-items: center;
        gap: 7px;
        font-family: var(--font-body);
        font-size: 13.5px;
        font-weight: 600;
        color: var(--text-on-ink-muted);
        background: none;
        border: none;
        cursor: pointer;
        white-space: nowrap;
        transition: color 0.15s ease;
      }
      .sf-header-link svg { width: 16px; height: 16px; }
      .sf-header-link:hover { color: var(--text-on-ink); }

      .sf-header-login {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-body);
        font-size: 13.5px;
        font-weight: 700;
        color: var(--text-on-ink);
        background: none;
        border: none;
        cursor: pointer;
        white-space: nowrap;
      }
      .sf-header-login-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--gold);
        color: var(--ink);
      }
      .sf-header-login-avatar svg { width: 15px; height: 15px; }
      .sf-header-login:hover .sf-header-login-avatar { background: var(--gold-bright); }

      @media (max-width: 900px) {
        .sf-nav-label { display: none; }
        .sf-header-link span:not(.sf-header-link-icon) { display: none; }
      }
      @media (max-width: 640px) {
        .sf-header { margin: 0 -12px 24px; width: calc(100% + 24px); }
        .sf-header-inner { padding: 10px 16px; gap: 14px; }
        .sf-logo-badge { font-size: 14px; padding: 7px 10px 7px 12px; }
      }
    `}</style>
  );
}

const NAV_ITEMS = [
  {
    key: "flights",
    label: "Flights",
    path: "#",
    active: false,
    disabled: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M2 12l20-7-7 20-3-8-8-3 8 8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "stays",
    label: "Hotels",
    path: "/hotel",
    active: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 21V8l9-5 9 5v13" strokeLinejoin="round" />
        <path d="M8 21v-7h8v7" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "trains",
    label: "Trains",
    path: "/Trains",
    active: false,
    disabled: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="5" y="3" width="14" height="14" rx="3" />
        <circle cx="8.5" cy="14" r="0.5" fill="currentColor" />
        <circle cx="15.5" cy="14" r="0.5" fill="currentColor" />
        <path d="M7 21l2-3M17 21l-2-3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "buses",
    label: "Buses",
    path: "#",
    active: false,
    disabled: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="5" width="18" height="12" rx="2.5" />
        <path d="M3 12h18" />
        <circle cx="7.5" cy="19" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="19" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "more",
    label: "More",
    path: "#",
    active: false,
    disabled: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    chevron: true,
  },
];

const OFFERS_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path
      d="M20.59 13.41L11 3.83A2 2 0 009.59 3.2H4a1 1 0 00-1 1v5.59a2 2 0 00.59 1.41l9.58 9.59a2 2 0 002.83 0l4.59-4.59a2 2 0 000-2.83z"
      strokeLinejoin="round"
    />
    <circle cx="7.5" cy="7.5" r="1.25" />
  </svg>
);

const SUPPORT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path
      d="M12 3a9 9 0 00-9 9v4.5A2.5 2.5 0 005.5 19H7v-6H4.5a7.5 7.5 0 0115 0H17v6h1.5a2.5 2.5 0 002.5-2.5V12a9 9 0 00-9-9z"
      strokeLinejoin="round"
    />
    <rect x="4.5" y="13" width="2.5" height="4.5" rx="1" />
    <rect x="17" y="13" width="2.5" height="4.5" rx="1" />
  </svg>
);

const CHEVRON_ICON = (
  <svg
    className="sf-nav-chevron"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AVATAR_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0115 0" strokeLinecap="round" />
  </svg>
);

export default function HotelHeader() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  return (
    <>
      <HeaderStyles />
      <header className="sf-header">
        <div className="sf-header-inner">
          <button
            type="button"
            className="sf-logo"
            onClick={() => navigate("/")}
          >
            <span className="sf-logo-badge">
              Desi<span className="sf-logo-v">V</span>Desi
            </span>
          </button>

          <nav className="sf-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                data-key={item.key}
                className={`sf-nav-item${item.active ? " active" : ""}`}
                disabled={item.disabled}
                onClick={() =>
                  !item.disabled && item.path !== "#" && navigate(item.path)
                }
                title={
                  item.disabled ? `${item.label} — coming soon` : item.label
                }
              >
                <span className="sf-nav-icon">{item.icon}</span>
                <span className="sf-nav-label">{item.label}</span>
                {item.chevron && CHEVRON_ICON}
              </button>
            ))}
          </nav>

          <div className="sf-header-actions">
            <button type="button" className="sf-header-link">
              <span className="sf-header-link-icon">{OFFERS_ICON}</span>
              <span>Offers</span>
            </button>
            <button type="button" className="sf-header-link">
              <span className="sf-header-link-icon">{SUPPORT_ICON}</span>
              <span>Customer Service</span>
            </button>
            {!user ? (
              <button
                type="button"
                className="sf-header-login"
                onClick={() => {setShowAuth(true)}}
              >
                <span className="sf-header-login-avatar">{AVATAR_ICON}</span>
                Log in/Sign up
              </button>
            ) : (
              <ProfileDropdown />
            )}
          </div>
        </div>
        {showAuth && <LoginRegister onClose={() => setShowAuth(false)} />}
      </header>
    </>
  );
}
