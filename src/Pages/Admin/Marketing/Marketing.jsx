import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const emptyCoupon = { code: "", description: "", discountType: "percent", discountValue: "", maxDiscount: "", minBookingAmount: "", validTill: "" };

const Marketing = () => {
  const [tab, setTab] = useState("Coupons");
  const [coupons, setCoupons] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyCoupon);

  const loadCoupons = async () => setCoupons((await adminApi.get("/marketing/coupons")).data.coupons);
  const loadSubscribers = async () => setSubscribers((await adminApi.get("/marketing/newsletter/subscribers")).data.subscribers);

  useEffect(() => { tab === "Coupons" ? loadCoupons() : loadSubscribers(); }, [tab]);

  const submitCoupon = async (e) => {
    e.preventDefault();
    await adminApi.post("/marketing/coupons", form);
    setForm(emptyCoupon);
    setModalOpen(false);
    loadCoupons();
  };

  const toggleCoupon = async (c) => { await adminApi.put(`/marketing/coupons/${c._id}`, { active: !c.active }); loadCoupons(); };
  const deleteCoupon = async (c) => { if (!window.confirm(`Delete coupon ${c.code}?`)) return; await adminApi.delete(`/marketing/coupons/${c._id}`); loadCoupons(); };

  const exportSubscribers = async () => {
    const { data } = await adminApi.get("/marketing/newsletter/export", { responseType: "blob" });
    const url = URL.createObjectURL(new Blob([data]));
    const a = document.createElement("a"); a.href = url; a.download = "newsletter_subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Marketing</h2>
      <div className="admin-tabs">
        {["Coupons", "Newsletter"].map((t) => <div key={t} className={`admin-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</div>)}
      </div>

      {tab === "Coupons" && (
        <div>
          <div className="admin-toolbar" style={{ justifyContent: "flex-end" }}>
            <button className="admin-btn" onClick={() => setModalOpen(true)}>+ New Coupon</button>
          </div>
          <div className="admin-card admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Code</th><th>Discount</th><th>Min Booking</th><th>Valid Till</th><th>Used</th><th>Active</th><th></th></tr></thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id}>
                    <td><strong>{c.code}</strong></td>
                    <td>{c.discountType === "percent" ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                    <td>₹{c.minBookingAmount}</td>
                    <td>{new Date(c.validTill).toLocaleDateString("en-IN")}</td>
                    <td>{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ""}</td>
                    <td><button className={`admin-badge ${c.active ? "badge-confirmed" : "badge-rejected"}`} style={{ border: "none", cursor: "pointer" }} onClick={() => toggleCoupon(c)}>{c.active ? "active" : "inactive"}</button></td>
                    <td><button className="admin-btn danger" onClick={() => deleteCoupon(c)}>Delete</button></td>
                  </tr>
                ))}
                {coupons.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "#888" }}>No coupons yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Newsletter" && (
        <div className="admin-card admin-table-wrap">
          <div className="admin-toolbar" style={{ justifyContent: "flex-end" }}>
            <button className="admin-btn secondary" onClick={exportSubscribers}>Export CSV</button>
          </div>
          <table className="admin-table">
            <thead><tr><th>Email</th><th>Subscribed On</th></tr></thead>
            <tbody>
              {subscribers.map((s) => <tr key={s._id}><td>{s.email}</td><td>{new Date(s.createdAt).toLocaleDateString("en-IN")}</td></tr>)}
              {subscribers.length === 0 && <tr><td colSpan={2} style={{ textAlign: "center", color: "#888" }}>No subscribers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>New Coupon</h3>
            <form onSubmit={submitCoupon}>
              <div className="admin-form-row"><label>Code</label><input className="admin-input" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></div>
              <div className="admin-form-row"><label>Discount Type</label>
                <select className="admin-select" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                  <option value="percent">Percent</option><option value="flat">Flat (₹)</option>
                </select>
              </div>
              <div className="admin-form-row"><label>Discount Value</label><input className="admin-input" type="number" required value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} /></div>
              <div className="admin-form-row"><label>Max Discount (₹, optional, for % coupons)</label><input className="admin-input" type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} /></div>
              <div className="admin-form-row"><label>Min Booking Amount (₹)</label><input className="admin-input" type="number" value={form.minBookingAmount} onChange={(e) => setForm({ ...form, minBookingAmount: e.target.value })} /></div>
              <div className="admin-form-row"><label>Valid Till</label><input className="admin-input" type="date" required value={form.validTill} onChange={(e) => setForm({ ...form, validTill: e.target.value })} /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="admin-btn" type="submit">Create</button>
                <button className="admin-btn secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketing;
