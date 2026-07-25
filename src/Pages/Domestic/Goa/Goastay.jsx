import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

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
const TIERS = [
  { key: "all", label: "All Stays" },
  { key: "budget", label: "Budget", range: "₹1,500–3,500/night" },
  { key: "midrange", label: "Mid-range", range: "₹3,500–8,000/night" },
  { key: "luxury", label: "Luxury", range: "₹8,000+/night" },
];

const STAYS = [
  {
    img: "https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=800&q=80",
    name: "Sandbank Beachfront Cottages",
    tier: "midrange",
    location: "Candolim, North Goa",
    price: "₹4,800",
    rating: 4.4,
    amenities: ["🏖️ Beachfront", "📶 WiFi", "🍳 Breakfast"],
    desc: "Thatched cottages a few steps from the shore, with hammocks strung between the palms.",
  },
  {
    img: "https://images.unsplash.com/photo-1605581813258-076a6654a37f?w=800&q=80",
    name: "Mandovi Infinity Resort",
    tier: "luxury",
    location: "Panjim, North Goa",
    price: "₹14,500",
    rating: 4.7,
    amenities: ["🏊 Infinity Pool", "🧖 Spa", "🍽️ Fine Dining"],
    desc: "A riverside infinity pool that seems to spill straight into the Mandovi at sunset.",
  },
  {
    img: "https://images.unsplash.com/photo-1598598795006-ea2174659eaa?w=800&q=80",
    name: "Green Court Garden Resort",
    tier: "midrange",
    location: "Anjuna, North Goa",
    price: "₹5,200",
    rating: 4.3,
    amenities: ["🌳 Garden Pool", "🚲 Bike Rentals", "📶 WiFi"],
    desc: "Set back from the noise, with a leafy pool courtyard and easy scooter access to the flea market.",
  },
  {
    img: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    name: "Riverside Boutique Stay",
    tier: "midrange",
    location: "Siolim, North Goa",
    price: "₹3,900",
    rating: 4.2,
    amenities: ["🛶 Kayak Access", "🍳 Breakfast", "📶 WiFi"],
    desc: "A handful of rooms on a quiet creek, with a wooden deck made for slow mornings.",
  },
  {
    img: "https://images.unsplash.com/photo-1581859814481-bfd944e3122f?w=800&q=80",
    name: "Agonda Palm Huts",
    tier: "budget",
    location: "Agonda, South Goa",
    price: "₹1,800",
    rating: 4.1,
    amenities: ["🏖️ Beachfront", "🌅 Sunset View", "🍽️ Shack Restaurant"],
    desc: "Simple palm-leaf huts on one of South Goa's quietest beaches, run by a local family.",
  },
  {
    img: "https://images.unsplash.com/photo-1617859047452-8510bcf207fd?w=800&q=80",
    name: "Varca Poolside Luxury Resort",
    tier: "luxury",
    location: "Varca, South Goa",
    price: "₹16,900",
    rating: 4.8,
    amenities: ["🏊 Pool", "🏖️ Private Beach", "🧖 Spa"],
    desc: "Forty-five acres of manicured grounds between a private beach and a wraparound pool.",
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

function StarRating({ value }) {
  return (
    <span
      style={{
        color: "var(--gold)",
        fontSize: "0.85rem",
        fontWeight: 700,
        fontFamily: "var(--font-body)",
      }}
    >
      ★ {value.toFixed(1)}
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function GoaStay() {
  const navigate = useNavigate();
  const [tier, setTier] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [moreStays, setMoreStays] = useState([]);
  const [loading, setLoading] = useState(true);

  const [propCount, propRef] = useCountUp(180, 1800);
  const [tierCount, tierRef] = useCountUp(3, 900);
  const [beachPctCount, beachPctRef] = useCountUp(70, 1600);
  const [ratingCount, ratingRef] = useCountUp(43, 1400);

  const fetchMore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/goa-stay/getall");
      setMoreStays(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Stay fetch error:", err);
      setMoreStays([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMore();
  }, [fetchMore]);

  const filteredStays = STAYS.filter((s) => {
    const matchesTier = tier === "all" || s.tier === tier;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q);
    return matchesTier && matchesSearch;
  });

  const filteredMore = moreStays.filter((card) => {
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
        .gs-tier-btn { transition: all 0.25s var(--ease); cursor: pointer; border: 2px solid #e3e0d4; }
        .gs-tier-btn.active { background: var(--indigo); border-color: var(--indigo); color: white; box-shadow: 0 8px 22px rgba(61,82,160,0.3); }
        .gs-tier-btn:not(.active):hover { border-color: var(--indigo); color: var(--indigo); }
        .gs-card { transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease); }
        .gs-card:hover { transform: translateY(-8px); box-shadow: 0 24px 50px rgba(0,0,0,0.13); }
        .skeleton { background: linear-gradient(90deg, #f0f0f8 25%, #e8e8f0 50%, #f0f0f8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @media(max-width:640px){ .gs-stats-row { flex-wrap: wrap !important; justify-content: center !important; } }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section
        className="relative"
        style={{ minHeight: 380, background: "var(--navy)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1800&q=85"
          alt="Goa stays"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,30,40,0.55) 0%, rgba(13,30,40,0.92) 100%)",
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
              color: "var(--gold-light)",
              marginTop: "1.5rem",
              marginBottom: "0.6rem",
              fontFamily: "var(--font-body)",
            }}
          >
            🏨 Stay
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
            From Palm Huts to Riverside Pools
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.7,
              fontFamily: "var(--font-body)",
            }}
          >
            Wherever you land on the budget spectrum, Goa has a place to put
            your bags down.
          </p>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--cream)", padding: "3rem 2rem" }}>
        <div
          className="gs-stats-row flex justify-center gap-4 mx-auto"
          style={{ maxWidth: 950, flexWrap: "wrap" }}
        >
          {[
            {
              num: propCount,
              suffix: "+",
              label: "Stays Listed",
              ref: propRef,
              icon: "🏨",
            },
            {
              num: tierCount,
              suffix: "",
              label: "Price Tiers",
              ref: tierRef,
              icon: "💰",
            },
            {
              num: beachPctCount,
              suffix: "%",
              label: "Within Walking Distance of a Beach",
              ref: beachPctRef,
              icon: "🏖️",
            },
            {
              num: (ratingCount / 10).toFixed(1),
              suffix: "★",
              label: "Average Guest Rating",
              ref: ratingRef,
              icon: "⭐",
            },
          ].map((s, i) => (
            <div
              key={i}
              ref={s.ref}
              className="text-center"
              style={{
                background: "white",
                border: "1px solid #eef0ff",
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
                  color: "var(--indigo)",
                  lineHeight: 1,
                }}
              >
                {s.num}
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

      {/* ── TIER TOGGLE + CURATED STAYS ──────────────────────────────────────── */}
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
            Pick Your Price Tier
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#777",
              fontFamily: "var(--font-body)",
            }}
          >
            Filter by what fits your trip — every tier here has been picked for
            character, not just price.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {TIERS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTier(t.key)}
              className={`gs-tier-btn rounded-full px-5 py-2.5 font-semibold text-sm ${tier === t.key ? "active" : ""}`}
              style={{
                fontFamily: "var(--font-body)",
                background: tier === t.key ? "" : "white",
                color: tier === t.key ? "" : "#555",
              }}
            >
              {t.label}
              {t.range ? (
                <span style={{ opacity: 0.75, fontWeight: 500 }}>
                  {" "}
                  · {t.range}
                </span>
              ) : (
                ""
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-center mb-10">
          <div
            className="flex rounded-full overflow-hidden"
            style={{
              border: "1.5px solid #e0e3f0",
              width: 340,
              background: "white",
            }}
          >
            <input
              type="text"
              placeholder="Search by name or location..."
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

        {filteredStays.length === 0 ? (
          <div className="text-center py-12" style={{ color: "#999" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🏨</div>
            <p style={{ fontFamily: "var(--font-body)" }}>
              No stays match that search — try a different tier or keyword.
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
            {filteredStays.map((s, i) => (
              <div
                key={i}
                className="gs-card rounded-2xl overflow-hidden relative"
                style={{
                  background: "white",
                  border: "1px solid rgba(200,200,230,0.25)",
                }}
              >
                <ImageCarousel images={[s.img]} />
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    background: "rgba(13,30,40,0.75)",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: 50,
                    fontFamily: "var(--font-body)",
                    textTransform: "capitalize",
                  }}
                >
                  {s.tier === "midrange" ? "Mid-range" : s.tier}
                </span>
                <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                  <div className="flex justify-between items-start mb-1">
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "var(--navy)",
                        flex: 1,
                      }}
                    >
                      {s.name}
                    </h3>
                    <StarRating value={s.rating} />
                  </div>
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
                      marginBottom: "0.8rem",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {s.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {s.amenities.map((a, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--indigo)",
                          background: "rgba(61,82,160,0.08)",
                          padding: "3px 9px",
                          borderRadius: 50,
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "var(--indigo)",
                      }}
                    >
                      {s.price}
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#999",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        /night
                      </span>
                    </span>
                    <button
                      style={{
                        padding: "0.5rem 1.2rem",
                        background: "var(--gold)",
                        color: "var(--navy)",
                        border: "none",
                        borderRadius: 50,
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      View Rooms
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
            More Stays to Browse
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
                  background: "#fafbff",
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
            {filteredMore.map((card, i) => (
              <div
                key={i}
                className="gs-card rounded-2xl overflow-hidden"
                style={{ background: "#fafbff", border: "1px solid #eef0ff" }}
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
            "linear-gradient(135deg, #0d3b3e 0%, #1a1a2e 55%, #0d3b3e 100%)",
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
          Not Sure Which Stay Fits?
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
          Tell us your dates and budget, and we'll shortlist three stays worth
          booking.
        </p>
        <Link
          to="/contact"
          style={{
            padding: "1rem 2.5rem",
            background: "var(--gold)",
            color: "var(--navy)",
            borderRadius: 50,
            fontSize: "1rem",
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Get Stay Recommendations
        </Link>
      </section>
    </>
  );
}

export default GoaStay;
