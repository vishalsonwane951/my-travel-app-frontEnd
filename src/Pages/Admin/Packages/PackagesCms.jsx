import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const emptyForm = {
  title: "", location: "", type: "domestic", destination: "",
  price: "", strikePrice: "", description: "", highlights: "", durations: "",
  inclusions: "", exclusions: "", lat: "", long: "",
};

const PackagesCms = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [itineraryEditor, setItineraryEditor] = useState(null); // package being edited
  const [itinerary, setItinerary] = useState([]);
  const [csvText, setCsvText] = useState("");
  const [csvOpen, setCsvOpen] = useState(false);
  const [galleryEditor, setGalleryEditor] = useState(null); // package being edited
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/packages", { params: { search } });
      setPackages(data.packages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const openCreate = () => { setForm(emptyForm); setImageFile(null); setEditingId(null); setModalOpen(true); };
  const openEdit = (p) => {
    setForm({
      title: p.title, location: p.location || "", type: p.type || "domestic", destination: p.destination || "",
      price: p.price || "", strikePrice: p.strikePrice || "", description: p.description || "",
      highlights: (p.highlights || []).join("; "), durations: (p.durations || []).join("; "),
      inclusions: (p.inclExcl?.inclusions || []).join("; "),
      exclusions: (p.inclExcl?.exclusions || []).join("; "),
      lat: p.lat ?? "", long: p.long ?? "",
    });
    setImageFile(null);
    setEditingId(p._id);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("images", imageFile);

      if (editingId) await adminApi.put(`/packages/${editingId}`, fd);
      else await adminApi.post("/packages", fd);

      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    await adminApi.delete(`/packages/${p._id}`);
    load();
  };

  const toggle = async (p, field) => {
    await adminApi.put(`/packages/${p._id}/toggle-${field}`);
    load();
  };

  const openItinerary = (p) => {
    setItineraryEditor(p);
    setItinerary(p.itinerary?.length ? p.itinerary : [{ day: 1, title: "", description: "", meals: "" }]);
  };

  const saveItinerary = async () => {
    await adminApi.put(`/packages/${itineraryEditor._id}/itinerary`, { itinerary });
    setItineraryEditor(null);
    load();
  };

  const openGallery = (p) => {
    setGalleryEditor(p);
    setGalleryFiles([]);
  };

  const uploadGalleryImages = async () => {
    if (!galleryFiles.length) return;
    setGalleryUploading(true);
    try {
      const fd = new FormData();
      galleryFiles.forEach((f) => fd.append("gallery", f));
      const { data } = await adminApi.post(`/packages/${galleryEditor._id}/gallery`, fd);
      setGalleryEditor({ ...galleryEditor, gallery: data.gallery });
      setGalleryFiles([]);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Gallery upload failed.");
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryImage = async (publicId) => {
    if (!window.confirm("Remove this gallery image?")) return;
    const { data } = await adminApi.delete(`/packages/${galleryEditor._id}/gallery`, { data: { publicId } });
    setGalleryEditor({ ...galleryEditor, gallery: data.gallery });
    load();
  };

  const submitCsv = async () => {
    try {
      const { data } = await adminApi.post("/packages/bulk-import", { csv: csvText });
      alert(data.message);
      setCsvOpen(false);
      setCsvText("");
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Import failed.");
    }
  };

  return (
    <div>
      <div className="admin-toolbar" style={{ justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Packages & Destinations</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="admin-btn secondary" onClick={() => setCsvOpen(true)}>Bulk CSV Import</button>
          <button className="admin-btn" onClick={openCreate}>+ New Package</button>
        </div>
      </div>

      <form className="admin-toolbar" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <input className="admin-input" placeholder="Search by title…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="admin-btn secondary" type="submit">Search</button>
      </form>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Type</th><th>Destination</th><th>Price</th><th>Active</th><th>Featured</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} style={{ textAlign: "center" }}>Loading…</td></tr>}
            {!loading && packages.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.type}</td>
                <td>{p.destination}</td>
                <td>₹{p.price?.toLocaleString("en-IN")}</td>
                <td>
                  <button className={`admin-badge ${p.active ? "badge-confirmed" : "badge-rejected"}`} style={{ border: "none", cursor: "pointer" }} onClick={() => toggle(p, "active")}>
                    {p.active ? "active" : "inactive"}
                  </button>
                </td>
                <td>
                  <button className={`admin-badge ${p.featured ? "badge-confirmed" : "badge-pending"}`} style={{ border: "none", cursor: "pointer" }} onClick={() => toggle(p, "featured")}>
                    {p.featured ? "yes" : "no"}
                  </button>
                </td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="admin-btn secondary" onClick={() => openEdit(p)}>Edit</button>
                  <button className="admin-btn secondary" onClick={() => openItinerary(p)}>Itinerary</button>
                  <button className="admin-btn secondary" onClick={() => openGallery(p)}>Gallery</button>
                  <button className="admin-btn danger" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && packages.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "#888" }}>No packages found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Package" : "New Package"}</h3>
            <form onSubmit={handleSave}>
              <div className="admin-form-row"><label>Title</label><input className="admin-input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="admin-form-row"><label>Location</label><input className="admin-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div className="admin-form-row"><label>Type</label>
                <select className="admin-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="domestic">domestic</option><option value="international">international</option>
                </select>
              </div>
              <div className="admin-form-row"><label>Destination</label><input className="admin-input" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} /></div>
              <div className="admin-form-row"><label>Price (₹)</label><input className="admin-input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              <div className="admin-form-row"><label>Strike Price (₹, optional)</label><input className="admin-input" type="number" value={form.strikePrice} onChange={(e) => setForm({ ...form, strikePrice: e.target.value })} /></div>
              <div className="admin-form-row"><label>Durations (semicolon separated, e.g. "4N/5D; 6N/7D")</label><input className="admin-input" value={form.durations} onChange={(e) => setForm({ ...form, durations: e.target.value })} /></div>
              <div className="admin-form-row"><label>Highlights (semicolon separated)</label><input className="admin-input" value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} /></div>
              <div className="admin-form-row"><label>Included (semicolon separated, e.g. "Breakfast; Airport Transfer; Sightseeing")</label><textarea className="admin-input" rows={2} value={form.inclusions} onChange={(e) => setForm({ ...form, inclusions: e.target.value })} /></div>
              <div className="admin-form-row"><label>Not Included (semicolon separated, e.g. "Flights; Personal Expenses")</label><textarea className="admin-input" rows={2} value={form.exclusions} onChange={(e) => setForm({ ...form, exclusions: e.target.value })} /></div>
              <div style={{ display: "flex", gap: 10 }}>
                <div className="admin-form-row" style={{ flex: 1 }}><label>Latitude</label><input className="admin-input" type="number" step="any" placeholder="e.g. 15.2993" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} /></div>
                <div className="admin-form-row" style={{ flex: 1 }}><label>Longitude</label><input className="admin-input" type="number" step="any" placeholder="e.g. 74.1240" value={form.long} onChange={(e) => setForm({ ...form, long: e.target.value })} /></div>
              </div>
              <div className="admin-form-row"><label>Description</label><textarea className="admin-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="admin-form-row"><label>Cover Image</label><input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="admin-btn" type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
                <button className="admin-btn secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {itineraryEditor && (
        <div className="admin-modal-backdrop" onClick={() => setItineraryEditor(null)}>
          <div className="admin-modal" style={{ width: 560 }} onClick={(e) => e.stopPropagation()}>
            <h3>Itinerary — {itineraryEditor.title}</h3>
            {itinerary.map((day, i) => (
              <div key={i} className="admin-card" style={{ marginBottom: 10 }}>
                <div className="admin-form-row"><label>Day</label><input className="admin-input" type="number" value={day.day} onChange={(e) => { const copy = [...itinerary]; copy[i].day = Number(e.target.value); setItinerary(copy); }} /></div>
                <div className="admin-form-row"><label>Title</label><input className="admin-input" value={day.title} onChange={(e) => { const copy = [...itinerary]; copy[i].title = e.target.value; setItinerary(copy); }} /></div>
                <div className="admin-form-row"><label>Description</label><textarea className="admin-input" rows={2} value={day.description} onChange={(e) => { const copy = [...itinerary]; copy[i].description = e.target.value; setItinerary(copy); }} /></div>
                <div className="admin-form-row"><label>Meals</label><input className="admin-input" value={day.meals} onChange={(e) => { const copy = [...itinerary]; copy[i].meals = e.target.value; setItinerary(copy); }} /></div>
                <button className="admin-btn danger" type="button" onClick={() => setItinerary(itinerary.filter((_, idx) => idx !== i))}>Remove Day</button>
              </div>
            ))}
            <button className="admin-btn secondary" type="button" onClick={() => setItinerary([...itinerary, { day: itinerary.length + 1, title: "", description: "", meals: "" }])}>+ Add Day</button>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="admin-btn" onClick={saveItinerary}>Save Itinerary</button>
              <button className="admin-btn secondary" onClick={() => setItineraryEditor(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {galleryEditor && (
        <div className="admin-modal-backdrop" onClick={() => setGalleryEditor(null)}>
          <div className="admin-modal" style={{ width: 600 }} onClick={(e) => e.stopPropagation()}>
            <h3>Gallery — {galleryEditor.title}</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10, marginBottom: 16 }}>
              {(galleryEditor.gallery || []).map((img) => (
                <div key={img.publicId} style={{ position: "relative" }}>
                  <img src={img.img} alt={img.caption} style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 6 }} />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(img.publicId)}
                    title="Remove"
                    style={{ position: "absolute", top: 4, right: 4, background: "#ff4d4f", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", lineHeight: 1 }}
                  >×</button>
                </div>
              ))}
              {(!galleryEditor.gallery || galleryEditor.gallery.length === 0) && (
                <p style={{ color: "#888", gridColumn: "1 / -1" }}>No gallery images yet.</p>
              )}
            </div>

            <div className="admin-form-row">
              <label>Add Images (up to 10 at a time)</label>
              <input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles([...e.target.files])} />
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="admin-btn" onClick={uploadGalleryImages} disabled={!galleryFiles.length || galleryUploading}>
                {galleryUploading ? "Uploading…" : `Upload ${galleryFiles.length || ""} Image(s)`}
              </button>
              <button className="admin-btn secondary" onClick={() => setGalleryEditor(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {csvOpen && (
        <div className="admin-modal-backdrop" onClick={() => setCsvOpen(false)}>
          <div className="admin-modal" style={{ width: 560 }} onClick={(e) => e.stopPropagation()}>
            <h3>Bulk Import Packages (CSV)</h3>
            <p style={{ fontSize: 12.5, color: "#888" }}>
              Columns: title, location, type, destination, price, strikePrice, durations (semicolon-separated), description, highlights (semicolon-separated). First row must be the header.
            </p>
            <textarea className="admin-input" rows={10} style={{ width: "100%", fontFamily: "monospace" }} value={csvText} onChange={(e) => setCsvText(e.target.value)} placeholder={"title,location,type,destination,price\nGoa Beach Getaway,Goa,domestic,Goa,12999"} />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="admin-btn" onClick={submitCsv}>Import</button>
              <button className="admin-btn secondary" onClick={() => setCsvOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesCms;
