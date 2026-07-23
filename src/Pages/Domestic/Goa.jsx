import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import Header from "../../Components/Header/Header";

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
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=85",
    place: "Calangute Shoreline",
    tag: "Golden Hour",
  },
  {
    img: "https://images.unsplash.com/photo-1718275520594-8bb2d4fae9f0?w=1800&q=85",
    place: "Old Goa Basilica",
    tag: "UNESCO Heritage",
  },
  {
    img: "https://images.unsplash.com/photo-1652120704209-14cbc87b603f?w=1800&q=85",
    place: "Dudhsagar Falls",
    tag: "Sea of Milk",
  },
  {
    img: "https://images.unsplash.com/photo-1727499031382-407906c7e208?w=1800&q=85",
    place: "Candolim Boats",
    tag: "Fishing Coast",
  },
];

const CATEGORIES = [
  { key: "beaches", label: "Beaches", icon: "🏖️" },
  { key: "heritage", label: "Heritage & Churches", icon: "⛪" },
  { key: "watersports", label: "Water Sports", icon: "🤿" },
  { key: "nightlife", label: "Nightlife & Shacks", icon: "🎶" },
  { key: "hidden", label: "Hidden Coves", icon: "💎" },
  { key: "family", label: "Family Friendly", icon: "👨‍👩‍👧‍👦" },
  { key: "spice", label: "Spice & Cuisine", icon: "🌶️" },
  { key: "wildlife", label: "Wildlife & Nature", icon: "🦜" },
];

const QUICK_ACTIONS = [
  {
    label: "Stay",
    icon: "🏨",
    color: "#3D52A0",
    bg: "rgba(61,82,160,0.08)",
    link: "/stay",
  },
  {
    label: "Beach Shacks",
    icon: "🍤",
    color: "#FF6B35",
    bg: "rgba(255,107,53,0.08)",
    link: "/beach-shacks",
  },
  {
    label: "Water Sports",
    icon: "🛶",
    color: "#0e9e94",
    bg: "rgba(14,158,148,0.08)",
    link: "/water-sports",
  },
  {
    label: "Villas & Homestays",
    icon: "🏡",
    color: "#c47c1a",
    bg: "rgba(196,124,26,0.08)",
    link: "/villas-homestays",
  },
];

const DESTINATIONS = [
  {
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    name: "Baga & Calangute",
    tag: "North Goa Buzz",
    price: "₹5,499",
    desc: "Shacks, parasailing & sundown parties",
  },
  {
    img: "https://images.unsplash.com/photo-1567005753256-c0529035b300?w=800&q=80",
    name: "Old Goa",
    tag: "UNESCO Heritage",
    price: "₹3,999",
    desc: "Baroque basilicas & 400-year-old bells",
  },
  {
    img: "https://images.unsplash.com/photo-1667760334198-d3958029a08b?w=800&q=80",
    name: "Dudhsagar Falls",
    tag: "Sea of Milk",
    price: "₹4,499",
    desc: "A four-tiered cascade through the Sahyadris",
  },
  {
    img: "https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?w=800&q=80",
    name: "Palolem",
    tag: "South Goa Calm",
    price: "₹6,299",
    desc: "Crescent sands & swaying palms",
  },
  {
    img: "https://images.unsplash.com/photo-1566824099147-bef027d3a333?w=800&q=80",
    name: "Anjuna & Mapusa",
    tag: "Flea Market Trail",
    price: "₹2,999",
    desc: "Spice sacks, vinyl crates & sundown bazaars",
  },
  {
    img: "https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?w=800&q=80",
    name: "Candolim",
    tag: "Beach Shack Row",
    price: "₹5,999",
    desc: "Easy sand, easy seafood, easy living",
  },
];

const EXPERIENCES = [
  {
    icon: "🍤",
    title: "Beach Shack Trails",
    desc: "Bare feet in the sand, a king fish curry on the table, and the tide doing all the talking. Goa's shacks are an institution of their own.",
    color: "#FF6B35",
  },
  {
    icon: "⛪",
    title: "Portuguese Heritage Walks",
    desc: "Wander Fontainhas' ochre lanes and the basilicas of Old Goa, where four centuries of Indo-Portuguese history are written into the walls.",
    color: "#C9A84C",
  },
  {
    icon: "🌶️",
    title: "Spice Plantation Tours",
    desc: "Ponda's plantations open their groves for guided walks through cardamom, pepper and nutmeg, ending in a banana-leaf Konkani thali.",
    color: "#4ECDC4",
  },
  {
    icon: "🚤",
    title: "Sunset Cruise & Dolphin Watch",
    desc: "Drift down the Mandovi as the sky turns copper, or head out at dawn to spot dolphins off the Sinquerim coast.",
    color: "#3D52A0",
  },
  {
    icon: "🛍️",
    title: "Flea Markets & Night Bazaars",
    desc: "Anjuna's Wednesday flea market and the Arpora Saturday Night Bazaar trade in everything from silver jewellery to live music.",
    color: "#FFB347",
  },
  {
    icon: "🤿",
    title: "Water Sports Adventures",
    desc: "Parasailing over Baga, scuba at Grande Island, or a jet-ski run past Candolim — the Arabian Sea is Goa's real playground.",
    color: "#7BAE7F",
  },
];

