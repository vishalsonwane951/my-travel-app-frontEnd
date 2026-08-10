import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [modules, setModules] = useState([]);
  const [moduleFilter, setModuleFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [l, m] = await Promise.all([
        adminApi.get("/audit-log", { params: { module: moduleFilter } }),
        adminApi.get("/audit-log/modules"),
      ]);
      setLogs(l.data.logs);
      setModules(m.data.modules);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [moduleFilter]);

  return (
    <div>
      <h2>Audit Log</h2>
      <div className="admin-toolbar">
        <select className="admin-select" value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
          <option value="">All modules</option>
          {modules.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>When</th><th>Actor</th><th>Role</th><th>Action</th><th>Module</th><th>Target</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={{ textAlign: "center" }}>Loading…</td></tr>}
            {!loading && logs.map((l) => (
              <tr key={l._id}>
                <td>{new Date(l.createdAt).toLocaleString("en-IN")}</td>
                <td>{l.actorName}</td>
                <td><span className="admin-badge badge-contacted">{l.actorRole}</span></td>
                <td>{l.action}</td>
                <td>{l.module}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{l.targetId || "—"}</td>
              </tr>
            ))}
            {!loading && logs.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#888" }}>No audit entries yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;
