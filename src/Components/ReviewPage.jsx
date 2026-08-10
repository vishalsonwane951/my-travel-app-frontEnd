// Components/ReviewsAndQA.jsx
// Reusable Reviews & Q&A section extracted from ItineraryPage.
//
// Props:
//   initialReviews   {Array}    – seed review objects (defaults to SAMPLE_REVIEWS)
//   initialQA        {Array}    – seed Q&A objects    (defaults to SAMPLE_QA)
//   onOpenContribute {Function} – (tab: "review"|"qa"|"photo") → void
//                                 Lets a parent open ContributeSection externally.
//   sectionRef       {React.Ref} – forwarded ref for scroll-spy in the parent.
//   BRAND            {Object}   – optional design-token override (falls back to
//                                  built-in defaults).
//   pkgId            {string|number} – package ID to fetch reviews for.

import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaStar,
  FaThumbsUp,
  FaEllipsisH,
  FaChevronLeft,
  FaChevronRight,
  FaQuestionCircle,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import api from "../utils/api"; // ← adjust path to your axios instance

// ─── Default design tokens ────────────────────────────────────────────────────
const DEFAULT_BRAND = {
  primary: "#F04B5A",
  primaryDark: "#D03848",
  navy: "#1A2340",
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

// ─── Sample data (fallback when API returns empty / pkgId absent) ─────────────
const SAMPLE_REVIEWS = [
  { id: 1, name: "Priya S.", location: "Mumbai, India", rating: 5, title: "Absolutely unforgettable experience!", text: "The trip was meticulously planned. Every hotel, every transfer, every meal — perfectly organized. Our guide was knowledgeable and friendly. Will definitely book again!", date: "June 2026", tripType: "Family", helpful: 12 },
  { id: 2, name: "Rahul M.", location: "Bangalore, India", rating: 5, title: "Best value for money", text: "Compared to other packages, this one gave us so much more for the price. The itinerary was packed yet relaxed. Highly recommend for couples!", date: "May 2026", tripType: "Couple", helpful: 8 },
  { id: 3, name: "Anika T.", location: "Delhi, India", rating: 4, title: "Great trip with minor hiccups", text: "Overall a wonderful experience. The hotels were lovely and the food was amazing. There were a couple of small delays in transfers but the team handled them well.", date: "April 2026", tripType: "Friends", helpful: 5 },
  { id: 4, name: "Suresh K.", location: "Pune, India", rating: 5, title: "Highly professional team", text: "From booking to the last day, everything was smooth. The team is very responsive and accommodating. The destinations chosen were breathtaking.", date: "March 2026", tripType: "Family", helpful: 14 },
  { id: 5, name: "Neha R.", location: "Hyderabad, India", rating: 4, title: "Loved every moment", text: "A truly special trip. The activities were fun and engaging. The accommodation was comfortable and well-located. Would love to do another tour!", date: "March 2026", tripType: "Solo", helpful: 3 },
  { id: 6, name: "Vikram B.", location: "Chennai, India", rating: 5, title: "Seamless and wonderful", text: "I was initially skeptical about package tours but this completely changed my mind. Everything was taken care of so I could just enjoy the trip.", date: "February 2026", tripType: "Couple", helpful: 9 },
  { id: 7, name: "Kavya L.", location: "Kolkata, India", rating: 3, title: "Good but could be better", text: "The trip was enjoyable but some of the sightseeing timings felt rushed. The hotels were excellent though and the food arrangements were great.", date: "January 2026", tripType: "Family", helpful: 2 },
  { id: 8, name: "Arjun P.", location: "Ahmedabad, India", rating: 5, title: "Exceeded all expectations", text: "I've done many tours but this one stands apart. The attention to detail is remarkable. Our customised itinerary had everything we wanted and more.", date: "December 2025", tripType: "Business", helpful: 7 },
];

const SAMPLE_QA = [
  { id: 1, author: "Rohit K.", contributions: 12, question: "Is the tour suitable for senior citizens? What are the physical requirements?", date: "May 2026", answer: "Yes, this tour is senior-friendly. Most activities are leisurely with comfortable transport. Please inform us of any mobility needs and we'll customise accordingly." },
  { id: 2, author: "Meena S.", contributions: 5, question: "Can we extend the tour by a day or two and visit nearby attractions?", date: "April 2026", answer: null },
  { id: 3, author: "Deepak J.", contributions: 28, question: "Are vegetarian and Jain food options available throughout the trip?", date: "March 2026", answer: "Absolutely! We accommodate all dietary requirements including vegetarian, Jain, and vegan. Please mention your preference at the time of booking." },
  { id: 4, author: "Sunita R.", contributions: 3, question: "What is the cancellation policy if we need to cancel last minute?", date: "February 2026", answer: null },
];

const REVIEWS_PER_PAGE = 3;
const QA_PER_PAGE = 3;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating = 0, size = 14, color }) {
  const amber = color || DEFAULT_BRAND.amber;
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          size={size}
          color={i <= Math.round(rating) ? amber : DEFAULT_BRAND.borderLight}
        />
      ))}
    </div>
  );
}

