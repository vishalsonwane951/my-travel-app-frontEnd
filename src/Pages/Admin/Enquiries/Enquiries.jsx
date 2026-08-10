import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const STATUSES = ["pending", "responded", "confirmed", "closed", "rejected"];

const Enquiries = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // { source, id, ...row } for the notes/status drawer
  const [noteText, setNoteText] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/enquiries", { params: { status, search, page, limit: 20 } });
      setItems(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status, page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); load(); };

  const updateStatus = async (row, newStatus) => {
    await adminApi.put(`/enquiries/${row.source}/${row.id}/status`, { status: newStatus });
    load();
    if (selected?.id === row.id) setSelected({ ...selected, status: newStatus });
  };

  const addNote = async () => {
    if (!noteText.trim() || !selected) return;
    await adminApi.post(`/enquiries/${selected.source}/${selected.id}/notes`, { note: noteText });
    setNoteText("");
    const { data } = await adminApi.get("/enquiries", { params: { status, search, page, limit: 20 } });
    setItems(data.items);
    const fresh = data.items.find((i) => i.id === selected.id);
    if (fresh) setSelected(fresh);
  };

  return (
    <div>
      <h2>Enquiries & Bookings</h2>

      <form className="admin-toolbar" onSubmit={handleSearch}>
        <input className="admin-input" placeholder="Search name, email, phone, destination…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="admin-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="admin-btn" type="submit">Search</button>
      </form>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Contact</th><th>Destination</th><th>Package</th><th>Status</th><th>Source</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={8} style={{ textAlign: "center" }}>Loading…</td></tr>}
            {!loading && items.map((row) => (
              <tr key={`${row.source}-${row.id}`}>
                <td>{row.name}</td>
                <td>{row.email}<br />{row.phone}</td>
                <td>{row.destination}</td>
                <td>{row.packageName}</td>
                <td>
                  <select className="admin-select" value={row.status} onChange={(e) => updateStatus(row, e.target.value)}>
                    {(row.source === "booking" ? STATUSES : ["new", "contacted", "closed"]).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td><span className="admin-badge badge-contacted">{row.source}</span></td>
                <td>{new Date(row.createdAt).toLocaleDateString("en-IN")}</td>
                <td><button className="admin-btn secondary" onClick={() => setSelected(row)}>Notes</button></td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "#888" }}>No enquiries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-toolbar" style={{ justifyContent: "flex-end" }}>
        <button className="admin-btn secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>Page {page} of {Math.max(1, Math.ceil(total / 20))}</span>
        <button className="admin-btn secondary" disabled={page * 20 >= total} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {selected && (
        <div className="admin-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selected.name} — timeline & notes</h3>
            <p style={{ color: "#888", fontSize: 13 }}>{selected.destination} · {selected.packageName}</p>
            <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: 12 }}>
              {(selected.timeline || []).length === 0 && <p style={{ color: "#888" }}>No notes yet.</p>}
              {(selected.timeline || []).slice().reverse().map((t, i) => (
                <div key={i} style={{ borderBottom: "1px solid #f1f1f1", padding: "8px 0", fontSize: 13 }}>
                  <strong>{t.by}</strong> — {t.status ? `status → ${t.status}. ` : ""}{t.note}
                  <div style={{ color: "#aaa", fontSize: 11 }}>{new Date(t.at).toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
            {selected.source === "booking" && (
              <div style={{ display: "flex", gap: 8 }}>
                <input className="admin-input" style={{ flex: 1 }} placeholder="Add a note…" value={noteText} onChange={(e) => setNoteText(e.target.value)} />
                <button className="admin-btn" onClick={addNote}>Add</button>
              </div>
            )}
            <button className="admin-btn secondary" style={{ marginTop: 14 }} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;
