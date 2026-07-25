import React, { useState, useImperativeHandle, useCallback } from "react";
import {
  FaPencilAlt,
  FaStar,
  FaCamera,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";

// Default design tokens
const DEFAULT_BRAND = {
  primary: "#F04B5A",
  primaryDark: "#D03848",
  navy: "#1A2340",
  charcoal: "#111827",
  bodyText: "#374151",
  meta: "#6B7280",
  placeholder: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  bgCard: "#fafbff",
  amber: "#F97316",
  teal: "#14B8A6",
};

const ContributeSection = React.forwardRef(function ContributeSection(
  {
    packageTitle = "",
    onReviewSubmit = () => {},
    onQuestionSubmit = () => {},
    user = null,
    sectionRef,
    BRAND: brandOverride,
  },
  imperativeRef,
) {
  const B = { ...DEFAULT_BRAND, ...brandOverride };

  // State
  const [modalOpen, setModalOpen] = useState(false);
  const [contributeTab, setContributeTab] = useState("review");
  const [done, setDone] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    hoverRating: 0,
    title: "",
    text: "",
    tripType: "Family",
  });
  const [newQuestion, setNewQuestion] = useState("");

  //  Imperative handle
  // Allows parent to call: ref.current.openModal("qa")
  useImperativeHandle(imperativeRef, () => ({
    openModal: (tab = "review") => {
      setContributeTab(tab);
      setDone(false);
      setModalOpen(true);
    },
  }));

  const openModal = useCallback((tab) => {
    setContributeTab(tab);
    setDone(false);
    setModalOpen(false);
    requestAnimationFrame(() => setModalOpen(true));
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setDone(false);
    setNewReview({
      rating: 0,
      hoverRating: 0,
      title: "",
      text: "",
      tripType: "Family",
    });
    setNewQuestion("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (
      contributeTab === "review" &&
      newReview.rating > 0 &&
      newReview.text.trim()
    ) {
      const reviewObj = {
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
      onReviewSubmit(reviewObj);
    } else if (contributeTab === "qa" && newQuestion.trim()) {
      onQuestionSubmit(newQuestion.trim());
    }
    setDone(true);
  }, [
    contributeTab,
    newReview,
    newQuestion,
    user,
    onReviewSubmit,
    onQuestionSubmit,
  ]);

  //  Scoped styles
  const css = `
    .cs-section { background: linear-gradient(135deg, #fff8f8 0%, #f0f4ff 100%); padding: 1rem 0; border-top: 1px solid ${B.borderLight}; }
    .cs-card { background: transparent; border: 1px solid ${B.borderLight}; border-radius: 16px; padding: 1.5rem; cursor: pointer; transition: transform .2s, box-shadow .2s; }
    .cs-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.08); }
    .cs-modal-overlay { position: fixed; inset: 0; background: rgba(10,10,30,.55); backdrop-filter: blur(6px); z-index: 1050; display: flex; align-items: flex-end; justify-content: center; padding: 0; }
    @media (min-width: 576px) { .cs-modal-overlay { align-items: center; padding: .75rem; } }
    .cs-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 580px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,.22); animation: cs-in .3s cubic-bezier(.4,0,.2,1) both; }
    @keyframes cs-in { from { opacity: 0; transform: scale(.96) } to { opacity: 1; transform: scale(1) } }
    .cs-modal-head { background: ${B.navy}; padding: 1.25rem 1.5rem; flex-shrink: 0; position: relative; }
    .cs-modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }
    .cs-modal-foot { padding: .85rem 1.5rem; border-top: 1px solid ${B.borderLight}; flex-shrink: 0; }
    .cs-tab { border: none; background: transparent; font-family: inherit; font-size: .85rem; font-weight: 600; cursor: pointer; padding: .6rem 1.2rem; border-radius: 50px; color: ${B.meta}; transition: all .2s; }
    .cs-tab.active { background: ${B.primary}; color: #fff; }
    .cs-star { cursor: pointer; transition: transform .1s; display: inline-block; }
    .cs-star:hover { transform: scale(1.2); }
    .cs-trip-pill { border: 1px solid ${B.border}; border-radius: 50px; padding: .3rem .85rem; font-size: .77rem; color: ${B.bodyText}; background: #fff; cursor: pointer; transition: all .2s; font-family: inherit; }
    .cs-trip-pill.selected { background: ${B.primary}; color: #fff; border-color: ${B.primary}; }
    .cs-input { border: 1px solid ${B.border}; border-radius: 8px; font-family: inherit; font-size: .88rem; padding: .65rem .9rem; width: 100%; transition: border-color .2s; background: #fff; color: ${B.charcoal}; }
    .cs-input::placeholder { color: ${B.placeholder}; }
    .cs-input:focus { outline: none; border-color: ${B.primary}; box-shadow: 0 0 0 3px rgba(240,75,90,.10); }
    textarea.cs-input { resize: vertical; }
    .cs-btn-primary { background: ${B.primary}; border: none; color: #fff; font-family: inherit; font-weight: 700; border-radius: 50px; padding: .85rem 1.5rem; font-size: .95rem; cursor: pointer; transition: all .25s; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .cs-btn-primary:hover { background: ${B.primaryDark}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(240,75,90,.30); }
    .cs-btn-write { background: ${B.primary}; border: none; color: #fff; font-family: inherit; font-weight: 700; border-radius: 50px; padding: .65rem 1.5rem; font-size: .88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all .25s; }
    .cs-btn-write:hover { background: ${B.primaryDark}; transform: translateY(-1px); }
    .cs-close-btn { position: absolute; top: 1.1rem; right: 1.1rem; width: 32px; height: 32px; background: rgba(255,255,255,.12); border-radius: 50%; border: none; cursor: pointer; color: #fff; display: flex; align-items: center; justify-content: center; }
    .cs-upload-zone { border: 2px dashed ${B.border}; border-radius: 16px; padding: 2.5rem; cursor: pointer; text-align: center; }
    .font-serif-cs { font-family: 'Cormorant Garamond', Georgia, serif; }
  `;

  // Done screen
  const doneMessages = {
    review: {
      emoji: "🎉",
      title: "Review Submitted!",
      body: "Your review has been added and will help other travellers decide.",
    },
    photo: {
      emoji: "📷",
      title: "Photos Uploaded!",
      body: "Your photos will appear after a quick review.",
    },
    qa: {
      emoji: "💬",
      title: "Question Posted!",
      body: "Your question has been posted. The community will answer soon!",
    },
  };
  const dm = doneMessages[contributeTab];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>

      <section className="cs-section" ref={sectionRef}>
        <div className="container" style={{ maxWidth: 1280 }}>
          {/* Heading row */}
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2
                className="font-serif-cs fw-bold mb-1"
                style={{ fontSize: "2rem", color: B.charcoal }}
              >
                Share Your Experience
              </h2>
              <p style={{ color: B.meta, fontSize: ".9rem", marginBottom: 0 }}>
                Help fellow travellers by sharing what you know
              </p>
            </div>
            <div className="col-auto">
              <button
                className="cs-btn-write"
                onClick={() => openModal("review")}
              >
                <FaPencilAlt size={13} /> Write a Review
              </button>
            </div>
          </div>

          {/* CTA cards */}
          <div className="row g-3">
            {[
              {
                icon: <FaStar size={22} color={B.amber} />,
                title: "Write a Review",
                desc: "Share your experience to help others plan their trip",
                tab: "review",
                bg: "linear-gradient(135deg,#FFF8F0,#FFF3E0)",
              },
              {
                icon: <FaCamera size={22} color={B.teal} />,
                title: "Add Photos",
                desc: "Upload your best shots from this destination",
                tab: "photo",
                bg: "linear-gradient(135deg,#F0FFFE,#E0F7F5)",
              },
              {
                icon: <FaQuestionCircle size={22} color="#3D52A0" />,
                title: "Ask a Question",
                desc: "Get answers from travellers who've been there",
                tab: "qa",
                bg: "linear-gradient(135deg,#F0F4FF,#E8EDFF)",
              },
            ].map((card) => (
              <div key={card.tab} className="col-md-4">
                <div
                  className="cs-card"
                  style={{ background: card.bg }}
                  onClick={() => openModal(card.tab)}
                >
                  <div style={{ marginBottom: 10 }}>{card.icon}</div>
                  <div
                    className="fw-bold mb-1"
                    style={{ fontSize: ".95rem", color: B.charcoal }}
                  >
                    {card.title}
                  </div>
                  <div style={{ fontSize: ".8rem", color: B.meta }}>
                    {card.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODAL ── */}
      {modalOpen && (
        <div
          className="cs-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="cs-modal">
            {!done ? (
              <>
                {/* Header */}
                <div className="cs-modal-head">
                  <button className="cs-close-btn" onClick={closeModal}>
                    <FaTimes size={13} />
                  </button>
                  <div
                    className="font-serif-cs fw-bold"
                    style={{ fontSize: "1.4rem", color: "#fff" }}
                  >
                    Share Your Experience
                  </div>
                  {packageTitle && (
                    <div
                      style={{
                        fontSize: ".8rem",
                        color: "rgba(255,255,255,.55)",
                        marginTop: 2,
                      }}
                    >
                      {packageTitle}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="cs-modal-body">
                  {/* Tab switcher */}
                  <div
                    style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}
                  >
                    {[
                      { key: "review", label: "⭐ Review" },
                      { key: "photo", label: "📷 Photo" },
                      { key: "qa", label: "❓ Question" },
                    ].map((t) => (
                      <button
                        key={t.key}
                        className={`cs-tab ${contributeTab === t.key ? "active" : ""}`}
                        onClick={() => setContributeTab(t.key)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* ── REVIEW tab ── */}
                  {contributeTab === "review" && (
                    <div>
                      {/* Star rating */}
                      <div style={{ marginBottom: "1.25rem" }}>
                        <label
                          style={{
                            display: "block",
                            fontWeight: 700,
                            fontSize: ".82rem",
                            color: B.charcoal,
                            marginBottom: 8,
                          }}
                        >
                          Your Rating{" "}
                          <span style={{ color: B.primary }}>*</span>
                        </label>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className="cs-star"
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
                                    ? B.amber
                                    : B.borderLight
                                }
                              />
                            </span>
                          ))}
                          {newReview.rating > 0 && (
                            <span
                              style={{
                                fontSize: ".82rem",
                                color: B.meta,
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

                      {/* Trip type */}
                      <div style={{ marginBottom: "1rem" }}>
                        <label
                          style={{
                            display: "block",
                            fontWeight: 700,
                            fontSize: ".82rem",
                            color: B.charcoal,
                            marginBottom: 8,
                          }}
                        >
                          Trip Type
                        </label>
                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                        >
                          {[
                            "Solo",
                            "Couple",
                            "Family",
                            "Friends",
                            "Business",
                          ].map((t) => (
                            <button
                              key={t}
                              className={`cs-trip-pill ${newReview.tripType === t ? "selected" : ""}`}
                              onClick={() =>
                                setNewReview((r) => ({ ...r, tripType: t }))
                              }
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Title */}
                      <div style={{ marginBottom: "1rem" }}>
                        <label
                          style={{
                            display: "block",
                            fontWeight: 700,
                            fontSize: ".82rem",
                            color: B.charcoal,
                            marginBottom: 6,
                          }}
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          className="cs-input"
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

                      {/* Review body */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontWeight: 700,
                            fontSize: ".82rem",
                            color: B.charcoal,
                            marginBottom: 6,
                          }}
                        >
                          Your Review{" "}
                          <span style={{ color: B.primary }}>*</span>
                        </label>
                        <textarea
                          className="cs-input"
                          rows={4}
                          placeholder="Tell others what made this trip special…"
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

                  {/* ── PHOTO tab ── */}
                  {contributeTab === "photo" && (
                    <div className="cs-upload-zone">
                      <FaCamera
                        size={36}
                        color={B.placeholder}
                        style={{ marginBottom: 12 }}
                      />
                      <div
                        className="fw-bold mb-1"
                        style={{ color: B.charcoal }}
                      >
                        Upload your photos
                      </div>
                      <div style={{ fontSize: ".82rem", color: B.meta }}>
                        JPG, PNG up to 10 MB each
                      </div>
                      <button
                        className="cs-btn-primary"
                        style={{
                          width: "auto",
                          padding: ".55rem 1.5rem",
                          fontSize: ".85rem",
                          marginTop: "1rem",
                        }}
                      >
                        Choose Photos
                      </button>
                    </div>
                  )}

                  {/* ── Q&A tab ── */}
                  {contributeTab === "qa" && (
                    <div>
                      <div style={{ marginBottom: "1rem" }}>
                        <label
                          style={{
                            display: "block",
                            fontWeight: 700,
                            fontSize: ".82rem",
                            color: B.charcoal,
                            marginBottom: 6,
                          }}
                        >
                          Your Question{" "}
                          <span style={{ color: B.primary }}>*</span>
                        </label>
                        <textarea
                          className="cs-input"
                          rows={4}
                          placeholder="What would you like to know about this package or destination?"
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                        />
                      </div>
                      <div
                        style={{
                          padding: ".85rem 1rem",
                          borderRadius: 10,
                          background: DEFAULT_BRAND.bgCard,
                          border: `1px solid ${B.borderLight}`,
                          fontSize: ".78rem",
                          color: B.meta,
                        }}
                      >
                        💡 Tip: Specific questions get answered faster. Include
                        details like travel dates, group type, or specific
                        concerns.
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="cs-modal-foot">
                  <button className="cs-btn-primary" onClick={handleSubmit}>
                    {contributeTab === "review"
                      ? "✉️ Submit Review"
                      : contributeTab === "photo"
                        ? "📷 Upload Photos"
                        : "❓ Submit Question"}
                  </button>
                  <p
                    style={{
                      textAlign: "center",
                      marginTop: 8,
                      marginBottom: 0,
                      fontSize: ".73rem",
                      color: B.placeholder,
                    }}
                  >
                    Your contribution helps fellow travellers make better
                    decisions
                  </p>
                </div>
              </>
            ) : (
              /* ── Success screen ── */
              <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>
                  {dm.emoji}
                </div>
                <div
                  className="font-serif-cs fw-bold mb-2"
                  style={{ fontSize: "1.6rem", color: B.charcoal }}
                >
                  {dm.title}
                </div>
                <p
                  style={{
                    fontSize: ".86rem",
                    color: B.meta,
                    lineHeight: 1.7,
                    maxWidth: 340,
                    margin: "0 auto 1.5rem",
                  }}
                >
                  {dm.body}
                </p>
                <button
                  className="cs-btn-primary"
                  style={{ width: "auto", padding: ".75rem 2.5rem" }}
                  onClick={closeModal}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
});

export default ContributeSection;
