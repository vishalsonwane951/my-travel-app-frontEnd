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
const VIBES = [
  { key: "all", label: "All Properties", icon: "🏡" },
  { key: "lively", label: "Lively & Social", icon: "🎉" },
  { key: "peaceful", label: "Peaceful & Quiet", icon: "🌿" },
  { key: "rustic", label: "Rustic & Offbeat", icon: "🪵" },
];

const PROPERTIES = [
  {
    img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
    name: "Blue Lagoon Heritage Villa",
    vibe: "peaceful",
    location: "Assagao, North Goa",
    price: "₹9,800",
    guests: 8,
    beds: 4,
    host: "Fernanda & Miguel",
    hostNote:
      "Fifth-generation Goan family. Miguel tends the mango orchard; Fernanda makes the best prawn cafreal you'll ever eat.",
    amenities: [
      "🏊 Private Pool",
      "🌳 Mango Orchard",
      "🍳 Full Kitchen",
      "📶 WiFi",
      "🛵 2 Scooters Included",
    ],
    desc: "A century-old laterite-stone villa with carved wooden doors, deep verandas, and a pool that's been catching afternoon light for three generations.",
  },
  {
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    name: "The Coconut Collective",
    vibe: "lively",
    location: "Anjuna, North Goa",
    price: "₹5,200",
    guests: 10,
    beds: 5,
    host: "Ravi & Pooja",
    hostNote:
      "Ravi runs a rooftop yoga class at 7 AM and curates the music playlist by night. Pooja handles the BBQ — arrive hungry.",
    amenities: [
      "🏊 Shared Pool",
      "🎵 Rooftop Terrace",
      "🧘 Daily Yoga",
      "🍳 Chef on Request",
      "🌊 5 min to Beach",
    ],
    desc: "A compound of five interconnected garden rooms, designed for groups who don't want to stop the party when the shacks close.",
  },
  {
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    name: "Palolem Cliffhouse",
    vibe: "peaceful",
    location: "Palolem, South Goa",
    price: "₹11,200",
    guests: 6,
    beds: 3,
    host: "Sanjay",
    hostNote:
      "Sanjay is a marine biologist who restored this cliff property himself. He'll take you to a secret snorkel spot if you ask nicely.",
    amenities: [
      "🌊 Cliff Sea View",
      "🤿 Snorkel Gear",
      "☕ Coffee Nook",
      "📶 WiFi",
      "🌅 Private Sunrise Deck",
    ],
    desc: "Three bedrooms perched above Palolem's crescent, with a west-facing deck where you can watch the sun go down without leaving your chair.",
  },
  {
    img: "https://images.unsplash.com/photo-1501117716987-c8c394bb29df?w=800&q=80",
    name: "Riverwatch Bungalow",
    vibe: "rustic",
    location: "Siolim, North Goa",
    price: "₹4,100",
    guests: 4,
    beds: 2,
    host: "Maria Figueiredo",
    hostNote:
      "Maria is a retired schoolteacher who has lived here her whole life. She leaves fresh bread and homemade bebinca on the kitchen table every morning.",
    amenities: [
      "🛶 Canoe on Creek",
      "🌿 Herb Garden",
      "🍞 Daily Breakfast Basket",
      "📵 No-WiFi Retreat",
      "🎣 Fishing Rods",
    ],
    desc: "A tin-roofed Portuguese bungalow at the bend of a sleepy creek, where the loudest sound is egrets landing at dusk.",
  },
  {
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    name: "Jungle Treehouse Stay",
    vibe: "rustic",
    location: "Netravali, South Goa",
    price: "₹3,200",
    guests: 3,
    beds: 1,
    host: "Dattaram",
    hostNote:
      "Dattaram grew up in these forests and has never lived anywhere else. His village tour — two hours on foot — is the best thing in South Goa.",
    amenities: [
      "🌳 Tree Platform Deck",
      "🦜 Birdwatching",
      "🏕️ Bonfire Nights",
      "🛁 Outdoor Shower",
      "🥗 Farm Meals",
    ],
    desc: "A single elevated cabin inside a cardamom plantation, bamboo-floored and hand-built, thirty minutes from the nearest shack — and better for it.",
  },
  {
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    name: "Calangute Garden Suite",
    vibe: "lively",
    location: "Calangute, North Goa",
    price: "₹6,500",
    guests: 6,
    beds: 3,
    host: "The D'Souza Family",
    hostNote:
      "The D'Souzas have hosted since 1998. Their eldest son doubles as a licensed tour guide who knows every hidden shack on the strip.",
    amenities: [
      "🏊 Plunge Pool",
      "🛵 Bike Rentals",
      "🏖️ 10 min Walk to Beach",
      "🍳 Breakfast Included",
      "📶 WiFi",
    ],
    desc: "A bright, high-ceilinged garden property a short scooter ride from the action, with a family who treat guests like returning friends.",
  },
];

