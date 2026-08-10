import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api", withCredentials: true });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const LoyaltyPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/loyalty/me").then((r) => setData(r.data));
  }, []);

  if (!data) return <div style={{ padding: 60, textAlign: "center" }}>Loading…</div>;
  const { loyalty, transactions } = data;
  const referralLink = `${window.location.origin}/register?ref=${loyalty.referralCode}`;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px", fontFamily: "Arial, sans-serif" }}>
      <h2>My Loyalty & Rewards</h2>
      <div style={{ background: "#f7f8fb", borderRadius: 10, padding: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <div><div style={{ fontSize: 12.5, color: "#888" }}>Tier</div><div style={{ fontSize: 22, fontWeight: 700, textTransform: "capitalize" }}>{loyalty.tier}</div></div>
        <div><div style={{ fontSize: 12.5, color: "#888" }}>Points</div><div style={{ fontSize: 22, fontWeight: 700 }}>{loyalty.points}</div></div>
        <div><div style={{ fontSize: 12.5, color: "#888" }}>Wallet Balance</div><div style={{ fontSize: 22, fontWeight: 700 }}>₹{loyalty.walletBalance}</div></div>
      </div>

      <div style={{ margin: "20px 0" }}>
        <h3>Your Perks</h3>
        <ul>{loyalty.benefits.perks.map((p, i) => <li key={i}>{p}</li>)}</ul>
        {loyalty.nextTier && <p style={{ color: "#888", fontSize: 13.5 }}>Reach the <strong style={{ textTransform: "capitalize" }}>{loyalty.nextTier}</strong> tier for more benefits.</p>}
      </div>

      <div style={{ margin: "20px 0" }}>
        <h3>Refer & Earn</h3>
        <p>Share your link — you earn 3% wallet credit when someone books using it.</p>
        <input readOnly value={referralLink} onFocus={(e) => e.target.select()} style={{ width: "100%", padding: 10, border: "1px solid #dcdfe8", borderRadius: 6 }} />
        <p style={{ fontSize: 13, color: "#888" }}>{loyalty.referredCount} friend(s) referred so far.</p>
      </div>

      <h3>Recent Activity</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} style={{ borderBottom: "1px solid #f1f1f1" }}>
              <td style={{ padding: "8px 0" }}>{new Date(t.createdAt).toLocaleDateString("en-IN")}</td>
              <td>{t.description}</td>
              <td style={{ textAlign: "right", color: t.amount >= 0 ? "#1a7a37" : "#a12626" }}>{t.amount >= 0 ? "+" : ""}₹{t.amount}</td>
            </tr>
          ))}
          {transactions.length === 0 && <tr><td style={{ color: "#888", padding: 12 }}>No activity yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default LoyaltyPage;
