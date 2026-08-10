import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import api from "../../utils/api";
import Header from "../../Components/Header";

// ── Hooks ──────────────────────────────────────────────────────────────────────
const useCountUp = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return [count, ref];
};

// ── Data ───────────────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1800&q=85",
    place: "Gateway of India, Mumbai",
    tag: "Iconic Landmark",
  },
  {
    img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1800&q=85",
    place: "Ajanta Caves",
    tag: "UNESCO Heritage",
  },
  {
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85",
    place: "Sahyadri Mountains",
    tag: "Western Ghats",
  },
  {
    img: "https://images.unsplash.com/photo-1544015759-237f43ca3d53?w=1800&q=85",
    place: "Alibaug Beach",
    tag: "Coastal Paradise",
  },
];

const CATEGORIES = [
  { key: "essential", label: "Essentials", icon: "⭐" },
  { key: "traveller", label: "Travellers' Choice", icon: "🏆" },
  { key: "family", label: "Family Friendly", icon: "👨‍👩‍👧‍👦" },
  { key: "hidden", label: "Hidden Gems", icon: "💎" },
  { key: "museums", label: "Museums", icon: "🏛️" },
  { key: "outdoors", label: "Outdoors", icon: "🌿" },
  { key: "arts", label: "Arts & Theatre", icon: "🎭" },
  { key: "nightlife", label: "Night Life", icon: "🌙" },
];

const QUICK_ACTIONS = [
  {
    label: "Hotels",
    icon: "🏨",
    color: "#3D52A0",
    bg: "rgba(61,82,160,0.08)",
    link: "/hotel",
  },
  {
    label: "Things To Do",
    icon: "🎯",
    color: "#FF6B35",
    bg: "rgba(255,107,53,0.08)",
  },
  {
    label: "Restaurants",
    icon: "🍽️",
    color: "#E6900A",
    bg: "rgba(230,144,10,0.08)",
  },
  {
    label: "Holiday Homes",
    icon: "🏡",
    color: "#0A9A90",
    bg: "rgba(10,154,144,0.08)",
  },
];

const DESTINATIONS = [
  {
    img: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
    name: "Mumbai",
    tag: "City of Dreams",
    price: "₹6,999",
    desc: "Bollywood, street food & sea",
  },
  {
    img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    name: "Aurangabad",
    tag: "City of Caves",
    price: "₹8,499",
    desc: "Ajanta, Ellora & Bibi Ka Maqbara",
  },
  {
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    name: "Lonavala",
    tag: "Hill Station",
    price: "₹4,999",
    desc: "Misty valleys & waterfalls",
  },
  {
    img: "https://images.unsplash.com/photo-1544015759-237f43ca3d53?w=800&q=80",
    name: "Alibaug",
    tag: "Beach Escape",
    price: "₹5,499",
    desc: "Sun, sand & sea forts",
  },
  {
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
    name: "Pune",
    tag: "Oxford of the East",
    price: "₹3,999",
    desc: "Culture, cafes & Osho",
  },
  {
    img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
    name: "Nashik",
    tag: "Wine Capital",
    price: "₹5,999",
    desc: "Vineyards & holy ghats",
  },
];

const EXPERIENCES = [
  {
    icon: "🏰",
    title: "Fort Trails",
    desc: "360+ Maratha forts including Raigad, Sinhagad & Pratapgad — each a stone chapter of epic history.",
    color: "#3D52A0",
    light: "rgba(61,82,160,0.12)",
  },
  {
    icon: "🍛",
    title: "Culinary Journey",
    desc: "Vada pav, Misal, Puran Poli & Kolhapuri — a food odyssey across Maharashtra's distinct regional cuisines.",
    color: "#FF6B35",
    light: "rgba(255,107,53,0.12)",
  },
  {
    icon: "🎭",
    title: "Lavani & Folk Arts",
    desc: "Witness the vibrant Lavani dance, Tamasha performances & Warli art that pulse with cultural pride.",
    color: "#E6900A",
    light: "rgba(230,144,10,0.12)",
  },
  {
    icon: "🌊",
    title: "Konkan Coast",
    desc: "720 km of pristine coastline with fishing villages, coconut groves & some of India's cleanest beaches.",
    color: "#0A9A90",
    light: "rgba(10,154,144,0.12)",
  },
  {
    icon: "🦋",
    title: "Wildlife Sanctuaries",
    desc: "Tadoba Tiger Reserve, Navegaon & Melghat — where the wild roams free across Maharashtra's forests.",
    color: "#5BA85A",
    light: "rgba(91,168,90,0.12)",
  },
  {
    icon: "🍇",
    title: "Winery Tours",
    desc: "Nashik's wine valley offers vineyard walks, wine tasting & boutique stays amidst rolling green hills.",
    color: "#8B5CF6",
    light: "rgba(139,92,246,0.12)",
  },
];

