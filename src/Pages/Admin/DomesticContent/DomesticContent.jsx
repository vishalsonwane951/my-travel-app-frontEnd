import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../Components/Admin/Admin.css";

// Reuses the existing, already-secured /api/maharashtra-cards endpoints
// (Controllers/MaharashtraController.js, protect+admin) rather than duplicating
// that CRUD logic under /api/admin — see Routes/Admin/index.js for the note.
const api = axios.create({ baseURL: "http://localhost:5000/api", withCredentials: true });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const CATEGORIES = ["essential", "traveller", "family", "hidden", "outdoors", "arts", "nightlife", "museums"];
const emptyForm = { title: "", description: "", category: "essential", location: "" };

const DomesticContent = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/maharashtra-cards");
      setCards(Array.isArray(data) ? data : data.cards || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load Maharashtra content. (This admin panel expects the existing /api/maharashtra-cards endpoints.)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setImageFile(null); setEditingId(null); setModalOpen(true); };
  const openEdit = (c) => {
    setForm({ title: c.title || "", description: c.description || "", category: c.category || "essential", location: c.location || "" });
    setImageFile(null); setEditingId(c._id); setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      if (editingId) await api.put(`/maharashtra-cards/${editingId}`, fd);
      else await api.post("/maharashtra-cards", fd);
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed.");
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete "${c.title}"?`)) return;
    await api.delete(`/maharashtra-cards/${c._id}`);
    load();
  };

  return (
    <div>
      <div className="admin-toolbar" style={{ justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Domestic / State Content — Maharashtra</h2>
        <button className="admin-btn" onClick={openCreate}>+ New Card</button>
      </div>
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Location</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={4} style={{ textAlign: "center" }}>Loading…</td></tr>}
            {!loading && cards.map((c) => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td><span className="admin-badge badge-contacted">{c.category}</span></td>
                <td>{c.location}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="admin-btn secondary" onClick={() => openEdit(c)}>Edit</button>
                  <button className="admin-btn danger" onClick={() => remove(c)}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && cards.length === 0 && !error && (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "#888" }}>No content cards yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Card" : "New Card"}</h3>
            <form onSubmit={handleSave}>
              <div className="admin-form-row"><label>Title</label><input className="admin-input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="admin-form-row"><label>Category</label>
                <select className="admin-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="admin-form-row"><label>Location</label><input className="admin-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div className="admin-form-row"><label>Description</label><textarea className="admin-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="admin-form-row"><label>Image</label><input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="admin-btn" type="submit">Save</button>
                <button className="admin-btn secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomesticContent;
