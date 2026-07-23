import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  getHotelDetails,
  getHotelInfo,
//   getReviewsSummary,
//   getReviewsList,
  getHotelRooms,
} from "../../Services/stayService.js";
import StayStyles from "./Staystyles.jsx";
// import Header from "./component/Header.jsx";

/* ------------------------------------------------------------------
   STEP 6-10: Hotel details -> info -> reviews summary -> reviews list
   -> rooms/offers -> proceed to booking (STEP 11)

   Field shapes below match the REAL sample responses provided:
   - getHotelDetails(): { summary, propertyGallery, reviewInfo,
       propertyContentSectionGroups }
   - getHotelInfo(): { aboutThisProperty, policies, specialFeatures, amenities }
   - getReviewsSummary(): { averageOverallRating:{raw}, cleanliness:{raw},
       hotelCondition:{raw}, roomComfort:{raw}, serviceAndStaff:{raw},
       totalCount:{raw}, reviewDisclaimer }
   - getReviewsList(): endpoint unconfirmed — this section renders only
     if data comes back, and fails silently otherwise.
   - getHotelRooms(): response SHAPE confirmed (see stayService.js), path
     still a best guess.
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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconHeart = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
);
const IconShare = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="M8.6 10.6 15.4 6.9M8.6 13.4l6.8 3.7" />
  </svg>
);
const IconClose = (p) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconCheck = (p) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" {...p}>
    <path d="m5 13 4 4L19 7" />
  </svg>
);
const IconCross = (p) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconDot = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const TOP_TABS = [
  { id: "overview", label: "Overview" },
  { id: "rooms", label: "Rooms" },
  { id: "location", label: "Location" },
  { id: "reviews", label: "Reviews" },
  { id: "facilities", label: "Facilities" },
  { id: "policies", label: "Policies" },
];

// Generic renderer for "section group" shaped data — used for both
// amenities and policies, which share the same { header, sections:
// [{ header, items }] } shape.
function SectionGroupBlocks({ groups }) {
  if (!groups?.length) return null;
  return groups.map((section, i) => (
    <div key={i} className="policy-section">
      {section.header?.text && <p className="policy-subtitle">{section.header.text}</p>}
      <ul className="policy-list">
        {section.items?.map((item, k) => (
          <li key={k}>{item.primary || item.text}</li>
        ))}
      </ul>
    </div>
  ));
}

export default function HotelDetailsPage() {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const [details, setDetails] = useState(null);
  const [info, setInfo] = useState(null);
  const [reviewsSummary, setReviewsSummary] = useState(null);
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
  const [aboutSubTab, setAboutSubTab] = useState(0);
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryTab, setGalleryTab] = useState("property");
  const [galleryCategory, setGalleryCategory] = useState("All Photos");
  const [breakfastOnly, setBreakfastOnly] = useState(false);

  const sectionRefs = {
    overview: useRef(null),
    rooms: useRef(null),
    location: useRef(null),
    reviews: useRef(null),
    facilities: useRef(null),
    policies: useRef(null),
  };

  // STEP 6-8: details, info, and reviews summary load together
  useEffect(() => {
    if (!hotelId) return;
    let cancelled = false;
    setLoading(true);
    setNotice(null);

    Promise.all([
      getHotelDetails({ hotelId }),
      getHotelInfo({ hotelId }),
    //   getReviewsSummary({ hotelId }),
    ])
      .then(([detailsRes, infoRes, reviewsSummaryRes]) => {
        if (cancelled) return;
        setDetails(detailsRes);
        setInfo(infoRes);
        setReviewsSummary(reviewsSummaryRes);
      })
      .catch((err) => {
        if (cancelled) return;
        setNotice({ type: "error", text: `Couldn't load hotel details (${err.message}).` });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  // STEP 9: reviews list, paginated — endpoint unconfirmed, fails quietly.
  // NOTE: the actual fetch below is commented out until the endpoint is
  // confirmed. reviewsLoading is intentionally left untouched here — it
  // must only flip to true right before a real request and back to false
  // in that request's `finally`, or the "Load more reviews" button gets
  // stuck showing "Loading…" forever with no fetch to resolve it.
  useEffect(() => {
    if (!hotelId || !reviewsAvailable) return;
    let cancelled = false;

    // setReviewsLoading(true);
    // getReviewsList({ hotelId, page: reviewsPage })
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
  }, [hotelId, reviewsPage, reviewsAvailable]);

  // STEP 10: rooms/offers — endpoint unconfirmed, fails quietly
  useEffect(() => {
    if (!hotelId || !checkIn || !checkOut) return;
    let cancelled = false;
    setRoomsLoading(true);

    getHotelRooms({ hotelId, checkIn, checkOut })
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
  }, [hotelId, checkIn, checkOut]);

  // STEP 11: proceed to booking with the selected room/offer
  const handleBook = useCallback(
    (room) => {
      const params = new URLSearchParams({
        hotelId: room.hotelId || hotelId,
        checkIn,
        checkOut,
        roomTypeId: room.roomTypeId || "",
        ratePlanId: room.ratePlanId || "",
      });
      navigate(`/booking?${params.toString()}`);
    },
    [hotelId, checkIn, checkOut, navigate]
  );

  const scrollToTab = useCallback((id) => {
    setActiveTab(id);
    const el = sectionRefs[id]?.current;
    if (!el) return;
    const offset = 64; // sticky tabbar height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Escape key closes the gallery lightbox
  useEffect(() => {
    if (!galleryOpen) return;
    const onKey = (e) => e.key === "Escape" && setGalleryOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [galleryOpen]);

  const summary = details?.summary;
  const images = details?.propertyGallery?.images || [];
  const reviewBlurb = details?.reviewInfo?.summary?.overallScoreWithDescriptionA11y?.value;
  const reviewCountText = details?.reviewInfo?.summary?.propertyReviewCountDetails?.shortDescription;
  const aboutSections = details?.propertyContentSectionGroups?.aboutThisProperty?.sections || [];
  const amenitySections = info?.amenities || [];
  const policySections = info?.policies?.sections || info?.policies || [];
  const specialFeatures = info?.specialFeatures?.items || info?.specialFeatures || [];

  // Build a simple 4-row rating breakdown out of the sub-scores (each 0-5).
  const ratingRows = reviewsSummary
    ? [
        { label: "Cleanliness", raw: reviewsSummary.cleanliness?.raw },
        { label: "Hotel condition", raw: reviewsSummary.hotelCondition?.raw },
        { label: "Room comfort", raw: reviewsSummary.roomComfort?.raw },
        { label: "Service & staff", raw: reviewsSummary.serviceAndStaff?.raw },
      ].filter((r) => r.raw != null)
    : [];

  const overallRating = reviewsSummary?.averageOverallRating?.raw;
  const ratingLabel =
    overallRating >= 4.5 ? "Excellent" : overallRating >= 4 ? "Very Good" : overallRating >= 3 ? "Good" : overallRating ? "Fair" : null;

  // Flatten every amenity into one list for the "Popular Facilities" grid.
  const flatFacilities = useMemo(() => {
    const out = [];
    amenitySections.forEach((group) => {
      (group.sections || [group]).forEach((sub) => {
        (sub.items || []).forEach((item) => {
          const label = item.primary || item.text;
          if (label) out.push(label);
        });
      });
    });
    return out;
  }, [amenitySections]);
  const visibleFacilities = facilitiesExpanded ? flatFacilities : flatFacilities.slice(0, 6);

  // Cheapest available room becomes the sidebar "recommended deal".
  const dealRoom = useMemo(() => rooms.find((r) => !r.soldOut) || rooms[0], [rooms]);

  // Group flat room/offer rows into room-type sections for the Rooms tab table.
  const roomGroups = useMemo(() => {
    const map = new Map();
    rooms.forEach((room) => {
      const key = room.name || "Room";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(room);
    });
    return Array.from(map.entries()).map(([name, list]) => ({ name, list }));
  }, [rooms]);
  const filteredRoomGroups = useMemo(() => {
    if (!breakfastOnly) return roomGroups;
    return roomGroups
      .map((g) => ({ ...g, list: g.list.filter((r) => /breakfast/i.test(r.tagline || r.name || (r.features || []).join(" "))) }))
      .filter((g) => g.list.length > 0);
  }, [roomGroups, breakfastOnly]);

  // Gallery categories, derived from whatever category label each image carries.
  const galleryCategories = useMemo(() => {
    const set = new Set(["All Photos"]);
    images.forEach((img) => img.category && set.add(img.category));
    return Array.from(set);
  }, [images]);
  const galleryImages = useMemo(() => {
    if (galleryCategory === "All Photos") return images;
    return images.filter((img) => img.category === galleryCategory);
  }, [images, galleryCategory]);

  const openGallery = () => {
    setGalleryTab("property");
    setGalleryCategory("All Photos");
    setGalleryOpen(true);
  };

  const address = summary?.location?.address?.addressLine || summary?.tagline || "";
  const mapQuery = address ? encodeURIComponent(address) : "";
  const coords = summary?.location?.coordinates;

  return (
    <div className="app">
      <StayStyles />
      {/* <Header /> */}

      {!loading && summary && (
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

      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← Back to results
      </button>

      {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}

      {loading && (
        <>
          <div className="detail-hero">
            <div className="detail-hero-main tag-skeleton-block" />
          </div>
          <div className="detail-head">
            <div className="tag-skeleton-line mb-3" style={{ width: "45%", height: 22 }} />
            <div className="tag-skeleton-line" style={{ width: "28%" }} />
          </div>
          <section className="detail-section">
            <div className="tag-skeleton-line mb-4" style={{ width: "22%", height: 16 }} />
            <div className="tag-skeleton-line mb-2" style={{ width: "100%" }} />
            <div className="tag-skeleton-line mb-2" style={{ width: "92%" }} />
            <div className="tag-skeleton-line" style={{ width: "70%" }} />
          </section>
        </>
      )}

      {!loading && summary && (
        <>
          {images.length > 0 && (
            <div className="detail-hero">
              <img
                className="detail-hero-main"
                src={images[0]?.image?.url}
                alt={images[0]?.image?.description || summary.name}
                onClick={openGallery}
              />
              {images.length > 1 && (
                <div className="detail-hero-strip">
                  {images.slice(1, 6).map((img, idx, arr) => {
                    const isLast = idx === arr.length - 1 && images.length > 6;
                    return (
                      <div className="hero-thumb-wrap" key={img.imageId || idx} onClick={openGallery}>
                        <img src={img.image?.url} alt={img.image?.description || summary.name} />
                        {isLast && (
                          <div className="hero-thumb-overlay">See All Property &amp; Guest Photos</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="detail-head">
            <div className="dp-head-top">
              <div>
                <div className="dp-name-row">
                  <h1 className="detail-name">{summary.name}</h1>
                  {summary.overview?.propertyRating?.rating && (
                    <span className="dp-stars">{"★".repeat(Math.round(summary.overview.propertyRating.rating))}</span>
                  )}
                  <span className="dp-guarantee"><IconCheck /> Best Price Guarantee</span>
                </div>
                {address && (
                  <div className="dp-address-row">
                    <IconPin />
                    <span className="detail-loc">{address}</span>
                    <button type="button" className="dp-map-link" onClick={() => scrollToTab("location")}>
                      View on map
                    </button>
                  </div>
                )}
              </div>
              <div className="dp-head-actions">
                <button type="button" className="dp-icon-btn" onClick={() => setSaved((s) => !s)}>
                  <IconHeart fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  className="dp-icon-btn"
                  onClick={() => navigator.share?.({ title: summary.name, url: window.location.href })}
                >
                  <IconShare /> Share
                </button>
              </div>
            </div>

            {specialFeatures.length > 0 && (
              <div className="dp-highlights">
                {specialFeatures.slice(0, 3).map((f, i) => (
                  <div className="dp-highlight-tile" key={i}>
                    <div className="dp-highlight-icon"><IconDot /></div>
                    <div>
                      <p className="dp-highlight-title">{f.title || f.name || f.header?.text}</p>
                      <p className="dp-highlight-sub">{f.description || f.text || f.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dp-layout">
            <div className="dp-main">
              {/* ---------------- OVERVIEW ---------------- */}
              <section className="detail-section" ref={sectionRefs.overview}>
                <h2>About</h2>
                {aboutSections.length > 1 && (
                  <div className="dp-subtabs">
                    {aboutSections.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`dp-subtab${aboutSubTab === i ? " active" : ""}`}
                        onClick={() => setAboutSubTab(i)}
                      >
                        {s.header?.text || `Section ${i + 1}`}
                      </button>
                    ))}
                  </div>
                )}
                {aboutSections[aboutSubTab] &&
                  aboutSections[aboutSubTab].bodySubSections?.map((sub, j) =>
                    sub.elements?.map((el, k) => (
                      <div key={`${j}-${k}`}>
                        {el.header?.text && el.header.text !== summary.name && (
                          <p className="tag-subtitle">{el.header.text}</p>
                        )}
                        {el.items?.map((item, m) => (
                          <Html key={m} html={item.content?.text} />
                        ))}
                      </div>
                    ))
                  )}
                {aboutSections.length === 0 && <p className="placeholder">Overview details aren't available yet.</p>}

                {flatFacilities.length > 0 && (
                  <>
                    <h2 className="facilities-heading">Popular Facilities</h2>
                    <div className="facility-icon-grid">
                      {visibleFacilities.map((label, i) => (
                        <div className="facility-icon-item" key={i}>
                          <div className="facility-icon"><IconDot /></div>
                          <span className="facility-icon-label">{label}</span>
                        </div>
                      ))}
                    </div>
                    {flatFacilities.length > 6 && (
                      <button type="button" className="dp-view-more" onClick={() => setFacilitiesExpanded((v) => !v)}>
                        {facilitiesExpanded ? "Show less" : `View ${flatFacilities.length - 6}+ More`}
                      </button>
                    )}
                  </>
                )}
              </section>

              {/* ---------------- ROOMS ---------------- */}
              {roomsAvailable && (
                <section className="detail-section" ref={sectionRefs.rooms}>
                  <h2>Select your room</h2>
                  <div className="dp-rooms-toolbar">
                    <button
                      type="button"
                      className={`dp-filter-pill${breakfastOnly ? " active" : ""}`}
                      onClick={() => setBreakfastOnly((v) => !v)}
                    >
                      Breakfast Included
                    </button>
                    {roomGroups.length > 0 && (
                      <span className="dp-room-type-select">{roomGroups.length} Room Type{roomGroups.length > 1 ? "s" : ""}</span>
                    )}
                  </div>

                  {roomsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div className="room-card" key={i}>
                        <div style={{ flex: 1 }}>
                          <div className="tag-skeleton-line mb-2" style={{ width: "45%", height: 14 }} />
                          <div className="tag-skeleton-line" style={{ width: "65%" }} />
                        </div>
                        <div className="tag-skeleton-line" style={{ width: 64, height: 20 }} />
                      </div>
                    ))
                  ) : filteredRoomGroups.length > 0 ? (
                    filteredRoomGroups.map((group, gi) => {
                      const first = group.list[0];
                      return (
                        <div className="room-type-group" key={gi}>
                          <div className="room-type-head">
                            {first.image && (
                              <div className="room-type-photo">
                                <img src={first.image} alt={first.imageAlt || group.name} loading="lazy" />
                              </div>
                            )}
                            <div>
                              <p className="room-type-name">{group.name}</p>
                              <div className="room-type-meta">
                                {first.beds && <span>{first.beds}</span>}
                                {first.sleeps && <span>Sleeps {first.sleeps}</span>}
                              </div>
                              <button type="button" className="room-type-details-link">View Details</button>
                            </div>
                          </div>

                          {group.list.map((room, ri) => (
                            <div className={`room-option-row${room.soldOut ? " room-card-soldout" : ""}`} key={room.id || ri}>
                              <div className="room-option-badges">
                                {room.badge && <span className="pill pill-gold">{room.badge}</span>}
                                {(room.features || []).slice(0, 5).map((f, k) => {
                                  const isDeny = /non[-\s]?refundable/i.test(f);
                                  return (
                                    <span className={`room-option-badge${isDeny ? " deny" : ""}`} key={k}>
                                      {isDeny ? <IconCross /> : <IconCheck />} {f}
                                    </span>
                                  );
                                })}
                              </div>

                              {room.soldOut ? (
                                <span className="room-scarcity">{room.soldOutMessage || "Sold out"}</span>
                              ) : (
                                <div className="room-option-action">
                                  <div className="room-option-price">
                                    {room.discountLabel && <span className="room-option-discount">{room.discountLabel}</span>}
                                    {room.strikeOutPrice && <span className="room-price-strike">{room.strikeOutPrice}</span>}
                                    <span className="room-price">{room.displayPrice || "—"}</span>
                                    {room.roomsLeftMessage && <span className="room-option-left">{room.roomsLeftMessage}</span>}
                                  </div>
                                  <button type="button" className="room-select" onClick={() => handleBook(room)}>
                                    Reserve 1 Room
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })
                  ) : (
                    <p className="placeholder">No rooms loaded for these dates yet.</p>
                  )}
                </section>
              )}

              {/* ---------------- LOCATION ---------------- */}
              <section className="detail-section" ref={sectionRefs.location}>
                <h2>Location</h2>
                {address ? (
                  <p>{address}</p>
                ) : (
                  <p className="placeholder">Location details aren't available yet.</p>
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
                {reviewsSummary && (
                  <div className="rating-row">
                    <div className="rating-big">{overallRating ?? "—"}</div>
                    <div className="rating-bars">
                      {ratingRows.map((row, i) => (
                        <div className="rating-bar-row" key={i}>
                          <span>{row.label}</span>
                          <div className="rating-bar-track">
                            <div className="rating-bar-fill" style={{ width: `${(row.raw / 5) * 100}%` }} />
                          </div>
                          <span>{row.raw}/5</span>
                        </div>
                      ))}
                      {reviewBlurb && <p className="tag-subtitle">{reviewBlurb}</p>}
                      {(reviewCountText || reviewsSummary.totalCount?.raw != null) && (
                        <p className="tag-subtitle">{reviewCountText || `${reviewsSummary.totalCount.raw} review(s)`}</p>
                      )}
                    </div>
                  </div>
                )}

                {reviewsAvailable && (
                  <>
                    {reviews.map((r, i) => (
                      <div className="review-card" key={r.id || i}>
                        <div className="review-head">
                          <span className="review-author">{r.author || r.userName}</span>
                          <span className="review-date">{r.date || r.publishedDate}</span>
                        </div>
                        {r.title && <p className="review-title">{r.title}</p>}
                        <p className="review-text">{r.text}</p>
                      </div>
                    ))}
                    {reviews.length === 0 && !reviewsLoading && (
                      <p className="placeholder">No individual reviews loaded yet.</p>
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
              <section className="detail-section" ref={sectionRefs.facilities}>
                <h2>Facilities</h2>
                {amenitySections.length > 0 ? (
                  amenitySections.map((section, i) => (
                    <div key={i} className="amenity-group">
                      {section.header?.text && <h2 className="amenity-group-heading">{section.header.text}</h2>}
                      {section.sections?.map((sub, j) => (
                        <div key={j} className="amenity-subgroup">
                          {sub.header?.text && (
                            <p className="amenity-subtitle">{sub.header.text}</p>
                          )}
                          <div className="amenity-grid">
                            {sub.items?.map((item, k) => (
                              <div className="amenity-item" key={k}>{item.primary || item.text}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <p className="placeholder">Facility details aren't available yet.</p>
                )}
              </section>

              {/* ---------------- POLICIES ---------------- */}
              <section className="detail-section" ref={sectionRefs.policies}>
                <h2>Policies</h2>
                {policySections.length > 0 ? (
                  <SectionGroupBlocks groups={policySections} />
                ) : (
                  <p className="placeholder">Policy details aren't available yet.</p>
                )}
              </section>
            </div>

            {/* ---------------- SIDEBAR ---------------- */}
            <div className="dp-sidebar">
              {dealRoom && (
                <div className="dp-deal-card">
                  {dealRoom.image && (
                    <div className="dp-deal-photo">
                      <img src={dealRoom.image} alt={dealRoom.imageAlt || dealRoom.name} />
                      <span className="dp-deal-badge">Recommended Deal</span>
                    </div>
                  )}
                  <div className="dp-deal-body">
                    <p className="dp-deal-title">{dealRoom.name}</p>
                    <div className="dp-deal-perks">
                      {(dealRoom.features || []).slice(0, 4).map((f, i) => {
                        const isDeny = /non[-\s]?refundable/i.test(f);
                        return (
                          <span className={`dp-deal-perk ${isDeny ? "deny" : "allow"}`} key={i}>
                            {isDeny ? <IconCross /> : <IconCheck />} {f}
                          </span>
                        );
                      })}
                    </div>
                    <div className="dp-deal-price-row">
                      {dealRoom.strikeOutPrice && <span className="dp-deal-strike">{dealRoom.strikeOutPrice}</span>}
                      <span className="dp-deal-price">{dealRoom.displayPrice || "—"}</span>
                    </div>
                    <p className="dp-deal-taxes">+ taxes &amp; fees, per night for 1 room</p>
                    <button type="button" className="dp-deal-cta primary" onClick={() => handleBook(dealRoom)}>
                      Reserve 1 Room
                    </button>
                    <button type="button" className="dp-deal-cta secondary" onClick={() => scrollToTab("rooms")}>
                      View All Rooms
                    </button>
                  </div>
                </div>
              )}

              {reviewsSummary && overallRating != null && (
                <div className="dp-rating-card" onClick={() => scrollToTab("reviews")}>
                  <span className="dp-rating-badge">{overallRating}</span>
                  <div>
                    <p className="dp-rating-label">{ratingLabel || "Rated"}</p>
                    <p className="dp-rating-sub">
                      {reviewsSummary.totalCount?.raw != null ? `${reviewsSummary.totalCount.raw} Ratings` : "See reviews"}
                    </p>
                  </div>
                </div>
              )}

              {reviews[0] && (
                <div className="dp-quote-card">
                  <h3>Guests are saying</h3>
                  <p className="dp-quote-text">“{reviews[0].text}”</p>
                  <div className="dp-quote-meta">
                    <span>{reviews[0].author || reviews[0].userName}</span>
                    <span>{reviews[0].date || reviews[0].publishedDate}</span>
                  </div>
                </div>
              )}

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
                    <button type="button" onClick={() => scrollToTab("location")}>View on Map</button>
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
              <button type="button" className={galleryTab === "property" ? "active" : ""} onClick={() => setGalleryTab("property")}>
                Property Photos
              </button>
              <button type="button" className={galleryTab === "guest" ? "active" : ""} onClick={() => setGalleryTab("guest")}>
                Guest Photos
              </button>
            </div>
            <button type="button" className="gallery-close" onClick={() => setGalleryOpen(false)} aria-label="Close gallery">
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
                    <img key={img.imageId || i} src={img.image?.url} alt={img.image?.description || summary?.name} loading="lazy" />
                  ))}
                </div>
              ) : (
                <p className="gallery-empty">No photos in this category yet.</p>
              )}
            </>
          ) : (
            <p className="gallery-empty">No guest photos yet — be the first to share one after your stay.</p>
          )}
        </div>
      )}
    </div>
  );
}