const TRAVEL_TIPS = [
  {
    icon: "🌤️",
    title: "Best Time to Visit",
    tip: "Nov–Feb is peak season: cool, dry and festive. Mar–May turns hot. Jun–Sep monsoon rains empty the beaches but fill the waterfalls and drop hotel rates sharply.",
  },
  {
    icon: "🛵",
    title: "Getting Around",
    tip: "A rented scooter is the local way to see Goa — helmets are mandatory for both rider and pillion. Flat-bottomed ferries still cross the Mandovi and Zuari rivers for a slower, scenic route.",
  },
  {
    icon: "💰",
    title: "Budget Guide",
    tip: "Hostel bed + street food: ₹1,500/day. Mid-range guesthouse + shacks: ₹4,000/day. Beachfront resort with all the trimmings: ₹12,000+/night.",
  },
  {
    icon: "🗣️",
    title: "Local Language & Spirit",
    tip: 'Konkani is the official language, with Portuguese still echoing in surnames and recipes. Locals call their easy-going philosophy "susegad" — and you\'ll feel it within a day.',
  },
];

const COASTS = [
  {
    key: "north",
    name: "North Goa",
    img: "https://images.unsplash.com/photo-1496566084516-c5b96fcbd5c8?w=900&q=80",
    blurb:
      "Buzzing beaches, beach shacks and sundown parties that run past midnight.",
    points: [
      "Baga & Calangute nightlife",
      "Anjuna flea market",
      "Vagator's cliffside views",
      "Chapora Fort sunsets",
    ],
  },
  {
    key: "south",
    name: "South Goa",
    img: "https://images.unsplash.com/photo-1646748019039-e908f7e41282?w=900&q=80",
    blurb:
      "Quiet coves, coconut groves and mornings with nowhere in particular to be.",
    points: [
      "Palolem's crescent beach",
      "Cabo de Rama's fort ruins",
      "Cotigao wildlife sanctuary",
      "Colva's wide open sands",
    ],
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
    <div className="relative w-full" style={{ paddingTop: "68%" }}>
      <img
        src={images[index]}
        alt={`slide-${index}`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />
      <button
        onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-black/70 transition-colors"
      >
        ‹
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % images.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-black/70 transition-colors"
      >
        ›
      </button>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full border-none transition-all ${i === index ? "bg-white w-5" : "bg-white/50 w-1.5"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Hero Slider ────────────────────────────────────────────────────────────────
function GoaHeroSlider() {
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
          />
        </div>
      ))}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 flex flex-col gap-2 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all rounded-full border border-white/60 ${i === current ? "h-8 w-2 bg-white" : "h-2 w-2 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function Goa() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialCategory =
    searchParams.get("category") ||
    localStorage.getItem("goa_category") ||
    "beaches";
  const [selected, setSelected] = useState(initialCategory);
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCards, setAllCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [heroVisible, setHeroVisible] = useState(false);
  const [activeCoast, setActiveCoast] = useState("north");
  const [openTip, setOpenTip] = useState(0);
  const [weatherData] = useState({
    temp: "31°C",
    condition: "Sea Breeze",
    icon: "🌤️",
  });
  const carouselRef = useRef(null);

  const [beachCount, beachRef] = useCountUp(40, 1800);
  const [coastCount, coastRef] = useCountUp(105, 2000);
  const [districtCount, districtRef] = useCountUp(2, 1000);
  const [heritageCount, heritageRef] = useCountUp(450, 2200);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  const fetchData = useCallback(async (type) => {
    setLoading(true);
    try {
      const res = await api.get(`/goa-cards/${type}`);
      setCardData(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
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
        const res = await api.get(`/goa-cards/getall`);
        setAllCards(Array.isArray(res.data.data) ? res.data.data : []);
      } catch {
        setAllCards([]);
      }
    };
    fetchAllCards();
  }, []);

  const handleCategoryChange = (key) => {
    if (key !== selected) {
      setSelected(key);
      localStorage.setItem("goa_category", key);
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

  const scrollCarousel = (dir) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

        :root {
          --gold:        #C9A84C;
          --gold-light:  #F0D080;
          --navy:        #0d1b2a;
          --navy-mid:    #1a2a3a;
          --indigo:      #3D52A0;
          --indigo-light:#7091E6;
          --saffron:     #FF6B35;
          --saffron-lt:  #FFB347;
          --teal:        #0e9e94;
          --teal-light:  #4ECDC4;
          --cream:       #FDFAF4;
          --cream-dark:  #F5F0E8;
          --font-d: 'Cormorant Garamond', serif;
          --font-b: 'DM Sans', sans-serif;
          --ease: cubic-bezier(0.4,0,0.2,1);
          --r-xl: 24px;
          --r-lg: 18px;
          --r-md: 12px;
          --r-sm: 8px;
        }

        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: var(--font-b); overflow-x: hidden; }

        /* Transitions */
        .ga-hero-content { transition: all 1s var(--ease); }
        .ga-hero-content.hidden-state  { opacity:0; transform:translateX(-30px); }
        .ga-hero-content.visible-state { opacity:1; transform:translateX(0); }

        /* Staggered fade-up */
        .ga-d1 { animation: gaUp .8s .10s var(--ease) both; }
        .ga-d2 { animation: gaUp .8s .25s var(--ease) both; }
        .ga-d3 { animation: gaUp .8s .40s var(--ease) both; }
        .ga-d4 { animation: gaUp .8s .55s var(--ease) both; }
        @keyframes gaUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

        /* Live dot */
        .live-dot {
          display:inline-block; width:8px; height:8px;
          background:#4CAF50; border-radius:50%;
          animation: livePulse 2s infinite;
        }
        @keyframes livePulse {
          0%,100%{box-shadow:0 0 0 3px rgba(76,175,80,.25)}
          50%    {box-shadow:0 0 0 7px rgba(76,175,80,.08)}
        }

        /* Scroll reveal */
        .ga-reveal { opacity:0; transform:translateY(28px); transition:opacity .75s var(--ease),transform .75s var(--ease); }
        .ga-reveal.revealed { opacity:1; transform:translateY(0); }

        /* ── Section label pill ── */
        .ga-label {
          display:inline-block;
          font-size:.72rem; font-weight:700; letter-spacing:.15em;
          text-transform:uppercase; padding:5px 16px; border-radius:50px;
          font-family:var(--font-b); margin-bottom:1rem;
        }

        /* ── Hero search bar ── */
        .ga-search-bar {
          display:flex; overflow:hidden; border-radius:16px;
          background:white; box-shadow:0 20px 60px rgba(0,0,0,.22);
          max-width:500px;
        }
        .ga-search-bar input {
          flex:1; padding:1.1rem 1.5rem; border:none; outline:none;
          font-size:1rem; font-family:var(--font-b); color:var(--navy);
          background:transparent;
        }
        .ga-search-bar button {
          padding:0 2rem; background:linear-gradient(135deg,var(--teal),#0b7c73);
          border:none; color:white; font-weight:700; font-size:.95rem;
          cursor:pointer; font-family:var(--font-b); letter-spacing:.02em;
          transition:filter .2s;
        }
        .ga-search-bar button:hover { filter:brightness(1.1); }

        /* ── Quick pills under search ── */
        .ga-quick-pill {
          display:inline-block;
          background:rgba(255,255,255,.12);
          border:1px solid rgba(255,255,255,.22);
          color:rgba(255,255,255,.9);
          padding:6px 16px; border-radius:50px;
          font-size:.82rem; cursor:pointer;
          transition:all .25s var(--ease);
          font-family:var(--font-b);
        }
        .ga-quick-pill:hover {
          background:rgba(14,158,148,.3);
          border-color:rgba(14,158,148,.6);
          color:var(--teal-light);
        }

        /* ── Wave ── */
        .ga-wave path { fill:var(--cream); }

        /* ── Stat chips ── */
        .ga-stat {
          background:white; border-radius:var(--r-xl);
          border:1px solid #eef0f8;
          padding:1.6rem 1.8rem; min-width:155px; text-align:center;
          box-shadow:0 8px 28px rgba(0,0,0,.06);
          transition:transform .3s var(--ease),box-shadow .3s var(--ease);
        }
        .ga-stat:hover { transform:translateY(-5px); box-shadow:0 18px 40px rgba(0,0,0,.1); }
        .ga-stat-icon { font-size:1.6rem; margin-bottom:.5rem; }
        .ga-stat-num  { font-family:var(--font-d); font-size:2.4rem; font-weight:700; color:var(--teal); line-height:1; }
        .ga-stat-lbl  { font-size:.8rem; color:#888; font-weight:500; margin-top:.35rem; }

        /* ── Weather strip ── */
        .ga-wx {
          display:inline-flex; align-items:center; gap:10px;
          padding:9px 22px; border-radius:50px;
          background:white; border:1px solid #eef0f8;
          color:#555; font-size:.83rem; font-family:var(--font-b);
          box-shadow:0 4px 16px rgba(0,0,0,.05);
        }

        /* ── Coast cards ── */
        .ga-coast {
          border-radius:var(--r-xl); overflow:hidden; position:relative;
          height:400px; cursor:pointer;
          border:3px solid transparent;
          transition:border-color .35s var(--ease), box-shadow .35s var(--ease);
        }
        .ga-coast.active { border-color:var(--saffron); box-shadow:0 28px 60px rgba(255,107,53,.2); }
        .ga-coast img { width:100%; height:100%; object-fit:cover; transition:transform .7s var(--ease); }
        .ga-coast:hover img { transform:scale(1.06); }
        .ga-coast-overlay { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:flex-end; padding:1.75rem; background:linear-gradient(180deg,transparent 25%,rgba(8,12,28,.88) 100%); }
        .ga-coast-name { font-family:var(--font-d); font-size:2.1rem; font-weight:700; color:white; margin-bottom:.4rem; }
        .ga-coast-blurb { font-size:.87rem; color:rgba(255,255,255,.72); margin-bottom:.9rem; font-family:var(--font-b); line-height:1.6; }
        .ga-coast-tag { font-size:.7rem; color:white; background:rgba(255,255,255,.15); padding:4px 11px; border-radius:50px; border:1px solid rgba(255,255,255,.2); }
        .ga-coast-check { position:absolute; top:14px; right:14px; width:34px; height:34px; border-radius:50%; background:var(--saffron); display:flex; align-items:center; justify-content:center; color:white; font-size:.85rem; }

        /* ── Quick actions ── */
        .ga-qa-btn {
          display:flex; align-items:center; gap:12px;
          padding:1.1rem 1.75rem; border-radius:50px;
          border:none; cursor:pointer; white-space:nowrap; flex-shrink:0;
          font-family:var(--font-b); font-size:.95rem; font-weight:600;
          transition:all .3s var(--ease);
          box-shadow:0 4px 18px rgba(0,0,0,.07);
        }
        .ga-qa-btn:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,.15); }
        .ga-qa-icon { font-size:1.5rem; }

        /* ── Carousel ── */
        .ga-carousel { display:flex; gap:1.25rem; overflow-x:auto; scroll-snap-type:x mandatory; scrollbar-width:none; padding-bottom:4px; }
        .ga-carousel::-webkit-scrollbar { display:none; }
        .ga-dest-card { position:relative; border-radius:var(--r-xl); overflow:hidden; cursor:pointer; flex-shrink:0; width:295px; height:390px; scroll-snap-align:start; }
        .ga-dest-card img { width:100%; height:100%; object-fit:cover; transition:transform .6s var(--ease); }
        .ga-dest-card:hover img { transform:scale(1.07); }
        .ga-dest-overlay { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:flex-end; padding:1.4rem; background:linear-gradient(180deg,transparent 30%,rgba(8,12,28,.88) 100%); }
        .ga-dest-tag  { font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--gold-light); margin-bottom:.3rem; }
        .ga-dest-name { font-family:var(--font-d); font-size:1.65rem; font-weight:700; color:white; line-height:1.1; margin-bottom:.35rem; }
        .ga-dest-desc { font-size:.81rem; color:rgba(255,255,255,.68); margin-bottom:.5rem; font-family:var(--font-b); }
        .ga-dest-price{ font-size:.84rem; color:rgba(255,255,255,.85); font-family:var(--font-b); }
        .ga-scroll-btn { width:42px; height:42px; border-radius:50%; border:1.5px solid #dde0ee; background:white; cursor:pointer; font-size:1.2rem; display:flex; align-items:center; justify-content:center; transition:all .25s var(--ease); color:#555; }
        .ga-scroll-btn:hover { background:var(--indigo); color:white; border-color:var(--indigo); }

        /* ── Category tabs ── */
        .ga-tab-wrap { display:flex; flex-wrap:wrap; gap:4px; }
        .ga-tab {
          display:inline-flex; align-items:center; gap:6px;
          padding:9px 18px; border-radius:50px; border:1.5px solid #E5E7EB;
          background:white; cursor:pointer; font-family:var(--font-b);
          font-size:.85rem; font-weight:500; color:#555;
          transition:all .25s var(--ease);
        }
        .ga-tab:hover { border-color:var(--teal); color:var(--teal); }
        .ga-tab.active { background:var(--teal); border-color:var(--teal); color:white; font-weight:600; box-shadow:0 6px 20px rgba(14,158,148,.3); }

        /* ── Category search ── */
        .ga-filter-bar {
          display:flex; align-items:center;
          border:1.5px solid #E5E7EB; border-radius:50px;
          background:white; overflow:hidden; width:320px;
          box-shadow:0 2px 10px rgba(0,0,0,.05);
        }
        .ga-filter-bar input { flex:1; padding:.75rem 1.25rem; border:none; outline:none; font-size:.9rem; font-family:var(--font-b); }
        .ga-filter-bar span  { padding:0 1.1rem; color:#aaa; font-size:1rem; }

        /* ── Category cards ── */
        .ga-cat-card {
          background:white; border-radius:var(--r-xl); overflow:hidden;
          border:1px solid rgba(200,210,230,.25);
          box-shadow:0 4px 18px rgba(0,0,0,.05);
          transition:transform .35s var(--ease),box-shadow .35s var(--ease);
        }
        .ga-cat-card:hover { transform:translateY(-7px); box-shadow:0 20px 45px rgba(0,0,0,.11); }
        .ga-cat-tag {
          position:absolute; top:14px; left:14px;
          background:rgba(8,12,28,.72); backdrop-filter:blur(6px);
          color:white; font-size:.7rem; font-weight:700; letter-spacing:.04em;
          padding:5px 13px; border-radius:50px; font-family:var(--font-b);
        }
        .ga-cat-title { font-family:var(--font-d); font-size:1.3rem; font-weight:700; color:var(--navy); margin-bottom:.3rem; }
        .ga-cat-sub   { font-size:.84rem; color:#888; font-family:var(--font-b); line-height:1.55; }
        .ga-cat-link  { font-size:.8rem; font-weight:600; color:var(--indigo); text-decoration:none; font-family:var(--font-b); transition:color .2s; }
        .ga-cat-link:hover { color:var(--teal); }

        /* ── Experiences ── */
        .ga-exp-row {
          display:flex; align-items:flex-start; gap:20px;
          padding:1.4rem 1.25rem; border-radius:var(--r-lg);
          transition:background .3s var(--ease);
        }
        .ga-exp-row:hover { background:rgba(255,255,255,.05); }
        .ga-exp-icon {
          width:56px; height:56px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-size:1.65rem; flex-shrink:0;
          transition:transform .3s var(--ease);
        }
        .ga-exp-row:hover .ga-exp-icon { transform:scale(1.1) rotate(-4deg); }
        .ga-exp-title { font-size:1.05rem; font-weight:700; color:white; margin-bottom:.3rem; font-family:var(--font-b); }
        .ga-exp-desc  { font-size:.87rem; color:rgba(255,255,255,.52); line-height:1.65; font-family:var(--font-b); }
        .ga-exp-bar   { width:4px; border-radius:4px; flex-shrink:0; margin-left:auto; align-self:stretch; }
        .ga-exp-divider { border:none; border-top:1px solid rgba(255,255,255,.07); margin:0 1.25rem; }

        /* ── Travel tips accordion ── */
        .ga-tip-row {
          display:flex; align-items:center; gap:16px;
          padding:1.4rem 1.75rem; cursor:pointer;
          transition:background .2s var(--ease);
        }
        .ga-tip-row:hover { background:#f7f4ed; }
        .ga-tip-icon  { font-size:1.5rem; flex-shrink:0; }
        .ga-tip-title { flex:1; font-weight:700; color:var(--navy); font-family:var(--font-b); font-size:1rem; }
        .ga-tip-chev  { color:var(--teal); font-size:1.1rem; transition:transform .3s var(--ease); }
        .ga-tip-chev.open { transform:rotate(180deg); }
        .ga-tip-body  { padding:.25rem 1.75rem 1.5rem 1.75rem; }
        .ga-tip-body p { font-size:.9rem; color:#666; line-height:1.75; font-family:var(--font-b); padding-left:46px; }
        .ga-tip-sep   { border:none; border-top:1px solid #f0f0f8; margin:0; }

        /* ── Skeleton ── */
        .skeleton {
          background:linear-gradient(90deg,#f0f0f8 25%,#e8e8f0 50%,#f0f0f8 75%);
          background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:8px;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* ── CTA ── */
        .ga-cta { background:linear-gradient(135deg,#061c25 0%,var(--navy) 55%,#061c25 100%); background-size:200% 100%; animation:ctaMove 9s linear infinite; }
        @keyframes ctaMove { 0%{background-position:0%} 100%{background-position:200%} }
        .ga-cta-btn-gold {
          padding:1rem 2.5rem; background:var(--gold); color:var(--navy);
          border:none; border-radius:50px; font-size:1rem; font-weight:700;
          cursor:pointer; font-family:var(--font-b);
          box-shadow:0 10px 30px rgba(201,168,76,.4);
          text-decoration:none; display:inline-block; transition:all .3s;
        }
        .ga-cta-btn-gold:hover { transform:translateY(-2px); box-shadow:0 16px 40px rgba(201,168,76,.55); }
        .ga-cta-btn-ghost {
          padding:1rem 2.5rem; background:transparent; color:white;
          border:1.5px solid rgba(255,255,255,.35); border-radius:50px;
          font-size:1rem; font-weight:600; cursor:pointer; font-family:var(--font-b);
          text-decoration:none; display:inline-block; transition:all .3s;
        }
        .ga-cta-btn-ghost:hover { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.6); }

        /* ── Horizontal scroll rail ── */
        .ga-rail { display:flex; gap:1rem; overflow-x:auto; scrollbar-width:none; }
        .ga-rail::-webkit-scrollbar { display:none; }

        /* ── Responsive ── */
        @media(max-width:768px){
          .ga-coast-grid-inner { grid-template-columns:1fr !important; }
          .ga-stats-inner { flex-wrap:wrap !important; justify-content:center !important; }
          .ga-dest-card { width:270px; height:350px; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "94vh", background: "var(--navy)" }}
      >
        {/* Background slider */}
        <div className="absolute inset-0">
          <GoaHeroSlider />
        </div>

        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 18% 45%, rgba(14,158,148,.2) 0%, transparent 65%), linear-gradient(105deg, rgba(8,12,28,.94) 0%, rgba(8,12,28,.55) 42%, rgba(8,12,28,.18) 72%)",
          }}
        />

        {/* Content */}
        <div
          className={`relative z-10 px-6 md:px-20 ga-hero-content ${heroVisible ? "visible-state" : "hidden-state"}`}
          style={{ paddingTop: "4rem", maxWidth: 660 }}
        >
          {/* Badge */}
          <div className="ga-d1" style={{ marginBottom: "1rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(14,158,148,.15)",
                border: "1px solid rgba(14,158,148,.4)",
                color: "var(--teal-light)",
                padding: "7px 20px",
                borderRadius: "50px",
                fontSize: ".73rem",
                fontWeight: 700,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                fontFamily: "var(--font-b)",
              }}
            >
              <span className="live-dot" />
              Welcome to Susegad
            </span>
          </div>

          {/* Headline */}
          <h1
            className="ga-d2"
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(3.2rem,7.5vw,6.2rem)",
              fontWeight: 700,
              lineHeight: 1.03,
              color: "white",
              marginBottom: "1.25rem",
            }}
          >
            Find Your
            <br />
            <em style={{ color: "var(--gold-light)" }}>Goa</em> State of Mind
          </h1>

          {/* Sub */}
          <p
            className="ga-d3"
            style={{
              fontSize: "clamp(.95rem,2.2vw,1.15rem)",
              color: "rgba(255,255,255,.78)",
              maxWidth: 490,
              lineHeight: 1.8,
              fontFamily: "var(--font-b)",
              marginBottom: "2rem",
            }}
          >
            Forty beaches, four centuries of Portuguese heritage, and a
            coastline built for slowing down — India's smallest state, biggest
            welcome.
          </p>

          {/* Search bar */}
          <div
            className="ga-d4 ga-search-bar"
            style={{ marginBottom: "1.25rem" }}
          >
            <input
              type="text"
              placeholder="Search beaches, churches, shacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button>Search</button>
          </div>

          {/* Quick pills */}
          <div
            className="ga-d4"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "3rem",
            }}
          >
            {[
              "🏖️ Beaches",
              "⛪ Heritage",
              "🛶 Water Sports",
              "🎶 Nightlife",
              "💎 Hidden Coves",
              "🌶️ Spice Tours",
            ].map((p) => (
              <span
                key={p}
                className="ga-quick-pill"
                onClick={() => setSearchQuery(p.split(" ")[1])}
              >
                {p}
              </span>
            ))}
          </div>

          {searchQuery && (
            <p
              style={{
                color: "rgba(255,255,255,.68)",
                marginTop: ".75rem",
                fontSize: ".9rem",
                fontFamily: "var(--font-b)",
              }}
            >
              Showing results for "
              <strong style={{ color: "white" }}>{searchQuery}</strong>"
            </p>
          )}
        </div>

        {/* Wave */}
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="ga-wave"
          style={{
            position: "absolute",
            bottom: -1,
            left: 0,
            width: "100%",
            height: 85,
            zIndex: 6,
          }}
        >
          <path d="M0,50 C200,95 380,5 620,42 C860,80 1040,12 1260,46 C1340,58 1400,55 1440,46 L1440,100 L0,100 Z" />
        </svg>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--cream)", padding: "0 1.5rem 5rem" }}>
        <div
          className="ga-stats-inner"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.1rem",
            flexWrap: "wrap",
            maxWidth: 1000,
            margin: "0 auto",
            marginTop: "-1.5rem",
            position: "relative",
            zIndex: 8,
          }}
        >
          {[
            {
              num: beachCount,
              suffix: "+",
              label: "Beaches",
              ref: beachRef,
              icon: "🏖️",
            },
            {
              num: coastCount,
              suffix: " km",
              label: "Coastline",
              ref: coastRef,
              icon: "🌊",
            },
            {
              num: districtCount,
              suffix: "",
              label: "Districts (N & S)",
              ref: districtRef,
              icon: "🗺️",
            },
            {
              num: heritageCount,
              suffix: "+ yrs",
              label: "Indo-Portuguese Heritage",
              ref: heritageRef,
              icon: "⛪",
            },
          ].map((s, i) => (
            <div key={i} ref={s.ref} className="ga-stat">
              <div className="ga-stat-icon">{s.icon}</div>
              <div className="ga-stat-num">
                {s.num.toLocaleString()}
                {s.suffix}
              </div>
              <div className="ga-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Weather strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "4rem",
          }}
        >
          <div className="ga-wx">
            <span className="live-dot" />
            <span>
              <strong>
                {weatherData.icon} {weatherData.temp}
              </strong>{" "}
              on the coast today &nbsp;·&nbsp; <strong>Best time:</strong>{" "}
              Nov–Feb
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          NORTH vs SOUTH
      ══════════════════════════════════════════════════════ */}
      <section
        className="ga-reveal"
        style={{ padding: "0.1rem 1rem 3rem", background: "var(--cream)" }}
        ref={(el) => {
          if (el) {
            const o = new IntersectionObserver(
              ([e]) => {
                if (e.isIntersecting) el.classList.add("revealed");
              },
              { threshold: 0.1 },
            );
            o.observe(el);
          }
        }}
      >
        <div
          style={{ maxWidth: 700, margin: "0 auto 3rem", textAlign: "center" }}
        >
          <span
            className="ga-label"
            style={{
              color: "var(--indigo)",
              background: "rgba(61,82,160,.08)",
            }}
          >
            Two Coastlines, One State
          </span>
          <h2
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(2rem,5vw,2.9rem)",
              fontWeight: 700,
              color: "var(--navy)",
              lineHeight: 1.15,
            }}
          >
            Choose Your Goa
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#888",
              marginTop: ".6rem",
              fontFamily: "var(--font-b)",
            }}
          >
            North for the noise, South for the quiet — Goa is really two trips
            in one.
          </p>
        </div>

        <div
          className="ga-coast-grid-inner"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.75rem",
            maxWidth: 1020,
            margin: "0 auto",
          }}
        >
          {COASTS.map((coast) => (
            <div
              key={coast.key}
              className={`ga-coast ${activeCoast === coast.key ? "active" : ""}`}
              onClick={() => setActiveCoast(coast.key)}
            >
              <img src={coast.img} alt={coast.name} loading="lazy" />
              <div className="ga-coast-overlay">
                <div className="ga-coast-name">{coast.name}</div>
                <p className="ga-coast-blurb">{coast.blurb}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {coast.points.map((p, i) => (
                    <span key={i} className="ga-coast-tag">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              {activeCoast === coast.key && (
                <div className="ga-coast-check">✓</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          QUICK ACTIONS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "0 1.5rem 5rem", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(1.7rem,4vw,2.3rem)",
              fontWeight: 700,
              color: "var(--navy)",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            What Do You Need First?
          </h2>
          <div
            className="ga-rail"
            style={{ justifyContent: "center", flexWrap: "wrap" }}
          >
            {QUICK_ACTIONS.map((a, i) => (
              <Link to={a.link} key={i} style={{ textDecoration: "none" }}>
                <button
                  className="ga-qa-btn"
                  style={{
                    color: a.color,
                    background: a.bg,
                    border: `1.5px solid ${a.color}28`,
                  }}
                >
                  <span className="ga-qa-icon">{a.icon}</span>
                  <span>{a.label}</span>
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DESTINATIONS CAROUSEL
      ══════════════════════════════════════════════════════ */}
      <section
        className="ga-reveal"
        style={{ padding: "0.5rem 0 5.5rem", background: "var(--cream)" }}
        ref={(el) => {
          if (el) {
            const o = new IntersectionObserver(
              ([e]) => {
                if (e.isIntersecting) el.classList.add("revealed");
              },
              { threshold: 0.1 },
            );
            o.observe(el);
          }
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "1.75rem",
            }}
          >
            <div>
              <span
                className="ga-label"
                style={{
                  color: "var(--saffron)",
                  background: "rgba(255,107,53,.09)",
                }}
              >
                Set the Itinerary
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "clamp(1.9rem,4.5vw,2.7rem)",
                  fontWeight: 700,
                  color: "var(--navy)",
                  lineHeight: 1.1,
                }}
              >
                Six Places to Begin
              </h2>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                className="ga-scroll-btn"
                onClick={() => scrollCarousel(-1)}
              >
                ‹
              </button>
              <button
                className="ga-scroll-btn"
                onClick={() => scrollCarousel(1)}
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="ga-carousel"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}
        >
          {DESTINATIONS.map((d, i) => (
            <div key={i} className="ga-dest-card">
              <img src={d.img} alt={d.name} loading="lazy" />
              <div className="ga-dest-overlay">
                <div className="ga-dest-tag">{d.tag}</div>
                <div className="ga-dest-name">{d.name}</div>
                <div className="ga-dest-desc">{d.desc}</div>
                <div className="ga-dest-price">✈️ From {d.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CATEGORY EXPLORE + CARDS
      ══════════════════════════════════════════════════════ */}
      <section
        className="ga-reveal"
        style={{ padding: "5rem 1.5rem", background: "white" }}
        ref={(el) => {
          if (el) {
            const o = new IntersectionObserver(
              ([e]) => {
                if (e.isIntersecting) el.classList.add("revealed");
              },
              { threshold: 0.08 },
            );
            o.observe(el);
          }
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span
            className="ga-label"
            style={{
              color: "var(--indigo)",
              background: "rgba(61,82,160,.08)",
            }}
          >
            Explore by Mood
          </span>
          <h2
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(2rem,5vw,3.1rem)",
              fontWeight: 700,
              color: "var(--navy)",
            }}
          >
            Goa, India
          </h2>
        </div>

        {/* Category pill tabs */}
        <div
          style={{
            maxWidth: 1050,
            margin: "0 auto 2rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="ga-tab-wrap" style={{ justifyContent: "center" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`ga-tab ${selected === cat.key ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat.key)}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter search */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          <div className="ga-filter-bar">
            <input
              type="text"
              placeholder="Filter places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span>🔍</span>
          </div>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: "1.5rem",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ borderRadius: 20, overflow: "hidden" }}>
                <div className="skeleton" style={{ height: 200 }} />
                <div style={{ padding: "1rem" }}>
                  <div
                    className="skeleton"
                    style={{ height: 20, marginBottom: 8, width: "70%" }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: 14, width: "50%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCards.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "4rem 0", color: "#999" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏝️</div>
            <p style={{ fontFamily: "var(--font-b)", fontSize: "1rem" }}>
              No places found. Try a different keyword.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: "1.75rem",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {filteredCards.map((card, i) => (
              <div key={i} className="ga-cat-card">
                <div style={{ position: "relative" }}>
                  {card.images && <ImageCarousel images={[card.images]} />}
                  <span className="ga-cat-tag">
                    {CATEGORIES.find((c) => c.key === selected)?.icon}{" "}
                    {CATEGORIES.find((c) => c.key === selected)?.label}
                  </span>
                </div>
                <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                  <h3 className="ga-cat-title">
                    <Link
                      to={card.link}
                      style={{ color: "inherit", textDecoration: "none" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--teal)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--navy)")
                      }
                    >
                      {card.title}
                    </Link>
                  </h3>
                  {card.subtitle && (
                    <p className="ga-cat-sub">{card.subtitle}</p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "1rem",
                    }}
                  >
                    <Link to={card.link} className="ga-cat-link">
                      Explore →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Outlet />
      </section>

      {/* ══════════════════════════════════════════════════════
          EXPERIENCES
      ══════════════════════════════════════════════════════ */}
      <section
        className="ga-reveal"
        style={{ padding: "5.5rem 1.5rem", background: "var(--navy)" }}
        ref={(el) => {
          if (el) {
            const o = new IntersectionObserver(
              ([e]) => {
                if (e.isIntersecting) el.classList.add("revealed");
              },
              { threshold: 0.08 },
            );
            o.observe(el);
          }
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span
            className="ga-label"
            style={{
              color: "var(--gold-light)",
              background: "rgba(201,168,76,.15)",
            }}
          >
            Only in Goa
          </span>
          <h2
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(2rem,5vw,3.1rem)",
              fontWeight: 700,
              color: "white",
            }}
          >
            How Goa Spends a Day
          </h2>
        </div>

        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          {EXPERIENCES.map((exp, i) => (
            <React.Fragment key={i}>
              <div className="ga-exp-row">
                <div
                  className="ga-exp-icon"
                  style={{ background: `${exp.color}22` }}
                >
                  {exp.icon}
                </div>
                <div>
                  <div className="ga-exp-title">{exp.title}</div>
                  <p className="ga-exp-desc">{exp.desc}</p>
                </div>
                <div className="ga-exp-bar" style={{ background: exp.color }} />
              </div>
              {i < EXPERIENCES.length - 1 && <hr className="ga-exp-divider" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRAVEL TIPS ACCORDION
      ══════════════════════════════════════════════════════ */}
      <section
        className="ga-reveal"
        style={{ padding: "5.5rem 1.5rem", background: "var(--cream)" }}
        ref={(el) => {
          if (el) {
            const o = new IntersectionObserver(
              ([e]) => {
                if (e.isIntersecting) el.classList.add("revealed");
              },
              { threshold: 0.1 },
            );
            o.observe(el);
          }
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            className="ga-label"
            style={{
              color: "var(--indigo)",
              background: "rgba(61,82,160,.08)",
            }}
          >
            Before You Pack
          </span>
          <h2
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(2rem,5vw,3.1rem)",
              fontWeight: 700,
              color: "var(--navy)",
            }}
          >
            Travel Tips for Goa
          </h2>
        </div>

        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            background: "white",
            borderRadius: 24,
            border: "1px solid #eef0ff",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,.06)",
          }}
        >
          {TRAVEL_TIPS.map((tip, i) => (
            <div key={i}>
              <div
                className="ga-tip-row"
                onClick={() => setOpenTip(openTip === i ? -1 : i)}
              >
                <div className="ga-tip-icon">{tip.icon}</div>
                <div className="ga-tip-title">{tip.title}</div>
                <span className={`ga-tip-chev ${openTip === i ? "open" : ""}`}>
                  ⌄
                </span>
              </div>
              {openTip === i && (
                <div className="ga-tip-body">
                  <p>{tip.tip}</p>
                </div>
              )}
              {i < TRAVEL_TIPS.length - 1 && <hr className="ga-tip-sep" />}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════ */}
      <section
        className="ga-cta"
        style={{ padding: "6.5rem 1.5rem", textAlign: "center" }}
      >
        <h2
          style={{
            fontFamily: "var(--font-d)",
            fontSize: "clamp(2.1rem,5.5vw,3.4rem)",
            fontWeight: 700,
            color: "white",
            marginBottom: "1rem",
          }}
        >
          Ready for Some Susegad?
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,.72)",
            marginBottom: "2.5rem",
            maxWidth: 540,
            margin: "0 auto 2.5rem",
            fontFamily: "var(--font-b)",
            lineHeight: 1.75,
          }}
        >
          From church bells in Old Goa to shack tables in the sand — let's plan
          a coastline that suits your pace.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/contact" className="ga-cta-btn-gold">
            Plan My Goa Trip 🌴
          </Link>
          <a href="tel:+917888251550" className="ga-cta-btn-ghost">
            📞 Call Us Now
          </a>
        </div>
      </section>
    </>
  );
}

export default Goa;
