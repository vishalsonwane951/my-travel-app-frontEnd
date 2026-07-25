import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useContext, useEffect, useCallback, useMemo, useRef } from "react";
import LoginRegister from "../Pages/LoginRegister.jsx"
import { AuthContext } from "../Context/AuthContext.jsx";
import ProfileDropdown from "./ProfileDropdown/ProfileDropdown.jsx";
import UserProfilePopup from "./Profile/Profile.jsx";

const BOOKING_EVENTS = [
  { name: "Priya S.", location: "Goa", pkg: "Beach Escape", time: "2 min ago" },
  { name: "Rahul M.", location: "Manali", pkg: "Snow Trek", time: "5 min ago" },
  { name: "Ananya K.", location: "Kerala", pkg: "Honeymoon Special", time: "8 min ago" },
  { name: "Vikram T.", location: "Rajasthan", pkg: "Heritage Tour", time: "11 min ago" },
  { name: "Sneha P.", location: "Dubai", pkg: "Luxury Escape", time: "14 min ago" },
  { name: "Arjun R.", location: "Thailand", pkg: "Adventure Pack", time: "17 min ago" },
  { name: "Meera D.", location: "Shimla", pkg: "Weekend Getaway", time: "20 min ago" },
  { name: "Karan B.", location: "Varanasi", pkg: "Pilgrimage Tour", time: "23 min ago" },
];

const NOTIFICATIONS = [
  { id: 1, icon: "🔥", title: "Flash Sale!", body: "Goa packages 30% OFF this weekend only", time: "Just now", unread: true },
  { id: 2, icon: "🌟", title: "New Package", body: "Luxury Maldives added — Limited slots", time: "1h ago", unread: true },
  { id: 3, icon: "📅", title: "Booking Reminder", body: "Complete your Manali booking before slots fill", time: "3h ago", unread: true },
  { id: 4, icon: "💬", title: "Review Request", body: "How was your Kerala trip? Share your experience!", time: "1d ago", unread: false },
];

const ALL_DESTINATIONS = [
  "Goa", "Kerala", "Rajasthan", "Himachal Pradesh", "Uttarakhand", "Maharashtra",
  "Dubai", "Maldives", "Thailand", "Bali", "Singapore", "Switzerland",
  "Manali", "Shimla", "Leh Ladakh", "Rishikesh", "Varanasi", "Coorg",
  "Paris", "Istanbul", "Sri Lanka", "Nepal", "Bhutan",
];

