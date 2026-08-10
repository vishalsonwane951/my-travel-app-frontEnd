import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  Fragment,
} from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  getPropertyDetails,
  // getReviewsList,
  getHotelRooms,
} from "../../Services/stayService.js";
import StayStyles from "./Staystyles.jsx";
import HotelHeader from "./component/Header.jsx";
// import Header from "./component/Header.jsx";

/* ------------------------------------------------------------------
   STEP 6-10: Property details -> rooms/offers -> proceed to booking
   (STEP 11)

   Property Details (step 4 in the migration, see stayService.js) is now
   wired up to Xeni's confirmed `/property/{id}` endpoint, replacing the
   old Hotels.com-shaped getHotelDetails()/getHotelInfo()/
   getReviewsSummary() trio. `details` below is the FLAT, normalized
   object stayService.js's normalizePropertyDetails() returns — a single
   call gets name/address/coordinates/ratings/amenities/policies/
   highlights/images, no more separate info/reviewsSummary state.

   Xeni has no confirmed endpoint yet for individual written reviews
   (only the aggregate score + sub-scores + review count, all part of
   Property Details) — the "Reviews" tab's guest-review list therefore
   stays wired to a commented-out getReviewsList() call and renders
   nothing until that endpoint is confirmed.

   getHotelRooms(): response SHAPE + path CONFIRMED (see stayService.js).
------------------------------------------------------------------- */

// Extract plain-ish text from the API's small HTML fragments (e.g. "<br/>",
// "<ul><li>...</li></ul>") for display. The API text is a trusted source,
// so we render it with dangerouslySetInnerHTML rather than stripping tags.
function Html({ html }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ---------------- tiny inline icon set (no external deps) ---------------- */
const IconPin = (p) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconHeart = (p) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
);
const IconShare = (p) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 10.6 15.4 6.9M8.6 13.4l6.8 3.7" />
  </svg>
);
const IconClose = (p) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconCheck = (p) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    {...p}
  >
    <path d="m5 13 4 4L19 7" />
  </svg>
);
const IconCross = (p) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    {...p}
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconDot = (p) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <circle cx="12" cy="12" r="9" />
  </svg>
);
const IconCamera = (p) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M9 3 7.5 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.5L15 3H9Zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
  </svg>
);
const IconRupee = (p) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 8h7M8.5 11h7M9 8c3 0 4.5 1 4.5 3s-1.5 3-4.5 3M9 14l5 5" />
  </svg>
);
const IconInfo = (p) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 8v.01" />
  </svg>
);
const IconChevronRight = (p) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <path d="m9 6 6 6-6 6" />
  </svg>
);
const IconChevronDown = (p) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const IconWifi = (p) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <path d="M2 8.5a16 16 0 0 1 20 0" />
    <path d="M5.5 12.5a11 11 0 0 1 13 0" />
    <path d="M9 16.3a6 6 0 0 1 6 0" />
    <circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconRestaurant = (p) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <path d="M6 2v8a2 2 0 0 0 4 0V2M8 2v20M6 6h4" />
    <path d="M17 2c-1.7 0-3 2-3 5s1.3 5 3 5v10" />
  </svg>
);
const IconBell = (p) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <path d="M4 18h16M12 4a6 6 0 0 1 6 6c0 4 1.5 5 2 6H4c.5-1 2-2 2-6a6 6 0 0 1 6-6Z" />
    <path d="M10 21h4" />
  </svg>
);
const IconSnow = (p) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <path d="M12 2v20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1M2 12h20M7 7l-3-1 1-3M17 7l3-1-1-3M7 17l-3 1 1 3M17 17l3 1-1 3" />
  </svg>
);
const IconGuard = (p) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <circle cx="12" cy="8" r="3" />
    <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
  </svg>
);
const IconCctv = (p) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <rect x="2" y="7" width="11" height="7" rx="1.5" />
    <path d="M13 9.5 20 7v7l-7-2.5M20 14v3M17.5 20h5" />
  </svg>
);
const IconParking = (p) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M9 16V7h3.5a2.75 2.75 0 0 1 0 5.5H9" />
  </svg>
);
const IconPool = (p) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <path d="M2 17c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0M4 12l6-8 4 3-6 8-4-3Z" />
  </svg>
);
const IconAC = IconSnow;
const IconGeneric = IconDot;

// Best-effort mapping from a facility's plain-text label to a specific
// icon (matches the reference design's per-facility icons instead of a
// single generic dot for every item). Falls back to IconGeneric when no
// keyword matches, so unrecognised facilities still render fine.
function facilityIcon(label = "") {
  const s = label.toLowerCase();
  if (/wi-?fi|internet/.test(s)) return IconWifi;
  if (/restaurant|dining|breakfast|food/.test(s)) return IconRestaurant;
  if (/room service/.test(s)) return IconBell;
  if (/air.?condition|\bac\b/.test(s)) return IconAC;
  if (/security|guard/.test(s)) return IconGuard;
  if (/cctv|camera|surveillance/.test(s)) return IconCctv;
  if (/parking/.test(s)) return IconParking;
  if (/pool|swim/.test(s)) return IconPool;
  return IconGeneric;
}

const TOP_TABS = [
  { id: "overview", label: "Overview" },
  { id: "rooms", label: "Rooms" },
  { id: "location", label: "Location" },
  { id: "reviews", label: "Reviews" },
  { id: "facilities", label: "Facilities" },
  { id: "policies", label: "Policies" },
];

// getHotelRooms() (stayService.js) returns raw numeric INR amounts
// (price/originalPrice/savedPrice/taxes), not pre-formatted strings —
// format them for display here.
const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
function formatPrice(amount) {
  return amount == null ? "—" : inrFormatter.format(amount);
}

// Discount % for a rate card — computed from real originalPrice/price
// fields (both confirmed in stayService.js), not fabricated.
function discountPercent(rate) {
  if (
    !rate?.originalPrice ||
    !rate?.price ||
    rate.originalPrice <= rate.price
  ) {
    return null;
  }
  return Math.round((1 - rate.price / rate.originalPrice) * 100);
}

