import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api.js";
import { AuthContext } from "../../Context/AuthContext.jsx";
import "./MyPagesShared.css";

const STATUS_LABELS = {
  pending: { label: "Pending Confirmation", color: "#8a6d00", bg: "#fff3cd" },
  confirmed: { label: "Confirmed", color: "#1a7a37", bg: "#d4f7dc" },
  responded: { label: "Responded", color: "#1e4fa0", bg: "#dbe8ff" },
  closed: { label: "Closed", color: "#555", bg: "#eee" },
  rejected: { label: "Rejected", color: "#a12626", bg: "#f3d4d4" },
};

const MyBookingsPage = () => {
  const { user, token } = useContext(AuthContext) || {};
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.get("/bookings/mine")
      .then(({ data }) => setBookings(data.bookings || []))
      .catch((err) => setError(err.response?.data?.message || "Could not load your bookings."))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <div className="mp-page mp-center">
        <h2>My Bookings</h2>
        <p>Please <Link to="/login">log in</Link> to see your bookings.</p>
      </div>
    );
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="mp-page">
      <div className="mp-header">
        <h1>My Bookings</h1>
        <p className="mp-sub">Every trip you've enquired about or booked, in one place.</p>
      </div>

      <div className="mp-filters">
        {["all", "pending", "confirmed", "closed", "rejected"].map((s) => (
          <button
            key={s}
            className={`mp-filter-chip ${filter === s ? "active" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "All" : STATUS_LABELS[s]?.label || s}
          </button>
        ))}
      </div>

      {loading && <div className="mp-loading">Loading your bookings…</div>}
      {error && <div className="mp-error">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="mp-empty">
          <div className="mp-empty-icon">🧳</div>
          <h3>No bookings {filter !== "all" ? `with status "${filter}"` : "yet"}</h3>
          <p>Start planning your next trip — browse our packages and enquire.</p>
          <Link to="/packages" className="mp-cta">Explore Packages</Link>
        </div>
      )}

      <div className="mp-list">
        {filtered.map((b) => {
          const status = STATUS_LABELS[b.status] || STATUS_LABELS.pending;
          return (
            <div key={b._id} className="mp-card">
              <div className="mp-card-main">
                <div className="mp-card-title-row">
                  <h3>{b.packageName || b.destination}</h3>
                  <span className="mp-badge" style={{ color: status.color, background: status.bg }}>
                    {status.label}
                  </span>
                </div>
                <p className="mp-card-sub">{b.destination}</p>
                <div className="mp-card-meta">
                  {b.startDate && <span>📅 {new Date(b.startDate).toLocaleDateString("en-IN")}</span>}
                  <span>👥 {b.adults || 1} traveler(s)</span>
                  {b.bookingId && <span>🔖 {b.bookingId}</span>}
                </div>
              </div>
              <div className="mp-card-side">
                {(b.finalAmount ?? b.quotedPrice) != null && (
                  <div className="mp-price">₹{(b.finalAmount ?? b.quotedPrice).toLocaleString("en-IN")}</div>
                )}
                {b.status === "confirmed" && (
                  <Link to={`/my-trip/${b._id}`} className="mp-link-btn">View Trip</Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookingsPage;
