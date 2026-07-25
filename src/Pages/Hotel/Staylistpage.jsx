import { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchStays, normalizeStayCard } from "../../Services/stayService.js";
import StayStyles from "./Staystyles.jsx";
import StayListItem from "./StayListItem.jsx";
import HotelHeader from "./component/Header.jsx";

/* ------------------------------------------------------------------
   STEP 3-5: Search hotels for geoId/dates -> show list -> click hotel
   Redesigned with map/filters sidebar, offer banners, sort control.
------------------------------------------------------------------- */

function extractList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.list)) return res.list;
  if (Array.isArray(res?.results)) return res.results;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.hotels)) return res.hotels;
  return [];
}

const POPULAR_FILTERS = [
  {
    key: "freeCancellation",
    label: "Free Cancellation",
    test: (i) =>
      i.amenities?.some(
        (a) => a.key === "freeCancellation" || a.key === "cancellation",
      ),
  },
  {
    key: "coupleFriendly",
    label: "Couple Friendly",
    test: (i) => i.ribbon === "Couple Friendly",
  },
  {
    key: "exceptional",
    label: "Rated Exceptional (9+)",
    test: (i) => (i.rating?.score ?? 0) >= 9,
  },
  {
    key: "freeBreakfast",
    label: "Free Breakfast",
    test: (i) => i.amenities?.some((a) => a.key === "breakfast"),
  },
];

const RATING_TIERS = [
  { key: "9", label: "Exceptional: 9+", min: 9 },
  { key: "8", label: "Excellent: 8+", min: 8 },
  { key: "7", label: "Very Good: 7+", min: 7 },
  { key: "6", label: "Good: 6+", min: 6 },
  { key: "5", label: "Pleasant: 5+", min: 5 },
];

const FACILITY_FILTERS = [
  { key: "wifi", label: "Internet access" },
  { key: "parking", label: "Parking" },
  { key: "cctv", label: "CCTV/Security" },
  { key: "kidsFacilities", label: "Facilities for kids" },
];

const SORT_OPTIONS = [
  { key: "popularity", label: "Popularity" },
  { key: "priceLow", label: "Price: Low to High" },
  { key: "priceHigh", label: "Price: High to Low" },
  { key: "rating", label: "Guest Rating" },
];

// const OFFER_BANNERS = [
//   { id: "kotak", title: "Flat 12% Off", text: "with Kotak Retail Credit Cards + Interest Free EMI", icon: "💳" },
//   { id: "hdfc", title: "Flat 12% Off", text: "with HDFC Bank Credit Cards + Interest Free EMI", icon: "🏦" },
//   { id: "hdfc700", title: "Flat ₹700 Off", text: "with HDFC Bank Credit Cards + Interest Free EMI", icon: "🏦" },
// ];

const PROMO_BANNER = {
  title: "Flat 80% Off",
  subtitle: "on Hotel bookings",
  note: "Valid once per user",
};

