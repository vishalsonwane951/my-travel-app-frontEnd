import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api.js";

// ── Category meta (kept in sync with Maharashtra.jsx) ───────────────────────────
const CATEGORY_META = {
  essential: { label: "Essentials", icon: "⭐" },
  traveller: { label: "Travellers' Choice", icon: "🏆" },
  family: { label: "Family Friendly", icon: "👨‍👩‍👧‍👦" },
  hidden: { label: "Hidden Gems", icon: "💎" },
  museums: { label: "Museums", icon: "🏛️" },
  outdoors: { label: "Outdoors", icon: "🌿" },
  arts: { label: "Arts & Theatre", icon: "🎭" },
  nightlife: { label: "Night Life", icon: "🌙" },
};

const getCategoryMeta = (key) =>
  CATEGORY_META[key] || { label: key || "Maharashtra", icon: "📍" };

// ── Small hook: reveal-on-scroll, matches Maharashtra.jsx's .mh-reveal pattern ──
// Uses a callback ref so the observer attaches whenever the node actually mounts —
// important here since these elements don't exist yet during the loading-skeleton render.
const useReveal = (threshold = 0.1) => {
  const obsRef = useRef(null);

  const setRef = useCallback(
    (node) => {
      if (obsRef.current) {
        obsRef.current.disconnect();
        obsRef.current = null;
      }
      if (node) {
        const obs = new IntersectionObserver(
          ([e]) => {
            if (e.isIntersecting) node.classList.add("revealed");
          },
          { threshold },
        );
        obs.observe(node);
        obsRef.current = obs;
      }
    },
    [threshold],
  );

  return setRef;
};

// ── Skeleton state ───────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <div
        className="skeleton"
        style={{ height: "62vh", width: "100%", borderRadius: 0 }}
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem" }}>
        <div
          className="skeleton"
          style={{ height: 32, width: "40%", marginBottom: 18 }}
        />
        <div
          className="skeleton"
          style={{ height: 16, width: "85%", marginBottom: 10 }}
        />
        <div
          className="skeleton"
          style={{ height: 16, width: "70%", marginBottom: 10 }}
        />
        <div className="skeleton" style={{ height: 16, width: "60%" }} />
      </div>
    </div>
  );
}