// Formats a cancellationPolicy[].end ISO string (e.g.
// "2026-07-24T12:00:00+05:30", confirmed in stayService.js) into
// something like "29 Jul, 11:59 PM".
function formatCancelDeadline(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const datePart = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
  const timePart = d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart}, ${timePart}`;
}

// A short, real-data-driven label for a rate card's title — no
// invented payment-method badges ("Book with ₹0", "Pay at hotel") since
// those aren't fields Check Availability actually returns.
function rateCardTitle(rate) {
  return rate?.refundable
    ? "Room With Free Cancellation"
    : "Non-Refundable Rate";
}

// Generic renderer for "section group" shaped data — used for both
// amenities and policies, which share the same { header, sections:
// [{ header, items }] } shape.
function SectionGroupBlocks({ groups }) {
  if (!groups?.length) return null;
  return groups.map((section, i) => (
    <div key={i} className="policy-section">
      {section.header?.text && (
        <p className="policy-subtitle">{section.header.text}</p>
      )}
      <ul className="policy-list">
        {section.items?.map((item, k) => (
          <li key={k}>{item.primary || item.text}</li>
        ))}
      </ul>
    </div>
  ));
}

/* ------------------------------------------------------------------
   HotelDetailsStyles — page-specific CSS for HotelDetailsPage.jsx
   (.dp-*, .detail-*, .rating-*, .review-*, .gallery-*, .facility-*,
   .amenity-*, .policy-*, legacy .room-* etc.). Relies on the shared
   design tokens (:root vars) and a few cross-page rules (.notice,
   .pill, .tag-skeleton-block, .tag-skeleton-line, .filter-pill) that
   still live in Staystyles.jsx, so <StayStyles /> must also be
   rendered on this page.
------------------------------------------------------------------- */
function HotelDetailsStyles() {
  return (
    <style>{`
      /* Full-bleed layout: the page now spans the full browser width
         (edge-to-edge) instead of being capped at 1200px and centered,
         matching the reference screenshots. Horizontal breathing room
         comes from padding instead of a max-width + auto margin. */
      .app { width: 100%; margin: 0; padding: 0 40px 60px; color: var(--color-text-primary); box-sizing: border-box; }

      /* ---------------- sticky tab bar ---------------- */
      .dp-tabbar {
        position: sticky;
        top: 0;
        z-index: 40;
        background: #fff;
        border-bottom: 1px solid var(--color-border-default);
        margin: 0 -40px 0;
        padding: 0 40px;
      }
      .dp-tabbar-inner {
        display: flex;
        gap: 34px;
        width: 100%;
        margin: 0;
        overflow-x: auto;
      }
      .dp-tab {
        appearance: none;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        padding: 18px 2px 14px;
        font-size: var(--font-size-md);
        font-weight: 500;
        color: var(--color-text-primary);
        cursor: pointer;
        white-space: nowrap;
        font-family: inherit;
      }
      .dp-tab.active {
        color: var(--color-accent-blue);
        border-bottom-color: var(--color-accent-blue);
      }
      .dp-tab:hover:not(.active) { color: var(--color-surface-raised-dark); }

      /* ---------------- back link ---------------- */
      .back-link {
        appearance: none;
        background: none;
        border: none;
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        padding: 14px 0 4px;
        cursor: pointer;
        font-family: inherit;
      }
      .back-link:hover { color: var(--color-text-primary); }

      /* ---------------- top head: name + save/share ---------------- */
      .dp-head-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        flex-wrap: wrap;
        margin-top: 18px;
      }
      .dp-name-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .detail-name { font-size: 28px; font-weight: 800; margin: 0; }
      .dp-stars { color: var(--color-surface-raised); letter-spacing: 1px; font-size: var(--font-size-sm); }
      .dp-guarantee {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: var(--color-success-bg);
        color: var(--color-text-tertiary);
        font-size: var(--font-size-xs);
        font-weight: 600;
        padding: 4px 9px;
        border-radius: 20px;
      }

      .dp-head-actions { display: flex; gap: 18px; flex-shrink: 0; }
      .dp-icon-btn {
        appearance: none;
        background: none;
        border: none;
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--color-surface-raised-dark);
        font-size: var(--font-size-sm);
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
      }
      .dp-icon-btn:hover { color: var(--color-surface-raised); }

      /* ---------------- address row (icon chip + stacked text) ---------------- */
      .dp-address-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
      }
      .dp-address-icon {
        width: 30px;
        height: 30px;
        border-radius: 8px;
        background: #ffe6cf;
        color: var(--color-surface-raised-dark);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .dp-address-row .detail-loc {
        font-size: var(--font-size-md);
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0;
      }
      .dp-address-row .dp-map-link { display: block; margin-top: 2px; }
      .dp-map-link {
        appearance: none;
        background: none;
        border: none;
        color: var(--color-surface-raised-dark);
        font-size: var(--font-size-sm);
        font-weight: 600;
        cursor: pointer;
        padding: 0;
        font-family: inherit;
      }
      .dp-map-link:hover { text-decoration: underline; }

      /* ---------------- hero + top sidebar grid ---------------- */
      .dp-hero-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 24px;
        margin: 18px 0 0;
        align-items: start;
      }
      .dp-hero-grid .detail-hero { margin: 0; }
      .dp-hero-sidebar {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      /* ---------------- hero gallery ---------------- */
      .detail-hero {
        display: grid;
        grid-template-columns: 1.6fr 1fr;
        gap: 8px;
        margin: 18px 0 22px;
      }
      .detail-hero-main {
        width: 100%;
        height: 460px;
        object-fit: cover;
        border-radius: var(--radius-md);
        cursor: pointer;
      }
      .detail-hero-strip {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 100%;
      }
      .hero-thumb-wrap {
        position: relative;
        border-radius: var(--radius-md);
        overflow: hidden;
        cursor: pointer;
        flex: 1;
      }
      .hero-thumb-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .hero-see-all-btn {
        position: absolute;
        bottom: 10px;
        right: 10px;
        appearance: none;
        background: rgba(0,0,0,0.75);
        color: #fff;
        border: none;
        border-radius: 20px;
        padding: 8px 14px;
        font-size: var(--font-size-xs);
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
      }
      .hero-see-all-btn:hover { background: rgba(0,0,0,0.9); }

      /* ---------------- head ---------------- */
      .detail-head { padding: 4px 0 18px; }

      /* ---------------- highlight tiles (horizontally scrollable row) ---------------- */
      .dp-highlights-wrap {
        position: relative;
        margin: 22px 0 26px;
      }
      .dp-highlights {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        scroll-behavior: smooth;
        scrollbar-width: none;
        padding-right: 44px;
      }
      .dp-highlights::-webkit-scrollbar { display: none; }
      .dp-highlight-tile {
        flex: 0 0 300px;
        display: flex;
        gap: 12px;
        background: var(--color-surface-strong);
        border-radius: var(--radius-md);
        padding: 14px 16px;
      }
      .dp-highlights-next {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid var(--color-border-default);
        background: #fff;
        color: var(--color-text-primary);
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .dp-highlights-next:hover { background: var(--color-surface-strong); }
      .dp-highlight-icon {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #ffe6cf;
        color: var(--color-surface-raised-dark);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .dp-highlight-title { font-weight: 700; font-size: var(--font-size-sm); margin: 0 0 3px; }
      .dp-highlight-sub { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin: 0; line-height: 1.4; }

      /* ---------------- layout ---------------- */
      .dp-layout {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: 28px;
        align-items: start;
      }
      .dp-main { min-width: 0; }
      .dp-sidebar {
        position: sticky;
        top: 76px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .detail-section {
        padding: 26px 0;
        border-bottom: 1px solid var(--color-border-default);
      }
      .detail-section h2 {
        font-size: var(--font-size-2xl);
        font-weight: 800;
        margin: 0 0 14px;
      }
      .placeholder { color: var(--color-text-secondary); font-size: var(--font-size-sm); }

      /* ---------------- about sub-tabs / review filter pills ---------------- */
      .dp-subtabs { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
      .dp-subtab {
        appearance: none;
        border: 1px solid var(--color-border-default);
        background: #fff;
        border-radius: 20px;
        padding: 8px 16px;
        font-size: var(--font-size-sm);
        font-weight: 500;
        cursor: pointer;
        color: var(--color-text-primary);
        font-family: inherit;
      }
      .dp-subtab.active {
        border-color: var(--color-accent-blue);
        color: var(--color-accent-blue);
        background: var(--color-accent-blue-bg);
      }
      .tag-subtitle { font-weight: 700; font-size: var(--font-size-sm); margin: 4px 0 8px; }

      .dp-about-list {
        margin: 0 0 6px;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: var(--font-size-sm);
        line-height: 1.5;
      }

      /* ---------------- facilities grid ---------------- */
      .facility-icon-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 18px;
        margin-top: 4px;
      }
      .facility-icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 8px;
      }
      .facility-icon {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: var(--color-surface-strong);
        color: var(--color-text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .facility-icon-label { font-size: var(--font-size-sm); line-height: 1.3; }
      .dp-view-more {
        appearance: none;
        background: none;
        border: none;
        color: var(--color-surface-raised-dark);
        font-weight: 700;
        font-size: var(--font-size-sm);
        margin-top: 16px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-family: inherit;
      }
      .dp-view-more:hover { text-decoration: underline; }

      /* ---------------- rooms ---------------- */
      .dp-rooms-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
        flex-wrap: wrap;
        gap: 10px;
      }
      .dp-filter-pill {
        appearance: none;
        border: 1px solid var(--color-border-default);
        background: #fff;
        border-radius: 20px;
        padding: 8px 16px;
        font-size: var(--font-size-sm);
        cursor: pointer;
        font-family: inherit;
      }
      .dp-filter-pill.active {
        border-color: var(--color-surface-raised);
        color: var(--color-surface-raised-dark);
        background: #fff3e8;
      }
      .dp-room-type-select { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-secondary); }

      .room-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-md);
        padding: 16px;
        margin-bottom: 12px;
      }

      .room-type-group {
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-md);
        margin-bottom: 20px;
        overflow: hidden;
      }
      .room-type-head {
        display: flex;
        gap: 16px;
        padding: 18px;
        background: var(--color-surface-strong);
      }
      .room-type-photo {
        width: 150px;
        height: 100px;
        border-radius: var(--radius-xs);
        overflow: hidden;
        flex-shrink: 0;
      }
      .room-type-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .room-type-name { font-size: var(--font-size-xl); font-weight: 800; margin: 0 0 6px; }
      .room-type-meta { display: flex; gap: 16px; font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 8px; }
      .room-type-details-link {
        appearance: none;
        background: none;
        border: none;
        color: var(--color-surface-raised-dark);
        font-weight: 700;
        font-size: var(--font-size-xs);
        cursor: pointer;
        padding: 0;
        font-family: inherit;
      }
      .room-type-details-link:hover { text-decoration: underline; }

      .room-option-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 18px;
        border-top: 1px solid var(--color-border-default);
        flex-wrap: wrap;
      }
      .room-card-soldout { opacity: 0.55; }

      .room-option-badges { display: flex; flex-wrap: wrap; gap: 10px 18px; }
      .room-option-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
      }
      .room-option-badge svg { color: var(--color-text-primary); }
      .room-option-badge.deny { color: var(--color-danger); }
      .room-option-badge.deny svg { color: var(--color-danger); }

      .room-scarcity { color: var(--color-text-secondary); font-size: var(--font-size-sm); font-weight: 600; }

      .room-option-price { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
      .room-option-discount {
        align-self: flex-end;
        background: var(--color-success-bg);
        color: var(--color-text-tertiary);
        font-size: 11px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .room-price-strike { color: var(--color-text-secondary); text-decoration: line-through; font-size: var(--font-size-sm); }
      .room-price { font-size: var(--font-size-2xl); font-weight: 800; }
      .room-option-left { color: var(--color-danger); font-size: var(--font-size-xs); font-weight: 700; }

      .room-select {
        appearance: none;
        border: none;
        background: var(--color-surface-raised);
        color: #fff;
        font-weight: 700;
        font-size: var(--font-size-sm);
        padding: 11px 20px;
        border-radius: var(--radius-xs);
        cursor: pointer;
        white-space: nowrap;
        font-family: inherit;
        transition: filter var(--motion-instant) ease;
      }
      .room-select:hover { filter: brightness(0.93); }

      /* ---------------- location ---------------- */
      .dp-map-preview {
        width: 100%;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-md);
      }

      /* ---------------- reviews ---------------- */
      .rating-row { display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap; }
      .rating-big {
        font-size: 42px;
        font-weight: 800;
        line-height: 1;
        flex-shrink: 0;
      }
      .rating-bars { flex: 1; display: flex; flex-direction: column; gap: 10px; }
      .rating-bar-row {
        display: grid;
        grid-template-columns: 120px 1fr 40px;
        align-items: center;
        gap: 12px;
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
      }
      .rating-bar-track {
        height: 6px;
        background: var(--color-border-default);
        border-radius: 4px;
        overflow: hidden;
      }
      .rating-bar-fill { height: 100%; background: var(--color-surface-raised); border-radius: 4px; }

      .review-card {
        border-bottom: 1px solid var(--color-border-default);
        padding: 16px 0;
      }
      .review-head { display: flex; justify-content: space-between; margin-bottom: 6px; gap: 10px; }
      .review-author { font-weight: 700; font-size: var(--font-size-sm); }
      .review-date { color: var(--color-text-secondary); font-size: var(--font-size-sm); }
      .review-title { font-weight: 700; margin: 0 0 4px; }
      .review-text { font-size: var(--font-size-sm); color: var(--color-text-primary); margin: 0; line-height: 1.5; }

      .load-more {
        appearance: none;
        width: 100%;
        border: 1px solid var(--color-border-default);
        background: #fff;
        padding: 12px;
        border-radius: var(--radius-xs);
        font-weight: 700;
        font-size: var(--font-size-sm);
        cursor: pointer;
        margin-top: 10px;
        font-family: inherit;
      }
      .load-more:hover { background: var(--color-surface-strong); }
      .load-more:disabled { opacity: 0.6; cursor: default; }

      /* ---------------- guest impressions ---------------- */
      .dp-guest-impressions {
        background: #fff4e8;
        border-radius: var(--radius-md);
        padding: 18px;
        margin: 0;
      }

      /* ---------------- amenities / facilities section ---------------- */
      .amenity-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px 20px;
      }
      .amenity-item { font-size: var(--font-size-sm); color: var(--color-text-primary); }

      /* ---------------- deal card (now used at top, beside the hero gallery) ---------------- */
      .dp-deal-card {
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-md);
        overflow: hidden;
        background: #fff;
      }
      .dp-deal-top {
        display: flex;
        gap: 12px;
        padding: 16px 16px 0;
      }
      .dp-deal-thumb {
        width: 92px;
        height: 78px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;
      }
      .dp-deal-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .dp-deal-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
        min-width: 0;
      }
      .dp-deal-tag {
        align-self: flex-start;
        background: var(--color-accent-blue-bg);
        color: var(--color-accent-blue);
        font-size: var(--font-size-xs);
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 20px;
      }
      .dp-deal-body { padding: 16px; }
      .dp-deal-info .dp-deal-title {
        font-size: var(--font-size-lg);
        font-weight: 800;
        margin: 0;
        line-height: 1.3;
      }
      .dp-deal-perks { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
      .dp-deal-perk { display: flex; align-items: center; gap: 6px; font-size: var(--font-size-sm); }
      .dp-deal-perk.allow { color: var(--color-text-primary); }
      .dp-deal-perk.allow svg { color: var(--color-text-primary); }
      .dp-deal-perk.deny { color: var(--color-danger); }
      .dp-deal-perk.deny svg { color: var(--color-danger); }
      .dp-deal-perk-info { color: var(--color-text-secondary); margin-left: 2px; }
      .dp-deal-price-row { display: flex; align-items: baseline; gap: 8px; }
      .dp-deal-strike { text-decoration: line-through; color: var(--color-text-secondary); font-size: var(--font-size-sm); }
      .dp-deal-price { font-size: var(--font-size-3xl); font-weight: 800; }
      .dp-deal-taxes { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin: 4px 0 14px; }
      .dp-deal-cta {
        appearance: none;
        width: 100%;
        border: none;
        border-radius: var(--radius-xs);
        padding: 12px;
        font-weight: 700;
        font-size: var(--font-size-sm);
        cursor: pointer;
        margin-bottom: 8px;
        font-family: inherit;
        transition: background var(--motion-instant) ease;
      }
      .dp-deal-cta.primary { background: var(--color-surface-raised); color: #fff; }
      .dp-deal-cta.primary:hover { background: var(--color-surface-raised-dark); }
      .dp-deal-cta.secondary { background: #fff0e2; color: var(--color-surface-raised-dark); }
      .dp-deal-cta.secondary:hover { background: #ffe4cc; }

      /* ---------------- rating card (with dropdown chevron) ---------------- */
      .dp-rating-card {
        display: flex;
        align-items: center;
        gap: 14px;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-md);
        padding: 16px;
        cursor: pointer;
        background: #fff;
      }
      .dp-rating-card:hover { background: var(--color-surface-strong); }
      .dp-rating-badge {
        background: var(--color-surface-base);
        color: #fff;
        font-weight: 800;
        font-size: var(--font-size-xl);
        padding: 8px 12px;
        border-radius: var(--radius-xs);
        flex-shrink: 0;
      }
      .dp-rating-text { flex: 1; min-width: 0; }
      .dp-rating-label { font-weight: 700; margin: 0; font-size: var(--font-size-md); }
      .dp-rating-sub { color: var(--color-text-secondary); font-size: var(--font-size-sm); margin: 2px 0 0; }
      .dp-rating-chevron {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #ffe6cf;
        color: var(--color-surface-raised-dark);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* ---------------- quote card (guest snippet, matches reference) ---------------- */
      .dp-quote-card {
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-md);
        padding: 16px;
        background: #fff;
        cursor: pointer;
      }
      .dp-quote-card:hover { background: var(--color-surface-strong); }
      .dp-quote-card h3 { font-size: var(--font-size-md); font-weight: 800; margin: 0 0 10px; }
      .dp-quote-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
      .dp-quote-title { font-size: var(--font-size-md); font-weight: 700; margin: 0; }
      .dp-quote-chevron { color: var(--color-text-secondary); flex-shrink: 0; display: flex; }
      .dp-quote-meta { display: flex; align-items: center; gap: 6px; font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: 8px; }
      .dp-quote-flag { font-size: 14px; line-height: 1; }

      /* ---------------- sidebar: map card ---------------- */
      .dp-map-card {
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-md);
        overflow: hidden;
      }
      .dp-map-card iframe { display: block; width: 100%; height: 180px; border: none; }
      .dp-map-card-foot { padding: 10px 16px; text-align: center; }
      .dp-map-card-foot button {
        appearance: none;
        background: none;
        border: none;
        color: var(--color-surface-raised-dark);
        font-weight: 700;
        font-size: var(--font-size-sm);
        cursor: pointer;
        font-family: inherit;
      }
      .dp-map-card-foot button:hover { text-decoration: underline; }

      /* ---------------- photo lightbox ---------------- */
      .gallery-overlay {
        position: fixed;
        inset: 0;
        background: #fff;
        z-index: 100;
        overflow-y: auto;
        padding: 0 40px 40px;
      }
      .gallery-header {
        position: sticky;
        top: 0;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 0;
        border-bottom: 1px solid var(--color-border-default);
        margin-bottom: 20px;
      }
      .gallery-toggle { display: flex; gap: 10px; }
      .gallery-toggle button {
        appearance: none;
        border: 1px solid var(--color-border-default);
        background: #fff;
        border-radius: 20px;
        padding: 8px 18px;
        font-size: var(--font-size-sm);
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
      }
      .gallery-toggle button.active { background: var(--color-text-primary); color: #fff; border-color: var(--color-text-primary); }
      .gallery-close {
        appearance: none;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-text-primary);
      }
      .gallery-categories {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 20px;
      }
      .gallery-cat-btn {
        appearance: none;
        border: 1px solid var(--color-border-default);
        background: #fff;
        border-radius: 20px;
        padding: 7px 16px;
        font-size: var(--font-size-xs);
        cursor: pointer;
        font-family: inherit;
      }
      .gallery-cat-btn.active { border-color: var(--color-accent-blue); color: var(--color-accent-blue); background: var(--color-accent-blue-bg); }
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      }
      .gallery-grid img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: var(--radius-xs);
      }
      .gallery-empty { color: var(--color-text-secondary); text-align: center; padding: 60px 0; }

      /* ---------------- Responsive (details page) ---------------- */
      @media (max-width: 960px) {
        .app { padding: 0 16px 60px; }
        .dp-tabbar { margin: 0 -16px 0; padding: 0 16px; }
        .dp-hero-grid { grid-template-columns: 1fr; }
        .dp-layout { grid-template-columns: 1fr; }
        .dp-sidebar { position: static; }
        .detail-hero { grid-template-columns: 1fr; }
        .facility-icon-grid { grid-template-columns: repeat(3, 1fr); }
        .amenity-grid { grid-template-columns: repeat(2, 1fr); }
        .gallery-grid { grid-template-columns: repeat(2, 1fr); }
      }


    `}</style>
  );
}

export default function HotelDetailsPage() {
  const { property_id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  // Xeni's Check Availability endpoint (getHotelRooms) needs both the
  // place_id from the search step AND the property_id (the route's
  // property_id param IS the property_id) — carry placeId through the URL
  // the same way checkIn/checkOut already are.
  const placeId = searchParams.get("placeId") || "";

  const [details, setDetails] = useState(null);
  const [detailsAvailable, setDetailsAvailable] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsAvailable, setReviewsAvailable] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsAvailable, setRoomsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  // ---- new UI state for the reference layout ----
  const [activeTab, setActiveTab] = useState("overview");
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryTab, setGalleryTab] = useState("property");
  const [galleryCategory, setGalleryCategory] = useState("All Photos");
  const [breakfastOnly, setBreakfastOnly] = useState(false);
  const [freeCancellationOnly, setFreeCancellationOnly] = useState(false);
  const [roomDetailsOpen, setRoomDetailsOpen] = useState(null); // holds the selected room object, or null when closed
  const [roomImageIndex, setRoomImageIndex] = useState(0);
  const roomImageScrollRef = useRef(null);

  // Reset the drawer's carousel to the first photo every time a
  // (possibly different) room is opened.
  useEffect(() => {
    setRoomImageIndex(0);
    if (roomImageScrollRef.current) {
      roomImageScrollRef.current.scrollTo({ left: 0 });
    }
  }, [roomDetailsOpen]);

  const handleRoomImageScroll = useCallback((e) => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setRoomImageIndex(idx);
  }, []);

  const goToRoomImage = useCallback((i) => {
    const el = roomImageScrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setRoomImageIndex(i);
  }, []);

  // "Room plan" full-screen lightbox — opened by clicking a room's
  // thumbnail image in the Rooms list (separate from the room details
  // drawer, which opens via the "View Details" link instead).
  const [roomPlanOpen, setRoomPlanOpen] = useState(null); // holds the selected room object, or null when closed
  const [roomPlanIndex, setRoomPlanIndex] = useState(0);

  const openRoomPlan = useCallback((room) => {
    setRoomPlanOpen(room);
    setRoomPlanIndex(0);
  }, []);
  const closeRoomPlan = useCallback(() => setRoomPlanOpen(null), []);
  const roomPlanImages = roomPlanOpen?.images || [];
  const nextRoomPlanImage = useCallback(() => {
    setRoomPlanIndex((i) =>
      roomPlanImages.length ? (i + 1) % roomPlanImages.length : 0,
    );
  }, [roomPlanImages.length]);
  const prevRoomPlanImage = useCallback(() => {
    setRoomPlanIndex((i) =>
      roomPlanImages.length
        ? (i - 1 + roomPlanImages.length) % roomPlanImages.length
        : 0,
    );
  }, [roomPlanImages.length]);

  // Displays "4+" once a room has 4 or more photos (matches the
  // reference design's badge convention), otherwise the exact count.
  const photoCountLabel = (count) => (count >= 4 ? "4+" : String(count));

  const sectionRefs = {
    overview: useRef(null),
    rooms: useRef(null),
    location: useRef(null),
    reviews: useRef(null),
    facilities: useRef(null),
    policies: useRef(null),
  };
  const highlightsRef = useRef(null);
  const scrollHighlights = () => {
    highlightsRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  // STEP 6-8: property details — CONFIRMED against Xeni's
  // /property/{id} endpoint (see stayService.js). A single call now
  // returns everything the old three-endpoint Hotels.com flow used to
  // split across getHotelDetails/getHotelInfo/getReviewsSummary: name,
  // address, coordinates, star rating + review sub-scores, amenities,
  // policies, and highlights. On failure, `detailsAvailable` flips to
  // false so the page falls back to the Rooms-only view (step 3 already
  // works standalone) instead of getting stuck loading forever.
  useEffect(() => {
    if (!property_id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    getPropertyDetails({ propertyId: property_id })
      .then(({ details: d }) => {
        if (!cancelled) setDetails(d);
      })
      .catch(() => {
        if (!cancelled) setDetailsAvailable(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [property_id]);

  // STEP 9: reviews list, paginated — endpoint unconfirmed, fails quietly.
  // NOTE: the actual fetch below is commented out until the endpoint is
  // confirmed. reviewsLoading is intentionally left untouched here — it
  // must only flip to true right before a real request and back to false
  // in that request's `finally`, or the "Load more reviews" button gets
  // stuck showing "Loading…" forever with no fetch to resolve it.
  useEffect(() => {
    if (!property_id || !reviewsAvailable) return;
    let cancelled = false;

    // setReviewsLoading(true);
    // getReviewsList({ property_id, page: reviewsPage })
    //   .then(({ list }) => {
    //     if (cancelled) return;
    //     setReviews((prev) => (reviewsPage === 1 ? list : [...prev, ...list]));
    //   })
    //   .catch(() => {
    //     if (!cancelled) setReviewsAvailable(false);
    //   })
    //   .finally(() => {
    //     if (!cancelled) setReviewsLoading(false);
    //   });

    return () => {
      cancelled = true;
    };
  }, [property_id, reviewsPage, reviewsAvailable]);

  // STEP 10: rooms/offers — Check Availability, path + response shape
  // CONFIRMED (see stayService.js). Needs placeId in addition to
  // checkIn/checkOut now, since Xeni scopes availability by place_id +
  // property_id rather than hotel_id alone.
  useEffect(() => {
    if (!property_id || !placeId || !checkIn || !checkOut) return;
    let cancelled = false;
    setRoomsLoading(true);

    getHotelRooms({ placeId, propertyId: property_id, checkIn, checkOut })
      .then(({ list }) => {
        if (!cancelled) setRooms(list);
      })
      .catch(() => {
        if (!cancelled) setRoomsAvailable(false);
      })
      .finally(() => {
        if (!cancelled) setRoomsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [property_id, placeId, checkIn, checkOut]);

  // STEP 11: proceed to booking with the selected room type + rate plan.
  // Each rate's beds[] carries its own opaque availability_token (per
  // stayService.js) — that's almost certainly what Get Price Confirmation
  // (step 5) needs, so it's forwarded through the URL unmodified. Only
  // the first bed option is pre-selected here; swap in a real bed picker
  // if a room ever offers more than one bed configuration worth choosing
  // between.
  const handleBook = useCallback(
    (room, rate) => {
      const bed = rate?.beds?.[0];
      const params = new URLSearchParams({
        propertyId: property_id,
        placeId,
        checkIn,
        checkOut,
        roomId: room?.id || "",
        bedName: bed?.name || "",
        availabilityToken: bed?.availabilityToken || "",
      });
      navigate(`/booking?${params.toString()}`);
    },
    [property_id, placeId, checkIn, checkOut, navigate],
  );

  const scrollToTab = useCallback((id) => {
    setActiveTab(id);
    const el = sectionRefs[id]?.current;
    if (!el) return;
    const offset = 64; // sticky tabbar height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Escape key closes the gallery lightbox, room details drawer, and/or
  // room plan lightbox. Left/Right arrows navigate the room plan
  // lightbox specifically, when it's open.
  useEffect(() => {
    if (!galleryOpen && !roomDetailsOpen && !roomPlanOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setGalleryOpen(false);
        setRoomDetailsOpen(null);
        setRoomPlanOpen(null);
        return;
      }
      if (!roomPlanOpen) return;
      if (e.key === "ArrowRight") nextRoomPlanImage();
      if (e.key === "ArrowLeft") prevRoomPlanImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    galleryOpen,
    roomDetailsOpen,
    roomPlanOpen,
    nextRoomPlanImage,
    prevRoomPlanImage,
  ]);

  // `details` is already the flat shape normalizePropertyDetails()
  // returns (stayService.js) — no more nested summary/propertyGallery/
  // reviewInfo/propertyContentSectionGroups to dig through.
  const images = details
    ? details.images?.large?.length
      ? details.images.large
      : details.images?.extraLarge?.length
        ? details.images.extraLarge
        : details.images?.thumbnail || []
    : [];
  // Xeni's Property Details has no free-text review blurb — only the
  // numeric score + sub-scores + count, all folded into `details.rating`.
  const reviewCountText =
    details?.rating?.count != null
      ? `${details.rating.count} review${details.rating.count === 1 ? "" : "s"}`
      : null;
  // Flat amenities list straight from Xeni — no nested group/section
  // structure to flatten anymore.
  const flatFacilities = details?.amenities || [];
  const visibleFacilities = facilitiesExpanded
    ? flatFacilities
    : flatFacilities.slice(0, 6);
  // Raw {type, description} policy entries — rendered as a plain list
  // in the Policies tab (see SectionGroupBlocks replacement below).
  const policyEntries = details?.policies || [];
  // A handful of curated highlight types make good horizontal-scroll
  // tiles; "headline" and "attractions" are long free-text/HTML blocks
  // better suited to the About/Location sections instead.
  const HIGHLIGHT_TILE_TYPES = {
    location: "Location",
    dining: "Dining",
    business_amenities: "Business",
    rooms: "Rooms",
  };
  const highlightTiles = (details?.highlights || [])
    .filter((h) => HIGHLIGHT_TILE_TYPES[h.type] && h.description)
    .map((h) => ({
      title: HIGHLIGHT_TILE_TYPES[h.type],
      description: h.description,
    }));

  // Rating sub-scores (0-5 scale, confirmed in the sample response) for
  // the Reviews tab's breakdown bars.
  const ratingRows = details?.subRatings
    ? [
        { label: "Cleanliness", raw: details.subRatings.cleanliness },
        { label: "Hotel condition", raw: details.subRatings.condition },
        { label: "Room comfort", raw: details.subRatings.comfort },
        { label: "Service & staff", raw: details.subRatings.service },
        { label: "Amenities", raw: details.subRatings.amenities },
      ].filter((r) => r.raw != null)
    : [];

  const overallRating = details?.rating?.score;
  // normalizePropertyDetails() already computes this label with the
  // same Excellent/Very Good/Good thresholds — reuse it directly instead
  // of recomputing.
  const overallRatingLabel = details?.rating?.label;

  // getHotelRooms() already returns one entry per room TYPE, each with
  // its own rates[] (one per rate plan). Find the single cheapest
  // room+rate pairing across all room types for the sidebar "recommended
  // deal" card — no more searching a flat list for the first non-sold-out
  // room, since sold-out is now per-room-type (rates.length === 0).
  const cheapestOffer = useMemo(() => {
    let best = null;
    rooms.forEach((room) => {
      (room.rates || []).forEach((rate) => {
        if (rate.price == null) return;
        if (!best || rate.price < best.rate.price) best = { room, rate };
      });
    });
    return best;
  }, [rooms]);

  // Bed configuration for the room details drawer. Xeni's Check
  // Availability response puts `beds[]` inside each RATE, not on the
  // room itself (a rate's beds[] are alternative configurations bookable
  // at that rate — e.g. "1 King Bed" OR "1 Twin Bed" — not beds present
  // simultaneously). Using the first rate's beds as representative for
  // the room-level summary shown in the drawer's spec row.
  const roomDrawerBedsLabel = useMemo(() => {
    const beds = roomDetailsOpen?.rates?.[0]?.beds || [];
    if (!beds.length) return null;
    return beds
      .map((b) => b.name)
      .filter(Boolean)
      .join(" or ");
  }, [roomDetailsOpen]);

  // Rooms tab: filter each room type's rates down to breakfast-inclusive
  // and/or free-cancellation ones, using the confirmed rate.boardBasis
  // and rate.refundable fields — not string-matching against a made-up
  // "tagline"/"features" field.
  const filteredRoomGroups = useMemo(() => {
    if (!breakfastOnly && !freeCancellationOnly) return rooms;
    return rooms
      .map((room) => ({
        ...room,
        rates: (room.rates || []).filter((r) => {
          if (
            breakfastOnly &&
            !(r.boardBasis || []).some((b) => /breakfast/i.test(b))
          ) {
            return false;
          }
          if (freeCancellationOnly && !r.refundable) return false;
          return true;
        }),
      }))
      .filter((room) => room.rates.length > 0);
  }, [rooms, breakfastOnly, freeCancellationOnly]);

  // Xeni's images{} only varies by RESOLUTION (thumbnail/small/large/
  // extra_large), not by category (no "lobby"/"room"/"exterior" split
  // like the old Hotels.com shape had) — the gallery is a single flat
  // set, so there's nothing to filter by category anymore.
  const galleryCategories = ["All Photos"];
  const galleryImages = images;

  const openGallery = () => {
    setGalleryTab("property");
    setGalleryCategory("All Photos");
    setGalleryOpen(true);
  };

  const address = details?.address
    ? [details.address.line1, details.address.city, details.address.state]
        .filter(Boolean)
        .join(", ")
    : "";
  const mapQuery = address ? encodeURIComponent(address) : "";
  const coords = details?.coordinates;

  // About section: Xeni's Property Details gives a handful of separate
  // free-text/HTML fields (headline, locationSummary, roomsSummary,
  // dining, businessAmenities, attractionsHtml) rather than the old
  // Hotels.com nested sub-tab/bullet structure — collect whichever of
  // them are present into a flat list of paragraphs, plus
  // accessibilities as a bullet list, and show a short preview
  // ("View More" collapsed) vs. the full set.
  const aboutParagraphs = useMemo(() => {
    if (!details) return [];
    return [
      details.roomsSummary,
      details.locationSummary,
      details.dining,
      details.businessAmenities,
    ].filter(Boolean);
  }, [details]);
  const ABOUT_PREVIEW_COUNT = 2;
  const visibleAboutParagraphs = aboutExpanded
    ? aboutParagraphs
    : aboutParagraphs.slice(0, ABOUT_PREVIEW_COUNT);

  return (
    <>
      <HotelHeader />
      <div className="app">
        <StayStyles />
        <HotelDetailsStyles />
        {/* <Header /> */}

        {!loading && (
          <div className="dp-tabbar">
            <div className="dp-tabbar-inner">
              {TOP_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`dp-tab${activeTab === t.id ? " active" : ""}`}
                  onClick={() => scrollToTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          className="back-link"
          onClick={() => navigate(-1)}
        >
          ← Back to results
        </button>

        {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}

        {loading && (
          <>
            <div className="detail-hero">
              <div className="detail-hero-main tag-skeleton-block" />
            </div>
            <div className="detail-head">
              <div
                className="tag-skeleton-line mb-3"
                style={{ width: "45%", height: 22 }}
              />
              <div className="tag-skeleton-line" style={{ width: "28%" }} />
            </div>
            <section className="detail-section">
              <div
                className="tag-skeleton-line mb-4"
                style={{ width: "22%", height: 16 }}
              />
              <div
                className="tag-skeleton-line mb-2"
                style={{ width: "100%" }}
              />
              <div
                className="tag-skeleton-line mb-2"
                style={{ width: "92%" }}
              />
              <div className="tag-skeleton-line" style={{ width: "70%" }} />
            </section>
          </>
        )}

        {!loading && (
          <>
            {/* Name, star rating, hero photos, and address now come from
                `details` (Property Details, step 4, CONFIRMED). Rooms
                (below) render independently of this block, since Rooms
                (step 3) works standalone even if Property Details fails
                (detailsAvailable === false). */}
            {details && (
              <>
                <div className="dp-head-top container">
                  <div className="dp-name-row">
                    <h1 className="detail-name">{details.name}</h1>
                    {details.starRating != null && (
                      <span className="dp-stars">
                        {"★".repeat(Math.round(details.starRating))}
                      </span>
                    )}
                    {/* Static marketing badge — matches the reference
                        design, not tied to a confirmed API field. */}
                    <span className="dp-guarantee">
                      <IconRupee /> Best Price Guarantee
                    </span>
                  </div>
                  <div className="dp-head-actions">
                    <button
                      type="button"
                      className="dp-icon-btn"
                      onClick={() => setSaved((s) => !s)}
                    >
                      <IconHeart fill={saved ? "currentColor" : "none"} />{" "}
                      {saved ? "Saved" : "Save"}
                    </button>
                    <button
                      type="button"
                      className="dp-icon-btn"
                      onClick={() =>
                        navigator.share?.({
                          title: details.name,
                          url: window.location.href,
                        })
                      }
                    >
                      <IconShare /> Share
                    </button>
                  </div>
                </div>

                {address && (
                  <div className="dp-address-row">
                    <span className="dp-address-icon">
                      <IconPin />
                    </span>
                    <div>
                      <p className="detail-loc">{address}</p>
                      <button
                        type="button"
                        className="dp-map-link"
                        onClick={() => scrollToTab("location")}
                      >
                        View on map
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="dp-hero-grid">
              {images.length > 0 && (
                <div className="detail-hero">
                  <img
                    className="detail-hero-main"
                    src={images[0]?.url}
                    alt={images[0]?.alt || details?.name}
                    onClick={openGallery}
                  />
                  {images.length > 1 && (
                    <div className="detail-hero-strip">
                      {images.slice(1, 3).map((img, idx, arr) => {
                        const isLast = idx === arr.length - 1;
                        return (
                          <div
                            className="hero-thumb-wrap"
                            key={idx}
                            onClick={openGallery}
                          >
                            <img src={img.url} alt={img.alt || details?.name} />
                            {isLast && images.length > 3 && (
                              <button
                                type="button"
                                className="hero-see-all-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openGallery();
                                }}
                              >
                                See All Photos ›
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="dp-hero-sidebar">
                {cheapestOffer && (
                  <div className="dp-deal-card">
                    <div className="dp-deal-top">
                      {cheapestOffer.room.images?.[0] && (
                        <div className="dp-deal-thumb">
                          <img
                            src={cheapestOffer.room.images[0].url}
                            alt={
                              cheapestOffer.room.images[0].alt ||
                              cheapestOffer.room.name
                            }
                          />
                        </div>
                      )}
                      <div className="dp-deal-info">
                        <span className="dp-deal-tag">Recommended Deal</span>
                        <p className="dp-deal-title">
                          {cheapestOffer.room.name}
                        </p>
                      </div>
                    </div>
                    <div className="dp-deal-body">
                      <div className="dp-deal-perks">
                        {cheapestOffer.rate.refundable ? (
                          <span className="dp-deal-perk allow">
                            <IconCheck />{" "}
                            {(() => {
                              const deadline = formatCancelDeadline(
                                cheapestOffer.rate.cancellationPolicy?.[0]?.end,
                              );
                              return deadline
                                ? `Free Cancellation till ${deadline}`
                                : "Free Cancellation";
                            })()}
                            <IconInfo className="dp-deal-perk-info" />
                          </span>
                        ) : (
                          <span className="dp-deal-perk deny">
                            <IconCross /> Non-refundable
                          </span>
                        )}
                        {[
                          ...(cheapestOffer.rate.boardBasis || []),
                          ...(cheapestOffer.rate.extras || []),
                        ]
                          .slice(0, 2)
                          .map((f, i) => (
                            <span className="dp-deal-perk allow" key={i}>
                              <IconCheck /> {f}
                            </span>
                          ))}
                        {/* Static marketing perk — matches the reference
                            design, not tied to a confirmed payment-plan
                            field, same treatment as the guarantee ribbon. */}
                        <span className="dp-deal-perk allow">
                          <IconCheck /> Book with ₹0
                        </span>
                      </div>
                      <div className="dp-deal-price-row">
                        {cheapestOffer.rate.originalPrice >
                          cheapestOffer.rate.price && (
                          <span className="dp-deal-strike">
                            {formatPrice(cheapestOffer.rate.originalPrice)}
                          </span>
                        )}
                        <span className="dp-deal-price">
                          {formatPrice(cheapestOffer.rate.price)}
                        </span>
                      </div>
                      <p className="dp-deal-taxes">
                        + {formatPrice(cheapestOffer.rate.taxes)} taxes &amp;
                        fees, per night for 1 room
                      </p>
                      <button
                        type="button"
                        className="dp-deal-cta primary"
                        onClick={() =>
                          handleBook(cheapestOffer.room, cheapestOffer.rate)
                        }
                      >
                        Reserve 1 Room
                      </button>
                      <button
                        type="button"
                        className="dp-deal-cta secondary"
                        onClick={() => scrollToTab("rooms")}
                      >
                        View All Rooms
                      </button>
                    </div>
                  </div>
                )}

                {overallRating != null && (
                  <div
                    className="dp-rating-card"
                    onClick={() => scrollToTab("reviews")}
                  >
                    <span className="dp-rating-badge">{overallRating}</span>
                    <div className="dp-rating-text">
                      <p className="dp-rating-label">
                        {overallRatingLabel || "Rated"}
                        {details?.rating?.count != null
                          ? ` · ${details.rating.count} Ratings`
                          : ""}
                      </p>
                      <p className="dp-rating-sub">
                        See what recent guests are saying
                      </p>
                    </div>
                    <span className="dp-rating-chevron">
                      <IconChevronDown />
                    </span>
                  </div>
                )}

                {reviews[0] && (
                  <div
                    className="dp-quote-card"
                    onClick={() => scrollToTab("reviews")}
                  >
                    <h3>Guests are saying</h3>
                    <div className="dp-quote-row">
                      <p className="dp-quote-title">
                        {reviews[0].title || reviews[0].text}
                      </p>
                      <span className="dp-quote-chevron">
                        <IconChevronRight />
                      </span>
                    </div>
                    <div className="dp-quote-meta">
                      {reviews[0].countryFlag && (
                        <span className="dp-quote-flag">
                          {reviews[0].countryFlag}
                        </span>
                      )}
                      <span>
                        {[
                          reviews[0].travelerType,
                          reviews[0].country,
                          reviews[0].date || reviews[0].publishedDate,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {highlightTiles.length > 0 && (
              <div className="dp-highlights-wrap">
                <div className="dp-highlights" ref={highlightsRef}>
                  {highlightTiles.map((f, i) => (
                    <div className="dp-highlight-tile" key={i}>
                      <div className="dp-highlight-icon">
                        <IconDot />
                      </div>
                      <div>
                        <p className="dp-highlight-title">{f.title}</p>
                        <p className="dp-highlight-sub">
                          <Html html={f.description} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {highlightTiles.length > 3 && (
                  <button
                    type="button"
                    className="dp-highlights-next"
                    onClick={scrollHighlights}
                    aria-label="Show more highlights"
                  >
                    ›
                  </button>
                )}
              </div>
            )}

            <div className="dp-layout">
              <div className="dp-main">
                {/* ---------------- OVERVIEW ---------------- */}
                <section className="detail-section" ref={sectionRefs.overview}>
                  <h2>About</h2>
                  {details?.headline && (
                    <p className="tag-subtitle">{details.headline}</p>
                  )}

                  {aboutParagraphs.length > 0 ? (
                    <>
                      <ul className="dp-about-list">
                        {visibleAboutParagraphs.map((text, m) => (
                          <li key={m}>
                            <Html html={text} />
                          </li>
                        ))}
                      </ul>
                      {aboutParagraphs.length > ABOUT_PREVIEW_COUNT && (
                        <button
                          type="button"
                          className="dp-view-more"
                          onClick={() => setAboutExpanded((v) => !v)}
                        >
                          {aboutExpanded ? "Show less" : "View More"}{" "}
                          <IconChevronRight
                            style={{
                              transform: aboutExpanded
                                ? "rotate(90deg)"
                                : "none",
                            }}
                          />
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="placeholder">
                      {detailsAvailable
                        ? "Overview details aren't available yet."
                        : "Property details couldn't be loaded right now."}
                    </p>
                  )}

                  {details?.accessibilities?.length > 0 && (
                    <>
                      <h2 className="facilities-heading">Good to know</h2>
                      <ul className="dp-about-list">
                        {details.accessibilities.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {flatFacilities.length > 0 && (
                    <>
                      <h2 className="facilities-heading">Popular Facilities</h2>
                      <div className="facility-icon-grid">
                        {visibleFacilities.map((label, i) => {
                          const Icon = facilityIcon(label);
                          return (
                            <div className="facility-icon-item" key={i}>
                              <div className="facility-icon">
                                <Icon />
                              </div>
                              <span className="facility-icon-label">
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {flatFacilities.length > 6 && (
                        <button
                          type="button"
                          className="dp-view-more"
                          onClick={() => setFacilitiesExpanded((v) => !v)}
                        >
                          {facilitiesExpanded
                            ? "Show less"
                            : `View ${flatFacilities.length - 6}+ More`}{" "}
                          <IconChevronDown
                            style={{
                              transform: facilitiesExpanded
                                ? "rotate(180deg)"
                                : "none",
                            }}
                          />
                        </button>
                      )}
                    </>
                  )}
                </section>

                {/* ---------------- ROOMS ---------------- */}
                {roomsAvailable && (
                  <section
                    className="detail-section rm-section"
                    ref={sectionRefs.rooms}
                  >
                    <h2>Select your room</h2>
                    <div className="rm-toolbar">
                      <button
                        type="button"
                        className={`rm-filter-pill${freeCancellationOnly ? " active" : ""}`}
                        onClick={() => setFreeCancellationOnly((v) => !v)}
                      >
                        Free Cancellation
                      </button>
                      <button
                        type="button"
                        className={`rm-filter-pill${breakfastOnly ? " active" : ""}`}
                        onClick={() => setBreakfastOnly((v) => !v)}
                      >
                        Breakfast Included
                      </button>
                    </div>

                    {rooms.length > 0 && (
                      <div className="rm-table-head">
                        <span className="rm-table-head-type">
                          {rooms.length} Room Type
                          {rooms.length > 1 ? "s" : ""}
                        </span>
                        <span className="rm-table-head-options">Options</span>
                        <span className="rm-table-head-price">Price</span>
                      </div>
                    )}

                    {roomsLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div className="room-card" key={i}>
                          <div style={{ flex: 1 }}>
                            <div
                              className="tag-skeleton-line mb-2"
                              style={{ width: "45%", height: 14 }}
                            />
                            <div
                              className="tag-skeleton-line"
                              style={{ width: "65%" }}
                            />
                          </div>
                          <div
                            className="tag-skeleton-line"
                            style={{ width: 64, height: 20 }}
                          />
                        </div>
                      ))
                    ) : filteredRoomGroups.length > 0 ? (
                      filteredRoomGroups.map((room) => {
                        const rateCount = room.soldOut
                          ? 1
                          : Math.max(room.rates.length, 1);
                        return (
                          <div
                            className="rm-room-grid"
                            key={room.id}
                            style={{
                              gridTemplateRows: `repeat(${rateCount}, auto)`,
                            }}
                          >
                            {/* Room info cell — spans every rate row for this room type */}
                            <div
                              className="rm-room-info"
                              style={{ gridRow: `1 / span ${rateCount}` }}
                            >
                              {room.images?.[0] && (
                                <button
                                  type="button"
                                  className="rm-room-photo"
                                  onClick={() => openRoomPlan(room)}
                                  aria-label={`View all photos of ${room.name}`}
                                >
                                  <img
                                    src={room.images[0].url}
                                    alt={room.images[0].alt || room.name}
                                    loading="lazy"
                                  />
                                  {room.images.length > 0 && (
                                    <span className="rm-photo-badge">
                                      <IconCamera />{" "}
                                      {photoCountLabel(room.images.length)}
                                    </span>
                                  )}
                                </button>
                              )}
                              <p className="rm-room-name">{room.name}</p>
                              <div className="rm-room-specs">
                                {room.areaSqM != null && (
                                  <span>{room.areaSqM} sq. mt.</span>
                                )}
                                {room.rates?.[0]?.beds?.length > 0 && (
                                  <span>
                                    {room.rates[0].beds
                                      .map((b) => b.name)
                                      .join(" or ")}
                                  </span>
                                )}
                                {room.sleeps != null && (
                                  <span>Sleeps {room.sleeps}</span>
                                )}
                              </div>
                              {room.amenities?.length > 0 && (
                                <div className="rm-room-amenities">
                                  {room.amenities.slice(0, 6).map((a, i) => (
                                    <span key={i}>
                                      <IconCheck /> {a}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <button
                                type="button"
                                className="rm-view-details-link"
                                onClick={() => setRoomDetailsOpen(room)}
                              >
                                View Details
                              </button>
                            </div>

                            {room.soldOut ? (
                              <div
                                className="rm-sold-out"
                                style={{ gridRow: 1 }}
                              >
                                Sold out for these dates
                              </div>
                            ) : (
                              room.rates.map((rate, ri) => {
                                const pct = discountPercent(rate);
                                const cancelBy = rate.refundable
                                  ? formatCancelDeadline(
                                      rate.cancellationPolicy?.[0]?.end,
                                    )
                                  : null;
                                const perks = [
                                  ...(rate.boardBasis || []),
                                  ...(rate.extras || []),
                                ];
                                return (
                                  <Fragment
                                    key={
                                      rate.beds?.[0]?.availabilityToken || ri
                                    }
                                  >
                                    <div
                                      className="rm-options-cell"
                                      style={{ gridRow: ri + 1 }}
                                    >
                                      <h4>{rateCardTitle(rate)}</h4>
                                      <div className="rm-perks-wrap">
                                        {cancelBy ? (
                                          <span className="rm-perk allow">
                                            <IconCheck /> Free Cancellation till{" "}
                                            {cancelBy}
                                          </span>
                                        ) : (
                                          <span className="rm-perk deny">
                                            <IconCross /> Non-refundable
                                          </span>
                                        )}
                                        {perks.map((p, k) => (
                                          <span
                                            className="rm-perk allow"
                                            key={k}
                                          >
                                            <IconCheck /> {p}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    <div
                                      className="rm-price-cell"
                                      style={{ gridRow: ri + 1 }}
                                    >
                                      {pct != null && (
                                        <span className="rm-discount-pill">
                                          {pct}% off
                                        </span>
                                      )}
                                      <div className="rm-price-block">
                                        {rate.originalPrice > rate.price && (
                                          <span className="rm-price-strike">
                                            {formatPrice(rate.originalPrice)}
                                          </span>
                                        )}
                                        <span className="rm-price">
                                          {formatPrice(rate.price)}
                                        </span>
                                      </div>
                                      {rate.taxes != null && (
                                        <p className="rm-price-taxes">
                                          + {formatPrice(rate.taxes)} taxes
                                          &amp; fees
                                          <br />
                                          per night for 1 room
                                        </p>
                                      )}
                                      <button
                                        type="button"
                                        className="rm-reserve-btn"
                                        onClick={() => handleBook(room, rate)}
                                      >
                                        Reserve 1 Room
                                      </button>
                                    </div>
                                  </Fragment>
                                );
                              })
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="placeholder">
                        No rooms loaded for these dates yet.
                      </p>
                    )}

                    <style>{`
                      .rm-toolbar { display: flex; gap: 10px; margin: 12px 0 20px; flex-wrap: wrap; }
                      .rm-filter-pill {
                        border: 1px solid #d8dbe0; background: #fff; border-radius: 20px;
                        padding: 8px 16px; font-size: 0.85rem; font-weight: 600; color: #17181c;
                        cursor: pointer; font-family: inherit;
                      }
                      .rm-filter-pill.active { background: #17181c; color: #fff; border-color: #17181c; }
                      .rm-table-head {
                        display: grid; grid-template-columns: 300px 1fr 220px;
                        background: #f4f5f5; padding: 14px 16px; border-radius: 8px 8px 0 0;
                        font-weight: 700; font-size: 0.85rem; color: #17181c;
                      }
                      .rm-room-grid {
                        display: grid; grid-template-columns: 300px 1fr 220px;
                        border: 1px solid #eceef1; border-top: none;
                      }
                      .rm-room-info {
                        grid-column: 1; padding: 18px; border-right: 1px solid #eceef1;
                      }
                      .rm-room-photo {
                        position: relative; display: block; width: 100%; border: none; padding: 0;
                        cursor: pointer; border-radius: 8px; overflow: hidden; background: #eceef1;
                      }
                      .rm-room-photo img { width: 100%; height: 130px; object-fit: cover; display: block; }
                      .rm-photo-badge {
                        position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.65);
                        color: #fff; font-size: 0.72rem; font-weight: 700; padding: 3px 8px;
                        border-radius: 20px; display: flex; align-items: center; gap: 4px;
                      }
                      .rm-room-name { font-weight: 700; font-size: 1rem; margin: 12px 0 4px; color: #17181c; }
                      .rm-room-specs {
                        display: flex; flex-wrap: wrap; gap: 10px; font-size: 0.78rem;
                        color: #5e616e; margin-bottom: 10px;
                      }
                      .rm-room-amenities {
                        display: flex; flex-direction: column; gap: 6px; font-size: 0.8rem;
                        color: #17181c; margin-bottom: 10px;
                      }
                      .rm-room-amenities span { display: flex; align-items: center; gap: 6px; }
                      .rm-room-amenities svg { flex-shrink: 0; }
                      .rm-view-details-link {
                        border: none; background: none; color: #fc790d; font-weight: 700;
                        font-size: 0.85rem; padding: 0; cursor: pointer; font-family: inherit;
                      }
                      .rm-sold-out {
                        grid-column: 2 / span 2; display: flex; align-items: center;
                        padding: 18px; color: #b3261e; font-weight: 600; font-size: 0.9rem;
                      }
                      .rm-options-cell {
                        grid-column: 2; padding: 18px; border-right: 1px solid #eceef1;
                        border-bottom: 1px solid #eceef1;
                      }
                      .rm-room-grid > .rm-options-cell:last-of-type,
                      .rm-room-grid > .rm-price-cell:last-of-type { border-bottom: none; }
                      .rm-options-cell h4 { margin: 0 0 10px; font-size: 0.95rem; font-weight: 700; color: #17181c; }
                      .rm-perks-wrap { display: flex; flex-wrap: wrap; gap: 8px 18px; }
                      .rm-perk {
                        display: flex; align-items: center; gap: 5px; font-size: 0.82rem;
                        white-space: nowrap;
                      }
                      .rm-perk.allow { color: #1e8e3e; }
                      .rm-perk.deny { color: #b3261e; }
                      .rm-perk:not(.allow):not(.deny) { color: #17181c; }
                      .rm-price-cell {
                        grid-column: 3; padding: 18px; border-bottom: 1px solid #eceef1;
                        display: flex; flex-direction: column; align-items: flex-start; gap: 6px;
                      }
                      .rm-discount-pill {
                        background: #fdecec; color: #b3261e; font-size: 0.72rem; font-weight: 700;
                        padding: 3px 9px; border-radius: 20px;
                      }
                      .rm-price-block { display: flex; align-items: baseline; gap: 8px; }
                      .rm-price-strike { font-size: 0.8rem; color: #9aa0aa; text-decoration: line-through; }
                      .rm-price { font-size: 1.2rem; font-weight: 700; color: #17181c; }
                      .rm-price-taxes { margin: 0; font-size: 0.72rem; color: #5e616e; }
                      .rm-reserve-btn {
                        border: none; background: #fc790d; color: #fff; font-weight: 700;
                        font-size: 0.85rem; padding: 10px 16px; border-radius: 8px; cursor: pointer;
                        margin-top: 4px; width: 100%;
                      }
                      .rm-reserve-btn:hover { filter: brightness(0.94); }
                      @media (max-width: 760px) {
                        .rm-table-head { display: none; }
                        .rm-room-grid, .rm-room-info, .rm-sold-out, .rm-options-cell, .rm-price-cell {
                          grid-column: 1 !important; grid-row: auto !important;
                        }
                        .rm-room-grid { grid-template-columns: 1fr; }
                      }
                    `}</style>
                  </section>
                )}

                {/* ---------------- LOCATION ---------------- */}
                <section className="detail-section" ref={sectionRefs.location}>
                  <h2>Location</h2>
                  {address ? (
                    <p>{address}</p>
                  ) : (
                    <p className="placeholder">
                      Location details aren't available yet.
                    </p>
                  )}
                  {mapQuery && (
                    <iframe
                      className="dp-map-preview location-map-embed"
                      title="Hotel location map"
                      src={
                        coords?.latitude && coords?.longitude
                          ? `https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}&z=15&output=embed`
                          : `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`
                      }
                      loading="lazy"
                    />
                  )}
                </section>

                {/* ---------------- REVIEWS ---------------- */}
                <section className="detail-section" ref={sectionRefs.reviews}>
                  <h2>Reviews</h2>
                  {overallRating != null && (
                    <div className="rating-row">
                      <div className="rating-big">{overallRating ?? "—"}</div>
                      <div className="rating-bars">
                        {ratingRows.map((row, i) => (
                          <div className="rating-bar-row" key={i}>
                            <span>{row.label}</span>
                            <div className="rating-bar-track">
                              <div
                                className="rating-bar-fill"
                                style={{ width: `${(row.raw / 5) * 100}%` }}
                              />
                            </div>
                            <span>{row.raw}/5</span>
                          </div>
                        ))}
                        {reviewCountText && (
                          <p className="tag-subtitle">{reviewCountText}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {reviewsAvailable && (
                    <>
                      {reviews.map((r, i) => (
                        <div className="review-card" key={r.id || i}>
                          <div className="review-head">
                            <span className="review-author">
                              {r.author || r.userName}
                            </span>
                            <span className="review-date">
                              {r.date || r.publishedDate}
                            </span>
                          </div>
                          {r.title && <p className="review-title">{r.title}</p>}
                          <p className="review-text">{r.text}</p>
                        </div>
                      ))}
                      {reviews.length === 0 && !reviewsLoading && (
                        <p className="placeholder">
                          No individual reviews loaded yet.
                        </p>
                      )}
                      <button
                        type="button"
                        className="load-more"
                        disabled={reviewsLoading}
                        onClick={() => setReviewsPage((p) => p + 1)}
                      >
                        {reviewsLoading ? "Loading…" : "Load more reviews"}
                      </button>
                    </>
                  )}
                </section>

                {/* ---------------- FACILITIES ---------------- */}
                <section
                  className="detail-section"
                  ref={sectionRefs.facilities}
                >
                  <h2>Facilities</h2>
                  {flatFacilities.length > 0 ? (
                    <div className="amenity-grid">
                      {flatFacilities.map((label, i) => (
                        <div className="amenity-item" key={i}>
                          {label}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="placeholder">
                      {detailsAvailable
                        ? "Facility details aren't available yet."
                        : "Property details couldn't be loaded right now."}
                    </p>
                  )}
                </section>

                {/* ---------------- POLICIES ---------------- */}
                <section className="detail-section" ref={sectionRefs.policies}>
                  <h2>Policies</h2>
                  {details?.checkIn || details?.checkOutTime ? (
                    <div className="policy-section">
                      <p className="policy-subtitle">Check-in / Check-out</p>
                      <ul className="policy-list">
                        {details.checkIn?.beginTime &&
                          details.checkIn?.endTime && (
                            <li>
                              Check-in: {details.checkIn.beginTime} –{" "}
                              {details.checkIn.endTime}
                            </li>
                          )}
                        {details.checkOutTime && (
                          <li>Check-out: before {details.checkOutTime}</li>
                        )}
                        {details.checkIn?.minAge && (
                          <li>
                            Minimum check-in age: {details.checkIn.minAge}
                          </li>
                        )}
                      </ul>
                      {details.checkIn?.specialInstructions && (
                        <p className="policy-subtitle">
                          {details.checkIn.specialInstructions}
                        </p>
                      )}
                      {/* instructionsHtml is raw supplier HTML — see
                          normalizePropertyDetails() in stayService.js.
                          Rendered as-is via the Html helper, same
                          treatment as descriptionHtml elsewhere on this
                          page; consider a sanitizer before shipping. */}
                      {details.checkIn?.instructionsHtml && (
                        <Html html={details.checkIn.instructionsHtml} />
                      )}
                    </div>
                  ) : null}

                  {policyEntries.length > 0 ? (
                    <div className="policy-section">
                      {policyEntries
                        .filter(
                          (p) =>
                            ![
                              "check_in_begin_time",
                              "check_in_end_time",
                              "check_in_min_age",
                              "check_in_special_instructions",
                              "check_in_instructions",
                              "check_out_time",
                            ].includes(p.type),
                        )
                        .map((p, i) => (
                          <div key={i}>
                            <p className="policy-subtitle">
                              {p.type
                                .split("_")
                                .map((w) => w[0]?.toUpperCase() + w.slice(1))
                                .join(" ")}
                            </p>
                            <Html html={p.description} />
                          </div>
                        ))}
                    </div>
                  ) : (
                    !details?.checkIn &&
                    !details?.checkOutTime && (
                      <p className="placeholder">
                        {detailsAvailable
                          ? "Policy details aren't available yet."
                          : "Property details couldn't be loaded right now."}
                      </p>
                    )
                  )}
                </section>
              </div>

              {/* ---------------- SIDEBAR ---------------- */}
              <div className="dp-sidebar">
                {mapQuery && (
                  <div className="dp-map-card">
                    <iframe
                      className="dp-map-preview"
                      title="Map preview"
                      src={
                        coords?.latitude && coords?.longitude
                          ? `https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}&z=14&output=embed`
                          : `https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`
                      }
                      loading="lazy"
                    />
                    <div className="dp-map-card-foot">
                      <button
                        type="button"
                        onClick={() => scrollToTab("location")}
                      >
                        View on Map
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ---------------- PHOTO LIGHTBOX ---------------- */}
        {galleryOpen && (
          <div className="gallery-overlay" role="dialog" aria-modal="true">
            <div className="gallery-header">
              <div className="gallery-toggle">
                <button
                  type="button"
                  className={galleryTab === "property" ? "active" : ""}
                  onClick={() => setGalleryTab("property")}
                >
                  Property Photos
                </button>
                <button
                  type="button"
                  className={galleryTab === "guest" ? "active" : ""}
                  onClick={() => setGalleryTab("guest")}
                >
                  Guest Photos
                </button>
              </div>
              <button
                type="button"
                className="gallery-close"
                onClick={() => setGalleryOpen(false)}
                aria-label="Close gallery"
              >
                <IconClose />
              </button>
            </div>

            {galleryTab === "property" ? (
              <>
                {galleryCategories.length > 1 && (
                  <div className="gallery-categories">
                    {galleryCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`gallery-cat-btn${galleryCategory === cat ? " active" : ""}`}
                        onClick={() => setGalleryCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                {galleryImages.length > 0 ? (
                  <div className="gallery-grid">
                    {galleryImages.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt={img.alt || details?.name}
                        loading="lazy"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="gallery-empty">
                    No photos in this category yet.
                  </p>
                )}
              </>
            ) : (
              <p className="gallery-empty">
                No guest photos yet — be the first to share one after your stay.
              </p>
            )}
          </div>
        )}

        {/* ---------------- ROOM PLAN LIGHTBOX ---------------- */}
        {/* Full-screen black lightbox, opened by clicking a room's
            thumbnail in the Rooms list (distinct from the "View Details"
            drawer below it). */}
        {roomPlanOpen && (
          <div
            className="rp-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Room plan"
          >
            <div className="rp-header">
              <button
                type="button"
                className="rp-close"
                onClick={closeRoomPlan}
                aria-label="Close room plan"
              >
                <IconClose />
              </button>
              <h2 className="rp-title">Room plan</h2>
              <span className="rp-header-spacer" aria-hidden="true" />
            </div>

            <div className="rp-main">
              {roomPlanImages.length > 1 && (
                <button
                  type="button"
                  className="rp-nav rp-nav-prev"
                  onClick={prevRoomPlanImage}
                  aria-label="Previous photo"
                >
                  ‹
                </button>
              )}
              {roomPlanImages[roomPlanIndex] && (
                <img
                  className="rp-image"
                  src={roomPlanImages[roomPlanIndex].url}
                  alt={roomPlanImages[roomPlanIndex].alt || roomPlanOpen.name}
                />
              )}
              {roomPlanImages.length > 1 && (
                <button
                  type="button"
                  className="rp-nav rp-nav-next"
                  onClick={nextRoomPlanImage}
                  aria-label="Next photo"
                >
                  ›
                </button>
              )}
            </div>

            {roomPlanImages.length > 1 && (
              <div className="rp-thumb-strip">
                {roomPlanImages.map((img, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`rp-thumb${i === roomPlanIndex ? " active" : ""}`}
                    onClick={() => setRoomPlanIndex(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={i === roomPlanIndex}
                  >
                    <img src={img.url} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            <style>{`
              .rp-overlay {
                position: fixed; inset: 0; background: #000; z-index: 1100;
                display: flex; flex-direction: column;
              }
              .rp-header {
                display: flex; align-items: center; justify-content: space-between;
                padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.15);
              }
              .rp-title { color: #fff; font-size: 1.15rem; font-weight: 700; margin: 0; }
              .rp-header-spacer { width: 22px; }
              .rp-close { border: none; background: none; color: #fff; cursor: pointer; padding: 4px; }
              .rp-main {
                flex: 1; display: flex; align-items: center; justify-content: center;
                position: relative; padding: 24px; min-height: 0;
              }
              .rp-image {
                max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px;
              }
              .rp-nav {
                position: absolute; top: 50%; transform: translateY(-50%);
                width: 44px; height: 44px; border-radius: 50%; border: none;
                background: rgba(255,255,255,0.15); color: #fff; font-size: 1.6rem;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
              }
              .rp-nav:hover { background: rgba(255,255,255,0.28); }
              .rp-nav-prev { left: 24px; }
              .rp-nav-next { right: 24px; }
              .rp-thumb-strip {
                display: flex; gap: 10px; padding: 16px 24px 24px; overflow-x: auto;
                justify-content: center;
              }
              .rp-thumb {
                flex: 0 0 auto; width: 84px; height: 60px; border-radius: 6px; overflow: hidden;
                border: 2px solid transparent; padding: 0; cursor: pointer; background: none;
                opacity: 0.6;
              }
              .rp-thumb.active { border-color: #fff; opacity: 1; }
              .rp-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
            `}</style>
          </div>
        )}

        {/* ---------------- ROOM DETAILS DRAWER ---------------- */}
        {/* Slides in from the right, per the reference design: left side
            is the photo carousel + specs + amenities for the ROOM
            (room-level data), right side lists one card per RATE PLAN
            (rate.rates[]) with its own cancellation terms, perks, and
            price. Styled inline (rd- prefixed classes) since neither
            Staystyles.jsx nor HotelDetailsStyles defines this layout —
            send it over if you'd rather these rules live there instead. */}
        {roomDetailsOpen && (
          <div
            className="rd-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`${roomDetailsOpen.name || "Room"} details`}
            onClick={() => setRoomDetailsOpen(null)}
          >
            <div className="rd-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="rd-drawer-header">
                <h2 className="rd-drawer-title">{roomDetailsOpen.name}</h2>
                <button
                  type="button"
                  className="rd-close-btn"
                  onClick={() => setRoomDetailsOpen(null)}
                  aria-label="Close room details"
                >
                  <IconClose />
                </button>
              </div>

              <div className="rd-body">
                {/* ---------------- LEFT: photos, specs, amenities ---------------- */}
                <div className="rd-left">
                  {roomDetailsOpen.images?.length > 0 ? (
                    <div className="rd-carousel">
                      <div
                        className="rd-carousel-scroll"
                        ref={roomImageScrollRef}
                        onScroll={handleRoomImageScroll}
                      >
                        {roomDetailsOpen.images.map((img, i) => (
                          <img
                            key={i}
                            src={img.url}
                            alt={
                              img.alt ||
                              roomDetailsOpen.name ||
                              `Room photo ${i + 1}`
                            }
                            loading={i === 0 ? "eager" : "lazy"}
                          />
                        ))}
                      </div>
                      {roomDetailsOpen.images.length > 1 && (
                        <div
                          className="rd-carousel-dots"
                          role="group"
                          aria-label="Photo navigation"
                        >
                          {roomDetailsOpen.images.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              className={`rd-dot${i === roomImageIndex ? " active" : ""}`}
                              aria-label={`Show photo ${i + 1}`}
                              aria-current={i === roomImageIndex}
                              onClick={() => goToRoomImage(i)}
                            />
                          ))}
                        </div>
                      )}
                      <span className="rd-photo-count">
                        <IconCamera />{" "}
                        {photoCountLabel(roomDetailsOpen.images.length)}
                      </span>
                    </div>
                  ) : (
                    <div className="rd-carousel rd-carousel-empty">
                      No photos available for this room.
                    </div>
                  )}

                  <h3 className="rd-room-name">{roomDetailsOpen.name}</h3>
                  <div className="rd-specs-row">
                    {roomDetailsOpen.areaSqM != null && (
                      <span>{roomDetailsOpen.areaSqM} sq. mt.</span>
                    )}
                    {roomDrawerBedsLabel && <span>{roomDrawerBedsLabel}</span>}
                    {roomDetailsOpen.sleeps != null && (
                      <span>Sleeps {roomDetailsOpen.sleeps}</span>
                    )}
                  </div>

                  {roomDetailsOpen.amenities?.length > 0 && (
                    <>
                      <h4 className="rd-amenities-title">Amenities</h4>
                      <div className="rd-amenities-grid">
                        {roomDetailsOpen.amenities.map((a, i) => (
                          <span className="rd-amenity" key={i}>
                            <IconCheck /> {a}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {/* descriptionHtml is raw supplier HTML (see
                      stayService.js — Xeni's Check Availability
                      response). Rendered as-is via the Html helper, same
                      as the other API-sourced HTML fragments on this
                      page; consider a sanitizer (e.g. DOMPurify) before
                      shipping, since it's third-party content. */}
                  {roomDetailsOpen.descriptionHtml && (
                    <div className="rd-description">
                      <Html html={roomDetailsOpen.descriptionHtml} />
                    </div>
                  )}
                </div>

                {/* ---------------- RIGHT: rate plan cards ---------------- */}
                <div className="rd-right">
                  {(roomDetailsOpen.rates || []).length > 0 ? (
                    roomDetailsOpen.rates.map((rate, i) => {
                      const pct = discountPercent(rate);
                      const cancelBy = rate.refundable
                        ? formatCancelDeadline(
                            rate.cancellationPolicy?.[0]?.end,
                          )
                        : null;
                      const perks = [
                        ...(rate.boardBasis || []),
                        ...(rate.extras || []),
                        ...(rate.amenities || []),
                      ];

                      return (
                        <div className="rd-rate-card" key={i}>
                          <div className="rd-rate-card-head">
                            <h4>{rateCardTitle(rate)}</h4>
                            {pct != null && (
                              <span className="rd-discount-pill">
                                {pct}% off
                              </span>
                            )}
                          </div>

                          {cancelBy && (
                            <p className="rd-cancel-line">
                              <IconCheck /> Free Cancellation till {cancelBy}
                            </p>
                          )}
                          {!rate.refundable && (
                            <p className="rd-cancel-line deny">
                              <IconCross /> Non-refundable
                            </p>
                          )}

                          {perks.length > 0 && (
                            <ul className="rd-perk-list">
                              {perks.map((perk, k) => (
                                <li key={k}>
                                  <IconCheck /> {perk}
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="rd-rate-card-foot">
                            <div className="rd-price-block">
                              {rate.originalPrice > rate.price && (
                                <span className="rd-price-strike">
                                  {formatPrice(rate.originalPrice)}
                                </span>
                              )}
                              <span className="rd-price">
                                {formatPrice(rate.price)}
                              </span>
                              {rate.taxes != null && (
                                <span className="rd-price-taxes">
                                  + {formatPrice(rate.taxes)} taxes &amp; fees
                                  <br />
                                  per night for 1 room
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              className="rd-reserve-btn"
                              onClick={() => {
                                handleBook(roomDetailsOpen, rate);
                                setRoomDetailsOpen(null);
                              }}
                            >
                              Reserve 1 Room
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="rd-no-rates">
                      No rate plans available for these dates.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <style>{`
              .rd-overlay {
                position: fixed;
                inset: 0;
                background: rgba(17, 18, 22, 0.55);
                z-index: 1000;
                display: flex;
                justify-content: flex-end;
              }
              .rd-drawer {
                width: min(920px, 92vw);
                height: 100%;
                background: #fff;
                overflow-y: auto;
                box-shadow: -8px 0 32px rgba(0,0,0,0.18);
                animation: rd-slide-in 220ms ease-out;
              }
              @keyframes rd-slide-in {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
              .rd-drawer-header {
                position: sticky;
                top: 0;
                background: #fff;
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 28px;
                border-bottom: 1px solid #eceef1;
              }
              .rd-drawer-title {
                margin: 0;
                font-size: 1.4rem;
                font-weight: 700;
                color: #17181c;
              }
              .rd-close-btn {
                border: none;
                background: none;
                cursor: pointer;
                color: #17181c;
                display: flex;
                padding: 4px;
                border-radius: 6px;
              }
              .rd-close-btn:hover { background: #f4f5f5; }
              .rd-body {
                display: grid;
                grid-template-columns: 1fr 340px;
                gap: 32px;
                padding: 24px 28px 40px;
              }
              @media (max-width: 760px) {
                .rd-body { grid-template-columns: 1fr; }
              }
              .rd-carousel {
                position: relative;
                border-radius: 10px;
                overflow: hidden;
                background: #eceef1;
              }
              .rd-carousel-empty {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 220px;
                color: #5e616e;
                font-size: 0.9rem;
              }
              .rd-carousel-scroll {
                display: flex;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                scrollbar-width: none;
              }
              .rd-carousel-scroll::-webkit-scrollbar { display: none; }
              .rd-carousel-scroll img {
                width: 100%;
                flex: 0 0 100%;
                scroll-snap-align: start;
                height: 260px;
                object-fit: cover;
                display: block;
              }
              .rd-carousel-dots {
                position: absolute;
                bottom: 10px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: center;
                gap: 6px;
              }
              .rd-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                border: none;
                padding: 0;
                background: rgba(255,255,255,0.6);
                cursor: pointer;
              }
              .rd-dot.active { background: #fff; width: 18px; border-radius: 4px; }
              .rd-photo-count {
                position: absolute;
                bottom: 10px;
                right: 10px;
                background: rgba(0,0,0,0.65);
                color: #fff;
                font-size: 0.75rem;
                font-weight: 700;
                padding: 3px 8px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 4px;
              }
              .rd-room-name {
                margin: 16px 0 4px;
                font-size: 1.15rem;
                font-weight: 700;
                color: #17181c;
              }
              .rd-specs-row {
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
                color: #5e616e;
                font-size: 0.85rem;
                margin-bottom: 16px;
              }
              .rd-amenities-title {
                font-size: 1.1rem;
                font-weight: 700;
                margin: 20px 0 12px;
                color: #17181c;
              }
              .rd-amenities-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                gap: 12px 16px;
              }
              .rd-amenity {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.88rem;
                color: #17181c;
              }
              .rd-amenity svg { color: #17181c; flex-shrink: 0; }
              .rd-description {
                margin-top: 20px;
                font-size: 0.88rem;
                color: #5e616e;
                line-height: 1.6;
              }
              .rd-right {
                display: flex;
                flex-direction: column;
                gap: 16px;
              }
              .rd-rate-card {
                border: 1px solid #eceef1;
                border-radius: 12px;
                padding: 18px;
              }
              .rd-rate-card-head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 8px;
                margin-bottom: 8px;
              }
              .rd-rate-card-head h4 {
                margin: 0;
                font-size: 1rem;
                font-weight: 700;
                color: #17181c;
              }
              .rd-discount-pill {
                background: #fdecec;
                color: #b3261e;
                font-size: 0.72rem;
                font-weight: 700;
                padding: 3px 9px;
                border-radius: 20px;
                white-space: nowrap;
              }
              .rd-cancel-line {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.82rem;
                color: #1e8e3e;
                margin: 6px 0;
              }
              .rd-cancel-line.deny { color: #b3261e; }
              .rd-perk-list {
                list-style: none;
                margin: 10px 0 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                gap: 8px;
              }
              .rd-perk-list li {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.85rem;
                color: #17181c;
              }
              .rd-perk-list svg { color: #17181c; flex-shrink: 0; }
              .rd-rate-card-foot {
                margin-top: 16px;
                padding-top: 14px;
                border-top: 1px solid #eceef1;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 12px;
                flex-wrap: wrap;
              }
              .rd-price-block {
                display: flex;
                flex-direction: column;
                gap: 2px;
              }
              .rd-price-strike {
                font-size: 0.8rem;
                color: #9aa0aa;
                text-decoration: line-through;
              }
              .rd-price {
                font-size: 1.3rem;
                font-weight: 700;
                color: #17181c;
              }
              .rd-price-taxes {
                font-size: 0.72rem;
                color: #5e616e;
              }
              .rd-reserve-btn {
                border: none;
                background: #fc790d;
                color: #fff;
                font-weight: 700;
                font-size: 0.9rem;
                padding: 10px 18px;
                border-radius: 8px;
                cursor: pointer;
                white-space: nowrap;
              }
              .rd-reserve-btn:hover { filter: brightness(0.94); }
              .rd-no-rates {
                color: #5e616e;
                font-size: 0.9rem;
              }
            `}</style>
          </div>
        )}
      </div>
    </>
  );
}
