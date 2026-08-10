// components/TourPackageCard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaClock, FaUsers, FaStar, FaHeart,
  FaRegHeart, FaArrowRight, FaShieldAlt, FaUtensils,
  FaRedoAlt, FaCreditCard
} from 'react-icons/fa';

// ── Simulated live data hooks ─────────────────────────────────────────────────

// Package.seatsLeft is now a real field returned by the backend
// (Backend/Models/PackagesModel.js) and decremented on each confirmed
// payment (Backend/Controllers/paymentController.js) — this hook just
// passes it through instead of fabricating a countdown.
const useLiveSeats = (initialSeats) => {
  return typeof initialSeats === 'number' ? initialSeats : null;
};


// ── Theme config ──────────────────────────────────────────────────────────────
const THEMES = {
  'custom-tour':     { grad: 'linear-gradient(135deg,#5BC0EB,#0353A4)',  primary: '#5BC0EB', light: '#E8F4FD', icon: '🌅', shadow: '0 20px 50px rgba(91,192,235,0.18)' },
  'adventure-tour':  { grad: 'linear-gradient(135deg,#5BC0EB,#0353A4)',  primary: '#5BC0EB', light: '#E8F4FD', icon: '🌅', shadow: '0 20px 50px rgba(91,192,235,0.18)' },
  'family-tour':     { grad: 'linear-gradient(135deg,#5BC0EB,#0353A4)',  primary: '#5BC0EB', light: '#E8F4FD', icon: '🌅', shadow: '0 20px 50px rgba(91,192,235,0.18)' },
  'group-tour':      { grad: 'linear-gradient(135deg,#5BC0EB,#0353A4)',  primary: '#5BC0EB', light: '#E8F4FD', icon: '🌅', shadow: '0 20px 50px rgba(91,192,235,0.18)' },
  'city-tour':       { grad: 'linear-gradient(135deg,#5BC0EB,#0353A4)',  primary: '#5BC0EB', light: '#E8F4FD', icon: '🌅', shadow: '0 20px 50px rgba(91,192,235,0.18)' },
  'honeymoon-tour':  { grad: 'linear-gradient(135deg,#5BC0EB,#0353A4)',  primary: '#5BC0EB', light: '#E8F4FD', icon: '🌅', shadow: '0 20px 50px rgba(91,192,235,0.18)' },
  'weekend-getaway': { grad: 'linear-gradient(135deg,#5BC0EB,#0353A4)',  primary: '#5BC0EB', light: '#E8F4FD', icon: '🌅', shadow: '0 20px 50px rgba(91,192,235,0.18)' },
  'luxury-tour':     { grad: 'linear-gradient(135deg,#5BC0EB,#0353A4)',  primary: '#5BC0EB', light: '#E8F4FD', icon: '🌅', shadow: '0 20px 50px rgba(91,192,235,0.18)' },
  'pilgrimage-tour': { grad: 'linear-gradient(135deg,#5BC0EB,#0353A4)',  primary: '#5BC0EB', light: '#E8F4FD', icon: '🌅', shadow: '0 20px 50px rgba(91,192,235,0.18)' },
  default:           { grad: 'linear-gradient(135deg,#5BC0EB,#0353A4)',  primary: '#5BC0EB', light: '#E8F4FD', icon: '🌅', shadow: '0 20px 50px rgba(91,192,235,0.18)' },
};