const VIBE_COLORS = {
  lively: {
    color: "#FF6B35",
    bg: "rgba(255,107,53,0.1)",
    border: "rgba(255,107,53,0.25)",
  },
  peaceful: {
    color: "#7BAE7F",
    bg: "rgba(123,174,127,0.1)",
    border: "rgba(123,174,127,0.25)",
  },
  rustic: {
    color: "#C9A84C",
    bg: "rgba(201,168,76,0.1)",
    border: "rgba(201,168,76,0.25)",
  },
};

// ── Image Carousel ─────────────────────────────────────────────────────────────
function ImageCarousel({ images }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), 4200);
    return () => clearInterval(t);
  }, [images.length]);
  return (
    <div className="relative w-full" style={{ paddingTop: "62%" }}>
      <img
        src={images[index]}
        alt={`slide-${index}`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />
    </div>
  );
}

// ── Host Card ──────────────────────────────────────────────────────────────────
function HostNote({ name, note }) {
  return (
    <div
      className="flex gap-3 items-start p-3 rounded-2xl"
      style={{
        background: "rgba(201,168,76,0.07)",
        border: "1px solid rgba(201,168,76,0.18)",
        marginBottom: "0.9rem",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "var(--gold)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
          flexShrink: 0,
        }}
      >
        🏠
      </div>
      <div>
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "var(--gold)",
            fontFamily: "var(--font-body)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 2,
          }}
        >
          Host · {name}
        </p>
        <p
          style={{
            fontSize: "0.78rem",
            color: "#666",
            fontFamily: "var(--font-body)",
            lineHeight: 1.55,
          }}
        >
          {note}
        </p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function GoaVillasHomestays() {
  const [vibe, setVibe] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [moreProps, setMoreProps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [propCount, propRef] = useCountUp(75, 1800);
  const [hostCount, hostRef] = useCountUp(68, 1600);
  const [vibeCount, vibeRef] = useCountUp(3, 800);
  const [guestCount, guestRef] = useCountUp(6, 1000);

  const fetchMore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/goa-villas/getall");
      setMoreProps(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Villa fetch error:", err);
      setMoreProps([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMore();
  }, [fetchMore]);

  const filteredProps = PROPERTIES.filter((p) => {
    const matchesVibe = vibe === "all" || p.vibe === vibe;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q);
    return matchesVibe && matchesSearch;
  });

  const filteredMore = moreProps.filter((card) => {
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
          --indigo: #3D52A0; --saffron: #FF6B35; --saffron-light: #FFB347;
          --teal: #4ECDC4; --cream: #FDFAF4;
          --font-display: 'Cormorant Garamond', serif;
          --font-body: 'DM Sans', sans-serif;
          --ease: cubic-bezier(0.4,0,0.2,1);
        }
        * { box-sizing: border-box; }

        .gv-vibe-btn { transition: all 0.25s var(--ease); cursor: pointer; border: 2px solid #e5dfc4; }
        .gv-vibe-btn.lively-active   { background: #FF6B35; border-color: #FF6B35; color: white; box-shadow: 0 8px 24px rgba(255,107,53,0.32); }
        .gv-vibe-btn.peaceful-active { background: #7BAE7F; border-color: #7BAE7F; color: white; box-shadow: 0 8px 24px rgba(123,174,127,0.32); }
        .gv-vibe-btn.rustic-active   { background: #C9A84C; border-color: #C9A84C; color: white; box-shadow: 0 8px 24px rgba(201,168,76,0.32); }
        .gv-vibe-btn.all-active      { background: var(--navy); border-color: var(--navy); color: white; box-shadow: 0 8px 24px rgba(26,26,46,0.3); }
        .gv-vibe-btn:not(.lively-active):not(.peaceful-active):not(.rustic-active):not(.all-active):hover { border-color: var(--gold); color: var(--gold); }

        .gv-card { transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease); }
        .gv-card:hover { transform: translateY(-8px); box-shadow: 0 28px 56px rgba(0,0,0,0.13); }
        .gv-card:hover .gv-img-zoom { transform: scale(1.06); }
        .gv-img-zoom { transition: transform 0.6s var(--ease); }

        /* Split hero */
        .gv-hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 420px; }
        @media(max-width: 768px) {
          .gv-hero { grid-template-columns: 1fr; }
          .gv-hero-img { min-height: 240px; }
        }

        .skeleton { background: linear-gradient(90deg, #f0f0f8 25%, #e8e8f0 50%, #f0f0f8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        @media(max-width:640px){
          .gv-stats-row { flex-wrap: wrap !important; justify-content: center !important; }
        }
      `}</style>

      {/* ── SPLIT HERO ────────────────────────────────────────────────────────── */}
      <section className="gv-hero">
        {/* Left — image */}
        <div
          className="gv-hero-img relative overflow-hidden"
          style={{ minHeight: 420 }}
        >
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=85"
            alt="Goa villa pool"
            className="gv-img-zoom absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(26,26,46,0.4) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Right — text */}
        <div
          className="flex flex-col justify-center px-10 py-12"
          style={{ background: "var(--navy)" }}
        >
          <Link
            to="/goa"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.85rem",
              fontFamily: "var(--font-body)",
              textDecoration: "none",
              marginBottom: "1.5rem",
              display: "inline-block",
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
              marginBottom: "0.6rem",
              fontFamily: "var(--font-body)",
            }}
          >
            🏡 Villas & Homestays
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem,4.5vw,3.2rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
              marginBottom: "0.9rem",
            }}
          >
            Stay with a Family,
            <br />
            Not Just a Building
          </h1>
          <p
            style={{
              fontSize: "0.97rem",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.75,
              fontFamily: "var(--font-body)",
              maxWidth: 400,
            }}
          >
            Goa's best-kept stays are family-run villas, cliff bungalows, and
            jungle cottages where the host is half the reason you come back.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              "🏊 Private Pool",
              "🌳 Heritage Villas",
              "🌿 Eco Stays",
              "🛶 Riverside",
            ].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.8)",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  padding: "5px 14px",
                  borderRadius: 50,
                  fontFamily: "var(--font-body)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--cream)", padding: "3rem 2rem" }}>
        <div
          className="gv-stats-row flex justify-center gap-4 mx-auto"
          style={{ maxWidth: 980, flexWrap: "wrap" }}
        >
          {[
            {
              num: propCount,
              suffix: "+",
              label: "Villas & Homestays",
              ref: propRef,
              icon: "🏡",
            },
            {
              num: hostCount,
              suffix: "%",
              label: "Owner-Hosted",
              ref: hostRef,
              icon: "🤝",
            },
            {
              num: vibeCount,
              suffix: " Vibes",
              label: "Lively · Peaceful · Rustic",
              ref: vibeRef,
              icon: "🌈",
            },
            {
              num: guestCount,
              suffix: " avg",
              label: "Guests per Property",
              ref: guestRef,
              icon: "👥",
            },
          ].map((s, i) => (
            <div
              key={i}
              ref={s.ref}
              className="text-center"
              style={{
                background: "white",
                border: "1px solid #e8e4d4",
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
                  color: "var(--gold)",
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

      {/* ── VIBE TOGGLE + CARDS ───────────────────────────────────────────────── */}
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
              color: "var(--gold)",
              background: "rgba(201,168,76,0.1)",
              padding: "5px 14px",
              borderRadius: "50px",
              marginBottom: "1rem",
              fontFamily: "var(--font-body)",
            }}
          >
            Find Your Vibe
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
            What Kind of Stay Are You After?
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#777",
              fontFamily: "var(--font-body)",
            }}
          >
            Filter by the feel you want — every property here has a real host
            behind it.
          </p>
        </div>

        {/* Vibe toggle */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {VIBES.map((v) => {
            const activeClass = vibe === v.key ? `${v.key}-active` : "";
            return (
              <button
                key={v.key}
                onClick={() => setVibe(v.key)}
                className={`gv-vibe-btn flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm ${activeClass}`}
                style={{
                  fontFamily: "var(--font-body)",
                  background: vibe === v.key ? "" : "white",
                  color: vibe === v.key ? "" : "#555",
                }}
              >
                <span>{v.icon}</span>
                {v.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex justify-center mb-10">
          <div
            className="flex rounded-full overflow-hidden"
            style={{
              border: "1.5px solid #e5dfc4",
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

        {/* Property grid */}
        {filteredProps.length === 0 ? (
          <div className="text-center py-12" style={{ color: "#999" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🏡</div>
            <p style={{ fontFamily: "var(--font-body)" }}>
              No properties match — try a different vibe or keyword.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "1.75rem",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {filteredProps.map((p, i) => {
              const vc = VIBE_COLORS[p.vibe];
              return (
                <div
                  key={i}
                  className="gv-card rounded-3xl overflow-hidden relative"
                  style={{
                    background: "white",
                    border: `1px solid ${vc.border}`,
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      height: 220,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={p.img}
                      alt={p.name}
                      className="gv-img-zoom w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Vibe badge */}
                    <span
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        background: vc.bg,
                        color: vc.color,
                        border: `1px solid ${vc.border}`,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "5px 12px",
                        borderRadius: 50,
                        fontFamily: "var(--font-body)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      {VIBES.find((v) => v.key === p.vibe)?.icon}{" "}
                      {VIBES.find((v) => v.key === p.vibe)?.label}
                    </span>
                    {/* Guest capacity */}
                    <span
                      style={{
                        position: "absolute",
                        bottom: 14,
                        right: 14,
                        background: "rgba(26,26,46,0.75)",
                        color: "white",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        padding: "5px 12px",
                        borderRadius: 50,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      👤 Up to {p.guests} guests · 🛏 {p.beds} beds
                    </span>
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
                      {p.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#888",
                        marginBottom: "0.65rem",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      📍 {p.location}
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#555",
                        lineHeight: 1.6,
                        marginBottom: "0.9rem",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {p.desc}
                    </p>

                    {/* Host note */}
                    <HostNote name={p.host} note={p.hostNote} />

                    {/* Amenity tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.amenities.map((a, j) => (
                        <span
                          key={j}
                          style={{
                            fontSize: "0.72rem",
                            color: "#555",
                            background: "#f7f4ec",
                            padding: "4px 10px",
                            borderRadius: 50,
                            fontFamily: "var(--font-body)",
                            border: "1px solid #e5dfc4",
                          }}
                        >
                          {a}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.3rem",
                            fontWeight: 700,
                            color: vc.color,
                          }}
                        >
                          {p.price}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#999",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          /night
                        </span>
                      </div>
                      <button
                        style={{
                          padding: "0.55rem 1.3rem",
                          background: vc.color,
                          color: "white",
                          border: "none",
                          borderRadius: 50,
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "var(--font-body)",
                          boxShadow: `0 6px 18px ${vc.color}40`,
                        }}
                      >
                        Enquire Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
            More Properties to Browse
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
                  background: "#faf8f2",
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
            More partner properties will appear here soon.
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
                className="gv-card rounded-2xl overflow-hidden"
                style={{ background: "#faf8f2", border: "1px solid #e8e4d4" }}
              >
                {card.images && (
                  <div style={{ height: 180, overflow: "hidden" }}>
                    <img
                      src={card.images}
                      alt={card.title}
                      className="gv-img-zoom w-full h-full object-cover"
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

      {/* ── WHY CHOOSE A HOMESTAY OVER A HOTEL ───────────────────────────────── */}
      <section
        style={{ padding: "4rem 2rem 5rem", background: "var(--cream)" }}
      >
        <div className="text-center mb-10">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.7rem,4vw,2.4rem)",
              fontWeight: 700,
              color: "var(--navy)",
            }}
          >
            Why a Villa or Homestay?
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.25rem",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {[
            {
              icon: "🤝",
              title: "Real Local Knowledge",
              desc: "Your host will tell you which shack the fishermen eat at — that's not in any guidebook.",
            },
            {
              icon: "🍽️",
              title: "Home-Cooked Goan Food",
              desc: "Many hosts cook breakfast, and several offer a full Goan meal on request.",
            },
            {
              icon: "💸",
              title: "Better Value for Groups",
              desc: "A four-bedroom villa at ₹8,000/night splits to ₹2,000 per couple — often less than a mid-range hotel room.",
            },
            {
              icon: "🌿",
              title: "Quieter Settings",
              desc: "Most are in residential lanes or forested areas — away from hotel-row noise.",
            },
          ].map((w, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 20,
                padding: "1.5rem",
                border: "1px solid #e8e4d4",
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>
                {w.icon}
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  color: "var(--navy)",
                  marginBottom: "0.4rem",
                }}
              >
                {w.title}
              </h4>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#666",
                  lineHeight: 1.6,
                  fontFamily: "var(--font-body)",
                }}
              >
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section
        className="text-center"
        style={{
          padding: "5rem 2rem",
          background:
            "linear-gradient(135deg, #2d200a 0%, #1a1a2e 55%, #2d200a 100%)",
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
          Not Sure Which Property Fits?
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
          Tell us your group size, travel dates and the vibe you're chasing —
          we'll match you with the right host.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
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
              boxShadow: "0 10px 30px rgba(201,168,76,0.4)",
            }}
          >
            Find My Perfect Stay 🏡
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

export default GoaVillasHomestays;
