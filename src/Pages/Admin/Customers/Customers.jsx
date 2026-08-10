import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [profile, setProfile] = useState(null);

  const load = async () => {
    setLoading(true);
    try { setCustomers((await adminApi.get("/customers", { params: { search } })).data.customers); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openProfile = async (c) => {
    setSelected(c);
    const { data } = await adminApi.get(`/customers/${c._id}`);
    setProfile(data);
  };

  const toggleBlock = async (c) => {
    await adminApi.put(`/customers/${c._id}/block`);
    load();
    if (selected?._id === c._id) openProfile(c);
  };

  return (
    <div>
      <h2>Customer Management</h2>
      <form className="admin-toolbar" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <input className="admin-input" placeholder="Search name, email, mobile…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="admin-btn" type="submit">Search</button>
      </form>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={{ textAlign: "center" }}>Loading…</td></tr>}
            {!loading && customers.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td><td>{c.email}</td><td>{c.mobile || "—"}</td>
                <td><span className={`admin-badge ${c.active !== false ? "badge-confirmed" : "badge-rejected"}`}>{c.active !== false ? "active" : "blocked"}</span></td>
                <td>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="admin-btn secondary" onClick={() => openProfile(c)}>View</button>
                  <button className="admin-btn danger" onClick={() => toggleBlock(c)}>{c.active !== false ? "Block" : "Unblock"}</button>
                </td>
              </tr>
            ))}
            {!loading && customers.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#888" }}>No customers found.</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && profile && (
        <div className="admin-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="admin-modal" style={{ width: 560 }} onClick={(e) => e.stopPropagation()}>
            <h3>{profile.customer.name}</h3>
            <p style={{ color: "#888" }}>{profile.customer.email} · {profile.customer.mobile}</p>
            <div className="admin-grid admin-kpi-grid">
              <div className="admin-kpi-card"><div className="admin-kpi-label">Total Bookings</div><div className="admin-kpi-value">{profile.stats.totalBookings}</div></div>
              <div className="admin-kpi-card"><div className="admin-kpi-label">Total Spent</div><div className="admin-kpi-value">₹{profile.stats.totalSpent.toLocaleString("en-IN")}</div></div>
            </div>
            <h4>Booking History</h4>
            <div style={{ maxHeight: 240, overflowY: "auto" }}>
              {profile.bookings.map((b) => (
                <div key={b._id} style={{ padding: "8px 0", borderBottom: "1px solid #f1f1f1", fontSize: 13.5 }}>
                  {b.destination} — <span className={`admin-badge badge-${b.status}`}>{b.status}</span> — {new Date(b.createdAt).toLocaleDateString("en-IN")}
                </div>
              ))}
              {profile.bookings.length === 0 && <p style={{ color: "#888" }}>No bookings yet.</p>}
            </div>
            <button className="admin-btn secondary" style={{ marginTop: 14 }} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
