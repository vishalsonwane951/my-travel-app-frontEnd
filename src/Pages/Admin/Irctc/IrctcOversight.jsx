import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const IrctcOversight = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [l, s] = await Promise.all([adminApi.get("/irctc/logs"), adminApi.get("/irctc/stats")]);
      setLogs(l.data.logs);
      setStats(s.data.stats);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="admin-loading">Loading…</div>;

  return (
    <div>
      <h2>Train / IRCTC Oversight</h2>
      <div className="admin-grid admin-kpi-grid">
        <div className="admin-kpi-card"><div className="admin-kpi-label">Total Searches</div><div className="admin-kpi-value">{stats.totalSearches}</div></div>
        <div className="admin-kpi-card"><div className="admin-kpi-label">Failed Searches</div><div className="admin-kpi-value">{stats.failedSearches}</div></div>
        <div className="admin-kpi-card"><div className="admin-kpi-label">Success Rate</div><div className="admin-kpi-value">{stats.successRate}%</div></div>
      </div>

      <div className="admin-card" style={{ marginBottom: 18 }}>
        <h3>Top Routes Searched</h3>
        {stats.topRoutes.length === 0 && <p style={{ color: "#888" }}>No searches logged yet.</p>}
        {stats.topRoutes.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f1f1" }}>
            <span>{r.from} → {r.to}</span><strong>{r.count}</strong>
          </div>
        ))}
      </div>

      <div className="admin-card admin-table-wrap">
        <h3>Recent Search Log</h3>
        <table className="admin-table">
          <thead><tr><th>From</th><th>To</th><th>Window (hrs)</th><th>Result</th><th>User</th><th>When</th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id}>
                <td>{l.fromStationCode}</td><td>{l.toStationCode}</td><td>{l.hours}</td>
                <td><span className={`admin-badge ${l.success ? "badge-success" : "badge-failed"}`}>{l.success ? "success" : "failed"}</span></td>
                <td>{l.user?.name || "Guest"}</td>
                <td>{new Date(l.createdAt).toLocaleString("en-IN")}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#888" }}>No searches logged yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IrctcOversight;
