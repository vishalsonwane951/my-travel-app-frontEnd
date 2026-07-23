// pages/TourPackages/BaseTourPage.jsx
import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import TourPackageCard from "../../Components/TourPackageCard";
import PackageContext from "../../Context/PackageContext";
import { FaSearch, FaArrowUp, FaPhone, FaEnvelope, FaWhatsapp, FaFilter, FaTimes, FaSortAmountDown, FaThLarge, FaList, FaStar, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
// import Header from "../../Components/Header/Header";
import api from '../../utils/api.js'
import Header from "../../Components/Header/Header.jsx";

// ── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
    <div className="btb-skeleton-card">
      <div className="btb-skel btb-skel-img" />
      <div style={{ padding: '1.25rem' }}>
        <div className="btb-skel btb-skel-chip" />
        <div className="btb-skel btb-skel-line" style={{ width: '80%', marginTop: 8 }} />
        <div className="btb-skel btb-skel-line" style={{ width: '60%', marginTop: 8 }} />
        <div className="btb-skel btb-skel-line" style={{ width: '90%', marginTop: 8 }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <div className="btb-skel btb-skel-line" style={{ width: '40%', height: 10 }} />
          <div className="btb-skel btb-skel-line" style={{ width: '40%', height: 10 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, alignItems: 'center' }}>
          <div className="btb-skel btb-skel-line" style={{ width: '30%', height: 28 }} />
          <div className="btb-skel btb-skel-btn" />
        </div>
      </div>
    </div>
  </div>
);

// ── Live weather for destination ──────────────────────────────────────────────
const useDestWeather = (destination) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!destination) return;
    // Simulated — replace with Open-Meteo API call in production
    const weatherMap = {
      goa: { temp: 31, desc: 'Sunny & Humid', icon: '☀️', humidity: 78, uv: 8, best: 'Nov–Feb' },
      kerala: { temp: 28, desc: 'Partly Cloudy', icon: '⛅', humidity: 82, uv: 6, best: 'Sep–Mar' },
      rajasthan: { temp: 38, desc: 'Hot & Dry', icon: '🌤️', humidity: 25, uv: 10, best: 'Oct–Mar' },
      manali: { temp: 12, desc: 'Cool & Clear', icon: '🏔️', humidity: 60, uv: 4, best: 'May–Jun' },
      shimla: { temp: 15, desc: 'Misty', icon: '🌫️', humidity: 72, uv: 3, best: 'Mar–Jun' },
      default: { temp: 26, desc: 'Pleasant', icon: '🌤️', humidity: 65, uv: 5, best: 'Oct–Mar' },
    };
    setTimeout(() => {
      const key = destination.toLowerCase().split('-')[0];
      setData(weatherMap[key] || weatherMap.default);
    }, 800);
  }, [destination]);
  return data;
};

// ── Dynamic pricing hook ──────────────────────────────────────────────────────
const useDynamicPricing = () => {
  const [multiplier, setMultiplier] = useState(1);
  const [trend, setTrend] = useState('stable'); // 'rising' | 'falling' | 'stable'
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.48) * 0.05;
      setMultiplier(prev => {
        const next = Math.max(0.85, Math.min(1.25, prev + change));
        setTrend(next > prev ? 'rising' : next < prev ? 'falling' : 'stable');
        return next;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);
  return { multiplier, trend };
};

// ── Tour type metadata ────────────────────────────────────────────────────────
const TOUR_META = {
  'custom-tour':     { title: 'Custom Tours',     icon: '🎨', grad: 'linear-gradient(135deg, #5BC0EB, #E8F4FD)', desc: 'Personalized journeys built around your dreams.' },
  'adventure-tour':  { title: 'Adventure Tours',  icon: '🏔️', grad: 'linear-gradient(135deg, #5BC0EB, #E8F4FD)', desc: 'Thrilling experiences for the bold and brave.' },
  'family-tour':     { title: 'Family Tours',     icon: '👨‍👩‍👧‍👦', grad: 'linear-gradient(135deg, #FFE66D, #FFB347)', desc: 'Joyful journeys for every generation.' },
  'group-tour':      { title: 'Group Tours',      icon: '🚌', grad: 'linear-gradient(135deg, #A37BFF, #6B4EFF)', desc: 'Better together — explore as a community.' },
  'city-tour':       { title: 'City Tours',       icon: '🌆', grad: 'linear-gradient(135deg, #FF9F1C, #FCCF31)', desc: 'Uncover the soul of iconic cities.' },
  'honeymoon-tour':  { title: 'Honeymoon Tours',  icon: '💑', grad: 'linear-gradient(135deg, #FF6EB4, #FF9A9E)', desc: 'Romantic escapes crafted for two.' },
  'weekend-getaway': { title: 'Weekend Getaways', icon: '🌅', grad: 'linear-gradient(135deg, #5BC0EB, #0353A4)', desc: 'Escape the grind for a perfect 2-3 days.' },
  'luxury-tour':     { title: 'Luxury Tours',     icon: '💎', grad: 'linear-gradient(135deg, #C9A84C, #8B6914)', desc: 'Five-star experiences for discerning travelers.' },
  'pilgrimage-tour': { title: 'Pilgrimage Tours', icon: '🕌', grad: 'linear-gradient(135deg, #7BAE7F, #4A7C59)', desc: 'Sacred journeys that nourish the soul.' },
};

