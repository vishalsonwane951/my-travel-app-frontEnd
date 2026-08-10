import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");

  const load = async () => { setLoading(true); try { setTickets((await adminApi.get("/support")).data.tickets); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const openTicket = async (t) => { const { data } = await adminApi.get(`/support/${t._id}`); setSelected(data.ticket); };

  const reply = async () => {
    if (!replyText.trim() || !selected) return;
    const { data } = await adminApi.post(`/support/${selected._id}/reply`, { message: replyText });
    setSelected(data.ticket);
    setReplyText("");
    load();
  };

  const updateStatus = async (status) => {
    const { data } = await adminApi.put(`/support/${selected._id}/status`, { status });
    setSelected(data.ticket);
    load();
  };

  return (
    <div>
      <h2>Support / Helpdesk</h2>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Ticket #</th><th>Subject</th><th>Customer</th><th>Priority</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={{ textAlign: "center" }}>Loading…</td></tr>}
            {!loading && tickets.map((t) => (
              <tr key={t._id}>
                <td>{t.ticketNumber}</td><td>{t.subject}</td><td>{t.name}</td>
                <td><span className="admin-badge badge-pending">{t.priority}</span></td>
                <td><span className={`admin-badge badge-${t.status}`}>{t.status}</span></td>
                <td><button className="admin-btn secondary" onClick={() => openTicket(t)}>Open</button></td>
              </tr>
            ))}
            {!loading && tickets.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#888" }}>No tickets yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="admin-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="admin-modal" style={{ width: 560 }} onClick={(e) => e.stopPropagation()}>
            <h3>{selected.subject} <span style={{ color: "#888", fontSize: 13 }}>({selected.ticketNumber})</span></h3>
            <div className="admin-toolbar">
              {["open", "in_progress", "resolved", "closed"].map((s) => (
                <button key={s} className={`admin-btn ${selected.status === s ? "" : "secondary"}`} onClick={() => updateStatus(s)}>{s}</button>
              ))}
            </div>
            <div style={{ maxHeight: 240, overflowY: "auto", marginBottom: 12 }}>
              {selected.replies.map((r, i) => (
                <div key={i} style={{ background: r.from === "staff" ? "#eef1fb" : "#f7f8fb", padding: "8px 12px", borderRadius: 6, marginBottom: 6, fontSize: 13.5 }}>
                  <strong>{r.authorName} ({r.from}):</strong> {r.message}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="admin-input" style={{ flex: 1 }} placeholder="Reply…" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
              <button className="admin-btn" onClick={reply}>Reply</button>
            </div>
            <button className="admin-btn secondary" style={{ marginTop: 14 }} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
