import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  getPriceConfirmation,
  createBooking,
} from "../../Services/stayService.js";
import HotelHeader from "./component/Header.jsx";
import UnderDevelopmentModal from "../../Components/UnderDevelopmentPopup.jsx";

const TITLE_OPTIONS = ["Mr", "Mrs", "Ms", "Miss"];

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
function formatPrice(amount) {
  return amount == null ? "—" : inrFormatter.format(amount);
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

// Cancellation type/value pair's meaning depends on `type` (see
// stayService.js) — render each generically rather than assuming
// "nights" always.
function describeCancellationTerm(term) {
  if (!term) return null;
  if (term.type === "nights") {
    return `Cancel free until ${formatDate(term.start)} — after that, ${term.value} night(s) charged (${formatPrice(term.billableAmount)}).`;
  }
  if (term.type === "percentage") {
    return `Cancel free until ${formatDate(term.start)} — after that, ${term.value}% charged (${formatPrice(term.billableAmount)}).`;
  }
  // Unrecognized `type` — show the raw value rather than guessing at
  // phrasing for a policy shape we haven't seen yet.
  return `Cancellation term (${term.type}): ${term.value} — ${formatPrice(term.billableAmount)}.`;
}

// Simple, deliberately permissive email check — just enough to catch
// empty/obviously-malformed input client-side before hitting the API,
// not full RFC validation.
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const availabilityToken = searchParams.get("availabilityToken") || "";
  const propertyId = searchParams.get("propertyId") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const [confirmation, setConfirmation] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(true);
  const [confirmError, setConfirmError] = useState(null);

  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // STEP 5 — reconfirm price/availability before showing any form.
  useEffect(() => {
    if (!availabilityToken) {
      setConfirmLoading(false);
      setConfirmError(
        "Missing booking details. Go back and select a room again.",
      );
      return;
    }

    let cancelled = false;
    setConfirmLoading(true);
    setConfirmError(null);

    getPriceConfirmation({ availabilityToken })
      .then(({ confirmation: c }) => {
        if (cancelled) return;
        setConfirmation(c);
        if (!c.available) {
          setConfirmError(
            "This rate is no longer available. Please go back and pick another room.",
          );
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setConfirmError(`Couldn't confirm this rate (${err.message}).`);
      })
      .finally(() => {
        if (!cancelled) setConfirmLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [availabilityToken]);

  const canSubmit =
    !!confirmation?.available &&
    !!title &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    isValidEmail(email) &&
    phoneNumber.trim().length > 0 &&
    !submitting;

  // STEP 6 — create the booking using the pricing_token from step 5.
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!canSubmit || !confirmation?.pricingToken) return;

      setSubmitting(true);
      setSubmitError(null);

      try {
        const result = await createBooking({
          pricingToken: confirmation.pricingToken,
          email: email.trim(),
          phone: { countryCode, number: phoneNumber.trim() },
          rooms: [
            { title, firstName: firstName.trim(), lastName: lastName.trim() },
          ],
        });
        setBookingResult(result);
      } catch (err) {
        setSubmitError(
          `Couldn't complete the booking (${err.message}). Please try again.`,
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      canSubmit,
      confirmation,
      title,
      email,
      countryCode,
      phoneNumber,
      firstName,
      lastName,
    ],
  );

  const cancellationLines = useMemo(
    () =>
      (confirmation?.cancellationPolicy || [])
        .map(describeCancellationTerm)
        .filter(Boolean),
    [confirmation],
  );

  return (
    <>
      <HotelHeader />
      <div className="bk-page">
        <button
          type="button"
          className="bk-back-link"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h1 className="bk-title">Confirm &amp; book</h1>

        {confirmLoading && (
          <div className="bk-card">
            <p className="bk-loading">Confirming your rate…</p>
          </div>
        )}

        {!confirmLoading && confirmError && (
          <div className="bk-card bk-card-error">
            <p>{confirmError}</p>
            <button
              type="button"
              className="bk-btn-secondary"
              onClick={() => navigate(-1)}
            >
              Choose another room
            </button>
          </div>
        )}

        {!confirmLoading && confirmation?.available && !bookingResult && (
          <div className="bk-layout">
            {/* ---------------- Reconfirmed room summary ---------------- */}
            <div className="bk-card bk-summary">
              {confirmation.room?.images?.[0] && (
                <img
                  className="bk-summary-photo"
                  src={confirmation.room.images[0].url}
                  alt={
                    confirmation.room.images[0].alt || confirmation.room.name
                  }
                />
              )}
              <h2 className="bk-room-name">{confirmation.room?.name}</h2>
              <div className="bk-room-specs">
                {confirmation.room?.bed && <span>{confirmation.room.bed}</span>}
                {confirmation.room?.sleeps != null && (
                  <span>Sleeps {confirmation.room.sleeps}</span>
                )}
                {(propertyId || checkIn) && (
                  <span>
                    {formatDate(checkIn || confirmation.checkIn)} →{" "}
                    {formatDate(checkOut || confirmation.checkOut)}
                  </span>
                )}
              </div>

              <div className="bk-perks">
                <span
                  className={`bk-refund-badge${confirmation.refundable ? "" : " deny"}`}
                >
                  {confirmation.refundable
                    ? "Free Cancellation"
                    : "Non-refundable"}
                </span>
                {[
                  ...(confirmation.boardBasis || []),
                  ...(confirmation.extras || []),
                ].map((p, i) => (
                  <span className="bk-perk" key={i}>
                    {p}
                  </span>
                ))}
              </div>

              {cancellationLines.length > 0 && (
                <div className="bk-cancellation">
                  <h3>Cancellation policy</h3>
                  {cancellationLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

              <div className="bk-price-summary">
                {confirmation.originalPrice > confirmation.price && (
                  <span className="bk-price-strike">
                    {formatPrice(confirmation.originalPrice)}
                  </span>
                )}
                <span className="bk-price">
                  {formatPrice(confirmation.price)}
                </span>
                {confirmation.taxes != null && (
                  <p className="bk-price-taxes">
                    + {formatPrice(confirmation.taxes)} taxes &amp; fees
                  </p>
                )}
              </div>
            </div>

            {/* ---------------- Guest details form ---------------- */}
            <form className="bk-card bk-form" onSubmit={handleSubmit}>
              <h2>Guest details</h2>

              {confirmation.room?.allGuestInfoRequired && (
                <p className="bk-form-note">
                  This rate requires every guest's details. Only the primary
                  guest is collected here — extend this form if a full per-guest
                  roster is needed.
                </p>
              )}

              <div className="bk-form-row">
                <label className="bk-title-field">
                  Title
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  >
                    {TITLE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  First name
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Last name
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </label>
              </div>

              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <div className="bk-form-row">
                <label className="bk-phone-code">
                  Country code
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    required
                  />
                </label>
                <label className="bk-phone-number">
                  Phone number
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </label>
              </div>

              {confirmation.room?.specialRequestSupported && (
                <label className="bk-special-request">
                  Special requests (optional)
                  <textarea
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    rows={3}
                    placeholder="e.g. late check-in, high floor…"
                  />
                  {/* The confirmed Create Booking request body has no
                      field for this yet — surfacing that honestly
                      rather than silently dropping what's typed here or
                      sending a field the API might reject. */}
                  <span className="bk-form-note">
                    Not sent to the hotel yet — this endpoint's request format
                    doesn't have a slot for it. Follow up with the property
                    directly for now.
                  </span>
                </label>
              )}

              {submitError && <p className="bk-error-text">{submitError}</p>}

              <Link to="">
                <button
                  type="submit"
                  onClick={() => {
                    setShowModal(true);
                  }}
                  className="bk-submit-btn"
                  disabled={!canSubmit}
                >
                  {submitting
                    ? "Booking…"
                    : `Reserve for ${formatPrice(confirmation.price)}`}
                </button>
              </Link>
            </form>
          </div>
        )}

        {/* ---------------- Booking result ---------------- */}
        {bookingResult && (
          <div className="bk-card bk-result">
            <h2>Booking submitted</h2>
            {bookingResult.bookingId && (
              <p>Booking reference: {bookingResult.bookingId}</p>
            )}
            {bookingResult.status && <p>Status: {bookingResult.status}</p>}
            {!bookingResult.bookingId && !bookingResult.status && (
              <p className="bk-form-note">
                The booking request was sent, but this endpoint's response shape
                hasn't been confirmed yet — showing the raw response below until
                that's available.
              </p>
            )}
            <pre className="bk-raw-json">
              {JSON.stringify(bookingResult.raw, null, 2)}
            </pre>
          </div>
        )}

        {/* Remove after feature Build */}
        <UnderDevelopmentModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          featureName="Payment Integration For Final Booking"
        />

        <style>{`
          .bk-page { max-width: 1000px; margin: 0 auto; padding: 24px 20px 64px; font-family: inherit; }
          .bk-back-link { border: none; background: none; color: #5e616e; font-size: 0.9rem; cursor: pointer; padding: 0; margin-bottom: 16px; }
          .bk-title { font-size: 1.6rem; font-weight: 700; margin: 0 0 20px; color: #17181c; }
          .bk-card { background: #fff; border: 1px solid #eceef1; border-radius: 12px; padding: 24px; }
          .bk-card-error { color: #b3261e; display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
          .bk-loading { color: #5e616e; margin: 0; }
          .bk-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
          @media (max-width: 760px) { .bk-layout { grid-template-columns: 1fr; } }
          .bk-summary-photo { width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 16px; }
          .bk-room-name { font-size: 1.2rem; font-weight: 700; margin: 0 0 8px; color: #17181c; }
          .bk-room-specs { display: flex; flex-wrap: wrap; gap: 12px; font-size: 0.85rem; color: #5e616e; margin-bottom: 14px; }
          .bk-perks { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
          .bk-refund-badge { background: #e7f6ec; color: #1e8e3e; font-size: 0.78rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
          .bk-refund-badge.deny { background: #fdecec; color: #b3261e; }
          .bk-perk { background: #f4f5f5; color: #17181c; font-size: 0.78rem; padding: 4px 10px; border-radius: 20px; }
          .bk-cancellation { border-top: 1px solid #eceef1; padding-top: 14px; margin-bottom: 16px; }
          .bk-cancellation h3 { font-size: 0.9rem; margin: 0 0 8px; color: #17181c; }
          .bk-cancellation p { font-size: 0.82rem; color: #5e616e; margin: 0 0 6px; }
          .bk-price-summary { border-top: 1px solid #eceef1; padding-top: 14px; }
          .bk-price-strike { font-size: 0.85rem; color: #9aa0aa; text-decoration: line-through; margin-right: 8px; }
          .bk-price { font-size: 1.4rem; font-weight: 700; color: #17181c; }
          .bk-price-taxes { font-size: 0.78rem; color: #5e616e; margin: 4px 0 0; }
          .bk-form h2 { font-size: 1.1rem; margin: 0 0 16px; color: #17181c; }
          .bk-form-note { font-size: 0.78rem; color: #5e616e; background: #f4f5f5; padding: 10px 12px; border-radius: 8px; margin: 8px 0 16px; }
          .bk-form > label { display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem; color: #5e616e; font-weight: 600; margin-bottom: 14px; }
          .bk-form-row { display: flex; gap: 12px; margin-bottom: 14px; }
          .bk-form-row label { flex: 1; display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem; color: #5e616e; font-weight: 600; }
          .bk-form-row input, .bk-form > label input, .bk-special-request textarea, .bk-title-field select { border: 1px solid #d8dbe0; border-radius: 8px; padding: 10px 12px; font-size: 0.9rem; font-family: inherit; color: #17181c; background: #fff; }
          .bk-phone-code { max-width: 110px; }
          .bk-title-field { max-width: 90px; }
          .bk-special-request { display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem; color: #5e616e; font-weight: 600; margin-bottom: 14px; }
          .bk-error-text { color: #b3261e; font-size: 0.85rem; margin: 4px 0 12px; }
          .bk-submit-btn { width: 100%; border: none; background: #fc790d; color: #fff; font-weight: 700; font-size: 0.95rem; padding: 14px; border-radius: 8px; cursor: pointer; }
          .bk-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
          .bk-btn-secondary { border: 1px solid #d8dbe0; background: #fff; color: #17181c; font-weight: 600; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
          .bk-result h2 { margin: 0 0 10px; color: #17181c; }
          .bk-raw-json { background: #17181c; color: #d8dbe0; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 0.78rem; margin-top: 12px; }
        `}</style>
      </div>
    </>
  );
}
