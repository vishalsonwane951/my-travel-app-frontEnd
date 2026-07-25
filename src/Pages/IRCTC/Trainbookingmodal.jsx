import React, { useState, useCallback, useMemo } from "react";
import {
  FaTimes,
  FaPlus,
  FaTrash,
  FaTrain,
  FaCheckCircle,
  FaSpinner,
  FaCrown,
} from "react-icons/fa";
import api from "../../utils/api.js";

// --gold #D4AF6A premium accent — same token introduced in TrainSearch.jsx

const QUOTAS = [
  { value: "GN", label: "General" },
  { value: "TQ", label: "Tatkal" },
  { value: "LD", label: "Ladies" },
  { value: "SS", label: "Senior Citizen" },
];

const STEP_LABELS = ["Passengers", "Contact", "Done"];

const emptyPassenger = () => ({
  id: crypto.randomUUID?.() || String(Math.random()),
  name: "",
  age: "",
  gender: "M",
});

function isEliteClass(value) {
  return value === "1A" || value === "EC";
}

function TrainBookingModal({
  train,
  selectedClass,
  fromStation,
  toStation,
  journeyDate,
  user,
  onClose,
}) {
  const [step, setStep] = useState(1); // 1: passengers, 2: contact, 3: confirmation
  const [passengers, setPassengers] = useState([emptyPassenger()]);
  const [quota, setQuota] = useState("GN");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const classInfo = useMemo(
    () => train.classes?.find((c) => c.value === selectedClass),
    [train.classes, selectedClass],
  );
  const elite = isEliteClass(selectedClass);

  const addPassenger = useCallback(() => {
    if (passengers.length >= 6) return;
    setPassengers((p) => [...p, emptyPassenger()]);
  }, [passengers.length]);

  const removePassenger = useCallback((id) => {
    setPassengers((p) => (p.length > 1 ? p.filter((pax) => pax.id !== id) : p));
  }, []);

  const updatePassenger = useCallback((id, field, value) => {
    setPassengers((p) =>
      p.map((pax) => (pax.id === id ? { ...pax, [field]: value } : pax)),
    );
  }, []);

  const validStep1 = passengers.every(
    (p) => p.name.trim() && p.age && Number(p.age) > 0,
  );
  const validStep2 =
    contactPhone.trim().length >= 10 && contactEmail.trim().includes("@");

  const handleConfirmBooking = useCallback(async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        classValue: selectedClass,
        quota,
        fromStation,
        toStation,
        journeyDate,
        passengers: passengers.map(({ id, ...rest }) => rest),
        contact: { phone: contactPhone.trim(), email: contactEmail.trim() },
      };
      const res = await api.post("/trains/book", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setConfirmation(res.data);
      setStep(3);
    } catch (err) {
      console.error(err);
      setError("Booking could not be confirmed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [
    train,
    selectedClass,
    quota,
    fromStation,
    toStation,
    journeyDate,
    passengers,
    contactPhone,
    contactEmail,
  ]);

  return (
    <div className="modal-backdrop tbm-backdrop" onClick={onClose}>
      <div
        className="modal-box train-booking-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tbm-top-accent" aria-hidden="true" />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <div className="tbm-eyebrow-row">
              <span className="section-eyebrow">Confirm Your Journey</span>
              <span className="tbm-hairline" aria-hidden="true" />
            </div>
            <h3
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--ink)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {train.trainName}{" "}
              <span style={{ color: "#9CA3AF", fontSize: "1rem" }}>
                #{train.trainNumber}
              </span>
              {elite && (
                <span className="tbm-elite-tag">
                  <FaCrown size={10} /> Premium
                </span>
              )}
            </h3>
            <div
              style={{
                fontFamily: "Outfit",
                fontSize: "0.82rem",
                color: "#6B7280",
                marginTop: 4,
              }}
            >
              {fromStation || "Origin"} → {toStation || "Destination"}{" "}
              {journeyDate ? `· ${journeyDate}` : ""} ·{" "}
              {classInfo?.name || selectedClass}
            </div>
          </div>
          <button
            onClick={onClose}
            className="tbm-close-btn"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {step !== 3 && (
          <div className="tbm-steps">
            {STEP_LABELS.slice(0, 2).map((label, i) => {
              const n = i + 1;
              const state = step > n ? "done" : step === n ? "active" : "";
              return (
                <React.Fragment key={label}>
                  <div className={`tbm-step ${state}`}>
                    <span className="tbm-step-dot">
                      {step > n ? <FaCheckCircle size={11} /> : n}
                    </span>
                    <span className="tbm-step-label">{label}</span>
                  </div>
                  {i === 0 && (
                    <div
                      className={`tbm-step-line ${step > 1 ? "done" : ""}`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* ─── Step 1: Passengers ─────────────────────────── */}
        {step === 1 && (
          <div className="step-enter">
            <div className="field-label">Quota</div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 22,
              }}
            >
              {QUOTAS.map((q) => (
                <button
                  key={q.value}
                  type="button"
                  className={`filter-pill tbm-pill ${quota === q.value ? "active" : ""}`}
                  onClick={() => setQuota(q.value)}
                >
                  {q.label}
                </button>
              ))}
            </div>

            <div className="field-label">
              Passenger Details{" "}
              <span className="field-hint">(max 6 per booking)</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {passengers.map((pax, i) => (
                <div key={pax.id} className="tbm-pax-row">
                  <span className="tbm-pax-index">{i + 1}</span>
                  <input
                    className="input tbm-input"
                    placeholder={`Passenger ${i + 1} name`}
                    value={pax.name}
                    onChange={(e) =>
                      updatePassenger(pax.id, "name", e.target.value)
                    }
                  />
                  <input
                    className="input tbm-input"
                    type="number"
                    min="0"
                    max="120"
                    placeholder="Age"
                    value={pax.age}
                    onChange={(e) =>
                      updatePassenger(pax.id, "age", e.target.value)
                    }
                  />
                  <select
                    className="input tbm-input"
                    value={pax.gender}
                    onChange={(e) =>
                      updatePassenger(pax.id, "gender", e.target.value)
                    }
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removePassenger(pax.id)}
                    disabled={passengers.length === 1}
                    className="tbm-remove-btn"
                    style={{
                      color: passengers.length === 1 ? "#E5E7EB" : "#E85757",
                      cursor:
                        passengers.length === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addPassenger}
              disabled={passengers.length >= 6}
              className="tbm-add-btn"
              style={{
                color: passengers.length >= 6 ? "#D1D5DB" : "var(--saffron)",
                cursor: passengers.length >= 6 ? "not-allowed" : "pointer",
              }}
            >
              <FaPlus size={11} /> Add Passenger
            </button>

            <button
              className="btn-primary tbm-cta"
              style={{ width: "100%", padding: 14 }}
              disabled={!validStep1}
              onClick={() => setStep(2)}
            >
              Continue to Contact Details
            </button>
          </div>
        )}

        {/* ─── Step 2: Contact ────────────────────────────── */}
        {step === 2 && (
          <div className="step-enter">
            <div className="field-label">Contact Phone</div>
            <input
              className="input tbm-input"
              style={{ marginBottom: 18 }}
              placeholder="10-digit mobile number"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />

            <div className="field-label">Contact Email</div>
            <input
              className="input tbm-input"
              style={{ marginBottom: 26 }}
              placeholder="you@example.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />

            <div className="tbm-summary-card">
              <div className="tbm-summary-label">Booking Summary</div>
              <div
                style={{
                  fontFamily: "Outfit",
                  fontSize: "0.88rem",
                  color: "var(--ink)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span>
                  <FaTrain
                    style={{ color: "var(--saffron)", marginRight: 8 }}
                  />
                  {train.trainName} · {classInfo?.name || selectedClass}
                  {elite && (
                    <span className="tbm-elite-tag tbm-elite-tag-inline">
                      <FaCrown size={9} /> Premium
                    </span>
                  )}
                </span>
                <span>
                  {passengers.length} passenger
                  {passengers.length > 1 ? "s" : ""} · Quota:{" "}
                  {QUOTAS.find((q) => q.value === quota)?.label}
                </span>
                <span>
                  {fromStation || "Origin"} → {toStation || "Destination"}{" "}
                  {journeyDate ? `· ${journeyDate}` : ""}
                </span>
              </div>
            </div>

            {error && <div className="train-modal-error">{error}</div>}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-outline"
                style={{
                  flex: 1,
                  padding: 13,
                  color: "var(--ink)",
                  border: "1.5px solid #E5E7EB",
                }}
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="btn-primary tbm-cta"
                style={{
                  flex: 2,
                  padding: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                disabled={!validStep2 || submitting}
                onClick={handleConfirmBooking}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="spinner" /> Confirming…
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3: Confirmation ───────────────────────── */}
        {step === 3 && (
          <div
            className="step-enter tbm-confirm"
            style={{ textAlign: "center", padding: "24px 0 6px" }}
          >
            <div className="tbm-check-ring">
              <FaCheckCircle
                style={{ fontSize: "2.6rem", color: "var(--forest)" }}
              />
            </div>
            <h4
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 10,
              }}
            >
              Booking Confirmed!
            </h4>
            {confirmation?.pnr ? (
              <div className="tbm-pnr-badge">
                PNR&nbsp;<strong>{confirmation.pnr}</strong>
              </div>
            ) : (
              <p
                style={{
                  fontFamily: "Outfit",
                  fontSize: "0.88rem",
                  color: "#6B7280",
                  marginBottom: 24,
                }}
              >
                A confirmation with your PNR has been sent to your email.
              </p>
            )}
            <button
              className="btn-primary tbm-cta"
              style={{ padding: "13px 32px", marginTop: 24 }}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        )}
      </div>

      <style>{`
        :root { --gold: #D4AF6A; }

        .tbm-backdrop { backdrop-filter: blur(3px); }

        .train-booking-modal {
          max-width: 560px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(15,25,35,0.35), 0 0 0 1px rgba(212,175,106,0.15);
        }
        .tbm-top-accent {
          position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, var(--forest), var(--gold), var(--saffron));
        }

        .tbm-eyebrow-row { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
        .tbm-hairline { flex: 0 0 36px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); }

        .tbm-elite-tag {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: 'Outfit', sans-serif; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.4px;
          color: #8a6a1f; background: rgba(212,175,106,0.16); border: 1px solid rgba(212,175,106,0.45);
          padding: 3px 9px; border-radius: 999px; text-transform: uppercase;
        }
        .tbm-elite-tag-inline { margin-left: 8px; vertical-align: middle; }

        .tbm-close-btn {
          background: none; border: none; font-size: 1.05rem; cursor: pointer; color: #6B7280;
          width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
          transition: background 0.2s, color 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .tbm-close-btn:hover { background: #F3F4F6; color: var(--ink); }

        .tbm-steps { display: flex; align-items: center; margin-bottom: 24px; }
        .tbm-step { display: flex; align-items: center; gap: 8px; }
        .tbm-step-dot {
          width: 24px; height: 24px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif; font-size: 0.7rem; font-weight: 700;
          background: #F3F4F6; color: #9CA3AF; border: 1.5px solid #E5E7EB;
          transition: all 0.3s;
        }
        .tbm-step.active .tbm-step-dot { background: var(--saffron); color: white; border-color: var(--saffron); box-shadow: 0 0 0 4px rgba(232,129,58,0.15); }
        .tbm-step.done .tbm-step-dot { background: var(--forest); color: white; border-color: var(--forest); }
        .tbm-step-label {
          font-family: 'Outfit', sans-serif; font-size: 0.78rem; font-weight: 600; color: #9CA3AF;
        }
        .tbm-step.active .tbm-step-label { color: var(--ink); }
        .tbm-step.done .tbm-step-label { color: var(--forest); }
        .tbm-step-line { flex: 1; height: 1.5px; background: #E5E7EB; margin: 0 12px; position: relative; max-width: 80px; }
        .tbm-step-line.done { background: var(--forest); }

        .tbm-pill { transition: all 0.2s; }
        .tbm-pill.active { box-shadow: 0 0 0 3px rgba(232,129,58,0.12); }

        .tbm-pax-row {
          display: grid; grid-template-columns: 22px 1fr 80px 92px 32px; gap: 8px; align-items: center;
          background: #FAFAF9; border: 1px solid #F0F0EE; border-radius: 12px; padding: 8px;
          transition: border-color 0.2s, background 0.2s;
        }
        .tbm-pax-row:focus-within { border-color: rgba(232,129,58,0.4); background: white; }
        .tbm-pax-index {
          font-family: 'Outfit', sans-serif; font-size: 0.7rem; font-weight: 700; color: var(--gold);
          text-align: center;
        }
        .tbm-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .tbm-input:focus { border-color: var(--saffron); box-shadow: 0 0 0 3px rgba(232,129,58,0.1); outline: none; }
        .tbm-remove-btn {
          background: none; border: none; display: flex; justify-content: center; align-items: center;
          width: 26px; height: 26px; border-radius: 8px; transition: background 0.2s;
        }
        .tbm-remove-btn:not(:disabled):hover { background: rgba(232,87,87,0.1); }

        .tbm-add-btn {
          display: flex; align-items: center; gap: 6px; background: none;
          border: 1.5px dashed #E5E7EB; border-radius: 10px; padding: 9px 16px;
          font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 600;
          margin-bottom: 26px; transition: border-color 0.2s, background 0.2s;
        }
        .tbm-add-btn:not(:disabled):hover { border-color: var(--gold); background: rgba(212,175,106,0.06); }

        .tbm-cta { position: relative; overflow: hidden; }
        .tbm-cta::after {
          content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
          background: linear-gradient(115deg, transparent, rgba(255,255,255,0.35), transparent);
          transform: skewX(-20deg); animation: tbmShine 3.4s ease-in-out infinite;
        }
        @keyframes tbmShine {
          0% { left: -60%; } 50% { left: 130%; } 100% { left: 130%; }
        }

        .tbm-summary-card {
          background: linear-gradient(160deg, var(--cream-deep), #FBF5EC);
          border: 1px solid rgba(212,175,106,0.25);
          border-left: 3px solid var(--gold);
          border-radius: 14px; padding: 18px 20px; margin-bottom: 22px;
        }
        .tbm-summary-label {
          font-family: 'Outfit', sans-serif; font-size: 0.75rem; color: #8a6a1f; letter-spacing: 0.8px;
          text-transform: uppercase; font-weight: 700; margin-bottom: 10px;
        }

        .train-modal-error {
          font-family: 'Outfit', sans-serif; font-size: 0.82rem; color: #B91C1C;
          background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.2);
          border-radius: 10px; padding: 10px 14px; margin-bottom: 16px;
        }

        .tbm-confirm { animation: tbmPop 0.5s ease; }
        @keyframes tbmPop {
          0% { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
        .tbm-check-ring {
          width: 84px; height: 84px; border-radius: 50%; margin: 0 auto 18px;
          display: flex; align-items: center; justify-content: center;
          background: radial-gradient(circle, rgba(26,60,52,0.08), transparent 70%);
          box-shadow: 0 0 0 6px rgba(212,175,106,0.12), 0 0 0 1px rgba(26,60,52,0.1);
        }
        .tbm-pnr-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Outfit', sans-serif; font-size: 0.85rem; color: var(--ink);
          background: rgba(212,175,106,0.12); border: 1px solid rgba(212,175,106,0.4);
          border-radius: 999px; padding: 8px 18px; margin-bottom: 8px; letter-spacing: 0.3px;
        }
        .tbm-pnr-badge strong { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; color: var(--forest); }

        @media (prefers-reduced-motion: reduce) {
          .tbm-cta::after { animation: none; }
          .tbm-confirm { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default TrainBookingModal;