// ── Rating stars ──────────────────────────────────────────────────────────────
function RatingStars({ rating = 0 }) {
  const full = Math.round(rating);
  return (
    <span style={{ letterSpacing: 2 }} aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            color: i <= full ? "var(--gold)" : "#e2e2ee",
            fontSize: "0.95rem",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const storyRef = useReveal(0.05);
  const planRef = useReveal(0.08);
  const reachRef = useReveal(0.08);
  const galleryRef = useReveal(0.08);
  const nearbyRef = useReveal(0.08);
  const relatedRef = useReveal(0.08);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setImgLoaded(false);

    const fetchLocation = async () => {
      try {
        const res = await api.get(`/maharashtra-cards/card/${id}`);
        const data = res?.data?.data;
        if (!active) return;

        if (!data) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setLocation(data);

        // Pull more from the same category to fill the "More like this" rail
        try {
          const relRes = await api.get(
            `/packages/maharashtra-cards/${data.category}`,
          );
          const list = Array.isArray(relRes?.data?.data)
            ? relRes.data.data
            : [];
          if (active) {
            setRelated(
              list.filter((item) => item._id !== data._id).slice(0, 4),
            );
          }
        } catch (relErr) {
          console.error("Related cards error:", relErr);
          if (active) setRelated([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Location fetch error:", err);
        if (active) {
          setNotFound(true);
          setLoading(false);
        }
      }
    };

    if (id) fetchLocation();
    else {
      setNotFound(true);
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [id]);

  if (loading)
    return (
      <>
        <DetailStyles />
        <DetailSkeleton />
      </>
    );

  if (notFound || !location)
    return (
      <>
        <DetailStyles />
      </>
    );

  const meta = getCategoryMeta(location.category);
  const isFree =
    !location.price || location.price === "₹0" || location.price === "0";

  // ── Derived flags for the new, optional content blocks ──
  // Every one of these is optional on older documents, so each section
  // only renders when the data is actually there.
  const hasEntryDetail =
    location.entryFee &&
    (location.entryFee.indianAdult ||
      location.entryFee.indianChild ||
      location.entryFee.foreignNational);
  const hasHowToReach =
    location.howToReach &&
    (location.howToReach.byRoad ||
      location.howToReach.byRail ||
      location.howToReach.byAir);
  const hasBestTime =
    location.bestTimeToVisit &&
    ((location.bestTimeToVisit.months &&
      location.bestTimeToVisit.months.length > 0) ||
      location.bestTimeToVisit.note);
  const hasHighlights = location.highlights && location.highlights.length > 0;
  const hasThingsToCarry =
    location.thingsToCarry && location.thingsToCarry.length > 0;
  const hasTravelTips = location.travelTips && location.travelTips.length > 0;
  const hasGallery = location.gallery && location.gallery.length > 0;
  const hasNearby =
    location.nearbyAttractions && location.nearbyAttractions.length > 0;
  const hasIdealFor = location.idealFor && location.idealFor.length > 0;
  const hasDistanceChips =
    location.distanceFromCity && location.distanceFromCity.length > 0;
  const hasPermitNotice =
    location.permitRequired && location.permitRequired.required;
  const hasPlanSection = hasBestTime || hasThingsToCarry || hasTravelTips;

  const mapsUrl =
    location.coordinates && location.coordinates.lat && location.coordinates.lng
      ? `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.location)}`;

  return (
    <>
      <DetailStyles />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="ld-hero">
        {!imgLoaded && (
          <div
            className="skeleton"
            style={{ position: "absolute", inset: 0, borderRadius: 0 }}
          />
        )}
        <img
          src={location.images}
          alt={location.title}
          onLoad={() => setImgLoaded(true)}
          className="ld-hero-img"
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />
        <div className="ld-hero-overlay" />

        {/* Back button */}
        <button onClick={() => navigate(-1)} className="ld-back-btn">
          ← Back
        </button>

        {/* Featured ribbon */}
        {location.featured && (
          <div className="ld-featured-badge">
            <span>★</span> Featured Pick
          </div>
        )}

        <div className="ld-hero-content">
          <Link
            to={`/maharashtra?category=${location.category}`}
            className="ld-category-chip"
          >
            <span>{meta.icon}</span> {meta.label}
          </Link>
          <h1 className="ld-hero-title">{location.title}</h1>
          <div className="ld-hero-meta">
            <span>📍 {location.location}</span>
            {location.rating != null && (
              <span className="ld-hero-rating">
                <RatingStars rating={location.rating} /> {location.rating}
                {location.reviewsCount > 0 && (
                  <span className="ld-review-count">
                    {" "}
                    ({location.reviewsCount.toLocaleString()} reviews)
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── BODY ────────────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--cream)", padding: "0 2rem 5rem" }}>
        <div ref={storyRef} className="ld-body-grid ld-reveal">
          {/* Left: story */}
          <div className="ld-story">
            <span className="ld-eyebrow">The Story</span>
            <h2 className="ld-story-title">
              A Glimpse Into {location.title.split(",")[0]}
            </h2>
            <p className="ld-description">
              {location.story || location.description}
            </p>

            {hasHighlights && (
              <ul className="ld-highlights">
                {location.highlights.map((h, i) => (
                  <li key={i}>
                    <span className="ld-highlight-mark">✦</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {hasIdealFor && (
              <div className="ld-ideal-row">
                <span className="ld-ideal-label">Perfect For</span>
                <div className="ld-ideal-pills">
                  {location.idealFor.map((tag, i) => (
                    <span key={i} className="ld-ideal-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {location.tags && location.tags.length > 0 && (
              <div className="ld-tags">
                {location.tags.map((tag, i) => (
                  <span key={i} className="ld-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="ld-cta-row">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ld-btn-primary"
              >
                Get Directions ↗
              </a>
              <Link to="/contact" className="ld-btn-secondary">
                Plan a Visit
              </Link>
            </div>
          </div>

          {/* Right: trip facts ticket */}
          <aside className="ld-ticket">
            <div className="ld-ticket-top">
              <span className="ld-ticket-label">Trip Facts</span>
              <h3 className="ld-ticket-name">{location.title}</h3>
            </div>

            <div className="ld-ticket-perf" />

            <div className="ld-ticket-rows">
              <div className="ld-ticket-row">
                <span className="ld-ticket-key">💰 Entry</span>
                <span className="ld-ticket-val">
                  {isFree ? "Free Entry" : location.price}
                </span>
              </div>
              <div className="ld-ticket-row">
                <span className="ld-ticket-key">⏱️ Suggested Time</span>
                <span className="ld-ticket-val">
                  {location.duration || "Flexible"}
                </span>
              </div>
              {location.openingHours && (
                <div className="ld-ticket-row">
                  <span className="ld-ticket-key">🕒 Hours</span>
                  <span className="ld-ticket-val">{location.openingHours}</span>
                </div>
              )}
              {location.closedOn && (
                <div className="ld-ticket-row">
                  <span className="ld-ticket-key">🚫 Closed</span>
                  <span className="ld-ticket-val">{location.closedOn}</span>
                </div>
              )}
              {location.difficultyLevel && (
                <div className="ld-ticket-row">
                  <span className="ld-ticket-key">🥾 Difficulty</span>
                  <span className="ld-ticket-val">
                    <span
                      className={`ld-difficulty-badge ld-difficulty-${location.difficultyLevel.toLowerCase()}`}
                    >
                      {location.difficultyLevel}
                    </span>
                  </span>
                </div>
              )}
              <div className="ld-ticket-row">
                <span className="ld-ticket-key">⭐ Rating</span>
                <span className="ld-ticket-val">
                  {location.rating != null
                    ? `${location.rating} / 5`
                    : "Not rated"}
                </span>
              </div>
              <div className="ld-ticket-row">
                <span className="ld-ticket-key">📍 Region</span>
                <span className="ld-ticket-val">{location.region}</span>
              </div>
              <div className="ld-ticket-row">
                <span className="ld-ticket-key">{meta.icon} Category</span>
                <span className="ld-ticket-val">{meta.label}</span>
              </div>
            </div>

            {hasEntryDetail && (
              <div className="ld-ticket-feenote">
                {location.entryFee.indianAdult && (
                  <span>
                    <strong>Indian Adult:</strong>{" "}
                    {location.entryFee.indianAdult}
                  </span>
                )}
                {location.entryFee.indianChild && (
                  <span>
                    {" "}
                    &nbsp;·&nbsp; <strong>Child:</strong>{" "}
                    {location.entryFee.indianChild}
                  </span>
                )}
                {location.entryFee.foreignNational && (
                  <span>
                    {" "}
                    &nbsp;·&nbsp; <strong>Foreign National:</strong>{" "}
                    {location.entryFee.foreignNational}
                  </span>
                )}
                {location.entryFee.notes && <em>{location.entryFee.notes}</em>}
              </div>
            )}

            <div className="ld-ticket-perf" />

            <div className="ld-ticket-foot">Admit one curious traveller</div>
          </aside>
        </div>
      </section>

      {/* ── PLAN YOUR VISIT ─────────────────────────────────────────────────── */}
      {hasPlanSection && (
        <section
          ref={planRef}
          className="ld-reveal"
          style={{ background: "white", padding: "1.5rem 2rem" }}
        >
          <div className="ld-section-head">
            <span className="ld-eyebrow">Plan Your Visit</span>
            <h2 className="ld-section-title">Make the Most of Your Trip</h2>
          </div>

          <div className="ld-plan-grid">
            {hasBestTime && (
              <div className="ld-plan-card">
                <span className="ld-plan-icon">🗓️</span>
                <h4 className="ld-plan-title">Best Time to Visit</h4>
                {location.bestTimeToVisit.months &&
                  location.bestTimeToVisit.months.length > 0 && (
                    <div className="ld-plan-months">
                      {location.bestTimeToVisit.months.map((m, i) => (
                        <span key={i} className="ld-month-chip">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                {location.bestTimeToVisit.note && (
                  <p className="ld-plan-note">
                    {location.bestTimeToVisit.note}
                  </p>
                )}
              </div>
            )}

            {hasThingsToCarry && (
              <div className="ld-plan-card">
                <span className="ld-plan-icon">🎒</span>
                <h4 className="ld-plan-title">Things to Carry</h4>
                <ul className="ld-plan-list">
                  {location.thingsToCarry.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {hasTravelTips && (
              <div className="ld-plan-card">
                <span className="ld-plan-icon">💡</span>
                <h4 className="ld-plan-title">Travel Tips</h4>
                <ul className="ld-plan-list">
                  {location.travelTips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── HOW TO REACH ────────────────────────────────────────────────────── */}
      {hasHowToReach && (
        <section
          ref={reachRef}
          className="ld-reveal"
          style={{ background: "var(--cream)", padding: "3.5rem 2rem" }}
        >
          <div className="ld-section-head">
            <span
              className="ld-eyebrow"
              style={{
                color: "var(--indigo)",
                background: "rgba(61,82,160,0.08)",
              }}
            >
              Getting There
            </span>
            <h2 className="ld-section-title">How to Reach</h2>
          </div>

          {hasPermitNotice && (
            <div className="ld-permit-notice">
              <span>⚠️</span>
              <span>
                {location.permitRequired.details ||
                  "A permit is required for entry."}
              </span>
            </div>
          )}

          <div className="ld-reach-grid">
            {location.howToReach.byRoad && (
              <div className="ld-reach-card">
                <span className="ld-reach-icon">🚗</span>
                <h4>By Road</h4>
                <p>{location.howToReach.byRoad}</p>
              </div>
            )}
            {location.howToReach.byRail && (
              <div className="ld-reach-card">
                <span className="ld-reach-icon">🚆</span>
                <h4>By Rail</h4>
                <p>{location.howToReach.byRail}</p>
              </div>
            )}
            {location.howToReach.byAir && (
              <div className="ld-reach-card">
                <span className="ld-reach-icon">✈️</span>
                <h4>By Air</h4>
                <p>{location.howToReach.byAir}</p>
              </div>
            )}
          </div>

          {hasDistanceChips && (
            <div className="ld-distance-row">
              {location.distanceFromCity.map((d, i) => (
                <span key={i} className="ld-distance-chip">
                  📏 {d.distanceKm} km from {d.city}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── GALLERY ─────────────────────────────────────────────────────────── */}
      {hasGallery && (
        <section
          ref={galleryRef}
          className="ld-reveal"
          style={{ background: "white", padding: "1.5rem 2rem" }}
        >
          <div className="ld-section-head">
            <span className="ld-eyebrow">In Pictures</span>
            <h2 className="ld-section-title">Gallery</h2>
          </div>
          <div className="ld-gallery-grid">
            {location.gallery.map((src, i) => (
              <a
                key={i}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="ld-gallery-img-wrap"
              >
                <img
                  src={src}
                  alt={`${location.title} photo ${i + 1}`}
                  loading="lazy"
                  className="ld-gallery-img"
                />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── NEARBY ATTRACTIONS ──────────────────────────────────────────────── */}
      {hasNearby && (
        <section
          ref={nearbyRef}
          className="ld-reveal"
          style={{ background: "var(--cream)", padding: "1.5rem 2rem" }}
        >
          <div className="ld-section-head">
            <span
              className="ld-eyebrow"
              style={{
                color: "var(--indigo)",
                background: "rgba(61,82,160,0.08)",
              }}
            >
              While You're Here
            </span>
            <h2 className="ld-section-title">Nearby Attractions</h2>
          </div>
          <div className="ld-nearby-scroll">
            {location.nearbyAttractions.map((n, i) => (
              <div key={i} className="ld-nearby-card">
                <span className="ld-nearby-icon">🧭</span>
                <h4>{n.name}</h4>
                <span className="ld-nearby-dist">{n.distanceKm} km away</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── MORE LIKE THIS ──────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          ref={relatedRef}
          className="ld-reveal"
          style={{ background: "white", padding: "4.5rem 2rem" }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="ld-related-head">
              <div>
                <span
                  className="ld-eyebrow"
                  style={{
                    color: "var(--indigo)",
                    background: "rgba(61,82,160,0.08)",
                  }}
                >
                  Keep Exploring
                </span>
                <h2 className="ld-related-title">More in {meta.label}</h2>
              </div>
              <Link
                to={`/maharashtra?category=${location.category}`}
                className="ld-view-all"
              >
                View All →
              </Link>
            </div>

            <div className="ld-related-grid">
              {related.map((card) => (
                <Link
                  to={`/locations/${card._id}`}
                  key={card._id}
                  className="ld-related-card"
                >
                  <div className="ld-related-img-wrap">
                    <img
                      src={card.images}
                      alt={card.title}
                      loading="lazy"
                      className="ld-related-img"
                    />
                  </div>
                  <div className="ld-related-body">
                    <h4>{card.title}</h4>
                    <span className="ld-related-loc">📍 {card.location}</span>
                    <span className="ld-related-price">
                      {card.price === "₹0" ? "Free" : card.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
function DetailStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

      :root {
        --gold: #C9A84C;
        --gold-light: #F0D080;
        --navy: #1a1a2e;
        --indigo: #3D52A0;
        --saffron: #FF6B35;
        --saffron-light: #FFB347;
        --cream: #FDFAF4;
        --font-display: 'Cormorant Garamond', serif;
        --font-body: 'DM Sans', sans-serif;
        --ease: cubic-bezier(0.4,0,0.2,1);
      }

      .skeleton {
        background: linear-gradient(90deg, #f0f0f8 25%, #e8e8f0 50%, #f0f0f8 75%);
        background-size: 200% 100%;
        animation: ldShimmer 1.4s infinite;
      }
      @keyframes ldShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

      .ld-reveal {
        opacity: 0;
        transform: translateY(26px);
        transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
      }
      .ld-reveal.revealed { opacity: 1; transform: translateY(0); }

      /* ── Hero ── */
      .ld-hero {
        position: relative;
        height: 62vh;
        min-height: 420px;
        width: 100%;
        overflow: hidden;
        background: var(--navy);
      }
      .ld-hero-img {
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        object-fit: cover;
        transition: opacity 0.5s var(--ease);
      }
      .ld-hero-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(10,10,25,0.15) 0%, rgba(10,10,25,0.35) 55%, rgba(10,10,25,0.92) 100%);
      }
      .ld-back-btn {
        position: absolute; top: 1.75rem; left: 1.75rem; z-index: 5;
        background: rgba(255,255,255,0.12);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.25);
        color: white;
        padding: 0.6rem 1.25rem;
        border-radius: 50px;
        font-family: var(--font-body);
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s var(--ease);
      }
      .ld-back-btn:hover { background: rgba(255,255,255,0.22); transform: translateX(-2px); }

      .ld-featured-badge {
        position: absolute; top: 1.75rem; right: 1.75rem; z-index: 5;
        background: linear-gradient(135deg, var(--gold), var(--gold-light));
        color: var(--navy);
        padding: 0.5rem 1.1rem;
        border-radius: 50px;
        font-family: var(--font-body);
        font-size: 0.78rem;
        font-weight: 700;
        display: flex; align-items: center; gap: 6px;
        box-shadow: 0 6px 18px rgba(201,168,76,0.4);
      }

      .ld-hero-content {
        position: absolute; bottom: 0; left: 0; right: 0; z-index: 4;
        padding: 0 2rem 2.5rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .ld-category-chip {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(255,107,53,0.18);
        border: 1px solid rgba(255,107,53,0.5);
        color: var(--saffron-light);
        padding: 5px 14px;
        border-radius: 50px;
        font-family: var(--font-body);
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        text-decoration: none;
        margin-bottom: 1rem;
        transition: all 0.25s var(--ease);
      }
      .ld-category-chip:hover { background: rgba(255,107,53,0.3); }

      .ld-hero-title {
        font-family: var(--font-display);
        font-size: clamp(2.2rem, 5.5vw, 4rem);
        font-weight: 700;
        color: white;
        line-height: 1.05;
        margin: 0 0 0.75rem;
        max-width: 800px;
      }
      .ld-hero-meta {
        display: flex; flex-wrap: wrap; gap: 1.5rem;
        color: rgba(255,255,255,0.85);
        font-family: var(--font-body);
        font-size: 0.95rem;
      }
      .ld-hero-rating { display: flex; align-items: center; gap: 6px; }
      .ld-review-count { color: rgba(255,255,255,0.6); font-size: 0.85rem; }

      /* ── Body grid ── */
      .ld-body-grid {
        max-width: 1200px;
        margin: 0 auto;
        padding-top: 3.5rem;
        display: grid;
        grid-template-columns: 1.6fr 1fr;
        gap: 3rem;
        align-items: start;
      }

      .ld-eyebrow {
        display: inline-block;
        font-family: var(--font-body);
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--saffron);
        background: rgba(255,107,53,0.08);
        padding: 1px 1px;
        border-radius: 50px;
        margin-bottom: 1rem;
      }
      .ld-story-title {
        font-family: var(--font-display);
        font-size: clamp(1.8rem, 3.5vw, 2.4rem);
        font-weight: 700;
        color: var(--navy);
        margin: 0 0 1.25rem;
        line-height: 1.15;
      }
      .ld-description {
        font-family: var(--font-body);
        font-size: 1.05rem;
        line-height: 1.85;
        color: #4a4a55;
        margin-bottom: 1.75rem;
      }

      /* Highlights */
      .ld-highlights {
        list-style: none;
        padding: 0;
        margin: 0 0 1.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
      }
      .ld-highlights li {
        display: flex;
        align-items: flex-start;
        gap: 0.6rem;
        font-family: var(--font-body);
        font-size: 0.98rem;
        color: #4a4a55;
        line-height: 1.5;
      }
      .ld-highlight-mark {
        color: var(--gold);
        font-size: 0.9rem;
        margin-top: 3px;
        flex-shrink: 0;
      }

      /* Ideal for */
      .ld-ideal-row { margin-bottom: 1.5rem; }
      .ld-ideal-label {
        display: block;
        font-family: var(--font-body);
        font-size: 0.75rem;
        font-weight: 700;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 0.6rem;
      }
      .ld-ideal-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .ld-ideal-pill {
        font-family: var(--font-body);
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--navy);
        background: rgba(201,168,76,0.12);
        border: 1px solid rgba(201,168,76,0.3);
        padding: 5px 13px;
        border-radius: 50px;
      }

      .ld-tags {
        display: flex; flex-wrap: wrap; gap: 0.6rem;
        margin-bottom: 2.25rem;
      }
      .ld-tag {
        font-family: var(--font-body);
        font-size: 0.78rem;
        color: var(--indigo);
        background: rgba(61,82,160,0.07);
        border: 1px solid rgba(61,82,160,0.15);
        padding: 5px 13px;
        border-radius: 50px;
      }
      .ld-cta-row { display: flex; gap: 1rem; flex-wrap: wrap; }
      .ld-btn-primary, .ld-btn-secondary {
        font-family: var(--font-body);
        font-size: 0.9rem;
        font-weight: 700;
        padding: 0.85rem 1.75rem;
        border-radius: 50px;
        text-decoration: none;
        display: inline-block;
        transition: all 0.3s var(--ease);
        cursor: pointer;
      }
      .ld-btn-primary {
        background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
        color: white;
        box-shadow: 0 10px 26px rgba(255,107,53,0.35);
      }
      .ld-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(255,107,53,0.45); }
      .ld-btn-secondary {
        background: white;
        color: var(--navy);
        border: 1.5px solid #e0e3f0;
      }
      .ld-btn-secondary:hover { border-color: var(--navy); transform: translateY(-2px); }

      /* ── Ticket card (signature element) ── */
      .ld-ticket {
        position: sticky;
        top: 2rem;
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 50px rgba(26,26,46,0.1);
        overflow: hidden;
        border: 1px solid #eef0ff;
      }
      .ld-ticket-top {
        background: var(--navy);
        padding: 1.75rem 1.75rem 1.5rem;
        position: relative;
      }
      .ld-ticket-label {
        display: block;
        font-family: var(--font-body);
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--gold-light);
        margin-bottom: 0.4rem;
      }
      .ld-ticket-name {
        font-family: var(--font-display);
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        margin: 0;
        line-height: 1.2;
      }
      .ld-ticket-perf {
        height: 0;
        border-top: 2px dashed #e3e3f0;
        position: relative;
      }
      .ld-ticket-perf::before, .ld-ticket-perf::after {
        content: '';
        position: absolute;
        top: -10px;
        width: 20px; height: 20px;
        background: var(--cream);
        border-radius: 50%;
      }
      .ld-ticket-perf::before { left: -10px; }
      .ld-ticket-perf::after { right: -10px; }
      .ld-ticket-rows { padding: 1.5rem 1.75rem; }
      .ld-ticket-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
        padding: 0.65rem 0;
        border-bottom: 1px solid #f3f3fa;
        font-family: var(--font-body);
      }
      .ld-ticket-row:last-child { border-bottom: none; }
      .ld-ticket-key { font-size: 0.85rem; color: #888; flex-shrink: 0; }
      .ld-ticket-val { font-size: 0.92rem; color: var(--navy); font-weight: 600; text-align: right; }
      .ld-ticket-feenote {
        padding: 0 1.75rem 1.25rem;
        font-family: var(--font-body);
        font-size: 0.78rem;
        color: #888;
        line-height: 1.7;
      }
      .ld-ticket-feenote strong { color: var(--navy); }
      .ld-ticket-feenote em {
        display: block;
        margin-top: 0.4rem;
        font-style: italic;
        color: #aaa;
      }
      .ld-difficulty-badge {
        font-family: var(--font-body);
        font-size: 0.78rem;
        font-weight: 700;
        padding: 3px 11px;
        border-radius: 50px;
      }
      .ld-difficulty-easy { background: rgba(122,178,108,0.15); color: #4c8a3f; }
      .ld-difficulty-moderate { background: rgba(255,179,71,0.2); color: #b5762a; }
      .ld-difficulty-difficult { background: rgba(220,80,80,0.15); color: #b13b3b; }
      .ld-ticket-foot {
        text-align: center;
        padding: 1rem;
        font-family: var(--font-display);
        font-style: italic;
        font-size: 0.85rem;
        color: #aaa;
      }

      /* ── New section heads (Plan / Reach / Gallery / Nearby) ── */
      .ld-section-head {
        text-align: center;
        max-width: 640px;
        margin: 0 auto 3rem;
      }
      .ld-section-title {
        font-family: var(--font-display);
        font-size: clamp(1.7rem, 4vw, 2.4rem);
        font-weight: 700;
        color: var(--navy);
        margin: 0;
      }

      /* ── Plan your visit ── */
      .ld-plan-grid {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1.75rem;
      }
      .ld-plan-card {
        background: var(--cream);
        border: 1px solid #f0ece0;
        border-radius: 18px;
        padding: 1.75rem;
      }
      .ld-plan-icon { font-size: 1.6rem; display: block; margin-bottom: 0.75rem; }
      .ld-plan-title {
        font-family: var(--font-display);
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--navy);
        margin: 0 0 0.85rem;
      }
      .ld-plan-months { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem; }
      .ld-month-chip {
        font-family: var(--font-body);
        font-size: 0.75rem;
        font-weight: 700;
        color: white;
        background: var(--saffron);
        padding: 3px 10px;
        border-radius: 50px;
      }
      .ld-plan-note {
        font-family: var(--font-body);
        font-size: 0.88rem;
        color: #777;
        line-height: 1.6;
        margin: 0;
      }
      .ld-plan-list {
        margin: 0;
        padding-left: 1.1rem;
        font-family: var(--font-body);
        font-size: 0.9rem;
        color: #555;
        line-height: 1.8;
      }

      /* ── How to reach ── */
      .ld-permit-notice {
        max-width: 1200px;
        margin: 0 auto 1.75rem;
        display: flex;
        align-items: center;
        gap: 0.65rem;
        background: rgba(255,179,71,0.12);
        border: 1px solid rgba(255,179,71,0.35);
        border-radius: 14px;
        padding: 0.9rem 1.25rem;
        font-family: var(--font-body);
        font-size: 0.86rem;
        color: #8a5a1a;
      }
      .ld-reach-grid {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        margin-bottom: 1.75rem;
      }
      .ld-reach-card {
        background: white;
        border: 1px solid #eef0ff;
        border-radius: 18px;
        padding: 1.75rem;
        box-shadow: 0 12px 30px rgba(26,26,46,0.06);
      }
      .ld-reach-icon { font-size: 1.6rem; display: block; margin-bottom: 0.75rem; }
      .ld-reach-card h4 {
        font-family: var(--font-display);
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--navy);
        margin: 0 0 0.5rem;
      }
      .ld-reach-card p {
        font-family: var(--font-body);
        font-size: 0.88rem;
        color: #666;
        line-height: 1.65;
        margin: 0;
      }
      .ld-distance-row {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }
      .ld-distance-chip {
        font-family: var(--font-body);
        font-size: 0.8rem;
        color: var(--indigo);
        background: rgba(61,82,160,0.07);
        border: 1px solid rgba(61,82,160,0.15);
        padding: 5px 13px;
        border-radius: 50px;
      }

      /* ── Gallery ── */
      .ld-gallery-grid {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
      }
      .ld-gallery-img-wrap {
        display: block;
        border-radius: 14px;
        overflow: hidden;
        aspect-ratio: 1;
      }
      .ld-gallery-img {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform 0.5s var(--ease);
      }
      .ld-gallery-img-wrap:hover .ld-gallery-img { transform: scale(1.08); }

      /* ── Nearby ── */
      .ld-nearby-scroll {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        gap: 1.25rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
        scrollbar-width: thin;
      }
      .ld-nearby-card {
        flex: 0 0 200px;
        background: white;
        border: 1px solid #eef0ff;
        border-radius: 16px;
        padding: 1.5rem 1.25rem;
        text-align: center;
      }
      .ld-nearby-icon { font-size: 1.4rem; display: block; margin-bottom: 0.6rem; }
      .ld-nearby-card h4 {
        font-family: var(--font-display);
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--navy);
        margin: 0 0 0.35rem;
      }
      .ld-nearby-dist {
        font-family: var(--font-body);
        font-size: 0.78rem;
        color: var(--saffron);
        font-weight: 700;
      }

      /* ── Related ── */
      .ld-related-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 2.5rem;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .ld-related-title {
        font-family: var(--font-display);
        font-size: clamp(1.7rem, 4vw, 2.4rem);
        font-weight: 700;
        color: var(--navy);
        margin: 0;
      }
      .ld-view-all {
        font-family: var(--font-body);
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--indigo);
        text-decoration: none;
      }
      .ld-related-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
      }
      .ld-related-card {
        text-decoration: none;
        border-radius: 16px;
        overflow: hidden;
        background: #fafbff;
        border: 1px solid #eef0ff;
        transition: all 0.3s var(--ease);
        display: block;
      }
      .ld-related-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 18px 40px rgba(26,26,46,0.12);
      }
      .ld-related-img-wrap { height: 150px; overflow: hidden; }
      .ld-related-img {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform 0.5s var(--ease);
      }
      .ld-related-card:hover .ld-related-img { transform: scale(1.08); }
      .ld-related-body { padding: 1rem 1.1rem; }
      .ld-related-body h4 {
        font-family: var(--font-display);
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--navy);
        margin: 0 0 0.3rem;
      }
      .ld-related-loc {
        display: block;
        font-family: var(--font-body);
        font-size: 0.78rem;
        color: #999;
        margin-bottom: 0.5rem;
      }
      .ld-related-price {
        font-family: var(--font-body);
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--saffron);
      }

      /* ── Responsive ── */
      @media (max-width: 900px) {
        .ld-body-grid { grid-template-columns: 1fr; gap: 2rem; }
        .ld-ticket { position: static; }
        .ld-related-grid { grid-template-columns: repeat(2, 1fr); }
        .ld-gallery-grid { grid-template-columns: repeat(3, 1fr); }
      }
      @media (max-width: 560px) {
        .ld-hero { height: 56vh; }
        .ld-related-grid { grid-template-columns: 1fr; }
        .ld-gallery-grid { grid-template-columns: repeat(2, 1fr); }
        .ld-hero-meta { gap: 0.85rem; font-size: 0.85rem; }
      }

      @media (prefers-reduced-motion: reduce) {
        .ld-reveal, .ld-hero-img, .ld-related-img, .ld-related-card, .ld-btn-primary, .ld-btn-secondary, .ld-category-chip, .ld-back-btn, .ld-gallery-img {
          transition: none !important;
        }
      }
    `}</style>
  );
}

export default LocationDetail;
