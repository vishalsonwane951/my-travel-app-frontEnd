import { useState } from "react";

import api from "../utils/api.js";


const DUMMY_API = "https://jsonplaceholder.typicode.com/posts";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

const handleSubscribe = async () => {
  if (!isValidEmail(email)) {
    setErrorMsg("Please enter a valid email address.");
    setStatus("error");
    return;
  }

  setStatus("loading");
  setErrorMsg("");

  try {
    // Try the actual API first
    await api.post("/content/newsletter/subscribe", { email });
    setStatus("success");
  } catch (err) {
    console.error("Primary newsletter API failed:", err);

    try {
      // Fallback to dummy API
      const res = await fetch(DUMMY_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Fallback request failed");
      }

      setStatus("success");
    } catch (fallbackErr) {
      console.error("Fallback newsletter API failed:", fallbackErr);

      setErrorMsg(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      setStatus("error");
    }
  }
};



  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubscribe();
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nl-section {
          position: relative;
          margin: 2rem 2rem;
          border-radius: 24px;
          background: linear-gradient(135deg, #0d1117 0%, #161d2a 60%, #1a1408 100%);
          border: 1px solid rgba(212,168,83,0.15);
          padding: 2rem 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          animation: fadeUp 0.6s ease both;
          box-shadow: 0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,168,83,0.08);
        }

        /* gold top-edge glow */
        .nl-section::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,168,83,0.6), transparent);
        }

        /* orb accents */
        .nl-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .nl-orb-1 {
          width: 320px; height: 320px;
          background: rgba(212,168,83,0.08);
          top: -120px; right: -60px;
        }
        .nl-orb-2 {
          width: 220px; height: 220px;
          background: rgba(61,82,160,0.12);
          bottom: -80px; left: -40px;
        }

        .nl-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        //   gap: 3rem;
          width: 100%;
          max-width: 860px;
          position: relative;
          z-index: 1;
        }

        .nl-kicker {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold, #d4a853);
          margin-bottom: 0.75rem;
        }

        .nl-heading {
          margin: 0 0 0.6rem;
          font-family: var(--serif, Georgia, serif);
          font-size: clamp(1.4rem, 2.5vw, 1.9rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
        }

        .nl-sub {
          margin: 0;
          font-size: 0.88rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          max-width: 280px;
        }

        .nl-form-block {
          flex: 1 1 auto;
          max-width: 420px;
        }

        .nl-input-row {
          display: flex;
          border-radius: 50px;
          overflow: hidden;
          border: 1px solid rgba(212,168,83,0.25);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(8px);
          transition: border-color 0.25s;
        }
        .nl-input-row:focus-within {
          border-color: rgba(212,168,83,0.55);
          box-shadow: 0 0 0 3px rgba(212,168,83,0.1);
        }
        .nl-input-row.error {
          border-color: rgba(255,107,107,0.6);
        }

        .nl-input {
          flex: 1;
          padding: 0.85rem 1.4rem;
          font-size: 0.9rem;
          border: none;
          background: transparent;
          color: #fff;
          font-family: var(--sans, system-ui, sans-serif);
          min-width: 0;
          outline: none;
        }
        .nl-input::placeholder { color: rgba(255,255,255,0.3); }

        .nl-btn {
          padding: 0.75rem 1.6rem;
          background: var(--gold, #d4a853);
          color: #0d1117;
          border: none;
          font-size: 0.85rem;
          font-weight: 700;
          font-family: var(--sans, system-ui, sans-serif);
          letter-spacing: 0.04em;
          white-space: nowrap;
          cursor: pointer;
          border-radius: 50px;
          margin: 4px;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 110px;
          box-shadow: 0 4px 18px rgba(212,168,83,0.3);
        }
        .nl-btn:hover:not(:disabled) {
          background: #e8ba50;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(212,168,83,0.45);
        }
        .nl-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .nl-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #0d1117;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        .nl-error {
          margin: 0.5rem 0 0 1.2rem;
          font-size: 0.78rem;
          color: #ff9aa2;
        }

        .nl-success {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(212,168,83,0.08);
          border: 1px solid rgba(212,168,83,0.2);
          border-radius: 50px;
          padding: 0.85rem 1.4rem;
        }
        .nl-check {
          width: 36px; height: 36px;
          background: rgba(212,168,83,0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nl-success-title {
          margin: 0 0 2px;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--gold, #d4a853);
        }
        .nl-success-sub {
          margin: 0;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
        }

        /* silhouette icon */
        .nl-deco {
          position: absolute;
          right: 5rem;
          bottom: 0;
          opacity: 0.06;
          pointer-events: none;
        }

        @media (max-width: 700px) {
          .nl-section { padding: 2.5rem 1.5rem; margin: 3rem 1rem; }
          .nl-content { flex-direction: column; gap: 2rem; }
          .nl-form-block { width: 100%; max-width: 100%; }
          .nl-sub { max-width: 100%; }
          .nl-deco { display: none; }
        }
      `}</style>

      <section className="nl-section">
        <div className="nl-orb nl-orb-1" />
        <div className="nl-orb nl-orb-2" />

        {/* decorative plane silhouette */}
        <div className="nl-deco" aria-hidden="true">
          <svg viewBox="0 0 160 160" width="160" height="160" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 10 L95 70 L160 80 L95 90 L80 150 L65 90 L0 80 L65 70 Z" />
          </svg>
        </div>

        <div className="nl-content">
          <div>
            <div className="nl-kicker">Stay in the loop</div>
            <h2 className="nl-heading">Subscribe Our<br />Newsletter</h2>
            <p className="nl-sub">Get exclusive travel offers and discover new places before anyone else.</p>
          </div>

          <div className="nl-form-block">
            {status === "success" ? (
              <div className="nl-success" role="status">
                <div className="nl-check">
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <path d="M5 11.5l4 4 8-8" stroke="#d4a853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="nl-success-title">You're subscribed!</p>
                  <p className="nl-success-sub">Check your inbox for the first update.</p>
                </div>
              </div>
            ) : (
              <>
                <div className={`nl-input-row${status === "error" ? " error" : ""}`}>
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                    onKeyDown={handleKeyDown}
                    className="nl-input"
                    aria-label="Email address"
                    disabled={status === "loading"}
                  />
                  <button
                    onClick={handleSubscribe}
                    className="nl-btn"
                    disabled={status === "loading"}
                    aria-label="Subscribe"
                  >
                    {status === "loading" ? <span className="nl-spinner" /> : "Subscribe →"}
                  </button>
                </div>
                {status === "error" && (
                  <p className="nl-error" role="alert">{errorMsg}</p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}