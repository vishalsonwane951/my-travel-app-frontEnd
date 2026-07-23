/* ------------------------------------------------------------------
   Staystyles — single token-driven <style> block shared by
   StayListPage, StayListItem, and HotelDetailsPage. Namespaced
   classes only (no element selectors) so specificity never collides
   with the rest of the app.

   Token source: ixigo hotels design tokens (see :root below). Ribbon,
   rating-tier, and detail-page accent hues that aren't in the core
   brand palette are declared once here as an explicit extended
   palette, not inlined per-component, so they stay consistent and
   easy to retheme.

   This file merges the search-results styles with the hotel details
   page styles, translating the details-page section onto the shared
   token system instead of its own local variable set.
------------------------------------------------------------------- */
export default function StayStyles() {
  return (
    <style>{`
      :root {
        /* ---- Core brand tokens ---- */
        --font-family-primary: __ixiFonts_69e750;
        --font-family-stack: __ixiFonts_69e750, __ixiFonts_Fallback_69e750, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        --font-size-base: 15px;
        --font-weight-base: 400;
        --line-height-base: 22.5px;

        --font-size-xs: 12px;
        --font-size-sm: 14px;
        --font-size-md: 15px;
        --font-size-lg: 16px;
        --font-size-xl: 18px;
        --font-size-2xl: 20px;
        --font-size-3xl: 24px;

        --color-text-primary: #17181c;
        --color-text-secondary: #5e616e;
        --color-text-tertiary: #238c46;
        --color-text-inverse: #fafafa;
        --color-surface-base: #000000;
        --color-surface-muted: #e4e4e7;
        --color-surface-raised: #fc790d;
        --color-surface-raised-dark: #e0690a;
        --color-surface-strong: #f4f5f5;
        --color-border-default: #e5e7eb;

        --space-1: 5px;
        --space-2: 10px;
        --space-3: 15px;
        --space-4: 20px;

        --radius-xs: 4px;
        --radius-sm: 10px;
        --radius-md: 12px;
        --motion-instant: 150ms;

        /* ---- Extended, non-brand semantic accents (used consistently, not one-offs) ---- */
        --color-danger: #b3261e;
        --color-danger-bg: #fdecec;
        --color-success-bg: #eafaf0;
        --color-accent-purple: #7c3aed;
        --color-accent-purple-bg: #f1e9fe;
        --color-accent-pink: #db2777;
        --color-accent-pink-bg: #fce7f3;
        --color-accent-blue: #1a6ce0;
        --color-accent-blue-bg: #eef5ff;
        --color-accent-gold: #b5760a;
        --color-accent-gold-bg: #fff0da;
        --focus-ring: 0 0 0 3px rgba(252, 121, 13, 0.35);
      }

      .app-stays {
        background: var(--color-surface-strong);
        min-height: 100vh;
        font-family: var(--font-family-stack);
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-base);
        line-height: var(--line-height-base);
        color: var(--color-text-primary);
      }

      .app-stays *:focus-visible {
        outline: 2px solid var(--color-surface-raised);
        outline-offset: 2px;
        border-radius: var(--radius-xs);
      }

      .stays-layout {
        max-width: 1280px;
        margin: 0 auto;
        padding: var(--space-4);
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: var(--space-4);
        align-items: start;
      }

      /* ---------------- Sidebar ---------------- */
      .stays-sidebar {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        position: sticky;
        top: var(--space-4);
      }

      .map-card {
        background: #ffffff;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-sm);
        overflow: hidden;
      }
      .map-placeholder {
        height: 160px;
        background: var(--color-surface-base);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .map-grid {
        position: absolute;
        inset: 0;
        background-image:
          repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 28px),
          repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 28px);
      }
      .map-pin { font-size: 28px; z-index: 1; }
      .explore-map-link {
        display: block;
        text-align: center;
        padding: var(--space-2);
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-text-primary);
        text-decoration: none;
        border-top: 1px solid var(--color-border-default);
        transition: background var(--motion-instant) ease;
      }
      .explore-map-link:hover { background: var(--color-surface-strong); text-decoration: underline; }

      .filters-card {
        background: #ffffff;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-sm);
        padding: var(--space-3);
      }
      .filters-title { font-size: var(--font-size-lg); font-weight: 700; margin: 0 0 var(--space-3); }
      .filters-subtitle {
        font-size: var(--font-size-sm);
        font-weight: 700;
        color: var(--color-text-primary);
        margin: var(--space-3) 0 var(--space-2);
        padding-top: var(--space-3);
        border-top: 1px solid var(--color-border-default);
      }
      .filters-card > .toggle-row + .filters-subtitle:first-of-type { border-top: none; padding-top: 0; }

      .filters-fieldset { border: none; margin: 0; padding: 0; }
      .filters-fieldset legend { padding: 0; width: 100%; }

      .visually-hidden {
        position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
        overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
      }

      .toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
      }
      .toggle-row small { color: var(--color-text-secondary); font-size: var(--font-size-xs); }
      .toggle-switch {
        flex-shrink: 0;
        width: 40px;
        height: 22px;
        border-radius: 999px;
        background: var(--color-surface-muted);
        position: relative;
        cursor: pointer;
        transition: background var(--motion-instant) ease;
      }
      .toggle-switch.is-on { background: var(--color-surface-raised); }
      .toggle-knob {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        transition: transform var(--motion-instant) ease;
      }
      .toggle-switch.is-on .toggle-knob { transform: translateX(18px); }

      .search-within-input {
        width: 100%;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-xs);
        padding: var(--space-2) var(--space-2);
        font-family: inherit;
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
        outline: none;
      }
      .search-within-input:hover { border-color: #c9cbd1; }
      .search-within-input:focus-visible { border-color: var(--color-surface-raised); box-shadow: var(--focus-ring); }

      .filter-checklist, .filter-radiolist { display: flex; flex-direction: column; gap: var(--space-2); }
      .filter-checkbox-row, .filter-radio-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
        cursor: pointer;
        gap: var(--space-2);
      }
      .filter-checkbox-row input, .filter-radio-row input { accent-color: var(--color-surface-raised); width: 16px; height: 16px; flex-shrink: 0; }
      .filter-count { color: var(--color-text-secondary); font-size: var(--font-size-xs); }

      .price-slider-block { display: flex; flex-direction: column; gap: var(--space-2); }
      .price-slider-block input[type="range"] { accent-color: var(--color-surface-raised); width: 100%; }
      .price-range-labels { display: flex; justify-content: space-between; font-size: var(--font-size-xs); color: var(--color-text-secondary); }

      .pill-group { display: flex; flex-wrap: wrap; gap: var(--space-2); }
      .filter-pill {
        border: 1px solid var(--color-border-default);
        background: #fff;
        border-radius: 999px;
        padding: var(--space-1) var(--space-3);
        font-size: var(--font-size-xs);
        font-weight: 600;
        color: var(--color-text-primary);
        cursor: pointer;
        font-family: inherit;
        transition: background var(--motion-instant) ease, color var(--motion-instant) ease, border-color var(--motion-instant) ease;
      }
      .filter-pill:hover { border-color: var(--color-surface-raised); }
      .filter-pill.is-active { background: var(--color-surface-raised); border-color: var(--color-surface-raised); color: #fff; }

      /* ---------------- Main column ---------------- */
      .stays-main { display: flex; flex-direction: column; gap: var(--space-3); min-width: 0; }
      .stays-main-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
      .page-title { font-size: var(--font-size-3xl); font-weight: 700; margin: 0; }
      .selected-note { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: 2px 0 0; }
      .sort-control { font-size: var(--font-size-sm); color: var(--color-text-secondary); display: flex; align-items: center; gap: var(--space-2); }
      .sort-control select {
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-xs);
        padding: var(--space-1) var(--space-2);
        font-family: inherit;
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
        background: #fff;
      }
      .sort-control select:focus-visible { border-color: var(--color-surface-raised); box-shadow: var(--focus-ring); }

      .offer-banner-strip { display: flex; gap: var(--space-3); overflow-x: auto; padding-bottom: var(--space-1); }
      .offer-banner {
        flex: 0 0 260px;
        display: flex;
        align-items: center;
        gap: var(--space-2);
        background: #fff;
        border: 1px solid var(--color-border-default);
        border-left: 3px solid var(--color-surface-raised);
        border-radius: var(--radius-xs);
        padding: var(--space-2) var(--space-3);
      }
      .offer-banner-icon { font-size: var(--font-size-2xl); flex-shrink: 0; }
      .offer-banner strong { font-size: var(--font-size-sm); color: var(--color-text-primary); }
      .offer-banner p { margin: 2px 0 0; font-size: var(--font-size-xs); color: var(--color-text-secondary); }

      .notice { padding: var(--space-2) var(--space-3); border-radius: var(--radius-xs); font-size: var(--font-size-sm); }
      .notice.error { background: var(--color-danger-bg); color: var(--color-danger); }
      .notice.empty { background: var(--color-surface-strong); color: var(--color-text-secondary); border: 1px solid var(--color-border-default); }
      .notice.live { background: var(--color-success-bg); color: var(--color-text-tertiary); }

      .promo-banner {
        background: linear-gradient(120deg, var(--color-surface-base), #2a2a2e);
        color: var(--color-text-inverse);
        border-radius: var(--radius-sm);
        padding: var(--space-3) var(--space-4);
      }
      .promo-banner strong { font-size: var(--font-size-xl); color: var(--color-surface-raised); }
      .promo-banner span { font-size: var(--font-size-lg); }
      .promo-banner p { margin: 2px 0 0; font-size: var(--font-size-xs); color: #c9cacf; }

      .stay-list { display: flex; flex-direction: column; gap: var(--space-3); }

      .tag-skeleton-block { background: var(--color-surface-muted); }
      .tag-skeleton-line { height: 10px; background: var(--color-surface-muted); border-radius: var(--radius-xs); }

      /* ---------------- Stay row card ---------------- */
      .stay-row {
        display: flex;
        background: #fff;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-sm);
        overflow: hidden;
        cursor: pointer;
        transition: box-shadow var(--motion-instant) ease, transform var(--motion-instant) ease;
      }
      .stay-row:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
      .stay-row:active { transform: translateY(1px); }
      .stay-row-skeleton { cursor: default; }
      .stay-row-skeleton:hover { box-shadow: none; }

      .stay-row-photo {
        position: relative;
        flex: 0 0 260px;
        height: 200px;
        background: var(--color-surface-muted);
      }
      .stay-row-photo-scroll {
        display: flex;
        height: 100%;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
      }
      .stay-row-photo-scroll::-webkit-scrollbar { display: none; }
      .stay-row-photo-img { width: 100%; height: 100%; flex: 0 0 100%; object-fit: cover; scroll-snap-align: start; }
      .stay-row-photo-fallback {
        width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
        font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-text-secondary);
        background: var(--color-surface-muted);
      }
      .stay-row-dots {
        position: absolute; bottom: var(--space-2); left: 0; right: 0;
        display: flex; justify-content: center; gap: 5px;
      }
      .stay-row-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.55); }
      .stay-row-dot.is-active { background: #fff; }
      .stay-row-dot-btn {
        width: 16px; height: 16px; padding: 0; border: none; background: transparent;
        display: flex; align-items: center; justify-content: center; cursor: pointer;
      }

      .ribbon {
        position: absolute; top: var(--space-2); left: 0;
        display: flex; align-items: center; gap: 4px;
        font-size: var(--font-size-xs); font-weight: 700; color: #fff;
        padding: 4px 10px 4px 8px; border-radius: 0 999px 999px 0;
      }
      .ribbon-icon { font-size: var(--font-size-xs); }
      .ribbon-green { background: var(--color-text-tertiary); }
      .ribbon-purple { background: var(--color-accent-purple); }
      .ribbon-pink { background: var(--color-accent-pink); }

      .save-btn {
        position: absolute; top: var(--space-2); right: var(--space-2);
        width: 32px; height: 32px; border-radius: 50%; border: none;
        background: rgba(255,255,255,0.92); color: var(--color-text-primary);
        font-size: var(--font-size-lg); cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: transform var(--motion-instant) ease;
      }
      .save-btn:hover { transform: scale(1.08); }
      .save-btn.is-saved { color: var(--color-danger); }

      .stamp {
        position: absolute; bottom: 0; left: 0;
        background: var(--color-surface-base); color: var(--color-text-inverse);
        padding: var(--space-1) var(--space-2); border-radius: 0 var(--radius-sm) 0 0;
        display: flex; align-items: baseline; gap: 6px; font-size: var(--font-size-xs);
      }
      .stamp-num { font-size: var(--font-size-lg); font-weight: 700; }
      .stamp-label { font-weight: 600; }
      .stamp-count { color: #c9cacf; }

      .stay-row-body { flex: 1 1 auto; display: flex; justify-content: space-between; gap: var(--space-3); padding: var(--space-3); min-width: 0; }
      .stay-row-main { flex: 1 1 auto; min-width: 0; }
      .stay-row-heading { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
      .stay-row-title { font-size: var(--font-size-xl); font-weight: 700; margin: 0; color: var(--color-text-primary); }
      .stay-row-stars { color: var(--color-surface-raised); font-size: var(--font-size-sm); letter-spacing: 1px; }
      .stay-row-location { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: 2px 0 var(--space-2); }

      .stay-row-checks { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-2); }
      .amenity-check {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: var(--font-size-xs); font-weight: 600; color: var(--color-text-tertiary);
        background: var(--color-success-bg); border-radius: 999px; padding: 3px 10px;
      }
      .amenity-check-mark { font-weight: 700; }

      .stay-row-info-amenities { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-2); }
      .amenity-info { font-size: var(--font-size-xs); color: var(--color-text-secondary); display: inline-flex; align-items: center; gap: 4px; }

      .stay-row-tagline {
        display: flex; align-items: center; gap: 6px;
        font-size: var(--font-size-xs); color: var(--color-text-secondary); font-style: italic; margin: var(--space-2) 0 0;
      }

      .stay-row-price-block {
        flex: 0 0 160px; display: flex; flex-direction: column; align-items: flex-end;
        text-align: right; gap: 2px;
      }
      .pill { font-size: var(--font-size-xs); font-weight: 700; padding: 3px 10px; border-radius: 999px; margin-bottom: var(--space-1); }
      .pill-urgent { background: #fff1e6; color: var(--color-surface-raised); }
      .pill-discount { background: var(--color-success-bg); color: var(--color-text-tertiary); }
      .pill-gold { background: var(--color-accent-gold-bg); color: var(--color-accent-gold); }
      .stay-row-price-strike { font-size: var(--font-size-xs); color: var(--color-text-secondary); text-decoration: line-through; }
      .stay-row-price-current { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-text-primary); }
      .stay-row-qualifier { font-size: var(--font-size-xs); color: var(--color-text-secondary); }
      .stay-row-qualifier-sub { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-2); }

      .book-btn {
        border: none; background: var(--color-surface-raised); color: #fff;
        font-weight: 700; font-size: var(--font-size-sm); border-radius: var(--radius-xs);
        padding: var(--space-2) var(--space-4); cursor: pointer; font-family: inherit;
        transition: filter var(--motion-instant) ease, transform var(--motion-instant) ease;
      }
      .book-btn:hover { filter: brightness(0.93); }
      .book-btn:active { transform: translateY(1px); }

      .tagline-icon { flex-shrink: 0; }

      @media (max-width: 960px) {
        .stays-layout { grid-template-columns: 1fr; }
        .stays-sidebar { position: static; }
      }

      @media (max-width: 640px) {
        .stay-row { flex-direction: column; }
        .stay-row-photo { flex: 0 0 auto; width: 100%; height: 220px; }
        .stay-row-body { flex-direction: column; }
        .stay-row-price-block { align-items: flex-start; text-align: left; width: 100%; margin-top: var(--space-2); }
        .book-btn { width: 100%; }
      }

      /* ==================================================================
         HOTEL DETAILS PAGE (HotelDetailsPage.jsx)
         Reuses the shared tokens and rules above (.notice, .pill,
         .tag-skeleton-block, .tag-skeleton-line, .filter-pill, etc.)
         rather than redefining them, so this page stays visually
         consistent with the search results page.
      ================================================================== */

      .app { max-width: 1200px; margin: 0 auto; padding: 0 24px 60px; color: var(--color-text-primary); }

      /* ---------------- sticky tab bar ---------------- */
      .dp-tabbar {
        position: sticky;
        top: 0;
        z-index: 40;
        background: #fff;
        border-bottom: 1px solid var(--color-border-default);
        margin: 0 -24px 0;
        padding: 0 24px;
      }
      .dp-tabbar-inner {
        display: flex;
        gap: 34px;
        max-width: 1200px;
        margin: 0 auto;
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
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .hero-thumb-wrap {
        position: relative;
        border-radius: var(--radius-md);
        overflow: hidden;
        cursor: pointer;
        height: 226px;
      }
      .hero-thumb-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .hero-thumb-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.55);
        color: #fff;
        display: flex;
        align-items: flex-end;
        padding: 12px;
        font-size: var(--font-size-sm);
        font-weight: 600;
      }

      /* ---------------- head ---------------- */
      .detail-head { padding: 4px 0 18px; }
      .dp-head-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        flex-wrap: wrap;
      }
      .dp-name-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .detail-name { font-size: 28px; font-weight: 800; }
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
      .dp-address-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 8px;
        color: var(--color-text-secondary);
      }
      .dp-address-row svg { color: var(--color-surface-raised); flex-shrink: 0; }
      .detail-loc { font-size: var(--font-size-sm); }
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

      /* ---------------- highlight tiles ---------------- */
      .dp-highlights {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-top: 20px;
      }
      .dp-highlight-tile {
        display: flex;
        gap: 12px;
        background: var(--color-surface-strong);
        border-radius: var(--radius-md);
        padding: 14px 16px;
      }
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
        grid-template-columns: 1fr 340px;
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

      /* ---------------- sidebar: deal card ---------------- */
      .dp-deal-card {
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-md);
        overflow: hidden;
      }
      .dp-deal-photo { position: relative; height: 150px; }
      .dp-deal-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .dp-deal-badge {
        position: absolute;
        top: 12px;
        left: 12px;
        background: var(--color-accent-blue-bg);
        color: var(--color-accent-blue);
        font-size: var(--font-size-xs);
        font-weight: 700;
        padding: 5px 10px;
        border-radius: 20px;
      }
      .dp-deal-body { padding: 16px; }
      .dp-deal-title { font-size: var(--font-size-xl); font-weight: 800; margin: 0 0 10px; }
      .dp-deal-perks { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
      .dp-deal-perk { display: flex; align-items: center; gap: 6px; font-size: var(--font-size-sm); }
      .dp-deal-perk.allow { color: var(--color-text-primary); }
      .dp-deal-perk.allow svg { color: var(--color-text-primary); }
      .dp-deal-perk.deny { color: var(--color-danger); }
      .dp-deal-perk.deny svg { color: var(--color-danger); }
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

      /* ---------------- sidebar: rating card ---------------- */
      .dp-rating-card {
        display: flex;
        align-items: center;
        gap: 14px;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-md);
        padding: 16px;
        cursor: pointer;
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
      .dp-rating-label { font-weight: 700; margin: 0; font-size: var(--font-size-md); }
      .dp-rating-sub { color: var(--color-text-secondary); font-size: var(--font-size-sm); margin: 2px 0 0; }

      /* ---------------- sidebar: quote card ---------------- */
      .dp-quote-card {
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-md);
        padding: 16px;
      }
      .dp-quote-card h3 { font-size: var(--font-size-md); font-weight: 800; margin: 0 0 10px; }
      .dp-quote-text { font-size: var(--font-size-sm); font-style: italic; margin: 0 0 10px; line-height: 1.5; }
      .dp-quote-meta { display: flex; justify-content: space-between; font-size: var(--font-size-xs); color: var(--color-text-secondary); }

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
        padding: 0 24px 40px;
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
        .dp-layout { grid-template-columns: 1fr; }
        .dp-sidebar { position: static; }
        .detail-hero { grid-template-columns: 1fr; }
        .dp-highlights { grid-template-columns: 1fr; }
        .facility-icon-grid { grid-template-columns: repeat(3, 1fr); }
        .amenity-grid { grid-template-columns: repeat(2, 1fr); }
        .gallery-grid { grid-template-columns: repeat(2, 1fr); }
      }

      @media (prefers-reduced-motion: reduce) {
        .app-stays * { transition: none !important; }
      }
    `}</style>
  );
}