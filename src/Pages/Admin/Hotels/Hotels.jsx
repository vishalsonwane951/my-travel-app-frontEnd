import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const emptyForm = { name: "", destination: "", address: "", starRating: 3, description: "" };
const emptyRoomType = { name: "", pricePerNight: "", capacity: 2, totalRooms: 1, amenities: "" };

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [roomEditor, setRoomEditor] = useState(null); // hotel being edited
  const [roomTypes, setRoomTypes] = useState([]);

  const load = async () => {
    setLoading(true);
    try { setHotels((await adminApi.get("/hotels")).data.hotels); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setImageFiles([]); setEditingId(null); setModalOpen(true); };
  const openEdit = (h) => {
    setForm({ name: h.name, destination: h.destination, address: h.address || "", starRating: h.starRating, description: h.description || "" });
    setImageFiles([]); setEditingId(h._id); setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    imageFiles.forEach((f) => fd.append("images", f));
    if (editingId) await adminApi.put(`/hotels/${editingId}`, fd);
    else await adminApi.post("/hotels", fd);
    setModalOpen(false);
    load();
  };

  const remove = async (h) => {
    if (!window.confirm(`Delete "${h.name}"?`)) return;
    await adminApi.delete(`/hotels/${h._id}`);
    load();
  };

  const toggle = async (h) => { await adminApi.put(`/hotels/${h._id}/toggle-active`); load(); };

  const openRoomTypes = (h) => {
    setRoomEditor(h);
    setRoomTypes(
      h.roomTypes?.length
        ? h.roomTypes.map((rt) => ({ ...rt, amenities: (rt.amenities || []).join("; ") }))
        : [emptyRoomType]
    );
  };

  const saveRoomTypes = async () => {
    const cleaned = roomTypes
      .filter((rt) => rt.name && rt.pricePerNight)
      .map((rt) => ({
        name: rt.name,
        pricePerNight: Number(rt.pricePerNight),
        capacity: Number(rt.capacity) || 2,
        totalRooms: Number(rt.totalRooms) || 1,
        amenities: typeof rt.amenities === "string"
          ? rt.amenities.split(";").map((s) => s.trim()).filter(Boolean)
          : rt.amenities || [],
      }));
    await adminApi.put(`/hotels/${roomEditor._id}`, { roomTypes: cleaned });
    setRoomEditor(null);
    load();
  };

  const updateRoomType = (i, field, value) => {
    const copy = [...roomTypes];
    copy[i] = { ...copy[i], [field]: value };
    setRoomTypes(copy);
  };

  return (
    <div>
      <div className="admin-toolbar" style={{ justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Hotel Inventory</h2>
        <button className="admin-btn" onClick={openCreate}>+ Add Hotel</button>
      </div>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Destination</th><th>Rating</th><th>Room Types</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={{ textAlign: "center" }}>Loading…</td></tr>}
            {!loading && hotels.map((h) => (
              <tr key={h._id}>
                <td>{h.name}</td><td>{h.destination}</td><td>{h.starRating}★</td><td>{h.roomTypes?.length || 0}</td>
                <td><button className={`admin-badge ${h.active ? "badge-confirmed" : "badge-rejected"}`} style={{ border: "none", cursor: "pointer" }} onClick={() => toggle(h)}>{h.active ? "active" : "inactive"}</button></td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="admin-btn secondary" onClick={() => openEdit(h)}>Edit</button>
                  <button className="admin-btn secondary" onClick={() => openRoomTypes(h)}>Room Types</button>
                  <button className="admin-btn danger" onClick={() => remove(h)}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && hotels.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#888" }}>No hotels yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Hotel" : "Add Hotel"}</h3>
            <form onSubmit={handleSave}>
              <div className="admin-form-row"><label>Name</label><input className="admin-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="admin-form-row"><label>Destination</label><input className="admin-input" required value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} /></div>
              <div className="admin-form-row"><label>Address</label><input className="admin-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div className="admin-form-row"><label>Star Rating</label><input className="admin-input" type="number" min={1} max={5} value={form.starRating} onChange={(e) => setForm({ ...form, starRating: e.target.value })} /></div>
              <div className="admin-form-row"><label>Description</label><textarea className="admin-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="admin-form-row"><label>Images</label><input type="file" accept="image/*" multiple onChange={(e) => setImageFiles([...e.target.files])} /></div>
              {!editingId && <p style={{ fontSize: 12, color: "#888" }}>You can add room types once the hotel is created — use the "Room Types" button on the list.</p>}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="admin-btn" type="submit">Save</button>
                <button className="admin-btn secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {roomEditor && (
        <div className="admin-modal-backdrop" onClick={() => setRoomEditor(null)}>
          <div className="admin-modal" style={{ width: 620 }} onClick={(e) => e.stopPropagation()}>
            <h3>Room Types — {roomEditor.name}</h3>
            {roomTypes.map((rt, i) => (
              <div key={i} className="admin-card" style={{ marginBottom: 10 }}>
                <div className="admin-form-row"><label>Room Name</label><input className="admin-input" placeholder="e.g. Deluxe Room" value={rt.name} onChange={(e) => updateRoomType(i, "name", e.target.value)} /></div>
                <div className="admin-form-row"><label>Price / Night (₹)</label><input className="admin-input" type="number" min={0} value={rt.pricePerNight} onChange={(e) => updateRoomType(i, "pricePerNight", e.target.value)} /></div>
                <div className="admin-form-row"><label>Capacity (guests)</label><input className="admin-input" type="number" min={1} value={rt.capacity} onChange={(e) => updateRoomType(i, "capacity", e.target.value)} /></div>
                <div className="admin-form-row"><label>Total Rooms Available</label><input className="admin-input" type="number" min={0} value={rt.totalRooms} onChange={(e) => updateRoomType(i, "totalRooms", e.target.value)} /></div>
                <div className="admin-form-row"><label>Amenities (semicolon separated)</label><input className="admin-input" placeholder="AC; Sea View; Breakfast included" value={rt.amenities} onChange={(e) => updateRoomType(i, "amenities", e.target.value)} /></div>
                <button className="admin-btn danger" type="button" onClick={() => setRoomTypes(roomTypes.filter((_, idx) => idx !== i))}>Remove Room Type</button>
              </div>
            ))}
            <button className="admin-btn secondary" type="button" onClick={() => setRoomTypes([...roomTypes, { ...emptyRoomType }])}>+ Add Room Type</button>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="admin-btn" onClick={saveRoomTypes}>Save Room Types</button>
              <button className="admin-btn secondary" onClick={() => setRoomEditor(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotels;
