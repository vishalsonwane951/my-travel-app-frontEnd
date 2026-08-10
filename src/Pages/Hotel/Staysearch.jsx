import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  searchRegions,
  getBestDeals,
  getOffers,
} from "../../Services/stayService.js";
import Header from "../../Components/Header.jsx";
import HotelHeader from "./component/Header.jsx";

const POPULAR_DESTINATIONS = [
  {
    name: "New Delhi",
    state: "Delhi",
    properties: 4688,
    photo:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    properties: 1766,
    photo:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Goa",
    state: "Goa",
    properties: 4728,
    photo:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    properties: 1401,
    photo:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    properties: 968,
    photo:
      "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    properties: 1527,
    photo:
      "https://images.unsplash.com/photo-1600100397608-f320c4bb0b18?q=80&w=800&auto=format&fit=crop",
  },
];

const WHY_ITEMS = [
  { icon: "🏷️", title: "Best deals & prices", sub: "on hotels" },
  { icon: "📞", title: "24x7", sub: "customer support" },
  { icon: "📍", title: "Largest selection", sub: "of hotels" },
  { icon: "🏦", title: "Pay at hotel", sub: "option available" },
  { icon: "❤️", title: "Plan together", sub: "with shared wishlists" },
];

const FAQS = [
  {
    q: "How do I find the cheapest stays?",
    a: "Sort your results by price low-to-high and use the filters to set a budget range. Checking a few extra days around your dates can also surface better rates.",
  },
  {
    q: "Do you offer discounts or promo codes?",
    a: "Yes — current discounts show up automatically in the Offers section on this page and again at checkout if a code applies to your stay.",
  },
  {
    q: "Can I pay at the property instead of online?",
    a: "Many stays support a pay-at-hotel option. Look for that label on the room card before you select it — it'll be called out clearly.",
  },
  {
    q: "What's the cancellation policy?",
    a: "Cancellation terms vary by property and rate plan. The exact policy for your stay is shown on the room selection and booking review pages before you confirm.",
  },
];