function RatingBar({ label, count, total, color }) {
  const B = DEFAULT_BRAND;
  const pct = total > 0 ? (count / total) * 100 : 0;
  const fill = color || B.success;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: ".78rem", color: B.bodyText, width: 70, flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 8, borderRadius: 50, background: B.borderLight, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: fill,
            borderRadius: 50,
            transition: "width .6s ease",
          }}
        />
      </div>
      <span style={{ fontSize: ".75rem", color: B.meta, width: 28, textAlign: "right", flexShrink: 0 }}>
        {count}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const ReviewsAndQA = React.forwardRef(function ReviewsAndQA(
  {
    initialReviews = SAMPLE_REVIEWS,
    initialQA = SAMPLE_QA,
    onOpenContribute = () => {},
    BRAND: brandOverride,
    pkgId,
  },
  ref
) {
  const B = { ...DEFAULT_BRAND, ...brandOverride };

  // ── State ──────────────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState([]);           // ✅ reviews list
  const [reviewsLoading, setReviewsLoading] = useState(false); // ✅ FIX: was missing
  const [reviewsError, setReviewsError] = useState(null);      // ✅ FIX: was missing

  const [reviewPage, setReviewPage] = useState(1);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewTab, setReviewTab] = useState("reviews");
  const [helpfulClicked, setHelpfulClicked] = useState({});
  const [qaPage, setQaPage] = useState(1);

  // ── Fetch reviews ──────────────────────────────────────────────────────────
  // FIX: removed console.log from component body (was causing log spam on every render)
  // FIX: setReviewsLoading / setReviewsError now properly declared above
  useEffect(() => {
    if (!pkgId) {
      // No pkgId — fall back to sample data
      setReviews(initialReviews);
      return;
    }

    let cancelled = false;

    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const res = await api.get(`/reviews/${pkgId}`);
        if (!cancelled) {
          const data = Array.isArray(res.data) ? res.data : [];
          // setReviews(data.length > 0 ? data : initialReviews);
        }
      } catch (err) {
        if (!cancelled) {
          setReviewsError(err?.response?.data?.message || "Failed to load reviews.");
          setReviews(initialReviews); // graceful fallback
        }
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    };

    fetchReviews();
    return () => { cancelled = true; };
  }, [pkgId]); // ✅ FIX: fetchReviews defined inside effect — not a dep

  // ── Derived review data ────────────────────────────────────────────────────
  const filteredReviews = reviews.filter(
    (r) =>
      reviewSearch === "" ||
      r.title?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.text?.toLowerCase().includes(reviewSearch.toLowerCase())
  );
  const totalReviewPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const pagedReviews = filteredReviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE
  );

  const avgRating =
    reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  // ── Derived Q&A data ───────────────────────────────────────────────────────
  const totalQaPages = Math.ceil(initialQA.length / QA_PER_PAGE);
  const pagedQa = initialQA.slice(
    (qaPage - 1) * QA_PER_PAGE,
    qaPage * QA_PER_PAGE
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleHelpful = (id) => {
    if (helpfulClicked[id]) return;
    setHelpfulClicked((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpful: (r.helpful || 0) + 1 } : r))
    );
  };

  // ── Scoped styles ──────────────────────────────────────────────────────────
  const css = `
    .rqa-section { background: #fff; padding: 1rem 0; border-top: 1px solid ${B.borderLight}; }
    .rqa-tab { border: none; background: transparent; font-family: inherit; font-size: .9rem; font-weight: 600; cursor: pointer; padding: .65rem 0; margin-right: 1.5rem; border-bottom: 3px solid transparent; color: ${B.meta}; transition: all .2s; }
    .rqa-tab.active { color: ${B.charcoal}; border-bottom-color: ${B.charcoal}; }
    .rqa-search { border: 1.5px solid ${B.border}; border-radius: 50px; padding: .55rem 1rem .55rem 2.5rem; font-family: inherit; font-size: .85rem; width: 100%; transition: border-color .2s; background: #fff; }
    .rqa-search:focus { outline: none; border-color: ${B.primary}; box-shadow: 0 0 0 3px rgba(240,75,90,.08); }
    .rqa-review-card { background: #fff; border: 1px solid ${B.border}; border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 16px; transition: box-shadow .2s; }
    .rqa-review-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,.07); }
    .rqa-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg,${B.primary},${B.amber}); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 1rem; flex-shrink: 0; }
    .rqa-avatar-qa { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg,#3D52A0,#6B7280); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: .85rem; flex-shrink: 0; }
    .rqa-helpful-btn { border: 1.5px solid ${B.border}; background: #fff; border-radius: 50px; padding: .28rem .9rem; font-size: .75rem; color: ${B.meta}; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all .2s; font-family: inherit; }
    .rqa-helpful-btn:hover, .rqa-helpful-btn.clicked { border-color: ${B.primary}; color: ${B.primary}; background: rgba(240,75,90,.04); }
    .rqa-pg-btn { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid ${B.border}; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: .82rem; color: ${B.meta}; transition: all .2s; font-family: inherit; font-weight: 600; }
    .rqa-pg-btn:hover:not(:disabled) { border-color: ${B.primary}; color: ${B.primary}; }
    .rqa-pg-btn.active { background: ${B.primary}; border-color: ${B.primary}; color: #fff; }
    .rqa-pg-btn:disabled { opacity: .4; cursor: not-allowed; }
    .rqa-qa-item { border-bottom: 1px solid ${B.borderLight}; padding: 1.25rem 0; }
    .rqa-qa-item:last-child { border-bottom: none; }
    .rqa-answer { margin-top: .75rem; padding: .85rem 1rem; border-radius: 10px; background: ${B.bgCard}; border: 1px solid ${B.borderLight}; font-size: .84rem; color: ${B.bodyText}; line-height: 1.7; }
    .rqa-ask-btn { border: none; background: ${B.primary}; color: #fff; font-family: inherit; font-weight: 700; border-radius: 50px; padding: .6rem 1.5rem; font-size: .88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all .25s; margin-top: 1.25rem; }
    .rqa-ask-btn:hover { background: ${B.primaryDark}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(240,75,90,.28); }
    .rqa-answer-link { border: none; background: transparent; font-family: inherit; border-radius: 50px; padding: .32rem 1rem; font-size: .77rem; color: #3D52A0; font-weight: 600; cursor: pointer; text-decoration: underline; margin-top: 10px; display: inline-block; }
    .font-serif-rqa { font-family: 'Cormorant Garamond', Georgia, serif; }
    @keyframes rqa-spin { to { transform: rotate(360deg); } }
    .rqa-spinner { animation: rqa-spin 0.8s linear infinite; }
  `;

  // ── Pagination helper ──────────────────────────────────────────────────────
  const Pagination = ({ page, total, onChange }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: "1.5rem" }}>
      <button
        className="rqa-pg-btn"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        <FaChevronLeft size={11} />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={`rqa-pg-btn ${page === p ? "active" : ""}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="rqa-pg-btn"
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
      >
        <FaChevronRight size={11} />
      </button>
    </div>
  );

  // ── Loading / error states ─────────────────────────────────────────────────
  const LoadingState = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem", gap: 10, color: B.meta }}>
      <FaSpinner className="rqa-spinner" size={18} />
      <span style={{ fontSize: ".88rem" }}>Loading reviews…</span>
    </div>
  );

  const ErrorState = () => (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "1rem 1.25rem", borderRadius: 10,
      background: "rgba(240,75,90,.06)", border: `1px solid rgba(240,75,90,.2)`,
      color: B.primary, fontSize: ".85rem", marginBottom: 16,
    }}>
      <FaExclamationCircle size={15} />
      <span>{reviewsError} Showing sample reviews.</span>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>

      <section className="rqa-section" ref={ref}>
        <div className="container" style={{ maxWidth: 1280 }}>

          {/* Heading */}
          <h2
            className="font-serif-rqa fw-bold mb-1"
            style={{ fontSize: "2rem", color: B.charcoal }}
          >
            Reviews &amp; Q&amp;A
          </h2>
          <p style={{ color: B.meta, fontSize: ".9rem", marginBottom: "1.5rem" }}>
            Hear from travellers who've experienced this package
          </p>

          {/* Tab bar */}
          <div style={{ borderBottom: `1px solid ${B.border}`, marginBottom: "1.5rem" }}>
            <button
              className={`rqa-tab ${reviewTab === "reviews" ? "active" : ""}`}
              onClick={() => setReviewTab("reviews")}
            >
              Reviews{" "}
              <span style={{ fontSize: ".78rem", background: B.borderLight, borderRadius: 50, padding: "2px 8px", marginLeft: 4 }}>
                {reviews.length}
              </span>
            </button>
            <button
              className={`rqa-tab ${reviewTab === "qa" ? "active" : ""}`}
              onClick={() => setReviewTab("qa")}
            >
              Q&amp;A{" "}
              <span style={{ fontSize: ".78rem", background: B.borderLight, borderRadius: 50, padding: "2px 8px", marginLeft: 4 }}>
                {initialQA.length}
              </span>
            </button>
          </div>

          {/* ── REVIEWS TAB ── */}
          {reviewTab === "reviews" && (
            <>
              {/* Error banner (non-blocking) */}
              {reviewsError && <ErrorState />}

              {reviewsLoading ? (
                <LoadingState />
              ) : (
                <div className="row g-4">

                  {/* Left: aggregate summary */}
                  <div className="col-lg-3 col-md-4">
                    <div style={{ position: "sticky", top: 70 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div style={{
                          width: 64, height: 64, borderRadius: 12,
                          background: B.primary,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{ fontSize: "1.55rem", fontWeight: 800, color: "#fff", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                            {avgRating}
                          </span>
                        </div>
                        <div>
                          <StarRating rating={parseFloat(avgRating)} size={15} color={B.amber} />
                          <div style={{ fontSize: ".75rem", color: B.meta, marginTop: 4 }}>
                            {reviews.length} reviews
                          </div>
                        </div>
                      </div>
                      {[
                        { label: "Excellent", count: ratingCounts[5], color: "#16a34a" },
                        { label: "Very Good", count: ratingCounts[4], color: "#65a30d" },
                        { label: "Average",   count: ratingCounts[3], color: B.amber },
                        { label: "Poor",      count: ratingCounts[2], color: "#ea580c" },
                        { label: "Terrible",  count: ratingCounts[1], color: B.primary },
                      ].map((bar) => (
                        <RatingBar key={bar.label} {...bar} total={reviews.length} />
                      ))}
                    </div>
                  </div>

                  {/* Right: review list */}
                  <div className="col-lg-9 col-md-8">
                    {/* Search */}
                    <div style={{ position: "relative", marginBottom: 12 }}>
                      <FaSearch
                        size={13}
                        style={{
                          position: "absolute", left: 14, top: "50%",
                          transform: "translateY(-50%)", color: B.placeholder,
                        }}
                      />
                      <input
                        className="rqa-search"
                        placeholder="Search reviews…"
                        value={reviewSearch}
                        onChange={(e) => {
                          setReviewSearch(e.target.value);
                          setReviewPage(1);
                        }}
                      />
                    </div>

                    {/* Cards */}
                    {pagedReviews.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "3rem", color: B.meta }}>
                        No reviews match your search.
                      </div>
                    ) : (
                      pagedReviews.map((r) => (
                        <div key={r.id} className="rqa-review-card">
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                            <div className="rqa-avatar">{r.name?.charAt(0) ?? "?"}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: ".9rem", color: B.charcoal }}>{r.name}</div>
                                  <div style={{ fontSize: ".75rem", color: B.meta }}>{r.location}</div>
                                </div>
                                <button style={{ border: "none", background: "transparent", color: B.placeholder, cursor: "pointer", padding: "4px 8px" }}>
                                  <FaEllipsisH size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <StarRating rating={r.rating} size={13} color={B.amber} />
                            <span style={{ fontWeight: 700, fontSize: ".82rem", color: B.charcoal }}>{r.title}</span>
                          </div>
                          <div style={{ fontSize: ".78rem", color: B.meta, marginBottom: 8 }}>
                            {r.date} · {r.tripType}
                          </div>
                          <p style={{ fontSize: ".86rem", color: B.bodyText, lineHeight: 1.7, marginBottom: "1rem" }}>
                            {r.text}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: ".75rem", color: B.meta }}>Helpful?</span>
                            <button
                              className={`rqa-helpful-btn ${helpfulClicked[r.id] ? "clicked" : ""}`}
                              onClick={() => handleHelpful(r.id)}
                            >
                              <FaThumbsUp size={11} /> {r.helpful ?? 0}
                            </button>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Pagination */}
                    {totalReviewPages > 1 && (
                      <Pagination page={reviewPage} total={totalReviewPages} onChange={setReviewPage} />
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Q&A TAB ── */}
          {reviewTab === "qa" && (
            <div style={{ maxWidth: 820 }}>
              {pagedQa.map((q) => (
                <div key={q.id} className="rqa-qa-item">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div className="rqa-avatar-qa">{q.author?.charAt(0) ?? "?"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: ".88rem", color: B.charcoal }}>{q.author}</span>
                          <span style={{ fontSize: ".75rem", color: B.placeholder, marginLeft: 8 }}>
                            {q.contributions} contributions
                          </span>
                        </div>
                        <button style={{ border: "none", background: "transparent", color: B.placeholder, cursor: "pointer" }}>
                          <FaEllipsisH size={13} />
                        </button>
                      </div>
                      <p style={{ fontSize: ".88rem", color: B.charcoal, fontWeight: 500, margin: "8px 0 4px" }}>
                        {q.question}
                      </p>
                      <div style={{ fontSize: ".73rem", color: B.placeholder }}>Written {q.date}</div>

                      {q.answer ? (
                        <div className="rqa-answer">
                          <div style={{ fontWeight: 700, fontSize: ".75rem", color: B.teal, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>
                            ✓ Answered
                          </div>
                          {q.answer}
                        </div>
                      ) : (
                        <button
                          className="rqa-answer-link"
                          onClick={() => onOpenContribute("qa")}
                        >
                          Answer this question
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {totalQaPages > 1 && (
                <Pagination page={qaPage} total={totalQaPages} onChange={setQaPage} />
              )}

              <button className="rqa-ask-btn" onClick={() => onOpenContribute("qa")}>
                <FaQuestionCircle size={13} /> Ask a Question
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
});

export default ReviewsAndQA;