const TRAVEL_TIPS = [
  {
    icon: "🌤️",
    title: "Best Time to Visit",
    tip: "Oct–Mar is ideal. Monsoon (Jun–Sep) transforms the Sahyadris into lush emerald landscapes.",
  },
  {
    icon: "🚆",
    title: "Getting Around",
    tip: "Maharashtra has excellent rail connectivity. Mumbai's local trains are iconic — try the Deccan Queen for Pune.",
  },
  {
    icon: "💰",
    title: "Budget Guide",
    tip: "Budget: ₹2,000/day. Mid-range: ₹5,000/day. Luxury resorts in Alibaug or Mahabaleshwar: ₹15,000+/night.",
  },
  {
    icon: "🗣️",
    title: "Local Language",
    tip: 'Marathi is the heart of the state. A warm "Namaskar!" or "Kasa aahat?" will earn you big smiles.',
  },
];

// ── Image Carousel ─────────────────────────────────────────────────────────────
function ImageCarousel({ images }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div
      className="relative w-full"
      style={{ paddingTop: "68%", overflow: "hidden" }}
    >
      <img
        src={images[index]}
        alt={`slide-${index}`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />
      <button
        onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-7 h-7 flex items-center justify-center z-10"
        style={{
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.2)",
          fontSize: "0.9rem",
        }}
      >
        ‹
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % images.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-7 h-7 flex items-center justify-center z-10"
        style={{
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.2)",
          fontSize: "0.9rem",
        }}
      >
        ›
      </button>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? 20 : 6,
              height: 6,
              borderRadius: 50,
              border: "1px solid rgba(255,255,255,0.6)",
              background: i === index ? "white" : "rgba(255,255,255,0.4)",
              transition: "all 0.3s",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Hero Slider ────────────────────────────────────────────────────────────────
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setCurrent((i) => (i + 1) % HERO_SLIDES.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full h-full">
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={slide.img}
            alt={slide.place}
            className="w-full h-full object-cover"
            style={{
              transform: i === current ? "scale(1.03)" : "scale(1)",
              transition: "transform 6s ease",
            }}
          />
        </div>
      ))}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 32 : 8,
              height: 8,
              borderRadius: 50,
              border: "1.5px solid rgba(255,255,255,0.7)",
              background: i === current ? "white" : "rgba(255,255,255,0.35)",
              transition: "all 0.4s",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center z-20"
        style={{ whiteSpace: "nowrap" }}
      >
        <span
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#F0D080",
            fontWeight: 700,
            display: "block",
            marginBottom: 4,
            textShadow: "0 1px 8px rgba(0,0,0,0.5)",
          }}
        >
          {HERO_SLIDES[current].tag}
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "1rem",
            fontWeight: 300,
            letterSpacing: "0.06em",
            textShadow: "0 1px 10px rgba(0,0,0,0.6)",
          }}
        >
          {HERO_SLIDES[current].place}
        </span>
      </div>
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────────
function SectionHeader({
  eyebrow,
  eyebrowColor = "var(--saffron)",
  eyebrowBg = "rgba(255,107,53,0.08)",
  title,
  subtitle,
  light = false,
}) {
  return (
    <div className="text-center" style={{ marginBottom: "3.5rem" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: eyebrowColor,
          background: eyebrowBg,
          padding: "5px 16px",
          borderRadius: "50px",
          marginBottom: "1rem",
          fontFamily: "var(--font-body)",
          border: `1px solid ${eyebrowColor}25`,
        }}
      >
        {eyebrow}
      </span>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          color: light ? "white" : "var(--navy)",
          fontSize: "clamp(2rem,5vw,3rem)",
          marginBottom: subtitle ? "0.75rem" : 0,
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: "1.05rem",
            color: light ? "rgba(255,255,255,0.6)" : "#777",
            lineHeight: 1.75,
            maxWidth: 560,
            margin: "0 auto",
            fontFamily: "var(--font-body)",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function Maharashtra() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialCategory =
    searchParams.get("category") ||
    localStorage.getItem("mh_category") ||
    "essential";
  const [selected, setSelected] = useState(initialCategory);
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCards, setAllCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [heroVisible, setHeroVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [weatherData] = useState({
    temp: "28°C",
    condition: "Partly Cloudy",
    icon: "⛅",
  });

  const [fortsCount, fortsRef] = useCountUp(360, 2000);
  const [beachCount, beachRef] = useCountUp(720, 2200);
  const [heritageCount, heritageRef] = useCountUp(5, 1500);
  const [districtCount, districtRef] = useCountUp(36, 1800);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  const fetchData = useCallback(async (type) => {
    setLoading(true);
    try {
      const res = await api.get(`/maharashtra-cards/${type}`);
      setCardData(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Category error:", err);
      setCardData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selected);
  }, [selected, fetchData]);

  useEffect(() => {
    const fetchAllCards = async () => {
      try {
        const res = await api.get(`/maharashtra-cards/getall`);
        setAllCards(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        setAllCards([]);
      }
    };
    fetchAllCards();
  }, []);

  const handleCategoryChange = (key) => {
    if (key !== selected) {
      setSelected(key);
      localStorage.setItem("mh_category", key);
      navigate(`?category=${key}`, { replace: true });
    }
  };

  const filteredCards = (searchQuery ? allCards : cardData).filter((card) => {
    const query = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      card.title?.toLowerCase().includes(query) ||
      card.location?.toLowerCase().includes(query) ||
      card.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const revealRef = useCallback((el) => {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("mh-revealed");
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
  }, []);

  return (
    <>
      <Header />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        :root {
          --gold: #C9A84C;
          --gold-light: #F0D080;
          --navy: #0F1628;
          --indigo: #3D52A0;
          --indigo-light: #7091E6;
          --saffron: #FF6B35;
          --saffron-light: #FFB347;
          --teal: #0A9A90;
          --cream: #F8F6F1;
          --font-display: 'Cormorant Garamond', serif;
          --font-body: 'DM Sans', sans-serif;
          --ease: cubic-bezier(0.4,0,0.2,1);
          --shadow-sm: 0 2px 10px rgba(0,0,0,0.06);
          --shadow-md: 0 8px 28px rgba(0,0,0,0.10);
          --shadow-lg: 0 20px 60px rgba(0,0,0,0.14);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-body); overflow-x: hidden; }

        /* ── Hero ── */
        .mh-hero-content { transition: all 1s var(--ease); }
        .mh-hero-content.hidden-state { opacity: 0; transform: translateY(40px); }
        .mh-hero-content.visible-state { opacity: 1; transform: translateY(0); }

        .mh-d1 { animation: mhFadeUp 0.9s 0.1s var(--ease) both; }
        .mh-d2 { animation: mhFadeUp 0.9s 0.25s var(--ease) both; }
        .mh-d3 { animation: mhFadeUp 0.9s 0.4s var(--ease) both; }
        .mh-d4 { animation: mhFadeUp 0.9s 0.55s var(--ease) both; }
        .mh-d5 { animation: mhFadeUp 0.9s 0.7s var(--ease) both; }

        @keyframes mhFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Pulse dot ── */
        .live-dot { width: 8px; height: 8px; background: #4ADE80; border-radius: 50%; flex-shrink: 0; animation: pulseDot 2s infinite; }
        @keyframes pulseDot {
          0%,100% { box-shadow: 0 0 0 3px rgba(74,222,128,0.25); }
          50%      { box-shadow: 0 0 0 7px rgba(74,222,128,0.06); }
        }

        /* ── Scroll indicator ── */
        .scroll-line { width: 1px; height: 44px; background: linear-gradient(to bottom, rgba(255,255,255,0.55), transparent); animation: scrollPulse 1.8s ease-in-out infinite; }
        @keyframes scrollPulse { 0%,100%{transform:scaleY(1);opacity:1} 50%{transform:scaleY(0.4);opacity:0.3} }

        /* ── Reveal ── */
        .mh-reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.8s var(--ease), transform 0.8s var(--ease); }
        .mh-revealed { opacity: 1; transform: translateY(0); }

        /* ── Stats ── */
        .stat-card { transition: all 0.3s var(--ease); }
        .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }

        /* ── Category pills ── */
        .cat-pill {
          transition: all 0.25s var(--ease);
          font-family: var(--font-body);
          cursor: pointer;
          white-space: nowrap;
        }
        .cat-pill.active {
          background: linear-gradient(135deg, var(--saffron) 0%, var(--saffron-light) 100%);
          color: white !important;
          border-color: transparent !important;
          box-shadow: 0 6px 20px rgba(255,107,53,0.38);
          transform: translateY(-2px);
        }
        .cat-pill:not(.active):hover {
          border-color: var(--saffron) !important;
          color: var(--saffron) !important;
          transform: translateY(-2px);
          background: rgba(255,107,53,0.05) !important;
        }

        /* ── Destination cards ── */
        .dest-card { transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease); }
        .dest-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
        .dest-card:hover .dest-img { transform: scale(1.06); }
        .dest-card:hover .dest-arrow { opacity: 1 !important; transform: translate(0,0) !important; }

        /* ── Place cards ── */
        .mh-card { transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease); }
        .mh-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }

        /* ── Experience cards ── */
        .exp-card { transition: all 0.3s var(--ease); }
        .exp-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.18); }

        /* ── Quick action ── */
        .qa-btn { transition: all 0.3s var(--ease); }
        .qa-btn:hover { transform: translateY(-5px); }

        /* ── Travel tip cards ── */
        .tip-card { transition: all 0.3s var(--ease); }
        .tip-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }

        /* ── Skeleton ── */
        .skeleton {
          background: linear-gradient(90deg, #eff0f7 25%, #e8e9f3 50%, #eff0f7 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* ── CTA ── */
        .mh-cta-bg {
          background: linear-gradient(135deg, #0F1628 0%, #1e2d5a 40%, #3D52A0 70%, #0F1628 100%);
          background-size: 300% 100%;
          animation: ctaFlow 10s linear infinite;
          position: relative;
          overflow: hidden;
        }
        .mh-cta-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,107,53,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        @keyframes ctaFlow { 0%{background-position:0%} 100%{background-position:300%} }

        /* ── Divider ── */
        .mh-divider {
          display: flex; align-items: center; gap: 16px;
          margin: 0 auto 2rem; max-width: 300px;
        }
        .mh-divider::before, .mh-divider::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent);
        }

        /* ── Search ── */
        .hero-search { transition: box-shadow 0.3s; }
        .hero-search:focus-within { box-shadow: 0 0 0 3px rgba(255,107,53,0.25), 0 24px 60px rgba(0,0,0,0.25); }

        /* ── Quick pill ── */
        .quick-pill { transition: all 0.25s var(--ease); }
        .quick-pill:hover { background: rgba(255,180,55,0.2) !important; border-color: var(--gold-light) !important; color: var(--gold-light) !important; transform: translateY(-2px); }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f4f4fa; }
        ::-webkit-scrollbar-thumb { background: var(--saffron); border-radius: 3px; }

        /* ── Responsive ── */
        @media(max-width:768px){
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .dest-grid  { grid-template-columns: 1fr !important; }
          .dest-grid > *:first-child { height: 280px !important; grid-row: auto !important; }
          .exp-grid   { grid-template-columns: 1fr !important; }
          .tip-grid   { grid-template-columns: 1fr !important; }
          .qa-grid    { grid-template-columns: repeat(2,1fr) !important; }
          .cards-grid { grid-template-columns: 1fr !important; }
        }
        @media(max-width:480px){
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .qa-grid    { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* ══════════════════════ HERO ══════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "var(--navy)",
        }}
      >
        {/* Slider bg */}
        <div style={{ position: "absolute", inset: 0 }}>
          <HeroSlider />
        </div>

        {/* Gradient overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(15,22,40,0.18) 0%, rgba(15,22,40,0.55) 55%, rgba(15,22,40,0.92) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(255,107,53,0.16) 0%, transparent 65%)",
          }}
        />

        {/* Hero content */}
        <div
          className={`mh-hero-content ${heroVisible ? "visible-state" : "hidden-state"}`}
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "0 1.5rem 9rem",
            maxWidth: 680,
            margin: "0 auto",
          }}
        >
          {/* Eyebrow badge */}
          <div
            className="mh-d1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(201,168,76,0.14)",
              border: "1px solid rgba(201,168,76,0.42)",
              color: "var(--gold-light)",
              padding: "7px 22px",
              borderRadius: "50px",
              fontSize: "0.7rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "1.75rem",
              backdropFilter: "blur(8px)",
              fontFamily: "var(--font-body)",
            }}
          >
            <span className="live-dot" />
            Incredible Maharashtra
          </div>

          {/* Title */}
          <h1
            className="mh-d2"
            style={{
              fontFamily: "var(--font-display)",
              color: "white",
              fontSize: "clamp(3.2rem,9vw,6.5rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              marginBottom: "1.25rem",
              textShadow: "0 2px 30px rgba(0,0,0,0.3)",
            }}
          >
            Discover the
            <br />
            <span style={{ color: "var(--gold-light)", fontStyle: "italic" }}>
              Soul
            </span>{" "}
            of Maharashtra
          </h1>

          <p
            className="mh-d3"
            style={{
              fontSize: "clamp(0.95rem,2vw,1.15rem)",
              color: "rgba(255,255,255,0.78)",
              maxWidth: 520,
              margin: "0 auto 2rem",
              lineHeight: 1.8,
              fontFamily: "var(--font-body)",
              fontWeight: 300,
            }}
          >
            360+ forts, UNESCO caves, Konkan shores & vibrant cities — India's
            most multifaceted state awaits your footsteps.
          </p>

          {/* Search bar */}
          <div
            className="mh-d4 hero-search"
            style={{
              display: "flex",
              overflow: "hidden",
              borderRadius: 16,
              boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
              maxWidth: 560,
              margin: "0 auto 1.5rem",
              background: "white",
            }}
          >
            <input
              type="text"
              placeholder="Search places, forts, beaches, experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "1rem 1.5rem",
                border: "none",
                outline: "none",
                fontSize: "0.95rem",
                fontFamily: "var(--font-body)",
                color: "var(--navy)",
                background: "transparent",
              }}
            />
            <button
              style={{
                padding: "0 1.75rem",
                background:
                  "linear-gradient(135deg, var(--saffron), var(--saffron-light))",
                border: "none",
                color: "white",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                flexShrink: 0,
                letterSpacing: "0.03em",
              }}
            >
              Search
            </button>
          </div>

          {/* Quick filter pills */}
          <div
            className="mh-d5"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {[
              "🏰 Forts",
              "🌊 Beaches",
              "🍛 Food Tours",
              "💎 Hidden Gems",
              "🌿 Eco Trails",
              "🏛️ Heritage",
            ].map((p) => (
              <span
                key={p}
                className="quick-pill"
                onClick={() => setSearchQuery(p.split(" ").slice(1).join(" "))}
                style={{
                  background: "rgba(255,255,255,0.09)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.88)",
                  padding: "7px 16px",
                  borderRadius: "50px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom info bar */}
        <div
          style={{
            position: "absolute",
            bottom: "2.35rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 26px",
            borderRadius: 50,
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "rgba(255,255,255,0.9)",
            fontSize: "0.82rem",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-body)",
            zIndex: 20,
            boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          }}
        >
          <span className="live-dot" />
          <span>
            <strong>
              {weatherData.icon} {weatherData.temp}
            </strong>{" "}
            in Maharashtra · <strong>36</strong> districts ·{" "}
            <strong>Best time:</strong> Oct–Mar
          </span>
        </div>

        {searchQuery && (
          <div
            style={{
              position: "absolute",
              bottom: "7.7rem",
              left: 0,
              right: 0,
              textAlign: "center",
              color: "rgba(255,255,255,0.75)",
              fontSize: "0.78rem",
              fontFamily: "var(--font-body)",
              zIndex: 20,
            }}
          >
            Showing results for "
            <strong style={{ color: "var(--gold-light)" }}>
              {searchQuery}
            </strong>
            " across all categories
          </div>
        )}

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2.75rem",
            right: "2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            color: "rgba(255,255,255,0.38)",
            fontSize: "0.62rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "var(--font-body)",
            zIndex: 20,
          }}
        >
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ══════════════════════ STATS ══════════════════════════════════════════ */}
      <section
        style={{
          background: "white",
          padding: "4rem 2rem",
          borderBottom: "1px solid #f0f0f8",
          position: "relative",
        }}
      >
        {/* Decorative top line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 3,
            borderRadius: 2,
            background:
              "linear-gradient(90deg, var(--saffron), var(--saffron-light))",
          }}
        />
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "1.25rem",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {[
            {
              num: fortsCount,
              suffix: "+",
              label: "Historic Forts",
              ref: fortsRef,
              icon: "🏰",
              color: "#3D52A0",
            },
            {
              num: beachCount,
              suffix: " km",
              label: "Coastline",
              ref: beachRef,
              icon: "🌊",
              color: "#0A9A90",
            },
            {
              num: heritageCount,
              suffix: "",
              label: "UNESCO Sites",
              ref: heritageRef,
              icon: "🏛️",
              color: "var(--gold)",
            },
            {
              num: districtCount,
              suffix: "",
              label: "Districts",
              ref: districtRef,
              icon: "🗺️",
              color: "var(--saffron)",
            },
          ].map((s, i) => (
            <div
              key={i}
              ref={s.ref}
              className="stat-card"
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                borderRadius: 20,
                background: "linear-gradient(145deg, #fafbff, #f5f6ff)",
                border: "1px solid #eeeffa",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${s.color}80, ${s.color})`,
                  borderRadius: "20px 20px 0 0",
                }}
              />
              <div style={{ fontSize: "1.6rem", marginBottom: "0.6rem" }}>
                {s.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.4rem",
                  fontWeight: 700,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.num.toLocaleString()}
                {s.suffix}
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "#888",
                  fontWeight: 600,
                  marginTop: "0.5rem",
                  fontFamily: "var(--font-body)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ QUICK ACTIONS ═════════════════════════════════ */}
      <section style={{ padding: "5rem 2rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <SectionHeader
            eyebrow="Quick Browse"
            eyebrowColor="var(--indigo)"
            eyebrowBg="rgba(61,82,160,0.08)"
            title="What Are You Looking For?"
          />
          <div
            className="qa-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "1.25rem",
              maxWidth: 820,
              margin: "0 auto",
            }}
          >
            {QUICK_ACTIONS.map((a, i) => (
              <Link
                to={a.link}
                key={i}
                className="qa-btn"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  padding: "2.25rem 1rem 2rem",
                  borderRadius: 20,
                  background: "white",
                  border: `1.5px solid ${a.color}20`,
                  color: a.color,
                  fontFamily: "var(--font-body)",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  minHeight: 140,
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = a.color;
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.boxShadow = `0 16px 40px ${a.color}40`;
                  e.currentTarget.style.borderColor = "transparent";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = a.color;
                  e.currentTarget.style.boxShadow =
                    "0 4px 18px rgba(0,0,0,0.06)";
                  e.currentTarget.style.borderColor = `${a.color}20`;
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 14,
                    background: a.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.7rem",
                    transition: "all 0.3s",
                  }}
                >
                  {a.icon}
                </div>
                <span style={{ letterSpacing: "0.01em" }}>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ DESTINATIONS ══════════════════════════════════ */}
      <section
        className="mh-reveal"
        ref={revealRef}
        style={{ padding: "5rem 2rem", background: "white" }}
      >
        <SectionHeader
          eyebrow="Top Picks"
          title="Iconic Maharashtra Destinations"
          subtitle="Hand-picked places that capture the diverse magic of Maharashtra."
        />
        <div
          className="dest-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "1rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {DESTINATIONS.map((d, i) => (
            <div
              key={i}
              className="dest-card"
              style={{
                position: "relative",
                borderRadius: 20,
                overflow: "hidden",
                cursor: "pointer",
                height: i === 0 ? 500 : 236,
                gridRow: i === 0 ? "span 2" : "auto",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <img
                src={d.img}
                alt={d.name}
                className="dest-img"
                style={{
                  width: "100%",
                  height: "100%",
                  objectCover: "cover",
                  objectFit: "cover",
                  transition: "transform 0.7s var(--ease)",
                }}
                loading="lazy"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 25%, rgba(8,10,28,0.85) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: i === 0 ? "1.75rem" : "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--gold-light)",
                    marginBottom: 4,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {d.tag}
                </span>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: i === 0 ? "2.4rem" : "1.6rem",
                    fontWeight: 700,
                    color: "white",
                    lineHeight: 1.1,
                    marginBottom: 5,
                  }}
                >
                  {d.name}
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.68)",
                    marginBottom: 8,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {d.desc}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.84rem",
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                    }}
                  >
                    ✈️ From {d.price}
                  </span>
                  <span
                    className="dest-arrow"
                    style={{
                      background: "rgba(255,255,255,0.14)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "white",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      opacity: 0,
                      transform: "translate(-6px,6px)",
                      transition: "all 0.3s var(--ease)",
                    }}
                  >
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ CATEGORY FILTER + CARDS ═══════════════════════ */}
      <section
        className="mh-reveal"
        ref={revealRef}
        style={{ padding: "5rem 2rem 6rem", background: "var(--cream)" }}
      >
        <SectionHeader
          eyebrow="Explore by Category"
          eyebrowColor="var(--indigo)"
          eyebrowBg="rgba(61,82,160,0.08)"
          title="Maharashtra, India"
          subtitle="Pick a category to filter your recommendations"
        />

        {/* Category pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem",
            justifyContent: "center",
            marginBottom: "2.5rem",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`cat-pill ${selected === cat.key ? "active" : ""}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "0.65rem 1.35rem",
                borderRadius: "50px",
                border: "1.5px solid",
                fontSize: "0.84rem",
                fontWeight: 600,
                borderColor: selected === cat.key ? "transparent" : "#dde0ee",
                color: selected === cat.key ? "white" : "#555",
                background: selected === cat.key ? "" : "white",
                fontFamily: "var(--font-body)",
              }}
            >
              <span style={{ fontSize: "1rem" }}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search filter */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "50px",
              border: "1.5px solid #dde0ee",
              width: 320,
              background: "white",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              transition: "border-color 0.25s, box-shadow 0.25s",
            }}
            onFocusCapture={(e) => {
              e.currentTarget.style.borderColor = "var(--saffron)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(255,107,53,0.12)";
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.borderColor = "#dde0ee";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
            }}
          >
            <span
              style={{
                paddingLeft: "1.1rem",
                color: "#bbb",
                fontSize: "1rem",
                flexShrink: 0,
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Filter places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                border: "none",
                outline: "none",
                fontSize: "0.88rem",
                fontFamily: "var(--font-body)",
                background: "transparent",
                color: "var(--navy)",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  paddingRight: "1rem",
                  background: "none",
                  border: "none",
                  color: "#bbb",
                  cursor: "pointer",
                  fontSize: "1rem",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div
            className="cards-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "white",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div className="skeleton" style={{ height: 210 }} />
                <div style={{ padding: "1.25rem" }}>
                  <div
                    className="skeleton"
                    style={{ height: 18, marginBottom: 10, width: "68%" }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: 13, width: "48%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCards.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "5rem 2rem", color: "#aaa" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "#999",
              }}
            >
              No places found. Try a different keyword.
            </p>
          </div>
        ) : (
          <div
            className="cards-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.75rem",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {filteredCards.map((card, i) => (
              <div
                key={i}
                className="mh-card"
                style={{
                  background: "white",
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "1px solid rgba(200,205,235,0.28)",
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {card.images && <ImageCarousel images={[card.images]} />}
                <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "var(--navy)",
                      marginBottom: "0.3rem",
                    }}
                  >
                    <Link
                      to={`/locations/${card._id}`}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--saffron)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--navy)")
                      }
                    >
                      {card.title}
                    </Link>
                  </h3>
                  {card.subtitle && (
                    <p
                      style={{
                        fontSize: "0.84rem",
                        color: "#8a8fa8",
                        fontFamily: "var(--font-body)",
                        lineHeight: 1.6,
                      }}
                    >
                      {card.subtitle}
                    </p>
                  )}
                  <div
                    style={{
                      marginTop: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid #f0f1f8",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--saffron)",
                        fontFamily: "var(--font-body)",
                        background: "rgba(255,107,53,0.08)",
                        padding: "3px 10px",
                        borderRadius: "50px",
                      }}
                    >
                      {CATEGORIES.find((c) => c.key === selected)?.icon}{" "}
                      {CATEGORIES.find((c) => c.key === selected)?.label}
                    </span>
                    <Link
                      to={`/locations/${card._id}`}
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "var(--indigo)",
                        textDecoration: "none",
                        fontFamily: "var(--font-body)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        transition: "gap 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.gap = "8px")}
                      onMouseLeave={(e) => (e.currentTarget.style.gap = "4px")}
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Outlet />
      </section>

      {/* ══════════════════════ UNIQUE EXPERIENCES ════════════════════════════ */}
      <section
        className="mh-reveal"
        ref={revealRef}
        style={{
          padding: "6rem 2rem",
          background: "var(--navy)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(61,82,160,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <SectionHeader
            eyebrow="Only in Maharashtra"
            eyebrowColor="var(--gold-light)"
            eyebrowBg="rgba(201,168,76,0.14)"
            title="Unique Experiences"
            subtitle="Beyond the ordinary — moments that only Maharashtra can offer."
            light
          />
          <div
            className="exp-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "1.25rem",
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            {EXPERIENCES.map((exp, i) => (
              <div
                key={i}
                className="exp-card"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 20,
                  padding: "2rem",
                  border: `1px solid rgba(255,255,255,0.08)`,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, ${exp.color}00, ${exp.color}, ${exp.color}00)`,
                  }}
                />
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: exp.light,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.6rem",
                    marginBottom: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  {exp.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "white",
                    marginBottom: "0.6rem",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {exp.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.7,
                    fontFamily: "var(--font-body)",
                    flex: 1,
                  }}
                >
                  {exp.desc}
                </p>
                <div
                  style={{
                    marginTop: "1.5rem",
                    height: 3,
                    borderRadius: 3,
                    background: exp.color,
                    width: 32,
                    flexShrink: 0,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ TRAVEL TIPS ══════════════════════════════════ */}
      <section
        className="mh-reveal"
        ref={revealRef}
        style={{ padding: "5rem 2rem", background: "white" }}
      >
        <SectionHeader
          eyebrow="Insider Knowledge"
          eyebrowColor="var(--indigo)"
          eyebrowBg="rgba(61,82,160,0.08)"
          title="Travel Tips for Maharashtra"
        />
        <div
          className="tip-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "1.25rem",
            maxWidth: 960,
            margin: "0 auto",
          }}
        >
          {TRAVEL_TIPS.map((tip, i) => (
            <div
              key={i}
              className="tip-card"
              style={{
                display: "flex",
                gap: "1.25rem",
                padding: "1.75rem",
                borderRadius: 20,
                background: "linear-gradient(145deg, #fafbff, #f5f6ff)",
                border: "1px solid #eeeffa",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "rgba(61,82,160,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  flexShrink: 0,
                }}
              >
                {tip.icon}
              </div>
              <div>
                <h4
                  style={{
                    fontWeight: 700,
                    color: "var(--navy)",
                    marginBottom: "0.45rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.97rem",
                  }}
                >
                  {tip.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#777",
                    lineHeight: 1.7,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {tip.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ CTA ═══════════════════════════════════════════ */}
      <section
        className="mh-cta-bg"
        style={{
          padding: "7rem 2rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Divider ornament */}
          <div className="mh-divider" style={{ marginBottom: "2.5rem" }}>
            <span style={{ color: "var(--gold)", fontSize: "1rem" }}>✦</span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem,5vw,3.2rem)",
              fontWeight: 700,
              color: "white",
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            Ready to Explore Maharashtra?
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.68)",
              marginBottom: "2.75rem",
              maxWidth: 500,
              marginLeft: "auto",
              marginRight: "auto",
              fontFamily: "var(--font-body)",
              lineHeight: 1.75,
              fontWeight: 300,
            }}
          >
            From misty forts to sun-drenched coasts — let us craft your perfect
            Maharashtra journey.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/contact"
              style={{
                padding: "1rem 2.5rem",
                background: "linear-gradient(135deg, var(--gold), #e8bf60)",
                color: "var(--navy)",
                borderRadius: "50px",
                fontSize: "0.97rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                boxShadow: "0 10px 32px rgba(201,168,76,0.45)",
                textDecoration: "none",
                display: "inline-block",
                transition: "all 0.3s",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 18px 44px rgba(201,168,76,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 32px rgba(201,168,76,0.45)";
              }}
            >
              Plan My Maharashtra Trip 🗺️
            </Link>
            <a
              href="tel:+917888251550"
              style={{
                padding: "1rem 2.5rem",
                background: "rgba(255,255,255,0.07)",
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.25)",
                borderRadius: "50px",
                fontSize: "0.97rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                textDecoration: "none",
                display: "inline-block",
                transition: "all 0.3s",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.13)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              📞 Call Us Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Maharashtra;
