import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Footer from "../Components/Footer.jsx";
import api from "../utils/api.js";
import { AuthContext } from "../Context/AuthContext.jsx";
import BookingForm from "../Components/BookingForm/BookingForm.jsx";
import {
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaStar,
  FaArrowRight,
  FaSearch,
  FaAward,
  FaGlobe,
  FaUmbrellaBeach,
  FaMountain,
  FaTree,
  FaWater,
  FaChevronRight,
  FaChevronLeft,
  FaHotel,
  FaMapMarkedAlt,
  FaTrash,
  FaUpload,
  FaPlay,
  FaPlane,
  FaEdit,
  FaPlus,
  FaHeart,
  FaTimes,
  FaFilter,
  FaCompass,
  FaCalendarAlt,
  FaRupeeSign,
  FaSun,
  FaCloudRain,
  FaBolt,
  FaSnowflake,
  FaWind,
  FaShareAlt,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaBars,
  FaSlidersH,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";
import TourPackageCard from "../Components/TourPackageCard.jsx";
import TripPlannerModal from "../Pages/AITrip Planner/TripPlannerModal.jsx";
import ItineraryResult from "../Components/ItineraryResult.jsx";
import NewsletterSubscribe from "../Components/Newslettersubscribe.jsx";
import ItineraryTimeline from "./AITrip Planner/Itinerarytimeline.jsx";
import HotelHeader from "./Hotel/component/Header.jsx";
import Header from "../Components/Header.jsx";

const BASE = "https://my-travel-app-backend-6.onrender.com";

const _imgCache = new Map();
const getImageUrl = (path) => {
  if (!path) return "/placeholder.jpg";
  const str =
    typeof path === "string"
      ? path
      : path?.url || path?.src || path?.images || String(path);
  if (!str || str === "undefined" || str === "null") return "/placeholder.jpg";
  if (_imgCache.has(str)) return _imgCache.get(str);
  const url = str.startsWith("http")
    ? str
    : `${BASE}/${str.replace(/^\/+/, "")}`;
  _imgCache.set(str, url);
  return url;
};

function useRevealOnScroll(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const Reveal = ({
  as = "div",
  delay = 0,
  className = "",
  style = {},
  children,
  ...rest
}) => {
  const [ref, visible] = useRevealOnScroll();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

const GlobalStyles = () => (
  <style>{`
    /* FIX 4: Font import moved to index.html <head> for parallel loading.
       This inline import is kept as fallback only. */
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

    :root {
      --saffron: #E8813A;
      --saffron-light: #F4A261;
      --saffron-dark: #C85A1A;
      --forest: #1A3C34;
      --forest-mid: #264D42;
      --forest-light: #2E6B5C;
      --cream: #FBF5EC;
      --cream-deep: #F3E8D4;
      --sand: #D4B896;
      --charcoal: #1C1C1E;
      --ink: #0F1923;
      --muted: #9CA3AF;
      --mist: rgba(251,245,236,0.06);
      --glass: rgba(255,255,255,0.08);
      --glass-border: rgba(255,255,255,0.12);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Outfit', sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; }
    h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; }

    ::selection { background: var(--saffron); color: white; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--cream-deep); }
    ::-webkit-scrollbar-thumb { background: var(--saffron); border-radius: 3px; }

    .dvd-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      transition: all 0.4s cubic-bezier(.4,0,.2,1);
    }
    .dvd-nav.scrolled {
      background: rgba(15,25,35,0.92);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .nav-link {
      color: rgba(255,255,255,0.8); text-decoration: none;
      font-size: 0.85rem; font-weight: 500; letter-spacing: 0.5px;
      padding: 6px 0; position: relative; transition: color 0.3s;
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: 0; left: 0;
      width: 0; height: 1.5px; background: var(--saffron);
      transition: width 0.3s ease;
    }
    .nav-link:hover { color: white; }
    .nav-link:hover::after { width: 100%; }

    .hero-container { height: 100vh; min-height: 680px; position: relative; overflow: hidden; }
    .hero-slide { position: absolute; inset: 0; transition: opacity 0.9s ease, transform 0.9s ease; }
    .hero-slide.active { opacity: 1; transform: scale(1); z-index: 2; }
    .hero-slide.inactive { opacity: 0; transform: scale(1.04); z-index: 1; }
    .hero-img { width: 100%; height: 100%; object-fit: cover; }
    .hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(105deg, rgba(15,25,35,0.82) 0%, rgba(15,25,35,0.45) 55%, rgba(15,25,35,0.1) 100%);
    }
    .hero-content { position: relative; z-index: 3; }

    .dest-card {
      background: white; border-radius: 20px; overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      transition: transform 0.4s cubic-bezier(.25,.8,.25,1), box-shadow 0.4s;
      cursor: pointer;
    }
    .dest-card:hover { transform: translateY(-10px); box-shadow: 0 20px 60px rgba(0,0,0,0.14); }
    .dest-card-img { position: relative; overflow: hidden; }
    .dest-card-img img { transition: transform 0.6s ease; }
    .dest-card:hover .dest-card-img img { transform: scale(1.08); }

    .glass-card {
      background: var(--glass);
      backdrop-filter: blur(16px);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--saffron), var(--saffron-dark));
      color: white; border: none; border-radius: 50px;
      font-family: 'Outfit', sans-serif; font-weight: 600;
      cursor: pointer; transition: all 0.3s;
      box-shadow: 0 4px 20px rgba(232,129,58,0.35);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(232,129,58,0.5);
    }
    .btn-primary:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
    .btn-outline {
      background: transparent; color: white;
      border: 1.5px solid rgba(255,255,255,0.4);
      border-radius: 50px; font-family: 'Outfit', sans-serif;
      font-weight: 500; cursor: pointer; transition: all 0.3s;
    }
    .btn-outline:hover { background: rgba(255,255,255,0.12); border-color: white; }

    .search-container {
      background: white; border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      padding: 8px;
    }
    .search-tab {
      border-radius: 12px; padding: 10px 20px;
      font-family: 'Outfit', sans-serif; font-size: 0.85rem;
      font-weight: 500; cursor: pointer; transition: all 0.2s;
      border: none; background: transparent; color: #6b7280;
    }
    .search-tab.active { background: var(--forest); color: white; }
    .search-input {
      border: none; outline: none; font-family: 'Outfit', sans-serif;
      font-size: 0.95rem; background: transparent; width: 100%; color: var(--ink);
    }
    .search-input::placeholder { color: #9ca3af; }

    .filter-pill {
      padding: 8px 20px; border-radius: 50px;
      font-family: 'Outfit', sans-serif; font-size: 0.82rem;
      font-weight: 600; cursor: pointer; transition: all 0.25s;
      border: 1.5px solid #E5E7EB; background: white; color: #6B7280;
      white-space: nowrap;
    }
    .filter-pill:hover { border-color: var(--saffron); color: var(--saffron); }
    .filter-pill.active {
      background: var(--saffron); color: white;
      border-color: var(--saffron);
      box-shadow: 0 4px 14px rgba(232,129,58,0.35);
    }

    .section-eyebrow {
      font-family: 'Outfit', sans-serif;
      font-size: 0.75rem; font-weight: 700;
      letter-spacing: 3px; text-transform: uppercase;
      color: var(--saffron);
    }
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 4vw, 3.2rem);
      font-weight: 600; line-height: 1.15; color: var(--ink);
    }

    .stat-ticker { border-left: 3px solid var(--saffron); padding-left: 16px; }

    .wishlist-drawer {
      position: fixed; top: 0; right: 0; bottom: 0;
      width: 360px; background: white; z-index: 2000;
      box-shadow: -20px 0 60px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(.4,0,.2,1);
      overflow-y: auto;
    }
    .wishlist-drawer.open { transform: translateX(0); }
    .wishlist-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      z-index: 1999; opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
    }
    .wishlist-overlay.open { opacity: 1; pointer-events: all; }

    .modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(15,25,35,0.75);
      backdrop-filter: blur(8px);
      z-index: 3000;
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
    }
    .modal-box {
      background: white; border-radius: 24px;
      max-width: 620px; width: 100%;
      max-height: 88vh; overflow-y: auto;
      box-shadow: 0 40px 100px rgba(0,0,0,0.3);
      padding: 32px;
    }

    .progress { display: flex; gap: 8px; margin-bottom: 28px; }
    .progress-seg { flex: 1; height: 4px; border-radius: 2px; background: #E5E7EB; transition: background 0.3s; }
    .progress-seg.done { background: var(--saffron); }
    .step-enter { animation: fadeUp 0.4s ease forwards; }
    .field-label { font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
    .field-hint { font-weight: 400; color: var(--muted); font-size: 0.75rem; }
    .input { width: 100%; padding: 11px 16px; border-radius: 12px; border: 1.5px solid #E5E7EB; font-family: 'Outfit', sans-serif; font-size: 0.9rem; outline: none; transition: border-color 0.2s; }
    .input:focus { border-color: var(--saffron); }
    .weather-card { background: linear-gradient(135deg, var(--forest), var(--forest-light)); border-radius: 20px; padding: 24px; color: white; position: relative; overflow: hidden; }
    .weather-card::before { content: ''; position: absolute; width: 200px; height: 200px; background: rgba(255,255,255,0.05); border-radius: 50%; top: -60px; right: -60px; }
    .currency-card { background: linear-gradient(135deg, var(--saffron), var(--saffron-dark)); border-radius: 20px; padding: 24px; color: white; }
    .fab-wishlist {
      position: fixed; bottom: 30px; right: 30px; z-index: 900;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, var(--saffron), var(--saffron-dark));
      color: white; border: none; cursor: pointer;
      box-shadow: 0 8px 24px rgba(232,129,58,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem; transition: all 0.3s;
    }
    .fab-wishlist:hover { transform: scale(1.1); }
    .fab-badge {
      position: absolute; top: -4px; right: -4px;
      width: 20px; height: 20px; border-radius: 50%;
      background: var(--forest); color: white;
      font-size: 0.7rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid white;
    }

    .itinerary-overlay { position: fixed; inset: 0; background: var(--cream); z-index: 4000; overflow-y: auto; animation: fadeIn 0.4s ease forwards; }
    .itinerary-overlay-inner { max-width: 900px; margin: 0 auto; padding: 0 24px 80px; }
    .itinerary-topbar { position: sticky; top: 0; background: rgba(251,245,236,0.95); backdrop-filter: blur(12px); padding: 16px 0; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--cream-deep); z-index: 10; margin-bottom: 32px; }
    .itinerary-topbar-back { display: flex; align-items: center; gap: 8px; background: none; border: 1.5px solid #E5E7EB; border-radius: 10px; padding: 8px 16px; font-family: 'Outfit'; font-size: 0.85rem; font-weight: 600; cursor: pointer; color: var(--ink); transition: all 0.2s; }
    .itinerary-topbar-back:hover { border-color: var(--saffron); color: var(--saffron); }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    @keyframes slideLeft { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

    .animate-fadeup { animation: fadeUp 0.7s ease forwards; }
    .animate-fadein { animation: fadeIn 0.5s ease forwards; }
    .spinner { animation: spin 0.8s linear infinite; }
    .animate-pulse { animation: pulse 2s ease-in-out infinite; }
    .animate-slideLeft { animation: slideLeft 0.5s ease forwards; }

    .stagger-1 { animation-delay: 0.1s; opacity: 0; }
    .stagger-2 { animation-delay: 0.2s; opacity: 0; }
    .stagger-3 { animation-delay: 0.3s; opacity: 0; }
    .stagger-4 { animation-delay: 0.4s; opacity: 0; }
    .stagger-5 { animation-delay: 0.5s; opacity: 0; }

    /* ─── New: Generic scroll-reveal animation ──────────────── */
    .reveal {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity 0.7s cubic-bezier(.25,.8,.25,1), transform 0.7s cubic-bezier(.25,.8,.25,1);
      will-change: opacity, transform;
    }
    .reveal-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 12px;
    }

    .tag-badge { font-family: 'Outfit', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; }
    .price-strike { text-decoration: line-through; color: #9CA3AF; }
    .star-gold { color: #F59E0B; }
    .react-multi-carousel-dot--active button { background: var(--saffron) !important; }
    .react-multi-carousel-dot button { background: #D1D5DB !important; border: none !important; width: 8px !important; height: 8px !important; }

    /* ─── New: "Make Your Tour Memorable" intro section ─────── */
    .intro-section {
      max-width: 1400px; margin: 0 auto; padding: 90px 24px;
      display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: center;
    }
    .intro-img-wrap {
      position: relative; border-radius: 24px; overflow: hidden;
      box-shadow: 0 30px 80px rgba(15,25,35,0.18);
    }
    .intro-img-wrap img { width: 100%; height: 420px; object-fit: cover; display: block; }
    .intro-stats {
      display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin-top: 40px;
    }
    .intro-stat-num {
      font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 700;
      color: var(--saffron);
    }
    .intro-stat-label {
      font-family: 'Outfit', sans-serif; font-size: 0.8rem; color: var(--muted); margin-top: 4px;
    }

    /* ─── New: Best Place Destination grid ──────────────────── */
    .bpd-section { max-width: 1400px; margin: 0 auto; padding: 30px 24px 90px; }
    .bpd-grid {
      display: grid; grid-template-columns: repeat(4,1fr); gap: 24px;
    }
    .bpd-card {
      position: relative; border-radius: 20px; overflow: hidden; height: 260px;
      cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      transition: transform 0.4s cubic-bezier(.25,.8,.25,1), box-shadow 0.4s;
    }
    .bpd-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.16); }
    .bpd-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
    .bpd-card:hover img { transform: scale(1.08); }
    .bpd-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(15,25,35,0.75) 0%, rgba(15,25,35,0.05) 55%, rgba(15,25,35,0.35) 100%);
    }
    .bpd-name {
      position: absolute; top: 16px; left: 18px;
      font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 700; color: white;
    }
    .bpd-tours {
      position: absolute; bottom: 16px; right: 16px;
      background: var(--saffron); color: white; font-family: 'Outfit', sans-serif;
      font-size: 0.72rem; font-weight: 700; padding: 5px 12px; border-radius: 50px;
    }

    /* ─── New: Tour Destination grid (6 cards) ──────────────── */
    .td-section { max-width: 1400px; margin: 0 auto; padding: 30px 24px 90px; }
    .td-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; }
    .td-card-img-wrap { height: 230px; position: relative; }
    .td-price-tag {
      position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 50%);
      background: var(--saffron); color: white; font-family: 'Outfit', sans-serif;
      font-size: 0.95rem; font-weight: 700; padding: 10px 24px; border-radius: 50px;
      box-shadow: 0 4px 18px rgba(232,129,58,0.45); white-space: nowrap;
      z-index: 2;
    }
    .td-meta-row {
      display: flex; align-items: center; gap: 14px; font-family: 'Outfit', sans-serif;
      font-size: 0.78rem; color: var(--muted); margin-top: 10px; flex-wrap: wrap;
    }
    .td-meta-row span { display: flex; align-items: center; gap: 5px; }
    .td-location-row {
      display: flex; align-items: center; gap: 6px; font-family: 'Outfit', sans-serif;
      font-size: 0.8rem; color: #6B7280; margin-top: 6px;
    }
    .dest-card { padding-top: 4px; }
    .dest-card .td-card-img-wrap { overflow: visible; }
    .dest-card .td-card-img-wrap > img { border-radius: 20px 20px 0 0; }
    .dest-card .dest-card-img { overflow: visible; }

    /* ─── New: Tourist Feedback Section ─────────────────────── */
    .feedback-section {
      position: relative; padding: 100px 24px; overflow: hidden;
      background-color: #F1F2F4;
      background-image: url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1920&auto=format&fit=crop');
      background-size: cover; background-position: center bottom; background-repeat: no-repeat;
    }
    .feedback-section::before {
      content: ''; position: absolute; inset: 0;
      background: rgba(241,242,244,0.86);
    }
    .feedback-inner { position: relative; max-width: 1400px; margin: 0 auto; z-index: 1; }
    .feedback-scroll {
      display: flex; gap: 28px; margin-top: 56px;
      overflow-x: auto; scroll-behavior: smooth;
      padding-bottom: 8px; scrollbar-width: none;
    }
    .feedback-scroll::-webkit-scrollbar { display: none; }
    .feedback-card {
      background: white; border-radius: 16px; padding: 32px;
      box-shadow: 0 10px 40px rgba(15,25,35,0.06);
      flex: 0 0 calc((100% - 56px) / 3); min-width: 280px;
    }
    .feedback-text {
      font-family: 'Outfit', sans-serif; font-size: 0.95rem; color: #6B7280;
      line-height: 1.75; margin-bottom: 28px; min-height: 130px;
    }
    .feedback-person { display: flex; align-items: center; gap: 16px; }
    .feedback-avatar {
      width: 56px; height: 56px; border-radius: 50%; object-fit: cover; flex-shrink: 0;
    }
    .feedback-name {
      font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 700; color: var(--ink);
    }
    .feedback-role {
      font-family: 'Outfit', sans-serif; font-size: 0.8rem; color: #B0B5BD; margin-top: 2px;
    }
    .feedback-dots { display: flex; justify-content: center; gap: 8px; margin-top: 48px; }
    .feedback-dot {
      width: 9px; height: 9px; border-radius: 50%; border: none; cursor: pointer; padding: 0;
      background: #D1D5DB; transition: background 0.3s;
    }
    .feedback-dot.active { background: var(--saffron); }

    @media(max-width:1024px) {
      .intro-section { grid-template-columns: 1fr; gap: 40px; }
      .bpd-grid { grid-template-columns: repeat(2,1fr); }
      .td-grid { grid-template-columns: repeat(2,1fr); }
      .feedback-card { flex: 0 0 calc((100% - 28px) / 2); }
    }
    @media(max-width:640px) {
      .bpd-grid { grid-template-columns: 1fr 1fr; }
      .td-grid { grid-template-columns: 1fr; }
      .intro-stats { grid-template-columns: repeat(3,1fr); gap: 12px; }
      .intro-stat-num { font-size: 1.6rem; }
      .feedback-card { flex: 0 0 85%; }
    }

    @media(max-width:768px) {
      .hide-mobile { display: none !important; }
      .wishlist-drawer { width: 100%; }
    }
    @media(min-width:769px) {
      .hide-desktop { display: none !important; }
    }
  `}</style>
);

// Skeleton Card
const SkeletonCard = () => (
  <div
    style={{
      borderRadius: 20,
      overflow: "hidden",
      background: "white",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    }}
  >
    <div className="skeleton" style={{ height: 200 }} />
    <div style={{ padding: 16 }}>
      <div className="skeleton" style={{ height: 20, marginBottom: 10 }} />
      <div
        className="skeleton"
        style={{ height: 14, width: "60%", marginBottom: 16 }}
      />
      <div className="skeleton" style={{ height: 36, borderRadius: 50 }} />
    </div>
  </div>
);

// Section Skeleton (for lazy-loaded sections)
const SectionSkeleton = () => (
  <div style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 24px" }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
        gap: 24,
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

// Navbar
const Navbar = ({ wishlistCount, onWishlistOpen, onBookNow }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`dvd-nav ${scrolled ? "scrolled" : ""}`}>
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 24px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background:
                "linear-gradient(135deg, var(--saffron), var(--saffron-dark))",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaCompass style={{ color: "white", fontSize: 16 }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "white",
                lineHeight: 1,
              }}
            >
              Desi V Desi
            </div>
            <div
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.62rem",
                color: "var(--saffron-light)",
                letterSpacing: 2,
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Tours & Travel
            </div>
          </div>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onWishlistOpen}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              color: "white",
              fontSize: "1.1rem",
              padding: 8,
            }}
          >
            <FaHeart />
            {wishlistCount > 0 && (
              <span
                className="fab-badge"
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  width: 18,
                  height: 18,
                  fontSize: "0.65rem",
                  border: "2px solid transparent",
                  background: "var(--saffron)",
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>
          <button
            onClick={onBookNow}
            className="btn-primary"
            style={{ padding: "10px 22px", fontSize: "0.85rem" }}
          >
            Book Now
          </button>
          <button
            className="hide-desktop"
            onClick={() => setMobileOpen((p) => !p)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "1.3rem",
              cursor: "pointer",
            }}
          >
            <FaBars />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div
          style={{
            background: "rgba(15,25,35,0.97)",
            padding: "20px 24px",
            borderTop: "1px solid var(--glass-border)",
          }}
        >
          {["Destinations", "About"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="nav-link"
              style={{
                display: "block",
                padding: "14px 0",
                fontSize: "1rem",
                borderBottom: "1px solid var(--glass-border)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

//  Hero Section
const HeroSection = React.memo(({ onBookNow, onSearch }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [searchTab, setSearchTab] = useState("destination");

  const slides = useMemo(
    () => [
      {
        img: "https://img.magnific.com/premium-photo/aerial-view-putra-mosque-with-putrajaya-city-centre-with-lake-sunset-putrajaya-malaysia_29505-1020.jpg?semt=ais_hybrid&w=740&q=80",
        tag: "International",
        title: "Discover\nMalaysia",
        sub: "Rainforests, Towers & Timeless Culture",
        cta: "View Packages",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL3HTEZllU3Bj7_w_Ud7__3ey4KhpMdR4aog&s",
        tag: "North East",
        title: "Enchanting\nAssam",
        sub: "Tea Gardens, Wildlife & Brahmaputra Sunsets",
        cta: "Explore Now",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUTwbPnL0BhEJTcyfY9qoVCuhPTEsl-VzT5YJruWvqP4KA2SvxfOUG-jNt&s=10",
        tag: "International",
        title: "Golden\nDubai",
        sub: "Desert Dunes, Skylines & Arabian Nights",
        cta: "Book Trip",
      },
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsYnp5Q1REhLvebW-nWF5p1uph1w4znd2y5NSw6aUkL92ycifpM5pER4wB&s=10",
        tag: "Scenic India",
        title: "Sacred\nHimalayas",
        sub: "Monasteries, Peaks & Spiritual Journeys",
        cta: "Explore",
      },
    ],
    [],
  );

  useEffect(() => {
    const t = setInterval(
      () => setActiveSlide((p) => (p + 1) % slides.length),
      5500,
    );
    return () => clearInterval(t);
  }, [slides.length]);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      onSearch(searchValue);
    },
    [onSearch, searchValue],
  );

  return (
    <div className="hero-container">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`hero-slide ${i === activeSlide ? "active" : "inactive"}`}
        >
          <img
            src={s.img}
            alt={s.tag}
            className="hero-img"
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
          />
          <div className="hero-overlay" />
        </div>
      ))}
      <div
        className="hero-content"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: 72,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 24px",
            width: "100%",
          }}
        >
          <div
            key={`tag-${activeSlide}`}
            className="animate-fadeup stagger-1"
            style={{ marginBottom: 16 }}
          >
            <span
              className="tag-badge"
              style={{ background: "var(--saffron)", color: "white" }}
            >
              {slides[activeSlide].tag}
            </span>
          </div>
          <h1
            key={`title-${activeSlide}`}
            className="animate-fadeup stagger-2"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(3rem,8vw,6.5rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.05,
              marginBottom: 16,
              whiteSpace: "pre-line",
              maxWidth: 700,
            }}
          >
            {slides[activeSlide].title}
          </h1>
          <p
            key={`sub-${activeSlide}`}
            className="animate-fadeup stagger-3"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(0.95rem,2vw,1.15rem)",
              color: "rgba(255,255,255,0.75)",
              marginBottom: 40,
              fontWeight: 300,
              maxWidth: 460,
            }}
          >
            {slides[activeSlide].sub}
          </p>
          <div
            key={`search-${activeSlide}`}
            className="animate-fadeup stagger-4"
            style={{ maxWidth: 640 }}
          >
            <div className="search-container">
              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {["destination", "package", "date"].map((t) => (
                  <button
                    key={t}
                    className={`search-tab ${searchTab === t ? "active" : ""}`}
                    onClick={() => setSearchTab(t)}
                    style={{ textTransform: "capitalize" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <form
                onSubmit={handleSearch}
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "4px 16px",
                    borderRadius: 12,
                    border: "1.5px solid #E5E7EB",
                  }}
                >
                  <FaSearch style={{ color: "#9CA3AF", flexShrink: 0 }} />
                  <input
                    className="search-input"
                    placeholder={
                      searchTab === "destination"
                        ? "Where do you want to go?"
                        : searchTab === "package"
                          ? "Search tour packages..."
                          : "Pick a travel date..."
                    }
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: "14px 28px",
                    fontSize: "0.9rem",
                    borderRadius: 12,
                    flexShrink: 0,
                  }}
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() =>
          setActiveSlide((p) => (p - 1 + slides.length) % slides.length)
        }
        style={{
          position: "absolute",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "white",
          fontSize: "1.2rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 4,
        }}
      >
        ‹
      </button>
      <button
        onClick={() => setActiveSlide((p) => (p + 1) % slides.length)}
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "white",
          fontSize: "1.2rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 4,
        }}
      >
        ›
      </button>
    </div>
  );
});

