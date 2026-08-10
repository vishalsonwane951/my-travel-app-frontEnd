import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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
const CUISINES = [
  { key: "all", label: "All Cuisines", icon: "🍽️" },
  { key: "seafood", label: "Goan Seafood", icon: "🦐" },
  { key: "continental", label: "Continental", icon: "🥘" },
  { key: "tandoori", label: "Tandoori & North Indian", icon: "🍗" },
  { key: "cafe", label: "Cafe & Light Bites", icon: "☕" },
];

const SHACKS = [
  {
    img: "https://images.unsplash.com/photo-1757031009707-7044ba32edd6?w=800&q=80",
    name: "Souza's Sunset Table",
    cuisine: "seafood",
    location: "Calangute Beach",
    price: "₹1,200 for two",
    mustTry: "Crab xec xec, prawn balchão",
    desc: "A 1930s landmark right on the sand, still grilling the same recipes three generations on.",
  },
  {
    img: "https://images.unsplash.com/photo-1757031009648-59e006583698?w=800&q=80",
    name: "Britto's Beach Kitchen",
    cuisine: "continental",
    location: "Baga Beach",
    price: "₹1,400 for two",
    mustTry: "Seafood platter, baked crab",
    desc: "Multi-cuisine and unhurried, with a drinks list long enough to keep the table talking past sunset.",
  },
  {
    img: "https://images.unsplash.com/photo-1733411683500-50f83ca70a1b?w=800&q=80",
    name: "Curlies Bohemian Shack",
    cuisine: "cafe",
    location: "Anjuna Beach",
    price: "₹900 for two",
    mustTry: "Wood-fired pizza, sundowner cocktails",
    desc: "Cliffside tables, trance hangover energy by day, and a cult following that never really left the 90s.",
  },
  {
    img: "https://images.unsplash.com/photo-1720798348346-deb9df09c919?w=800&q=80",
    name: "St Anthony's Quiet Corner",
    cuisine: "tandoori",
    location: "Baga Beach",
    price: "₹1,300 for two",
    mustTry: "Tandoori pomfret, butter chicken",
    desc: "A calmer pocket of Baga with Monday karaoke and a kitchen that doesn't cut corners.",
  },
  {
    img: "https://images.unsplash.com/photo-1759389390415-15ac87c3370e?w=800&q=80",
    name: "Colourful Cove Cafe",
    cuisine: "cafe",
    location: "Morjim Beach",
    price: "₹700 for two",
    mustTry: "Banana pancakes, fresh lime soda",
    desc: "A string of painted huts that double as the best breakfast stop on this stretch of sand.",
  },
  {
    img: "https://images.unsplash.com/photo-1593808862427-8ae84e03704b?w=800&q=80",
    name: "Garden Shack Goan Kitchen",
    cuisine: "seafood",
    location: "Colva Beach",
    price: "₹1,000 for two",
    mustTry: "Fish curry rice, prawn chilli fry",
    desc: "Tucked just off the main strip with a green, shaded courtyard and home-style Goan cooking.",
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
    <div className="relative w-full" style={{ paddingTop: "65%" }}>
      <img
        src={images[index]}
        alt={`slide-${index}`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function GoaBeachShacks() {
  const navigate = useNavigate();
  const [cuisine, setCuisine] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [moreShacks, setMoreShacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [shackCount, shackRef] = useCountUp(120, 1800);
  const [costCount, costRef] = useCountUp(800, 2000);
  const [cuisineCount, cuisineRef] = useCountUp(4, 900);
  const [hourCount, hourRef] = useCountUp(16, 1200);

  const fetchMore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/goa-beach-shacks/getall");
      setMoreShacks(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Shack fetch error:", err);
      setMoreShacks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMore();
  }, [fetchMore]);

  const filteredShacks = SHACKS.filter((s) => {
    const matchesCuisine = cuisine === "all" || s.cuisine === cuisine;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q);
    return matchesCuisine && matchesSearch;
  });

  const filteredMore = moreShacks.filter((card) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      card.title?.toLowerCase().includes(q) ||
      card.location?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        :root {
          --gold: #C9A84C; --gold-light: #F0D080; --navy: #1a1a2e;
          --indigo: #3D52A0; --indigo-light: #7091E6; --saffron: #FF6B35;
          --saffron-light: #FFB347; --teal: #4ECDC4; --cream: #FDFAF4;
          --font-display: 'Cormorant Garamond', serif; --font-body: 'DM Sans', sans-serif;
          --ease: cubic-bezier(0.4,0,0.2,1);
        }
        * { box-sizing: border-box; }
        .gb-chip { transition: all 0.25s var(--ease); cursor: pointer; border: 2px solid #e9d9c4; }
        .gb-chip.active { background: var(--saffron); border-color: var(--saffron); color: white; box-shadow: 0 8px 22px rgba(255,107,53,0.32); }
        .gb-chip:not(.active):hover { border-color: var(--saffron); color: var(--saffron); }
        .gb-card { transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease); }
        .gb-card:hover { transform: translateY(-8px); box-shadow: 0 24px 50px rgba(0,0,0,0.13); }
        .gb-board { background: repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 28px); }
        .skeleton { background: linear-gradient(90deg, #f0f0f8 25%, #e8e8f0 50%, #f0f0f8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @media(max-width:640px){ .gb-stats-row { flex-wrap: wrap !important; justify-content: center !important; } }
      `}</style>

      {/* ── HERO (menu-board styled) ─────────────────────────────────────────── */}
      <section
        className="relative gb-board"
        style={{ minHeight: 400, background: "#3a2317" }}
      >
        <img
          src="https://images.unsplash.com/photo-1601993396021-9f5752357139?w=1800&q=85"
          alt="Goa beach shacks"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          style={{ opacity: 0.45 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(58,35,23,0.5) 0%, rgba(58,35,23,0.92) 100%)",
          }}
        />
        <div
          className="relative z-10 px-6 md:px-16"
          style={{ paddingTop: "3.5rem", paddingBottom: "3rem", maxWidth: 720 }}
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
              color: "var(--saffron-light)",
              marginTop: "1.5rem",
              marginBottom: "0.6rem",
              fontFamily: "var(--font-body)",
            }}
          >
            🍤 Beach Shacks
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
            Today's Catch, Served Barefoot
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.7,
              fontFamily: "var(--font-body)",
            }}
          >
            Plastic chairs, sand underfoot, and seafood that came off a boat
            this morning — Goa's shacks at their best.
          </p>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--cream)", padding: "3rem 2rem" }}>
        <div
          className="gb-stats-row flex justify-center gap-4 mx-auto"
          style={{ maxWidth: 950, flexWrap: "wrap" }}
        >
          {[
            {
              num: shackCount,
              suffix: "+",
              label: "Shacks on Our Radar",
              ref: shackRef,
              icon: "🍤",
            },
            {
              num: costCount,
              suffix: "",
              label: "Avg. Meal for Two (₹)",
              ref: costRef,
              icon: "💵",
            },
            {
              num: cuisineCount,
              suffix: "",
              label: "Cuisine Styles",
              ref: cuisineRef,
              icon: "🍽️",
            },
            {
              num: hourCount,
              suffix: "hrs",
              label: "Some Open Almost Round the Clock",
              ref: hourRef,
              icon: "⏰",
            },
          ].map((s, i) => (
            <div
              key={i}
              ref={s.ref}
              className="text-center"
              style={{
                background: "white",
                border: "1px solid #f0e4d4",
                borderRadius: 18,
                padding: "1.3rem 1.5rem",
                minWidth: 150,
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
                  color: "var(--saffron)",
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
                  maxWidth: 140,
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

      {/* ── CUISINE FILTER + SHACKS ───────────────────────────────────────────── */}
      <section
        style={{ padding: "1rem 2rem 5rem", background: "var(--cream)" }}
      >
        <div
          className="text-center mb-8"
          style={{ maxWidth: 700, margin: "0 auto 2.5rem" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem,4vw,2.5rem)",
              fontWeight: 700,
              color: "var(--navy)",
              marginBottom: "0.6rem",
            }}
          >
            What's on the Menu?
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#777",
              fontFamily: "var(--font-body)",
            }}
          >
            Filter by cuisine to find your kind of beach table.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {CUISINES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCuisine(c.key)}
              className={`gb-chip flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm ${cuisine === c.key ? "active" : ""}`}
              style={{
                fontFamily: "var(--font-body)",
                background: cuisine === c.key ? "" : "white",
                color: cuisine === c.key ? "" : "#555",
              }}
            >
              <span>{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center mb-10">
          <div
            className="flex rounded-full overflow-hidden"
            style={{
              border: "1.5px solid #f0e4d4",
              width: 340,
              background: "white",
            }}
          >
            <input
              type="text"
              placeholder="Search by name or beach..."
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

        {filteredShacks.length === 0 ? (
          <div className="text-center py-12" style={{ color: "#999" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🍤</div>
            <p style={{ fontFamily: "var(--font-body)" }}>
              No shacks match that search — try a different cuisine or keyword.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.75rem",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {filteredShacks.map((s, i) => (
              <div
                key={i}
                className="gb-card rounded-2xl overflow-hidden relative"
                style={{
                  background: "white",
                  border: "1px solid rgba(230,200,160,0.3)",
                }}
              >
                <ImageCarousel images={[s.img]} />
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    background: "rgba(58,35,23,0.78)",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: 50,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {CUISINES.find((c) => c.key === s.cuisine)?.icon}{" "}
                  {CUISINES.find((c) => c.key === s.cuisine)?.label}
                </span>
                <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--navy)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {s.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#888",
                      marginBottom: "0.5rem",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    📍 {s.location}
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      lineHeight: 1.55,
                      marginBottom: "0.6rem",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {s.desc}
                  </p>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--saffron)",
                      fontWeight: 600,
                      marginBottom: "0.9rem",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    🍴 Must try: {s.mustTry}
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.85rem",
                        color: "#666",
                        fontWeight: 600,
                      }}
                    >
                      {s.price}
                    </span>
                    <button
                      style={{
                        padding: "0.5rem 1.2rem",
                        background: "var(--saffron)",
                        color: "white",
                        border: "none",
                        borderRadius: 50,
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      See Full Menu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── MORE FROM OUR PARTNERS (API-driven) ──────────────────────────────── */}
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
            More Shacks to Browse
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
                  background: "#fdf8f0",
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
        ) : filteredMore.length === 0 ? (
          <p
            className="text-center"
            style={{ color: "#999", fontFamily: "var(--font-body)" }}
          >
            More partner shacks will appear here soon.
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
            {filteredMore.map((card, i) => (
              <div
                key={i}
                className="gb-card rounded-2xl overflow-hidden"
                style={{ background: "#fdf8f0", border: "1px solid #f0e4d4" }}
              >
                {card.images && <ImageCarousel images={[card.images]} />}
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

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section
        className="text-center"
        style={{
          padding: "5rem 2rem",
          background:
            "linear-gradient(135deg, #3a2317 0%, #1a1a2e 55%, #3a2317 100%)",
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
          Hungry Already?
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
          }}
        >
          Tell us your beach and we'll point you to the shack locals actually
          eat at.
        </p>
        <Link
          to="/contact"
          style={{
            padding: "1rem 2.5rem",
            background: "var(--saffron)",
            color: "white",
            borderRadius: 50,
            fontSize: "1rem",
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Get Shack Recommendations
        </Link>
      </section>
    </>
  );
}

export default GoaBeachShacks;
