import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const ROLES = ["superadmin", "operations", "sales", "finance", "content", "support"];

const emptyForm = { name: "", email: "", password: "", role: "support" };

const Team = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/team");
      setStaff(data.staff);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load team.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (s) => { setForm({ name: s.name, email: s.email, password: "", role: s.role }); setEditingId(s._id); setModalOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminApi.put(`/team/${editingId}`, { name: form.name, role: form.role });
      } else {
        await adminApi.post("/team", form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (s) => {
    if (s.active) {
      if (!window.confirm(`Revoke session access for ${s.name}? They will be logged out immediately.`)) return;
      await adminApi.put(`/team/${s._id}/session`);
    } else {
      await adminApi.put(`/team/${s._id}`, { active: true });
    }
    load();
  };

  const removeStaff = async (s) => {
    if (!window.confirm(`Remove admin access for ${s.name}? Their account will become a normal customer account.`)) return;
    await adminApi.delete(`/team/${s._id}`);
    load();
  };

  if (loading) return <div className="admin-loading">Loading team…</div>;

  return (
    <div>
      <div className="admin-toolbar" style={{ justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Roles & Team Management</h2>
        <button className="admin-btn" onClick={openCreate}>+ Add Staff Member</button>
      </div>
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td><span className="admin-badge badge-contacted">{s.role}</span></td>
                <td>
                  <span className={`admin-badge ${s.active !== false ? "badge-confirmed" : "badge-rejected"}`}>
                    {s.active !== false ? "active" : "revoked"}
                  </span>
                </td>
                <td>{new Date(s.createdAt).toLocaleDateString("en-IN")}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="admin-btn secondary" onClick={() => openEdit(s)}>Edit</button>
                  <button className="admin-btn secondary" onClick={() => toggleActive(s)}>
                    {s.active !== false ? "Revoke" : "Reactivate"}
                  </button>
                  <button className="admin-btn danger" onClick={() => removeStaff(s)}>Remove</button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "#888" }}>No staff accounts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Staff Member" : "Add Staff Member"}</h3>
            <form onSubmit={handleSave}>
              <div className="admin-form-row">
                <label>Name</label>
                <input className="admin-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="admin-form-row">
                <label>Email</label>
                <input className="admin-input" type="email" required disabled={!!editingId} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              {!editingId && (
                <div className="admin-form-row">
                  <label>Temporary Password</label>
                  <input className="admin-input" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
              )}
              <div className="admin-form-row">
                <label>Role</label>
                <select className="admin-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="admin-btn" type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
                <button className="admin-btn secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
