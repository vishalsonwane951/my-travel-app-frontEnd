import { useState, useRef, useCallback } from "react";

/* ------------------------------------------------------------------
   Hotel card — photo carousel, ribbon, rating stamp, checkmark
   amenities, rooms-left / discount pill, price block with
   strike-through + taxes note. Keyboard-operable as a whole (Enter /
   Space selects), with independent controls for save and slide dots.
------------------------------------------------------------------- */

function initials(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "SF";
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

// Amenities that render as a green checkmark pill (headline perks)
const CHECK_AMENITY_KEYS = new Set([
  "breakfast",
  "wifi",
  "freeCancellation",
  "cancellation",
]);

const AMENITY_ICON = {
  wifi: "📶",
  breakfast: "☕",
  restaurant: "🍽",
  restaurants: "🍽",
  roomService: "🔔",
  parking: "🅿",
  ac: "❄",
  airConditioned: "❄",
  fitness: "🏋",
  accessible: "♿",
  poolsideBar: "🍹",
  housekeeping: "🧹",
  cctv: "🎥",
  freeCancellation: "✓",
  cancellation: "✓",
  default: "•",
};

const RIBBON_STYLES = {
  "Exclusive Deal": { className: "ribbon ribbon-green", icon: "🏷" },
  Trending: { className: "ribbon ribbon-purple", icon: "📈" },
  "Couple Friendly": { className: "ribbon ribbon-pink", icon: "💑" },
};

function Stars({ count = 0 }) {
  if (!count) return null;
  const n = Math.max(0, Math.min(5, Math.round(count)));
  return (
    <span className="stay-row-stars" aria-label={`${n} star`}>
      {"★".repeat(n)}
    </span>
  );
}

function TaglineIcon() {
  return (
    <svg
      className="tagline-icon"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden="true"
    >
      <rect x="0" y="2" width="4" height="10" rx="1" fill="#f59e0b" />
      <rect x="5" y="0" width="4" height="12" rx="1" fill="#ef4444" />
      <rect x="10" y="3" width="4" height="9" rx="1" fill="#fbbf24" />
    </svg>
  );
}

export default function StayListItem({ item, checkIn, checkOut, onSelect }) {
  const {
    name,
    images = [],
    ribbon,
    starRating,
    location,
    distanceLabel,
    rating,
    amenities = [],
    tagline,
    roomsLeft,
    discountPercent,
    price,
    originalPrice,
    taxes,
  } = item || {};

  const [saved, setSaved] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);

  const handlePhotoScroll = useCallback((e) => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveSlide(idx);
  }, []);

  const goToSlide = useCallback((i) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setActiveSlide(i);
  }, []);

  const select = useCallback(() => onSelect?.(item), [onSelect, item]);

  const stampLabel = rating?.label || "";
  const ribbonStyle = ribbon ? RIBBON_STYLES[ribbon] : null;

  const checkAmenities = amenities.filter((a) => CHECK_AMENITY_KEYS.has(a.key));
  const infoAmenities = amenities.filter((a) => !CHECK_AMENITY_KEYS.has(a.key));

  return (
    <div
      className="stay-row"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name || "this stay"}`}
      onClick={select}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select();
        }
      }}
    >
      <div className="stay-row-photo">
        {images.length > 0 ? (
          <>
            <div
              className="stay-row-photo-scroll"
              ref={scrollRef}
              onScroll={handlePhotoScroll}
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, i) => (
                <img
                  key={img.url + i}
                  src={img.url}
                  alt={img.alt || `${name || "Hotel"} photo ${i + 1} of ${images.length}`}
                  className="stay-row-photo-img"
                  loading={i === 0 ? "eager" : "lazy"}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ))}
            </div>
            {images.length > 1 && (
              <div className="stay-row-dots" role="group" aria-label="Photo navigation">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="stay-row-dot-btn"
                    aria-label={`Show photo ${i + 1} of ${images.length}`}
                    aria-current={i === activeSlide}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(i);
                    }}
                  >
                    <span className={`stay-row-dot ${i === activeSlide ? "is-active" : ""}`} />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="stay-row-photo-fallback" aria-hidden="true">{initials(name)}</div>
        )}

        {ribbonStyle && (
          <span className={ribbonStyle.className}>
            <span className="ribbon-icon" aria-hidden="true">{ribbonStyle.icon}</span>
            {ribbon}
          </span>
        )}

        <button
          type="button"
          className={`save-btn ${saved ? "is-saved" : ""}`}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save"}
          onClick={(e) => {
            e.stopPropagation();
            setSaved((s) => !s);
          }}
        >
          <span aria-hidden="true">{saved ? "♥" : "♡"}</span>
        </button>

        {rating?.score != null && (
          <div className="stamp">
            <span className="stamp-num">{rating.score}</span>
            {stampLabel && <span className="stamp-label">{stampLabel}</span>}
            {rating?.count != null && (
              <span className="stamp-count">· {rating.count} Ratings</span>
            )}
          </div>
        )}
      </div>

      <div className="stay-row-body">
        <div className="stay-row-main">
          <div className="stay-row-heading">
            <h3 className="stay-row-title">{name}</h3>
            <Stars count={starRating} />
          </div>

          <p className="stay-row-location">
            {location}
            {distanceLabel ? ` · ${distanceLabel}` : ""}
          </p>

          {checkAmenities.length > 0 && (
            <div className="stay-row-checks">
              {checkAmenities.map((a, i) => (
                <span className="amenity-check" key={a.key || i}>
                  <span className="amenity-check-mark" aria-hidden="true">✓</span> {a.label}
                </span>
              ))}
            </div>
          )}

          {infoAmenities.length > 0 && (
            <div className="stay-row-info-amenities">
              {infoAmenities.map((a, i) => (
                <span className="amenity-info" key={a.key || i}>
                  <span aria-hidden="true">{AMENITY_ICON[a.key] || AMENITY_ICON.default}</span> {a.label}
                </span>
              ))}
            </div>
          )}

          {tagline && (
            <p className="stay-row-tagline">
              <TaglineIcon /> {tagline}
            </p>
          )}
        </div>

        <div className="stay-row-price-block">
          {roomsLeft != null ? (
            <span className="pill pill-urgent">
              {roomsLeft === 1 ? "Only 1 room left" : `${roomsLeft} rooms left`}
            </span>
          ) : discountPercent != null ? (
            <span className="pill pill-discount">{discountPercent}% off</span>
          ) : null}

          {originalPrice != null && (
            <span className="stay-row-price-strike">
              <span className="visually-hidden">Original price </span>
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          {price != null && (
            <span className="stay-row-price-current">
              <span className="visually-hidden">Current price </span>
              ₹{price.toLocaleString("en-IN")}
            </span>
          )}
          <span className="stay-row-qualifier">
            {taxes != null
              ? `+₹${taxes.toLocaleString("en-IN")} taxes & fees`
              : "per night"}
          </span>
          <span className="stay-row-qualifier-sub">per night, per room</span>

          <button
            type="button"
            className="book-btn"
            onClick={(e) => {
              e.stopPropagation();
              select();
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}