function GuestPicker({ guests, setGuests }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const step = (key, delta, min, max) => {
    setGuests((g) => ({ ...g, [key]: Math.min(max, Math.max(min, g[key] + delta)) }));
  };

  return (
    <div className="kiosk-field" ref={wrapRef}>
      <span className="kiosk-label" id="guests-label">Rooms &amp; Guests</span>
      <button
        type="button"
        ref={triggerRef}
        className="guest-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby="guests-label"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="guest-value">
          {guests.rooms} Room{guests.rooms > 1 ? "s" : ""}, {guests.adults + guests.children} Guest
          {guests.adults + guests.children > 1 ? "s" : ""}
        </span>
      </button>

      {open && (
        <div className="guest-pop" role="dialog" aria-label="Rooms and guests" onClick={(e) => e.stopPropagation()}>
          <div className="guest-row">
            <div className="guest-row-label">Rooms</div>
            <div className="stepper">
              <button type="button" aria-label="Decrease rooms" onClick={() => step("rooms", -1, 1, 8)} disabled={guests.rooms <= 1}>−</button>
              <span aria-live="polite">{guests.rooms}</span>
              <button type="button" aria-label="Increase rooms" onClick={() => step("rooms", 1, 1, 8)} disabled={guests.rooms >= 8}>+</button>
            </div>
          </div>
          <div className="guest-row">
            <div>
              <div className="guest-row-label">Adults</div>
              <div className="guest-row-sub">Ages 13+</div>
            </div>
            <div className="stepper">
              <button type="button" aria-label="Decrease adults" onClick={() => step("adults", -1, 1, 16)} disabled={guests.adults <= 1}>−</button>
              <span aria-live="polite">{guests.adults}</span>
              <button type="button" aria-label="Increase adults" onClick={() => step("adults", 1, 1, 16)} disabled={guests.adults >= 16}>+</button>
            </div>
          </div>
          <div className="guest-row">
            <div>
              <div className="guest-row-label">Children</div>
              <div className="guest-row-sub">Ages 0-12</div>
            </div>
            <div className="stepper">
              <button type="button" aria-label="Decrease children" onClick={() => step("children", -1, 0, 8)} disabled={guests.children <= 0}>−</button>
              <span aria-live="polite">{guests.children}</span>
              <button type="button" aria-label="Increase children" onClick={() => step("children", 1, 0, 8)} disabled={guests.children >= 8}>+</button>
            </div>
          </div>
          <button type="button" className="guest-done" onClick={() => { setOpen(false); triggerRef.current?.focus(); }}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const [query, setQuery] = useState("");
  const [regions, setRegions] = useState([]);
  const [regionLoading, setRegionLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offersTab, setOffersTab] = useState("hotels");

  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [dealsError, setDealsError] = useState(null);

  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersError, setOffersError] = useState(null);

  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setDealsLoading(true);
    setDealsError(null);
    getBestDeals()
      .then(({ list }) => { if (!cancelled) setDeals(list || []); })
      .catch((err) => { if (!cancelled) setDealsError(err.message || "Couldn't load deals."); })
      .finally(() => { if (!cancelled) setDealsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setOffersLoading(true);
    setOffersError(null);
    getOffers()
      .then(({ list }) => { if (!cancelled) setOffers(list || []); })
      .catch((err) => { if (!cancelled) setOffersError(err.message || "Couldn't load offers."); })
      .finally(() => { if (!cancelled) setOffersLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleQueryChange = useCallback((value) => {
    setQuery(value);
    setSelectedRegion(null);
    setNotice(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setRegions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setRegionLoading(true);
      try {
        const { list } = await searchRegions({ query: value });
        setRegions(list.filter((r) => r.kind === "region"));
      } catch (err) {
        setRegions([]);
        setNotice({ type: "error", text: `Couldn't look up destinations (${err.message}).` });
      } finally {
        setRegionLoading(false);
      }
    }, 350);
  }, []);

  const handlePickRegion = useCallback((region) => {
    setSelectedRegion(region);
    setQuery(region.name || query);
    setRegions([]);
  }, [query]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!selectedRegion?.id) {
      setNotice({ type: "error", text: "Pick a destination from the suggestions first." });
      return;
    }
    if (!dates.checkIn || !dates.checkOut) {
      setNotice({ type: "error", text: "Pick check-in and check-out dates." });
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    const params = new URLSearchParams({
      regionId: selectedRegion.id,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
      label: selectedRegion.name || query,
      rooms: String(guests.rooms),
      adults: String(guests.adults),
      children: String(guests.children),
    });

    navigate(`/stays?${params.toString()}`);
  }, [selectedRegion, dates, guests, query, navigate, isSubmitting]);

  const handleDestinationPick = useCallback((name) => { handleQueryChange(name); }, [handleQueryChange]);

  return (
    <>
      <Header />
      <HotelHeader />
      <PageStyles />
      <div className="obk-app">
        

        {/* ---------------- Hero (gate-display band) ---------------- */}
        <section className="obk-hero">
          <p className="obk-hero-eyebrow">Boarding pass to your next stay</p>
          <h1 className="obk-hero-title">
            Find a stay that feels like an upgrade,
            <br />
            not a compromise.
          </h1>
        </section>

        {/* ---------------- Search kiosk — boarding-pass card ---------------- */}
        <div className="obk-container">
          <form className="ticket" onSubmit={handleSubmit} noValidate>
            <div className="ticket-main">
              <div className="kiosk-field kiosk-field-grow">
                <label className="kiosk-label" htmlFor="destination-input">Destination</label>
                <input
                  id="destination-input"
                  type="text"
                  className="kiosk-input"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Enter city, area or property name"
                  autoComplete="off"
                  disabled={isSubmitting}
                  aria-describedby={notice ? "search-notice" : undefined}
                  required
                />
                {regionLoading && <span className="field-status">Searching…</span>}
                {regions.length > 0 && (
                  <ul className="region-list" role="listbox" aria-label="Destination suggestions">
                    {regions.map((r, i) => (
                      <li key={r.id || i} role="option" aria-selected="false">
                        <button type="button" className="region-item" onClick={() => handlePickRegion(r)}>
                          <strong>{r.name}</strong>
                          {r.subtitle && <small>{r.subtitle}</small>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="kiosk-divider" aria-hidden="true" />

              <div className="kiosk-field">
                <label className="kiosk-label" htmlFor="checkin-input">Check-in</label>
                <input
                  id="checkin-input"
                  type="date"
                  className="kiosk-input"
                  value={dates.checkIn}
                  onChange={(e) => setDates((d) => ({ ...d, checkIn: e.target.value }))}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="kiosk-divider" aria-hidden="true" />

              <div className="kiosk-field">
                <label className="kiosk-label" htmlFor="checkout-input">Check-out</label>
                <input
                  id="checkout-input"
                  type="date"
                  className="kiosk-input"
                  value={dates.checkOut}
                  onChange={(e) => setDates((d) => ({ ...d, checkOut: e.target.value }))}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="kiosk-divider" aria-hidden="true" />

              <GuestPicker guests={guests} setGuests={setGuests} />
            </div>

            <div className="ticket-perforation" aria-hidden="true">
              <span className="notch notch-top" />
              <span className="perf-line" />
              <span className="notch notch-bottom" />
            </div>

            <div className="ticket-stub">
              <span className="stub-caption">Ready when you are</span>
              <button type="submit" className="stub-submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? "Searching…" : "Search"}
                {!isSubmitting && <span className="obk-arrow" aria-hidden="true">›</span>}
              </button>
            </div>
          </form>

          <div className="obk-search-meta">
            {notice && (
              <div id="search-notice" className={`obk-notice obk-notice-${notice.type}`} role="alert">
                {notice.text}
              </div>
            )}
            {selectedRegion && !isSubmitting && !notice && (
              <p className="obk-selected-note">
                Destination set to <strong>{selectedRegion.name}</strong>. Pick your dates and search.
              </p>
            )}
          </div>
        </div>

        {/* ---------------- Best deals (live) ---------------- */}
        <section className="obk-deals-band">
          <div className="obk-container">
            <div className="obk-section-head">
              <div>
                <h2 className="obk-section-title">
                  {selectedRegion?.name ? `Top hotels in ${selectedRegion.name}` : "Best deals for stays"}
                </h2>
                <p className="obk-section-sub">Best Price Guarantee</p>
              </div>
              <a href="#" className="obk-view-all" onClick={(e) => e.preventDefault()}>
                View all <span className="obk-arrow" aria-hidden="true">›</span>
              </a>
            </div>

            {dealsLoading ? (
              <div className="obk-rail" aria-busy="true" aria-label="Loading deals">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div className="deal-card deal-card-skeleton" key={i}>
                    <div className="skeleton-block" />
                    <div className="deal-body">
                      <div className="skeleton-line" style={{ width: "70%", height: 14, marginBottom: 8 }} />
                      <div className="skeleton-line" style={{ width: "50%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : dealsError ? (
              <p className="obk-rail-error" role="alert">Couldn't load live deals ({dealsError}).</p>
            ) : deals.length === 0 ? (
              <p className="obk-rail-empty">No live deals right now — check back soon.</p>
            ) : (
              <div className="obk-rail">
                {deals.map((deal, i) => (
                  <button
                    type="button"
                    className="deal-card"
                    key={deal.id || i}
                    onClick={() => deal.hotelId && navigate(`/stays/hotel/${deal.hotelId}`)}
                  >
                    <div className="deal-photo">
                      {deal.image && <img src={deal.image} alt="" loading="lazy" />}
                      {deal.discountPercent != null && (
                        <span className="deal-discount">{deal.discountPercent}% off</span>
                      )}
                    </div>
                    <div className="deal-body">
                      <p className="deal-name">{deal.name}</p>
                      <p className="deal-loc">{deal.location}</p>
                      <div className="deal-foot">
                        <div className="deal-rating-wrap">
                          {deal.rating != null && <span className="deal-rating">{deal.rating}</span>}
                          {deal.ratingLabel && <span className="deal-rating-label">{deal.ratingLabel}</span>}
                        </div>
                        <span className="deal-price">{deal.price || "—"}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="obk-container">
          {/* ---------------- Offers for you (live) ---------------- */}
          <section className="obk-section">
            <div className="obk-section-head">
              <h2 className="obk-section-title">Offers For You</h2>
              <div className="offers-controls" role="tablist" aria-label="Offer categories">
                <button
                  type="button"
                  role="tab"
                  aria-selected={offersTab === "hotels"}
                  className={`pill-tab ${offersTab === "hotels" ? "active" : ""}`}
                  onClick={() => setOffersTab("hotels")}
                >
                  Hotels
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={offersTab === "bank"}
                  className={`pill-tab ${offersTab === "bank" ? "active" : ""}`}
                  onClick={() => setOffersTab("bank")}
                >
                  Bank Offers
                </button>
                <a href="#" className="obk-view-all" onClick={(e) => e.preventDefault()}>
                  View all <span className="obk-arrow" aria-hidden="true">›</span>
                </a>
              </div>
            </div>

            {offersLoading ? (
              <div className="obk-rail" aria-busy="true" aria-label="Loading offers">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div className="offer-card offer-card-skeleton" key={i}>
                    <div className="skeleton-line" style={{ width: "60%", height: 16, marginBottom: 8 }} />
                    <div className="skeleton-line" style={{ width: "85%" }} />
                  </div>
                ))}
              </div>
            ) : offersError ? (
              <p className="obk-rail-error" role="alert">Couldn't load current offers ({offersError}).</p>
            ) : offers.length === 0 ? (
              <p className="obk-rail-empty">No active offers right now — check back soon.</p>
            ) : (
              <div className="obk-rail">
                {offers.map((offer, i) => (
                  <div className={`offer-card offer-tint-${i % 4}`} key={offer.id || i}>
                    <p className="offer-title">{offer.title}</p>
                    {offer.subtitle && <p className="offer-sub">{offer.subtitle}</p>}
                    {offer.code && <span className="offer-code">Code: {offer.code}</span>}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ---------------- Why book with us ---------------- */}
          <section className="obk-section">
            <div className="obk-section-head">
              <h2 className="obk-section-title">Why Book Hotels With DesiVDesi?</h2>
            </div>
            <div className="why-strip">
              {WHY_ITEMS.map((item) => (
                <div className="why-item" key={item.title}>
                  <span className="why-icon" aria-hidden="true">{item.icon}</span>
                  <span className="why-title">{item.title}</span>
                  <span className="why-sub">{item.sub}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- Popular destinations ---------------- */}
          <section className="obk-section">
            <div className="obk-section-head">
              <h2 className="obk-section-title">Popular Destinations</h2>
            </div>
            <div className="dest-grid">
              {POPULAR_DESTINATIONS.map((d) => (
                <div className="dest-col" key={d.name}>
                  <button
                    type="button"
                    className="dest-card"
                    onClick={() => handleDestinationPick(d.name)}
                    style={{ backgroundImage: `url(${d.photo})` }}
                    aria-label={`Search stays in ${d.name}, ${d.state}`}
                  >
                    <span className="dest-text">
                      <span className="dest-name">{d.name}</span>
                      <span className="dest-state">{d.state}</span>
                    </span>
                  </button>
                  <div className="dest-foot">
                    {d.properties.toLocaleString()} Properties
                    <span className="obk-arrow" aria-hidden="true">›</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- FAQ ---------------- */}
          <section className="obk-section">
            <div className="obk-section-head">
              <h2 className="obk-section-title">Hotel Booking FAQs</h2>
            </div>
            <div className="faq-list">
              {FAQS.map((item, i) => {
                const panelId = `faq-panel-${i}`;
                const isOpen = openFaq === i;
                return (
                  <div className={`faq-item${isOpen ? " open" : ""}`} key={item.q}>
                    <h3 className="faq-heading">
                      <button
                        type="button"
                        className="faq-q"
                        id={`faq-btn-${i}`}
                        onClick={() => setOpenFaq((cur) => (cur === i ? null : i))}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                      >
                        {item.q}
                        <svg className="faq-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </h3>
                    {isOpen && (
                      <p className="faq-a" id={panelId} role="region" aria-labelledby={`faq-btn-${i}`}>
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---------------- About / SEO copy ---------------- */}
          <section className="obk-section obk-about" style={{ marginBottom: 40 }}>
            <h3>Booking a stay with DesiVDesi</h3>
            <p>
              DesiVDesi brings together a wide range of properties in one place, from budget hostels to
              full-service hotels, so you can compare and book in a few taps. Every listing reflects live
              pricing and availability pulled straight from our partners.
            </p>
            <h3>What you get</h3>
            <ol>
              <li><strong>Live pricing</strong> — the price you see is the price at checkout.</li>
              <li><strong>Flexible payment</strong> — pay online or at the property, where supported.</li>
              <li><strong>Round-the-clock support</strong> — help is available whenever your trip needs it.</li>
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------
   Internal CSS — token-driven, no raw hex outside :root.
   Namespaced with "obk-" (and unprefixed component classes scoped
   under .obk-app) to avoid collisions with the rest of the app.
------------------------------------------------------------------- */
function PageStyles() {
  return (
    <style>{`
      :root {
        /* ---- Design tokens (Online Hotel Booking) ---- */
        --font-family-primary: __ixiFonts_69e750;
        --font-family-stack: __ixiFonts_69e750, __ixiFonts_Fallback_69e750, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        --font-size-base: 15px;
        --font-weight-base: 400;
        --line-height-base: 22.5px;

        --font-size-xs: 8px;
        --font-size-sm: 10px;
        --font-size-md: 12px;
        --font-size-lg: 14px;
        --font-size-xl: 15px;
        --font-size-2xl: 16px;
        --font-size-3xl: 18px;
        --font-size-4xl: 20px;

        --color-text-primary: #17181c;
        --color-text-secondary: #5e616e;
        --color-text-tertiary: #ffffff;
        --color-text-inverse: #fafafa;
        --color-surface-base: #000000;
        --color-surface-muted: #0770e4;
        --color-surface-raised: #f4f5f5;
        --color-surface-strong: #fc790d;
        --color-border-default: #e5e7eb;

        --space-1: 5px;
        --space-2: 8px;
        --space-3: 10px;
        --space-4: 15px;
        --space-5: 20px;
        --space-6: 30px;

        --radius-xs: 4px;
        --radius-sm: 5px;
        --radius-md: 10px;
        --motion-instant: 150ms;

        /* derived, non-brand utility values */
        --color-success: #1e8e3e;
        --color-danger: #b3261e;
        --color-danger-bg: #fdecec;
        --focus-ring: 0 0 0 3px rgba(7, 112, 228, 0.35);
      }

      .obk-app {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 var(--space-4) 48px;
        font-family: var(--font-family-stack);
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-base);
        line-height: var(--line-height-base);
        color: var(--color-text-primary);
      }

      .obk-app *:focus-visible {
        outline: 2px solid var(--color-surface-muted);
        outline-offset: 2px;
        border-radius: var(--radius-xs);
      }

      /* ---- Hero: gate-display band ---- */
      .obk-hero {
        background: var(--color-surface-base);
        color: var(--color-text-tertiary);
        border-radius: var(--radius-md);
        padding: var(--space-6) var(--space-5) calc(var(--space-6) + 6px);
        margin-top: var(--space-5);
        text-align: center;
      }
      .obk-hero-eyebrow {
        font-size: var(--font-size-md);
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--color-surface-strong);
        font-weight: 700;
        margin: 0 0 var(--space-2);
      }
      .obk-hero-title {
        font-size: var(--font-size-4xl);
        font-weight: 700;
        line-height: 1.3;
        margin: 0;
        color: var(--color-text-tertiary);
      }
      @media (min-width: 640px) {
        .obk-hero-title { font-size: 28px; }
      }

      .obk-container { max-width: 1200px; margin: 0 auto; }

      /* ---- Ticket / kiosk search bar (signature element) ---- */
      .ticket {
        display: flex;
        align-items: stretch;
        background: #ffffff;
        border-radius: var(--radius-md);
        box-shadow: 0 6px 24px rgba(0,0,0,0.10);
        margin-top: -22px;
        position: relative;
        z-index: 2;
        overflow: visible;
      }
      .ticket-main {
        flex: 1 1 auto;
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        padding: var(--space-3) var(--space-2);
      }
      .kiosk-field {
        flex: 1 1 160px;
        padding: var(--space-2) var(--space-4);
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 140px;
        position: relative;
      }
      .kiosk-field-grow { flex: 2 1 260px; }
      .kiosk-label {
        font-size: var(--font-size-md);
        color: var(--color-text-secondary);
        margin-bottom: 2px;
      }
      .kiosk-input {
        border: none;
        outline: none;
        background: transparent;
        width: 100%;
        font-family: inherit;
        font-size: var(--font-size-xl);
        font-weight: 500;
        color: var(--color-text-primary);
        border-radius: var(--radius-xs);
      }
      .kiosk-input:disabled { color: var(--color-text-secondary); }
      .kiosk-input::placeholder { color: #9aa0aa; }
      .kiosk-divider { width: 1px; background: var(--color-border-default); margin: var(--space-2) 0; }
      .field-status { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: 2px; }

      .guest-trigger {
        border: none;
        background: transparent;
        text-align: left;
        padding: 0;
        width: 100%;
        border-radius: var(--radius-xs);
        cursor: pointer;
      }
      .guest-value { font-size: var(--font-size-xl); font-weight: 500; color: var(--color-text-primary); }

      .region-list {
        position: absolute; top: calc(100% + 6px); left: 0; right: 0; margin: 0; padding: 0; list-style: none;
        background: #fff; border: 1px solid var(--color-border-default); border-radius: var(--radius-sm);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 20; max-height: 260px; overflow-y: auto;
      }
      .region-item {
        display: flex; flex-direction: column; width: 100%; text-align: left;
        padding: var(--space-3) var(--space-4); border: none; background: none; cursor: pointer;
        border-bottom: 1px solid var(--color-border-default); font-family: inherit; font-size: var(--font-size-lg);
        color: var(--color-text-primary);
        transition: background var(--motion-instant) ease;
      }
      .region-list li:last-child .region-item { border-bottom: none; }
      .region-item:hover, .region-item:focus-visible { background: var(--color-surface-raised); }
      .region-item small { color: var(--color-text-secondary); font-size: var(--font-size-sm); }

      .guest-pop {
        position: absolute; top: calc(100% + 8px); right: 0; width: 260px;
        background: #fff; border-radius: var(--radius-md); box-shadow: 0 10px 30px rgba(0,0,0,0.16);
        padding: var(--space-4); z-index: 20; border: 1px solid var(--color-border-default);
      }
      .guest-row { display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) 0; }
      .guest-row-label { font-weight: 600; font-size: var(--font-size-lg); }
      .guest-row-sub { font-size: var(--font-size-md); color: var(--color-text-secondary); }
      .stepper { display: flex; align-items: center; gap: var(--space-3); }
      .stepper button {
        width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--color-border-default);
        background: #fff; font-size: var(--font-size-2xl); cursor: pointer; color: var(--color-text-primary);
        transition: background var(--motion-instant) ease, border-color var(--motion-instant) ease;
      }
      .stepper button:hover:not(:disabled) { border-color: var(--color-surface-muted); }
      .stepper button:active:not(:disabled) { background: var(--color-surface-raised); }
      .stepper button:disabled { opacity: 0.35; cursor: not-allowed; }
      .guest-done {
        margin-top: var(--space-3); width: 100%; background: var(--color-surface-strong); color: #fff;
        border: none; border-radius: var(--radius-sm); padding: var(--space-3); font-weight: 600;
        font-family: inherit; font-size: var(--font-size-lg); cursor: pointer;
        transition: filter var(--motion-instant) ease;
      }
      .guest-done:hover { filter: brightness(0.94); }

      /* Perforation between fields and the search stub */
      .ticket-perforation {
        display: flex; flex-direction: column; align-items: center; justify-content: space-between;
        width: 0; position: relative;
      }
      .perf-line {
        flex: 1; width: 0; border-left: 2px dashed var(--color-border-default); margin: 10px 0;
      }
      .notch {
        width: 18px; height: 18px; border-radius: 50%; background: var(--color-surface-raised);
        margin-left: -9px; flex-shrink: 0;
      }

      .ticket-stub {
        flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: var(--space-2); padding: var(--space-4) var(--space-5); min-width: 160px;
      }
      .stub-caption { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
      .stub-submit {
        border: none; background: var(--color-surface-strong); color: #fff; font-weight: 700;
        font-family: inherit; font-size: var(--font-size-xl); border-radius: var(--radius-sm);
        padding: var(--space-3) var(--space-5); display: flex; align-items: center; gap: var(--space-2);
        white-space: nowrap; cursor: pointer; transition: filter var(--motion-instant) ease, transform var(--motion-instant) ease;
      }
      .stub-submit:hover:not(:disabled) { filter: brightness(0.93); }
      .stub-submit:active:not(:disabled) { transform: translateY(1px); }
      .stub-submit:disabled { opacity: 0.7; cursor: progress; }
      .obk-arrow { font-size: var(--font-size-2xl); line-height: 1; }

      .obk-search-meta { min-height: 20px; }
      .obk-selected-note { margin-top: var(--space-3); font-size: var(--font-size-lg); color: var(--color-text-secondary); }
      .obk-notice { margin-top: var(--space-3); padding: var(--space-3) var(--space-4); border-radius: var(--radius-sm); font-size: var(--font-size-lg); }
      .obk-notice-error { background: var(--color-danger-bg); color: var(--color-danger); }

      /* ---- Section shell ---- */
      .obk-section { margin-top: var(--space-6); }
      .obk-section-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-2); }
      .obk-section-title { font-size: var(--font-size-3xl); font-weight: 700; margin: 0; color: var(--color-text-primary); }
      .obk-section-sub { font-size: var(--font-size-md); color: var(--color-text-secondary); margin: 2px 0 0; }
      .obk-view-all {
        color: var(--color-surface-muted); font-weight: 600; font-size: var(--font-size-lg); text-decoration: none;
        white-space: nowrap; border-radius: var(--radius-xs);
      }
      .obk-view-all:hover { text-decoration: underline; }

      .offers-controls { display: flex; align-items: center; gap: var(--space-2); margin-left: auto; }
      .pill-tab {
        border: 1px solid var(--color-border-default); background: #fff; border-radius: 20px;
        padding: var(--space-2) var(--space-4); font-size: var(--font-size-lg); font-weight: 600;
        color: var(--color-text-primary); cursor: pointer; font-family: inherit;
        transition: background var(--motion-instant) ease, border-color var(--motion-instant) ease, color var(--motion-instant) ease;
      }
      .pill-tab:hover { border-color: var(--color-surface-muted); }
      .pill-tab.active { background: #e9f0ff; border-color: var(--color-surface-muted); color: var(--color-surface-muted); }

      /* ---- Deals band ---- */
      .obk-deals-band { background: var(--color-surface-raised); padding: var(--space-6) 0; margin-top: var(--space-5); border-radius: var(--radius-md); }

      .obk-rail { display: flex; gap: var(--space-4); overflow-x: auto; padding-bottom: var(--space-2); scrollbar-width: thin; }
      .obk-rail-error, .obk-rail-empty { color: var(--color-text-secondary); font-size: var(--font-size-lg); }

      .deal-card {
        flex: 0 0 220px; background: #fff; border-radius: var(--radius-md); overflow: hidden; border: none;
        text-align: left; box-shadow: 0 2px 10px rgba(0,0,0,0.06); cursor: pointer; padding: 0;
        transition: transform var(--motion-instant) ease, box-shadow var(--motion-instant) ease;
        font-family: inherit;
      }
      .deal-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.10); }
      .deal-card-skeleton { cursor: default; }
      .deal-photo { position: relative; height: 130px; background: var(--color-border-default); }
      .deal-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .deal-discount { position: absolute; top: 8px; left: 8px; background: var(--color-success); color: #fff; font-size: var(--font-size-sm); font-weight: 700; padding: 3px 8px; border-radius: 20px; }
      .deal-body { padding: var(--space-3) var(--space-3) var(--space-4); }
      .deal-name { font-weight: 700; font-size: var(--font-size-lg); margin: 0 0 2px; color: var(--color-text-primary); }
      .deal-loc { font-size: var(--font-size-md); color: var(--color-text-secondary); margin: 0 0 var(--space-3); }
      .deal-foot { display: flex; align-items: center; justify-content: space-between; }
      .deal-rating-wrap { display: flex; align-items: center; gap: var(--space-2); }
      .deal-rating { background: var(--color-text-primary); color: #fff; font-size: var(--font-size-md); font-weight: 700; padding: 2px 7px; border-radius: 5px; }
      .deal-rating-label { font-size: var(--font-size-md); color: var(--color-text-secondary); }
      .deal-price { font-weight: 700; font-size: var(--font-size-lg); color: var(--color-text-primary); }

      .skeleton-block { height: 130px; background: var(--color-border-default); }
      .skeleton-line { height: 10px; background: var(--color-border-default); border-radius: var(--radius-xs); }

      /* ---- Offers rail ---- */
      .offer-card { flex: 0 0 230px; border-radius: var(--radius-md); padding: var(--space-4); color: #fff; }
      .offer-card-skeleton { background: var(--color-surface-raised); }
      .offer-title { font-weight: 700; font-size: var(--font-size-xl); margin: 0 0 4px; }
      .offer-sub { font-size: var(--font-size-md); margin: 0 0 var(--space-3); opacity: 0.9; }
      .offer-code { display: inline-block; background: rgba(255,255,255,0.2); font-size: var(--font-size-sm); font-weight: 700; padding: 3px 8px; border-radius: 20px; }
      .offer-tint-0 { background: linear-gradient(160deg, var(--color-surface-muted), #123a86); }
      .offer-tint-1 { background: linear-gradient(160deg, var(--color-surface-strong), #b85608); }
      .offer-tint-2 { background: #ffffff; color: var(--color-text-primary); border: 1px solid var(--color-border-default); }
      .offer-tint-3 { background: linear-gradient(160deg, var(--color-text-primary), #3a3d47); }

      /* ---- Why book strip ---- */
      .why-strip { display: flex; gap: var(--space-4); flex-wrap: wrap; }
      .why-item {
        flex: 1 1 180px; border-radius: var(--radius-md); padding: var(--space-5);
        display: flex; flex-direction: column; gap: 4px; background: var(--color-surface-raised);
        border: 1px solid var(--color-border-default);
      }
      .why-icon { font-size: var(--font-size-4xl); margin-bottom: 4px; }
      .why-title { font-weight: 700; font-size: var(--font-size-lg); color: var(--color-text-primary); }
      .why-sub { font-size: var(--font-size-md); color: var(--color-text-secondary); }

      /* ---- Popular destinations ---- */
      .dest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: var(--space-5); }
      .dest-col { display: flex; flex-direction: column; }
      .dest-card {
        position: relative; height: 210px; border: none; border-radius: var(--radius-md);
        background-size: cover; background-position: center; overflow: hidden; padding: 0; cursor: pointer;
        transition: transform var(--motion-instant) ease;
      }
      .dest-card:hover { transform: translateY(-2px); }
      .dest-card::after {
        content: ""; position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0) 55%);
      }
      .dest-text { position: absolute; left: var(--space-4); bottom: var(--space-3); z-index: 2; display: flex; flex-direction: column; text-align: left; }
      .dest-name { color: #fff; font-weight: 700; font-size: var(--font-size-2xl); }
      .dest-state { color: #e8e8e8; font-size: var(--font-size-xs); letter-spacing: 1px; text-transform: uppercase; }
      .dest-foot { margin-top: var(--space-2); font-size: var(--font-size-lg); font-weight: 600; display: flex; align-items: center; gap: 4px; color: var(--color-text-primary); }

      /* ---- FAQ ---- */
      .faq-list { background: #fff; border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: 4px var(--space-5); }
      .faq-item { border-bottom: 1px solid var(--color-border-default); padding: var(--space-4) 0; }
      .faq-item:last-child { border-bottom: none; }
      .faq-heading { margin: 0; font-size: inherit; font-weight: inherit; }
      .faq-q {
        width: 100%; text-align: left; border: none; background: none; cursor: pointer;
        display: flex; align-items: center; justify-content: space-between;
        font-weight: 700; font-size: var(--font-size-lg); font-family: inherit; color: var(--color-text-primary);
        padding: var(--space-1) 0;
      }
      .faq-caret { transition: transform var(--motion-instant) ease; flex-shrink: 0; }
      .faq-item.open .faq-caret { transform: rotate(180deg); }
      .faq-a { margin: var(--space-2) 0 0; color: var(--color-text-secondary); font-size: var(--font-size-lg); line-height: 1.6; }

      .obk-about h3 { font-size: var(--font-size-2xl); margin: var(--space-4) 0 6px; color: var(--color-text-primary); }
      .obk-about p, .obk-about li { color: var(--color-text-secondary); font-size: var(--font-size-lg); line-height: 1.7; }

      @media (max-width: 768px) {
        .ticket { flex-direction: column; }
        .ticket-perforation { flex-direction: row; width: auto; height: 0; padding: 0 var(--space-4); }
        .perf-line { width: auto; height: 0; border-left: none; border-top: 2px dashed var(--color-border-default); flex: 1; margin: 0 10px; }
        .notch { margin-left: 0; margin-top: -9px; }
        .ticket-stub { padding: var(--space-4); }
        .stub-submit { width: 100%; justify-content: center; }
        .obk-hero-title { font-size: var(--font-size-3xl); }
      }

      @media (prefers-reduced-motion: reduce) {
        .obk-app * { transition: none !important; }
      }
    `}</style>
  );
}