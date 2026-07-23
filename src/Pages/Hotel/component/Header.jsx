import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------
   SHARED HEADER
   Sticky top bar used on every page (search, list, hotel details).
   Kept dependency-free (inline SVG icons, inline styles) so it drops
   into the project without requiring an icon library or the shared
   StayStyles stylesheet to be mounted first.
------------------------------------------------------------------- */

// Scoped styles pulled straight out of StayStyles.jsx (the .sf-header*
// rules, plus the handful of CSS variables + font import they depend
// on). Declaring the same :root vars again here is harmless — StayStyles
// defines identical values, so whichever mounts first "wins" with no
// visual difference.
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
        padding: 14px 28px;
        display: flex;
        align-items: center;
        gap: 28px;
      }
      .sf-logo {
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 21px;
        letter-spacing: 0.01em;
        color: var(--text-on-ink);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        flex-shrink: 0;
      }
      .sf-logo span { color: var(--gold-bright); }
      .sf-nav {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 1;
      }
      .sf-nav-item {
        display: flex;
        align-items: center;
        gap: 7px;
        font-family: var(--font-body);
        font-size: 13.5px;
        font-weight: 600;
        color: var(--text-on-ink-muted);
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        padding: 8px 10px;
        cursor: pointer;
        transition: color 0.15s ease;
      }
      .sf-nav-item svg { width: 17px; height: 17px; }
      .sf-nav-item:hover:not(:disabled) { color: var(--text-on-ink); }
      .sf-nav-item:disabled { cursor: default; opacity: 0.45; }
      .sf-nav-item.active {
        color: var(--gold-bright);
        border-bottom-color: var(--gold);
      }
      .sf-header-actions {
        display: flex;
        align-items: center;
        gap: 22px;
        flex-shrink: 0;
      }
      .sf-header-link {
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
      .sf-header-link:hover { color: var(--text-on-ink); }
      .sf-header-login {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-body);
        font-size: 13.5px;
        font-weight: 700;
        color: var(--ink);
        background: var(--gold);
        border: none;
        border-radius: 999px;
        padding: 8px 16px;
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.15s ease;
      }
      .sf-header-login:hover { background: var(--gold-bright); }

      @media (max-width: 900px) {
        .sf-nav-item span.sf-nav-label { display: none; }
        .sf-header-link { display: none; }
      }
      @media (max-width: 640px) {
        .sf-header { margin: 0 -12px 24px; width: calc(100% + 24px); }
        .sf-header-inner { padding: 12px 16px; gap: 14px; }
        .sf-logo { font-size: 17px; }
      }
    `}</style>
  );
}

const NAV_ITEMS = [
  {
    key: "stays",
    label: "Stays",
    path: "/hotel",
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 21V8l9-5 9 5v13" strokeLinejoin="round" />
        <path d="M8 21v-7h8v7" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "flights",
    label: "Flights",
    path: "#",
    active: false,
    disabled: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 12l20-7-7 20-3-8-8-3 8 8" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "trains",
    label: "Trains",
    path: "/Trains",
    active: true,
    disabled: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="12" rx="2.5" />
        <path d="M3 12h18" />
        <circle cx="7.5" cy="19" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="19" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function HotelHeader() {
  const navigate = useNavigate();

  return (
    <>
      <HeaderStyles />
      <header className="sf-header">
        <div className="sf-header-inner">
          <button type="button" className="sf-logo" onClick={() => navigate("/")}>
            DESI<span>VDESI</span>
          </button>

          <nav className="sf-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`sf-nav-item${item.active ? " active" : ""}`}
                disabled={item.disabled}
                onClick={() => !item.disabled && item.path !== "#" && navigate(item.path)}
                title={item.disabled ? `${item.label} — coming soon` : item.label}
              >
                {item.icon}
                <span className="sf-nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sf-header-actions">
            <button type="button" className="sf-header-link">Offers</button>
            <button type="button" className="sf-header-link">Customer Service</button>
            {/* <button type="button" className="sf-header-login">Log in / Sign up</button> */}
          </div>
        </div>
      </header>
    </>
  );
}