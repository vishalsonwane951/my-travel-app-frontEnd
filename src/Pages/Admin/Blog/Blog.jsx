import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const emptyForm = { title: "", excerpt: "", content: "", tags: "", metaTitle: "", metaDescription: "", status: "draft" };

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const load = async () => { setLoading(true); try { setPosts((await adminApi.get("/blog")).data.posts); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setCoverFile(null); setEditingId(null); setModalOpen(true); };
  const openEdit = (p) => {
    setForm({ title: p.title, excerpt: p.excerpt || "", content: p.content, tags: (p.tags || []).join("; "), metaTitle: p.metaTitle || "", metaDescription: p.metaDescription || "", status: p.status });
    setCoverFile(null); setEditingId(p._id); setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (coverFile) fd.append("coverImage", coverFile);
    if (editingId) await adminApi.put(`/blog/${editingId}`, fd);
    else await adminApi.post("/blog", fd);
    setModalOpen(false);
    load();
  };

  const remove = async (p) => { if (!window.confirm(`Delete "${p.title}"?`)) return; await adminApi.delete(`/blog/${p._id}`); load(); };

  return (
    <div>
      <div className="admin-toolbar" style={{ justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Content / Blog / SEO</h2>
        <button className="admin-btn" onClick={openCreate}>+ New Post</button>
      </div>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Status</th><th>Author</th><th>Published</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={{ textAlign: "center" }}>Loading…</td></tr>}
            {!loading && posts.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td><span className={`admin-badge ${p.status === "published" ? "badge-confirmed" : "badge-pending"}`}>{p.status}</span></td>
                <td>{p.author?.name || "—"}</td>
                <td>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-IN") : "—"}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="admin-btn secondary" onClick={() => openEdit(p)}>Edit</button>
                  <button className="admin-btn danger" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && posts.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#888" }}>No posts yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" style={{ width: 620 }} onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Post" : "New Post"}</h3>
            <form onSubmit={handleSave}>
              <div className="admin-form-row"><label>Title</label><input className="admin-input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="admin-form-row"><label>Excerpt</label><input className="admin-input" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
              <div className="admin-form-row"><label>Content (HTML/Markdown)</label><textarea className="admin-input" rows={8} required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
              <div className="admin-form-row"><label>Tags (semicolon separated)</label><input className="admin-input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
              <div className="admin-form-row"><label>Meta Title (SEO)</label><input className="admin-input" maxLength={70} value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} /></div>
              <div className="admin-form-row"><label>Meta Description (SEO)</label><textarea className="admin-input" rows={2} maxLength={160} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} /></div>
              <div className="admin-form-row"><label>Cover Image</label><input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} /></div>
              <div className="admin-form-row"><label>Status</label>
                <select className="admin-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="draft">Draft</option><option value="published">Published</option>
                </select>
              </div>
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

export default Blog;
