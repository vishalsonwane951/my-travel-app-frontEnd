import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api.js";

// ── Hooks ──────────────────────────────────────────────────────────────────────
const useCountUp = (target, duration = 1800) => {
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
const LEVELS = [
  { key: "all", label: "All Activities", icon: "🌊" },
  { key: "beginner", label: "Beginner", icon: "🟢" },
  { key: "intermediate", label: "Intermediate", icon: "🟡" },
  { key: "thrillseeker", label: "Thrill Seeker", icon: "🔴" },
];

const ACTIVITIES = [
  {
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    name: "Parasailing",
    level: "beginner",
    location: "Baga & Calangute",
    price: "₹800",
    duration: "10–15 min",
    icon: "🪂",
    color: "#3D52A0",
    desc: "Strap in, let the speedboat gun it, and trade the beach crowd for a bird's-eye view of the entire North Goa coastline.",
    whatToKnow: [
      "No experience needed",
      "Weight limit: 120 kg",
      "Best: 9 AM–5 PM",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=800&q=80",
    name: "Jet Skiing",
    level: "beginner",
    location: "Baga, Candolim, Palolem",
    price: "₹700",
    duration: "15 min",
    icon: "🚤",
    color: "#4ECDC4",
    desc: "Pilot your own jet ski or ride pillion — either way you're getting wet. Most operators offer timed runs with no licence required.",
    whatToKnow: ["Age 16+", "Lifejacket provided", "Solo or tandem"],
  },
  {
    img: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80",
    name: "Scuba Diving",
    level: "intermediate",
    location: "Grande Island, Pigeon Island",
    price: "₹3,500",
    duration: "3–4 hrs incl. boat",
    icon: "🤿",
    color: "#1a1a2e",
    desc: "Dive through Portuguese shipwrecks and coral gardens at Grande Island, just 20 minutes off the coast by speedboat.",
    whatToKnow: [
      "PADI-certified instructors",
      "No prior experience for intro dives",
      "Depth: 12–18 m",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80",
    name: "Surfing",
    level: "intermediate",
    location: "Arambol, Ashwem",
    price: "₹1,200",
    duration: "2 hrs with lesson",
    icon: "🏄",
    color: "#FF6B35",
    desc: "North Goa's Arambol hosts India's most active surf scene, with schools that take beginners from white-water to standing in one session.",
    whatToKnow: [
      "Oct–Mar best swells",
      "Board rental included",
      "Classes for all levels",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1567617329688-c0016b14b7d9?w=800&q=80",
    name: "Kayaking & Stand-Up Paddleboarding",
    level: "beginner",
    location: "Cavelossim, Talpona",
    price: "₹500",
    duration: "1 hr",
    icon: "🛶",
    color: "#7BAE7F",
    desc: "Glide through the backwaters and estuaries at South Goa's calmer creeks — ideal for wildlife spotting and sunrise sessions.",
    whatToKnow: [
      "Family friendly",
      "Calm water routes available",
      "Guided backwater tours",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    name: "Deep-Sea Fishing",
    level: "thrillseeker",
    location: "Panjim, Donapaula",
    price: "₹2,500",
    duration: "4–6 hrs",
    icon: "🎣",
    color: "#C9A84C",
    desc: "Head 10–15 km offshore on a chartered boat for barracuda, kingfish and tuna. The boat brings rods, bait and a very strong flask of chai.",
    whatToKnow: [
      "Chartered boats (4–8 pax)",
      "Catch can be cooked at local shack",
      "Early morning departures",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1612838320302-4b3b3996765f?w=800&q=80",
    name: "White-Water River Tubing",
    level: "thrillseeker",
    location: "Mhadei River, Ponda",
    price: "₹1,800",
    duration: "2 hrs",
    icon: "🏞️",
    color: "#A37BFF",
    desc: "Strap into an inflatable ring and drift through the jungle-lined Mhadei rapids — surprisingly fierce when the monsoon swells arrive.",
    whatToKnow: [
      "Monsoon season only (Jun–Sep)",
      "Helmets & vests included",
      "Age 12+",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1564410267841-915d8e4d71ea?w=800&q=80",
    name: "Snorkelling",
    level: "beginner",
    location: "Grande Island, Bat Island",
    price: "₹1,200",
    duration: "2–3 hrs incl. boat",
    icon: "🐠",
    color: "#4ECDC4",
    desc: "Float above the coral gardens at Bat Island or explore the shallow reefs near Grande Island — no tanks, no training, just a mask and fins.",
    whatToKnow: [
      "Gear & guide included",
      "Non-swimmer-friendly options",
      "Glass-bottom boat alternative",
    ],
  },
];

const LEVEL_LABELS = {
  beginner: {
    label: "Beginner Friendly",
    color: "#22a86a",
    bg: "rgba(34,168,106,0.12)",
  },
  intermediate: {
    label: "Intermediate",
    color: "#e0a020",
    bg: "rgba(224,160,32,0.12)",
  },
  thrillseeker: {
    label: "Thrill Seeker",
    color: "#e03040",
    bg: "rgba(224,48,64,0.12)",
  },
};

// ── Main Component ─────────────────────────────────────────────────────────────
function GoaWaterSports() {
  const [level, setLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [moreActivities, setMoreActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [actCount, actRef] = useCountUp(8, 1000);
  const [opCount, opRef] = useCountUp(60, 1800);
  const [priceCount, priceRef] = useCountUp(500, 1600);
  const [monthCount, monthRef] = useCountUp(9, 1200);

  const fetchMore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/goa-water-sports/getall");
      setMoreActivities(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Water sports fetch error:", err);
      setMoreActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMore();
  }, [fetchMore]);

  const filteredActivities = ACTIVITIES.filter((a) => {
    const matchesLevel = level === "all" || a.level === level;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q);
    return matchesLevel && matchesSearch;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        :root {
          --gold: #C9A84C; --gold-light: #F0D080; --navy: #1a1a2e;
          --indigo: #3D52A0; --saffron: #FF6B35; --saffron-light: #FFB347;
          --teal: #4ECDC4; --cream: #FDFAF4;
          --font-display: 'Cormorant Garamond', serif;
          --font-body: 'DM Sans', sans-serif;
          --ease: cubic-bezier(0.4,0,0.2,1);
        }
        * { box-sizing: border-box; }

        /* Level buttons */
        .gw-level { transition: all 0.25s var(--ease); cursor: pointer; border: 2px solid #d8ecf0; }
        .gw-level.active { background: var(--teal); border-color: var(--teal); color: white; box-shadow: 0 8px 24px rgba(78,205,196,0.35); }
        .gw-level:not(.active):hover { border-color: var(--teal); color: var(--teal); }

        /* Activity card */
        .gw-act-card { transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease); }
        .gw-act-card:hover { transform: translateY(-8px); box-shadow: 0 28px 56px rgba(0,0,0,0.14); }
        .gw-act-card:hover .gw-img-zoom { transform: scale(1.07); }
        .gw-img-zoom { transition: transform 0.6s var(--ease); }

        /* Wave hero background */
        .gw-hero-water {
          background: linear-gradient(180deg, #0c2340 0%, #0e4f6b 40%, #1b7a8a 70%, #4ECDC4 100%);
        }

        .skeleton { background: linear-gradient(90deg, #f0f0f8 25%, #e8e8f0 50%, #f0f0f8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* Animated wave divider */
        .gw-wave-svg { display: block; }

        @media(max-width:640px){
          .gw-stats-row { flex-wrap: wrap !important; justify-content: center !important; }
          .gw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section
        className="relative gw-hero-water overflow-hidden"
        style={{ minHeight: 440 }}
      >
        <img
          src="https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=1800&q=85"
          alt="Water sports Goa"
          className="absolute inset-0 w-full h-full object-cover gw-img-zoom"
          loading="lazy"
          style={{ opacity: 0.35 }}
        />
        {/* Animated ripple circles */}
        <div
          className="absolute inset-0 flex items-center justify-end pr-16 pointer-events-none"
          style={{ opacity: 0.12 }}
        >
          {[220, 340, 460, 580].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-white"
              style={{
                width: size,
                height: size,
                animation: `ripple 4s ${i * 0.9}s ease-out infinite`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes ripple {
            0% { transform: scale(0.7); opacity: 0.6; }
            100% { transform: scale(1.2); opacity: 0; }
          }
        `}</style>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,35,64,0.4) 0%, rgba(12,35,64,0.85) 100%)",
          }}
        />
        <div
          className="relative z-10 px-6 md:px-16"
          style={{
            paddingTop: "3.5rem",
            paddingBottom: "3.5rem",
            maxWidth: 740,
          }}
        >
          <Link
            to="/goa"
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.85rem",
              fontFamily: "var(--font-body)",
              textDecoration: "none",
            }}
          >
            ← Back to Goa overview
          </Link>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--teal)",
              marginTop: "1.5rem",
              marginBottom: "0.6rem",
              fontFamily: "var(--font-body)",
            }}
          >
            🌊 Water Sports
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem,5.5vw,3.6rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.08,
              marginBottom: "0.75rem",
            }}
          >
            The Arabian Sea Is Waiting
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.75,
              fontFamily: "var(--font-body)",
              maxWidth: 520,
            }}
          >
            Parasail over Baga, dive Portuguese wrecks off Grande Island, or
            surf Arambol's monsoon swell — Goa's sea earns its reputation.
          </p>
        </div>

        {/* Wave bottom */}
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          className="gw-wave-svg absolute bottom-0 left-0 w-full"
          style={{ height: 70 }}
        >
          <path
            d="M0,45 C300,90 600,0 900,50 C1100,85 1300,20 1440,45 L1440,90 L0,90 Z"
            fill="var(--cream)"
          />
        </svg>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────────── */}
      <section
        style={{ background: "var(--cream)", padding: "3rem 2rem 3.5rem" }}
      >
        <div
          className="gw-stats-row flex justify-center gap-4 mx-auto"
          style={{ maxWidth: 980, flexWrap: "wrap" }}
        >
          {[
            {
              num: actCount,
              suffix: "+",
              label: "Activities Available",
              ref: actRef,
              icon: "🤿",
            },
            {
              num: opCount,
              suffix: "+",
              label: "Licensed Operators",
              ref: opRef,
              icon: "✅",
            },
            {
              num: priceCount,
              suffix: "",
              label: "Starts From (₹)",
              ref: priceRef,
              icon: "💸",
            },
            {
              num: monthCount,
              suffix: " months",
              label: "Season (Oct – Jun)",
              ref: monthRef,
              icon: "📅",
            },
          ].map((s, i) => (
            <div
              key={i}
              ref={s.ref}
              className="text-center"
              style={{
                background: "white",
                border: "1px solid #d8f0f0",
                borderRadius: 18,
                padding: "1.3rem 1.5rem",
                minWidth: 155,
              }}
            >
              <div style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>
                {s.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "var(--teal)",
                  lineHeight: 1,
                }}
              >
                {s.num.toLocaleString()}
                {s.suffix}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#666",
                  marginTop: "0.35rem",
                  fontFamily: "var(--font-body)",
                  maxWidth: 130,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEVEL FILTER + ACTIVITY CARDS ────────────────────────────────────── */}
      <section
        style={{ padding: "1rem 2rem 5rem", background: "var(--cream)" }}
      >
        <div
          className="text-center mb-8"
          style={{ maxWidth: 700, margin: "0 auto 2.5rem" }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--teal)",
              background: "rgba(78,205,196,0.1)",
              padding: "5px 14px",
              borderRadius: "50px",
              marginBottom: "1rem",
              fontFamily: "var(--font-body)",
            }}
          >
            Pick Your Adrenaline Level
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem,4vw,2.5rem)",
              fontWeight: 700,
              color: "var(--navy)",
              marginBottom: "0.6rem",
            }}
          >
            What's Your Move?
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#777",
              fontFamily: "var(--font-body)",
            }}
          >
            From first-timer floats to offshore deep-sea charters — filter by
            how brave you're feeling.
          </p>
        </div>

        {/* Level filter pills */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {LEVELS.map((l) => (
            <button
              key={l.key}
              onClick={() => setLevel(l.key)}
              className={`gw-level flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm ${level === l.key ? "active" : ""}`}
              style={{
                fontFamily: "var(--font-body)",
                background: level === l.key ? "" : "white",
                color: level === l.key ? "" : "#555",
              }}
            >
              <span>{l.icon}</span>
              {l.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="flex justify-center mb-10">
          <div
            className="flex rounded-full overflow-hidden"
            style={{
              border: "1.5px solid #d8f0f0",
              width: 340,
              background: "white",
            }}
          >
            <input
              type="text"
              placeholder="Search activities or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "0.7rem 1.25rem",
                border: "none",
                outline: "none",
                fontSize: "0.9rem",
                fontFamily: "var(--font-body)",
              }}
            />
            <span
              style={{
                padding: "0 1rem",
                display: "flex",
                alignItems: "center",
                color: "#999",
              }}
            >
              🔍
            </span>
          </div>
        </div>

        {/* Activity grid */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12" style={{ color: "#999" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🌊</div>
            <p style={{ fontFamily: "var(--font-body)" }}>
              No activities match — try a different level or keyword.
            </p>
          </div>
        ) : (
          <div
            className="gw-grid mx-auto"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.75rem",
              maxWidth: 1200,
            }}
          >
            {filteredActivities.map((a, i) => (
              <div
                key={i}
                className="gw-act-card rounded-3xl overflow-hidden relative"
                style={{
                  background: "white",
                  border: "1px solid rgba(78,205,196,0.15)",
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image */}
                <div
                  style={{
                    height: 210,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={a.img}
                    alt={a.name}
                    className="gw-img-zoom w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Level badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      background: LEVEL_LABELS[a.level].bg,
                      color: LEVEL_LABELS[a.level].color,
                      border: `1px solid ${LEVEL_LABELS[a.level].color}40`,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "5px 12px",
                      borderRadius: 50,
                      fontFamily: "var(--font-body)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    {LEVELS.find((l) => l.key === a.level)?.icon}{" "}
                    {LEVEL_LABELS[a.level].label}
                  </span>
                  {/* Activity icon pill */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 14,
                      right: 14,
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: a.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                      boxShadow: `0 6px 20px ${a.color}50`,
                    }}
                  >
                    {a.icon}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "var(--navy)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {a.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#888",
                      marginBottom: "0.6rem",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    📍 {a.location} · ⏱ {a.duration}
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#555",
                      lineHeight: 1.6,
                      marginBottom: "1rem",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {a.desc}
                  </p>

                  {/* What to know chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {a.whatToKnow.map((w, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--teal)",
                          background: "rgba(78,205,196,0.1)",
                          padding: "4px 10px",
                          borderRadius: 50,
                          fontFamily: "var(--font-body)",
                          fontWeight: 600,
                        }}
                      >
                        {w}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        color: a.color,
                      }}
                    >
                      {a.price}{" "}
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#999",
                          fontFamily: "var(--font-body)",
                          fontWeight: 400,
                        }}
                      >
                        / person
                      </span>
                    </span>
                    <button
                      style={{
                        padding: "0.5rem 1.3rem",
                        background: a.color,
                        color: "white",
                        border: "none",
                        borderRadius: 50,
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        boxShadow: `0 6px 18px ${a.color}40`,
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── MORE FROM API ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 2rem 5rem", background: "white" }}>
        <div className="text-center mb-10">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.7rem,4vw,2.3rem)",
              fontWeight: 700,
              color: "var(--navy)",
            }}
          >
            More Activities to Explore
          </h2>
        </div>
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#f0fbfd",
                }}
              >
                <div className="skeleton" style={{ height: 180 }} />
                <div style={{ padding: "1rem" }}>
                  <div
                    className="skeleton"
                    style={{ height: 18, width: "70%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : moreActivities.length === 0 ? (
          <p
            className="text-center"
            style={{ color: "#999", fontFamily: "var(--font-body)" }}
          >
            More partner listings will appear here soon.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {moreActivities.map((card, i) => (
              <div
                key={i}
                className="gw-act-card rounded-2xl overflow-hidden"
                style={{ background: "#f0fbfd", border: "1px solid #d8f0f0" }}
              >
                {card.images && (
                  <div style={{ height: 180, overflow: "hidden" }}>
                    <img
                      src={card.images}
                      alt={card.title}
                      className="gw-img-zoom w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div style={{ padding: "1.1rem 1.3rem" }}>
                  <Link
                    to={card.link}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--navy)",
                      textDecoration: "none",
                    }}
                  >
                    {card.title}
                  </Link>
                  {card.subtitle && (
                    <p
                      style={{
                        fontSize: "0.82rem",
                        color: "#888",
                        fontFamily: "var(--font-body)",
                        marginTop: 4,
                      }}
                    >
                      {card.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── SAFETY NOTE ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "3rem 2rem", background: "var(--cream)" }}>
        <div
          className="mx-auto rounded-3xl p-8"
          style={{
            maxWidth: 820,
            background: "white",
            border: "1px solid #d8f0f0",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--navy)",
              marginBottom: "0.6rem",
            }}
          >
            🛡️ Safety First
          </h3>
          <p
            style={{
              fontSize: "0.92rem",
              color: "#555",
              lineHeight: 1.75,
              fontFamily: "var(--font-body)",
            }}
          >
            All operators listed here hold valid licences from the Goa
            government's Department of Tourism. Always check that your
            instructor speaks enough English to explain safety signals, wear the
            provided life jacket regardless of swim confidence, and avoid water
            sports between 6 PM and 7 AM. Monsoon water sports (tubing, surfing)
            carry higher risk — ask your operator for the day's sea state report
            before committing.
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section
        className="text-center"
        style={{
          padding: "5rem 2rem",
          background:
            "linear-gradient(135deg, #0c2340 0%, #0e4f6b 55%, #0c2340 100%)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem,4.5vw,2.8rem)",
            fontWeight: 700,
            color: "white",
            marginBottom: "1rem",
          }}
        >
          Ready to Hit the Water?
        </h2>
        <p
          style={{
            fontSize: "1rem",
            color: "rgba(255,255,255,0.75)",
            marginBottom: "2rem",
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
            fontFamily: "var(--font-body)",
            lineHeight: 1.7,
          }}
        >
          We'll bundle your activities with transport and a beachside shack
          booking — one less thing to arrange.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/contact"
            style={{
              padding: "1rem 2.5rem",
              background: "var(--teal)",
              color: "var(--navy)",
              borderRadius: 50,
              fontSize: "1rem",
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              textDecoration: "none",
              display: "inline-block",
              boxShadow: "0 10px 30px rgba(78,205,196,0.4)",
            }}
          >
            Plan My Water Sports Day 🌊
          </Link>
          <a
            href="tel:+917888251550"
            style={{
              padding: "1rem 2.5rem",
              background: "transparent",
              color: "white",
              border: "1.5px solid rgba(255,255,255,0.35)",
              borderRadius: 50,
              fontSize: "1rem",
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            📞 Call Us Now
          </a>
        </div>
      </section>
    </>
  );
}

export default GoaWaterSports;