// Stats Bar
const StatsBar = React.memo(() => (
  <div style={{ background: "var(--forest)", padding: "28px 24px" }}>
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 20,
      }}
    >
      {[
        { val: "36+", label: "Years Experience", icon: <FaTrophy /> },
        { val: "5k+", label: "Happy Travellers", icon: <FaUsers /> },
        { val: "200+", label: "Tour Packages", icon: <FaMapMarkedAlt /> },
        { val: "4.9★", label: "Average Rating", icon: <FaStar /> },
      ].map((s, i) => (
        <div
          key={i}
          className="stat-ticker"
          style={{ borderColor: "var(--saffron)" }}
        >
          <div
            style={{
              color: "var(--saffron)",
              marginBottom: 4,
              fontSize: "0.9rem",
            }}
          >
            {s.icon}
          </div>
          <div
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "white",
              lineHeight: 1,
            }}
          >
            {s.val}
          </div>
          <div
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.55)",
              marginTop: 4,
              letterSpacing: 0.5,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  </div>
));

// Weather + Currency Widgets
const WidgetsRow = React.memo(() => {
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState(null);
  const [toCurrency, setToCurrency] = useState("USD");
  const [rates, setRates] = useState(null);
  const [currencyList, setCurrencyList] = useState([]);
  const [ratesStatus,setRatesStatus] = useState('loading');
  const [lastUpdated, setLastUpdated] = useState(null);

  const weatherData = useMemo(
    () => [
      { city: "Mumbai", temp: 32, icon: <FaSun />, desc: "Sunny" },
      { city: "Delhi", temp: 28, icon: <FaWind />, desc: "Windy" },
      { city: "Goa", temp: 34, icon: <FaSun />, desc: "Clear" },
    ],
    [],
  );
  const [activeCity, setActiveCity] = useState(0);

  // Live Currency EndPoints
const RATES_API_URL = "https://open.er-api.com/v6/latest/INR"
   const fetchRates = useCallback(() => {
    setRatesStatus("loading");
    const controller = new AbortController();
    fetch(RATES_API_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Rates API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data?.result !== "success" || !data?.rates) {
          throw new Error("Unexpected rates response shape");
        }
        // Exclude INR itself since it's the base currency (rate = 1, converting to it is a no-op here)
        const codes = Object.keys(data.rates)
          .filter((c) => c !== "INR")
          .sort();

        setRates(data.rates);
        setCurrencyList(codes);
        setToCurrency((prev) => (codes.includes(prev) ? prev : codes[0] || "USD"));
        setLastUpdated(data.time_last_update_utc || null);
        setRatesStatus("live");
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          console.error("Currency rates fetch failed:", e);
          setRatesStatus("error");
        }
      });
    return controller;
  }, []);

  useEffect(() => {
    const controller = fetchRates();
    return () => controller.abort();
  }, [fetchRates]);

  useEffect(() => {
    const t = setInterval(
      () => setActiveCity((p) => (p + 1) % weatherData.length),
      3000,
    );
    return () => clearInterval(t);
  }, [weatherData.length]);

  const convert = useCallback(() => {
    if (!amount) return;
    setConverted((parseFloat(amount) * rates[toCurrency]).toFixed(2));
  }, [amount, rates, toCurrency]);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 24px 0" }}>
      {/* <HotelHeader/> */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 20,
        }}
      >
        <div className="weather-card">
          <div
            style={{
              fontSize: "0.75rem",
              fontFamily: "Outfit",
              letterSpacing: 2,
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: 12,
            }}
          >
            Travel Weather
          </div>
          <div
            key={activeCity}
            className="animate-slideLeft"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {weatherData[activeCity].temp}°C
              </div>
              <div
                style={{
                  fontFamily: "Outfit",
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                {weatherData[activeCity].city}
              </div>
              <div
                style={{
                  fontFamily: "Outfit",
                  fontSize: "0.8rem",
                  opacity: 0.7,
                }}
              >
                {weatherData[activeCity].desc}
              </div>
            </div>
            <div style={{ fontSize: "3.5rem", opacity: 0.9 }}>
              {weatherData[activeCity].icon}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {weatherData.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCity(i)}
                style={{
                  width: i === activeCity ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: "none",
                  background:
                    i === activeCity
                      ? "var(--saffron)"
                      : "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
        <div className="currency-card">
          <div
            style={{
              fontSize: "0.75rem",
              fontFamily: "Outfit",
              letterSpacing: 2,
              textTransform: "uppercase",
              opacity: 0.85,
              marginBottom: 12,
            }}
          >
            Currency Converter
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.2)",
                borderRadius: 10,
                padding: "8px 12px",
              }}
            >
              <FaRupeeSign style={{ flexShrink: 0 }} />
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount ₹"
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontFamily: "Outfit",
                  fontSize: "0.95rem",
                  width: "100%",
                }}
              />
            </div>
            <select
  value={toCurrency}
  onChange={(e) => setToCurrency(e.target.value)}
  style={{
    background: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: 10,
    color: "white",
    padding: "8px 12px",
    fontFamily: "Outfit",
    cursor: "pointer",
    fontSize: "0.9rem",
    maxWidth: 100,
  }}
