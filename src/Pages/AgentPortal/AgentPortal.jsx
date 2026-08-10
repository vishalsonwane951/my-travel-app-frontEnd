import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api", withCredentials: true });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AgentPortal = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/agent/dashboard");
      setDashboard(data);
    } catch (err) {
      setError(err.response?.data?.message || "");
    }
  };
  useEffect(() => { load(); }, []);

  const apply = async () => {
    setApplying(true);
    try {
      await api.post("/agent/register");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not activate agent account.");
    } finally {
      setApplying(false);
    }
  };

  if (!dashboard) {
    return (
      <div style={{ maxWidth: 500, margin: "60px auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h2>Become a Desivdesi Agent</h2>
        <p style={{ color: "#666" }}>Share your unique code, earn commission on every confirmed booking.</p>
        {error && <p style={{ color: "#a12626" }}>{error}</p>}
        <button onClick={apply} disabled={applying} style={{ background: "#4f7cff", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 8, cursor: "pointer" }}>
          {applying ? "Activating…" : "Activate Agent Account"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Agent Dashboard</h2>
      <p>Your agent code: <strong>{dashboard.agentCode}</strong> — share links like <code>desivdesi.com/checkout/&lt;packageId&gt;?ref={dashboard.agentCode}</code></p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, margin: "20px 0" }}>
        {[
          ["Total Referrals", dashboard.stats.totalReferrals],
          ["Confirmed", dashboard.stats.confirmedReferrals],
          ["Earned", `₹${dashboard.stats.totalEarned.toLocaleString("en-IN")}`],
          ["Pending", `₹${dashboard.stats.pendingEarnings.toLocaleString("en-IN")}`],
        ].map(([label, val]) => (
          <div key={label} style={{ background: "#f7f8fb", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 12.5, color: "#888" }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{val}</div>
          </div>
        ))}
      </div>

      <h3>Commissions</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
        <thead><tr><th style={{ textAlign: "left" }}>Booking</th><th>Amount</th><th>Rate</th><th>Commission</th><th>Status</th></tr></thead>
        <tbody>
          {dashboard.commissions.map((c) => (
            <tr key={c._id}>
              <td>{c.booking?.destination}</td>
              <td>₹{c.bookingAmount.toLocaleString("en-IN")}</td>
              <td>{c.commissionRate}%</td>
              <td>₹{c.commissionAmount.toLocaleString("en-IN")}</td>
              <td>{c.status}</td>
            </tr>
          ))}
          {dashboard.commissions.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#888", padding: 12 }}>No commissions yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AgentPortal;
