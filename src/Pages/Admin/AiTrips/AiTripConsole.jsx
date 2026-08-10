import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const AiTripConsole = () => {
  const [itineraries, setItineraries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      const [l, s] = await Promise.all([adminApi.get("/ai-trips"), adminApi.get("/ai-trips/stats")]);
      setItineraries(l.data.itineraries);
      setStats(s.data.stats);
      setLoading(false);
    })();
  }, []);

  const view = async (it) => { const { data } = await adminApi.get(`/ai-trips/${it._id}`); setSelected(data.itinerary); };
  const remove = async (it) => {
    if (!window.confirm("Delete this generated itinerary?")) return;
    await adminApi.delete(`/ai-trips/${it._id}`);
    setItineraries(itineraries.filter((x) => x._id !== it._id));
  };

  if (loading) return <div className="admin-loading">Loading…</div>;

  return (
    <div>
      <h2>AI Trip Planner Console</h2>
      <div className="admin-grid admin-kpi-grid">
        <div className="admin-kpi-card"><div className="admin-kpi-label">Total Itineraries Generated</div><div className="admin-kpi-value">{stats.totalGenerated}</div></div>
      </div>

      <div className="admin-card" style={{ marginBottom: 18 }}>
        <h3>Top Destinations Requested</h3>
        {stats.topDestinations.map((d, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f1f1" }}>
            <span>{d.destination}</span><strong>{d.count}</strong>
          </div>
        ))}
        {stats.topDestinations.length === 0 && <p style={{ color: "#888" }}>No itineraries generated yet.</p>}
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Destination</th><th>Nights</th><th>Travelers</th><th>Trip Type</th><th>Est. Cost</th><th>Generated</th><th></th></tr></thead>
          <tbody>
            {itineraries.map((it) => (
              <tr key={it._id}>
                <td>{it.destination}</td><td>{it.nights}</td><td>{it.travelers}</td><td>{it.tripType || "—"}</td>
                <td>{it.totalCostEstimate ? `₹${it.totalCostEstimate.toLocaleString("en-IN")}` : "—"}</td>
                <td>{new Date(it.createdAt).toLocaleDateString("en-IN")}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="admin-btn secondary" onClick={() => view(it)}>View</button>
                  <button className="admin-btn danger" onClick={() => remove(it)}>Delete</button>
                </td>
              </tr>
            ))}
            {itineraries.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "#888" }}>No itineraries generated yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="admin-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="admin-modal" style={{ width: 640 }} onClick={(e) => e.stopPropagation()}>
            <h3>{selected.destination} — {selected.nights} nights</h3>
            <pre style={{ background: "#f7f8fb", padding: 14, borderRadius: 8, maxHeight: 400, overflow: "auto", fontSize: 12 }}>
              {JSON.stringify(selected, null, 2)}
            </pre>
            <button className="admin-btn secondary" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiTripConsole;