export default function StayListPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // NOTE: kept as "regionId" locally since that's the URL param name
  // SearchPage.jsx sets on redirect — only the KEY passed into
  // searchStays() below changed (regionId -> placeId) to match what
  // stayService.js's migrated searchStays() actually expects. Without
  // that rename, place_id came through empty and Xeni rejected every
  // request with a 400 ("Either place_id or latitude/longitude must be
  // provided").
  const regionId = searchParams.get("regionId") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const label = searchParams.get("label") || "";

  // Guests were being collected on SearchPage.jsx and put in the URL,
  // but never read here — so every search silently ran with
  // searchStays()'s defaults (2 adults, 0 children) regardless of what
  // the user picked. Reading them through now.
  const adults = Number(searchParams.get("adults")) || undefined;
  const children = Number(searchParams.get("children")) || undefined;

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  // ---- filter / sort state ----
  const [sortBy, setSortBy] = useState("popularity");
  const [searchWithin, setSearchWithin] = useState("");
  const [bestPriceOnly, setBestPriceOnly] = useState(false);
  const [popularSelected, setPopularSelected] = useState(new Set());
  const [priceRange, setPriceRange] = useState(null); // [min, max]
  const [ratingTier, setRatingTier] = useState(null);
  const [starFilters, setStarFilters] = useState(new Set());
  const [facilitySelected, setFacilitySelected] = useState(new Set());

  useEffect(() => {
    if (!regionId || !checkIn || !checkOut) {
      setList([]);
      setNotice({
        type: "error",
        text: "Missing destination or dates. Go back and search again.",
      });
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotice(null);
    setList([]);

    searchStays({
      placeId: regionId, // <-- FIX: was `regionId`, which searchStays() doesn't
      // accept as a param name, so place_id was silently
      // dropped from the request body.
      checkIn,
      checkOut,
      ...(adults != null ? { adults } : {}),
      ...(children != null ? { children } : {}),
    })
      .then((res) => {
        if (cancelled) return;

        if (process.env.NODE_ENV !== "production") {
          console.log("[StayListPage] searchStays raw response:", res);
        }

        const results = extractList(res).map(normalizeStayCard);
        setList(results);
        setPriceRange(null);
        setNotice(
          results.length === 0
            ? { type: "empty", text: "No stays found for this search." }
            : "",
        );
      })
      .catch((err) => {
        if (cancelled) return;
        setList([]);
        setNotice({
          type: "error",
          text: `Couldn't load live results (${err.message}).`,
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [regionId, checkIn, checkOut, adults, children]);

  const handleSelect = useCallback(
    (item) => {
      const hotelId = item.id;
      if (!hotelId) return;
      // FIX: placeId was missing here entirely — HotelDetailsPage.jsx
      // requires it (Xeni's Check Availability needs place_id AND
      // property_id together), and its effect silently no-ops without
      // it. `regionId` is this page's local name for that same value.
      const params = new URLSearchParams({ checkIn, checkOut, placeId: regionId });
      navigate(`/stays/hotel/${hotelId}?${params.toString()}`);
    },
    [checkIn, checkOut, regionId, navigate],
  );

  const formatRange = (a, b) => {
    const fmt = (iso) => {
      if (!iso) return "—";
      const d = new Date(iso);
      return Number.isNaN(d.getTime())
        ? iso
        : d.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
          });
    };
    return `${fmt(a)} → ${fmt(b)}`;
  };

  // ---- derived data for filter counts / bounds ----
  const priceBounds = useMemo(() => {
    if (!list.length) return [0, 0];
    const prices = list.map((i) => i.price).filter((p) => p != null);
    if (!prices.length) return [0, 0];
    return [Math.min(...prices), Math.max(...prices)];
  }, [list]);

  const effectivePriceRange = priceRange || priceBounds;

  const starCounts = useMemo(() => {
    const counts = {};
    list.forEach((i) => {
      const r = Math.round(i.starRating || 0);
      if (r > 0) counts[r] = (counts[r] || 0) + 1;
    });
    return counts;
  }, [list]);

  const ratingCounts = useMemo(() => {
    const counts = {};
    RATING_TIERS.forEach((t) => {
      counts[t.key] = list.filter(
        (i) => (i.rating?.score ?? 0) >= t.min,
      ).length;
    });
    return counts;
  }, [list]);

  const popularCounts = useMemo(() => {
    const counts = {};
    POPULAR_FILTERS.forEach((f) => {
      counts[f.key] = list.filter((i) => f.test(i)).length;
    });
    return counts;
  }, [list]);

  const facilityCounts = useMemo(() => {
    const counts = {};
    FACILITY_FILTERS.forEach((f) => {
      counts[f.key] = list.filter((i) =>
        i.amenities?.some((a) => a.key === f.key),
      ).length;
    });
    return counts;
  }, [list]);

  const filteredList = useMemo(() => {
    let out = list;

    if (searchWithin.trim()) {
      const q = searchWithin.trim().toLowerCase();
      out = out.filter(
        (i) =>
          i.name?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q),
      );
    }

    if (popularSelected.size) {
      out = out.filter((i) =>
        POPULAR_FILTERS.filter((f) => popularSelected.has(f.key)).every((f) =>
          f.test(i),
        ),
      );
    }

    if (priceRange) {
      out = out.filter(
        (i) => i.price >= priceRange[0] && i.price <= priceRange[1],
      );
    }

    if (ratingTier) {
      const tier = RATING_TIERS.find((t) => t.key === ratingTier);
      if (tier) out = out.filter((i) => (i.rating?.score ?? 0) >= tier.min);
    }

    if (starFilters.size) {
      out = out.filter((i) => starFilters.has(Math.round(i.starRating || 0)));
    }

    if (facilitySelected.size) {
      out = out.filter((i) =>
        [...facilitySelected].every((key) =>
          i.amenities?.some((a) => a.key === key),
        ),
      );
    }

    out = [...out];
    if (bestPriceOnly || sortBy === "priceLow") {
      out.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    } else if (sortBy === "priceHigh") {
      out.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    } else if (sortBy === "rating") {
      out.sort((a, b) => (b.rating?.score ?? 0) - (a.rating?.score ?? 0));
    }

    return out;
  }, [
    list,
    searchWithin,
    popularSelected,
    priceRange,
    ratingTier,
    starFilters,
    facilitySelected,
    bestPriceOnly,
    sortBy,
  ]);

  const togglePopular = (key) => {
    setPopularSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleStar = (n) => {
    setStarFilters((prev) => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  const toggleFacility = (key) => {
    setFacilitySelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const mapsUrl = label
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}`
    : null;

  const activeFilterCount =
    popularSelected.size +
    starFilters.size +
    facilitySelected.size +
    (ratingTier ? 1 : 0) +
    (priceRange ? 1 : 0);

  return (
    <>
    <HotelHeader />
      <div className="app app-stays">
        
        <StayStyles />

        <div className="stays-layout">
          {/* ---------------- Sidebar ---------------- */}
          <aside className="stays-sidebar" aria-label="Filter results">
            <div className="map-card">
              <div className="map-placeholder" aria-hidden="true">
                <span className="map-grid" />
                <span className="map-pin">📍</span>
              </div>
              {mapsUrl && (
                <a
                  className="explore-map-link"
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore on Map
                </a>
              )}
            </div>

            <div className="filters-card">
              <h2 className="filters-title">
                Filters
                {activeFilterCount > 0 && (
                  <span className="filter-count">
                    {" "}
                    · {activeFilterCount} active
                  </span>
                )}
              </h2>

              <label className="toggle-row" htmlFor="best-price-toggle">
                <span>
                  <strong>Best Price Guarantee</strong>
                  <br />
                  <small>Sort hotels by cheapest price</small>
                </span>
                <span
                  id="best-price-toggle"
                  className={`toggle-switch ${bestPriceOnly ? "is-on" : ""}`}
                  role="switch"
                  aria-checked={bestPriceOnly}
                  tabIndex={0}
                  onClick={() => setBestPriceOnly((v) => !v)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setBestPriceOnly((v) => !v);
                    }
                  }}
                >
                  <span className="toggle-knob" />
                </span>
              </label>

              <h3 className="filters-subtitle">
                Search within {label || "area"}
              </h3>
              <label className="visually-hidden" htmlFor="search-within-input">
                Search within {label || "area"}
              </label>
              <input
                id="search-within-input"
                className="search-within-input"
                type="text"
                placeholder="Enter area, locality or hotel"
                value={searchWithin}
                onChange={(e) => setSearchWithin(e.target.value)}
              />

              <fieldset className="filters-fieldset">
                <legend className="filters-subtitle">Most Popular</legend>
                <div className="filter-checklist">
                  {POPULAR_FILTERS.map((f) => (
                    <label className="filter-checkbox-row" key={f.key}>
                      <span>
                        <input
                          type="checkbox"
                          checked={popularSelected.has(f.key)}
                          onChange={() => togglePopular(f.key)}
                        />{" "}
                        {f.label}
                      </span>
                      <span className="filter-count">
                        {popularCounts[f.key] ?? 0}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <h3 className="filters-subtitle">Price (per night)</h3>
              <div className="price-slider-block">
                {priceBounds[1] > 0 && (
                  <input
                    type="range"
                    aria-label={`Maximum price per night, up to ₹${priceBounds[1].toLocaleString("en-IN")}`}
                    min={priceBounds[0]}
                    max={priceBounds[1]}
                    value={effectivePriceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        effectivePriceRange[0],
                        Number(e.target.value),
                      ])
                    }
                  />
                )}
                <div className="price-range-labels">
                  <span>
                    ₹{effectivePriceRange[0]?.toLocaleString("en-IN") ?? 0}
                  </span>
                  <span>
                    ₹{effectivePriceRange[1]?.toLocaleString("en-IN") ?? 0}
                  </span>
                </div>
              </div>

              <fieldset className="filters-fieldset">
                <legend className="filters-subtitle">User Rating</legend>
                <div className="filter-radiolist">
                  {RATING_TIERS.map((t) => (
                    <label className="filter-radio-row" key={t.key}>
                      <span>
                        <input
                          type="radio"
                          name="ratingTier"
                          checked={ratingTier === t.key}
                          onChange={() =>
                            setRatingTier(ratingTier === t.key ? null : t.key)
                          }
                        />{" "}
                        {t.label}
                      </span>
                      <span className="filter-count">
                        {ratingCounts[t.key] ?? 0}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="filters-fieldset">
                <legend className="filters-subtitle">Facilities</legend>
                <div className="filter-checklist">
                  {FACILITY_FILTERS.map((f) => (
                    <label className="filter-checkbox-row" key={f.key}>
                      <span>
                        <input
                          type="checkbox"
                          checked={facilitySelected.has(f.key)}
                          onChange={() => toggleFacility(f.key)}
                        />{" "}
                        {f.label}
                      </span>
                      <span className="filter-count">
                        {facilityCounts[f.key] ?? 0}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="filters-fieldset">
                <legend className="filters-subtitle">Star Rating</legend>
                <div
                  className="pill-group"
                  role="group"
                  aria-label="Star rating"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <button
                      type="button"
                      key={n}
                      className={`filter-pill ${starFilters.has(n) ? "is-active" : ""}`}
                      aria-pressed={starFilters.has(n)}
                      onClick={() => toggleStar(n)}
                    >
                      {n} Star {starCounts[n] ? `(${starCounts[n]})` : "(0)"}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </aside>

          {/* ---------------- Main content ---------------- */}
          <main className="stays-main">
            {label && (
              <div className="stays-main-header">
                <div>
                  <h1 className="page-title">{`Hotels In ${label}`}</h1>
                  <p className="selected-note">
                    {formatRange(checkIn, checkOut)}
                  </p>
                </div>
                <label className="sort-control" htmlFor="sort-select">
                  Sort by:{" "}
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {/* Offer */}
            {/* <div className="offer-banner-strip" aria-label="Current payment offers">
              {OFFER_BANNERS.map((b) => (
                <div className="offer-banner" key={b.id}>
                  <span className="offer-banner-icon" aria-hidden="true">{b.icon}</span>
                  <div>
                    <strong>{b.title}</strong>
                    <p>{b.text}</p>
                  </div>
                </div>
              ))}
            </div> */}

            <div aria-live="polite">
              {notice && (
                <div
                  className={`notice ${notice.type}`}
                  role={notice.type === "error" ? "alert" : "status"}
                >
                  {notice.text}
                </div>
              )}
            </div>

            {loading ? (
              <div
                className="stay-list"
                aria-busy="true"
                aria-label="Loading stays"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="stay-row stay-row-skeleton" key={i}>
                    <div className="stay-row-photo">
                      <div
                        className="tag-skeleton-block"
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 0,
                        }}
                      />
                    </div>
                    <div className="stay-row-body">
                      <div className="stay-row-main">
                        <div
                          className="tag-skeleton-line"
                          style={{ width: "40%" }}
                        />
                        <div
                          className="tag-skeleton-line"
                          style={{ width: "70%", height: 18, marginTop: 4 }}
                        />
                        <div
                          className="tag-skeleton-line"
                          style={{ width: "50%" }}
                        />
                      </div>
                      <div
                        className="tag-skeleton-line"
                        style={{ width: "80px", marginTop: 10 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="stay-list">
                {filteredList.map((item, idx) => (
                  <Fragment key={item.id}>
                    <StayListItem
                      item={item}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onSelect={handleSelect}
                    />
                    {idx === 1 && filteredList.length > 2 && (
                      <div className="promo-banner">
                        <div>
                          <strong>{PROMO_BANNER.title}</strong>{" "}
                          <span>{PROMO_BANNER.subtitle}</span>
                          <p>{PROMO_BANNER.note}</p>
                        </div>
                      </div>
                    )}
                  </Fragment>
                ))}
                {!loading && filteredList.length === 0 && list.length > 0 && (
                  <div className="notice empty" role="status">
                    No stays match the selected filters.
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}