const Header = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);
  const [announcementBar, setAnnouncementBar] = useState(true);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);

  const searchInputRef = useRef(null);
  const notifRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerVisible(false);
      setTimeout(() => {
        setTickerIndex(i => (i + 1) % BOOKING_EVENTS.length);
        setTickerVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    setSearchResults(ALL_DESTINATIONS.filter(d => d.toLowerCase().includes(q)).slice(0, 6));
  }, [searchQuery]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setShowSearch(false);
    setShowNotifications(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollToSection = useCallback((sectionId, stateKey) => {
    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { [stateKey]: true } });
    }
    setMenuOpen(false);
  }, [location.pathname, navigate]);

  const handleDropdownEnter = useCallback((key) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(key);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 180);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  const handleSearchDestination = useCallback((dest) => {
    setShowSearch(false);
    setSearchQuery("");
    navigate(`/${dest.toLowerCase().replace(/ /g, "-")}`);
  }, [navigate]);

  const domesticDestinations = useMemo(() => [
    { name: "Maharashtra", path: "/Maharashtra", icon: "🏯" },
    { name: "Goa", path: "/goa", icon: "🏖️" },
    { name: "Kerala", path: "/kerala", icon: "🌴" },
    { name: "Rajasthan", path: "/rajasthan", icon: "🏜️" },
    { name: "Uttarakhand", path: "/uttarakhand", icon: "🏔️" },
    { name: "Himachal", path: "/himachal", icon: "⛰️" },
  ], []);

  const internationalDestinations = useMemo(() => [
    { name: "Dubai", path: "/dubai", icon: "🌆" },
    { name: "Maldives", path: "/maldives", icon: "🏝️" },
    { name: "Thailand", path: "/thailand", icon: "🐘" },
    { name: "Bali", path: "/bali", icon: "🌺" },
    { name: "Singapore", path: "/singapore", icon: "🦁" },
    { name: "Switzerland", path: "/switzerland", icon: "🏔️" },
  ], []);

  const tourTypes = useMemo(() => [
    { name: "Custom Tours", path: "/tourcard/custom-tour", icon: "🎨", color: "#E8820C", badge: null },
    { name: "Adventure Tours", path: "/tourcard/adventure-tour", icon: "🏔️", color: "#0A7B6C", badge: "Popular" },
    { name: "Family Tours", path: "/tourcard/family-tour", icon: "👨‍👩‍👧‍👦", color: "#C9A84C", badge: null },
    { name: "Group Tours", path: "/tourcard/group-tour", icon: "🚌", color: "#5B4FCF", badge: "Best Value" },
    { name: "City Tours", path: "/tourcard/city-tour", icon: "🌆", color: "#E8820C", badge: null },
    { name: "Honeymoon Tours", path: "/tourcard/honeymoon-tour", icon: "💑", color: "#C8416B", badge: "New" },
    { name: "Weekend Getaways", path: "/tourcard/weekend-getaway", icon: "🌅", color: "#0A7B6C", badge: "New" },
    { name: "Luxury Tours", path: "/tourcard/luxury-tour", icon: "💎", color: "#C9A84C", badge: "Premium" },
    { name: "Pilgrimage Tours", path: "/tourcard/pilgrimage-tour", icon: "🕌", color: "#7BAE7F", badge: "New" },
  ], []);

  const currentTicker = BOOKING_EVENTS[tickerIndex];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --announce-h: 38px;
          --header-h: 76px;
          --saffron: #E8820C;
          --saffron-deep: #C46A00;
          --saffron-pale: #FFF3E6;
          --teal: #0A3D47;
          --teal-mid: #0F5A69;
          --teal-light: #E6F4F7;
          --cream: #FDF8F2;
          --gold: #C9A84C;
          --gold-pale: #FBF3DE;
          --text: #1C1C1C;
          --text-mid: #4A4A5A;
          --text-muted: #9090A8;
          --border: rgba(10,61,71,0.1);
          --shadow-sm: 0 2px 12px rgba(10,61,71,0.08);
          --shadow-md: 0 8px 32px rgba(10,61,71,0.12);
          --shadow-lg: 0 20px 60px rgba(10,61,71,0.18);
          --r: 14px;
          --ease: cubic-bezier(0.4, 0, 0.2, 1);
          --t: 0.3s;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }

        /* ── Announcement Bar ── */
        .h-announce {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1001;
          height: var(--announce-h);
          background: var(--teal);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem;
          color: rgba(255,255,255,0.9);
          font-size: 0.775rem;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .h-announce-left { display: flex; align-items: center; gap: 10px; }

        .h-live-pill {
          background: var(--saffron);
          color: white;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 20px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          flex-shrink: 0;
          animation: pulse-pill 2s ease-in-out infinite;
        }
        @keyframes pulse-pill {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; }
        }

        .h-ticker-wrap { overflow: hidden; max-width: 380px; }
        .h-ticker {
          display: flex; align-items: center; gap: 5px;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .h-ticker.hidden { opacity: 0; transform: translateY(-6px); }
        .h-ticker.visible { opacity: 1; transform: translateY(0); }
        .h-ticker-muted { opacity: 0.55; font-size: 0.72rem; }

        .h-announce-right {
          display: flex; align-items: center; gap: 18px;
        }
        .h-announce-links { display: flex; gap: 16px; }
        .h-announce-links a {
          color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.75rem;
          transition: color var(--t) var(--ease);
        }
        .h-announce-links a:hover { color: var(--gold); }
        .h-close-bar {
          background: none; border: none; color: rgba(255,255,255,0.45);
          cursor: pointer; font-size: 0.95rem; line-height: 1; padding: 2px 0;
          transition: color var(--t);
        }
        .h-close-bar:hover { color: white; }

        /* ── Main Header ── */
        .h-root {
          position: fixed; left: 0; right: 0; z-index: 1000;
          transition: background var(--t) var(--ease), box-shadow var(--t) var(--ease),
                      border-color var(--t) var(--ease), top var(--t) var(--ease);
          font-family: 'Inter', sans-serif;
        }
        .h-root.scrolled {
          background: rgba(253, 248, 242, 0.97);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          box-shadow: var(--shadow-sm);
          border-bottom: 1px solid var(--border);
        }
        .h-root.transparent { background: transparent; }

        .h-inner {
          max-width: 1380px; margin: 0 auto; padding: 0 2rem;
          height: var(--header-h);
          display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
        }

        /* ── Logo ── */
        .h-logo {
          display: flex; align-items: center; text-decoration: none; flex-shrink: 0;
        }
        .h-logo-img {
          height: 48px; width: auto; max-width: 200px; object-fit: contain; display: block;
          transition: opacity var(--t);
        }
        .h-logo:hover .h-logo-img { opacity: 0.85; }
        .h-logo-pill {
          background: white; border-radius: 12px; padding: 5px 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
          transition: box-shadow var(--t) var(--ease), transform var(--t) var(--ease);
        }
        .h-logo-pill:hover {
          box-shadow: 0 6px 20px rgba(232,130,12,0.2);
          transform: translateY(-1px);
        }

        /* ── Desktop Nav ── */
        .h-nav { display: flex; align-items: center; gap: 0; flex: 1; justify-content: center; }

        .h-nav-link {
          position: relative;
          padding: 0.5rem 0.9rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500;
          text-decoration: none; cursor: pointer; background: none; border: none;
          font-family: 'Inter', sans-serif; letter-spacing: 0.01em;
          transition: color var(--t) var(--ease);
          overflow: hidden;
        }
        /* Saffron sweep underline — the signature element */
        .h-nav-link::after {
          content: '';
          position: absolute; bottom: 4px; left: 0.9rem; right: 0.9rem; height: 2px;
          background: var(--saffron);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.28s var(--ease);
        }
        .h-nav-link:hover::after { transform: scaleX(1); }

        /* ── Dropdown trigger ── */
        .h-dropdown { position: relative; }
        .h-dropdown-trigger {
          position: relative;
          display: flex; align-items: center; gap: 5px;
          padding: 0.5rem 0.9rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500;
          cursor: pointer; background: none; border: none;
          font-family: 'Inter', sans-serif; letter-spacing: 0.01em;
          transition: color var(--t) var(--ease);
          overflow: hidden;
        }
        .h-dropdown-trigger::after {
          content: '';
          position: absolute; bottom: 4px; left: 0.9rem; right: 0.9rem; height: 2px;
          background: var(--saffron);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.28s var(--ease);
        }
        .h-dropdown:hover .h-dropdown-trigger::after { transform: scaleX(1); }

        .h-chevron {
          font-size: 0.6rem; transition: transform 0.25s var(--ease); display: inline-block; opacity: 0.6;
        }
        .h-dropdown:hover .h-chevron { transform: rotate(180deg); }

        /* ── Dropdown panel ── */
        .h-dropdown-menu {
          position: absolute; top: calc(100% + 12px); left: 50%;
          transform: translateX(-50%) translateY(8px);
          background: white; border-radius: var(--r); box-shadow: var(--shadow-lg);
          min-width: 220px; padding: 8px;
          opacity: 0; visibility: hidden; pointer-events: none;
          transition: opacity 0.22s var(--ease), transform 0.22s var(--ease), visibility 0.22s;
          border: 1px solid var(--border); z-index: 1002;
        }
        .h-dropdown-menu.wide { min-width: 560px; }
        .h-dropdown-menu.active {
          opacity: 1; visibility: visible; pointer-events: all;
          transform: translateX(-50%) translateY(0);
        }
        /* Notch */
        .h-dropdown-menu::before {
          content: ''; position: absolute; top: -6px; left: 50%;
          width: 12px; height: 12px; background: white;
          border-left: 1px solid var(--border); border-top: 1px solid var(--border);
          transform: translateX(-50%) rotate(45deg);
        }

        .h-menu-label {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--text-muted);
          padding: 6px 10px 4px;
        }
        .h-menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
        .h-menu-item {
          display: flex; align-items: center; gap: 10px; padding: 9px 10px;
          border-radius: 10px; color: var(--text); text-decoration: none;
          font-size: 0.855rem; font-weight: 500; transition: background var(--t), color var(--t), transform var(--t);
          cursor: pointer; position: relative;
        }
        .h-menu-item:hover {
          background: var(--saffron-pale); color: var(--saffron-deep);
          transform: translateX(2px);
        }
        .h-item-icon {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.95rem; flex-shrink: 0; background: #F5F5F5;
          transition: transform var(--t);
        }
        .h-menu-item:hover .h-item-icon { transform: scale(1.12); }

        .h-badge {
          margin-left: auto; font-size: 0.58rem; font-weight: 700;
          padding: 2px 6px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .badge-new { background: var(--teal-light); color: var(--teal); }
        .badge-popular { background: #FFF0E0; color: var(--saffron-deep); }
        .badge-value { background: #EDE9FF; color: #5B4FCF; }
        .badge-premium { background: var(--gold-pale); color: #8B6914; }

        .h-menu-footer {
          margin-top: 4px; padding: 8px 10px; border-top: 1px solid #F0F0F0;
          display: flex; align-items: center; justify-content: space-between;
          font-size: 0.79rem; color: var(--text-muted);
        }
        .h-menu-footer a {
          color: var(--teal); font-weight: 600; text-decoration: none;
          transition: color var(--t);
        }
        .h-menu-footer a:hover { color: var(--saffron); }

        /* ── Right Controls ── */
        .h-controls { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

        .h-icon-btn {
          width: 38px; height: 38px; border-radius: 10px; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; transition: background var(--t), transform var(--t);
          background: transparent; position: relative;
        }
        .h-icon-btn:hover { background: var(--saffron-pale); transform: scale(1.05); }
        .h-root.scrolled .h-icon-btn:hover { background: var(--saffron-pale); }

        .h-notif-badge {
          position: absolute; top: 5px; right: 5px; width: 15px; height: 15px;
          background: var(--saffron); color: white; font-size: 0.58rem; font-weight: 700;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          border: 2px solid white;
        }

        /* ── Notifications Panel ── */
        .h-notif-panel {
          position: absolute; top: calc(100% + 14px); right: 0; width: 330px;
          background: white; border-radius: var(--r); box-shadow: var(--shadow-lg);
          border: 1px solid var(--border); overflow: hidden;
          opacity: 0; visibility: hidden; transform: translateY(6px);
          transition: all 0.22s var(--ease); z-index: 1003;
        }
        .h-notif-panel.active { opacity: 1; visibility: visible; transform: translateY(0); }
        .h-notif-head {
          padding: 14px 18px 10px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #F2F2F8;
        }
        .h-notif-head h4 {
          font-size: 0.9rem; font-weight: 600; color: var(--text);
          font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.05rem;
        }
        .h-notif-read-btn {
          font-size: 0.75rem; color: var(--teal); font-weight: 600;
          cursor: pointer; background: none; border: none; font-family: 'Inter', sans-serif;
          transition: color var(--t);
        }
        .h-notif-read-btn:hover { color: var(--saffron); }
        .h-notif-item {
          display: flex; gap: 11px; padding: 12px 18px;
          border-bottom: 1px solid #F8F8FC; transition: background 0.18s; cursor: pointer;
        }
        .h-notif-item:hover { background: var(--cream); }
        .h-notif-item.unread { background: #F6F8FF; }
        .h-notif-emoji {
          width: 34px; height: 34px; border-radius: 9px; background: var(--teal-light);
          display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;
        }
        .h-notif-body { flex: 1; min-width: 0; }
        .h-notif-title { font-size: 0.84rem; font-weight: 600; color: var(--text); margin-bottom: 2px; }
        .h-notif-text { font-size: 0.78rem; color: var(--text-mid); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .h-notif-time { font-size: 0.7rem; color: var(--text-muted); margin-top: 3px; }
        .h-notif-dot { width: 6px; height: 6px; background: var(--saffron); border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
        .h-notif-foot { padding: 10px 18px; text-align: center; }
        .h-notif-foot a { font-size: 0.8rem; color: var(--teal); font-weight: 600; text-decoration: none; }
        .h-notif-foot a:hover { color: var(--saffron); }

        /* ── CTA Button ── */
        .h-cta {
          padding: 0.5rem 1.3rem; border-radius: 50px; border: none;
          font-size: 0.855rem; font-weight: 600; cursor: pointer;
          font-family: 'Inter', sans-serif; letter-spacing: 0.02em; white-space: nowrap;
          transition: transform var(--t), box-shadow var(--t), background var(--t);
        }
        .h-cta.filled {
          background: var(--saffron);
          color: white;
          box-shadow: 0 4px 14px rgba(232,130,12,0.35);
        }
        .h-cta.filled:hover {
          background: var(--saffron-deep);
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(232,130,12,0.45);
        }
        .h-cta.outline {
          background: transparent; color: white;
          border: 1.5px solid rgba(255,255,255,0.5);
        }
        .h-cta.outline:hover { border-color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.1); }

        /* ── Hamburger ── */
        .h-hamburger {
          display: none; flex-direction: column; gap: 5px; cursor: pointer;
          border: none; background: transparent; padding: 7px; border-radius: 9px;
          transition: background var(--t);
        }
        .h-hamburger:hover { background: var(--saffron-pale); }
        .h-ham-line { width: 21px; height: 2px; border-radius: 2px; transition: var(--t) var(--ease); display: block; }
        .h-ham-line:nth-child(2) { width: 15px; }

        /* ── Search Overlay ── */
        .h-search-overlay {
          position: fixed; inset: 0;
          background: rgba(10,20,30,0.82);
          backdrop-filter: blur(14px); z-index: 2000;
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 130px;
          opacity: 0; visibility: hidden; transition: all 0.28s var(--ease);
        }
        .h-search-overlay.active { opacity: 1; visibility: visible; }
        .h-search-box {
          width: 100%; max-width: 620px; margin: 0 1.25rem;
          transform: translateY(-16px); transition: transform 0.32s var(--ease);
        }
        .h-search-overlay.active .h-search-box { transform: translateY(0); }
        .h-search-headline {
          font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 600;
          color: white; text-align: center; margin-bottom: 1.5rem; line-height: 1.2;
        }
        .h-search-headline em { color: var(--gold); font-style: normal; }
        .h-search-bar {
          display: flex; background: white; border-radius: 14px;
          overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.4);
        }
        .h-search-input {
          flex: 1; padding: 1rem 1.25rem; border: none; outline: none;
          font-size: 1rem; font-family: 'Inter', sans-serif; color: var(--text); background: transparent;
        }
        .h-search-go {
          padding: 0 1.25rem; background: var(--saffron); color: white; border: none;
          font-size: 1.1rem; cursor: pointer; transition: background var(--t);
        }
        .h-search-go:hover { background: var(--saffron-deep); }
        .h-search-results {
          margin-top: 8px; background: white; border-radius: 12px;
          overflow: hidden; box-shadow: 0 16px 32px rgba(0,0,0,0.3);
        }
        .h-search-item {
          display: flex; align-items: center; gap: 10px; padding: 11px 16px;
          cursor: pointer; transition: background 0.18s;
          border-bottom: 1px solid #F0F0F8; font-size: 0.92rem; color: var(--text);
          font-family: 'Inter', sans-serif;
        }
        .h-search-item:hover { background: var(--saffron-pale); }
        .h-search-item:last-child { border-bottom: none; }
        .h-search-close {
          position: fixed; top: 1.25rem; right: 1.25rem; width: 42px; height: 42px;
          background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 50%; color: white; font-size: 1.1rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: all var(--t);
        }
        .h-search-close:hover { background: rgba(255,255,255,0.25); transform: rotate(90deg); }

        /* ── Mobile ── */
        .h-mobile-overlay {
          position: fixed; inset: 0; background: rgba(10,20,30,0.55);
          backdrop-filter: blur(4px); z-index: 1001;
          opacity: 0; visibility: hidden; transition: all 0.3s var(--ease);
        }
        .h-mobile-overlay.active { opacity: 1; visibility: visible; }

        .h-mobile-menu {
          position: fixed; top: 0; right: 0; bottom: 0; width: min(320px, 88vw);
          background: white; z-index: 1002; transform: translateX(100%);
          transition: transform 0.38s var(--ease);
          display: flex; flex-direction: column; overflow: hidden;
          box-shadow: -16px 0 48px rgba(0,0,0,0.18);
        }
        .h-mobile-menu.active { transform: translateX(0); }

        .h-mobile-head {
          padding: 1.1rem 1.25rem;
          background: var(--teal);
          display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
        }
        .h-mobile-logo {
          height: 42px; width: auto; max-width: 160px; object-fit: contain;
          background: white; border-radius: 9px; padding: 4px 9px; display: block;
        }
        .h-mobile-x {
          width: 34px; height: 34px; border-radius: 9px; background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18); color: white; font-size: 1.1rem;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background var(--t);
        }
        .h-mobile-x:hover { background: rgba(255,255,255,0.25); }

        .h-mobile-body { flex: 1; overflow-y: auto; padding: 0.5rem 0; }
        .h-mobile-body::-webkit-scrollbar { width: 3px; }
        .h-mobile-body::-webkit-scrollbar-thumb { background: #DDD; border-radius: 2px; }

        .h-mobile-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.8rem 1.25rem; color: var(--text); font-size: 0.93rem; font-weight: 500;
          text-decoration: none; cursor: pointer; background: none; border: none;
          width: 100%; text-align: left; font-family: 'Inter', sans-serif;
          border-bottom: 1px solid #F2F2F8; transition: background 0.18s, color 0.18s;
        }
        .h-mobile-link:hover { background: var(--saffron-pale); color: var(--saffron-deep); }

        .h-expand-icon { font-size: 0.68rem; transition: transform 0.25s; display: inline-block; opacity: 0.5; }
        .h-expand-icon.open { transform: rotate(180deg); opacity: 1; }

        .h-mobile-sub { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; background: #FAFBFC; }
        .h-mobile-sub.open { max-height: 600px; }

        .h-mobile-sub-link {
          display: flex; align-items: center; gap: 9px;
          padding: 0.65rem 1.25rem 0.65rem 1.75rem;
          color: var(--text-mid); font-size: 0.85rem; text-decoration: none;
          font-family: 'Inter', sans-serif; border-bottom: 1px solid rgba(0,0,0,0.04);
          transition: color 0.18s, background 0.18s;
        }
        .h-mobile-sub-link:hover { color: var(--saffron-deep); background: var(--saffron-pale); }
        .h-mobile-sub-link .item-icon {
          width: 26px; height: 26px; border-radius: 7px; background: white;
          display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        .h-mobile-foot {
          padding: 1rem 1.25rem; border-top: 1px solid #F0F0F8; background: var(--cream); flex-shrink: 0;
        }
        .h-mobile-cta {
          width: 100%; padding: 0.8rem; border-radius: 50px; border: none;
          background: var(--saffron); color: white;
          font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif;
          letter-spacing: 0.02em; box-shadow: 0 4px 14px rgba(232,130,12,0.35);
          transition: transform var(--t), box-shadow var(--t), background var(--t);
        }
        .h-mobile-cta:hover { background: var(--saffron-deep); transform: translateY(-1px); box-shadow: 0 8px 20px rgba(232,130,12,0.4); }
        .h-mobile-quick { display: flex; gap: 6px; margin-top: 8px; }
        .h-mobile-quick a {
          flex: 1; padding: 0.55rem; border-radius: 9px; background: var(--teal-light);
          color: var(--teal); font-size: 0.75rem; font-weight: 600;
          text-align: center; text-decoration: none; transition: background var(--t), color var(--t);
        }
        .h-mobile-quick a:hover { background: var(--teal); color: white; }

        /* ── Divider in mobile ── */
        .h-mobile-section-label {
          padding: 8px 1.25rem 4px;
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--text-muted);
          background: #F8F8FC;
          border-bottom: 1px solid #F2F2F8;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .h-nav { display: none !important; }
          .h-cta { display: none !important; }
          .h-icon-btn.search-btn { display: none !important; }
          .h-hamburger { display: flex !important; }
        }
        @media (max-width: 520px) {
          .h-announce-links { display: none; }
          .h-ticker-wrap { max-width: 190px; }
          .h-inner { padding: 0 1rem; }
        }
      `}</style>

      {/* ── Announcement Bar ── */}
      {announcementBar && (
        <div className="h-announce">
          <div className="h-announce-left">
            <span className="h-live-pill">Live</span>
            <div className="h-ticker-wrap">
              <div className={`h-ticker ${tickerVisible ? "visible" : "hidden"}`}>
                <span>
                  <strong>{currentTicker.name}</strong> booked <strong>{currentTicker.pkg}</strong> · {currentTicker.location}
                </span>
                <span className="h-ticker-muted">{currentTicker.time}</span>
              </div>
            </div>
          </div>
          <div className="h-announce-right">
            <div className="h-announce-links">
              <a href="tel:+917888251550">📞 +91 78882 51550</a>
              <a href="mailto:tours.desivdesi@gmail.com">✉️ Email us</a>
            </div>
            <button className="h-close-bar" onClick={() => setAnnouncementBar(false)} aria-label="Close">×</button>
          </div>
        </div>
      )}

      {/* ── Main Header ── */}
      <header
        className={`h-root scrolled`}
        style={{ top: announcementBar ? 38 : 0 }}
      >
        <div className="h-inner">

          {/* Logo */}
          <Link to="/" className="h-logo h-logo-pill">
            <img src="/newlogo.png" alt="DesiVDesi Escape" className="h-logo-img" />
          </Link>

          {/* Desktop Nav */}
          <nav className="h-nav">
            {/* Nav color adapts to scroll state */}
            {[
              { label: "Home", to: "/" },
              { label: "Services", to: "/services" },
              { label: "Career", to: "/career" },
            ].map(({ label, to }) => (
              <Link key={to} to={to} className="h-nav-link" style={{ color: scrolled ? "var(--text)" : "var(--text)" }}>
                {label}
              </Link>
            ))}

            <button
              onClick={() => scrollToSection("about-us", "scrollToAbout")}
              className="h-nav-link"
              style={{ color: scrolled ? "var(--text)" : "var(--text)" }}
            >
              About
            </button>

            {/* Tour Packages */}
            <div className="h-dropdown" onMouseEnter={() => handleDropdownEnter("tours")} onMouseLeave={handleDropdownLeave}>
              <button className="h-dropdown-trigger" style={{ color: scrolled ? "var(--text)" : "var(--text)" }}>
                Tour Packages <span className="h-chevron">▾</span>
              </button>
              <div className={`h-dropdown-menu wide ${activeDropdown === "tours" ? "active" : ""}`}>
                <div className="h-menu-label">All Tour Types</div>
                <div className="h-menu-grid">
                  {tourTypes.map((t, i) => (
                    <Link key={i} to={t.path} className="h-menu-item" onClick={() => setActiveDropdown(null)}>
                      <span className="h-item-icon" style={{ background: `${t.color}18` }}>{t.icon}</span>
                      <span>{t.name}</span>
                      {t.badge && (
                        <span className={`h-badge badge-${t.badge === "New" ? "new" : t.badge === "Popular" ? "popular" : t.badge === "Best Value" ? "value" : "premium"}`}>
                          {t.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
                <div className="h-menu-footer">
                  <span>9 tour types</span>
                  <Link to="/services">Browse all →</Link>
                </div>
              </div>
            </div>

            {/* Domestic */}
            <div className="h-dropdown" onMouseEnter={() => handleDropdownEnter("domestic")} onMouseLeave={handleDropdownLeave}>
              <button className="h-dropdown-trigger" style={{ color: scrolled ? "var(--text)" : "var(--text)" }}>
                Domestic <span className="h-chevron">▾</span>
              </button>
              <div className={`h-dropdown-menu ${activeDropdown === "domestic" ? "active" : ""}`}>
                <div className="h-menu-label">Popular in India</div>
                {domesticDestinations.map((d, i) => (
                  <Link key={i} to={d.path} className="h-menu-item" onClick={() => setActiveDropdown(null)}>
                    <span className="h-item-icon">{d.icon}</span>{d.name}
                  </Link>
                ))}
                <div className="h-menu-footer">
                  <span></span>
                  <Link to="/" state={{ scrollToDomestic: true }}>All Domestic →</Link>
                </div>
              </div>
            </div>

            {/* International */}
            <div className="h-dropdown" onMouseEnter={() => handleDropdownEnter("international")} onMouseLeave={handleDropdownLeave}>
              <button className="h-dropdown-trigger" style={{ color: scrolled ? "var(--text)" : "var(--text)" }}>
                International <span className="h-chevron">▾</span>
              </button>
              <div className={`h-dropdown-menu ${activeDropdown === "international" ? "active" : ""}`}>
                <div className="h-menu-label">Top International</div>
                {internationalDestinations.map((d, i) => (
                  <Link key={i} to={d.path} className="h-menu-item" onClick={() => setActiveDropdown(null)}>
                    <span className="h-item-icon">{d.icon}</span>{d.name}
                  </Link>
                ))}
                <div className="h-menu-footer">
                  <span></span>
                  <Link to="/" state={{ scrollToInternational: true }}>All International →</Link>
                </div>
              </div>
            </div>

            <button
              onClick={() => scrollToSection("footer", "scrollToContact")}
              className="h-nav-link"
              style={{ color: scrolled ? "var(--text)" : "var(--text)" }}
            >
              Contact
            </button>
          </nav>

          {/* Right Controls */}
          <div className="h-controls">
            <button
              className="h-icon-btn search-btn"
              onClick={() => setShowSearch(true)}
              title="Search destinations"
              style={{ color: scrolled ? "var(--text)" : "var(--text)" }}
            >
              🔍
            </button>

            <div style={{ position: "relative" }} ref={notifRef}>
              <button
                className="h-icon-btn"
                onClick={() => setShowNotifications(v => !v)}
                title="Notifications"
                style={{ color: scrolled ? "var(--text)" : "var(--text)" }}
              >
                🔔
                {unreadCount > 0 && <span className="h-notif-badge">{unreadCount}</span>}
              </button>
              <div className={`h-notif-panel ${showNotifications ? "active" : ""}`}>
                <div className="h-notif-head">
                  <h4>Notifications</h4>
                  <button className="h-notif-read-btn" onClick={markAllRead}>Mark all read</button>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`h-notif-item ${n.unread ? "unread" : ""}`}>
                    <div className="h-notif-emoji">{n.icon}</div>
                    <div className="h-notif-body">
                      <div className="h-notif-title">{n.title}</div>
                      <div className="h-notif-text">{n.body}</div>
                      <div className="h-notif-time">{n.time}</div>
                    </div>
                    {n.unread && <div className="h-notif-dot" />}
                  </div>
                ))}
                <div className="h-notif-foot">
                  <a href="/notifications">See all</a>
                </div>
              </div>
            </div>

            {!user ? (
              <button onClick={() => setShowAuth(true)} className="h-cta filled">
                Sign In
              </button>
            ) : (
              <ProfileDropdown />
            )}

            <button
              className="h-hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="h-ham-line" style={{ background: scrolled ? "var(--text)" : "var(--text)" }} />
              <span className="h-ham-line" style={{ background: scrolled ? "var(--text)" : "var(--text)" }} />
              <span className="h-ham-line" style={{ background: scrolled ? "var(--text)" : "var(--text)" }} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Search Overlay ── */}
      <div
        className={`h-search-overlay ${showSearch ? "active" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) setShowSearch(false); }}
      >
        <button className="h-search-close" onClick={() => setShowSearch(false)}>✕</button>
        <div className="h-search-box">
          <p className="h-search-headline">
            Where do you want to <em>explore?</em>
          </p>
          <div className="h-search-bar">
            <input
              ref={searchInputRef}
              type="text"
              className="h-search-input"
              placeholder="Search destinations, tours, places…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Escape") setShowSearch(false);
                if (e.key === "Enter" && searchResults.length > 0) handleSearchDestination(searchResults[0]);
              }}
            />
            <button
              className="h-search-go"
              onClick={() => searchResults.length > 0 && handleSearchDestination(searchResults[0])}
            >
              🔍
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="h-search-results">
              {searchResults.map((dest, i) => (
                <div key={i} className="h-search-item" onClick={() => handleSearchDestination(dest)}>
                  <span>📍</span> {dest}
                </div>
              ))}
            </div>
          )}
          {searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="h-search-results">
              <div className="h-search-item" style={{ color: "#AAA", justifyContent: "center" }}>
                No destinations found for "{searchQuery}"
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Overlay ── */}
      <div className={`h-mobile-overlay ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(false)} />

      {/* ── Mobile Menu ── */}
      <div className={`h-mobile-menu ${menuOpen ? "active" : ""}`}>
        <div className="h-mobile-head">
          <img src="/logo.png" alt="DesiVDesi Escape" className="h-mobile-logo" />
          <button className="h-mobile-x" onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <div className="h-mobile-body">
          <Link to="/" className="h-mobile-link" onClick={() => setMenuOpen(false)}>
            <span>🏠 Home</span>
          </Link>
          <button onClick={() => scrollToSection("about-us", "scrollToAbout")} className="h-mobile-link">
            <span>ℹ️ About</span>
          </button>
          <Link to="/services" className="h-mobile-link" onClick={() => setMenuOpen(false)}>
            <span>🛎️ Services</span>
          </Link>

          <div className="h-mobile-section-label">Tour Packages</div>
          <div>
            <button
              className="h-mobile-link"
              onClick={() => setMobileExpandedSection(s => s === "tours" ? null : "tours")}
            >
              <span>✈️ All Tour Types</span>
              <span className={`h-expand-icon ${mobileExpandedSection === "tours" ? "open" : ""}`}>▾</span>
            </button>
            <div className={`h-mobile-sub ${mobileExpandedSection === "tours" ? "open" : ""}`}>
              {tourTypes.map((t, i) => (
                <Link key={i} to={t.path} className="h-mobile-sub-link" onClick={() => setMenuOpen(false)}>
                  <span className="item-icon" style={{ background: `${t.color}18` }}>{t.icon}</span>
                  {t.name}
                  {t.badge && (
                    <span
                      className={`h-badge badge-${t.badge === "New" ? "new" : t.badge === "Popular" ? "popular" : t.badge === "Best Value" ? "value" : "premium"}`}
                      style={{ marginLeft: "auto" }}
                    >{t.badge}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="h-mobile-section-label">Destinations</div>
          <div>
            <button
              className="h-mobile-link"
              onClick={() => setMobileExpandedSection(s => s === "domestic" ? null : "domestic")}
            >
              <span>🇮🇳 Domestic</span>
              <span className={`h-expand-icon ${mobileExpandedSection === "domestic" ? "open" : ""}`}>▾</span>
            </button>
            <div className={`h-mobile-sub ${mobileExpandedSection === "domestic" ? "open" : ""}`}>
              {domesticDestinations.map((d, i) => (
                <Link key={i} to={d.path} className="h-mobile-sub-link" onClick={() => setMenuOpen(false)}>
                  <span className="item-icon">{d.icon}</span>{d.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <button
              className="h-mobile-link"
              onClick={() => setMobileExpandedSection(s => s === "international" ? null : "international")}
            >
              <span>🌍 International</span>
              <span className={`h-expand-icon ${mobileExpandedSection === "international" ? "open" : ""}`}>▾</span>
            </button>
            <div className={`h-mobile-sub ${mobileExpandedSection === "international" ? "open" : ""}`}>
              {internationalDestinations.map((d, i) => (
                <Link key={i} to={d.path} className="h-mobile-sub-link" onClick={() => setMenuOpen(false)}>
                  <span className="item-icon">{d.icon}</span>{d.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="h-mobile-section-label">More</div>
          <Link to="/career" className="h-mobile-link" onClick={() => setMenuOpen(false)}>
            <span>💼 Career</span>
          </Link>
          <button onClick={() => scrollToSection("footer", "scrollToContact")} className="h-mobile-link">
            <span>📞 Contact</span>
          </button>
          <button className="h-mobile-link" onClick={() => { setMenuOpen(false); setShowSearch(true); }}>
            <span>🔍 Search Destinations</span>
          </button>
        </div>

        <div className="h-mobile-foot">
          {!user ? (
            <button className="h-mobile-cta" onClick={() => { setShowAuth(true); setMenuOpen(false); }}>
              Sign In to Your Account
            </button>
          ) : (
            <ProfileDropdown />
          )}
          <div className="h-mobile-quick">
            <a href="tel:+917888251550">📞 Call</a>
            <a href="https://wa.me/917888251550" target="_blank" rel="noreferrer">💬 WhatsApp</a>
            <a href="mailto:tours.desivdesi@gmail.com">✉️ Email</a>
          </div>
        </div>
      </div>

      {showAuth && <LoginRegister onClose={() => setShowAuth(false)} />}
      {showProfile && <UserProfilePopup onClose={() => setShowProfile(false)} />}

      <div style={{ height: announcementBar ? `calc(38px + 76px)` : "76px" }} />
    </>
  );
};

export default Header;