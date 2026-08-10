import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { adminApi.get("/settings").then((r) => setSettings(r.data.settings)); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await adminApi.put("/settings", settings);
      setSettings(data.settings);
      alert("Settings saved.");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="admin-loading">Loading settings…</div>;

  return (
    <div>
      <h2>Site Settings</h2>
      <form onSubmit={save} className="admin-card" style={{ maxWidth: 560 }}>
        <div className="admin-form-row"><label>Site Name</label><input className="admin-input" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} /></div>
        <div className="admin-form-row"><label>Contact Email</label><input className="admin-input" value={settings.contactEmail || ""} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} /></div>
        <div className="admin-form-row"><label>Contact Phone</label><input className="admin-input" value={settings.contactPhone || ""} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} /></div>
        <div className="admin-form-row"><label>Address</label><input className="admin-input" value={settings.address || ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} /></div>
        <div className="admin-form-row"><label>GST %</label><input className="admin-input" type="number" value={settings.gstPercent} onChange={(e) => setSettings({ ...settings, gstPercent: Number(e.target.value) })} /></div>
        <div className="admin-form-row"><label>Facebook</label><input className="admin-input" value={settings.socialLinks?.facebook || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })} /></div>
        <div className="admin-form-row"><label>Instagram</label><input className="admin-input" value={settings.socialLinks?.instagram || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })} /></div>
        <div className="admin-form-row"><label>Cancellation Policy</label><textarea className="admin-input" rows={4} value={settings.cancellationPolicy || ""} onChange={(e) => setSettings({ ...settings, cancellationPolicy: e.target.value })} /></div>
        <div className="admin-form-row">
          <label><input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} /> Maintenance Mode</label>
        </div>
        <button className="admin-btn" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Settings"}</button>
      </form>
    </div>
  );
};

export default Settings;