const SORT_OPTIONS = [
  { value: 'default',   label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc',label: 'Price: High to Low' },
  { value: 'rating',    label: 'Highest Rated' },
  { value: 'newest',    label: 'Newest First' },
  { value: 'popular',   label: 'Most Popular' },
];

const BaseTourPage = () => {
  const { type } = useParams();
  const { selectedType } = useContext(PackageContext);
  const packageType = type ? decodeURIComponent(type) : selectedType;

  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeDestination, setActiveDestination] = useState(null);
  const [resultsCount, setResultsCount] = useState(0);

  const packagesRef = useRef(null);
  const meta = TOUR_META[packageType] || TOUR_META['custom-tour'];
  const weather = useDestWeather(activeDestination);
  const { multiplier, trend } = useDynamicPricing();

  // const themeKey = packageType?.split("-")[0] || "custom";

  // ── Fetch packages ──────────────────────────────────────────────────────────
  useEffect(() => {

    console.log('packageType',packageType)
    if (!packageType) return; null
    const fetch_ = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/packages/${packageType}`
        );
        setPackages(res.data);
        console.log('package Data:',res.data)
        // Set first destination for weather
        if (res.data?.[0]?.location) setActiveDestination(res.data[1].location);
      } catch {
        setPackages([]);
      } finally {
        setTimeout(() => setLoading(false), 400); // min loading for skeleton UX
      }
    };
    fetch_();
  }, [packageType]);

  // ── Filter + Sort logic ─────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...packages];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    result = result.filter(p => {
      const price = p.durations?.[0]?.discountedPrice || p.durations?.[0]?.price || p.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    if (selectedDuration !== "all") {
      result = result.filter(p => p.duration?.includes(selectedDuration));
    }
    if (selectedRating > 0) {
      result = result.filter(p => (p.rating || 4.5) >= selectedRating);
    }
    // Sort
    switch (sortBy) {
      case 'price-asc':  result.sort((a,b) => (a.price||0) - (b.price||0)); break;
      case 'price-desc': result.sort((a,b) => (b.price||0) - (a.price||0)); break;
      case 'rating':     result.sort((a,b) => (b.rating||0) - (a.rating||0)); break;
      case 'popular':    result.sort((a,b) => (b.reviews||0) - (a.reviews||0)); break;
      default: break;
    }
    setFilteredPackages(result);
    setResultsCount(result.length);
  }, [packages, searchTerm, priceRange, selectedDuration, selectedRating, sortBy]);

  useEffect(() => {
    const h = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setPriceRange([0, 100000]);
    setSelectedDuration("all");
    setSelectedRating(0);
    setSortBy("default");
  }, []);

  const hasActiveFilters = searchTerm || priceRange[1] < 100000 || priceRange[0] > 0 || selectedDuration !== "all" || selectedRating > 0;

  const priceRangeText = priceRange[1] >= 100000
    ? `Up to ₹1L+`
    : `₹${(priceRange[0]/1000).toFixed(0)}k – ₹${(priceRange[1]/1000).toFixed(0)}k`;

  return (
    <>
    <Header/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&display=swap');
        :root {
          --font-body: 'DM Sans', sans-serif;
          --font-display: 'Cormorant Garamond', serif;
          --ease: cubic-bezier(0.4,0,0.2,1);
          --navy: #1a1a2e;
          --indigo: #3D52A0;
          --gold: #C9A84C;
        }
        * { box-sizing: border-box; }
        body { font-family: var(--font-body); }

        /* ── Skeleton ── */
        .btb-skeleton-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid #f0f0f8;
        }
        .btb-skel {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 400px 100%;
          animation: btb-shimmer 1.4s infinite;
          border-radius: 8px;
        }
        .btb-skel-img { height: 230px; border-radius: 0; }
        .btb-skel-chip { height: 22px; width: 100px; }
        .btb-skel-line { height: 12px; }
        .btb-skel-btn { height: 36px; width: 100px; border-radius: 50px; }
        @keyframes btb-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

        /* ── Hero ── */
        .btb-hero {
          position: relative;
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
        }
        .btb-hero-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          transition: transform 0.6s var(--ease);
        }
        .btb-hero:hover .btb-hero-bg { transform: scale(1.02); }
        .btb-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(10,10,30,0.2) 0%, rgba(10,10,30,0.8) 100%);
        }
        .btb-hero-content {
          position: relative; z-index: 2;
          padding: 3rem 2rem 2.5rem;
          max-width: 1300px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .btb-hero-left {}
        .btb-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.8);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .btb-hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 6vw, 4rem);
          font-weight: 700;
          color: white;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }
        .btb-hero-desc {
          font-size: 1rem;
          color: rgba(255,255,255,0.75);
          max-width: 500px;
          line-height: 1.6;
        }
        .btb-hero-right {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: flex-end;
        }

        /* Weather card */
        .btb-weather-card {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 16px;
          padding: 1rem 1.5rem;
          color: white;
          min-width: 200px;
        }
        .btb-weather-title { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.7; margin-bottom: 6px; }
        .btb-weather-main { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .btb-weather-temp { font-family: var(--font-display); font-size: 2rem; font-weight: 700; line-height: 1; }
        .btb-weather-desc { font-size: 0.85rem; opacity: 0.85; }
        .btb-weather-row { display: flex; gap: 1rem; font-size: 0.75rem; opacity: 0.7; }
        .btb-weather-best { font-size: 0.75rem; opacity: 0.8; margin-top: 4px; }

        /* Dynamic pricing badge */
        .btb-price-trend {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 50px;
          padding: 6px 14px;
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .btb-trend-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }

        /* ── Toolbar ── */
        .btb-toolbar {
          background: white;
          border-bottom: 1px solid #f0f0f8;
          position: sticky;
          top: 72px;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .btb-toolbar-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .btb-search-wrap {
          display: flex;
          background: #f8f9ff;
          border: 1.5px solid #e8eaf6;
          border-radius: 50px;
          overflow: hidden;
          flex: 1;
          min-width: 200px;
          max-width: 380px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .btb-search-wrap:focus-within {
          border-color: var(--indigo);
          box-shadow: 0 0 0 3px rgba(61,82,160,0.1);
        }
        .btb-search-input {
          flex: 1; padding: 0.6rem 1.1rem;
          border: none; outline: none;
          font-size: 0.88rem;
          background: transparent;
          font-family: var(--font-body);
          color: var(--navy);
        }
        .btb-search-icon {
          padding: 0 1rem;
          display: flex; align-items: center;
          color: #aaa;
        }

        .btb-filter-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 0.55rem 1.1rem;
          border: 1.5px solid #e8eaf6;
          border-radius: 50px;
          background: white;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          font-family: var(--font-body);
          color: var(--navy);
          transition: all 0.2s;
          white-space: nowrap;
        }
        .btb-filter-btn:hover, .btb-filter-btn.active {
          border-color: var(--indigo);
          color: var(--indigo);
          background: rgba(61,82,160,0.04);
        }
        .btb-filter-badge {
          background: var(--indigo);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 20px;
          min-width: 18px;
          text-align: center;
        }

        .btb-sort-select {
          padding: 0.55rem 1.1rem;
          border: 1.5px solid #e8eaf6;
          border-radius: 50px;
          background: white;
          font-size: 0.85rem;
          font-family: var(--font-body);
          color: var(--navy);
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s;
        }
        .btb-sort-select:focus { border-color: var(--indigo); }

        .btb-view-toggles {
          display: flex;
          background: #f8f9ff;
          border: 1.5px solid #e8eaf6;
          border-radius: 50px;
          overflow: hidden;
        }
        .btb-view-btn {
          padding: 0.5rem 0.9rem;
          border: none; cursor: pointer;
          background: transparent;
          color: #aaa;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .btb-view-btn.active { background: var(--indigo); color: white; }

        .btb-results-count {
          margin-left: auto;
          font-size: 0.82rem;
          color: #888;
          white-space: nowrap;
        }
        .btb-results-count strong { color: var(--navy); }

        /* ── Layout ── */
        .btb-layout {
          display: flex;
          max-width: 1300px;
          margin: 0 auto;
          padding: 2rem;
          gap: 2rem;
          align-items: flex-start;
          min-height: 60vh;
        }

        /* ── Sidebar ── */
        .btb-sidebar {
          width: 280px;
          flex-shrink: 0;
          background: white;
          border-radius: 20px;
          border: 1px solid #f0f0f8;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          position: sticky;
          top: 130px;
          overflow: hidden;
        }
        .btb-sidebar-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f0f0f8;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .btb-sidebar-title {
          font-size: 1rem; font-weight: 700; color: var(--navy);
        }
        .btb-reset-btn {
          font-size: 0.78rem; color: #FF6B6B;
          background: none; border: none; cursor: pointer;
          font-family: var(--font-body); font-weight: 600;
          display: flex; align-items: center; gap: 4px;
        }
        .btb-reset-btn:hover { text-decoration: underline; }
        .btb-sidebar-section {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f0f0f8;
        }
        .btb-sidebar-section:last-child { border-bottom: none; }
        .btb-sidebar-label {
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #888; margin-bottom: 0.9rem;
        }

        /* Price slider */
        .btb-price-display {
          font-size: 0.9rem; font-weight: 600; color: var(--indigo);
          margin-bottom: 0.75rem;
        }
        .btb-slider {
          -webkit-appearance: none;
          width: 100%; height: 4px;
          border-radius: 2px;
          background: linear-gradient(to right, var(--indigo) 0%, var(--indigo) 50%, #e8eaf6 50%, #e8eaf6 100%);
          outline: none; cursor: pointer;
        }
        .btb-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: var(--indigo);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(61,82,160,0.3);
          cursor: pointer;
        }

        /* Duration chips */
        .btb-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .btb-chip {
          padding: 5px 12px;
          border-radius: 50px;
          border: 1.5px solid #e8eaf6;
          background: white;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.2s;
          color: #555;
        }
        .btb-chip:hover { border-color: var(--indigo); color: var(--indigo); }
        .btb-chip.active {
          background: var(--indigo);
          border-color: var(--indigo);
          color: white;
        }

        /* Rating filter */
        .btb-rating-opts { display: flex; flex-direction: column; gap: 6px; }
        .btb-rating-opt {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 0; cursor: pointer;
          font-size: 0.85rem; color: #555;
          border: none; background: none;
          font-family: var(--font-body);
          text-align: left;
          transition: color 0.2s;
        }
        .btb-rating-opt:hover, .btb-rating-opt.active { color: var(--navy); font-weight: 600; }
        .btb-rating-stars { color: #FFD700; }
        .btb-radio {
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid #ddd;
          margin-left: auto;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .btb-radio.active { border-color: var(--indigo); }
        .btb-radio.active::after {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--indigo);
        }

        /* ── Main grid ── */
        .btb-main { flex: 1; min-width: 0; }
        .btb-grid { /* Bootstrap row class handles this */ }

        /* List view */
        .btb-list-card {
          display: flex;
          background: white;
          border-radius: 16px;
          border: 1px solid #f0f0f8;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          margin-bottom: 1rem;
          overflow: hidden;
          transition: transform 0.3s var(--ease), box-shadow 0.3s;
        }
        .btb-list-card:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }
        .btb-list-img {
          width: 420px; flex-shrink: 0;
          object-fit: cover;
          border-radius: 16px;
          height:280px
        }
        .btb-list-content {
          flex: 1; padding: 1.25rem 1.5rem;
          display: flex; flex-direction: column;
        }
        .btb-list-footer {
          margin-top: auto;
          display: flex; align-items: center; justify-content: space-between;
        }
        .btb-list-price {
          font-family: var(--font-display);
          font-size: 1.5rem; font-weight: 700;
          color: var(--indigo);
        }

        /* Empty state */
        .btb-empty {
          text-align: center;
          padding: 5rem 2rem;
        }
        .btb-empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
        .btb-empty-title {
          font-family: var(--font-display);
          font-size: 1.5rem; font-weight: 700;
          color: var(--navy); margin-bottom: 0.5rem;
        }
        .btb-empty-sub { color: #888; font-size: 0.9rem; margin-bottom: 1.5rem; }
        .btb-empty-btn {
          padding: 0.7rem 1.75rem;
          border-radius: 50px;
          border: none;
          background: var(--indigo);
          color: white;
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.9rem;
        }

        /* ── Contact strip ── */
        .btb-contact {
          padding: 4rem 2rem;
          text-align: center;
          color: white;
        }
        .btb-contact-title {
          font-family: var(--font-display);
          font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;
        }
        .btb-contact-sub { opacity: 0.85; margin-bottom: 2rem; }
        .btb-contact-row {
          display: flex; justify-content: center;
          gap: 1.5rem; flex-wrap: wrap;
        }
        .btb-contact-item {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-size: 0.9rem; font-weight: 500;
          text-decoration: none; color: white;
          transition: all 0.2s;
        }
        .btb-contact-item:hover { background: rgba(255,255,255,0.2); }

        /* Scroll top */
        .btb-scroll-top {
          position: fixed;
          bottom: 2rem; right: 2rem;
          width: 46px; height: 46px;
          border-radius: 50%;
          border: none; cursor: pointer;
          color: white;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          transition: all 0.3s var(--ease);
          z-index: 200;
          font-size: 0.9rem;
        }
        .btb-scroll-top:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.25); }

        /* Mobile sidebar overlay */
        .btb-sidebar-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 300;
          opacity: 0; visibility: hidden;
          transition: all 0.3s;
        }
        .btb-sidebar-overlay.open { opacity: 1; visibility: visible; }
        .btb-sidebar-drawer {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 300px;
          background: white;
          z-index: 301;
          transform: translateX(-100%);
          transition: transform 0.4s var(--ease);
          overflow-y: auto;
          box-shadow: 4px 0 30px rgba(0,0,0,0.15);
        }
        .btb-sidebar-drawer.open { transform: translateX(0); }

        @media (max-width: 1024px) {
          .btb-sidebar { display: none; }
          .btb-layout { padding: 1.25rem; }
        }
        @media (max-width: 640px) {
          .btb-hero-content { padding: 2rem 1.25rem 2rem; }
          .btb-toolbar-inner { padding: 0.6rem 1rem; gap: 0.5rem; }
          .btb-results-count { display: none; }
        }
      `}</style>


      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="btb-hero">
        <div
          className="btb-hero-bg"
          style={{ background: `${meta.grad}, url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80') center/cover no-repeat`, backgroundBlendMode: 'multiply' }}
        />
        <div className="btb-hero-overlay" />
        <div className="btb-hero-content">
          <div className="btb-hero-left">
            <div className="btb-hero-eyebrow">
              <span>{meta.icon}</span>
              <span>DesiVDesi Tours</span>
              <span style={{ opacity: 0.5 }}>›</span>
              <span>{meta.title}</span>
            </div>
            <h1 className="btb-hero-title">{meta.title}</h1>
            <p className="btb-hero-desc">{meta.desc}</p>
          </div>
          <div className="btb-hero-right">
            {/* Dynamic pricing indicator */}
            <div className="btb-price-trend">
              <span
                className="btb-trend-dot"
                style={{ background: trend === 'rising' ? '#FF6B6B' : trend === 'falling' ? '#4CAF50' : '#FFD700' }}
              />
              <span>
                {trend === 'rising' ? '📈 Prices rising' : trend === 'falling' ? '📉 Prices dropping' : '📊 Prices stable'} · {Math.round(multiplier * 100)}% of base
              </span>
            </div>
            {/* Weather */}
            {weather ? (
              <div className="btb-weather-card">
                <div className="btb-weather-title">📍 {activeDestination || 'Destination'} Weather</div>
                <div className="btb-weather-main">
                  <span style={{ fontSize: '1.8rem' }}>{weather.icon}</span>
                  <div>
                    <div className="btb-weather-temp">{weather.temp}°C</div>
                    <div className="btb-weather-desc">{weather.desc}</div>
                  </div>
                </div>
                <div className="btb-weather-row">
                  <span>💧 {weather.humidity}%</span>
                  <span>☀️ UV {weather.uv}</span>
                </div>
                <div className="btb-weather-best">🗓️ Best time: {weather.best}</div>
              </div>
            ) : (
              <div className="btb-weather-card" style={{ opacity: 0.7 }}>
                <div className="btb-weather-title">Loading weather...</div>
                <div style={{ height: 60, background: 'rgba(255,255,255,0.1)', borderRadius: 8, marginTop: 8 }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── TOOLBAR ──────────────────────────────────────────────────────────── */}
      <div className="btb-toolbar">
        <div className="btb-toolbar-inner">
          <div className="btb-search-wrap">
            <input
              type="text"
              className="btb-search-input"
              placeholder={`Search ${meta.title.toLowerCase()}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="btb-search-icon"><FaSearch size={12} /></div>
          </div>

          <button
            className={`btb-filter-btn ${hasActiveFilters ? 'active' : ''}`}
            onClick={() => setSidebarOpen(true)}
          >
            <FaFilter size={11} />
            Filters
            {hasActiveFilters && <span className="btb-filter-badge">!</span>}
          </button>

          <select
            className="btb-sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <div className="btb-view-toggles">
            <button className={`btb-view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><FaThLarge /></button>
            <button className={`btb-view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><FaList /></button>
          </div>

          <div className="btb-results-count">
            <strong>{resultsCount}</strong> {resultsCount === 1 ? 'package' : 'packages'} found
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────────────────── */}
      <div className="btb-layout">
        {/* Desktop Sidebar */}
        <aside className="btb-sidebar">
          <div className="btb-sidebar-header">
            <span className="btb-sidebar-title">Filters</span>
            {hasActiveFilters && (
              <button className="btb-reset-btn" onClick={resetFilters}>
                <FaTimes size={10} /> Reset
              </button>
            )}
          </div>

          {/* Price Range */}
          <div className="btb-sidebar-section">
            <div className="btb-sidebar-label">Price Range</div>
            <div className="btb-price-display">{priceRangeText}</div>
            <input
              type="range" className="btb-slider"
              min={0} max={100000} step={1000}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              style={{ '--val': `${(priceRange[1] / 100000) * 100}%` }}
            />
          </div>

          {/* Duration */}
          <div className="btb-sidebar-section">
            <div className="btb-sidebar-label">Duration</div>
            <div className="btb-chips">
              {['all', '1-3', '4-7', '7-14', '14+'].map(d => (
                <button
                  key={d}
                  className={`btb-chip ${selectedDuration === d ? 'active' : ''}`}
                  onClick={() => setSelectedDuration(d)}
                >
                  {d === 'all' ? 'Any' : `${d} days`}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="btb-sidebar-section">
            <div className="btb-sidebar-label">Minimum Rating</div>
            <div className="btb-rating-opts">
              {[0, 3, 4, 4.5, 5].map(r => (
                <button
                  key={r}
                  className={`btb-rating-opt ${selectedRating === r ? 'active' : ''}`}
                  onClick={() => setSelectedRating(r)}
                >
                  {r === 0 ? 'Any rating' : (
                    <>
                      <span className="btb-rating-stars">{'★'.repeat(Math.floor(r))}{r % 1 ? '½' : ''}</span>
                      <span>{r}+ stars</span>
                    </>
                  )}
                  <div className={`btb-radio ${selectedRating === r ? 'active' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Pricing note */}
          <div className="btb-sidebar-section">
            <div className="btb-sidebar-label">Live Pricing</div>
            <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.6 }}>
              Prices update in real-time based on demand.
              Current rate: <strong style={{ color: trend === 'rising' ? '#FF6B6B' : trend === 'falling' ? '#4CAF50' : '#FFD700' }}>
                {trend === 'rising' ? '↑' : trend === 'falling' ? '↓' : '→'} {Math.round(multiplier * 100)}% of base
              </strong>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="btb-main" ref={packagesRef}>
          {loading ? (
            <div className="row g-4">
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filteredPackages.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="row g-4">
                {filteredPackages.map((pkg, i) => (
                  <TourPackageCard
                    key={pkg._id || i}
                    pkg={pkg}
                    // themeColor={themeKey}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div>
                {filteredPackages.map((pkg, i) => (
                  <div key={pkg._id || i} className="btb-list-card">
                    <img
                      src={pkg?.images || pkg.images || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80'}
                      alt={pkg.location}
                      className="btb-list-img"
                      onError={e => e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80'}
                    />
                    <div className="btb-list-content">
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <FaMapMarkerAlt size={11} style={{ color: '#3D52A0' }} />
                            <span style={{ fontSize: '0.82rem', color: '#888' }}>{pkg.location}</span>
                          </div>
                          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 700, color: '#1a1a2e' }}>{pkg.title}</h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FFD70015', padding: '4px 10px', borderRadius: 20 }}>
                          <FaStar size={11} color="#FFD700" />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{pkg.rating || '4.8'}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#777', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{pkg.description}</p>
                      <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: '#888', marginBottom: 12 }}>
                        <span>⏱️ {pkg.duration || '7 Days'}</span>
                        <span>👥 {pkg.groupSize || 'Max 15'}</span>
                        <span>({pkg.reviews || 128} reviews)</span>
                      </div>
                      <div className="btb-list-footer">
                        <div className="btb-list-price">₹{pkg.price?.toLocaleString() || '4,999'}</div>
                        <Link to={`/package/${packageType}/${pkg.location?.toLowerCase().replace(/ /g, "-")}`} style={{
                          padding: '0.55rem 1.25rem',
                          borderRadius: 50, color: 'white', background: meta.grad,
                          textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                          View Details <FaArrowRight size={10} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="btb-empty">
              <div className="btb-empty-icon">🔍</div>
              <div className="btb-empty-title">No packages found</div>
              <div className="btb-empty-sub">Try adjusting your filters or search term.</div>
              <button className="btb-empty-btn" onClick={resetFilters}>Clear All Filters</button>
            </div>
          )}
        </main>
      </div>

      {/* ── CONTACT STRIP ────────────────────────────────────────────────────── */}
      <section className="btb-contact" style={{ background: meta.grad }}>
        <h2 className="btb-contact-title">Need Help Planning?</h2>
        <p className="btb-contact-sub">Our travel experts are available 24/7 to craft your perfect {meta.title.toLowerCase()}.</p>
        <div className="btb-contact-row">
          <a href="tel:+917888251550" className="btb-contact-item"><FaPhone size={14} /> +91 78882 51550</a>
          <a href="https://wa.me/917888251550" target="_blank" rel="noreferrer" className="btb-contact-item"><FaWhatsapp size={14} /> WhatsApp Us</a>
          <a href="mailto:tours.desivdesi@gmail.com" className="btb-contact-item"><FaEnvelope size={14} /> Email Us</a>
        </div>
      </section>

      {/* ── Mobile Sidebar Drawer ─────────────────────────────────────────────── */}
      <div className={`btb-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={`btb-sidebar-drawer ${sidebarOpen ? 'open' : ''}`}>
        <div className="btb-sidebar-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="btb-sidebar-title">Filters</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {hasActiveFilters && <button className="btb-reset-btn" onClick={resetFilters}><FaTimes size={10} /> Reset</button>}
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#999' }}>✕</button>
          </div>
        </div>
        {/* Same sidebar content */}
        <div className="btb-sidebar-section">
          <div className="btb-sidebar-label">Price Range</div>
          <div className="btb-price-display">{priceRangeText}</div>
          <input type="range" className="btb-slider" min={0} max={100000} step={1000} value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} />
        </div>
        <div className="btb-sidebar-section">
          <div className="btb-sidebar-label">Duration</div>
          <div className="btb-chips">
            {['all', '1-3', '4-7', '7-14', '14+'].map(d => (
              <button key={d} className={`btb-chip ${selectedDuration === d ? 'active' : ''}`} onClick={() => setSelectedDuration(d)}>
                {d === 'all' ? 'Any' : `${d} days`}
              </button>
            ))}
          </div>
        </div>
        <div className="btb-sidebar-section">
          <div className="btb-sidebar-label">Minimum Rating</div>
          <div className="btb-rating-opts">
            {[0, 3, 4, 4.5, 5].map(r => (
              <button key={r} className={`btb-rating-opt ${selectedRating === r ? 'active' : ''}`} onClick={() => setSelectedRating(r)}>
                {r === 0 ? 'Any rating' : <><span className="btb-rating-stars">{'★'.repeat(Math.floor(r))}</span><span>{r}+ stars</span></>}
                <div className={`btb-radio ${selectedRating === r ? 'active' : ''}`} />
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: '1.25rem 1.5rem' }}>
          <button onClick={() => setSidebarOpen(false)} style={{ width: '100%', padding: '0.85rem', borderRadius: 50, border: 'none', background: meta.grad, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
            Show {resultsCount} Results
          </button>
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button className="btb-scroll-top" style={{ background: meta.grad }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default BaseTourPage;