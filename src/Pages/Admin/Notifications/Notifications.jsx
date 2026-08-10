import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const emptyForm = { title: "", message: "", channel: "email", audience: "all_customers" };

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => { setLoading(true); try { setItems((await adminApi.get("/notifications")).data.notifications); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await adminApi.post("/notifications", form);
    setForm(emptyForm);
    setModalOpen(false);
    load();
  };

  const send = async (n) => {
    if (!window.confirm(`Send "${n.title}" to ${n.audience.replace("_", " ")}?`)) return;
    const { data } = await adminApi.post(`/notifications/${n._id}/send`);
    alert(data.message);
    load();
  };

  const remove = async (n) => { await adminApi.delete(`/notifications/${n._id}`); load(); };

  return (
    <div>
      <div className="admin-toolbar" style={{ justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Notification Center</h2>
        <button className="admin-btn" onClick={() => setModalOpen(true)}>+ New Notification</button>
      </div>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Channel</th><th>Audience</th><th>Status</th><th>Recipients</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={{ textAlign: "center" }}>Loading…</td></tr>}
            {!loading && items.map((n) => (
              <tr key={n._id}>
                <td>{n.title}</td><td>{n.channel}</td><td>{n.audience.replace("_", " ")}</td>
                <td><span className={`admin-badge ${n.status === "sent" ? "badge-confirmed" : "badge-pending"}`}>{n.status}</span></td>
                <td>{n.recipientCount || "—"}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  {n.status === "draft" && <button className="admin-btn" onClick={() => send(n)}>Send</button>}
                  <button className="admin-btn danger" onClick={() => remove(n)}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#888" }}>No notifications yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>New Notification</h3>
            <form onSubmit={create}>
              <div className="admin-form-row"><label>Title</label><input className="admin-input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="admin-form-row"><label>Message</label><textarea className="admin-input" rows={4} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
              <div className="admin-form-row"><label>Channel</label>
                <select className="admin-select" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
                  <option value="email">Email</option><option value="sms">SMS</option><option value="in_app">In-app</option>
                </select>
              </div>
              <div className="admin-form-row"><label>Audience</label>
                <select className="admin-select" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                  <option value="all_customers">All Customers</option><option value="staff">Staff</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="admin-btn" type="submit">Save as Draft</button>
                <button className="admin-btn secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