const TourPackageCard = ({ pkg, themeColor = 'default', index = 0, onWishlistChange }) => {
  const [isFavourite, setIsFavourite] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dvd_wishlist') || '[]').includes(pkg?._id || pkg?.id); }
    catch { return false; }
  });
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { type: typeFromUrl } = useParams();
  const tourType = (themeColor && themeColor !== 'default') ? themeColor : (typeFromUrl || 'custom-tour');
  const themeKey = tourType?.includes('-') ? tourType : `${tourType}-tour`;
  const theme = THEMES[themeKey] || THEMES[tourType] || THEMES.default;

  const seatsLeft = useLiveSeats(pkg?.seatsLeft);

  const seatsKnown = typeof seatsLeft === 'number';
  const isUrgent = seatsKnown && seatsLeft <= 5;
  const isLow = seatsKnown && seatsLeft <= 12 && seatsLeft > 5;
  const seatsColor = isUrgent ? '#E24B4A' : isLow ? '#EF9F27' : '#4CAF50';
  const seatsFill = seatsKnown ? Math.min(100, ((30 - seatsLeft) / 30) * 100) : 0;

  const firstDuration = pkg?.durations?.[0] || {};
  const originalPrice = firstDuration.price || pkg?.price || 4999;
  const discountedPrice = firstDuration.discountedPrice || pkg?.discountedPrice;
  const finalPrice = discountedPrice || originalPrice;
  const discountPct = discountedPrice ? Math.round((1 - discountedPrice / originalPrice) * 100) : null;

  const fallbackImg = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80';

  const toggleFavourite = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const newVal = !isFavourite;
    setIsFavourite(newVal);
    if (newVal) { setJustAdded(true); setTimeout(() => setJustAdded(false), 1500); }
    try {
      const list = JSON.parse(localStorage.getItem('dvd_wishlist') || '[]');
      const id = pkg?._id || pkg?.id;
      const updated = newVal ? [...list, id] : list.filter(x => x !== id);
      localStorage.setItem('dvd_wishlist', JSON.stringify(updated));
    } catch {}
    onWishlistChange?.(pkg, newVal);
  }, [isFavourite, pkg, onWishlistChange]);

  const locationDisplay = pkg?.location
    ? pkg.location.charAt(0).toUpperCase() + pkg.location.slice(1)
    : 'Multiple Locations';

  const typeLabel = themeColor.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Playfair+Display:wght@600;700&display=swap');

        :root {
          --ease: cubic-bezier(0.4,0,0.2,1);
        }

        @keyframes tc-fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tc-heartPop { 0%{transform:scale(1)} 40%{transform:scale(1.45)} 70%{transform:scale(0.92)} 100%{transform:scale(1)} }
        @keyframes tc-pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes tc-wishPop  { 0%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} 100%{opacity:0;transform:translateX(-50%) translateY(-28px) scale(0.85)} }
        @keyframes tc-shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

        /* ── Wrapper ── */
        .tc-wrap {
          animation: tc-fadeUp 0.55s var(--ease) both;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Card ── */
        .tc-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.055);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          cursor: pointer;
          transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease);
        }
        .tc-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--tc-shadow, 0 20px 50px rgba(0,0,0,0.12));
        }

        /* ── Image ── */
        .tc-img-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: #f3f4f6;
          flex-shrink: 0;
        }
        .tc-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.55s var(--ease);
        }
        .tc-card:hover .tc-img { transform: scale(1.07); }
        .tc-img-shimmer {
          width: 100%; height: 100%;
          background: linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);
          background-size: 400px 100%;
          animation: tc-shimmer 1.4s infinite;
        }

        /* Gradient overlay — always visible at bottom of image */
        .tc-img-grad {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(10,10,30,0.72) 100%);
          pointer-events: none;
        }

        /* Type chip (top-left) */
        .tc-chip {
          position: absolute; top: 13px; left: 13px;
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px;
          border-radius: 50px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          color: #fff;
          font-size: 11.5px; font-weight: 600;
          letter-spacing: 0.02em;
          z-index: 4;
        }

        /* Rating + Wishlist (top-right) */
        .tc-top-right {
          position: absolute; top: 13px; right: 13px;
          display: flex; flex-direction: column; align-items: flex-end; gap: 7px;
          z-index: 4;
        }
        .tc-rating-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 11px;
          border-radius: 50px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          color: #fff;
          font-size: 12px; font-weight: 700;
        }
        .tc-rating-star { color: #FAC775; font-size: 11px; }

        .tc-heart-btn {
          position: relative;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #fff;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.14);
          transition: transform 0.2s var(--ease), box-shadow 0.2s;
          overflow: visible;
        }
        .tc-heart-btn:hover { transform: scale(1.1); box-shadow: 0 6px 18px rgba(0,0,0,0.2); }
        .tc-heart-btn.active { animation: tc-heartPop 0.45s var(--ease); }
        .tc-wish-popup {
          position: absolute;
          top: -28px; left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          background: #E24B4A;
          color: #fff;
          font-size: 10px; font-weight: 700;
          padding: 3px 8px; border-radius: 20px;
          pointer-events: none;
          animation: tc-wishPop 1.4s var(--ease) forwards;
        }

        /* Discount pill (top-left, below chip) */
        .tc-disc-pill {
          position: absolute; top: 52px; left: 13px;
          padding: 4px 11px; border-radius: 50px;
          font-size: 11px; font-weight: 700; color: #fff;
          z-index: 4;
          box-shadow: 0 3px 10px rgba(0,0,0,0.18);
        }

        /* Bottom-left — location */
        .tc-bottom-left {
          position: absolute; bottom: 13px; left: 13px;
          display: flex; align-items: center; gap: 5px;
          color: rgba(255,255,255,0.92);
          font-size: 12.5px; font-weight: 500;
          z-index: 4;
        }

        /* Bottom-right — weather */
        .tc-weather {
          position: absolute; bottom: 13px; right: 13px;
          display: flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.25);
          padding: 4px 10px; border-radius: 50px;
          color: #fff; font-size: 12px; font-weight: 600;
          z-index: 4;
          opacity: 0;
          transition: opacity 0.35s;
        }
        .tc-weather.show { opacity: 1; }

        /* Sold out overlay */
        .tc-soldout-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.58);
          display: flex; align-items: center; justify-content: center;
          z-index: 10;
        }
        .tc-soldout-label {
          background: rgba(226,75,74,0.92);
          color: #fff;
          padding: 10px 28px;
          border-radius: 50px;
          font-size: 1.15rem; font-weight: 800;
          transform: rotate(-14deg);
          box-shadow: 0 8px 28px rgba(226,75,74,0.4);
          letter-spacing: 0.06em;
        }

        /* ── Body ── */
        .tc-body {
          padding: 1.15rem 1.35rem 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        /* Title */
        .tc-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.11rem; font-weight: 500;
          color: #0a0a0a;
          line-height: 1.28;
          margin: 0;
        }

        /* Description */
        .tc-desc {
          font-size: 13px; color: #6B7280;
          line-height: 1.62;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Feature pills */
        .tc-pills {
          display: flex; gap: 7px; flex-wrap: wrap;
        }
        .tc-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 11px;
          border-radius: 50px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          font-size: 12px; color: #374151;
          font-weight: 500;
        }
        .tc-pill svg { flex-shrink: 0; }

        /* Divider */
        .tc-divider {
          border: none;
          border-top: 1px solid #F3F4F6;
          margin: 0;
        }

        /* Seats bar */
        .tc-seats {}
        .tc-seats-row {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .tc-seats-label { font-size: 11.5px; color: #9CA3AF; }
        .tc-seats-val   { font-size: 11.5px; font-weight: 700; }
        .tc-seats-val.urgent { animation: tc-pulse 1.5s infinite; }
        .tc-track {
          height: 5px; background: #F3F4F6;
          border-radius: 3px; overflow: hidden;
        }
        .tc-fill {
          height: 100%; border-radius: 3px;
          transition: width 0.8s var(--ease);
        }

        /* Countdown */
        .tc-timer {
          display: flex; align-items: center; gap: 7px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 10px;
          padding: 6px 11px;
          font-size: 12px;
        }
        .tc-timer.flash { background: #FECACA; }
        .tc-timer-icon  { color: #E24B4A; }
        .tc-timer-label { color: #9CA3AF; }
        .tc-timer-digits { font-weight: 700; color: #E24B4A; font-variant-numeric: tabular-nums; }

        /* Rating row */
        .tc-rating-row {
          display: flex; align-items: center;
          justify-content: space-between;
        }
        .tc-stars { color: #FBBF24; font-size: 13px; letter-spacing: 1px; }
        .tc-rating-num { font-weight: 700; font-size: 13px; color: #111827; margin-left: 5px; }
        .tc-reviews { font-size: 12px; color: #9CA3AF; }

        /* Footer */
        .tc-footer {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 2px;
        }
        .tc-price-main {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem; font-weight: 700;
          line-height: 1;
        }
        .tc-price-orig {
          font-size: 12px; color: #9CA3AF;
          text-decoration: line-through;
          margin-left: 5px;
          font-family: 'DM Sans', sans-serif;
        }
        .tc-price-per {
          font-size: 11px; color: #9CA3AF;
          margin-top: 2px; display: block;
        }

        .tc-view-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px;
          border-radius: 50px;
          color: #fff;
          font-size: 13px; font-weight: 600;
          text-decoration: none;
          border: none; cursor: pointer;
          transition: transform 0.25s var(--ease), filter 0.25s;
          font-family: 'DM Sans', sans-serif;
        }
        .tc-view-btn:hover { transform: scale(1.05); filter: brightness(1.1); color: #fff; }
        .tc-view-btn svg { transition: transform 0.25s var(--ease); }
        .tc-view-btn:hover svg { transform: translateX(3px); }

        /* Trust badges */
        .tc-trust {
          display: flex; gap: 14px; flex-wrap: wrap;
          padding-top: 10px;
          border-top: 1px dashed #E5E7EB;
        }
        .tc-trust-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 11.5px; color: #9CA3AF;
        }
        .tc-trust-item svg { color: #4CAF50; }
      `}</style>

      <div
        className="col-xl-4 col-lg-4 col-md-6 mb-4 tc-wrap"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <div
          className="tc-card"
          style={{ '--tc-shadow': theme.shadow }}
        >
          {/* Sold Out */}
          {pkg?.soldOut && (
            <div className="tc-soldout-overlay">
              <span className="tc-soldout-label">SOLD OUT</span>
            </div>
          )}

          {/* ── Image ── */}
          <div className="tc-img-wrap">
            {imageError ? (
              <div className="tc-img-shimmer" />
            ) : (
              <img
                src={pkg?.images || fallbackImg}
                alt={locationDisplay}
                className="tc-img"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            )}

            <div className="tc-img-grad" />

            {/* Type chip */}
            <div className="tc-chip">
              {theme.icon} {typeLabel}
            </div>

            {/* Top-right: rating + heart */}
            <div className="tc-top-right">
              <div className="tc-rating-badge">
                <FaStar className="tc-rating-star" />
                {pkg?.rating || '4.8'}
              </div>
              <button
                className={`tc-heart-btn ${isFavourite ? 'active' : ''}`}
                onClick={toggleFavourite}
                title={isFavourite ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {justAdded && <span className="tc-wish-popup">Added! ❤️</span>}
                {isFavourite
                  ? <FaHeart color="#E24B4A" />
                  : <FaRegHeart color="#D1D5DB" />}
              </button>
            </div>

            {/* Discount pill */}
            {discountPct && (
              <div className="tc-disc-pill" style={{ background: theme.grad }}>
                🔥 {discountPct}% OFF
              </div>
            )}

            {/* Bottom-left: location */}
            <div className="tc-bottom-left">
              <FaMapMarkerAlt size={11} />
              <span>{locationDisplay}</span>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="tc-body">

            {/* Title */}
            <h3 className="tc-title">
              {pkg?.title || pkg?.caption || 'Explore Amazing Destinations'}
            </h3>

            {/* Description */}
            {/* <p className="tc-desc">
              {pkg?.description || pkg?.caption || 'Discover the beauty and culture with our carefully crafted tour packages.'}
            </p> */}

            {/* Feature pills */}
            <div className="tc-pills">
              <span className="tc-pill">
                <FaClock size={10} style={{ color: theme.primary }} />
                {pkg?.duration || '7 Days'}
              </span>
              <span className="tc-pill">
                <FaUsers size={10} style={{ color: theme.primary }} />
                {pkg?.groupSize || 'Max 15'}
              </span>
              {pkg?.meals && (
                <span className="tc-pill">
                  <FaUtensils size={10} style={{ color: theme.primary }} />
                  Meals incl.
                </span>
              )}
            </div>

            <hr className="tc-divider" />

            {/* Seats bar — now driven by real Package.seatsLeft (Part C) */}
            {!pkg?.soldOut && seatsKnown && (
              <div className="tc-seats">
                <div className="tc-seats-row">
                  <span className="tc-seats-label">
                    {isUrgent ? '🔥 Almost full!' : isLow ? '⚡ Filling fast' : '✅ Available seats'}
                  </span>
                  <span
                    className={`tc-seats-val ${isUrgent ? 'urgent' : ''}`}
                    style={{ color: seatsColor }}
                  >
                    {seatsLeft === 0 ? 'Last slot!' : `${seatsLeft} left`}
                  </span>
                </div>
                <div className="tc-track">
                  <div className="tc-fill" style={{ width: `${seatsFill}%`, background: seatsColor }} />
                </div>
              </div>
            )}

            {/* Star rating row */}
            <div className="tc-rating-row">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="tc-stars">{'★'.repeat(5)}</span>
                <span className="tc-rating-num">{pkg?.rating || '4.8'}</span>
              </div>
              {/* <span className="tc-reviews">({pkg?.reviews || '128'} reviews)</span> */}
            </div>

            <hr className="tc-divider" />

            {/* Price + CTA */}
            <div className="tc-footer">
              <div>
                <div>
                  <span className="tc-price-main" style={{ color: theme.primary }}>
                    ₹{finalPrice?.toLocaleString('en-IN') || '4,999'}
                  </span>
                  {discountedPrice && (
                    <span className="tc-price-orig">₹{originalPrice?.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <span className="tc-price-per">per person</span>
              </div>

              <Link
                to={`/package/${tourType}/${(pkg?.location || 'tour').toLowerCase().replace(/ /g, '-')}`}
                className="tc-view-btn"
                style={{ background: theme.grad }}
                onClick={e => e.stopPropagation()}
              >
                Details <FaArrowRight size={11} />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="tc-trust">
              <div className="tc-trust-item">
                <FaShieldAlt size={10} />
                <span>Insured</span>
              </div>
              <div className="tc-trust-item">
                <FaRedoAlt size={10} />
                <span>Free cancel</span>
              </div>
              <div className="tc-trust-item">
                <FaCreditCard size={10} />
                <span>EMI available</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TourPackageCard;
