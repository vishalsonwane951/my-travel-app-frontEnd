// Pages/ItineraryPage.jsx
// Route: /package/:type/:location

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaStar,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaPhone,
  FaWhatsapp,
  FaShieldAlt,
  FaShare,
  FaHeart,
  FaRegHeart,
  FaBolt,
  FaBalanceScale,
  FaUser,
  FaEnvelope,
  FaMobileAlt,
  FaPrint,
  FaLock,
  FaCity,
  FaStickyNote,
  FaCalendarAlt,
  FaExpand,
  FaChevronLeft,
  FaChevronRight,
  FaBed,
  FaUtensils,
  FaThumbsUp,
  FaEllipsisH,
  FaSearch,
  FaFilter,
  FaQuestionCircle,
  FaPencilAlt,
  FaCamera,
  FaRegStar,
} from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";
import TripPlannerModal from "../Pages/AITrip Planner/TripPlannerModal.jsx";
import api from "../utils/api.js";
import LocationMap from "../Components/Locationmap.jsx";
import ReviewsAndQA from "../Components/ReviewPage.jsx";
import ContributeSection from "../Components/Contributesection.jsx";
import ReviewProvider from "../Context/Reviewcontext.jsx";
import LoginRegister from "./LoginRegister.jsx";
import Header from "../Components/Header.jsx";

// Bootstrap CDN injector
(function injectBootstrap() {
  if (document.getElementById("bs5-css")) return;
  const link = document.createElement("link");
  link.id = "bs5-css";
  link.rel = "stylesheet";
  link.href =
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
  link.integrity =
    "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH";
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
  if (document.getElementById("bs5-js")) return;
  const script = document.createElement("script");
  script.id = "bs5-js";
  script.src =
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
  script.integrity =
    "sha384-YvpcrYf0tY3lHB60NNkmXc4s9bIOgUxi8T/jzmAb45HFn/6f5m9VFvkF6C1B0e7";
  script.crossOrigin = "anonymous";
  document.body.appendChild(script);
})();

const BRAND = {
  primary: "#F04B5A",
  primaryDark: "#D03848",
  navy: "#1A2340",
  navyBorder: "rgba(255,255,255,0.10)",
  success: "#10B981",
  amber: "#F97316",
  charcoal: "#111827",
  bodyText: "#374151",
  meta: "#6B7280",
  placeholder: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  bgLight: "#F5F6F8",
  bgCard: "#fafbff",
  teal: "#14B8A6",
};

const getCloudinaryUrl = (url, width = 900) => {
  if (!url || !url.startsWith("http")) return url;
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
};

export function extractLatLng(url) {
  if (!url) return null;
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch)
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  const llMatch = url.match(/[?&](?:ll|center)=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch)
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  return null;
}

const prettyLocationName = (loc = "") =>
  loc.replace(/([a-z])([A-Z])/g, "$1 $2");
const slugifyLocation = (loc = "") =>
  prettyLocationName(loc).trim().toLowerCase().replace(/\s+/g, "-");

const WMO_CODES = {
  0: { e: "☀️", l: "Clear sky" },
  1: { e: "🌤️", l: "Mostly clear" },
  2: { e: "⛅", l: "Partly cloudy" },
  3: { e: "☁️", l: "Overcast" },
  45: { e: "🌫️", l: "Foggy" },
  48: { e: "🌫️", l: "Icy fog" },
  51: { e: "🌦️", l: "Drizzle" },
  61: { e: "🌧️", l: "Light rain" },
  63: { e: "🌧️", l: "Moderate rain" },
  65: { e: "🌧️", l: "Heavy rain" },
  71: { e: "🌨️", l: "Light snow" },
  73: { e: "🌨️", l: "Snow" },
  75: { e: "❄️", l: "Heavy snow" },
  80: { e: "🌦️", l: "Rain showers" },
  95: { e: "⛈️", l: "Thunderstorm" },
  99: { e: "⛈️", l: "Thunderstorm" },
};
const wmoInfo = (code) => WMO_CODES[code] ?? { e: "🌡️", l: "Variable" };

const BEST_TIMES = {
  manali: "Mar – Jun, Sep – Oct",
  goa: "Nov – Feb",
  kerala: "Sep – Mar",
  rajasthan: "Oct – Mar",
  andaman: "Oct – May",
  shimla: "Mar – Jun, Sep – Nov",
  leh: "Jun – Sep",
  jaipur: "Oct – Mar",
  ooty: "Apr – Jun, Sep – Nov",
  coorg: "Oct – May",
  munnar: "Sep – May",
  varanasi: "Oct – Mar",
  agra: "Oct – Mar",
  delhi: "Oct – Mar",
  mumbai: "Nov – Feb",
};
const getBestTime = (loc) =>
  BEST_TIMES[(loc || "").toLowerCase()] ?? "Oct – Mar";