>
  {currencyList.map((c) => (
    <option
      key={c}
      value={c}
      style={{ background: "var(--saffron-dark)", color: "white" }}
    >
      {c}
    </option>
  ))}
</select>
          </div>
          <button
            onClick={convert}
            style={{
              width: "100%",
              padding: "10px",
              background: "rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 10,
              color: "white",
              fontFamily: "Outfit",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Convert
          </button>
          {converted && (
            <div
              style={{
                marginTop: 12,
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.8rem",
                fontWeight: 700,
              }}
            >
              {converted} {toCurrency}
            </div>
          )}
        </div>
        <div
          style={{
            background: "var(--ink)",
            borderRadius: 20,
            padding: 24,
            color: "white",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontFamily: "Outfit",
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--saffron)",
              marginBottom: 16,
            }}
          >
            Need Help?
          </div>
          <div
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.4rem",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Talk to Our Travel Experts
          </div>
          {[
<<<<<<< HEAD
            { icon: <FaPhone />, label: "+91 98765 43210" },
=======
            { icon: <FaPhone />, label: "+91 788825150" },
>>>>>>> 26735bd518f50108e31c192ffdf5dc9e20e7f788
            { icon: <FaWhatsapp />, label: "WhatsApp Us" },
            { icon: <FaEnvelope />, label: "info@desivdesi.com" },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
                fontFamily: "Outfit",
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              <span style={{ color: "var(--saffron)" }}>{c.icon}</span>
              {c.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const IntroSection = React.memo(({ onBookNow }) => (
  <section className="intro-section">
    <Reveal className="intro-img-wrap">
      <img
        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/31/e2/f4/30/caption.jpg?w=1200&h=1200&s=1"
        alt="Adventure tour"
        loading="lazy"
        decoding="async"
      />
    </Reveal>
    <Reveal delay={150}>
      <div className="section-eyebrow" style={{ marginBottom: 12 }}>
        Why Choose Us
      </div>
      <h2 className="section-title" style={{ marginBottom: 18 }}>
        Make Your Tour <em style={{ color: "var(--saffron)" }}>Memorable</em>{" "}
        and Safe With Us
      </h2>
      <p
        style={{
          fontFamily: "Outfit",
          fontSize: "0.95rem",
          color: "#6B7280",
          lineHeight: 1.8,
          maxWidth: 520,
        }}
      >
        Far far away, behind the word mountains, far from the countries Vokalia
        and Consonantia, there live the blind texts. Separated they live in
        Bookmarksgrove right at the coast of the Semantics, a large language
        ocean.
      </p>
      <div className="intro-stats">
        {[
          { num: "300", label: "Successful Tours" },
          { num: "24,000", label: "Happy Tourist" },
          { num: "200", label: "Place Explored" },
        ].map((s, i) => (
          <div key={i}>
            <div className="intro-stat-num">{s.num}</div>
            <div className="intro-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <button
        onClick={onBookNow}
        className="btn-primary"
        style={{ marginTop: 40, padding: "14px 34px", fontSize: "0.9rem" }}
      >
        Plan Your Trip{" "}
        <FaArrowRight style={{ marginLeft: 8, display: "inline" }} />
      </button>
    </Reveal>
  </section>
));

const BestPlaceSection = React.memo(() => {
  const places = useMemo(
    () => [
      {
        name: "Singapore",
        img: "https://media.istockphoto.com/id/1767504971/photo/gatineau-hills-ottawa-canada-autumn-landscape.jpg?s=612x612&w=0&k=20&c=43KxWbUigZwDVwjaoZNYM69HMU1cM3_ArJuVePIB5tw=",
        tours: "8 Tours",
      },
      {
        name: "Canada",
        img: "https://media.istockphoto.com/id/471926619/photo/moraine-lake-at-sunrise-banff-national-park-canada.jpg?s=612x612&w=0&k=20&c=mujiCtVk5QA697SD3d8V8BGmd91-8HlxCNHkolEA0Bo=",
        tours: "2 Tours",
      },
      {
        name: "Thailand",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJPQob5A1Ha53coRBqaL4PviivzEIBrPnV2dtfVm5YgjL6RNwJQLMGrCE&s=10",
        tours: "5 Tours",
      },
      {
        name: "Australia",
        img: "https://media.istockphoto.com/id/504539120/photo/sydney-waterfront-at-night.jpg?s=612x612&w=0&k=20&c=sGo2c5ZNOeU43KLGc5DV8Qlsnqa1VJxLu0YwuQf7mGs=",
        tours: "5 Tours",
      },
    ],
    [],
  );

  return (
    <section className="bpd-section" id="destinations">
      <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
        <div className="section-eyebrow" style={{ marginBottom: 10 }}>
          Top Picks
        </div>
        <h2 className="section-title">
          Best Place <em style={{ color: "var(--saffron)" }}>Destination</em>
        </h2>
      </Reveal>
      <div className="bpd-grid">
        {places.map((p, i) => (
          <Reveal key={i} delay={i * 100} className="bpd-card">
            <img src={p.img} alt={p.name} loading="lazy" decoding="async" />
            <div className="bpd-overlay" />
            <div className="bpd-name">{p.name}</div>
            <div className="bpd-tours">{p.tours}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
});

const FeedbackSection = React.memo(() => {
  const feedbacks = useMemo(
    () => [
      {
        text: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
        name: "Roger Scott",
        role: "Marketing Manager",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      },
      {
        text: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
        name: "Roger Scott",
        role: "Marketing Manager",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      },
      {
        text: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
        name: "Roger Scott",
        role: "Marketing Manager",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      },
      {
        text: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
        name: "Roger Scott",
        role: "Marketing Manager",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      },
      {
        text: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
        name: "Roger Scott",
        role: "Marketing Manager",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      },
      {
        text: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
        name: "Roger Scott",
        role: "Marketing Manager",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      },
    ],
    [],
  );

  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const timer = setInterval(() => {
      const cardWidth = el.firstChild ? el.firstChild.offsetWidth + 28 : 300; // card + gap
      const maxScroll = el.scrollWidth - el.clientWidth;
      let next = el.scrollLeft + cardWidth;
      if (next >= maxScroll - 5) {
        next = 0;
      }
      el.scrollTo({ left: next, behavior: "smooth" });
    }, 1500);
    return () => clearInterval(timer);
  }, [feedbacks.length]);

  // ─── Keep dots in sync with scroll position ─────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const cardWidth = el.firstChild ? el.firstChild.offsetWidth + 28 : 300;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveDot(Math.min(idx, feedbacks.length - 1));
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [feedbacks.length]);

  const scrollToCard = useCallback((i) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstChild ? el.firstChild.offsetWidth + 28 : 300;
    el.scrollTo({ left: i * cardWidth, behavior: "smooth" });
  }, []);

  return (
    <section className="feedback-section">
      <div className="feedback-inner">
        <Reveal style={{ textAlign: "center" }}>
          <div className="section-eyebrow" style={{ marginBottom: 10 }}>
            What People Say
          </div>
          <h2 className="section-title">
            Tourist <em style={{ color: "var(--saffron)" }}>Feedback</em>
          </h2>
        </Reveal>
        <div className="feedback-scroll" ref={scrollRef}>
          {feedbacks.map((f, i) => (
            <div key={i} className="feedback-card">
              <p className="feedback-text">{f.text}</p>
              <div className="feedback-person">
                <img
                  className="feedback-avatar"
                  src={f.avatar}
                  alt={f.name}
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <div className="feedback-name">{f.name}</div>
                  <div className="feedback-role">{f.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="feedback-dots">
          {feedbacks.map((_, i) => (
            <button
              key={i}
              className={`feedback-dot ${i === activeDot ? "active" : ""}`}
              onClick={() => scrollToCard(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

const TourCard = React.memo(
  ({ card, onFavourite, isFav, onBookNow, onRate, rating }) => (
    <div className="dest-card">
      <div className="dest-card-img td-card-img-wrap">
        <img
          src={card.img || "/placeholder.jpg"}
          alt={card.title}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          // onError={e => e.target.src = '/placeholder.jpg'}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
            borderRadius: "20px 20px 0 0",
          }}
        />
        <button
          onClick={() => onFavourite(card._id)}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s",
          }}
        >
          <FaHeart
            style={{ color: isFav ? "#E85757" : "#D1D5DB", fontSize: "0.9rem" }}
          />
        </button>
        <span className="td-price-tag">{card.price || "$300"}/person</span>
      </div>
      <div style={{ padding: "24px 20px 20px" }}>
        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "var(--ink)",
            marginBottom: 2,
          }}
        >
          {card.title}
        </div>
        <div className="td-location-row">
          <FaMapMarkerAlt style={{ color: "var(--saffron)" }} />
          {card.category || "Bali, Indonesia"}
        </div>
        <div className="td-meta-row">
          <span>
            <FaUsers style={{ color: "var(--saffron)" }} /> {card.people || 2}
          </span>
          <span>
            <FaClock style={{ color: "var(--saffron)" }} /> {card.days || 3}
          </span>
          <span>
            <FaMountain style={{ color: "var(--saffron)" }} />{" "}
            {card.terrain || "Near Mountain"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 3, margin: "14px 0 4px" }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => onRate(card._id, s)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "1.1rem",
                color: s <= (rating || 0) ? "#F59E0B" : "#E5E7EB",
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </div>
  ),
);

const WishlistDrawer = React.memo(({ open, onClose, wishlist, items }) => {
  const savedItems = useMemo(
    () => items.filter((item) => wishlist.includes(item._id)),
    [items, wishlist],
  );
  return (
    <>
      <div
        className={`wishlist-overlay ${open ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`wishlist-drawer ${open ? "open" : ""}`}>
        <div
          style={{
            padding: "24px 24px 16px",
            borderBottom: "1px solid #F3F4F6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              My Wishlist
            </h3>
            <div
              style={{
                fontFamily: "Outfit",
                fontSize: "0.8rem",
                color: "#9CA3AF",
                marginTop: 2,
              }}
            >
              {savedItems.length} destinations saved
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.1rem",
              cursor: "pointer",
              color: "#6B7280",
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaTimes />
          </button>
        </div>
        <div style={{ padding: 16, overflowY: "auto" }}>
          {savedItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px" }}>
              <FaHeart
                style={{
                  fontSize: "2.5rem",
                  color: "#E5E7EB",
                  marginBottom: 16,
                }}
              />
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: "#9CA3AF",
                  marginBottom: 8,
                }}
              >
                No Saved Trips Yet
              </div>
              <div
                style={{
                  fontFamily: "Outfit",
                  fontSize: "0.85rem",
                  color: "#D1D5DB",
                }}
              >
                Tap the heart icon on any destination to save it here.
              </div>
            </div>
          ) : (
            savedItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "14px 0",
                  borderBottom: "1px solid #F9FAFB",
                }}
              >
                <img
                  src={getImageUrl(item.images || item.image || item.img)}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 12,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--ink)",
                      marginBottom: 3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "0.75rem",
                      color: "#9CA3AF",
                      marginBottom: 8,
                    }}
                  >
                    India • 4.8 ★
                  </div>
                  <Link
                    to="/Maharashtra"
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--saffron)",
                      textDecoration: "none",
                    }}
                  >
                    View Package →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
});

// ─── Itinerary Overlay ─────────────────────────────────────────
// const ItineraryOverlay = ({ itinerary, onPlanAgain }) => (
//   <div className="itinerary-overlay">
//     <div className="itinerary-overlay-inner">
//       <div className="itinerary-topbar">
//         <button className="itinerary-topbar-back" onClick={onPlanAgain}>
//           ← Plan Another Trip
//         </button>
//         <div
//           style={{
//             fontFamily: "Cormorant Garamond, serif",
//             fontSize: "1.1rem",
//             fontWeight: 700,
//             color: "var(--ink)",
//           }}
//         >
//           Your AI Itinerary ✨
//         </div>
//       </div>
//       <ItineraryResult itinerary={itinerary} onPlanAgain={onPlanAgain} />
//       {/* <ItineraryTimeline itinerary={itinerary}  /> */}
//     </div>
//   </div>
// );

// ─── About Section ─────────────────────────────────────────────
const AboutSection = React.memo(({ onBookNow }) => {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const testimonials = useMemo(
    () => [
      {
        text: "The best travel experience I've ever had! Desi V Desi made every moment magical.",
        author: "Priya S.",
        role: "Solo Traveler",
        avatar: "P",
      },
      {
        text: "Perfectly planned trip, seamless booking. Our family had an absolutely wonderful time!",
        author: "Rajesh K.",
        role: "Family Trip",
        avatar: "R",
      },
      {
        text: "Excellent service and truly amazing tours. I've now booked three trips with them!",
        author: "Anjali M.",
        role: "Frequent Traveler",
        avatar: "A",
      },
      {
        text: "From the first booking to the last day — everything was seamless and beautiful.",
        author: "Sunil T.",
        role: "Honeymoon Package",
        avatar: "S",
      },
    ],
    [],
  );

  useEffect(() => {
    const t = setInterval(
      () => setTestimonialIdx((p) => (p + 1) % testimonials.length),
      4000,
    );
    return () => clearInterval(t);
  }, [testimonials.length]);

  return (
    <section
      id="about"
      style={{
        background: "var(--ink)",
        padding: "96px 0",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-eyebrow" style={{ marginBottom: 12 }}>
            Our Story
          </div>
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(2.2rem,5vw,4rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
            }}
          >
            Welcome to <em style={{ color: "var(--saffron)" }}>Desi V Desi</em>{" "}
            Tours
          </h2>
          <p
            style={{
              fontFamily: "Outfit",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.5)",
              marginTop: 14,
              maxWidth: 500,
              margin: "14px auto 0",
            }}
          >
            36 years of crafting unforgettable journeys across India and the
            world.
          </p>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 24,
          }}
        >
          <Reveal delay={0} className="glass-card" style={{ padding: 32 }}>
            <div style={{ display: "flex", gap: 18, marginBottom: 24 }}>
              <img
                src="/photo2.jpg"
                alt="Founder"
                loading="lazy"
                decoding="async"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 16,
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "2px solid var(--saffron)",
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  Mr. Sonwane
                </div>
                <div
                  style={{
                    fontFamily: "Outfit",
                    fontSize: "0.75rem",
                    color: "var(--saffron-light)",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}
                >
                  Founder & CEO
                </div>
              </div>
            </div>
            <p
              style={{
                fontFamily: "Outfit",
                fontSize: "0.88rem",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.75,
                fontStyle: "italic",
              }}
            >
              "We are one of the leading tour operators in Maharashtra for the
              last 36 years, known as experts in Domestic as well as
              International tours."
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 14 }}>
              {[
                <FaFacebook />,
                <FaInstagram />,
                <FaTwitter />,
                <FaYoutube />,
              ].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal
            delay={120}
            className="glass-card"
            style={{ padding: 32, display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                color: "var(--saffron)",
                fontSize: "2.5rem",
                fontFamily: "Cormorant Garamond, serif",
                lineHeight: 1,
                marginBottom: 16,
              }}
            >
              "
            </div>
            <div
              key={testimonialIdx}
              className="animate-fadeup"
              style={{ flex: 1 }}
            >
              <p
                style={{
                  fontFamily: "Outfit",
                  fontSize: "0.92rem",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.75,
                  fontStyle: "italic",
                  marginBottom: 20,
                }}
              >
                {testimonials[testimonialIdx].text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "var(--saffron)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {testimonials[testimonialIdx].avatar}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    {testimonials[testimonialIdx].author}
                  </div>
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "0.75rem",
                      color: "var(--saffron-light)",
                    }}
                  >
                    {testimonials[testimonialIdx].role}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 24 }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  style={{
                    width: i === testimonialIdx ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    border: "none",
                    background:
                      i === testimonialIdx
                        ? "var(--saffron)"
                        : "rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </Reveal>
          <Reveal
            delay={240}
            style={{
              background:
                "linear-gradient(135deg, var(--saffron), var(--saffron-dark))",
              borderRadius: 20,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "Outfit",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Plan Your Dream Trip
              </div>
              <h3
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.2,
                  marginBottom: 16,
                }}
              >
                Ready for Your Next Adventure?
              </h3>
              <p
                style={{
                  fontFamily: "Outfit",
                  fontSize: "0.88rem",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.6,
                }}
              >
                Join 15,000+ happy travellers who trust Desi V Desi for their
                dream vacations.
              </p>
            </div>
            <div
              style={{
                marginTop: 32,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <button
                onClick={onBookNow}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "white",
                  border: "none",
                  borderRadius: 14,
                  fontFamily: "Outfit",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "var(--saffron-dark)",
                  cursor: "pointer",
                }}
              >
                Book Your Tour Now →
              </button>
              <a
<<<<<<< HEAD
                href="tel:+919876543210"
=======
                href="tel:+917888251550"
>>>>>>> 26735bd518f50108e31c192ffdf5dc9e20e7f788
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  padding: "13px",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 14,
                  fontFamily: "Outfit",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <FaPhone size={13} /> Call Us Now
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
});

function HomePage() {
  const { user } = useContext(AuthContext);
  const [showBooking, setShowBooking] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [ratings, setRatings] = useState({});

  const [tourCards, setTourCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef(null);
  const intlRef = useRef(null);
  const northRef = useRef(null);
  const location = useLocation();
  const fetchDone = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (fetchDone.current) return;
    const controller = new AbortController();
    const sig = { signal: controller.signal };

    Promise.all([api.get("/favourites/getCards", sig)])
      .then(([cards, anim, states, intl]) => {
        setTourCards(cards.data || []);
        fetchDone.current = true;
      })
      .catch((e) => {
        if (e.name !== "AbortError" && e.name !== "CanceledError")
          console.error(e);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const handleBookNow = useCallback(() => {
    if (!user) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } else setShowBooking(true);
  }, [user]);

  const handleItinerary = useCallback((data) => {
    setItinerary(data);
    setShowPlanner(false);
  }, []);

  const handlePlanAgain = useCallback(() => {
    setItinerary(null);
    setShowPlanner(true);
  }, []);

  const toggleFavourite = useCallback(
    async (id) => {
      if (!user) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }
      try {
        const res = await api.put(
          `/favourites/${id}/toggle`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const { status } = res.data;
        setWishlist((p) =>
          status === "like" ? [...p, id] : p.filter((fid) => fid !== id),
        );
      } catch (e) {
        console.error(e);
      }
    },
    [user],
  );

  const sixTourCards = useMemo(
    () => [
      {
        _id: "static-1",
        title: "Bali, Indonesia",
        category: "Bali, Indonesia",
        img: "https://media.istockphoto.com/id/653953140/photo/hindu-temple-in-bali.jpg?s=612x612&w=0&k=20&c=ysj3S2kV1ZgCr4QZWDzjvHRowCI3-cR1xQNnqE8-BS4=",
        price: "$300",
        people: 2,
        days: 3,
        terrain: "Near Mountain",
      },
      {
        _id: "static-2",
        title: "Bali, Indonesia",
        category: "Bali, Indonesia",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJbBbZr-ySYTs-Xxg3_qhmHozjHNIwLNHVNbkf5-tdZA&s=10",
        price: "$300",
        people: 2,
        days: 3,
        terrain: "Near Beach",
      },
      {
        _id: "static-3",
        title: "Bali, Indonesia",
        category: "Bali, Indonesia",
        img: "https://www.indietraveller.co/wp-content/uploads/2025/06/Bali-swing-at-tegalalang-rice-terrace-in-Bali-Indonesia-1024x683.jpg",
        price: "$300",
        people: 2,
        days: 3,
        terrain: "Near Mountain",
      },
      {
        _id: "static-4",
        title: "Bali, Indonesia",
        category: "Bali, Indonesia",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwRyAwB50NWpst9amktR46lDJLXVIm5bDPTmDLQsG1lA&s=10",
        price: "$300",
        people: 2,
        days: 3,
        terrain: "Near Beach",
      },
      {
        _id: "static-5",
        title: "Bali, Indonesia",
        category: "Bali, Indonesia",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw1t7dcZ7C52q-Z28XDICJxX2t2HsNeRnmApfauQGbzg&s=10",
        price: "$300",
        people: 2,
        days: 3,
        terrain: "Near Mountain",
      },
      {
        _id: "static-6",
        title: "Bali, Indonesia",
        category: "Bali, Indonesia",
        img: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTmT7nVGNmtggrureiKCReLjpk4sLJfzhgvKfzT2IbAtmXG2lDn",
        price: "$300",
        people: 2,
        days: 3,
        terrain: "Near Beach",
      },
    ],
    [],
  );

  return (
    <>
      <Header />
      <HotelHeader />
      <GlobalStyles />

      {/* Alert Toast */}
      {showAlert && (
        <div
          className="animate-fadeup"
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            background: "white",
            borderRadius: 16,
            padding: "14px 20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid #FDE68A",
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>🔐</span>
          <p
            style={{
              fontFamily: "Outfit",
              fontSize: "0.88rem",
              color: "#374151",
            }}
          >
            Please{" "}
            <Link
              to="/login"
              style={{ color: "var(--saffron)", fontWeight: 700 }}
            >
              log in
            </Link>{" "}
            to continue
          </p>
        </div>
      )}

      <HeroSection onBookNow={handleBookNow} onSearch={() => {}} />
      <StatsBar />
      <WidgetsRow />
      <IntroSection onBookNow={handleBookNow} />
      <BestPlaceSection />

      {/* Tour Destination — 6 cards */}
      <section className="td-section">
        <Reveal
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 48,
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div style={{ textAlign: "center", flex: "1 0 100%" }}>
            <div className="section-eyebrow" style={{ marginBottom: 10 }}>
              Curated For You
            </div>
            <h2 className="section-title">
              Tour <em style={{ color: "var(--saffron)" }}>Destination</em>
            </h2>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <button
              onClick={() => setShowPlanner(true)}
              className="btn-primary"
              style={{
                padding: "12px 24px",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FaCalendarAlt /> AI Trip Planner ✨
            </button>
          </div>
        </Reveal>

        <div className="td-grid">
          {sixTourCards.map((card, i) => (
            <Reveal key={card._id} delay={(i % 3) * 100}>
              <TourCard
                card={card}
                onFavourite={toggleFavourite}
                isFav={wishlist.includes(card._id)}
                onBookNow={handleBookNow}
                onRate={(id, s) => setRatings((p) => ({ ...p, [id]: s }))}
                rating={ratings[card._id]}
              />
            </Reveal>
          ))}
        </div>
      </section>
      <NewsletterSubscribe />

      {/* Testimonial */}
      <FeedbackSection />

      <div ref={aboutRef} id="about-us">
        <AboutSection onBookNow={handleBookNow} />
      </div>

      <div id="footer">
        <Footer />
      </div>

      {/* Modals */}
      {showBooking && (
        <BookingForm user={user} onClose={() => setShowBooking(false)} />
      )}

      <TripPlannerModal
        open={showPlanner}
        onClose={() => setShowPlanner(false)}
        onItinerary={handleItinerary}
      />

      {/* {itinerary && (
        <ItineraryOverlay itinerary={itinerary} onPlanAgain={handlePlanAgain} />
      )} */}

      <WishlistDrawer
        open={showWishlist}
        onClose={() => setShowWishlist(false)}
        wishlist={wishlist}
        items={tourCards}
      />

      <button className="fab-wishlist" onClick={() => setShowWishlist(true)}>
        <FaHeart />
        {wishlist.length > 0 && (
          <span className="fab-badge">{wishlist.length}</span>
        )}
      </button>

      {isVisible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            bottom: 100,
            right: 30,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "var(--ink)",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            zIndex: 800,
          }}
        >
          ↑
        </button>
      )}
    </>
  );
}

export default React.memo(HomePage);
