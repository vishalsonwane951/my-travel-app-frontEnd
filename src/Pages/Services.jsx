import React, { useState, useRef, useEffect, useCallback, useMemo, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header/Header';
import PackageContext from '../Context/PackageContext';
import NewsletterSubscribe from '../Components/Newslettersubscribe';
import header from '../Components/Header/Header'

const useCountUp = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = null;
    const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(ease(progress) * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return [count, ref];
};

const useLiveBookings = () => {
  const [count, setCount] = useState(247);
  useEffect(() => {
    const interval = setInterval(() => setCount(c => c + Math.floor(Math.random() * 3)), 8000);
    return () => clearInterval(interval);
  }, []);
  return count;
};

const TOUR_PACKAGES = [
  { id: 1, title: "Custom Tours", type: 'custom-tour', icon: "✦", color: "#FF6B6B", duration: "Flexible", price: "₹12,999", priceNote: "onwards", tagline: "Your Trip, Your Rules", description: "Craft a travel story that's uniquely yours — every detail tailored to your preferences." },
  { id: 2, title: "Adventure Tours", type: 'adventure-tour', icon: "◈", color: "#4ECDC4", duration: "5–14 Days", price: "₹18,999", priceNote: "per person", tagline: "Feel the Rush", description: "Dare to explore the wild side of life with heart-pumping adventures in stunning landscapes." },
  { id: 3, title: "Family Tours", type: 'family-tour', icon: "❋", color: "#FFB347", duration: "7–21 Days", price: "₹15,999", priceNote: "per person", tagline: "Together We Travel", description: "Perfect memories for every generation — safe, fun, and stress-free journeys for the whole family." },
  { id: 4, title: "Group Tours", type: 'group-tour', icon: "⬡", color: "#A37BFF", duration: "4–10 Days", price: "₹8,999", priceNote: "per person", tagline: "More People, More Fun", description: "Travel together, laugh louder, bond stronger — incredible experiences shared with amazing people." },
  { id: 5, title: "City Tours", type: 'city-tour', icon: "◉", color: "#FF9F1C", duration: "1–3 Days", price: "₹3,999", priceNote: "per person", tagline: "Discover the City's Soul", description: "Explore iconic landmarks, hidden alleys, street food, and shopping in the world's best cities." },
  { id: 6, title: "Honeymoon Tours", type: 'honeymoon-tour', icon: "✿", color: "#FF6EB4", duration: "5–10 Days", price: "₹24,999", priceNote: "per couple", tagline: "Love in Every Moment", description: "Romantic escapes crafted for two — candlelit dinners, private beaches, luxury stays, and forever memories." },
  { id: 7, title: "Weekend Getaways", type: 'weekend-getaway', icon: "◐", color: "#5BC0EB", duration: "2–3 Days", price: "₹4,999", priceNote: "per person", tagline: "Escape the Grind", description: "Quick, refreshing escapes from the hustle — perfectly planned for your precious weekend." },
  { id: 8, title: "Luxury Tours", type: 'luxury-tour', icon: "◆", color: "#C9A84C", duration: "7–14 Days", price: "₹49,999", priceNote: "per person", tagline: "Travel Like Royalty", description: "Five-star experiences, private jets, butler service, and the world's most exclusive destinations." },
  { id: 9, title: "Pilgrimage Tours", type: 'pilgrimage-tour', icon: "✺", color: "#7BAE7F", duration: "5–15 Days", price: "₹9,999", priceNote: "per person", tagline: "A Journey of the Soul", description: "Sacred journeys to holy sites across India and beyond — peaceful, organized, spiritually enriching." },
];

const DESTINATIONS = [
  { img: "https://i.pinimg.com/1200x/7d/0b/43/7d0b4327f28e9796765b0fa1bf92e5f5.jpg", title: "Goa", tag: "Beach Paradise", price: "₹8,999" },
  { img: "https://i.pinimg.com/236x/61/fb/b4/61fbb417b4c8588df03d393d6efe9d89.jpg", title: "Kerala", tag: "God's Own Country", price: "₹12,499" },
  { img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=85", title: "Rajasthan", tag: "Land of Kings", price: "₹14,999" },
  { img: "https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?w=800&q=85", title: "Manali", tag: "Snow Adventure", price: "₹11,999" },
  { img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=85", title: "Dubai", tag: "Ultra Luxury", price: "₹42,999" },
  { img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=85", title: "Bali", tag: "Island Magic", price: "₹38,999" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", loc: "Mumbai", img: "https://randomuser.me/api/portraits/women/44.jpg", text: "DesiVDesi made our honeymoon absolutely magical! Every detail was perfect — from the hotel to the sunset cruise. We're already planning our anniversary trip with them!", rating: 5, tour: "Honeymoon Tour" },
  { name: "Rahul Mehta", loc: "Bangalore", img: "https://randomuser.me/api/portraits/men/32.jpg", text: "The Manali adventure tour was beyond expectations. The guides were knowledgeable, safety was top-notch, and the experiences were genuinely thrilling. 10/10 would recommend!", rating: 5, tour: "Adventure Tour" },
  { name: "Ananya Iyer", loc: "Chennai", img: "https://randomuser.me/api/portraits/women/63.jpg", text: "Our family Rajasthan trip was seamless — kids loved every moment and we didn't have to worry about a single thing. Best travel investment we've made!", rating: 5, tour: "Family Tour" },
  { name: "Vikram Patel", loc: "Ahmedabad", img: "https://randomuser.me/api/portraits/men/45.jpg", text: "The Varanasi pilgrimage tour was spiritually transformative. Incredibly organized, deeply moving, and handled with so much care and respect.", rating: 5, tour: "Pilgrimage Tour" },
];

const WHY_US = [
  { icon: "🛡️", title: "Fully Insured", desc: "Every trip covered with comprehensive travel insurance for complete peace of mind.", accent: "#4ECDC4" },
  { icon: "⚡", title: "Instant Booking", desc: "Book in under 2 minutes. Instant confirmation, no long wait times.", accent: "#FFD700" },
  { icon: "🌐", title: "500+ Destinations", desc: "From remote Himalayan villages to luxury European capitals.", accent: "#A37BFF" },
  { icon: "💰", title: "Best Price Guarantee", desc: "Find it cheaper elsewhere? We'll match it and give you ₹500 off.", accent: "#4CAF50" },
  { icon: "🔄", title: "Free Cancellation", desc: "Cancel up to 48 hours before departure for a full refund.", accent: "#FF6B6B" },
  { icon: "🎯", title: "Expert Curation", desc: "Every itinerary handcrafted by travel experts with 15+ years experience.", accent: "#D4A853" },
];

export default function Services() {
  const { setSelectedType } = useContext(PackageContext);
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleSections, setVisibleSections] = useState({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const cardRefs = useRef({});

  const liveBookings = useLiveBookings();
  const [happyCount, happyRef] = useCountUp(800, 2200);
  const [destCount, destRef] = useCountUp(512, 1800);
  const [yearsCount, yearsRef] = useCountUp(2, 1200);
  const [toursCount, toursRef] = useCountUp(795, 2000);

  useEffect(() => {
    const handleMove = (e) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({ x: (e.clientX / innerWidth - 0.5) * 2, y: (e.clientY / innerHeight - 0.5) * 2 });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) setVisibleSections(prev => ({ ...prev, [e.target.dataset.section]: true }));
      }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('[data-section]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  const handleCardMouseMove = useCallback((e, id) => {
    const card = cardRefs.current[id];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-10px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    card.style.boxShadow = `${-x * 20}px ${-y * 20}px 60px rgba(0,0,0,0.2), 0 30px 60px rgba(0,0,0,0.15)`;
  }, []);

  const handleCardMouseLeave = useCallback((id) => {
    const card = cardRefs.current[id];
    if (!card) return;
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    card.style.boxShadow = 'none';
  }, []);

  const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'domestic', label: 'Domestic' },
    { key: 'international', label: 'International' },
    { key: 'budget', label: 'Budget' },
    { key: 'luxury', label: 'Luxury' },
    { key: 'new', label: 'New' },
  ];

  const filterMap = {
    domestic: ['city-tour', 'pilgrimage-tour', 'weekend-getaway', 'family-tour'],
    international: ['luxury-tour', 'adventure-tour', 'honeymoon-tour'],
    budget: ['city-tour', 'group-tour', 'weekend-getaway', 'pilgrimage-tour'],
    luxury: ['luxury-tour', 'honeymoon-tour', 'custom-tour'],
    new: ['honeymoon-tour', 'weekend-getaway', 'pilgrimage-tour'],
  };

  const filteredPackages = useMemo(() => {
    let pkgs = TOUR_PACKAGES;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      pkgs = pkgs.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (activeFilter !== 'all') pkgs = pkgs.filter(p => filterMap[activeFilter]?.includes(p.type));
    return pkgs;
  }, [activeFilter, searchQuery]);

  const handleBook = useCallback((type) => {
    navigate(`/tourcard/${type}`);
  }, [navigate]);

  return (
    <>
    <Header/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --ink: #080C14;
          --ink-2: #1C2333;
          --gold: #D4A853;
          --gold-pale: #F5E8C4;
          --gold-dim: rgba(212,168,83,0.15);
          --mist: #F7F8FC;
          --border: rgba(0,0,0,0.07);
          --serif: 'Cormorant Garamond', serif;
          --sans: 'Outfit', sans-serif;
          --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
          --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--sans); color: var(--ink); overflow-x: hidden; }

        /* ── HERO ───────────────────────────────── */
        .hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          overflow: hidden;
          background: var(--ink);
        }
        .hero-photo {
          position: absolute; inset: 0;
          background: url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=85') center/cover no-repeat;
          opacity: 0.22;
          transform: scale(1.05);
          animation: heroZoom 18s ease-in-out infinite alternate;
        }
        @keyframes heroZoom { from { transform: scale(1.05); } to { transform: scale(1.12); } }
        .hero-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 75% 65% at 50% 45%, rgba(20,28,55,0.4) 0%, rgba(8,12,20,0.85) 100%);
        }
        .hero-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
          will-change: transform;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .orb-1 { width: 600px; height: 600px; background: rgba(61,82,160,0.25); top: -150px; left: -100px; }
        .orb-2 { width: 400px; height: 400px; background: rgba(212,168,83,0.15); bottom: -80px; right: -80px; }
        .orb-3 { width: 300px; height: 300px; background: rgba(124,255,203,0.08); top: 40%; left: 60%; }
        .hero-content {
          position: relative; z-index: 2;
          padding: 0 1.5rem; max-width: 860px; width: 100%;
          margin-top: 1.5rem;
        }
        .hero-ticker {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          color: rgba(255,255,255,0.85);
          font-size: 0.75rem; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 7px 18px; border-radius: 50px;
          margin-bottom: 2rem;
          animation: fadeUp 0.9s var(--ease-smooth) both;
        }
        .ticker-dot {
          width: 7px; height: 7px; background: #7CFFCB;
          border-radius: 50%; box-shadow: 0 0 0 3px rgba(124,255,203,0.2);
          animation: tickPulse 2s ease-in-out infinite; flex-shrink: 0;
        }
        @keyframes tickPulse { 0%,100%{box-shadow:0 0 0 3px rgba(124,255,203,0.2)} 50%{box-shadow:0 0 0 7px rgba(124,255,203,0.06)} }
        .hero-label {
          font-family: var(--serif); font-size: clamp(0.85rem, 2vw, 1rem);
          font-style: italic; color: var(--gold);
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 1rem;
          animation: fadeUp 0.9s 0.1s var(--ease-smooth) both;
        }
        .hero-title {
          font-family: var(--serif);
          font-size: clamp(3.5rem, 9vw, 7rem);
          font-weight: 700; color: white; line-height: 0.95;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.9s 0.2s var(--ease-smooth) both;
          letter-spacing: -0.02em;
        }
        .hero-title em { font-style: italic; color: var(--gold); display: block; }
        .hero-sub {
          font-size: clamp(0.95rem, 2.2vw, 1.1rem); font-weight: 300;
          color: rgba(255,255,255,0.65); max-width: 520px;
          margin: 0 auto 2.5rem; line-height: 1.8;
          animation: fadeUp 0.9s 0.3s var(--ease-smooth) both;
        }
        .hero-search-bar {
          display: flex; align-items: center;
          background: rgba(255,255,255,0.97); border-radius: 100px;
          overflow: hidden; max-width: 540px; margin: 0 auto 1.75rem;
          box-shadow: 0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1);
          animation: fadeUp 0.9s 0.4s var(--ease-smooth) both;
        }
        .hero-search-bar input {
          flex: 1; padding: 1rem 1.5rem; border: none; outline: none;
          font-size: 0.92rem; font-family: var(--sans); color: var(--ink); background: transparent;
        }
        .hero-search-bar input::placeholder { color: #aaa; }
        .hero-search-btn {
          margin: 5px; padding: 0 1.5rem; height: calc(100% - 10px);
          background: var(--ink); border: none; color: white;
          font-size: 0.82rem; font-weight: 600; font-family: var(--sans);
          letter-spacing: 0.05em; border-radius: 100px; cursor: pointer;
          transition: background 0.2s; white-space: nowrap; min-height: 40px;
        }
        .hero-search-btn:hover { background: #1C2333; }
        .hero-pills {
          display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
          animation: fadeUp 0.9s 0.5s var(--ease-smooth) both;
          margin-bottom: 2.5rem;
        }
        .hero-pill {
          background: transparent; border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.75); padding: 6px 14px; border-radius: 50px;
          font-size: 0.78rem; font-family: var(--sans); cursor: pointer;
          transition: all 0.25s; letter-spacing: 0.02em;
        }
        .hero-pill:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }
        .hero-scroll {
          position: absolute; bottom: 0.1rem; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 6px; 
          margin-top: 2rem;
          color: rgba(255,255,255,0.35); font-size: 0.65rem; letter-spacing: 0.15em;
          text-transform: uppercase; animation: fadeUp 0.9s 0.8s var(--ease-smooth) both;
        }
        .scroll-chevron {
          width: 20px; height: 20px;
          border-right: 1.5px solid rgba(255,255,255,0.35);
          border-bottom: 1.5px solid rgba(255,255,255,0.35);
          transform: rotate(45deg);
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce { 0%,100%{transform:rotate(45deg) translateY(0)} 50%{transform:rotate(45deg) translateY(5px)} }

        /* ── STATS ──────────────────────────────── */
        .stats-strip { background: white; padding: 0; border-bottom: 1px solid var(--border); }
        .stats-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        .stat-cell {
          padding: 2.5rem 2rem; text-align: center;
          border-right: 1px solid var(--border);
          transition: background 0.25s; position: relative; overflow: hidden;
        }
        .stat-cell:last-child { border-right: none; }
        .stat-cell::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(212,168,83,0.06), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .stat-cell:hover::before { opacity: 1; }
        .stat-num {
          font-family: var(--serif); font-size: 3rem; font-weight: 700;
          color: var(--ink); line-height: 1; margin-bottom: 0.35rem;
        }
        .stat-label {
          font-size: 0.78rem; font-weight: 500; color: #999;
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .stat-accent {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 0; height: 2px; background: var(--gold);
          transition: width 0.4s var(--ease-smooth);
        }
        .stat-cell:hover .stat-accent { width: 60%; }

        /* ── SECTION COMMONS ────────────────────── */
        .section {
          padding: 3.5rem 2rem;
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.9s var(--ease-smooth), transform 0.9s var(--ease-smooth);
        }
        .section.visible { opacity: 1; transform: translateY(0); }
        .section-kicker {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 1rem;
        }
        .section-kicker::before {
          content: ''; display: inline-block; width: 24px; height: 1px; background: var(--gold);
        }
        .section-title {
          font-family: var(--serif); font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 700; color: var(--ink); line-height: 1.1; margin-bottom: 0.75rem;
        }
        .section-title em { font-style: italic; color: var(--gold); }
        .section-sub {
          font-size: 1rem; font-weight: 300; color: #777; max-width: 520px; line-height: 1.75;
        }
        .section-header { margin-bottom: 3.5rem; }
        .section-header.center { text-align: center; }
        .section-header.center .section-kicker { justify-content: center; }
        .section-header.center .section-sub { margin: 0 auto; }

        /* ── PACKAGES — sticky fixed bg ─────────── */
        /*
         * The trick: wrap the section in a positioned container.
         * The ::before pseudo holds the background-attachment:fixed image.
         * This keeps the bg pinned to the viewport while only the section
         * content (cards, headings) scrolls normally on top.
         */
        .packages-wrapper {
          position: relative;
          isolation: isolate;
        }
        .packages-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url('https://i.pinimg.com/1200x/83/b0/2c/83b02c8947864f6cb7265ccb23cc0dcb.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          z-index: -2;
        }
        /* Dark scrim so text stays legible */
        .packages-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(10, 8, 5, 0.82);
          z-index: -1;
        }

        .packages-section {
          padding: 3.5rem 2rem;
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.9s var(--ease-smooth), transform 0.9s var(--ease-smooth);
        }
        .packages-section.visible { opacity: 1; transform: translateY(0); }
        .packages-section .section-title { color: rgba(255,255,255,0.9); }
        .packages-section .section-sub { color: rgba(255,255,255,0.4); }

        /* Filters */
        .filter-row {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem; margin-bottom: 2.5rem;
        }
        .filter-pills { display: flex; gap: 6px; flex-wrap: wrap; }
        .filter-pill {
          padding: 7px 18px; border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.12);
          background: transparent; color: rgba(255,255,255,0.45);
          font-size: 0.78rem; font-family: var(--sans);
          cursor: pointer; transition: all 0.2s; letter-spacing: 0.04em;
        }
        .filter-pill:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.75); }
        .filter-pill.active {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.9);
        }
        .pkg-search {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px; padding: 0 1rem 0 1.25rem;
          height: 38px; transition: border-color 0.2s;
        }
        .pkg-search:focus-within { border-color: rgba(212,168,83,0.4); }
        .pkg-search input {
          border: none; outline: none; font-size: 0.82rem; font-family: var(--sans);
          color: rgba(255,255,255,0.8); background: transparent; width: 180px;
        }
        .pkg-search input::placeholder { color: rgba(255,255,255,0.25); }
        .pkg-search svg { color: rgba(255,255,255,0.25); flex-shrink: 0; }

        /* Card grid */
        .pkg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* Fully transparent cards — border + blur only */
        .pkg-card {
          background: transparent;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          transition: border-color 0.3s, transform 0.35s var(--ease-smooth);
          position: relative;
          transform-style: preserve-3d;
          will-change: transform;
          display: flex;
          flex-direction: column;
          padding: 1.75rem;
          backdrop-filter: blur(2px);
        }
        .pkg-card:hover { border-color: rgba(212,168,83,0.35); }

        .pkg-card-toprow {
          display: flex; align-items: flex-start;
          justify-content: space-between; margin-bottom: 1.4rem;
        }
        .pkg-icon {
          width: 44px; height: 44px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.55); flex-shrink: 0;
        }
        .pkg-duration {
          font-size: 0.75rem; color: rgba(255,255,255,0.3);
          letter-spacing: 0.04em; padding-top: 4px;
        }
        .pkg-name {
          font-family: var(--serif); font-size: 1.35rem;
          font-weight: 600; font-style: italic;
          margin-bottom: 0.65rem; line-height: 1.2;
        }
        .pkg-desc {
          font-size: 0.83rem; font-weight: 300;
          color: rgba(255,255,255,0.5); line-height: 1.75;
          margin-bottom: 1.4rem; flex: 1;
        }
        .pkg-price-inline {
          font-family: var(--serif); font-size: 1.1rem;
          font-weight: 600; color: rgba(212,168,83,0.85);
          margin-bottom: 0.5rem;
        }
        .pkg-price-note-inline {
          font-size: 0.68rem; color: rgba(255,255,255,0.3); font-family: var(--sans);
        }
        .pkg-author {
          font-size: 0.75rem; color: rgba(255,255,255,0.25);
          margin-bottom: 1.25rem; letter-spacing: 0.01em;
        }
        .pkg-author span { color: rgba(255,255,255,0.4); }
        .pkg-cta {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  border: none;
  background: var(--gold);
  font-family: var(--sans);
  padding: 0.55rem 1.2rem;
  letter-spacing: 0.04em;
  transition: all 0.25s ease;
  margin-top: auto;
  border-radius: 50px;
  box-shadow: 0 4px 18px rgba(212, 168, 83, 0.3);
  align-self: flex-start;
}
        .pkg-cta:hover {
  background: #e8ba50;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(212, 168, 83, 0.45);
  color: var(--ink);
}
  .pkg-cta:active {
  transform: translateY(0px);
  box-shadow: 0 3px 10px rgba(212, 168, 83, 0.3);
}
        .pkg-cta svg { flex-shrink: 0; transition: transform 0.2s; }
        .pkg-cta:hover svg { transform: translateX(2px); }

        /* ── DESTINATIONS ───────────────────────── */
        .destinations-bg { background: white; }
        .dest-mosaic {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          grid-template-rows: 280px 280px;
          gap: 12px; max-width: 1200px; margin: 0 auto;
        }
        .dest-card { position: relative; border-radius: 18px; overflow: hidden; cursor: pointer; }
        .dest-card:first-child { grid-row: span 2; }
        .dest-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.7s var(--ease-smooth); display: block;
        }
        .dest-card:hover .dest-img { transform: scale(1.06); }
        .dest-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 25%, rgba(8,12,20,0.78) 100%);
        }
        .dest-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem; }
        .dest-tag {
          font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 4px;
        }
        .dest-name {
          font-family: var(--serif); font-size: 1.7rem;
          font-weight: 700; color: white; line-height: 1.1; margin-bottom: 4px;
        }
        .dest-card:first-child .dest-name { font-size: 2.5rem; }
        .dest-price { font-size: 0.82rem; color: rgba(255,255,255,0.65); font-weight: 300; }
        .dest-arrow {
          position: absolute; top: 1rem; right: 1rem;
          width: 34px; height: 34px;
          background: rgba(255,255,255,0.12); backdrop-filter: blur(6px);
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 1rem; opacity: 0;
          transform: scale(0.8); transition: all 0.3s var(--ease-spring);
        }
        .dest-card:hover .dest-arrow { opacity: 1; transform: scale(1); }

        /* ── WHY US ─────────────────────────────── */
        .why-bg { background: var(--ink); }
        .why-bg .section-title { color: white; }
        .why-bg .section-sub { color: rgba(255,255,255,0.45); }
        .bento-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; max-width: 1100px; margin: 0 auto;
          background: rgba(255,255,255,0.06);
          border-radius: 24px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .bento-cell {
          background: var(--ink); padding: 2.25rem 2rem;
          transition: background 0.3s; position: relative; overflow: hidden;
        }
        .bento-cell:hover { background: rgba(255,255,255,0.03); }
        .bento-cell::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(212,168,83,0.06), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .bento-cell:hover::after { opacity: 1; }
        .bento-icon { font-size: 1.75rem; margin-bottom: 1.1rem; display: block; }
        .bento-title { font-size: 1rem; font-weight: 600; color: white; margin-bottom: 0.5rem; }
        .bento-desc { font-size: 0.83rem; font-weight: 300; color: rgba(255,255,255,0.4); line-height: 1.7; }
        .bento-accent-line {
          position: absolute; bottom: 0; left: 2rem;
          width: 0; height: 2px; transition: width 0.4s var(--ease-smooth);
        }
        .bento-cell:hover .bento-accent-line { width: calc(100% - 4rem); }

        /* ── TESTIMONIALS ───────────────────────── */
        .testi-bg { background: var(--mist); }
        .testi-layout {
          display: grid; grid-template-columns: 1fr 340px;
          gap: 3rem; max-width: 1100px; margin: 0 auto; align-items: start;
        }
        .testi-main {
          background: white; border-radius: 24px; padding: 3rem;
          border: 1px solid var(--border); position: relative; overflow: hidden;
        }
        .testi-bg-char {
          position: absolute; top: -1rem; right: 1.5rem;
          font-family: var(--serif); font-size: 9rem; font-weight: 700;
          color: var(--ink); opacity: 0.04; line-height: 1;
          pointer-events: none; user-select: none;
        }
        .testi-text {
          font-family: var(--serif); font-size: 1.35rem; font-style: italic;
          color: var(--ink); line-height: 1.7; margin-bottom: 2rem; position: relative;
        }
        .testi-author { display: flex; align-items: center; gap: 1rem; }
        .testi-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold); }
        .testi-name { font-weight: 600; font-size: 0.95rem; color: var(--ink); }
        .testi-loc { font-size: 0.8rem; color: #aaa; font-weight: 300; }
        .testi-stars { color: #F5A623; font-size: 0.8rem; margin-top: 1px; }
        .testi-tour-tag {
          margin-left: auto; background: var(--gold-dim); color: #8A6A1A;
          font-size: 0.72rem; font-weight: 600; padding: 5px 12px;
          border-radius: 50px; letter-spacing: 0.03em; white-space: nowrap;
        }
        .testi-dots { display: flex; gap: 6px; margin-top: 2rem; }
        .testi-dot {
          height: 5px; border-radius: 3px; border: none; cursor: pointer;
          transition: all 0.35s var(--ease-smooth); background: #e0e0e0; width: 20px;
        }
        .testi-dot.active { background: var(--gold); width: 36px; }
        .testi-stack { display: flex; flex-direction: column; gap: 10px; }
        .testi-mini {
          background: white; border-radius: 16px; padding: 1.1rem 1.25rem;
          border: 1.5px solid transparent; cursor: pointer; transition: all 0.25s;
          display: flex; align-items: center; gap: 0.85rem;
        }
        .testi-mini:hover { border-color: var(--gold-pale); }
        .testi-mini.active { border-color: var(--gold); box-shadow: 0 4px 20px rgba(212,168,83,0.15); }
        .mini-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
        .mini-name { font-size: 0.85rem; font-weight: 600; color: var(--ink); }
        .mini-tour { font-size: 0.72rem; color: #aaa; font-weight: 300; margin-top: 1px; }
        .mini-stars { color: #F5A623; font-size: 0.7rem; margin-top: 2px; }


        // -------news---------
        // .newsletter-section {
        // margin-Top: -25px;
        // }

        /* ── CTA ────────────────────────────────── */
       .cta-section {
  position: relative;
  background: var(--ink);
  text-align: center;
  padding: 8rem 2rem;
  overflow: hidden;
}

/* ── Background image ── */
// .cta-bg-image {
//   position: absolute;
//   inset: 0;
//   background-image: url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80");
//   background-size: cover;
//   background-position: center 40%;
//   background-repeat: no-repeat;
//   pointer-events: none;
// }

.cta-bg-image {
  position: absolute;
  inset: 0;
  background-image: url("https://i.pinimg.com/1200x/49/bf/fe/49bffe617cd6ce8438b198af06828ad9.jpg");
  background-size: cover;
  background-position: center 50%;
  background-repeat: no-repeat;
  pointer-events: none;
}

/* ── Dark overlay for text legibility ── */
.cta-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(8, 10, 20, 0.55) 0%,
    rgba(8, 10, 20, 0.72) 50%,
    rgba(8, 10, 20, 0.85) 100%
  );
  pointer-events: none;
}

/* ── Noise texture ── */
.cta-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* ── Orbs ── */
.cta-orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
.cta-orb-1 { width: 500px; height: 500px; background: rgba(61,82,160,0.18); top: -200px; left: -100px; }
.cta-orb-2 { width: 350px; height: 350px; background: rgba(212,168,83,0.14); bottom: -120px; right: 5%; }

/* ── All content above overlays ── */
.cta-kicker,
.cta-title,
.cta-sub,
.cta-actions {
  position: relative;
  z-index: 2;
}

.cta-kicker {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.25rem;
  text-shadow: 0 1px 8px rgba(0,0,0,0.5);
}

.cta-title {
  font-family: var(--serif);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
  margin-bottom: 1rem;
  text-shadow: 0 2px 20px rgba(0,0,0,0.6);
}
.cta-title em { font-style: italic; color: var(--gold); }

.cta-sub {
  font-size: 1rem;
  font-weight: 300;
  color: rgba(255,255,255,0.7);
  margin-bottom: 3rem;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
  text-shadow: 0 1px 10px rgba(0,0,0,0.4);
}

/* ── Buttons (unchanged) ── */
.cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

.cta-btn-gold {
  padding: 0.9rem 2.5rem;
  background: var(--gold);
  color: var(--ink);
  border: none;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: var(--sans);
  cursor: pointer;
  letter-spacing: 0.04em;
  box-shadow: 0 12px 40px rgba(212,168,83,0.4);
  transition: all 0.3s var(--ease-spring);
  text-decoration: none;
  display: inline-block;
}
.cta-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 20px 50px rgba(212,168,83,0.5); }

.cta-btn-outline {
  padding: 0.9rem 2.5rem;
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: var(--sans);
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
  backdrop-filter: blur(6px);
}
.cta-btn-outline:hover { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.5); color: white; }
        /* ── ANIMATIONS ─────────────────────────── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── RESPONSIVE ─────────────────────────── */
        @media (max-width: 1024px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .bento-grid { grid-template-columns: repeat(2, 1fr); }
          .dest-mosaic { grid-template-columns: repeat(2, 1fr); grid-template-rows: auto; }
          .dest-card:first-child { grid-row: span 1; }
          .testi-layout { grid-template-columns: 1fr; }
          .testi-stack { flex-direction: row; flex-wrap: wrap; }
          .testi-mini { flex: 1; min-width: 180px; }
        }
        @media (max-width: 640px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .stat-cell { padding: 1.75rem 1rem; }
          .bento-grid { grid-template-columns: 1fr; }
          .dest-mosaic { grid-template-columns: 1fr; }
          .pkg-grid { grid-template-columns: 1fr; }
          .section { padding: 4.5rem 1.25rem; }
          .packages-section { padding: 4.5rem 1.25rem; }
          .filter-row { flex-direction: column; align-items: flex-start; }
          .pkg-search input { width: 140px; }
          .packages-wrapper::before { background-attachment: scroll; }
        }
      `}</style>


      {/* ── HERO ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-photo" />
        <div className="hero-vignette" />
        <div className="hero-orb orb-1" style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -15}px)` }} />
        <div className="hero-orb orb-2" style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 12}px)` }} />
        <div className="hero-orb orb-3" style={{ transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 20}px)` }} />

        <div className="hero-content">
          <div className="hero-ticker">
            <span className="ticker-dot" />
            <span>{liveBookings} bookings today</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 4px' }}>·</span>
            <span>24/7 support</span>
          </div>
          <p className="hero-label">India's finest travel experience</p>
          <h1 className="hero-title">
            Where Will<br /><em>You Go Next?</em>
          </h1>
          <p className="hero-sub">
            From misty Himalayan peaks to sun-kissed shores — crafted journeys for those who travel with intention.
          </p>
          <div className="hero-search-bar">
            <input
              type="text"
              placeholder="Search destinations, tours, experiences..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button className="hero-search-btn">Search</button>
          </div>
          <div className="hero-pills">
            {["Adventure", "Beach", "Heritage", "Honeymoon", "Family", "Luxury"].map(p => (
              <button key={p} className="hero-pill" onClick={() => setSearchQuery(p)}>{p}</button>
            ))}
          </div>
        </div>

        <div className="hero-scroll mt-5">
          <div className="scroll-chevron " />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-strip">
        <div className="stats-inner">
          {[
            { num: happyCount, suffix: '+', label: 'Happy Travelers', ref: happyRef },
            { num: destCount, suffix: '+', label: 'Destinations', ref: destRef },
            { num: yearsCount, suffix: '+', label: 'Years Experience', ref: yearsRef },
            { num: toursCount, suffix: '+', label: 'Tours Completed', ref: toursRef },
          ].map((s, i) => (
            <div key={i} className="stat-cell" ref={s.ref}>
              <div className="stat-num">{s.num.toLocaleString()}{s.suffix}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-accent" />
            </div>
          ))}
        </div>
      </div>

      {/* ── PACKAGES — fixed bg wrapper ── */}
      <div className="packages-wrapper">
        <section
          className={`packages-section ${visibleSections['packages'] ? 'visible' : ''}`}
          data-section="packages"
        >
          <div className="section-header center" style={{ maxWidth: 1300, margin: '0 auto 3.5rem' }}>
            <div className="section-kicker">We Offerings</div>
            <h2 className="section-title">Nine Ways to <em>Explore</em></h2>
            <p className="section-sub">From weekend escapes to once-in-a-lifetime expeditions — find the journey that calls to you.</p>
          </div>

          <div className="filter-row" style={{ maxWidth: 1300, margin: '0 auto 2rem' }}>
            <div className="filter-pills">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  className={`filter-pill ${activeFilter === f.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f.key)}
                >{f.label}</button>
              ))}
            </div>
            <div className="pkg-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search tours..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="pkg-grid">
            {filteredPackages.map((pkg) => {
              const isListen = ['custom-tour', 'adventure-tour', 'honeymoon-tour', 'weekend-getaway', 'pilgrimage-tour'].includes(pkg.type);
              const ctaLabel = isListen ? 'Book Now' : 'Explore Package';
              return (
                <div
                  key={pkg.id}
                  className="pkg-card"
                  ref={el => cardRefs.current[pkg.id] = el}
                  onMouseMove={e => handleCardMouseMove(e, pkg.id)}
                  onMouseLeave={() => handleCardMouseLeave(pkg.id)}
                >
                  <div className="pkg-card-toprow">
                    <div className="pkg-icon">{pkg.icon}</div>
                    {pkg.duration !== 'Flexible' && (
                      <span className="pkg-duration">{pkg.duration}</span>
                    )}
                  </div>
                  <h3 className="pkg-name" style={{ color: pkg.color }}>{pkg.title}</h3>
                  <p className="pkg-desc">{pkg.description}</p>
                  <div className="pkg-price-inline">
                    {pkg.price}
                    <span className="pkg-price-note-inline"> / {pkg.priceNote}</span>
                  </div>
                  <p className="pkg-author">by <span>{pkg.tagline}</span></p>
                  <button className="pkg-cta" onClick={() => handleBook(pkg.type)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {isListen
                        ? <><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" /></>
                        : <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>
                      }
                    </svg>
                    {ctaLabel}
                  </button>
                </div>
              );
            })}
          </div>

          {filteredPackages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>◉</div>
              <p style={{ font: '300 1rem var(--sans)' }}>No tours found. Try adjusting your search.</p>
            </div>
          )}
        </section>
      </div>

      {/* ── DESTINATIONS ── */}
      <section
        className={`section destinations-bg ${visibleSections['destinations'] ? 'visible' : ''}`}
        data-section="destinations"
      >
        <div className="section-header center">
          <div className="section-kicker">Top Picks</div>
          <h2 className="section-title">Places That <em>Stay With You</em></h2>
          <p className="section-sub">A hand-picked selection of destinations our travelers return to, year after year.</p>
        </div>
        <div className="dest-mosaic">
          {DESTINATIONS.map((d, i) => (
            <div key={i} className="dest-card">
              <img src={d.img} alt={d.title} className="dest-img" loading="lazy" />
              <div className="dest-scrim" />
              <div className="dest-info">
                <div className="dest-tag">{d.tag}</div>
                <div className="dest-name">{d.title}</div>
                <div className="dest-price">From {d.price}</div>
              </div>
              <div className="dest-arrow">→</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section
        className={`section why-bg ${visibleSections['why'] ? 'visible' : ''}`}
        data-section="why"
      >
        <div className="section-header center" style={{ marginBottom: '3rem' }}>
          <div className="section-kicker" style={{ color: 'rgba(255,255,255,0.4)' }}>Why DesiVDesi</div>
          <h2 className="section-title" style={{ color: 'white' }}>Travel With <em>Confidence</em></h2>
          <p className="section-sub">We go beyond booking. We build journeys that become stories.</p>
        </div>
        <div className="bento-grid">
          {WHY_US.map((w, i) => (
            <div key={i} className="bento-cell">
              <span className="bento-icon">{w.icon}</span>
              <div className="bento-title">{w.title}</div>
              <div className="bento-desc">{w.desc}</div>
              <div className="bento-accent-line" style={{ background: w.accent }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {/* <section
        className={`section testi-bg ${visibleSections['testimonials'] ? 'visible' : ''}`}
        data-section="testimonials"
      >
        <div className="section-header center">
          <div className="section-kicker">Traveler Stories</div>
          <h2 className="section-title">Told in Their <em>Own Words</em></h2>
          <p className="section-sub">Real experiences, unfiltered. From real explorers who trusted us with their journey.</p>
        </div>
        <div className="testi-layout">
          <div className="testi-main">
            <div className="testi-bg-char">"</div>
            <p className="testi-text">{TESTIMONIALS[activeTestimonial].text}</p>
            <div className="testi-author">
              <img src={TESTIMONIALS[activeTestimonial].img} alt="" className="testi-avatar" />
              <div>
                <div className="testi-name">{TESTIMONIALS[activeTestimonial].name}</div>
                <div className="testi-loc">{TESTIMONIALS[activeTestimonial].loc}</div>
                <div className="testi-stars">{'★'.repeat(TESTIMONIALS[activeTestimonial].rating)}</div>
              </div>
              <span className="testi-tour-tag">{TESTIMONIALS[activeTestimonial].tour}</span>
            </div>
            <div className="testi-dots">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`testi-dot ${i === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(i)}
                />
              ))}
            </div>
          </div>
          <div className="testi-stack">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`testi-mini ${i === activeTestimonial ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(i)}
              >
                <img src={t.img} alt={t.name} className="mini-avatar" />
                <div>
                  <div className="mini-name">{t.name}</div>
                  <div className="mini-tour">{t.tour}</div>
                  <div className="mini-stars">{'★'.repeat(t.rating)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <div className='newsletter-section'>
        <NewsletterSubscribe/>
      </div>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-bg-image" />
        <div className="cta-overlay" />
        <div className="cta-noise" />
        <div className="cta-orb cta-orb-1" />
        <div className="cta-orb cta-orb-2" />
        <div className="cta-kicker">Begin Your Story</div>
        <h2 className="cta-title">
          Your Next Adventure<br /><em>Awaits</em>
        </h2>
        <p className="cta-sub">
          Join 10,000+ travelers who've trusted us with their most precious moments. Let's craft yours.
        </p>
        <div className="cta-actions">
          <Link to="/contact" className="cta-btn-gold">Plan My Trip →</Link>
          <a href="tel:+917888251550" className="cta-btn-outline">Call Us Now</a>
        </div>
      </section>
    </>
  );
}