function useDestinationWeather(lat, lng, locationName) {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    if (!lat || !lng) return;
    let cancelled = false;
    const load = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,uv_index,wind_speed_10m&timezone=auto&forecast_days=1`;
        const res = await fetch(url);
        const json = await res.json();
        const c = json.current;
        if (!cancelled)
          setWeather({
            temp: c.temperature_2m,
            humidity: c.relative_humidity_2m,
            uv: c.uv_index ?? "-",
            wind: c.wind_speed_10m,
            icon: wmoInfo(c.weather_code).e,
            desc: wmoInfo(c.weather_code).l,
            best: getBestTime(locationName),
          });
      } catch {
        /* non-fatal */
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [lat, lng, locationName]);
  return weather;
}

function parseDurationString(str = "") {
  const ndMatch = str.match(/(\d+)\s*[Nn]\s*[/\s]\s*(\d+)\s*[Dd]/);
  const dnMatch = str.match(/(\d+)\s*[Dd]\s*[/\s]\s*(\d+)\s*[Nn]/);
  const dMatch = str.match(/^(\d+)\s*[Dd]/);
  const nMatch = str.match(/^(\d+)\s*[Nn]/);
  let nights = null,
    days = null;
  if (ndMatch) {
    nights = parseInt(ndMatch[1]);
    days = parseInt(ndMatch[2]);
  } else if (dnMatch) {
    days = parseInt(dnMatch[1]);
    nights = parseInt(dnMatch[2]);
  } else if (dMatch) {
    days = parseInt(dMatch[1]);
    nights = days - 1;
  } else if (nMatch) {
    nights = parseInt(nMatch[1]);
    days = nights + 1;
  }
  return { nights, days };
}

function cleanItineraryTitle(title) {
  if (typeof title !== "string") return title;
  return title.replace(/[\s'",]+$/, "");
}

function normalisePackage(raw) {
  if (!raw) return null;
  let gallery = [];
  if (Array.isArray(raw.gallery) && raw.gallery.length) gallery = raw.gallery;
  else if (typeof raw.images === "string" && raw.images)
    gallery = [{ img: raw.images, caption: "" }];
  else if (Array.isArray(raw.images) && raw.images.length)
    gallery = raw.images.map((img) => ({ img, caption: "" }));

  let durations = [];
  if (Array.isArray(raw.durations) && raw.durations.length) {
    const first = raw.durations[0];
    if (typeof first === "string") {
      durations = raw.durations.map((d) => {
        const { nights, days } = parseDurationString(d);
        return {
          label: d,
          nights,
          days,
          price: raw.price || 0,
          discountedPrice: raw.strikePrice ? raw.price : null,
          originalPrice: raw.strikePrice || null,
        };
      });
    } else if (typeof first === "object") {
      durations = raw.durations.map((d) => ({
        label: d.label || d.duration || "",
        nights: d.nights ?? null,
        days: d.days ?? null,
        price: d.price || raw.price || 0,
        discountedPrice: d.discountedPrice || null,
        originalPrice: d.originalPrice || null,
      }));
    }
  } else {
    const rawLabel =
      (typeof raw.durations === "string" && raw.durations) ||
      raw.duration ||
      "";
    const { nights, days } = parseDurationString(rawLabel);
    durations = [
      {
        label: rawLabel || (days ? `${days} Day${days > 1 ? "s" : ""}` : ""),
        nights,
        days,
        price: raw.price || 0,
        discountedPrice: raw.strikePrice ? raw.price : null,
        originalPrice: raw.strikePrice || null,
      },
    ];
  }

  let groupSize = [];
  if (Array.isArray(raw.groupSize)) groupSize = raw.groupSize;
  else if (typeof raw.groupSize === "string" && raw.groupSize)
    groupSize = [raw.groupSize];

  const inclusions = raw.inclusions || raw.inclExcl?.inclusions || [];
  const exclusions = raw.exclusions || raw.inclExcl?.exclusions || [];
  const itinerary = (raw.itinerary || []).map((day) => ({
    ...day,
    title: cleanItineraryTitle(day.title),
    meals: Array.isArray(day.meals)
      ? day.meals
      : typeof day.meals === "string" && day.meals
        ? day.meals
            .split(/[,;]/)
            .map((m) => m.trim())
            .filter(Boolean)
        : [],
    activities: Array.isArray(day.activities)
      ? day.activities
      : typeof day.activities === "string" && day.activities
        ? day.activities
            .split(/[,;]/)
            .map((a) => a.trim())
            .filter(Boolean)
        : [],
  }));

  return {
    ...raw,
    gallery,
    durations,
    groupSize,
    inclusions,
    exclusions,
    itinerary,
  };
}

function resolveCoords(pkg) {
  if (!pkg) return null;
  if (pkg.latitude != null && pkg.longitude != null)
    return { lat: pkg.latitude, lng: pkg.longitude };
  if (pkg.lat && pkg.long) return { lat: pkg.lat, lng: pkg.long };
  return extractLatLng(pkg.locationurl);
}

const buildFallbackDays = (locationTitle, numDays = 1) =>
  Array.from({ length: numDays }, (_, i) => ({
    day: i + 1,
    title:
      i === 0
        ? `Arrival in ${locationTitle}`
        : i === numDays - 1
          ? `Departure from ${locationTitle}`
          : `Explore ${locationTitle} — Day ${i + 1}`,
    description:
      i === 0
        ? `Welcome to ${locationTitle}! Transfer from airport/station to hotel. Check in, freshen up, and enjoy a welcome dinner.`
        : i === numDays - 1
          ? `Enjoy breakfast at the hotel. Check out and transfer to airport/station for your return journey.`
          : `Full day of guided sightseeing, local cuisine, and cultural experiences across the best of ${locationTitle}.`,
    activities:
      i === 0
        ? [
            "Airport / station pickup",
            "Hotel check-in",
            "Orientation walk",
            "Welcome dinner",
          ]
        : i === numDays - 1
          ? ["Breakfast at hotel", "Check-out", "Transfer to departure point"]
          : [
              "Sightseeing tour",
              "Local street food",
              "Cultural experience",
              "Leisure time",
            ],
    meals:
      i === 0
        ? ["Dinner"]
        : i === numDays - 1
          ? ["Breakfast"]
          : ["Breakfast", "Lunch", "Dinner"],
    accommodation: i < numDays - 1 ? "Hotel (as per selected plan)" : null,
  }));

function useLivePrice(base) {
  const [price, setPrice] = useState(base || 0);
  const [trend, setTrend] = useState("stable");
  useEffect(() => {
    if (!base) return;
    setPrice(base);
    const id = setInterval(() => {
      setPrice((p) => {
        const delta = (Math.random() - 0.48) * base * 0.03;
        const next = Math.round(
          Math.max(base * 0.88, Math.min(base * 1.18, p + delta)),
        );
        setTrend(next > p ? "rising" : next < p ? "falling" : "stable");
        return next;
      });
    }, 15000);
    return () => clearInterval(id);
  }, [base]);
  return { price, trend };
}

const Skel = ({ h = 16, w = "100%", r = 8, mb = 8 }) => (
  <div
    style={{
      height: h,
      width: w,
      borderRadius: r,
      marginBottom: mb,
      background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
      backgroundSize: "400px 100%",
      animation: "itp-shimmer 1.4s infinite",
    }}
  />
);

function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s cubic-bezier(.4,0,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  const navBtnStyle = (side) => ({
    position: "absolute",
    [side]: 20,
    top: "50%",
    transform: "translateY(-50%)",
    width: 50,
    height: 50,
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.13)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    zIndex: 10,
    transition: "all .2s",
  });
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,0.93)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "itp-modal-in .22s ease both",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          width: 42,
          height: 42,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.13)",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 17,
          zIndex: 10,
        }}
      >
        ✕
      </button>
      <div
        style={{
          position: "absolute",
          top: 22,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.72)",
          fontSize: ".82rem",
          fontWeight: 600,
          background: "rgba(255,255,255,0.1)",
          padding: "4px 18px",
          borderRadius: 50,
        }}
      >
        {current + 1} / {images.length}
      </div>
      {images.length > 1 && (
        <button
          onClick={prev}
          style={navBtnStyle("left")}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.24)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.13)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <FaChevronLeft />
        </button>
      )}
      <img
        key={current}
        src={getCloudinaryUrl(images[current], 1400)}
        alt={`Gallery ${current + 1}`}
        style={{
          maxWidth: "86vw",
          maxHeight: "80vh",
          objectFit: "contain",
          borderRadius: 14,
          boxShadow: "0 32px 80px rgba(0,0,0,.55)",
          animation: "itp-modal-in .28s ease both",
        }}
      />
      {images.length > 1 && (
        <button
          onClick={next}
          style={navBtnStyle("right")}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.24)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.13)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <FaChevronRight />
        </button>
      )}
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 7,
            padding: "10px 14px",
            background: "rgba(0,0,0,0.5)",
            borderRadius: 50,
            maxWidth: "90vw",
            overflowX: "auto",
          }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={getCloudinaryUrl(img, 160)}
              alt=""
              onClick={() => setCurrent(i)}
              style={{
                width: 50,
                height: 36,
                objectFit: "cover",
                borderRadius: 7,
                cursor: "pointer",
                opacity: i === current ? 1 : 0.42,
                border:
                  i === current ? "2px solid #fff" : "2px solid transparent",
                transition: "all .2s",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StarRating({ rating = 0, size = 14, color = BRAND.amber }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          size={size}
          color={i <= Math.round(rating) ? color : "#E5E7EB"}
        />
      ))}
    </div>
  );
}

function RatingBar({ label, count, total, color = BRAND.success }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
      }}
    >
      <span
        style={{
          fontSize: ".78rem",
          color: BRAND.bodyText,
          width: 70,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 8,
          borderRadius: 50,
          background: BRAND.borderLight,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 50,
            transition: "width .6s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: ".75rem",
          color: BRAND.meta,
          width: 28,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {count}
      </span>
    </div>
  );
}

const SAMPLE_REVIEWS = [
  {
    id: 1,
    name: "Priya S.",
    location: "Mumbai, India",
    avatar: null,
    rating: 5,
    title: "Absolutely unforgettable experience!",
    text: "The trip was meticulously planned. Every hotel, every transfer, every meal — perfectly organized. Our guide was knowledgeable and friendly. Will definitely book again!",
    date: "June 2026",
    tripType: "Family",
    helpful: 12,
  },
  {
    id: 2,
    name: "Rahul M.",
    location: "Bangalore, India",
    avatar: null,
    rating: 5,
    title: "Best value for money",
    text: "Compared to other packages, this one gave us so much more for the price. The itinerary was packed yet relaxed. Highly recommend for couples!",
    date: "May 2026",
    tripType: "Couple",
    helpful: 8,
  },
  {
    id: 3,
    name: "Anika T.",
    location: "Delhi, India",
    avatar: null,
    rating: 4,
    title: "Great trip with minor hiccups",
    text: "Overall a wonderful experience. The hotels were lovely and the food was amazing. There were a couple of small delays in transfers but the team handled them well.",
    date: "April 2026",
    tripType: "Friends",
    helpful: 5,
  },
  {
    id: 4,
    name: "Suresh K.",
    location: "Pune, India",
    avatar: null,
    rating: 5,
    title: "Highly professional team",
    text: "From booking to the last day, everything was smooth. The team is very responsive and accommodating. The destinations chosen were breathtaking.",
    date: "March 2026",
    tripType: "Family",
    helpful: 14,
  },
  {
    id: 5,
    name: "Neha R.",
    location: "Hyderabad, India",
    avatar: null,
    rating: 4,
    title: "Loved every moment",
    text: "A truly special trip. The activities were fun and engaging. The accommodation was comfortable and well-located. Would love to do another tour!",
    date: "March 2026",
    tripType: "Solo",
    helpful: 3,
  },
  {
    id: 6,
    name: "Vikram B.",
    location: "Chennai, India",
    avatar: null,
    rating: 5,
    title: "Seamless and wonderful",
    text: "I was initially skeptical about package tours but this completely changed my mind. Everything was taken care of so I could just enjoy the trip without any stress.",
    date: "February 2026",
    tripType: "Couple",
    helpful: 9,
  },
  {
    id: 7,
    name: "Kavya L.",
    location: "Kolkata, India",
    avatar: null,
    rating: 3,
    title: "Good but could be better",
    text: "The trip was enjoyable but some of the sightseeing timings felt rushed. The hotels were excellent though and the food arrangements were great.",
    date: "January 2026",
    tripType: "Family",
    helpful: 2,
  },
  {
    id: 8,
    name: "Arjun P.",
    location: "Ahmedabad, India",
    avatar: null,
    rating: 5,
    title: "Exceeded all expectations",
    text: "I've done many tours but this one stands apart. The attention to detail is remarkable. Our customised itinerary had everything we wanted and more.",
    date: "December 2025",
    tripType: "Business",
    helpful: 7,
  },
];

const SAMPLE_QA = [
  {
    id: 1,
    author: "Rohit K.",
    contributions: 12,
    question:
      "Is the tour suitable for senior citizens? What are the physical requirements?",
    date: "May 2026",
    answer:
      "Yes, this tour is senior-friendly. Most activities are leisurely with comfortable transport. Please inform us of any mobility needs and we'll customise accordingly.",
  },
  {
    id: 2,
    author: "Meena S.",
    contributions: 5,
    question:
      "Can we extend the tour by a day or two and visit nearby attractions?",
    date: "April 2026",
    answer: null,
  },
  {
    id: 3,
    author: "Deepak J.",
    contributions: 28,
    question:
      "Are vegetarian and Jain food options available throughout the trip?",
    date: "March 2026",
    answer:
      "Absolutely! We accommodate all dietary requirements including vegetarian, Jain, and vegan. Please mention your preference at the time of booking.",
  },
  {
    id: 4,
    author: "Sunita R.",
    contributions: 3,
    question:
      "What is the cancellation policy if we need to cancel last minute?",
    date: "February 2026",
    answer: null,
  },
];

const REVIEWS_PER_PAGE = 3;
const QA_PER_PAGE = 3;

// ─────────────────────────────────────────────────────────────────────────────
export default function ItineraryPage() {
  const { type, location } = useParams();

  console.log(type, location);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const locationTitle = location
    ? location
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "";
  const typeTitle = type
    ? type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Tour Package";

  const [showAuth, setShowAuth] = useState(false);
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDurationIdx, setSelectedDurationIdx] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [isFav, setIsFav] = useState(false);
  const [countdown, setCountdown] = useState({ h: 4, m: 17, s: 33 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareAllPkgs, setCompareAllPkgs] = useState([]);
  const [compareSelected, setCompareSelected] = useState([]);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareScope, setCompareScope] = useState("city");
  const [compareDurIdx, setCompareDurIdx] = useState(0);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryDone, setEnquiryDone] = useState(false);
  const [enquiryError, setEnquiryError] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null); // { discount, code, message } | null
  const [couponChecking, setCouponChecking] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    destination: locationTitle,
    city: "",
    travelDate: "",
    adults: 2,
    travelers: 2,
    notes: "",
  });
  const [travelers, setTravelers] = useState(2);
  const [travelDate, setTravelDate] = useState("");

  // ── Section refs ──
  const bookingRef = useRef(null);
  const overviewRef = useRef(null); // kept for Overview click-scroll, NOT tracked by scroll spy
  const highlightsRef = useRef(null);
  const itineraryRef = useRef(null);
  const inclusionsRef = useRef(null);
  const reviewsRef = useRef(null);
  const contributeRef = useRef(null);
  const galleryRef = useRef(null); // NEW — Gallery section
  const morePlacesRef = useRef(null); // NEW — More Places section
  const contributeCompRef = useRef(null);

  const [activeNavSection, setActiveNavSection] = useState("overview");

  // Reviews state
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewTab, setReviewTab] = useState("reviews");
  const [helpfulClicked, setHelpfulClicked] = useState({});
  const [qaPage, setQaPage] = useState(1);

  // Contribute state
  const [contributeOpen, setContributeOpen] = useState(false);
  const [contributeTab, setContributeTab] = useState("review");
  const [newReview, setNewReview] = useState({
    rating: 0,
    hoverRating: 0,
    title: "",
    text: "",
    tripType: "Family",
  });
  const [newQuestion, setNewQuestion] = useState("");
  const [contributeDone, setContributeDone] = useState(false);

  const [morePlaces, setMorePlaces] = useState([]);
  const [morePlacesLoading, setMorePlacesLoading] = useState(true);

  const coords = resolveCoords(pkg);
  const weather = useDestinationWeather(
    coords?.lat,
    coords?.lng,
    locationTitle,
  );

  // Scroll to section helper
  const scrollToSection = useCallback((ref) => {
    if (!ref?.current) return;
    const yOffset = -120;
    const y =
      ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  // ── NAV ITEMS ──
  // overview: ref is null → never auto-highlighted by scroll spy; click scrolls to overviewRef
  // gallery / moreplaces: have their own refs → both scroll-tracked AND clickable
  const NAV_ITEMS = [
    {
      key: "overview",
      label: "Overview",
      ref: null,
      scrollTarget: overviewRef,
    },
    {
      key: "highlights",
      label: "Highlights",
      ref: highlightsRef,
      scrollTarget: highlightsRef,
    },
    {
      key: "itinerary",
      label: "Itinerary",
      ref: itineraryRef,
      scrollTarget: itineraryRef,
    },
    {
      key: "inclusions",
      label: "Inclusions",
      ref: inclusionsRef,
      scrollTarget: inclusionsRef,
    },
    {
      key: "gallery",
      label: "Gallery",
      ref: galleryRef,
      scrollTarget: galleryRef,
    },
    {
      key: "reviews",
      label: "Reviews",
      ref: reviewsRef,
      scrollTarget: reviewsRef,
    },
    {
      key: "moreplaces",
      label: "More Places",
      ref: morePlacesRef,
      scrollTarget: morePlacesRef,
    },
    {
      key: "contribute",
      label: "Contribute",
      ref: contributeRef,
      scrollTarget: contributeRef,
    },
  ];

  // Scroll spy — only tracks items where ref !== null (overview is excluded)
  useEffect(() => {
    const handleScroll = () => {
      const offsets = NAV_ITEMS.filter((item) => item.ref !== null).map(
        (item) => ({
          key: item.key,
          top: item.ref?.current?.getBoundingClientRect().top ?? Infinity,
        }),
      );
      const active = offsets
        .filter((o) => o.top <= 120)
        .sort((a, b) => b.top - a.top)[0];
      if (active) setActiveNavSection(active.key);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(({ h, m, s }) => {
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) return { h: 11, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");
        if (!token) return;
        const res = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnquiryForm((f) => ({
          ...f,
          fullName: res.data.fullName || res.data.name || "",
          email: res.data.email || "",
          mobile: res.data.mobile || res.data.phone || "",
          city: res.data.city || res.data.address?.city || "",
        }));
      } catch {
        /* not logged in */
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!type || !location) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(
          `/packages/${encodeURIComponent(type)}/${encodeURIComponent(location)}`,
        );
        const raw = Array.isArray(res.data) ? res.data[0] : res.data;
        setPkg(normalisePackage(raw));
      } catch {
        try {
          const res = await api.get(`/packages/${type}`);
          const list = Array.isArray(res.data) ? res.data : [];
          const match = list.find(
            (p) =>
              (p.location || "").toLowerCase().replace(/\s+/g, "-") ===
              location.toLowerCase(),
          );
          if (match) setPkg(normalisePackage(match));
          else setError("This package could not be found.");
        } catch {
          setError("Unable to load package. Please check your connection.");
        }
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    load();
  }, [type, location]);

  useEffect(() => {
    if (!type || !location) return;
    let cancelled = false;
    const loadMorePlaces = async () => {
      setMorePlacesLoading(true);
      try {
        const res = await api.get(`/packages/${type}`);
        const list = (Array.isArray(res.data) ? res.data : []).map(
          normalisePackage,
        );
        const activeSlug = location.toLowerCase();
        const seen = new Set();
        const others = [];
        for (const p of list) {
          const slug = slugifyLocation(p.location || "");
          if (!slug || slug === activeSlug) continue;
          if (seen.has(slug)) continue;
          seen.add(slug);
          others.push(p);
        }
        if (!cancelled) {
          setMorePlaces(others);
          setCompareAllPkgs((prev) => (prev.length ? prev : list));
        }
      } catch {
        if (!cancelled) setMorePlaces([]);
      } finally {
        if (!cancelled) setMorePlacesLoading(false);
      }
    };
    loadMorePlaces();
    return () => {
      cancelled = true;
    };
  }, [type, location]);

  const openCompare = useCallback(async () => {
    setCompareOpen(true);
    setCompareScope("duration");
    if (compareAllPkgs.length > 0) {
      if (pkg?._id && !compareSelected.length) setCompareSelected([pkg._id]);
      return;
    }
    setCompareLoading(true);
    try {
      const res = await api.get(`/packages/${type}`);
      const list = (Array.isArray(res.data) ? res.data : []).map(
        normalisePackage,
      );
      setCompareAllPkgs(list);
      if (pkg?._id) setCompareSelected([pkg._id]);
    } catch {
      /* ignore */
    } finally {
      setCompareLoading(false);
    }
  }, [type, compareAllPkgs.length, compareSelected.length, pkg]);

  const durationOptions = pkg?.durations || [];
  const _safeIdx = Math.min(
    selectedDurationIdx,
    Math.max(0, durationOptions.length - 1),
  );
  const selDur = durationOptions[_safeIdx] || {};
  const basePrice = selDur?.discountedPrice ?? selDur?.price ?? pkg?.price ?? 0;
  const { price: livePrice, trend } = useLivePrice(basePrice);
  const totalPrice = livePrice * travelers;

  const fullItinerary = pkg?.itinerary?.length
    ? pkg.itinerary
    : buildFallbackDays(locationTitle, selDur?.days || 1);
  const itinerary = fullItinerary.slice(
    0,
    selDur?.days || fullItinerary.length,
  );
  const inclusions = pkg?.inclusions || [];
  const exclusions = pkg?.exclusions || [];

  const groupSizeArr = pkg?.groupSize || [];
  const groupSizeDisplay =
    groupSizeArr.length > 1
      ? `${groupSizeArr[0]} – ${groupSizeArr[groupSizeArr.length - 1]} pax`
      : groupSizeArr[0] || "";

  const images = pkg?.gallery?.length
    ? pkg.gallery
        .map((item) =>
          typeof item === "string"
            ? { src: getCloudinaryUrl(item), caption: "" }
            : {
                src: getCloudinaryUrl(item.img || ""),
                caption: item.caption || "",
              },
        )
        .filter((item) => item.src)
    : [];
  const imageSrcs = images.map((img) => img.src);

  const openLightbox = useCallback((idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const openEnquiry = useCallback(() => {
    // if (!user) { navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`); return; }
    if (!user) {
      setShowAuth(true);
    }
    setEnquiryForm((f) => ({
      ...f,
      travelDate,
      adults: travelers,
      travelers,
      destination: locationTitle,
    }));
    setEnquiryDone(false);
    setEnquiryError(null);
    setCouponCode("");
    setCouponResult(null);
    api.get("/content/coupons/active")
      .then((res) => setAvailableCoupons(res.data?.coupons || []))
      .catch(() => setAvailableCoupons([]));
    if (user) {
      setEnquiryOpen(true);
    }
  }, [user, navigate, travelDate, travelers, locationTitle]);

  const checkCoupon = useCallback(async (codeToCheck) => {
    const code = (codeToCheck || couponCode).trim().toUpperCase();
    if (!code) return;
    setCouponChecking(true);
    setCouponResult(null);
    try {
      const bookingAmount = livePrice * (enquiryForm.adults || 1);
      const { data } = await api.post("/content/coupons/validate", { code, bookingAmount });
      setCouponResult({ code, discount: data.discount, message: null });
      setCouponCode(code);
    } catch (err) {
      setCouponResult({ code, discount: 0, message: err?.response?.data?.message || "Invalid coupon code." });
    } finally {
      setCouponChecking(false);
    }
  }, [couponCode, livePrice, enquiryForm.adults]);

  const handleEnquirySubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setEnquiryLoading(true);
      setEnquiryError(null);
      const payload = {
        customer: {
          userId: user?._id || user?.id,
          fullName: enquiryForm.fullName,
          email: enquiryForm.email,
          mobile: enquiryForm.mobile,
          destination: enquiryForm.destination,
          adults: enquiryForm.adults,
          city: enquiryForm.city,
        },
        package: {
          packageId: pkg?._id,
          title: pkg?.title || `${locationTitle} ${typeTitle}`,
          type,
          location,
          locationTitle,
          typeTitle,
          rating: pkg?.rating,
          reviews: pkg?.reviews,
          groupSize: pkg?.groupSize,
          groupSizeDisplay,
        },
        duration: {
          label: selDur?.label,
          nights: selDur?.nights,
          days: selDur?.days,
        },
        itinerary: itinerary.map((day) => ({
          day: day.day,
          title: day.title,
          description: day.description,
          activities: day.activities || [],
          meals: day.meals || [],
          accommodation: day.accommodation || null,
        })),
        inclusions,
        exclusions,
        pricing: {
          pricePerPerson: livePrice,
          adults: enquiryForm.adults,
          travelers: enquiryForm.adults,
          totalPrice: livePrice * enquiryForm.adults,
          currency: "INR",
          durationType: selDur?.label,
        },
        travelDate: enquiryForm.travelDate,
        notes: enquiryForm.notes,
        couponCode: couponResult && !couponResult.message ? couponResult.code : undefined,
        enquiryDate: new Date().toISOString(),
        source: "ItineraryPage",
        pageUrl: window.location.href,
      };
      try {
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");
        await api.post("/bookings/package-inquiry", payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setEnquiryDone(true);
      } catch (err) {
        setEnquiryError(
          err?.response?.data?.message ||
            "Failed to submit enquiry. Please try again or call us directly.",
        );
      } finally {
        setEnquiryLoading(false);
      }
    },
    [
      enquiryForm,
      pkg,
      type,
      location,
      locationTitle,
      typeTitle,
      selDur,
      itinerary,
      inclusions,
      exclusions,
      livePrice,
      user,
      groupSizeDisplay,
      couponResult,
    ],
  );

  const filteredReviews = reviews.filter(
    (r) =>
      reviewSearch === "" ||
      r.title.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.text.toLowerCase().includes(reviewSearch.toLowerCase()),
  );
  const totalReviewPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const pagedReviews = filteredReviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE,
  );
  const totalQaPages = Math.ceil(SAMPLE_QA.length / QA_PER_PAGE);
  const pagedQa = SAMPLE_QA.slice(
    (qaPage - 1) * QA_PER_PAGE,
    qaPage * QA_PER_PAGE,
  );

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const handleHelpful = (id) => {
    if (helpfulClicked[id]) return;
    setHelpfulClicked((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r)),
    );
  };

  const handleContributeSubmit = () => {
    if (contributeTab === "review" && newReview.rating > 0 && newReview.text) {
      const newR = {
        id: Date.now(),
        name: user?.fullName || user?.name || "Anonymous",
        location: user?.city || "India",
        avatar: null,
        rating: newReview.rating,
        title: newReview.title || "My Experience",
        text: newReview.text,
        date: new Date().toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        }),
        tripType: newReview.tripType,
        helpful: 0,
      };
      setReviews((prev) => [newR, ...prev]);
      setContributeDone(true);
    } else if (contributeTab === "qa" && newQuestion.trim()) {
      setContributeDone(true);
    } else {
      setContributeDone(true);
    }
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; background: ${BRAND.bgLight}; }
    @keyframes itp-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes itp-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes itp-modal-in { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }

    .itp-hero { position:relative; height:68vh; min-height:460px; overflow:hidden; }
    .itp-hero-img { width:100%; height:100%; object-fit:cover; transition:transform 8s ease; }
    .itp-hero:hover .itp-hero-img { transform:scale(1.05); }
    .itp-hero-grad { position:absolute; inset:0; background:linear-gradient(180deg,rgba(10,10,30,.12) 0%,rgba(10,10,30,.82) 100%); }
    .itp-hero-content { position:absolute; inset:0; display:flex; justify-content:space-between; align-items:flex-end; padding:2.5rem; animation:itp-up .7s cubic-bezier(.4,0,.2,1) both; }
    .itp-hero-left { max-width:680px; }
    .itp-hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2rem,5vw,3.4rem); font-weight:700; color:#fff; line-height:1.08; margin-bottom:.6rem; }
    .itp-thumb { width:52px; height:38px; border-radius:7px; object-fit:cover; cursor:pointer; border:2px solid transparent; opacity:.6; transition:all .2s; }
    .itp-thumb.active { border-color:#fff; opacity:1; }

    .itp-section-nav { position:sticky; top:0; z-index:150; background:#fff; border-bottom:1px solid ${BRAND.border}; box-shadow:0 2px 12px rgba(0,0,0,.06); }
    .itp-section-nav-inner { display:flex; align-items:center; gap:0; overflow-x:auto; scrollbar-width:none; max-width:1280px; margin:0 auto; padding:0 1.5rem; }
    .itp-section-nav-inner::-webkit-scrollbar { display:none; }
    .itp-snav-btn { border:none; background:transparent; font-family:'DM Sans',sans-serif; font-size:.875rem; font-weight:500; color:${BRAND.meta}; cursor:pointer; white-space:nowrap; padding:.85rem 1.1rem; border-bottom:3px solid transparent; transition:all .2s; }
    .itp-snav-btn:hover { color:${BRAND.charcoal}; }
    .itp-snav-btn.active { color:${BRAND.charcoal}; font-weight:700; border-bottom-color:${BRAND.primary}; }
    .itp-snav-contribute { margin-left:auto; background:${BRAND.primary}; color:#fff !important; border-radius:50px; padding:.45rem 1.2rem !important; font-weight:600 !important; border-bottom:none !important; font-size:.82rem !important; transition:all .2s; }
    .itp-snav-contribute:hover { background:${BRAND.primaryDark}; transform:translateY(-1px); }

    .itp-dur-pill { border:2px solid ${BRAND.border}; background:#fff; font-weight:600; font-size:.82rem; color:${BRAND.meta}; cursor:pointer; transition:all .22s; border-radius:50px; padding:.45rem 1.1rem; display:inline-flex; flex-direction:column; align-items:center; gap:2px; }
    .itp-dur-pill:hover { border-color:#c0c8f0; color:${BRAND.charcoal}; }
    .itp-dur-pill.active { background:${BRAND.primary}; border-color:${BRAND.primary}; color:#fff; }

    .itp-tab-btn { border:none; background:transparent; font-family:'DM Sans',sans-serif; font-size:.88rem; cursor:pointer; white-space:nowrap; padding:.5rem .9rem .6rem; transition:all .2s; border-bottom:3px solid transparent; color:${BRAND.meta}; font-weight:500; }
    .itp-tab-btn.active { color:${BRAND.charcoal}; font-weight:700; border-bottom-color:${BRAND.primary}; }

    .itp-new-timeline { position:relative; padding-left:0; }
    .itp-new-timeline::before { content:''; position:absolute; left:21px; top:12px; bottom:12px; width:2px; background:linear-gradient(180deg,${BRAND.amber} 0%,rgba(249,115,22,0.12) 100%); border-radius:2px; }
    .itp-day-item { display:flex; gap:0; margin-bottom:22px; align-items:flex-start; }
    .itp-day-num-col { flex-shrink:0; width:44px; display:flex; flex-direction:column; align-items:center; }
    .itp-day-circle { width:44px; height:44px; border-radius:50%; background:${BRAND.amber}; color:#fff; font-weight:700; font-size:1rem; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 18px rgba(249,115,22,0.38); flex-shrink:0; position:relative; z-index:1; border:3px solid #fff; }
    .itp-day-card-new { flex:1; margin-left:20px; background:#fff; border:1px solid ${BRAND.border}; border-radius:14px; padding:20px 22px 18px; box-shadow:0 2px 10px rgba(0,0,0,0.045); transition:box-shadow .25s, transform .25s; }
    .itp-day-card-new:hover { box-shadow:0 8px 30px rgba(240,75,90,0.09); transform:translateY(-2px); }
    .itp-day-title-new { font-weight:700; font-size:1.02rem; color:${BRAND.charcoal}; margin:0 0 8px 0; line-height:1.3; }
    .itp-day-desc { font-size:.875rem; color:${BRAND.bodyText}; line-height:1.78; margin-bottom:14px; }
    .itp-day-meta-row { display:flex; flex-wrap:wrap; gap:10px; align-items:center; padding-top:12px; border-top:1px solid ${BRAND.borderLight}; }
    .itp-day-meta-chip { display:flex; align-items:center; gap:5px; font-size:.75rem; color:${BRAND.meta}; font-weight:500; }
    .itp-activity-pill-new { display:inline-flex; align-items:center; gap:4px; background:#F0F4FF; color:#3D52A0; font-size:.72rem; font-weight:600; border-radius:50px; padding:.28rem .8rem; border:1px solid #dde4ff; }

    .itp-gallery-section { background:#fff; padding:0rem 0 2.5rem; }
    .itp-gallery-heading { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:700; color:${BRAND.charcoal}; margin-bottom:1.5rem; }
    .itp-gal-grid { display:grid; grid-template-columns:repeat(3,1fr); grid-auto-rows:220px; gap:12px; }
    @media(max-width:640px) { .itp-gal-grid { grid-template-columns:repeat(2,1fr) !important; grid-auto-rows:160px !important; } .itp-gal-grid > div:first-child { grid-column:span 2 !important; grid-row:span 1 !important; } }
    .itp-gal-item { position:relative; overflow:hidden; border-radius:14px; cursor:pointer; }
    .itp-gal-item img { width:100%; height:100%; object-fit:cover; transition:transform .45s cubic-bezier(.4,0,.2,1); display:block; }
    .itp-gal-item:hover img { transform:scale(1.07); }
    .itp-gal-ov { position:absolute; inset:0; background:rgba(10,10,30,0.40); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .3s ease; }
    .itp-gal-item:hover .itp-gal-ov { opacity:1; }
    .itp-gal-caption { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(to top, rgba(10,10,30,0.85) 0%, rgba(10,10,30,0.0) 100%); color:#fff; padding:32px 16px 14px; font-size:13px; font-weight:600; letter-spacing:0.01em; opacity:0; transform:translateY(8px); transition:opacity .3s ease, transform .35s cubic-bezier(.4,0,.2,1); pointer-events:none; }
    .itp-gal-item:hover .itp-gal-caption { opacity:1; transform:translateY(0); }

    .itp-reviews-section { background:#fff; padding:0rem 0; border-top:1px solid ${BRAND.borderLight}; }
    .itp-review-card { background:#fff; border:1px solid ${BRAND.border}; border-radius:14px; padding:1.25rem 1.5rem; margin-bottom:16px; transition:box-shadow .2s; }
    .itp-review-card:hover { box-shadow:0 6px 24px rgba(0,0,0,.07); }
    .itp-review-avatar { width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg,${BRAND.primary},${BRAND.amber}); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:1rem; flex-shrink:0; }
    .itp-helpful-btn { border:1.5px solid ${BRAND.border}; background:#fff; border-radius:50px; padding:.28rem .9rem; font-size:.75rem; color:${BRAND.meta}; cursor:pointer; display:flex; align-items:center; gap:5px; transition:all .2s; font-family:'DM Sans',sans-serif; }
    .itp-helpful-btn:hover, .itp-helpful-btn.clicked { border-color:${BRAND.primary}; color:${BRAND.primary}; background:rgba(240,75,90,.04); }
    .itp-review-search { border:1.5px solid ${BRAND.border}; border-radius:50px; padding:.55rem 1rem .55rem 2.5rem; font-family:'DM Sans',sans-serif; font-size:.85rem; width:100%; transition:border-color .2s; background:#fff; }
    .itp-review-search:focus { outline:none; border-color:${BRAND.primary}; box-shadow:0 0 0 3px rgba(240,75,90,.08); }
    .itp-review-tab { border:none; background:transparent; font-family:'DM Sans',sans-serif; font-size:.9rem; font-weight:600; cursor:pointer; padding:.65rem 0; margin-right:1.5rem; border-bottom:3px solid transparent; color:${BRAND.meta}; transition:all .2s; }
    .itp-review-tab.active { color:${BRAND.charcoal}; border-bottom-color:${BRAND.charcoal}; }
    .itp-mention-tag { border:1px solid ${BRAND.border}; border-radius:50px; padding:.3rem .85rem; font-size:.77rem; color:${BRAND.bodyText}; background:#fff; cursor:pointer; transition:all .2s; }
    .itp-mention-tag:hover { border-color:${BRAND.primary}; color:${BRAND.primary}; }
    .itp-pagination-btn { width:34px; height:34px; border-radius:50%; border:1.5px solid ${BRAND.border}; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:.82rem; color:${BRAND.meta}; transition:all .2s; font-family:'DM Sans',sans-serif; font-weight:600; }
    .itp-pagination-btn:hover:not(:disabled) { border-color:${BRAND.primary}; color:${BRAND.primary}; }
    .itp-pagination-btn.active { background:${BRAND.primary}; border-color:${BRAND.primary}; color:#fff; }
    .itp-pagination-btn:disabled { opacity:.4; cursor:not-allowed; }

    .itp-contribute-section { background:linear-gradient(135deg,#fff8f8 0%,#f0f4ff 100%); padding:3rem 0; border-top:1px solid ${BRAND.borderLight}; }
    .itp-contribute-card { background:#fff; border-radius:20px; padding:2rem 2.5rem; box-shadow:0 8px 32px rgba(0,0,0,.07); border:1px solid ${BRAND.borderLight}; }
    .itp-contribute-tab { border:none; background:transparent; font-family:'DM Sans',sans-serif; font-size:.85rem; font-weight:600; cursor:pointer; padding:.6rem 1.2rem; border-radius:50px; color:${BRAND.meta}; transition:all .2s; }
    .itp-contribute-tab.active { background:${BRAND.primary}; color:#fff; }
    .itp-star-pick { cursor:pointer; transition:transform .1s; }
    .itp-star-pick:hover { transform:scale(1.2); }
    .itp-qa-item { border-bottom:1px solid ${BRAND.borderLight}; padding:1.25rem 0; }
    .itp-qa-item:last-child { border-bottom:none; }

    .itp-more-places-section { background:${BRAND.bgLight}; padding:.25rem 0 3.75rem; }
    .itp-more-places-heading { font-family:'Cormorant Garamond',serif; font-weight:700; font-size:2.15rem; color:${BRAND.charcoal}; margin-bottom:.35rem; }
    .itp-more-places-sub { color:${BRAND.meta}; font-size:.92rem; margin-bottom:2.25rem; }
    .itp-more-card { display:block; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 6px 22px rgba(0,0,0,.06); border:1px solid ${BRAND.border}; transition:transform .25s ease, box-shadow .25s ease; height:100%; text-decoration:none; }
    .itp-more-card:hover { transform:translateY(-5px); box-shadow:0 18px 38px rgba(0,0,0,.10); }
    .itp-more-card-img-wrap { position:relative; height:210px; overflow:hidden; background:${BRAND.borderLight}; }
    .itp-more-card-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s ease; }
    .itp-more-card:hover .itp-more-card-img-wrap img { transform:scale(1.07); }
    .itp-more-card-badge { position:absolute; top:14px; left:14px; background:${BRAND.teal}; color:#fff; font-weight:700; font-size:.82rem; padding:.35rem .9rem; border-radius:50px; box-shadow:0 4px 14px rgba(20,184,166,.38); }
    .itp-more-card-body { padding:1.1rem 1.3rem 1.3rem; }
    .itp-more-card-title { font-size:1.1rem; font-weight:700; color:${BRAND.charcoal}; margin-bottom:.22rem; }
    .itp-more-card-dest { font-size:.8rem; color:${BRAND.meta}; margin-bottom:.85rem; }
    .itp-more-card-meta-row { display:flex; align-items:center; justify-content:space-between; padding-top:.7rem; border-top:1px solid ${BRAND.borderLight}; }
    .itp-more-card-rating, .itp-more-card-duration { display:flex; align-items:center; gap:5px; font-size:.78rem; color:${BRAND.meta}; font-weight:600; }

    .itp-booking-card { border-radius:16px; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,.10); border:1px solid ${BRAND.border}; }
    .itp-booking-head { background:${BRAND.navy}; padding:1.5rem 1.5rem 1.25rem; }
    .itp-booking-body { background:#fff; padding:1.25rem 1.5rem 1.5rem; }
    .itp-booking-trust { background:${BRAND.bgCard}; border-top:1px solid ${BRAND.borderLight}; padding:.85rem 1.5rem; display:flex; flex-direction:column; gap:8px; }
    .itp-checklist-item { display:flex; align-items:center; gap:8px; font-size:.82rem; color:rgba(255,255,255,.85); padding:.35rem 0; border-bottom:1px solid ${BRAND.navyBorder}; }
    .itp-checklist-item:last-child { border-bottom:none; }
    .itp-btn-primary { background:${BRAND.primary}; border:none; color:#fff; font-weight:700; border-radius:50px; padding:.85rem 1.5rem; font-size:.95rem; cursor:pointer; transition:all .25s; font-family:'DM Sans',sans-serif; width:100%; display:flex; align-items:center; justify-content:center; gap:8px; }
    .itp-btn-primary:hover { background:${BRAND.primaryDark}; transform:translateY(-1px); box-shadow:0 6px 20px rgba(240,75,90,.30); }
    .itp-btn-primary:active { transform:scale(.98); }
    .itp-btn-outline { border:2px dashed ${BRAND.border}; background:transparent; color:#3D52A0; font-weight:600; font-size:.84rem; border-radius:50px; padding:.55rem 1rem; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; width:100%; display:flex; align-items:center; justify-content:center; gap:6px; }
    .itp-btn-outline:hover { border-color:#3D52A0; }
    .itp-input { border:1px solid ${BRAND.border}; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:.88rem; height:46px; padding:0 14px; width:100%; transition:border-color .2s; background:#fff; color:${BRAND.charcoal}; }
    .itp-input::placeholder { color:${BRAND.placeholder}; }
    .itp-input:focus { outline:none; border-color:${BRAND.primary}; box-shadow:0 0 0 3px rgba(240,75,90,.10); }
    .itp-input-group { position:relative; }
    .itp-input-group .itp-input { padding-left:36px; }
    .itp-input-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:${BRAND.placeholder}; pointer-events:none; }
    textarea.itp-input { height:auto; padding:10px 14px; resize:vertical; }
    textarea.itp-input:focus { outline:none; border-color:${BRAND.primary}; box-shadow:0 0 0 3px rgba(240,75,90,.10); }
    .itp-contact-chip { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; border:1.5px solid ${BRAND.border}; border-radius:8px; color:${BRAND.meta}; text-decoration:none; padding:.5rem; font-size:.77rem; font-weight:600; transition:all .2s; background:#fff; }
    .itp-contact-chip:hover { border-color:${BRAND.primary}; color:${BRAND.primary}; }
    .itp-stat-chip { display:flex; align-items:center; gap:8px; background:#fff; border:1px solid ${BRAND.border}; border-radius:10px; padding:.5rem .85rem; font-size:.84rem; }
    .itp-highlight-pill { background:rgba(240,75,90,.06); color:${BRAND.primary}; font-size:.79rem; font-weight:600; border-radius:50px; padding:.3rem .85rem; border:1px solid rgba(240,75,90,.15); }
    .itp-counter { display:flex; align-items:center; justify-content:space-between; border:1.5px solid ${BRAND.border}; border-radius:8px; padding:.45rem .85rem; background:#fff; }
    .itp-counter-btn { width:28px; height:28px; border:1px solid ${BRAND.border}; border-radius:6px; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:400; color:${BRAND.meta}; transition:all .15s; }
    .itp-counter-btn:hover { border-color:${BRAND.primary}; color:${BRAND.primary}; }
    .itp-modal-anim { animation:itp-modal-in .3s cubic-bezier(.4,0,.2,1) both; }
    .itp-scope-btn { border:none; background:transparent; font-size:.78rem; font-weight:600; cursor:pointer; color:#888; border-radius:50px; padding:.38rem 1.1rem; }
    .itp-scope-btn.active { background:#fff; color:${BRAND.charcoal}; box-shadow:0 2px 8px rgba(0,0,0,.1); }
    .itp-cmp-pkg-chip { border:2px solid ${BRAND.border}; background:#fff; font-size:.77rem; font-weight:600; color:${BRAND.meta}; cursor:pointer; transition:all .2s; border-radius:50px; padding:.35rem .9rem; }
    .itp-cmp-pkg-chip.selected { background:${BRAND.primary}; border-color:${BRAND.primary}; color:#fff; }
    .itp-cmp-pkg-chip:hover:not(.selected):not(:disabled) { border-color:#c0c8f0; color:${BRAND.charcoal}; }
    .itp-cmp-dur-tab { border:1.5px solid ${BRAND.border}; background:#fff; font-size:.75rem; font-weight:600; color:#888; cursor:pointer; transition:all .2s; border-radius:50px; padding:.3rem .9rem; }
    .itp-cmp-dur-tab.active { background:${BRAND.primary}; border-color:${BRAND.primary}; color:#fff; }
    .itp-sticky-bar { position:fixed; bottom:0; left:0; right:0; background:#fff; border-top:1px solid ${BRAND.border}; z-index:200; box-shadow:0 -6px 24px rgba(0,0,0,.10); display:none; }
    .itp-breadcrumb a { color:rgba(255,255,255,.6); text-decoration:none; }
    .itp-breadcrumb a:hover { color:#FFD080; }
    .font-serif { font-family:'Cormorant Garamond',serif; }
    .navy { color:${BRAND.charcoal}; }
    .itp-incl-row { display:flex; align-items:flex-start; gap:8px; padding:.55rem 0; font-size:.84rem; color:${BRAND.bodyText}; border-bottom:1px solid ${BRAND.borderLight}; }
    .itp-incl-row:last-child { border-bottom:none; }
    @media(max-width:992px) {
      .itp-sticky-bar { display:flex; }
      body { padding-bottom:70px; }
      .itp-hero-content { flex-direction:column; align-items:flex-start; gap:1rem; }
    }
    @media(max-width:576px) {
      .itp-hero { height:52vh; }
      .itp-hero-content { padding:1.5rem; }
      .itp-new-timeline::before { left:18px; }
      .itp-day-circle { width:38px; height:38px; font-size:.85rem; }
      .itp-day-num-col { width:38px; }
      .itp-contribute-card { padding:1.25rem; }
    }
  `;

  if (loading)
    return (
      <>
        <style>{globalStyles}</style>
        <div className="container py-4" style={{ maxWidth: 1200 }}>
          <Skel h={420} r={20} mb={24} />
          <div className="row g-4">
            <div className="col-lg-8">
              <Skel h={32} w="55%" mb={12} />
              <Skel h={18} mb={8} />
              <Skel h={18} w="80%" mb={32} />
              <Skel h={220} r={16} />
            </div>
            <div className="col-lg-4">
              <Skel h={400} r={20} />
            </div>
          </div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <style>{globalStyles}</style>
        <div
          className="d-flex flex-column align-items-center justify-content-center text-center py-5"
          style={{ minHeight: "60vh" }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>😕</div>
          <h2
            className="font-serif fw-bold navy mb-2"
            style={{ fontSize: "2rem" }}
          >
            Package Not Found
          </h2>
          <p
            style={{ color: BRAND.meta, marginBottom: "1.5rem", maxWidth: 420 }}
          >
            {error}
          </p>
          <button
            onClick={() => navigate(`/tourcard/${type}`)}
            className="itp-btn-primary"
            style={{ width: "auto", padding: ".75rem 2rem" }}
          >
            ← Back to {typeTitle}
          </button>
        </div>
      </>
    );

  return (
    <>
      <Header />
      <style>{globalStyles}</style>

      {/* ── HERO ── */}
      <section className="itp-hero">
        <img
          src={
            images[activeImg]?.src ||
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80"
          }
          alt={locationTitle}
          className="itp-hero-img"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80";
          }}
        />
        <div className="itp-hero-grad" />
        <div
          className="position-absolute d-flex gap-2"
          style={{ top: "1.4rem", right: "1.5rem", zIndex: 10 }}
        >
          {[
            {
              icon: <FaArrowLeft size={14} />,
              title: "Back",
              onClick: () => navigate(`/tourcard/${type}`),
            },
            {
              icon: isFav ? (
                <FaHeart size={14} style={{ color: BRAND.primary }} />
              ) : (
                <FaRegHeart size={14} />
              ),
              title: "Wishlist",
              onClick: () => setIsFav((v) => !v),
            },
            {
              icon: <FaBalanceScale size={14} />,
              title: "Compare",
              onClick: openCompare,
            },
            {
              icon: <FaShare size={14} />,
              title: "Share",
              onClick: () =>
                navigator.share?.({
                  title: `${locationTitle} ${typeTitle}`,
                  url: window.location.href,
                }),
            },
          ].map((btn, i) => (
            <button
              key={i}
              title={btn.title}
              onClick={btn.onClick}
              className="d-flex align-items-center justify-content-center border-0 text-white"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,.14)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,.2)",
                cursor: "pointer",
                transition: "all .2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.28)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.14)")
              }
            >
              {btn.icon}
            </button>
          ))}
        </div>
        {images.length > 1 && (
          <div
            className="position-absolute d-flex gap-2"
            style={{ bottom: "1.4rem", right: "1.5rem", zIndex: 10 }}
          >
            {images.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={getCloudinaryUrl(img.src, 120)}
                alt=""
                className={`itp-thumb ${i === activeImg ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ))}
          </div>
        )}
        <div className="itp-hero-content">
          <div className="itp-hero-left">
            <nav
              className="itp-breadcrumb d-flex align-items-center gap-1 flex-wrap mb-2"
              style={{ fontSize: ".77rem", color: "rgba(255,255,255,.6)" }}
            >
              <Link to="/">Home</Link>
              <span style={{ opacity: 0.4 }}>›</span>
              <Link to="/services">Tours</Link>
              <span style={{ opacity: 0.4 }}>›</span>
              <Link to={`/tourcard/${type}`}>{typeTitle}</Link>
              <span style={{ opacity: 0.4 }}>›</span>
              <span className="text-white">{locationTitle}</span>
            </nav>
            <div
              className="d-inline-flex align-items-center gap-2 mb-2 px-3 py-1 rounded-pill"
              style={{
                background: "rgba(255,255,255,.12)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,.2)",
                color: "#fff",
                fontSize: ".75rem",
                fontWeight: 600,
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              <span>✈️</span>
              <span>{typeTitle}</span>
            </div>
            <h1 className="itp-hero-title">
              {pkg?.title || `${locationTitle} ${typeTitle}`}
            </h1>
            <div className="d-flex flex-wrap gap-3">
              {[
                pkg?.location && {
                  icon: <FaMapMarkerAlt size={11} />,
                  text: pkg.location,
                },
                selDur?.label && {
                  icon: <FaClock size={11} />,
                  text: selDur.label,
                },
                groupSizeDisplay && {
                  icon: <FaUsers size={11} />,
                  text: groupSizeDisplay,
                },
                pkg?.rating && {
                  icon: <FaStar size={11} style={{ color: BRAND.amber }} />,
                  text: `${pkg.rating}${pkg?.reviews ? ` (${pkg.reviews} reviews)` : ""}`,
                },
              ]
                .filter(Boolean)
                .map((item, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center gap-1"
                    style={{
                      color: "rgba(255,255,255,.85)",
                      fontSize: ".87rem",
                    }}
                  >
                    {item.icon} {item.text}
                  </div>
                ))}
            </div>
          </div>
          <div
            className="d-none d-md-block"
            style={{ minWidth: 200, flexShrink: 0, marginBottom: 30 }}
          >
            <div
              className="rounded-4 p-3"
              style={{
                background: "rgba(10,10,30,.52)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,.18)",
                color: "#fff",
                minWidth: 200,
              }}
            >
              {weather ? (
                <>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      opacity: 0.65,
                      marginBottom: 8,
                    }}
                  >
                    📍 {locationTitle} · Weather
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{ fontSize: "1.9rem", lineHeight: 1 }}>
                      {weather.icon}
                    </span>
                    <div>
                      <div
                        className="font-serif fw-bold"
                        style={{ fontSize: "1.6rem", lineHeight: 1 }}
                      >
                        {weather.temp}°C
                      </div>
                      <div
                        style={{
                          fontSize: ".7rem",
                          opacity: 0.75,
                          textTransform: "uppercase",
                          letterSpacing: ".05em",
                          marginTop: 2,
                        }}
                      >
                        {weather.desc}
                      </div>
                    </div>
                  </div>
                  <div
                    className="d-flex gap-2 mb-1 flex-wrap"
                    style={{ fontSize: ".7rem", opacity: 0.8 }}
                  >
                    <span>💧 {weather.humidity}%</span>
                    <span>🌬️ {weather.wind} km/h</span>
                    <span>☀️ UV {weather.uv}</span>
                  </div>
                  <div
                    style={{
                      fontSize: ".68rem",
                      opacity: 0.65,
                      borderTop: "1px solid rgba(255,255,255,.15)",
                      paddingTop: 5,
                      marginTop: 6,
                    }}
                  >
                    🗓️ Best time: {weather.best}
                  </div>
                </>
              ) : (
                <div>
                  <div
                    style={{
                      fontSize: ".73rem",
                      opacity: 0.6,
                      marginBottom: 8,
                    }}
                  >
                    Loading weather...
                  </div>
                  {[70, 50, 80].map((w, i) => (
                    <Skel key={i} h={10} w={`${w}%`} mb={6} r={5} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STICKY SECTION NAV BAR ══ */}
      <nav className="itp-section-nav">
        <div className="itp-section-nav-inner">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`itp-snav-btn ${activeNavSection === item.key ? "active" : ""} ${item.key === "contribute" ? "itp-snav-contribute" : ""}`}
              onClick={() => {
                setActiveNavSection(item.key);
                // Each item uses scrollTarget — overview scrolls to overviewRef,
                // gallery scrolls to galleryRef, moreplaces to morePlacesRef, etc.
                scrollToSection(item.scrollTarget);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="container py-4" style={{ maxWidth: 1280 }}>
        <div className="row g-4 align-items-start">
          <div className="col-lg-8">
            {durationOptions.length > 0 && (
              <div className="mb-4">
                <div
                  className="text-uppercase fw-bold mb-2"
                  style={{
                    fontSize: ".72rem",
                    color: BRAND.placeholder,
                    letterSpacing: ".07em",
                  }}
                >
                  Select Package Duration
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {durationOptions.map((dur, idx) => (
                    <button
                      key={idx}
                      className={`itp-dur-pill ${selectedDurationIdx === idx ? "active" : ""}`}
                      onClick={() => setSelectedDurationIdx(idx)}
                    >
                      <span>{dur.label}</span>
                      {pkg?.price > 0 && (
                        <span
                          style={{
                            fontSize: ".67rem",
                            fontWeight: 400,
                            opacity: selectedDurationIdx === idx ? 0.85 : 0.7,
                          }}
                        >
                          from ₹{pkg.price.toLocaleString()}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex flex-wrap gap-2 mb-4">
              {[
                selDur?.label && {
                  emoji: "📅",
                  val: selDur.label,
                  sub: "Duration",
                },
                pkg?.hotelRating && {
                  emoji: "🏨",
                  val: pkg.hotelRating,
                  sub: "Hotels",
                },
                groupSizeDisplay && {
                  emoji: "👥",
                  val: groupSizeDisplay,
                  sub: "Group Size",
                },
                pkg?.destination && {
                  emoji: "📍",
                  val: pkg.destination,
                  sub: "Region",
                },
              ]
                .filter(Boolean)
                .map((item, i) => (
                  <div key={i} className="itp-stat-chip">
                    <span style={{ fontSize: "1.2rem" }}>{item.emoji}</span>
                    <div>
                      <div
                        className="fw-bold"
                        style={{ fontSize: ".84rem", color: BRAND.charcoal }}
                      >
                        {item.val}
                      </div>
                      <div
                        style={{ fontSize: ".7rem", color: BRAND.placeholder }}
                      >
                        {item.sub}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* ── OVERVIEW — ref for click-scroll only, NOT scroll-tracked ── */}
            <div ref={overviewRef}>
              {(pkg?.description || pkg?.about) && (
                <div className="mb-4">
                  <h2
                    className="font-serif fw-bold mb-2"
                    style={{ fontSize: "1.6rem", color: BRAND.charcoal }}
                  >
                    About This Package
                  </h2>
                  <p
                    style={{
                      fontSize: ".9rem",
                      color: BRAND.bodyText,
                      lineHeight: 1.8,
                      marginBottom: 0,
                    }}
                  >
                    {pkg.description || pkg.about}
                  </p>
                </div>
              )}
            </div>

            {/* ── HIGHLIGHTS ── */}
            <div ref={highlightsRef}>
              {pkg?.highlights?.length > 0 && (
                <div className="mb-4">
                  <h2
                    className="font-serif fw-bold mb-3"
                    style={{ fontSize: "1.4rem", color: BRAND.charcoal }}
                  >
                    Highlights
                  </h2>
                  <div className="d-flex flex-wrap gap-2">
                    {pkg.highlights.map((h, i) => (
                      <span key={i} className="itp-highlight-pill">
                        ✦ {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── ITINERARY ── */}
            <div ref={itineraryRef}>
              <ScrollReveal>
                <h2
                  className="font-serif fw-bold mb-4"
                  style={{ fontSize: "1.75rem", color: BRAND.charcoal }}
                >
                  Itinerary
                </h2>
              </ScrollReveal>
              <div className="itp-new-timeline">
                {itinerary.length > 0 ? (
                  itinerary.map((day, i) => (
                    <ScrollReveal key={i} delay={i * 65}>
                      <div className="itp-day-item">
                        <div className="itp-day-num-col">
                          <div className="itp-day-circle">{day.day}</div>
                        </div>
                        <div className="itp-day-card-new">
                          <h3 className="itp-day-title-new">{day.title}</h3>
                          {day.description && (
                            <p className="itp-day-desc">{day.description}</p>
                          )}
                          {day.activities?.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mb-3">
                              {day.activities.map((a, j) => (
                                <span key={j} className="itp-activity-pill-new">
                                  ✦ {a}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="itp-day-meta-row">
                            {day.accommodation && (
                              <span className="itp-day-meta-chip">
                                <FaBed size={12} color={BRAND.teal} />{" "}
                                {day.accommodation}
                              </span>
                            )}
                            {day.meals?.length > 0 && (
                              <span className="itp-day-meta-chip">
                                <FaUtensils size={11} color={BRAND.teal} />{" "}
                                {day.meals.join(" · ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))
                ) : (
                  <div
                    className="text-center p-4 rounded-3"
                    style={{
                      background: BRAND.bgCard,
                      border: `1px dashed ${BRAND.border}`,
                      color: BRAND.placeholder,
                      marginLeft: 64,
                    }}
                  >
                    No itinerary details available for this package.
                  </div>
                )}
              </div>
            </div>

            {/* ── INCLUSIONS ── */}
            <div ref={inclusionsRef} className="mt-4 mb-4">
              <h2
                className="font-serif fw-bold mb-4"
                style={{ fontSize: "1.4rem", color: BRAND.charcoal }}
              >
                What's Included
              </h2>
              <div className="row g-4">
                {[
                  {
                    title: "Included",
                    items: inclusions,
                    icon: <FaCheck size={11} color={BRAND.success} />,
                    titleColor: "#2e7d32",
                  },
                  {
                    title: "Not Included",
                    items: exclusions,
                    icon: <FaTimes size={11} color={BRAND.primary} />,
                    titleColor: "#c62828",
                  },
                ].map((col, ci) => (
                  <div key={ci} className="col-md-6">
                    <h4
                      className="d-flex align-items-center gap-2 mb-3"
                      style={{
                        color: col.titleColor,
                        fontSize: ".9rem",
                        fontWeight: 700,
                      }}
                    >
                      {col.icon} {col.title}
                    </h4>
                    {col.items.length > 0 ? (
                      col.items.map((item, i) => (
                        <div key={i} className="itp-incl-row">
                          <span style={{ flexShrink: 0, marginTop: 2 }}>
                            {col.icon}
                          </span>
                          {item}
                        </div>
                      ))
                    ) : (
                      <div
                        className="text-center p-3 rounded-3"
                        style={{
                          background: BRAND.bgCard,
                          border: `1px dashed ${BRAND.border}`,
                          color: BRAND.placeholder,
                          fontSize: ".85rem",
                        }}
                      >
                        No {col.title.toLowerCase()} listed.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Booking sidebar ── */}
          <div className="col-lg-4">
            <div
              ref={bookingRef}
              className="itp-booking-card"
              style={{ position: "sticky", top: 56 }}
            >
              <div className="itp-booking-head">
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      fontSize: ".75rem",
                      color: "rgba(255,255,255,.55)",
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      marginBottom: 4,
                    }}
                  >
                    Starting from
                  </div>
                  <div className="d-flex align-items-baseline gap-2">
                    <div
                      className="font-serif fw-bold"
                      style={{
                        fontSize: "2.6rem",
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {livePrice > 0
                        ? `₹${livePrice.toLocaleString()}`
                        : "Price on request"}
                    </div>
                    {pkg?.strikePrice && pkg.strikePrice > pkg.price && (
                      <div
                        style={{
                          fontSize: "1rem",
                          color: "rgba(255,255,255,.4)",
                          textDecoration: "line-through",
                        }}
                      >
                        ₹{pkg.strikePrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: ".78rem",
                      color: "rgba(255,255,255,.55)",
                      marginTop: 4,
                    }}
                  >
                    per person{selDur?.label ? ` · ${selDur.label}` : ""} · all
                    inclusive
                  </div>
                </div>
                {inclusions.slice(0, 6).map((item, i) => (
                  <div key={i} className="itp-checklist-item">
                    <FaCheck
                      size={10}
                      color={BRAND.success}
                      style={{ flexShrink: 0 }}
                    />
                    <span>{item}</span>
                  </div>
                ))}
                {inclusions.length === 0 &&
                  [
                    "Accommodation included",
                    "Daily breakfast",
                    "Airport transfers",
                    "All sightseeing",
                    "Expert guide",
                  ].map((item, i) => (
                    <div key={i} className="itp-checklist-item">
                      <FaCheck
                        size={10}
                        color={BRAND.success}
                        style={{ flexShrink: 0 }}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
              </div>
              <div className="itp-booking-body">
                {livePrice > 0 && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                      <span
                        className="d-inline-flex align-items-center gap-1 rounded-pill px-2 py-1"
                        style={{
                          fontSize: ".72rem",
                          fontWeight: 600,
                          background:
                            trend === "rising"
                              ? "#FFF3E0"
                              : trend === "falling"
                                ? "#E8F5E9"
                                : BRAND.borderLight,
                          color:
                            trend === "rising"
                              ? "#E65100"
                              : trend === "falling"
                                ? "#2E7D32"
                                : BRAND.meta,
                        }}
                      >
                        {trend === "rising"
                          ? "📈 Price rising"
                          : trend === "falling"
                            ? "📉 Price dropping"
                            : "📊 Price stable"}
                      </span>
                    </div>
                    <div
                      className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
                      style={{
                        background: "rgba(240,75,90,.06)",
                        border: `1px solid rgba(240,75,90,.15)`,
                        fontSize: ".78rem",
                      }}
                    >
                      <FaBolt color={BRAND.primary} size={11} />
                      <span style={{ color: BRAND.meta }}>Offer ends in</span>
                      <span
                        className="fw-bold"
                        style={{
                          color: BRAND.primary,
                          fontVariantNumeric: "tabular-nums",
                          fontSize: ".94rem",
                        }}
                      >
                        {String(countdown.h).padStart(2, "0")}:
                        {String(countdown.m).padStart(2, "0")}:
                        {String(countdown.s).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                )}
                {!user && (
                  <div
                    className="d-flex align-items-center gap-2 rounded-3 p-3 mb-3"
                    style={{
                      background: "linear-gradient(135deg,#f0f4ff,#faf0ff)",
                      border: "1px solid #d8deff",
                      fontSize: ".8rem",
                      color: BRAND.bodyText,
                    }}
                  >
                    <FaLock color="#3D52A0" size={13} />
                    <span>
                      <Link
                        to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                        style={{
                          color: "#3D52A0",
                          fontWeight: 700,
                          borderBottom: "1px solid #3D52A0",
                          textDecoration: "none",
                        }}
                      >
                        Login
                      </Link>{" "}
                      to submit an enquiry and get personalised quotes
                    </span>
                  </div>
                )}
                <div className="mb-3">
                  <label
                    className="d-block text-uppercase fw-bold mb-1"
                    style={{
                      fontSize: ".72rem",
                      color: BRAND.placeholder,
                      letterSpacing: ".06em",
                    }}
                  >
                    Travel Date
                  </label>
                  <input
                    type="date"
                    className="itp-input"
                    value={travelDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setTravelDate(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label
                    className="d-block text-uppercase fw-bold mb-1"
                    style={{
                      fontSize: ".72rem",
                      color: BRAND.placeholder,
                      letterSpacing: ".06em",
                    }}
                  >
                    Travelers
                  </label>
                  <div className="itp-counter">
                    <button
                      type="button"
                      className="itp-counter-btn"
                      onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                    >
                      −
                    </button>
                    <span className="fw-bold" style={{ color: BRAND.charcoal }}>
                      {travelers}
                    </span>
                    <button
                      type="button"
                      className="itp-counter-btn"
                      onClick={() => setTravelers((t) => Math.min(20, t + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
                {livePrice > 0 && (
                  <div
                    className="d-flex justify-content-between align-items-center py-3 mb-3"
                    style={{ borderTop: `1px solid ${BRAND.borderLight}` }}
                  >
                    <div>
                      <div style={{ fontSize: ".83rem", color: BRAND.meta }}>
                        Estimated Total
                      </div>
                      <div
                        style={{ fontSize: ".72rem", color: BRAND.placeholder }}
                      >
                        ₹{livePrice.toLocaleString()} × {travelers}{" "}
                        {travelers === 1 ? "person" : "people"}
                      </div>
                    </div>
                    <div
                      className="font-serif fw-bold"
                      style={{ fontSize: "1.55rem", color: BRAND.primary }}
                    >
                      ₹{totalPrice.toLocaleString()}
                    </div>
                  </div>
                )}
                <button className="itp-btn-primary mb-2" onClick={openEnquiry}>
                  <FaEnvelope size={14} />
                  {user ? "Submit Enquiry" : "Login & Enquire"}
                </button>
                {showAuth && (
                  <LoginRegister onClose={() => setShowAuth(false)} />
                )}

                <button className="itp-btn-outline mb-2" onClick={openCompare}>
                  <FaBalanceScale size={13} /> Compare Durations &amp; Packages
                </button>
                <TripPlannerModal
                  prefillDestination={locationTitle}
                  prefillTripType={typeTitle}
                />
                <div className="d-flex gap-2 mt-3">
                  <a href="tel:+917888251550" className="itp-contact-chip">
                    <FaPhone size={11} /> Call Us
                  </a>
                  <a
                    href="https://wa.me/917888251550"
                    target="_blank"
                    rel="noreferrer"
                    className="itp-contact-chip"
                  >
                    <FaWhatsapp size={11} /> WhatsApp
                  </a>
                </div>
              </div>
              <div className="itp-booking-trust">
                {[
                  {
                    icon: <FaShieldAlt size={10} color={BRAND.success} />,
                    text: "100% secure enquiry",
                  },
                  { icon: "🔄", text: "Free cancellation up to 48 hours" },
                  { icon: "✅", text: "Expert responds within 30 minutes" },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center gap-2"
                    style={{ fontSize: ".77rem", color: BRAND.meta }}
                  >
                    <span>{r.icon}</span> {r.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {coords && (
        <div className="mb-4">
          <LocationMap
            lat={coords.lat}
            lng={coords.lng}
            title={locationTitle}
            subtitle={pkg?.destination}
            defaultView="satellite"
          />
        </div>
      )}
      {/* ══ GALLERY — ref={galleryRef} enables exact nav scroll ══ */}
      {images.length > 0 && (
        <section className="itp-gallery-section" ref={galleryRef}>
          <div className="container" style={{ maxWidth: 1280 }}>
            <ScrollReveal>
              <h2 className="itp-gallery-heading">Gallery</h2>
            </ScrollReveal>
            <ScrollReveal delay={70}>
              <div className="itp-gal-grid">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="itp-gal-item"
                    style={{
                      gridColumn: i === 0 ? "span 2" : "span 1",
                      gridRow: i === 0 ? "span 2" : "span 1",
                    }}
                    onClick={() => openLightbox(i)}
                  >
                    <img
                      src={img.src}
                      alt={img.caption || `${locationTitle} ${i + 1}`}
                      onError={(e) => {
                        e.target.parentElement.style.display = "none";
                      }}
                    />
                    <div className="itp-gal-ov">
                      <div
                        style={{
                          width: 58,
                          height: 58,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.15)",
                          border: "2px solid rgba(255,255,255,0.55)",
                          backdropFilter: "blur(8px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 22,
                        }}
                      >
                        <FaExpand />
                      </div>
                    </div>
                    {img.caption && (
                      <div className="itp-gal-caption">{img.caption}</div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <ReviewsAndQA
        ref={reviewsRef}
        onOpenContribute={(tab) => contributeCompRef.current?.openModal(tab)}
        pkgId={pkg?._id}
      />

      <ContributeSection
        ref={contributeCompRef}
        sectionRef={contributeRef}
        packageTitle={pkg?.title || `${locationTitle} ${typeTitle}`}
        user={user}
      />

      {/* ══ REVIEWS ══
      <section className="itp-reviews-section" ref={reviewsRef}>
        <div className="container" style={{ maxWidth: 1280 }}>
          <ScrollReveal>
            <h2 className="font-serif fw-bold mb-1" style={{ fontSize: "2rem", color: BRAND.charcoal }}>Reviews & Q&A</h2>
            <p style={{ color: BRAND.meta, fontSize: ".9rem", marginBottom: "1.5rem" }}>Hear from travellers who've experienced this package</p>
          </ScrollReveal>

          <div style={{ borderBottom: `1px solid ${BRAND.border}`, marginBottom: "1.5rem" }}>
            <button className={`itp-review-tab ${reviewTab === "reviews" ? "active" : ""}`} onClick={() => setReviewTab("reviews")}>Reviews <span style={{ fontSize: ".78rem", background: BRAND.borderLight, borderRadius: 50, padding: "2px 8px", marginLeft: 4 }}>{reviews.length}</span></button>
            <button className={`itp-review-tab ${reviewTab === "qa" ? "active" : ""}`} onClick={() => setReviewTab("qa")}>Q&amp;A <span style={{ fontSize: ".78rem", background: BRAND.borderLight, borderRadius: 50, padding: "2px 8px", marginLeft: 4 }}>{SAMPLE_QA.length}</span></button>
          </div>

          {reviewTab === "reviews" && (
            <div className="row g-4">
              <div className="col-lg-3 col-md-4">
                <div style={{ position: "sticky", top: 70 }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div style={{ width: 64, height: 64, borderRadius: 12, background: BRAND.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "1.55rem", fontWeight: 800, color: "#fff", fontFamily: "'Cormorant Garamond',serif" }}>{avgRating}</span>
                    </div>
                    <div>
                      <StarRating rating={parseFloat(avgRating)} size={15} />
                      <div style={{ fontSize: ".75rem", color: BRAND.meta, marginTop: 4 }}>{reviews.length} reviews</div>
                    </div>
                  </div>
                  {[
                    { label: "Excellent", count: ratingCounts[5], color: "#16a34a" },
                    { label: "Very Good", count: ratingCounts[4], color: "#65a30d" },
                    { label: "Average", count: ratingCounts[3], color: BRAND.amber },
                    { label: "Poor", count: ratingCounts[2], color: "#ea580c" },
                    { label: "Terrible", count: ratingCounts[1], color: BRAND.primary },
                  ].map(bar => <RatingBar key={bar.label} label={bar.label} count={bar.count} total={reviews.length} color={bar.color} />)}
                </div>
              </div>
              <div className="col-lg-9 col-md-8">
                <div className="position-relative mb-3">
                  <FaSearch size={13} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: BRAND.placeholder }} />
                  <input className="itp-review-search" placeholder="Search reviews..." value={reviewSearch} onChange={e => { setReviewSearch(e.target.value); setReviewPage(1); }} />
                </div>
                {pagedReviews.length === 0 ? (
                  <div className="text-center p-5" style={{ color: BRAND.meta }}>No reviews match your search.</div>
                ) : (
                  pagedReviews.map(r => (
                    <div key={r.id} className="itp-review-card">
                      <div className="d-flex align-items-start gap-3 mb-2">
                        <div className="itp-review-avatar">{r.name.charAt(0)}</div>
                        <div className="grow">
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div>
                              <div className="fw-bold" style={{ fontSize: ".9rem", color: BRAND.charcoal }}>{r.name}</div>
                              <div style={{ fontSize: ".75rem", color: BRAND.meta }}>{r.location}</div>
                            </div>
                            <button style={{ border: "none", background: "transparent", color: BRAND.placeholder, cursor: "pointer", padding: "4px 8px" }}><FaEllipsisH size={13} /></button>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <StarRating rating={r.rating} size={13} />
                        <span className="fw-bold" style={{ fontSize: ".82rem", color: BRAND.charcoal }}>{r.title}</span>
                      </div>
                      <div style={{ fontSize: ".78rem", color: BRAND.meta, marginBottom: 8 }}>{r.date} · {r.tripType}</div>
                      <p style={{ fontSize: ".86rem", color: BRAND.bodyText, lineHeight: 1.7, marginBottom: "1rem" }}>{r.text}</p>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: ".75rem", color: BRAND.meta }}>Helpful?</span>
                        <button className={`itp-helpful-btn ${helpfulClicked[r.id] ? "clicked" : ""}`} onClick={() => handleHelpful(r.id)}>
                          <FaThumbsUp size={11} /> {r.helpful}
                        </button>
                      </div>
                    </div>
                  ))
                )}
                {totalReviewPages > 1 && (
                  <div className="d-flex align-items-center justify-content-center gap-2 mt-4">
                    <button className="itp-pagination-btn" onClick={() => setReviewPage(p => Math.max(1, p - 1))} disabled={reviewPage === 1}><FaChevronLeft size={11} /></button>
                    {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`itp-pagination-btn ${reviewPage === p ? "active" : ""}`} onClick={() => setReviewPage(p)}>{p}</button>
                    ))}
                    <button className="itp-pagination-btn" onClick={() => setReviewPage(p => Math.min(totalReviewPages, p + 1))} disabled={reviewPage === totalReviewPages}><FaChevronRight size={11} /></button>
                  </div>
                )}
              </div>
            </div>
          )}

          {reviewTab === "qa" && (
            <div style={{ maxWidth: 820 }}>
              {pagedQa.map(q => (
                <div key={q.id} className="itp-qa-item">
                  <div className="d-flex align-items-start gap-3 mb-2">
                    <div className="itp-review-avatar" style={{ background: "linear-gradient(135deg,#3D52A0,#6B7280)", fontSize: ".85rem" }}>{q.author.charAt(0)}</div>
                    <div className="grow">
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div>
                          <span className="fw-bold" style={{ fontSize: ".88rem", color: BRAND.charcoal }}>{q.author}</span>
                          <span style={{ fontSize: ".75rem", color: BRAND.placeholder, marginLeft: 8 }}>{q.contributions} contributions</span>
                        </div>
                        <button style={{ border: "none", background: "transparent", color: BRAND.placeholder, cursor: "pointer" }}><FaEllipsisH size={13} /></button>
                      </div>
                      <p style={{ fontSize: ".88rem", color: BRAND.charcoal, fontWeight: 500, margin: "8px 0 4px" }}>{q.question}</p>
                      <div style={{ fontSize: ".73rem", color: BRAND.placeholder }}>Written {q.date}</div>
                      {q.answer ? (
                        <div className="mt-3 p-3 rounded-3" style={{ background: BRAND.bgCard, border: `1px solid ${BRAND.borderLight}`, fontSize: ".84rem", color: BRAND.bodyText, lineHeight: 1.7 }}>
                          <div className="fw-bold mb-1" style={{ fontSize: ".75rem", color: BRAND.teal, textTransform: "uppercase", letterSpacing: ".06em" }}>✓ Answered</div>
                          {q.answer}
                        </div>
                      ) : (
                        <button onClick={() => { setContributeOpen(true); setContributeTab("qa"); }} style={{ marginTop: 10, border: `1.5px solid ${BRAND.border}`, background: "transparent", borderRadius: 50, padding: ".32rem 1rem", fontSize: ".77rem", color: "#3D52A0", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textDecoration: "underline" }}>
                          Answer this question
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {totalQaPages > 1 && (
                <div className="d-flex align-items-center justify-content-center gap-2 mt-4">
                  <button className="itp-pagination-btn" onClick={() => setQaPage(p => Math.max(1, p - 1))} disabled={qaPage === 1}><FaChevronLeft size={11} /></button>
                  {Array.from({ length: totalQaPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`itp-pagination-btn ${qaPage === p ? "active" : ""}`} onClick={() => setQaPage(p)}>{p}</button>
                  ))}
                  <button className="itp-pagination-btn" onClick={() => setQaPage(p => Math.min(totalQaPages, p + 1))} disabled={qaPage === totalQaPages}><FaChevronRight size={11} /></button>
                </div>
              )}
              <button onClick={() => { setContributeOpen(true); setContributeTab("qa"); }} className="itp-btn-primary mt-4" style={{ width: "auto", padding: ".6rem 1.5rem", fontSize: ".88rem" }}>
                <FaQuestionCircle size={13} /> Ask a Question
              </button>
            </div>
          )}
        </div>
      </section> */}

      {/* ══ CONTRIBUTE ══ */}
      {/* <section className="itp-contribute-section" ref={contributeRef}>
        <div className="container" style={{ maxWidth: 1280 }}>
          <ScrollReveal>
            <div className="row align-items-center mb-4">
              <div className="col">
                <h2 className="font-serif fw-bold mb-1" style={{ fontSize: "2rem", color: BRAND.charcoal }}>Share Your Experience</h2>
                <p style={{ color: BRAND.meta, fontSize: ".9rem", marginBottom: 0 }}>Help fellow travellers by sharing what you know</p>
              </div>
              <div className="col-auto">
                <button onClick={() => setContributeOpen(true)} className="itp-btn-primary" style={{ width: "auto", padding: ".65rem 1.5rem" }}>
                  <FaPencilAlt size={13} /> Write a Review
                </button>
              </div>
            </div>
          </ScrollReveal>
          <div className="row g-3">
            {[
              { icon: <FaStar size={22} color={BRAND.amber} />, title: "Write a Review", desc: "Share your experience to help others plan their trip", action: "review", bg: "linear-gradient(135deg,#FFF8F0,#FFF3E0)" },
              { icon: <FaCamera size={22} color={BRAND.teal} />, title: "Add Photos", desc: "Upload your best shots from this destination", action: "photo", bg: "linear-gradient(135deg,#F0FFFE,#E0F7F5)" },
              { icon: <FaQuestionCircle size={22} color="#3D52A0" />, title: "Ask a Question", desc: "Have a query? Get answers from travellers who've been there", action: "qa", bg: "linear-gradient(135deg,#F0F4FF,#E8EDFF)" },
            ].map((card, i) => (
              <div key={i} className="col-md-4">
                <ScrollReveal delay={i * 80}>
                  <div onClick={() => { setContributeTab(card.action); setContributeOpen(true); }} style={{ background: card.bg, border: `1px solid ${BRAND.borderLight}`, borderRadius: 16, padding: "1.5rem", cursor: "pointer", transition: "transform .2s, box-shadow .2s" }}
                    onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.08)"; }}
                    onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                    <div style={{ marginBottom: 10 }}>{card.icon}</div>
                    <div className="fw-bold mb-1" style={{ fontSize: ".95rem", color: BRAND.charcoal }}>{card.title}</div>
                    <div style={{ fontSize: ".8rem", color: BRAND.meta }}>{card.desc}</div>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ══ MORE PLACES — ref={morePlacesRef} enables exact nav scroll ══ */}
      {(morePlacesLoading || morePlaces.length > 0) && (
        <section className="itp-more-places-section" ref={morePlacesRef}>
          <div className="container text-center" style={{ maxWidth: 1280 }}>
            <ScrollReveal>
              <h2 className="itp-more-places-heading">More Places</h2>
              <p className="itp-more-places-sub">
                Discover other amazing destinations
              </p>
            </ScrollReveal>
            <div className="row g-4 text-start">
              {morePlacesLoading
                ? [0, 1, 2].map((i) => (
                    <div className="col-md-4" key={i}>
                      <Skel h={210} r={16} mb={12} />
                      <Skel h={18} w="60%" mb={8} />
                      <Skel h={14} w="40%" mb={0} />
                    </div>
                  ))
                : morePlaces.slice(0, 6).map((p, i) => {
                    const slug = slugifyLocation(p.location || "");
                    const cardImg =
                      p.gallery?.[0]?.img ||
                      (typeof p.images === "string" ? p.images : "");
                    const cardDurLabel = p.durations?.[0]?.label || "";
                    const cardPrice = p.price || 0;
                    const cardDestSub =
                      p.destination && p.destination !== p.location
                        ? p.destination
                        : typeTitle;
                    return (
                      <div
                        className="col-md-4 col-sm-6"
                        key={p._id || slug || i}
                      >
                        <ScrollReveal delay={i * 60}>
                          <Link
                            to={`/package/${type}/${slug}`}
                            className="itp-more-card"
                          >
                            <div className="itp-more-card-img-wrap">
                              <img
                                src={getCloudinaryUrl(cardImg, 520)}
                                alt={p.title || prettyLocationName(p.location)}
                                onError={(e) => {
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=520&q=80";
                                }}
                              />
                              {cardPrice > 0 && (
                                <span className="itp-more-card-badge">
                                  ₹{cardPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="itp-more-card-body">
                              <h3 className="itp-more-card-title">
                                {prettyLocationName(p.location) || p.title}
                              </h3>
                              <div className="itp-more-card-dest">
                                {cardDestSub}
                              </div>
                              <div className="itp-more-card-meta-row">
                                <span className="itp-more-card-rating">
                                  <FaStar size={11} color={BRAND.amber} />{" "}
                                  {p.rating
                                    ? p.rating.toFixed
                                      ? p.rating.toFixed(1)
                                      : p.rating
                                    : "New"}
                                </span>
                                {cardDurLabel && (
                                  <span className="itp-more-card-duration">
                                    <FaClock size={11} /> {cardDurLabel}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        </ScrollReveal>
                      </div>
                    );
                  })}
            </div>
          </div>
        </section>
      )}

      {/* ── Sticky mobile bar ── */}
      <div className="itp-sticky-bar px-4 py-2 align-items-center justify-content-between">
        <div>
          <div
            className="font-serif fw-bold"
            style={{ fontSize: "1.45rem", color: BRAND.primary }}
          >
            {livePrice > 0
              ? `₹${livePrice.toLocaleString()}`
              : "Price on request"}
          </div>
          <div style={{ fontSize: ".72rem", color: BRAND.meta }}>
            {selDur?.label || ""} · per person
          </div>
        </div>
        <button
          className="itp-btn-primary"
          style={{ width: "auto", padding: ".6rem 1.5rem", fontSize: ".88rem" }}
          onClick={() =>
            bookingRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
          }
        >
          Enquire Now →
        </button>
      </div>

      {lightboxOpen && imageSrcs.length > 0 && (
        <Lightbox
          images={imageSrcs}
          startIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}

      {/* ══ CONTRIBUTE MODAL ══ */}
      {contributeOpen && (
        <div
          className="position-fixed d-flex align-items-end align-items-sm-center justify-content-center p-0 p-sm-3"
          style={{
            inset: 0,
            background: "rgba(10,10,30,.55)",
            backdropFilter: "blur(6px)",
            zIndex: 1050,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setContributeOpen(false);
              setContributeDone(false);
            }
          }}
        >
          <div
            className="itp-modal-anim bg-white overflow-hidden d-flex flex-column"
            style={{
              borderRadius: "20px",
              width: "100%",
              maxWidth: 580,
              maxHeight: "90vh",
              boxShadow: "0 32px 80px rgba(0,0,0,.22)",
            }}
          >
            {!contributeDone ? (
              <>
                <div
                  className="p-4 pb-3"
                  style={{
                    borderBottom: `1px solid ${BRAND.borderLight}`,
                    background: BRAND.navy,
                  }}
                >
                  <button
                    onClick={() => {
                      setContributeOpen(false);
                      setContributeDone(false);
                    }}
                    style={{
                      position: "absolute",
                      top: "1.1rem",
                      right: "1.1rem",
                      width: 32,
                      height: 32,
                      background: "rgba(255,255,255,.12)",
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaTimes />
                  </button>
                  <div
                    className="font-serif fw-bold"
                    style={{ fontSize: "1.4rem", color: "#fff" }}
                  >
                    Share Your Experience
                  </div>
                  <div
                    style={{
                      fontSize: ".8rem",
                      color: "rgba(255,255,255,.55)",
                    }}
                  >
                    {pkg?.title || `${locationTitle} ${typeTitle}`}
                  </div>
                </div>
                <div className="p-4 overflow-auto" style={{ flex: 1 }}>
                  <div className="d-flex gap-2 mb-4">
                    {[
                      { key: "review", label: "⭐ Review" },
                      { key: "photo", label: "📷 Photo" },
                      { key: "qa", label: "❓ Question" },
                    ].map((t) => (
                      <button
                        key={t.key}
                        className={`itp-contribute-tab ${contributeTab === t.key ? "active" : ""}`}
                        onClick={() => setContributeTab(t.key)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  {contributeTab === "review" && (
                    <div>
                      <div className="mb-4">
                        <label
                          className="d-block fw-bold mb-2"
                          style={{ fontSize: ".82rem", color: BRAND.charcoal }}
                        >
                          Your Rating{" "}
                          <span style={{ color: BRAND.primary }}>*</span>
                        </label>
                        <div className="d-flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className="itp-star-pick"
                              onClick={() =>
                                setNewReview((r) => ({ ...r, rating: star }))
                              }
                              onMouseEnter={() =>
                                setNewReview((r) => ({
                                  ...r,
                                  hoverRating: star,
                                }))
                              }
                              onMouseLeave={() =>
                                setNewReview((r) => ({ ...r, hoverRating: 0 }))
                              }
                            >
                              <FaStar
                                size={28}
                                color={
                                  (newReview.hoverRating || newReview.rating) >=
                                  star
                                    ? BRAND.amber
                                    : BRAND.borderLight
                                }
                              />
                            </span>
                          ))}
                          {newReview.rating > 0 && (
                            <span
                              style={{
                                fontSize: ".82rem",
                                color: BRAND.meta,
                                alignSelf: "center",
                                marginLeft: 6,
                              }}
                            >
                              {
                                [
                                  "",
                                  "Terrible",
                                  "Poor",
                                  "Average",
                                  "Very Good",
                                  "Excellent",
                                ][newReview.rating]
                              }
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label
                          className="d-block fw-bold mb-1"
                          style={{ fontSize: ".82rem", color: BRAND.charcoal }}
                        >
                          Trip Type
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                          {[
                            "Solo",
                            "Couple",
                            "Family",
                            "Friends",
                            "Business",
                          ].map((t) => (
                            <button
                              key={t}
                              onClick={() =>
                                setNewReview((r) => ({ ...r, tripType: t }))
                              }
                              className="itp-mention-tag"
                              style={{
                                background:
                                  newReview.tripType === t
                                    ? BRAND.primary
                                    : "#fff",
                                color:
                                  newReview.tripType === t
                                    ? "#fff"
                                    : BRAND.bodyText,
                                borderColor:
                                  newReview.tripType === t
                                    ? BRAND.primary
                                    : BRAND.border,
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label
                          className="d-block fw-bold mb-1"
                          style={{ fontSize: ".82rem", color: BRAND.charcoal }}
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          className="itp-input"
                          placeholder="Summarise your experience"
                          value={newReview.title}
                          onChange={(e) =>
                            setNewReview((r) => ({
                              ...r,
                              title: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="d-block fw-bold mb-1"
                          style={{ fontSize: ".82rem", color: BRAND.charcoal }}
                        >
                          Your Review{" "}
                          <span style={{ color: BRAND.primary }}>*</span>
                        </label>
                        <textarea
                          className="itp-input"
                          rows={4}
                          placeholder="Tell others what made this trip special..."
                          value={newReview.text}
                          onChange={(e) =>
                            setNewReview((r) => ({
                              ...r,
                              text: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                  {contributeTab === "photo" && (
                    <div className="text-center py-4">
                      <div
                        style={{
                          border: `2px dashed ${BRAND.border}`,
                          borderRadius: 16,
                          padding: "2.5rem",
                          cursor: "pointer",
                        }}
                      >
                        <FaCamera
                          size={36}
                          color={BRAND.placeholder}
                          style={{ marginBottom: 12 }}
                        />
                        <div
                          className="fw-bold mb-1"
                          style={{ color: BRAND.charcoal }}
                        >
                          Upload your photos
                        </div>
                        <div style={{ fontSize: ".82rem", color: BRAND.meta }}>
                          JPG, PNG up to 10MB each
                        </div>
                        <button
                          className="itp-btn-primary mt-3"
                          style={{
                            width: "auto",
                            padding: ".55rem 1.5rem",
                            fontSize: ".85rem",
                          }}
                        >
                          Choose Photos
                        </button>
                      </div>
                    </div>
                  )}
                  {contributeTab === "qa" && (
                    <div>
                      <div className="mb-3">
                        <label
                          className="d-block fw-bold mb-1"
                          style={{ fontSize: ".82rem", color: BRAND.charcoal }}
                        >
                          Your Question{" "}
                          <span style={{ color: BRAND.primary }}>*</span>
                        </label>
                        <textarea
                          className="itp-input"
                          rows={4}
                          placeholder="What would you like to know about this package or destination?"
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                        />
                      </div>
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: BRAND.bgCard,
                          border: `1px solid ${BRAND.borderLight}`,
                          fontSize: ".78rem",
                          color: BRAND.meta,
                        }}
                      >
                        💡 Tip: Specific questions get answered faster. Include
                        details like travel dates, group type, or specific
                        concerns.
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className="px-4 py-3"
                  style={{ borderTop: `1px solid ${BRAND.borderLight}` }}
                >
                  <button
                    className="itp-btn-primary"
                    onClick={handleContributeSubmit}
                  >
                    {contributeTab === "review"
                      ? "✉️ Submit Review"
                      : contributeTab === "photo"
                        ? "📷 Upload Photos"
                        : "❓ Submit Question"}
                  </button>
                  <p
                    className="text-center mt-2 mb-0"
                    style={{ fontSize: ".73rem", color: BRAND.placeholder }}
                  >
                    Your contribution helps fellow travellers make better
                    decisions
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center p-5">
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>
                  🎉
                </div>
                <div
                  className="font-serif fw-bold mb-2"
                  style={{ fontSize: "1.6rem", color: BRAND.charcoal }}
                >
                  {contributeTab === "review"
                    ? "Review Submitted!"
                    : contributeTab === "photo"
                      ? "Photos Uploaded!"
                      : "Question Posted!"}
                </div>
                <p
                  style={{
                    fontSize: ".86rem",
                    color: BRAND.meta,
                    lineHeight: 1.7,
                    maxWidth: 340,
                    margin: "0 auto 1.5rem",
                  }}
                >
                  {contributeTab === "review"
                    ? "Your review has been added and will help other travellers decide."
                    : contributeTab === "photo"
                      ? "Your photos will appear after a quick review."
                      : "Your question has been posted. The community will answer soon!"}
                </p>
                <button
                  className="itp-btn-primary"
                  style={{ width: "auto", padding: ".75rem 2.5rem" }}
                  onClick={() => {
                    setContributeOpen(false);
                    setContributeDone(false);
                    setNewReview({
                      rating: 0,
                      hoverRating: 0,
                      title: "",
                      text: "",
                      tripType: "Family",
                    });
                    setNewQuestion("");
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ ENQUIRY MODAL ══ */}
      {enquiryOpen && (
        <div
          className="position-fixed d-flex align-items-end align-items-sm-center justify-content-center p-0 p-sm-3"
          style={{
            inset: 0,
            background: "rgba(10,10,30,.55)",
            backdropFilter: "blur(6px)",
            zIndex: 1050,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEnquiryOpen(false);
          }}
        >
          <div
            className="itp-modal-anim bg-white overflow-hidden d-flex flex-column"
            style={{
              borderRadius: "20px",
              width: "100%",
              maxWidth: 580,
              maxHeight: "92vh",
              boxShadow: "0 32px 80px rgba(0,0,0,.22)",
            }}
          >
            {!enquiryDone ? (
              <>
                <div
                  className="shrink-0 p-4 pb-3"
                  style={{
                    borderBottom: `1px solid ${BRAND.borderLight}`,
                    background: BRAND.navy,
                  }}
                >
                  <button
                    onClick={() => setEnquiryOpen(false)}
                    className="position-absolute border-0 d-flex align-items-center justify-content-center"
                    style={{
                      top: "1.1rem",
                      right: "1.1rem",
                      width: 32,
                      height: 32,
                      background: "rgba(255,255,255,.12)",
                      borderRadius: "50%",
                      cursor: "pointer",
                      color: "#fff",
                      zIndex: 1,
                    }}
                  >
                    <FaTimes />
                  </button>
                  <div
                    className="font-serif fw-bold"
                    style={{ fontSize: "1.5rem", color: "#fff" }}
                  >
                    Submit Enquiry
                  </div>
                  <div
                    style={{
                      fontSize: ".82rem",
                      color: "rgba(255,255,255,.55)",
                    }}
                  >
                    {pkg?.title || `${locationTitle} ${typeTitle}`}
                    {selDur?.label ? ` · ${selDur.label}` : ""}
                  </div>
                </div>
                <div className="p-4 overflow-auto grow">
                  <div
                    className="rounded-3 p-3 mb-4"
                    style={{
                      background: "linear-gradient(135deg,#f7f9ff,#fdf5ff)",
                      border: "1px solid #e4e8ff",
                    }}
                  >
                    <div
                      className="fw-bold mb-2"
                      style={{ fontSize: ".92rem", color: BRAND.charcoal }}
                    >
                      📦 Package Summary
                    </div>
                    {[
                      ["Destination", enquiryForm.destination || locationTitle],
                      ["Tour Type", typeTitle],
                      selDur?.label && ["Duration", selDur.label],
                      livePrice > 0 && [
                        "Price / person",
                        `₹${livePrice.toLocaleString()}`,
                      ],
                      ["Adults", enquiryForm.adults],
                      groupSizeDisplay && ["Group Size", groupSizeDisplay],
                    ]
                      .filter(Boolean)
                      .map(([k, v], i) => (
                        <div
                          key={i}
                          className="d-flex justify-content-between"
                          style={{
                            fontSize: ".8rem",
                            color: BRAND.meta,
                            padding: ".2rem 0",
                          }}
                        >
                          <span>{k}</span>
                          <span
                            className="fw-semibold"
                            style={{ color: BRAND.charcoal }}
                          >
                            {v}
                          </span>
                        </div>
                      ))}
                    {livePrice > 0 && (
                      <div
                        className="d-flex justify-content-between align-items-center pt-2 mt-1"
                        style={{ borderTop: "1px dashed #d8deff" }}
                      >
                        <span
                          className="fw-bold"
                          style={{ fontSize: ".82rem", color: BRAND.bodyText }}
                        >
                          {couponResult && !couponResult.message ? "Quoted Total (before discount)" : "Quoted Total"}
                        </span>
                        <span
                          className="font-serif fw-bold"
                          style={{
                            fontSize: couponResult && !couponResult.message ? "1.1rem" : "1.45rem",
                            color: couponResult && !couponResult.message ? BRAND.meta : BRAND.primary,
                            textDecoration: couponResult && !couponResult.message ? "line-through" : "none",
                          }}
                        >
                          ₹{(livePrice * enquiryForm.adults).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {couponResult && !couponResult.message && (
                      <>
                        <div className="d-flex justify-content-between align-items-center" style={{ fontSize: ".82rem", color: "#1a7a37" }}>
                          <span>Coupon ({couponResult.code}) applied</span>
                          <span className="fw-semibold">-₹{couponResult.discount.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center pt-1">
                          <span className="fw-bold" style={{ fontSize: ".82rem", color: BRAND.bodyText }}>Final Total</span>
                          <span className="font-serif fw-bold" style={{ fontSize: "1.45rem", color: BRAND.primary }}>
                            ₹{Math.max(0, livePrice * enquiryForm.adults - couponResult.discount).toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* ── Offers & Coupon Code ── */}
                  <div
                    className="rounded-3 p-3 mb-4"
                    style={{ background: "#fff8e6", border: "1px solid #ffe4a1" }}
                  >
                    <div className="fw-bold mb-2" style={{ fontSize: ".92rem", color: BRAND.charcoal }}>
                      🎟️ Offers & Coupons
                    </div>

                    {availableCoupons.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {availableCoupons.map((c) => (
                          <button
                            key={c._id || c.code}
                            type="button"
                            onClick={() => checkCoupon(c.code)}
                            disabled={couponChecking}
                            style={{
                              border: `1.5px dashed ${couponResult?.code === c.code && !couponResult?.message ? "#1a7a37" : "#d97706"}`,
                              background: couponResult?.code === c.code && !couponResult?.message ? "#eaffef" : "#fff",
                              color: couponResult?.code === c.code && !couponResult?.message ? "#1a7a37" : "#d97706",
                              borderRadius: 8,
                              padding: "5px 10px",
                              fontSize: ".76rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            {c.code} — {c.discountType === "percent" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponResult(null); }}
                        className="form-control"
                        style={{ fontSize: ".85rem" }}
                      />
                      <button
                        type="button"
                        onClick={() => checkCoupon()}
                        disabled={!couponCode.trim() || couponChecking}
                        style={{
                          background: BRAND.primary, color: "#fff", border: "none",
                          borderRadius: 8, padding: "0 18px", fontSize: ".82rem", fontWeight: 600,
                          cursor: "pointer", whiteSpace: "nowrap",
                        }}
                      >
                        {couponChecking ? "Checking…" : "Apply"}
                      </button>
                    </div>
                    {couponResult?.message && (
                      <div style={{ color: "#c62828", fontSize: ".78rem", marginTop: 6 }}>{couponResult.message}</div>
                    )}
                  </div>

                  {enquiryError && (
                    <div
                      className="rounded-3 p-3 mb-3"
                      style={{
                        background: "#FFF0F0",
                        border: "1px solid #FFD0D0",
                        fontSize: ".82rem",
                        color: "#c62828",
                      }}
                    >
                      ⚠️ {enquiryError}
                    </div>
                  )}
                  <p
                    style={{
                      fontSize: ".72rem",
                      color: BRAND.placeholder,
                      marginBottom: ".85rem",
                    }}
                  >
                    <span style={{ color: BRAND.primary }}>*</span> Required
                    fields
                  </p>
                  <form id="enquiry-form" onSubmit={handleEnquirySubmit}>
                    <div className="row g-3">
                      {[
                        {
                          col: "col-6",
                          label: "Full Name",
                          req: true,
                          icon: <FaUser size={11} className="itp-input-icon" />,
                          type: "text",
                          ph: "Your full name",
                          key: "fullName",
                        },
                        {
                          col: "col-6",
                          label: "Mobile",
                          req: true,
                          icon: (
                            <FaMobileAlt size={11} className="itp-input-icon" />
                          ),
                          type: "tel",
                          ph: "10-digit number",
                          key: "mobile",
                          pattern: "[0-9]{10}",
                        },
                        {
                          col: "col-6",
                          label: "Email",
                          req: true,
                          icon: (
                            <FaEnvelope size={11} className="itp-input-icon" />
                          ),
                          type: "email",
                          ph: "you@email.com",
                          key: "email",
                        },
                        {
                          col: "col-6",
                          label: "Your City",
                          req: false,
                          icon: <FaCity size={11} className="itp-input-icon" />,
                          type: "text",
                          ph: "Travelling from",
                          key: "city",
                        },
                        {
                          col: "col-12",
                          label: "Destination",
                          req: true,
                          icon: (
                            <FaMapMarkerAlt
                              size={11}
                              className="itp-input-icon"
                            />
                          ),
                          type: "text",
                          ph: "Travel destination",
                          key: "destination",
                        },
                      ].map((f) => (
                        <div key={f.key} className={f.col}>
                          <label
                            className="d-block text-uppercase fw-bold mb-1"
                            style={{
                              fontSize: ".72rem",
                              color: BRAND.placeholder,
                              letterSpacing: ".06em",
                            }}
                          >
                            {f.label}{" "}
                            {f.req && (
                              <span style={{ color: BRAND.primary }}>*</span>
                            )}
                          </label>
                          <div className="itp-input-group">
                            {f.icon}
                            <input
                              type={f.type}
                              className="itp-input"
                              placeholder={f.ph}
                              required={f.req}
                              pattern={f.pattern}
                              value={enquiryForm[f.key]}
                              onChange={(e) =>
                                setEnquiryForm((fm) => ({
                                  ...fm,
                                  [f.key]: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      ))}
                      <div className="col-6">
                        <label
                          className="d-block text-uppercase fw-bold mb-1"
                          style={{
                            fontSize: ".72rem",
                            color: BRAND.placeholder,
                            letterSpacing: ".06em",
                          }}
                        >
                          Travel Date
                        </label>
                        <div className="itp-input-group">
                          <FaCalendarAlt size={11} className="itp-input-icon" />
                          <input
                            type="date"
                            className="itp-input"
                            min={new Date().toISOString().split("T")[0]}
                            value={enquiryForm.travelDate}
                            onChange={(e) =>
                              setEnquiryForm((f) => ({
                                ...f,
                                travelDate: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <label
                          className="d-block text-uppercase fw-bold mb-1"
                          style={{
                            fontSize: ".72rem",
                            color: BRAND.placeholder,
                            letterSpacing: ".06em",
                          }}
                        >
                          Adults <span style={{ color: BRAND.primary }}>*</span>
                        </label>
                        <div className="itp-counter">
                          <button
                            type="button"
                            className="itp-counter-btn"
                            onClick={() =>
                              setEnquiryForm((f) => {
                                const n = Math.max(1, f.adults - 1);
                                return { ...f, adults: n, travelers: n };
                              })
                            }
                          >
                            −
                          </button>
                          <span
                            className="fw-bold"
                            style={{ color: BRAND.charcoal }}
                          >
                            {enquiryForm.adults}
                          </span>
                          <button
                            type="button"
                            className="itp-counter-btn"
                            onClick={() =>
                              setEnquiryForm((f) => {
                                const n = Math.min(20, f.adults + 1);
                                return { ...f, adults: n, travelers: n };
                              })
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-12">
                        <label
                          className="d-block text-uppercase fw-bold mb-1"
                          style={{
                            fontSize: ".72rem",
                            color: BRAND.placeholder,
                            letterSpacing: ".06em",
                          }}
                        >
                          Special Requests / Notes
                        </label>
                        <div
                          className="itp-input-group"
                          style={{ alignItems: "flex-start" }}
                        >
                          <FaStickyNote
                            size={11}
                            className="itp-input-icon"
                            style={{ top: 14, transform: "none" }}
                          />
                          <textarea
                            className="itp-input"
                            rows={3}
                            placeholder="Dietary requirements, preferred hotels, special occasions..."
                            value={enquiryForm.notes}
                            onChange={(e) =>
                              setEnquiryForm((f) => ({
                                ...f,
                                notes: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div
                  className="px-4 py-3 shrink-0"
                  style={{ borderTop: `1px solid ${BRAND.borderLight}` }}
                >
                  <button
                    type="submit"
                    form="enquiry-form"
                    className="itp-btn-primary"
                    disabled={enquiryLoading}
                  >
                    {enquiryLoading ? "Submitting..." : "✉️  Submit Enquiry"}
                  </button>
                  <p
                    className="text-center mt-2 mb-0"
                    style={{ fontSize: ".73rem", color: BRAND.placeholder }}
                  >
                    Your details are safe with us · No spam, ever
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center p-5">
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>
                  🎉
                </div>
                <div
                  className="font-serif fw-bold mb-2"
                  style={{ fontSize: "1.7rem", color: BRAND.charcoal }}
                >
                  Enquiry Submitted!
                </div>
                <p
                  style={{
                    fontSize: ".86rem",
                    color: BRAND.meta,
                    lineHeight: 1.7,
                    maxWidth: 380,
                    margin: "0 auto 1.25rem",
                  }}
                >
                  Our travel expert will call you within 30 minutes. A
                  confirmation has been sent to{" "}
                  <strong style={{ color: BRAND.charcoal }}>
                    {enquiryForm.email}
                  </strong>
                  .
                </p>
                <div
                  className="d-inline-block rounded-3 px-4 py-2 mb-3"
                  style={{
                    background: BRAND.bgCard,
                    fontSize: ".79rem",
                    color: "#3D52A0",
                    fontWeight: 600,
                  }}
                >
                  📋 Ref: ENQ-{Date.now().toString(36).toUpperCase()}
                </div>
                <div
                  className="d-flex align-items-center justify-content-center gap-2 mb-4"
                  style={{ fontSize: ".76rem", color: BRAND.placeholder }}
                >
                  <FaPrint size={11} /> Your full itinerary is saved — print
                  option coming soon
                </div>
                <button
                  className="itp-btn-primary"
                  style={{ width: "auto", padding: ".75rem 2.5rem" }}
                  onClick={() => setEnquiryOpen(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ COMPARE MODAL ══ */}
      {compareOpen &&
        (() => {
          const getPkgDur = (p, idx) => {
            const durs =
              Array.isArray(p.durations) && p.durations.length
                ? p.durations
                : null;
            if (durs) return durs[Math.min(idx, durs.length - 1)];
            return {
              price: p.price,
              discountedPrice: null,
              label: p.duration || "—",
              days: p.durationDays,
              nights: null,
            };
          };
          if (compareScope === "duration") {
            const cols = durationOptions;
            const rows = [
              {
                label: "Duration",
                render: (_p, d) => (
                  <strong style={{ color: BRAND.charcoal }}>
                    {d?.label || "—"}
                  </strong>
                ),
              },
              {
                label: "Price / person",
                render: (_p, d) => {
                  const price =
                    d?.discountedPrice ?? d?.price ?? pkg?.price ?? 0;
                  const original = d?.originalPrice ?? pkg?.strikePrice;
                  return (
                    <div>
                      <span
                        className="font-serif fw-bold"
                        style={{ fontSize: "1.3rem", color: BRAND.primary }}
                      >
                        ₹{price.toLocaleString()}
                      </span>
                      {original && original > price && (
                        <div
                          style={{
                            fontSize: ".67rem",
                            color: BRAND.placeholder,
                            textDecoration: "line-through",
                          }}
                        >
                          ₹{original.toLocaleString()}
                        </div>
                      )}
                    </div>
                  );
                },
              },
              {
                label: "Nights / Days",
                render: (_p, d) =>
                  d?.nights
                    ? `${d.nights}N / ${d.days}D`
                    : d?.days
                      ? `${d.days} Days`
                      : "—",
              },
              { label: "Hotels", render: () => pkg?.hotelRating || "3★ / 4★" },
              {
                label: "Meals",
                render: () => pkg?.meals || "As per itinerary",
              },
              {
                label: "Transport",
                render: () => pkg?.transport || "Private AC Vehicle",
              },
              { label: "Group Size", render: () => groupSizeDisplay || "—" },
              {
                label: "Rating",
                render: () => (pkg?.rating ? `⭐ ${pkg.rating}` : "—"),
              },
            ];
            return (
              <div
                className="position-fixed d-flex align-items-center justify-content-center p-3"
                style={{
                  inset: 0,
                  background: "rgba(10,10,30,.62)",
                  backdropFilter: "blur(6px)",
                  zIndex: 1060,
                  overflowY: "auto",
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setCompareOpen(false);
                }}
              >
                <div
                  className="bg-white rounded-4 itp-modal-anim d-flex flex-column"
                  style={{
                    width: "100%",
                    maxWidth: 1000,
                    maxHeight: "88vh",
                    boxShadow: "0 40px 100px rgba(0,0,0,.28)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="d-flex align-items-start justify-content-between p-4 pb-3 shrink-0 flex-wrap gap-2"
                    style={{
                      borderBottom: `1px solid ${BRAND.borderLight}`,
                      background: BRAND.navy,
                    }}
                  >
                    <div>
                      <div
                        className="font-serif fw-bold"
                        style={{ fontSize: "1.45rem", color: "#fff" }}
                      >
                        ⚖️ Compare Durations
                      </div>
                      <div
                        style={{
                          fontSize: ".74rem",
                          color: "rgba(255,255,255,.5)",
                        }}
                      >
                        {pkg?.title || `${locationTitle} ${typeTitle}`} — all
                        available options
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setCompareScope("city");
                          setCompareSelected(pkg?._id ? [pkg._id] : []);
                        }}
                        className="btn btn-sm rounded-pill fw-bold"
                        style={{
                          background: "rgba(255,255,255,.12)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,.2)",
                          fontSize: ".78rem",
                        }}
                      >
                        📍 {locationTitle} Packages
                      </button>
                      <button
                        onClick={() => {
                          setCompareScope("all");
                          setCompareSelected(pkg?._id ? [pkg._id] : []);
                        }}
                        className="btn btn-sm rounded-pill"
                        style={{
                          background: "rgba(255,255,255,.08)",
                          color: "rgba(255,255,255,.7)",
                          border: "1px solid rgba(255,255,255,.15)",
                          fontSize: ".78rem",
                        }}
                      >
                        🌏 All Cities
                      </button>
                      <button
                        onClick={() => setCompareOpen(false)}
                        className="d-flex align-items-center justify-content-center border-0"
                        style={{
                          width: 32,
                          height: 32,
                          background: "rgba(255,255,255,.12)",
                          borderRadius: "50%",
                          cursor: "pointer",
                          color: "#fff",
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                  <div className="grow overflow-auto">
                    {cols.length === 0 ? (
                      <div
                        className="text-center p-5"
                        style={{ color: BRAND.meta }}
                      >
                        Only one duration available.
                      </div>
                    ) : (
                      <table
                        className="table table-bordered mb-0"
                        style={{ minWidth: "100%", tableLayout: "auto" }}
                      >
                        <thead>
                          <tr style={{ background: BRAND.bgCard }}>
                            <th
                              style={{
                                width: 130,
                                fontSize: ".7rem",
                                fontWeight: 700,
                                color: BRAND.placeholder,
                                textTransform: "uppercase",
                                letterSpacing: ".06em",
                                textAlign: "left",
                                background: BRAND.borderLight,
                                position: "sticky",
                                left: 0,
                                zIndex: 3,
                              }}
                            >
                              Feature
                            </th>
                            {cols.map((d, i) => (
                              <th
                                key={i}
                                className="text-center"
                                style={{
                                  minWidth: 170,
                                  background:
                                    _safeIdx === i
                                      ? "rgba(240,75,90,.06)"
                                      : BRAND.bgCard,
                                  fontSize: ".82rem",
                                  fontWeight: 700,
                                  color: BRAND.charcoal,
                                }}
                              >
                                <span className="d-block">{d.label}</span>
                                <span
                                  className="d-block fw-normal"
                                  style={{
                                    fontSize: ".72rem",
                                    color: BRAND.placeholder,
                                  }}
                                >
                                  ₹
                                  {(
                                    d.discountedPrice ??
                                    d.price ??
                                    pkg?.price ??
                                    0
                                  ).toLocaleString()}{" "}
                                  / person
                                </span>
                                {_safeIdx === i && (
                                  <span
                                    className="badge mt-1"
                                    style={{
                                      background: "#E8F5E9",
                                      color: "#2E7D32",
                                      fontSize: ".67rem",
                                    }}
                                  >
                                    Selected
                                  </span>
                                )}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row) => (
                            <tr key={row.label}>
                              <td
                                className="fw-semibold"
                                style={{
                                  fontSize: ".78rem",
                                  color: BRAND.meta,
                                  background: BRAND.bgCard,
                                  position: "sticky",
                                  left: 0,
                                  zIndex: 2,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {row.label}
                              </td>
                              {cols.map((d, i) => (
                                <td
                                  key={i}
                                  className="text-center"
                                  style={{
                                    background:
                                      _safeIdx === i
                                        ? "rgba(240,75,90,.04)"
                                        : "transparent",
                                    fontWeight: _safeIdx === i ? 600 : 400,
                                    fontSize: ".84rem",
                                    color: BRAND.bodyText,
                                  }}
                                >
                                  {row.render(pkg, d)}
                                </td>
                              ))}
                            </tr>
                          ))}
                          <tr>
                            <td
                              className="fw-semibold"
                              style={{
                                fontSize: ".78rem",
                                color: BRAND.meta,
                                background: BRAND.bgCard,
                                position: "sticky",
                                left: 0,
                              }}
                            >
                              Select
                            </td>
                            {cols.map((d, i) => (
                              <td
                                key={i}
                                className="text-center"
                                style={{
                                  background:
                                    _safeIdx === i
                                      ? "rgba(240,75,90,.04)"
                                      : "transparent",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setSelectedDurationIdx(i);
                                    setCompareOpen(false);
                                    bookingRef.current?.scrollIntoView({
                                      behavior: "smooth",
                                    });
                                  }}
                                  className="btn btn-sm rounded-pill fw-bold"
                                  style={{
                                    background:
                                      _safeIdx === i
                                        ? BRAND.primary
                                        : BRAND.borderLight,
                                    color: _safeIdx === i ? "#fff" : BRAND.meta,
                                    border: "none",
                                    fontSize: ".76rem",
                                  }}
                                >
                                  {_safeIdx === i ? "✓ Selected" : "Choose"}
                                </button>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            );
          }
          const visibleList =
            compareScope === "city"
              ? compareAllPkgs.filter(
                  (p) =>
                    (p.location || "").toLowerCase().replace(/\s+/g, "-") ===
                    (location || "").toLowerCase(),
                )
              : compareAllPkgs;
          const effectiveSelected =
            compareSelected.length === 0 && pkg?._id
              ? [pkg._id]
              : compareSelected;
          const selectedPkgs = visibleList.filter((p) =>
            effectiveSelected.includes(p._id),
          );
          const displayPkgs =
            selectedPkgs.length > 0
              ? selectedPkgs
              : pkg
                ? [
                    pkg,
                    ...visibleList.filter((p) => p._id !== pkg._id).slice(0, 2),
                  ]
                : visibleList.slice(0, 3);
          const allDurLabels = Array.from(
            new Set(
              displayPkgs.flatMap((p) =>
                Array.isArray(p.durations) && p.durations.length
                  ? p.durations.map((d) => d.label)
                  : [p.duration || selDur?.label || "3N / 4D"],
              ),
            ),
          );
          const safeCmpDurIdx = Math.min(
            compareDurIdx,
            Math.max(0, allDurLabels.length - 1),
          );
          const pkgRows = [
            {
              label: "Price / person",
              render: (p) => {
                const d = getPkgDur(p, safeCmpDurIdx);
                const price = d?.discountedPrice ?? d?.price ?? p.price ?? 0;
                const original = d?.originalPrice ?? p.strikePrice;
                return (
                  <div>
                    <span
                      className="font-serif fw-bold"
                      style={{ fontSize: "1.3rem", color: BRAND.primary }}
                    >
                      ₹{price.toLocaleString()}
                    </span>
                    {original && original > price && (
                      <div
                        style={{
                          fontSize: ".67rem",
                          color: BRAND.placeholder,
                          textDecoration: "line-through",
                        }}
                      >
                        ₹{original.toLocaleString()}
                      </div>
                    )}
                  </div>
                );
              },
            },
            {
              label: "Destination",
              render: (p) => p.location || p.locationTitle || "—",
            },
            {
              label: "Duration",
              render: (p) =>
                getPkgDur(p, safeCmpDurIdx)?.label || p.duration || "—",
            },
            {
              label: "Nights / Days",
              render: (p) => {
                const d = getPkgDur(p, safeCmpDurIdx);
                return d?.nights
                  ? `${d.nights}N / ${d.days}D`
                  : d?.days
                    ? `${d.days} Days`
                    : "—";
              },
            },
            {
              label: "Rating",
              render: (p) =>
                p.rating ? `⭐ ${p.rating} (${p.reviews || 0})` : "—",
            },
            { label: "Hotels", render: (p) => p.hotelRating || "3★ / 4★" },
            {
              label: "Group Size",
              render: (p) => {
                const gs = p.groupSize;
                if (Array.isArray(gs) && gs.length > 1)
                  return `${gs[0]} – ${gs[gs.length - 1]} pax`;
                if (Array.isArray(gs) && gs.length === 1) return gs[0];
                return gs || "—";
              },
            },
            { label: "Meals", render: (p) => p.meals || "As per itinerary" },
            {
              label: "Transport",
              render: (p) => p.transport || "Private AC Vehicle",
            },
            {
              label: "Inclusions",
              render: (p) => `${(p.inclusions || inclusions).length} items`,
            },
          ];
          return (
            <div
              className="position-fixed d-flex align-items-end align-items-md-center justify-content-center"
              style={{
                inset: 0,
                background: "rgba(10,10,30,.62)",
                backdropFilter: "blur(6px)",
                zIndex: 1060,
                overflowY: "auto",
                padding: "1rem",
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setCompareOpen(false);
              }}
            >
              <div
                className="bg-white rounded-4 itp-modal-anim d-flex flex-column"
                style={{
                  width: "100%",
                  maxWidth: 1000,
                  maxHeight: "88vh",
                  boxShadow: "0 40px 100px rgba(0,0,0,.28)",
                  overflow: "hidden",
                }}
              >
                <div
                  className="d-flex align-items-start justify-content-between p-4 pb-3 shrink-0 flex-wrap gap-2"
                  style={{
                    borderBottom: `1px solid ${BRAND.borderLight}`,
                    background: BRAND.navy,
                  }}
                >
                  <div>
                    <div
                      className="font-serif fw-bold"
                      style={{ fontSize: "1.45rem", color: "#fff" }}
                    >
                      ⚖️ Compare {typeTitle} Packages
                    </div>
                    <div
                      style={{
                        fontSize: ".74rem",
                        color: "rgba(255,255,255,.5)",
                      }}
                    >
                      {compareScope === "city"
                        ? `${visibleList.length} package${visibleList.length !== 1 ? "s" : ""} in ${locationTitle}`
                        : `${visibleList.length} package${visibleList.length !== 1 ? "s" : ""} across all cities`}
                      {" · tap to select up to 3"}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setCompareScope("duration")}
                      className="btn btn-sm rounded-pill"
                      style={{
                        background: "rgba(255,255,255,.12)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,.2)",
                        fontSize: ".78rem",
                      }}
                    >
                      ← Duration Compare
                    </button>
                    <div
                      className="d-flex rounded-pill p-1"
                      style={{ background: "rgba(255,255,255,.08)" }}
                    >
                      {[
                        { key: "city", label: `📍 ${locationTitle}` },
                        { key: "all", label: "🌏 All Cities" },
                      ].map((s) => (
                        <button
                          key={s.key}
                          className={`itp-scope-btn ${compareScope === s.key ? "active" : ""}`}
                          style={
                            compareScope === s.key
                              ? { background: "#fff", color: BRAND.charcoal }
                              : { color: "rgba(255,255,255,.65)" }
                          }
                          onClick={() => {
                            setCompareScope(s.key);
                            setCompareSelected(pkg?._id ? [pkg._id] : []);
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCompareOpen(false)}
                      className="d-flex align-items-center justify-content-center border-0"
                      style={{
                        width: 32,
                        height: 32,
                        background: "rgba(255,255,255,.12)",
                        borderRadius: "50%",
                        cursor: "pointer",
                        color: "#fff",
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
                {compareLoading ? (
                  <div className="p-4">
                    <Skel h={38} mb={10} r={50} w="280px" />
                    <Skel h={48} mb={8} r={10} />
                    <Skel h={48} mb={8} r={10} />
                    <Skel h={48} mb={8} r={10} />
                  </div>
                ) : (
                  <>
                    <div
                      className="px-4 py-3 shrink-0"
                      style={{ borderBottom: `1px solid ${BRAND.borderLight}` }}
                    >
                      <div
                        className="text-uppercase fw-bold mb-2"
                        style={{
                          fontSize: ".72rem",
                          color: BRAND.placeholder,
                          letterSpacing: ".07em",
                        }}
                      >
                        Choose packages to compare (up to 3)
                      </div>
                      {visibleList.length === 0 ? (
                        <div
                          style={{
                            fontSize: ".82rem",
                            color: BRAND.placeholder,
                          }}
                        >
                          {compareScope === "city"
                            ? `No packages found for ${locationTitle}. Switch to "🌏 All Cities".`
                            : "No packages found for this tour type."}
                        </div>
                      ) : (
                        <div className="d-flex flex-wrap gap-2">
                          {visibleList.map((p) => {
                            const isSelected = effectiveSelected.includes(
                              p._id,
                            );
                            const isCurrent = p._id === pkg?._id;
                            const label =
                              compareScope === "all"
                                ? p.location || p.title || "Package"
                                : p.durations?.[0]?.label ||
                                  p.duration ||
                                  p.title ||
                                  p.location ||
                                  "Package";
                            return (
                              <button
                                key={p._id}
                                className={`itp-cmp-pkg-chip ${isSelected ? "selected" : ""}`}
                                onClick={() =>
                                  setCompareSelected((prev) => {
                                    const cur =
                                      prev.length === 0 && pkg?._id
                                        ? [pkg._id]
                                        : prev;
                                    if (cur.includes(p._id))
                                      return cur.filter((x) => x !== p._id);
                                    if (cur.length >= 3) return cur;
                                    return [...cur, p._id];
                                  })
                                }
                                disabled={
                                  !isSelected && effectiveSelected.length >= 3
                                }
                              >
                                {isSelected && (
                                  <FaCheck
                                    size={9}
                                    style={{ marginRight: 4 }}
                                  />
                                )}
                                {label}
                                {isCurrent && (
                                  <span
                                    style={{
                                      fontSize: ".64rem",
                                      opacity: 0.65,
                                    }}
                                  >
                                    {" "}
                                    (current)
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {displayPkgs.length > 0 && allDurLabels.length > 1 && (
                      <div
                        className="px-4 py-2 d-flex align-items-center gap-2 flex-wrap shrink-0"
                        style={{
                          borderBottom: `1px solid ${BRAND.borderLight}`,
                          background: BRAND.bgCard,
                        }}
                      >
                        <span
                          className="text-uppercase fw-bold"
                          style={{
                            fontSize: ".7rem",
                            color: BRAND.placeholder,
                            letterSpacing: ".06em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          By Duration:
                        </span>
                        {allDurLabels.map((lbl, i) => (
                          <button
                            key={lbl}
                            className={`itp-cmp-dur-tab ${safeCmpDurIdx === i ? "active" : ""}`}
                            onClick={() => setCompareDurIdx(i)}
                          >
                            {lbl}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="grow overflow-auto">
                      {displayPkgs.length < 1 ? (
                        <div
                          className="text-center p-5"
                          style={{ color: BRAND.meta }}
                        >
                          Select packages above to compare them side by side.
                        </div>
                      ) : (
                        <table
                          className="table table-bordered mb-0"
                          style={{ minWidth: "100%", tableLayout: "auto" }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  width: 130,
                                  fontSize: ".7rem",
                                  fontWeight: 700,
                                  color: BRAND.placeholder,
                                  textTransform: "uppercase",
                                  letterSpacing: ".06em",
                                  textAlign: "left",
                                  background: BRAND.borderLight,
                                  position: "sticky",
                                  left: 0,
                                  zIndex: 3,
                                }}
                              >
                                Feature
                              </th>
                              {displayPkgs.map((p) => (
                                <th
                                  key={p._id}
                                  className="text-center"
                                  style={{
                                    minWidth: 170,
                                    background:
                                      p._id === pkg?._id
                                        ? "rgba(240,75,90,.06)"
                                        : BRAND.bgCard,
                                    fontSize: ".82rem",
                                    fontWeight: 700,
                                    color: BRAND.charcoal,
                                  }}
                                >
                                  <span className="d-block">
                                    {p.location || p.title || "Package"}
                                  </span>
                                  <span
                                    className="d-block fw-normal"
                                    style={{
                                      fontSize: ".72rem",
                                      color: BRAND.placeholder,
                                    }}
                                  >
                                    {getPkgDur(p, safeCmpDurIdx)?.label ||
                                      p.duration ||
                                      "—"}
                                  </span>
                                  {p._id === pkg?._id && (
                                    <span
                                      className="badge mt-1"
                                      style={{
                                        background: "#E8F5E9",
                                        color: "#2E7D32",
                                        fontSize: ".67rem",
                                      }}
                                    >
                                      Viewing
                                    </span>
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {pkgRows.map((row) => (
                              <tr key={row.label}>
                                <td
                                  className="fw-semibold"
                                  style={{
                                    fontSize: ".78rem",
                                    color: BRAND.meta,
                                    background: BRAND.bgCard,
                                    position: "sticky",
                                    left: 0,
                                    zIndex: 2,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {row.label}
                                </td>
                                {displayPkgs.map((p) => (
                                  <td
                                    key={p._id}
                                    className="text-center"
                                    style={{
                                      background:
                                        p._id === pkg?._id
                                          ? "rgba(240,75,90,.04)"
                                          : "transparent",
                                      fontSize: ".84rem",
                                      color: BRAND.bodyText,
                                    }}
                                  >
                                    {row.render(p)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                            <tr>
                              <td
                                className="fw-semibold"
                                style={{
                                  fontSize: ".78rem",
                                  color: BRAND.meta,
                                  background: BRAND.bgCard,
                                  position: "sticky",
                                  left: 0,
                                }}
                              >
                                Action
                              </td>
                              {displayPkgs.map((p) => (
                                <td
                                  key={p._id}
                                  className="text-center"
                                  style={{
                                    background:
                                      p._id === pkg?._id
                                        ? "rgba(240,75,90,.04)"
                                        : "transparent",
                                  }}
                                >
                                  {p._id === pkg?._id ? (
                                    <span
                                      className="fw-bold"
                                      style={{
                                        color: BRAND.primary,
                                        fontSize: ".78rem",
                                      }}
                                    >
                                      ✓ Current
                                    </span>
                                  ) : (
                                    <Link
                                      to={`/package/${type}/${(p.location || "").toLowerCase().replace(/\s+/g, "-") || p._id}`}
                                      className="btn btn-sm rounded-pill fw-bold"
                                      style={{
                                        color: BRAND.primary,
                                        border: `1.5px solid ${BRAND.primary}`,
                                        background: "transparent",
                                        fontSize: ".78rem",
                                      }}
                                      onClick={() => setCompareOpen(false)}
                                    >
                                      View →
                                    </Link>
                                  )}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })()}
    </>
  );
}
